import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import { getRequiredRootSessionContext, getRequiredTenantSessionContext } from "../../../lib/auth/requestContext";
import { createRequireRootCapability, type RootCapabilityChecker } from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../../tenantAuth";
import { InvalidOpeningHoursRequestError, OrganizationOpeningHoursError } from "../contract/errors";
import {
  createExceptionBodySchema,
  createWeeklySlotBodySchema,
  effectiveOpeningHoursQuerySchema,
  exceptionParamsSchema,
  listOpeningHoursQuerySchema,
  locationParamsSchema,
  tenantExceptionParamsSchema,
  tenantLocationParamsSchema,
  tenantWeeklySlotParamsSchema,
  updateExceptionBodySchema,
  updateWeeklySlotBodySchema,
  weeklySlotParamsSchema,
} from "../contract/schemas";
import type { OrganizationOpeningHoursService } from "../domain/service";
import type { OpeningHoursActorInput } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidOpeningHoursRequestError(undefined, {
          field: issue.keys[0],
          reason: "unexpected_field",
        });
      }
      throw new InvalidOpeningHoursRequestError(
        undefined,
        issue ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message } : undefined,
      );
    }
    throw error;
  }
}

function handleOpeningHoursErrors(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof OrganizationOpeningHoursError) {
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
  query: ReturnType<typeof listOpeningHoursQuerySchema.parse>,
  tenantId: string,
  organizationId: string,
  locationId: string,
) {
  return {
    tenantId,
    organizationId,
    locationId,
    page: query.page,
    pageSize: query.pageSize,
    orderBy: query.orderBy,
    orderDirection: query.orderDirection,
  };
}

export function createRootOrganizationOpeningHoursRouter(
  service: OrganizationOpeningHoursService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const authzOptions = { platformSecurityRepository };
  const requireSlotManage = createRequireRootCapability(
    capabilityChecker,
    "organization.weekly-hours-slot.manage",
    authzOptions,
  );
  const requireSlotRead = createRequireRootCapability(
    capabilityChecker,
    "organization.weekly-hours-slot.read",
    authzOptions,
  );
  const requireExceptionManage = createRequireRootCapability(
    capabilityChecker,
    "organization.opening-hours-exception.manage",
    authzOptions,
  );
  const requireExceptionRead = createRequireRootCapability(
    capabilityChecker,
    "organization.opening-hours-exception.read",
    authzOptions,
  );

  function actor(request: Request): OpeningHoursActorInput {
    const session = getRequiredRootSessionContext(request);
    return { actorType: "root-user", actorId: session.rootUserId };
  }

  router.post("/:organizationId/locations/:locationId/weekly-opening-hours", requireSlotManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantLocationParamsSchema, request.params);
      const body = parseOrThrow(createWeeklySlotBodySchema, request.body);
      response.status(201).json(await service.createWeeklySlot({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations/:locationId/weekly-opening-hours", requireSlotRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantLocationParamsSchema, request.params);
      const query = parseOrThrow(listOpeningHoursQuerySchema, request.query);
      response.status(200).json(await service.listWeeklySlots(listInput(query, params.tenantId, params.organizationId, params.locationId)));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId/locations/:locationId/weekly-opening-hours/:weeklyOpeningHoursId", requireSlotManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantWeeklySlotParamsSchema, request.params);
      const body = parseOrThrow(updateWeeklySlotBodySchema, request.body);
      response.status(200).json(await service.updateWeeklySlot({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/weekly-opening-hours/:weeklyOpeningHoursId/delete", requireSlotManage, async (request, response, next) => {
    try {
      response.status(200).json(await service.deleteWeeklySlot({ ...parseOrThrow(tenantWeeklySlotParamsSchema, request.params), ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/opening-hours-exceptions", requireExceptionManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantLocationParamsSchema, request.params);
      const body = parseOrThrow(createExceptionBodySchema, request.body);
      response.status(201).json(await service.createException({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations/:locationId/opening-hours-exceptions", requireExceptionRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantLocationParamsSchema, request.params);
      const query = parseOrThrow(listOpeningHoursQuerySchema, request.query);
      response.status(200).json(await service.listExceptions(listInput(query, params.tenantId, params.organizationId, params.locationId)));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId/locations/:locationId/opening-hours-exceptions/:openingHoursExceptionId", requireExceptionManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantExceptionParamsSchema, request.params);
      const body = parseOrThrow(updateExceptionBodySchema, request.body);
      response.status(200).json(await service.updateException({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/opening-hours-exceptions/:openingHoursExceptionId/delete", requireExceptionManage, async (request, response, next) => {
    try {
      response.status(200).json(await service.deleteException({ ...parseOrThrow(tenantExceptionParamsSchema, request.params), ...actor(request) }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations/:locationId/effective-opening-hours", requireSlotRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantLocationParamsSchema, request.params);
      const query = parseOrThrow(effectiveOpeningHoursQuerySchema, request.query);
      response.status(200).json(await service.getEffectiveOpeningHours({ ...params, ...query }));
    } catch (error) {
      next(error);
    }
  });

  router.use(handleOpeningHoursErrors);
  return router;
}

export function createTenantOrganizationOpeningHoursRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationOpeningHoursService,
): Router {
  const router = Router();
  const requireTenantSession = createRequireTenantSession(sessionLookupRepository);
  router.use(requireTenantSession);

  function tenantContext(request: Request): { tenantId: string } & OpeningHoursActorInput {
    const session = getRequiredTenantSessionContext(request);
    if (!session.activeTenantId) {
      throw new InvalidOpeningHoursRequestError("A current tenant selection is required.", {
        reason: "current_tenant_required",
      });
    }
    return {
      tenantId: session.activeTenantId,
      actorType: "tenant-admin",
      actorId: session.authPrincipalId,
    };
  }

  router.post("/:organizationId/locations/:locationId/weekly-opening-hours", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(locationParamsSchema, request.params);
      const body = parseOrThrow(createWeeklySlotBodySchema, request.body);
      response.status(201).json(await service.createWeeklySlot({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations/:locationId/weekly-opening-hours", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(locationParamsSchema, request.params);
      const query = parseOrThrow(listOpeningHoursQuerySchema, request.query);
      response.status(200).json(await service.listWeeklySlots(listInput(query, context.tenantId, params.organizationId, params.locationId)));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId/locations/:locationId/weekly-opening-hours/:weeklyOpeningHoursId", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(weeklySlotParamsSchema, request.params);
      const body = parseOrThrow(updateWeeklySlotBodySchema, request.body);
      response.status(200).json(await service.updateWeeklySlot({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/weekly-opening-hours/:weeklyOpeningHoursId/delete", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(weeklySlotParamsSchema, request.params);
      response.status(200).json(await service.deleteWeeklySlot({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/opening-hours-exceptions", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(locationParamsSchema, request.params);
      const body = parseOrThrow(createExceptionBodySchema, request.body);
      response.status(201).json(await service.createException({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations/:locationId/opening-hours-exceptions", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(locationParamsSchema, request.params);
      const query = parseOrThrow(listOpeningHoursQuerySchema, request.query);
      response.status(200).json(await service.listExceptions(listInput(query, context.tenantId, params.organizationId, params.locationId)));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:organizationId/locations/:locationId/opening-hours-exceptions/:openingHoursExceptionId", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(exceptionParamsSchema, request.params);
      const body = parseOrThrow(updateExceptionBodySchema, request.body);
      response.status(200).json(await service.updateException({ ...context, ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:organizationId/locations/:locationId/opening-hours-exceptions/:openingHoursExceptionId/delete", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(exceptionParamsSchema, request.params);
      response.status(200).json(await service.deleteException({ ...context, ...params }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:organizationId/locations/:locationId/effective-opening-hours", async (request, response, next) => {
    try {
      const context = tenantContext(request);
      const params = parseOrThrow(locationParamsSchema, request.params);
      const query = parseOrThrow(effectiveOpeningHoursQuerySchema, request.query);
      response.status(200).json(await service.getEffectiveOpeningHours({ ...context, ...params, ...query }));
    } catch (error) {
      next(error);
    }
  });

  router.use(handleOpeningHoursErrors);
  return router;
}
