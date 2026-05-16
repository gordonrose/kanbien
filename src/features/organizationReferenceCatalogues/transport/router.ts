import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import { getRequiredRootSessionContext, getRequiredTenantSessionContext } from "../../../lib/auth/requestContext";
import { createRequireRootCapability, type RootCapabilityChecker } from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../../tenantAuth";
import { InvalidOrganizationReferenceValueRequestError, OrganizationReferenceValueError } from "../contract/errors";
import {
  createReferenceValueBodySchema,
  listReferenceValuesQuerySchema,
  referenceValueParamsSchema,
  replaceReferenceValueBodySchema,
  updateReferenceValueBodySchema,
} from "../contract/schemas";
import type { OrganizationReferenceCataloguesService } from "../domain/service";
import type { ReferenceValueActorInput } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try { return schema.parse(input); } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidOrganizationReferenceValueRequestError(undefined, { field: issue.keys[0], reason: "unexpected_field" });
      }
      throw new InvalidOrganizationReferenceValueRequestError(undefined, issue ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message } : undefined);
    }
    throw error;
  }
}

function handleErrors(error: unknown, _request: Request, response: Response, next: NextFunction) {
  if (error instanceof OrganizationReferenceValueError) {
    response.status(error.status).json({ code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) });
    return;
  }
  next(error);
}

export function createRootOrganizationReferenceCataloguesRouter(
  service: OrganizationReferenceCataloguesService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const requireManage = createRequireRootCapability(capabilityChecker, "organization.reference-value.manage", { platformSecurityRepository });
  const requireRead = createRequireRootCapability(capabilityChecker, "organization.reference-value.read", { platformSecurityRepository });
  const actor = (request: Request): ReferenceValueActorInput => ({ actorType: "root-user", actorId: getRequiredRootSessionContext(request).rootUserId });

  router.post("/", requireManage, async (request, response, next) => {
    try { response.status(201).json(await service.createReferenceValue({ ...parseOrThrow(createReferenceValueBodySchema, request.body), ...actor(request) })); } catch (error) { next(error); }
  });
  router.get("/", requireRead, async (request, response, next) => {
    try { response.status(200).json(await service.listReferenceValues(parseOrThrow(listReferenceValuesQuerySchema, request.query))); } catch (error) { next(error); }
  });
  router.patch("/:referenceValueId", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.updateReferenceValueLabel({ ...parseOrThrow(referenceValueParamsSchema, request.params), ...parseOrThrow(updateReferenceValueBodySchema, request.body), ...actor(request) })); } catch (error) { next(error); }
  });
  router.post("/:referenceValueId/archive", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.archiveReferenceValue({ ...parseOrThrow(referenceValueParamsSchema, request.params), ...actor(request) })); } catch (error) { next(error); }
  });
  router.post("/:referenceValueId/deprecate", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.deprecateReferenceValue({ ...parseOrThrow(referenceValueParamsSchema, request.params), ...actor(request) })); } catch (error) { next(error); }
  });
  router.post("/:referenceValueId/replace", requireManage, async (request, response, next) => {
    try { response.status(200).json(await service.replaceReferenceValue({ ...parseOrThrow(referenceValueParamsSchema, request.params), ...parseOrThrow(replaceReferenceValueBodySchema, request.body), ...actor(request) })); } catch (error) { next(error); }
  });
  router.use(handleErrors);
  return router;
}

export function createTenantOrganizationReferenceCataloguesRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationReferenceCataloguesService,
): Router {
  const router = Router();
  router.use(createRequireTenantSession(sessionLookupRepository));
  router.get("/", async (request, response, next) => {
    try {
      const session = getRequiredTenantSessionContext(request);
      if (!session.activeTenantId) {
        throw new InvalidOrganizationReferenceValueRequestError("A current tenant selection is required.", { reason: "current_tenant_required" });
      }
      response.status(200).json(await service.listReferenceValues(parseOrThrow(listReferenceValuesQuerySchema, request.query)));
    } catch (error) { next(error); }
  });
  router.use(handleErrors);
  return router;
}
