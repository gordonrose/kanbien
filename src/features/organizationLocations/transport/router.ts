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
import { InvalidLocationRequestError, OrganizationLocationError } from "../contract/errors";
import {
  createLocationBodySchema,
  listLocationsQuerySchema,
  organizationLocationParamsSchema,
  organizationParamsSchema,
  tenantOrganizationLocationParamsSchema,
  tenantOrganizationParamsSchema,
  updateLocationBodySchema,
} from "../contract/schemas";
import type { OrganizationLocationsService } from "../domain/service";
import type { LocationActorInput } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidLocationRequestError(undefined, {
          field: issue.keys[0],
          reason: "unexpected_field",
        });
      }
      throw new InvalidLocationRequestError(
        undefined,
        issue ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message } : undefined,
      );
    }
    throw error;
  }
}

function handleLocationErrors(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof OrganizationLocationError) {
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
  query: ReturnType<typeof listLocationsQuerySchema.parse>,
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

export function createRootOrganizationLocationsRouter(
  service: OrganizationLocationsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const authzOptions = { platformSecurityRepository };
  const requireManage = createRequireRootCapability(
    capabilityChecker,
    "organization.location.manage",
    authzOptions,
  );
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "organization.location.read",
    authzOptions,
  );

  function actor(request: Request): LocationActorInput {
    const session = getRequiredRootSessionContext(request);
    return { actorType: "root-user", actorId: session.rootUserId };
  }

  router.post("/:organizationId/locations", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema, request.params);
      const body = parseOrThrow(createLocationBodySchema, request.body);
      response.status(201).json(await service.createLocation({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations", requireRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema, request.params);
      const query = parseOrThrow(listLocationsQuerySchema, request.query);
      response.status(200).json(await service.listLocations(listInput(query, params.tenantId, params.organizationId)));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations/:locationId", requireRead, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getLocation(parseOrThrow(tenantOrganizationLocationParamsSchema, request.params)),
      );
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId/locations/:locationId", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationLocationParamsSchema, request.params);
      const body = parseOrThrow(updateLocationBodySchema, request.body);
      response.status(200).json(await service.updateLocation({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/archive", requireManage, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.archiveLocation({
          ...parseOrThrow(tenantOrganizationLocationParamsSchema, request.params),
          ...actor(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/restore", requireManage, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.restoreLocation({
          ...parseOrThrow(tenantOrganizationLocationParamsSchema, request.params),
          ...actor(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/delete", requireManage, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.softDeleteLocation({
          ...parseOrThrow(tenantOrganizationLocationParamsSchema, request.params),
          ...actor(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use(handleLocationErrors);
  return router;
}

export function createTenantOrganizationLocationsRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationLocationsService,
): Router {
  const router = Router();
  const requireTenantSession = createRequireTenantSession(sessionLookupRepository);
  router.use(requireTenantSession);

  function tenantContext(request: Request): { tenantId: string } & LocationActorInput {
    const session = getRequiredTenantSessionContext(request);
    if (!session.activeTenantId) {
      throw new InvalidLocationRequestError("A current tenant selection is required.", {
        reason: "current_tenant_required",
      });
    }
    return {
      tenantId: session.activeTenantId,
      actorType: "tenant-admin",
      actorId: session.authPrincipalId,
    };
  }

  router.post("/:organizationId/locations", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationParamsSchema, request.params);
      const body = parseOrThrow(createLocationBodySchema, request.body);
      response.status(201).json(await service.createLocation({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationParamsSchema, request.params);
      const query = parseOrThrow(listLocationsQuerySchema, request.query);
      response.status(200).json(await service.listLocations(listInput(query, context.tenantId, params.organizationId)));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations/:locationId", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLocationParamsSchema, request.params);
      response.status(200).json(await service.getLocation({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId/locations/:locationId", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLocationParamsSchema, request.params);
      const body = parseOrThrow(updateLocationBodySchema, request.body);
      response.status(200).json(await service.updateLocation({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/archive", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLocationParamsSchema, request.params);
      response.status(200).json(await service.archiveLocation({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/restore", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLocationParamsSchema, request.params);
      response.status(200).json(await service.restoreLocation({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/delete", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationLocationParamsSchema, request.params);
      response.status(200).json(await service.softDeleteLocation({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.use(handleLocationErrors);
  return router;
}
