import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import { getRequiredRootSessionContext, getRequiredTenantSessionContext } from "../../../lib/auth/requestContext";
import { createRequireRootCapability, type RootCapabilityChecker } from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../../tenantAuth";
import { InvalidBusinessUnitMembershipRequestError, OrganizationBusinessUnitMembershipError } from "../contract/errors";
import {
  createMembershipBodySchema,
  listMembershipsQuerySchema,
  membershipParamsSchema,
  membershipUnitParamsSchema,
  tenantMembershipParamsSchema,
  tenantMembershipUnitParamsSchema,
  updateMembershipBodySchema,
} from "../contract/schemas";
import type { OrganizationBusinessUnitMembershipsService } from "../domain/service";
import type { BusinessUnitMembershipActorInput } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try { return schema.parse(input); } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidBusinessUnitMembershipRequestError(undefined, { field: issue.keys[0], reason: "unexpected_field" });
      }
      throw new InvalidBusinessUnitMembershipRequestError(undefined, issue ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message } : undefined);
    }
    throw error;
  }
}

function handleErrors(error: unknown, _request: Request, response: Response, next: NextFunction) {
  if (error instanceof OrganizationBusinessUnitMembershipError) {
    response.status(error.status).json({ code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) });
    return;
  }
  next(error);
}

export function createRootOrganizationBusinessUnitMembershipsRouter(
  service: OrganizationBusinessUnitMembershipsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const requireManage = createRequireRootCapability(capabilityChecker, "organization.business-unit-membership.manage", { platformSecurityRepository });
  const requireRead = createRequireRootCapability(capabilityChecker, "organization.business-unit-membership.read", { platformSecurityRepository });
  const actor = (request: Request): BusinessUnitMembershipActorInput => ({ actorType: "root-user", actorId: getRequiredRootSessionContext(request).rootUserId });

  router.post("/:organizationId/business-units/:businessUnitId/memberships", requireManage, async (request, response, next) => {
    try { response.status(201).json(await service.createMembership({ ...parseOrThrow(tenantMembershipUnitParamsSchema, request.params), ...parseOrThrow(createMembershipBodySchema, request.body), ...actor(request) })); } catch (error) { next(error); }
  });
  router.get("/:organizationId/business-units/:businessUnitId/memberships", requireRead, async (request, response, next) => {
    try { response.status(200).json(await service.listMemberships({ ...parseOrThrow(tenantMembershipUnitParamsSchema, request.params), ...parseOrThrow(listMembershipsQuerySchema, request.query) })); } catch (error) { next(error); }
  });
  router.patch("/:organizationId/business-units/:businessUnitId/memberships/:membershipId", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.updateMembership({ ...parseOrThrow(tenantMembershipParamsSchema, request.params), ...parseOrThrow(updateMembershipBodySchema, request.body), ...actor(request) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/memberships/:membershipId/archive", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.archiveMembership({ ...parseOrThrow(tenantMembershipParamsSchema, request.params), ...actor(request) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/memberships/:membershipId/restore", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.restoreMembership({ ...parseOrThrow(tenantMembershipParamsSchema, request.params), ...actor(request) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/memberships/:membershipId/delete", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.softDeleteMembership({ ...parseOrThrow(tenantMembershipParamsSchema, request.params), ...actor(request) })); } catch (error) { next(error); }
  });
  router.use(handleErrors);
  return router;
}

export function createTenantOrganizationBusinessUnitMembershipsRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationBusinessUnitMembershipsService,
): Router {
  const router = Router();
  router.use(createRequireTenantSession(sessionLookupRepository));
  function context(request: Request): { tenantId: string } & BusinessUnitMembershipActorInput {
    const session = getRequiredTenantSessionContext(request);
    if (!session.activeTenantId) throw new InvalidBusinessUnitMembershipRequestError("A current tenant selection is required.", { reason: "current_tenant_required" });
    return { tenantId: session.activeTenantId, actorType: "tenant-admin", actorId: session.authPrincipalId };
  }
  router.post("/:organizationId/business-units/:businessUnitId/memberships", async (request, response, next) => {
    try { response.status(201).json(await service.createMembership({ ...context(request), ...parseOrThrow(membershipUnitParamsSchema, request.params), ...parseOrThrow(createMembershipBodySchema, request.body) })); } catch (error) { next(error); }
  });
  router.get("/:organizationId/business-units/:businessUnitId/memberships", async (request, response, next) => {
    try { response.status(200).json(await service.listMemberships({ ...context(request), ...parseOrThrow(membershipUnitParamsSchema, request.params), ...parseOrThrow(listMembershipsQuerySchema, request.query) })); } catch (error) { next(error); }
  });
  router.patch("/:organizationId/business-units/:businessUnitId/memberships/:membershipId", async (request, response, next) => {
    try { response.status(200).json(await service.updateMembership({ ...context(request), ...parseOrThrow(membershipParamsSchema, request.params), ...parseOrThrow(updateMembershipBodySchema, request.body) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/memberships/:membershipId/archive", async (request, response, next) => {
    try { response.status(200).json(await service.archiveMembership({ ...context(request), ...parseOrThrow(membershipParamsSchema, request.params) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/memberships/:membershipId/restore", async (request, response, next) => {
    try { response.status(200).json(await service.restoreMembership({ ...context(request), ...parseOrThrow(membershipParamsSchema, request.params) })); } catch (error) { next(error); }
  });
  router.post("/:organizationId/business-units/:businessUnitId/memberships/:membershipId/delete", async (request, response, next) => {
    try { response.status(200).json(await service.softDeleteMembership({ ...context(request), ...parseOrThrow(membershipParamsSchema, request.params) })); } catch (error) { next(error); }
  });
  router.use(handleErrors);
  return router;
}
