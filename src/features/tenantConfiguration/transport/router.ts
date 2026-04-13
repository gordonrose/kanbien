import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { getRequiredTenantSessionContext } from "../../../lib/auth/requestContext";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import { createRequireRootCapability, type RootCapabilityChecker } from "../../../lib/authz/middleware";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../../tenantAuth/persistence/repository";
import { InvalidRequestError, TenantConfigurationError } from "../contract/errors";
import { tenantIdParamsSchema, updateTenantAuthPolicyBodySchema } from "../contract/schemas";
import type { TenantConfigurationService } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidRequestError(undefined, {
          field: issue.keys[0],
          reason: "unexpected_field",
        });
      }
      throw new InvalidRequestError(
        undefined,
        issue ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message } : undefined,
      );
    }
    throw error;
  }
}

export function createRootTenantConfigurationRouter(
  service: TenantConfigurationService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const authzOptions = { platformSecurityRepository };
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "tenant-auth-policy.read",
    authzOptions,
  );
  const requireUpdate = createRequireRootCapability(
    capabilityChecker,
    "tenant-auth-policy.update",
    authzOptions,
  );

  router.get("/", requireRead, async (request, response, next) => {
    try {
      response
        .status(200)
        .json(await service.readTenantAuthPolicyAsRoot(parseOrThrow(tenantIdParamsSchema, request.params)));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/", requireUpdate, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const params = parseOrThrow(tenantIdParamsSchema, request.params);
      const body = parseOrThrow(updateTenantAuthPolicyBodySchema, request.body);
      response.status(200).json(
        await service.updateTenantAuthPolicy({
          ...params,
          ...body,
          authPrincipalId: session.authPrincipalId,
          rootUserId: session.rootUserId,
          ipAddress: request.ip,
          userAgent: request.header("user-agent") ?? undefined,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof TenantConfigurationError) {
      response.status(error.status).json({
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
      return;
    }
    next(error);
  });

  return router;
}

export function createTenantConfigurationTenantRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: TenantConfigurationService,
): Router {
  const router = Router();
  const requireTenantSession = createRequireTenantSession(sessionLookupRepository);

  router.get("/", requireTenantSession, async (request, response, next) => {
    try {
      const session = getRequiredTenantSessionContext(request);
      response.status(200).json(
        await service.readCurrentTenantAuthPolicyAsTenantAdmin({
          tenantId: session.activeTenantId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof TenantConfigurationError) {
      response.status(error.status).json({
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
      return;
    }
    next(error);
  });

  return router;
}
