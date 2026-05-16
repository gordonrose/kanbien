import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import { getRequiredRootSessionContext, getRequiredTenantSessionContext } from "../../../lib/auth/requestContext";
import { createRequireRootCapability, type RootCapabilityChecker } from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../../tenantAuth";
import { InvalidOrganizationSearchRequestError, OrganizationSearchError } from "../contract/errors";
import { organizationSearchQuerySchema, tenantIdParamsSchema } from "../contract/schemas";
import type { OrganizationSearchService } from "../domain/service";
import type { OrganizationSearchActorType } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidOrganizationSearchRequestError(undefined, {
          field: issue.keys[0],
          reason: "unsupported_filter",
        });
      }
      throw new InvalidOrganizationSearchRequestError(
        undefined,
        issue ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message } : undefined,
      );
    }
    throw error;
  }
}

function handleErrors(error: unknown, _request: Request, response: Response, next: NextFunction) {
  if (error instanceof OrganizationSearchError) {
    response.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }
  next(error);
}

function buildSearchInput(
  tenantId: string,
  actorType: OrganizationSearchActorType,
  actorId: string,
  query: ReturnType<typeof organizationSearchQuerySchema.parse>,
) {
  return {
    tenantId,
    actorType,
    actorId,
    q: query.q,
    resultType: query.resultType,
    organizationId: query.organizationId,
    lifecycleStatus: query.lifecycleStatus,
    page: query.page,
    pageSize: query.pageSize,
    orderBy: query.orderBy,
    orderDirection: query.orderDirection,
  };
}

export function createRootOrganizationSearchRouter(
  service: OrganizationSearchService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const requireSearch = createRequireRootCapability(capabilityChecker, "organization.root.search", {
    platformSecurityRepository,
  });

  router.get("/", requireSearch, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantIdParamsSchema, request.params);
      const query = parseOrThrow(organizationSearchQuerySchema, request.query);
      const session = getRequiredRootSessionContext(request);
      response.status(200).json(
        await service.search(buildSearchInput(params.tenantId, "root-user", session.rootUserId, query)),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use(handleErrors);
  return router;
}

export function createTenantOrganizationSearchRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationSearchService,
): Router {
  const router = Router();
  router.use(createRequireTenantSession(sessionLookupRepository));

  router.get("/", async (request, response, next) => {
    try {
      const session = getRequiredTenantSessionContext(request);
      if (!session.activeTenantId) {
        throw new InvalidOrganizationSearchRequestError("A current tenant selection is required.", {
          reason: "current_tenant_required",
        });
      }
      const query = parseOrThrow(organizationSearchQuerySchema, request.query);
      response.status(200).json(
        await service.search(
          buildSearchInput(session.activeTenantId, "tenant-admin", session.authPrincipalId, query),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use(handleErrors);
  return router;
}

