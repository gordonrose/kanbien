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
import { InvalidRequestError, OrganizationError } from "../contract/errors";
import {
  archiveOrganizationBodySchema,
  createOrganizationBodySchema,
  listOrganizationsQuerySchema,
  moveOrganizationBodySchema,
  organizationIdParamsSchema,
  tenantIdParamsSchema,
  tenantOrganizationIdParamsSchema,
  updateOrganizationBodySchema,
} from "../contract/schemas";
import type { OrganizationCoreService } from "../domain/service";
import type { OrganizationActorInput } from "../domain/types";

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

function handleOrganizationErrors(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof OrganizationError) {
    response.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }
  next(error);
}

function buildQuery(input: ReturnType<typeof listOrganizationsQuerySchema.parse>, tenantId: string) {
  return {
    tenantId,
    page: input.page,
    pageSize: input.pageSize,
    orderBy: input.orderBy,
    orderDirection: input.orderDirection,
    filters: {
      namePrefix: input.namePrefix,
      parentOrganizationId: input.parentOrganizationId,
      lifecycleStatus: input.lifecycleStatus,
      createdAtFrom: input.createdAtFrom,
      createdAtTo: input.createdAtTo,
      updatedAtFrom: input.updatedAtFrom,
      updatedAtTo: input.updatedAtTo,
    },
  };
}

export function createRootOrganizationCoreRouter(
  service: OrganizationCoreService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const authzOptions = { platformSecurityRepository };
  const requireCreate = createRequireRootCapability(capabilityChecker, "organization.create", authzOptions);
  const requireRead = createRequireRootCapability(capabilityChecker, "organization.read", authzOptions);
  const requireList = createRequireRootCapability(capabilityChecker, "organization.list", authzOptions);
  const requireUpdate = createRequireRootCapability(capabilityChecker, "organization.update", authzOptions);
  const requireMove = createRequireRootCapability(capabilityChecker, "organization.move", authzOptions);
  const requireArchive = createRequireRootCapability(capabilityChecker, "organization.archive", authzOptions);
  const requireRestore = createRequireRootCapability(capabilityChecker, "organization.restore", authzOptions);
  const requireDelete = createRequireRootCapability(capabilityChecker, "organization.delete", authzOptions);

  function actor(request: Request): OrganizationActorInput {
    const session = getRequiredRootSessionContext(request);
    return { actorType: "root-user", actorId: session.rootUserId };
  }

  router.post("/", requireCreate, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantIdParamsSchema, request.params);
      const body = parseOrThrow(createOrganizationBodySchema, request.body);
      response.status(201).json(await service.createOrganization({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/", requireList, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantIdParamsSchema, request.params);
      const query = parseOrThrow(listOrganizationsQuerySchema, request.query);
      response.status(200).json(await service.listOrganizations(buildQuery(query, params.tenantId)));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId", requireRead, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getOrganization(parseOrThrow(tenantOrganizationIdParamsSchema, request.params)),
      );
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId", requireUpdate, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationIdParamsSchema, request.params);
      const body = parseOrThrow(updateOrganizationBodySchema, request.body);
      response.status(200).json(await service.updateOrganization({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/move", requireMove, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationIdParamsSchema, request.params);
      const body = parseOrThrow(moveOrganizationBodySchema, request.body);
      response.status(200).json(await service.moveOrganization({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/archive", requireArchive, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationIdParamsSchema, request.params);
      const body = parseOrThrow(archiveOrganizationBodySchema, request.body);
      response.status(200).json(await service.archiveOrganization({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/restore", requireRestore, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.restoreOrganization({
          ...parseOrThrow(tenantOrganizationIdParamsSchema, request.params),
          ...actor(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/delete", requireDelete, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.softDeleteOrganization({
          ...parseOrThrow(tenantOrganizationIdParamsSchema, request.params),
          ...actor(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use(handleOrganizationErrors);
  return router;
}

export function createTenantOrganizationCoreRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationCoreService,
): Router {
  const router = Router();
  const requireTenantSession = createRequireTenantSession(sessionLookupRepository);
  router.use(requireTenantSession);

  function tenantContext(request: Request): { tenantId: string } & OrganizationActorInput {
    const session = getRequiredTenantSessionContext(request);
    if (!session.activeTenantId) {
      throw new InvalidRequestError("A current tenant selection is required.", {
        reason: "current_tenant_required",
      });
    }
    return {
      tenantId: session.activeTenantId,
      actorType: "tenant-admin",
      actorId: session.authPrincipalId,
    };
  }

  router.post("/", async (request, response, next) => {
    try {
      const body = parseOrThrow(createOrganizationBodySchema, request.body);
      response.status(201).json(await service.createOrganization({ ...tenantContext(request), ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const query = parseOrThrow(listOrganizationsQuerySchema, request.query);
      response.status(200).json(await service.listOrganizations(buildQuery(query, context.tenantId)));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationIdParamsSchema, request.params);
      response.status(200).json(await service.getOrganization({ tenantId: context.tenantId, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationIdParamsSchema, request.params);
      const body = parseOrThrow(updateOrganizationBodySchema, request.body);
      response.status(200).json(await service.updateOrganization({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/move", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationIdParamsSchema, request.params);
      const body = parseOrThrow(moveOrganizationBodySchema, request.body);
      response.status(200).json(await service.moveOrganization({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/archive", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationIdParamsSchema, request.params);
      const body = parseOrThrow(archiveOrganizationBodySchema, request.body);
      response.status(200).json(await service.archiveOrganization({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/restore", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationIdParamsSchema, request.params);
      response.status(200).json(await service.restoreOrganization({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/delete", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(organizationIdParamsSchema, request.params);
      response.status(200).json(await service.softDeleteOrganization({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.use(handleOrganizationErrors);
  return router;
}
