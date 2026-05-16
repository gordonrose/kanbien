import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import { getRequiredRootSessionContext, getRequiredTenantSessionContext } from "../../../lib/auth/requestContext";
import { createRequireRootCapability, type RootCapabilityChecker } from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../../tenantAuth";
import {
  InvalidOrganizationExportRequestError,
  OrganizationExportError,
} from "../contract/errors";
import {
  createExportBodySchema,
  exportParamsSchema,
  listExportsQuerySchema,
  retryExportBodySchema,
  tenantExportParamsSchema,
  tenantIdParamsSchema,
} from "../contract/schemas";
import type { OrganizationExportsService } from "../domain/service";
import type { OrganizationExportActorInput } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      throw new InvalidOrganizationExportRequestError(undefined, {
        field: String(issue?.path[0] ?? "unknown"),
        reason: issue?.message ?? "invalid",
      });
    }
    throw error;
  }
}

function handleErrors(error: unknown, _request: Request, response: Response, next: NextFunction): void {
  if (error instanceof OrganizationExportError) {
    response.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }
  next(error);
}

export function createRootOrganizationExportsRouter(
  service: OrganizationExportsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const requireManage = createRequireRootCapability(capabilityChecker, "organization.root.export.manage", {
    platformSecurityRepository,
  });

  function actor(request: Request): OrganizationExportActorInput {
    const session = getRequiredRootSessionContext(request);
    return { actorType: "root-user", actorId: session.rootUserId, authPrincipalId: session.authPrincipalId };
  }

  router.post("/", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantIdParamsSchema, request.params);
      const body = parseOrThrow(createExportBodySchema, request.body);
      response.status(202).json(await service.createExport({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.get("/", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantIdParamsSchema, request.params);
      const query = parseOrThrow(listExportsQuerySchema, request.query);
      response.status(200).json(await service.listExports({ ...params, actorId: actor(request).actorId, ...query }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.get("/:exportId", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantExportParamsSchema, request.params);
      response.status(200).json(await service.getExport({ tenantId: params.tenantId, organizationExportId: params.exportId, ...actor(request) }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.post("/:exportId/cancel", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantExportParamsSchema, request.params);
      response.status(200).json(await service.cancelExport({ tenantId: params.tenantId, organizationExportId: params.exportId, ...actor(request) }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.post("/:exportId/retry", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantExportParamsSchema, request.params);
      const body = parseOrThrow(retryExportBodySchema, request.body);
      response.status(202).json(await service.retryExport({ tenantId: params.tenantId, organizationExportId: params.exportId, ...body, ...actor(request) }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.get("/:exportId/pin", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantExportParamsSchema, request.params);
      response.status(200).json(await service.viewPin({ tenantId: params.tenantId, organizationExportId: params.exportId, ...actor(request) }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.get("/:exportId/download", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantExportParamsSchema, request.params);
      const delivery = await service.downloadExport({ tenantId: params.tenantId, organizationExportId: params.exportId, ...actor(request) });
      Object.entries(delivery.headers).forEach(([name, value]) => response.setHeader(name, value));
      delivery.stream.pipe(response);
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.delete("/:exportId", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantExportParamsSchema, request.params);
      response.status(200).json(await service.deleteExport({ tenantId: params.tenantId, organizationExportId: params.exportId, ...actor(request) }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  return router;
}

export function createTenantOrganizationExportsRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationExportsService,
): Router {
  const router = Router();
  router.use(createRequireTenantSession(sessionLookupRepository));

  function context(request: Request): { tenantId: string } & OrganizationExportActorInput {
    const session = getRequiredTenantSessionContext(request);
    if (!session.activeTenantId) {
      throw new InvalidOrganizationExportRequestError("A current tenant selection is required.", {
        reason: "current_tenant_required",
      });
    }
    return {
      tenantId: session.activeTenantId,
      actorType: "tenant-admin",
      actorId: session.authPrincipalId,
      authPrincipalId: session.authPrincipalId,
    };
  }

  router.post("/", async (request, response, next) => {
    try {
      const body = parseOrThrow(createExportBodySchema, request.body);
      response.status(202).json(await service.createExport({ ...context(request), ...body }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.get("/", async (request, response, next) => {
    try {
      const query = parseOrThrow(listExportsQuerySchema, request.query);
      const ctx = context(request);
      response.status(200).json(await service.listExports({ tenantId: ctx.tenantId, actorId: ctx.actorId, ...query }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.get("/:exportId", async (request, response, next) => {
    try {
      const params = parseOrThrow(exportParamsSchema, request.params);
      response.status(200).json(await service.getExport({ ...context(request), organizationExportId: params.exportId }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });
  router.post("/:exportId/cancel", async (request, response, next) => {
    try {
      const params = parseOrThrow(exportParamsSchema, request.params);
      response.status(200).json(await service.cancelExport({ ...context(request), organizationExportId: params.exportId }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });
  router.post("/:exportId/retry", async (request, response, next) => {
    try {
      const params = parseOrThrow(exportParamsSchema, request.params);
      const body = parseOrThrow(retryExportBodySchema, request.body);
      response.status(202).json(await service.retryExport({ ...context(request), organizationExportId: params.exportId, ...body }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });
  router.get("/:exportId/pin", async (request, response, next) => {
    try {
      const params = parseOrThrow(exportParamsSchema, request.params);
      response.status(200).json(await service.viewPin({ ...context(request), organizationExportId: params.exportId }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });
  router.get("/:exportId/download", async (request, response, next) => {
    try {
      const params = parseOrThrow(exportParamsSchema, request.params);
      const delivery = await service.downloadExport({ ...context(request), organizationExportId: params.exportId });
      Object.entries(delivery.headers).forEach(([name, value]) => response.setHeader(name, value));
      delivery.stream.pipe(response);
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });
  router.delete("/:exportId", async (request, response, next) => {
    try {
      const params = parseOrThrow(exportParamsSchema, request.params);
      response.status(200).json(await service.deleteExport({ ...context(request), organizationExportId: params.exportId }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  return router;
}
