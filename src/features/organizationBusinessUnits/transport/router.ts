import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import { getRequiredRootSessionContext, getRequiredTenantSessionContext } from "../../../lib/auth/requestContext";
import { createRequireRootCapability, type RootCapabilityChecker } from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../../tenantAuth";
import { InvalidBusinessUnitRequestError, OrganizationBusinessUnitError } from "../contract/errors";
import {
  archiveBusinessUnitBodySchema,
  businessUnitParamsSchema,
  createBusinessUnitBodySchema,
  listBusinessUnitsQuerySchema,
  moveBusinessUnitBodySchema,
  organizationParamsSchema,
  tenantBusinessUnitParamsSchema,
  tenantOrganizationParamsSchema,
  updateBusinessUnitBodySchema,
} from "../contract/schemas";
import type { OrganizationBusinessUnitsService } from "../domain/service";
import type { BusinessUnitActorInput } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidBusinessUnitRequestError(undefined, { field: issue.keys[0], reason: "unexpected_field" });
      }
      throw new InvalidBusinessUnitRequestError(
        undefined,
        issue ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message } : undefined,
      );
    }
    throw error;
  }
}

function handleErrors(error: unknown, _request: Request, response: Response, next: NextFunction) {
  if (error instanceof OrganizationBusinessUnitError) {
    response.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }
  next(error);
}

function listInput(query: ReturnType<typeof listBusinessUnitsQuerySchema.parse>, tenantId: string, organizationId: string) {
  return { tenantId, organizationId, ...query };
}

export function createRootOrganizationBusinessUnitsRouter(
  service: OrganizationBusinessUnitsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const requireManage = createRequireRootCapability(capabilityChecker, "organization.business-unit.manage", { platformSecurityRepository });
  const requireRead = createRequireRootCapability(capabilityChecker, "organization.business-unit.read", { platformSecurityRepository });

  function actor(request: Request): BusinessUnitActorInput {
    const session = getRequiredRootSessionContext(request);
    return { actorType: "root-user", actorId: session.rootUserId };
  }

  router.post("/:organizationId/business-units", requireManage, async (request, response, next) => {
    try {
      response.status(201).json(await service.createBusinessUnit({
        ...parseOrThrow(tenantOrganizationParamsSchema, request.params),
        ...parseOrThrow(createBusinessUnitBodySchema, request.body),
        ...actor(request),
      }));
    } catch (error) { next(error); }
  });
  router.get("/:organizationId/business-units", requireRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema, request.params);
      const query = parseOrThrow(listBusinessUnitsQuerySchema, request.query);
      response.status(200).json(await service.listBusinessUnits(listInput(query, params.tenantId, params.organizationId)));
    } catch (error) { next(error); }
  });
  router.get("/:organizationId/business-units/:businessUnitId", requireRead, async (request, response, next) => {
    try { response.status(200).json(await service.getBusinessUnit(parseOrThrow(tenantBusinessUnitParamsSchema, request.params))); } catch (error) { next(error); }
  });
  router.patch("/:organizationId/business-units/:businessUnitId", requireManage, async (request, response, next) => {
    try {
      response.status(200).json(await service.updateBusinessUnit({
        ...parseOrThrow(tenantBusinessUnitParamsSchema, request.params),
        ...parseOrThrow(updateBusinessUnitBodySchema, request.body),
        ...actor(request),
      }));
    } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/move", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.moveBusinessUnit({ ...parseOrThrow(tenantBusinessUnitParamsSchema, request.params), ...parseOrThrow(moveBusinessUnitBodySchema, request.body), ...actor(request) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/archive", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.archiveBusinessUnit({ ...parseOrThrow(tenantBusinessUnitParamsSchema, request.params), ...parseOrThrow(archiveBusinessUnitBodySchema, request.body), ...actor(request) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/restore", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.restoreBusinessUnit({ ...parseOrThrow(tenantBusinessUnitParamsSchema, request.params), ...actor(request) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/delete", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.softDeleteBusinessUnit({ ...parseOrThrow(tenantBusinessUnitParamsSchema, request.params), ...actor(request) })); } catch (error) { next(error); }
  });
  router.use(handleErrors);
  return router;
}

export function createTenantOrganizationBusinessUnitsRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationBusinessUnitsService,
): Router {
  const router = Router();
  const requireTenantSession = createRequireTenantSession(sessionLookupRepository);
  router.use(requireTenantSession);
  function context(request: Request): { tenantId: string } & BusinessUnitActorInput {
    const session = getRequiredTenantSessionContext(request);
    if (!session.activeTenantId) throw new InvalidBusinessUnitRequestError("A current tenant selection is required.", { reason: "current_tenant_required" });
    return { tenantId: session.activeTenantId, actorType: "tenant-admin", actorId: session.authPrincipalId };
  }
  router.post("/:organizationId/business-units", async (request, response, next) => {
    try { response.status(201).json(await service.createBusinessUnit({ ...context(request), ...parseOrThrow(organizationParamsSchema, request.params), ...parseOrThrow(createBusinessUnitBodySchema, request.body) })); } catch (error) { next(error); }
  });
  router.get("/:organizationId/business-units", async (request, response, next) => {
    try {
      const ctx = context(request);
      const params = parseOrThrow(organizationParamsSchema, request.params);
      const query = parseOrThrow(listBusinessUnitsQuerySchema, request.query);
      response.status(200).json(await service.listBusinessUnits(listInput(query, ctx.tenantId, params.organizationId)));
    } catch (error) { next(error); }
  });
  router.get("/:organizationId/business-units/:businessUnitId", async (request, response, next) => {
    try { response.status(200).json(await service.getBusinessUnit({ ...context(request), ...parseOrThrow(businessUnitParamsSchema, request.params) })); } catch (error) { next(error); }
  });
  router.patch("/:organizationId/business-units/:businessUnitId", async (request, response, next) => {
    try { response.status(200).json(await service.updateBusinessUnit({ ...context(request), ...parseOrThrow(businessUnitParamsSchema, request.params), ...parseOrThrow(updateBusinessUnitBodySchema, request.body) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/move", async (request, response, next) => {
    try { response.status(200).json(await service.moveBusinessUnit({ ...context(request), ...parseOrThrow(businessUnitParamsSchema, request.params), ...parseOrThrow(moveBusinessUnitBodySchema, request.body) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/archive", async (request, response, next) => {
    try { response.status(200).json(await service.archiveBusinessUnit({ ...context(request), ...parseOrThrow(businessUnitParamsSchema, request.params), ...parseOrThrow(archiveBusinessUnitBodySchema, request.body) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/restore", async (request, response, next) => {
    try { response.status(200).json(await service.restoreBusinessUnit({ ...context(request), ...parseOrThrow(businessUnitParamsSchema, request.params) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/delete", async (request, response, next) => {
    try { response.status(200).json(await service.softDeleteBusinessUnit({ ...context(request), ...parseOrThrow(businessUnitParamsSchema, request.params) })); } catch (error) { next(error); }
  });
  router.use(handleErrors);
  return router;
}
