import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  createTenantBodySchema,
  listDeletedTenantsQuerySchema,
  listTenantsQuerySchema,
  removeTenantBodySchema,
  tenantIdParamsSchema,
  updateTenantBodySchema,
} from "../contract/schemas";
import { InvalidRequestError, TenantError } from "../contract/errors";
import type { TenantsService } from "../domain/service";

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
        issue
          ? {
              field: String(issue.path[0] ?? "unknown"),
              reason: issue.message,
            }
          : undefined,
      );
    }
    throw error;
  }
}

export function createTenantsRouter(
  service: TenantsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireCreate = createRequireRootCapability(
    capabilityChecker,
    "tenant.create",
    authzOptions,
  );
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "tenant.read",
    authzOptions,
  );
  const requireList = createRequireRootCapability(
    capabilityChecker,
    "tenant.list",
    authzOptions,
  );
  const requireUpdate = createRequireRootCapability(
    capabilityChecker,
    "tenant.update",
    authzOptions,
  );
  const requireReadDeleted = createRequireRootCapability(
    capabilityChecker,
    "tenant.read.deleted",
    authzOptions,
  );
  const requireListDeleted = createRequireRootCapability(
    capabilityChecker,
    "tenant.list.deleted",
    authzOptions,
  );
  const requireDelete = createRequireRootCapability(
    capabilityChecker,
    "tenant.delete",
    authzOptions,
  );
  const requireReactivate = createRequireRootCapability(
    capabilityChecker,
    "tenant.reactivate",
    authzOptions,
  );
  const requireRemove = createRequireRootCapability(
    capabilityChecker,
    "tenant.remove",
    authzOptions,
  );

  router.post("/", requireCreate, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      response.status(201).json(
        await service.createTenant({
          ...parseOrThrow(createTenantBodySchema, request.body),
          createdByRootAdminUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/", requireList, async (request, response, next) => {
    try {
      const query = parseOrThrow(listTenantsQuerySchema, request.query);
      response.status(200).json(
        await service.listTenants({
          page: query.page,
          pageSize: query.pageSize,
          orderBy: query.orderBy,
          orderDirection: query.orderDirection,
          filters: {
            bizIdPrefix: query.bizIdPrefix,
            namePrefix: query.namePrefix,
            category: query.category,
            status: query.status,
            createdAtFrom: query.createdAtFrom,
            createdAtTo: query.createdAtTo,
            updatedAtFrom: query.updatedAtFrom,
            updatedAtTo: query.updatedAtTo,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/deleted", requireListDeleted, async (request, response, next) => {
    try {
      const query = parseOrThrow(listDeletedTenantsQuerySchema, request.query);
      response.status(200).json(
        await service.listDeletedTenants({
          page: query.page,
          pageSize: query.pageSize,
          orderBy: query.orderBy,
          orderDirection: query.orderDirection,
          filters: {
            bizIdPrefix: query.bizIdPrefix,
            namePrefix: query.namePrefix,
            category: query.category,
            status: query.status,
            createdAtFrom: query.createdAtFrom,
            createdAtTo: query.createdAtTo,
            updatedAtFrom: query.updatedAtFrom,
            updatedAtTo: query.updatedAtTo,
            deletedAtFrom: query.deletedAtFrom,
            deletedAtTo: query.deletedAtTo,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/deleted/:tenantId", requireReadDeleted, async (request, response, next) => {
    try {
      response
        .status(200)
        .json(await service.getDeletedTenant(parseOrThrow(tenantIdParamsSchema, request.params)));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:tenantId", requireRead, async (request, response, next) => {
    try {
      response
        .status(200)
        .json(await service.getTenant(parseOrThrow(tenantIdParamsSchema, request.params)));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:tenantId", requireUpdate, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantIdParamsSchema, request.params);
      const body = parseOrThrow(updateTenantBodySchema, request.body);
      response.status(200).json(await service.updateTenant({ ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:tenantId/delete", requireDelete, async (request, response, next) => {
    try {
      response
        .status(200)
        .json(await service.softDeleteTenant(parseOrThrow(tenantIdParamsSchema, request.params)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:tenantId/reactivate", requireReactivate, async (request, response, next) => {
    try {
      response
        .status(200)
        .json(await service.reactivateTenant(parseOrThrow(tenantIdParamsSchema, request.params)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:tenantId/remove", requireRemove, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantIdParamsSchema, request.params);
      const body = parseOrThrow(removeTenantBodySchema, request.body);
      response.status(200).json(await service.removeTenant({ ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof TenantError) {
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
