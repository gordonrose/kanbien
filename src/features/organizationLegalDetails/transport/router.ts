import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import {
  getRequiredRootSessionContext,
  getRequiredTenantSessionContext,
} from "../../../lib/auth/requestContext";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../../tenantAuth";
import { InvalidLegalProfileRequestError, OrganizationLegalProfileError } from "../contract/errors";
import {
  createLegalProfileBodySchema,
  listLegalProfilesQuerySchema,
  organizationLegalProfileParamsSchema,
  organizationParamsSchema,
  tenantOrganizationLegalProfileParamsSchema,
  tenantOrganizationParamsSchema,
  updateLegalProfileBodySchema,
} from "../contract/schemas";
import type { OrganizationLegalDetailsService } from "../domain/service";
import type { LegalProfileActorInput } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidLegalProfileRequestError(undefined, {
          field: issue.keys[0],
          reason: "unexpected_field",
        });
      }
      throw new InvalidLegalProfileRequestError(
        undefined,
        issue ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message } : undefined,
      );
    }
    throw error;
  }
}

function handleLegalProfileErrors(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof OrganizationLegalProfileError) {
    response.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }
  next(error);
}

function listInput(
  query: ReturnType<typeof listLegalProfilesQuerySchema.parse>,
  tenantId: string,
  organizationId: string,
) {
  return {
    tenantId,
    organizationId,
    page: query.page,
    pageSize: query.pageSize,
    orderBy: query.orderBy,
    orderDirection: query.orderDirection,
    includeArchived: query.includeArchived,
    lifecycleStatus: query.lifecycleStatus,
  };
}

export function createRootOrganizationLegalDetailsRouter(
  service: OrganizationLegalDetailsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const authzOptions = { platformSecurityRepository };
  const requireManage = createRequireRootCapability(
    capabilityChecker,
    "organization.legal-profile.manage",
    authzOptions,
  );
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "organization.legal-profile.read",
    authzOptions,
  );

  function actor(request: Request): LegalProfileActorInput {
    const session = getRequiredRootSessionContext(request);
    return { actorType: "root-user", actorId: session.rootUserId };
  }

  router.post("/:organizationId/legal-profiles", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema, request.params);
      const body = parseOrThrow(createLegalProfileBodySchema, request.body);
      response.status(201).json(await service.createLegalProfile({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/legal-profiles", requireRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema, request.params);
      const query = parseOrThrow(listLegalProfilesQuerySchema, request.query);
      response.status(200).json(await service.listLegalProfiles(listInput(query, params.tenantId, params.organizationId)));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/legal-profiles/:legalProfileId", requireRead, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getLegalProfile(parseOrThrow(tenantOrganizationLegalProfileParamsSchema, request.params)),
      );
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId/legal-profiles/:legalProfileId", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationLegalProfileParamsSchema, request.params);
      const body = parseOrThrow(updateLegalProfileBodySchema, request.body);
      response.status(200).json(await service.updateLegalProfile({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/legal-profiles/:legalProfileId/archive", requireManage, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.archiveLegalProfile({
          ...parseOrThrow(tenantOrganizationLegalProfileParamsSchema, request.params),
          ...actor(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/legal-profiles/:legalProfileId/restore", requireManage, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.restoreLegalProfile({
          ...parseOrThrow(tenantOrganizationLegalProfileParamsSchema, request.params),
          ...actor(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/legal-profiles/:legalProfileId/delete", requireManage, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.softDeleteLegalProfile({
          ...parseOrThrow(tenantOrganizationLegalProfileParamsSchema, request.params),
          ...actor(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use(handleLegalProfileErrors);
  return router;
}

export function createTenantOrganizationLegalDetailsRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationLegalDetailsService,
): Router {
  const router = Router();
  const requireTenantSession = createRequireTenantSession(sessionLookupRepository);
  router.use(requireTenantSession);

  function tenantContext(request: Request): { tenantId: string } & LegalProfileActorInput {
    const session = getRequiredTenantSessionContext(request);
    if (!session.activeTenantId) {
      throw new InvalidLegalProfileRequestError("A current tenant selection is required.", {
        reason: "current_tenant_required",
      });
    }
    return {
      tenantId: session.activeTenantId,
      actorType: "tenant-admin",
      actorId: session.authPrincipalId,
    };
  }

  router.post("/:organizationId/legal-profiles", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationParamsSchema, request.params);
      const body = parseOrThrow(createLegalProfileBodySchema, request.body);
      response.status(201).json(await service.createLegalProfile({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/legal-profiles", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationParamsSchema, request.params);
      const query = parseOrThrow(listLegalProfilesQuerySchema, request.query);
      response.status(200).json(await service.listLegalProfiles(listInput(query, context.tenantId, params.organizationId)));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/legal-profiles/:legalProfileId", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLegalProfileParamsSchema, request.params);
      response.status(200).json(await service.getLegalProfile({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId/legal-profiles/:legalProfileId", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLegalProfileParamsSchema, request.params);
      const body = parseOrThrow(updateLegalProfileBodySchema, request.body);
      response.status(200).json(await service.updateLegalProfile({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/legal-profiles/:legalProfileId/archive", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLegalProfileParamsSchema, request.params);
      response.status(200).json(await service.archiveLegalProfile({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/legal-profiles/:legalProfileId/restore", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLegalProfileParamsSchema, request.params);
      response.status(200).json(await service.restoreLegalProfile({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/legal-profiles/:legalProfileId/delete", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLegalProfileParamsSchema, request.params);
      response.status(200).json(await service.softDeleteLegalProfile({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.use(handleLegalProfileErrors);
  return router;
}
