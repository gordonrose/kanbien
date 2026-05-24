import { randomUUID } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import { EntityError, InvalidRequestError } from "../contract/errors";
import {
  createEntityBodySchema,
  deleteEntityParamsSchema,
  getEntityParamsSchema,
  getEntityQuerySchema,
  listEntitiesQuerySchema,
  updateEntityBodySchema,
  updateEntityParamsSchema,
} from "../contract/schemas";
import type { EntityService } from "../domain/service";

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

async function writeEntityAuditEvent(
  request: Request,
  platformSecurityRepository: PlatformSecurityRepository | undefined,
  eventType: string,
) {
  if (!platformSecurityRepository) {
    return;
  }
  const session = getRequiredRootSessionContext(request);
  await platformSecurityRepository.createSecurityAuditEvent({
    eventId: randomUUID(),
    authPrincipalId: session.authPrincipalId,
    rootUserId: session.rootUserId,
    eventType,
    eventOutcome: "success",
    ipAddress: request.ip,
    userAgent: request.header("user-agent") ?? undefined,
    occurredAt: new Date(),
  });
}

export function createEntityRouter(
  service: EntityService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireCreate = createRequireRootCapability(capabilityChecker, "entity.create", authzOptions);
  const requireRead = createRequireRootCapability(capabilityChecker, "entity.read", authzOptions);
  const requireUpdate = createRequireRootCapability(capabilityChecker, "entity.update", authzOptions);
  const requireDelete = createRequireRootCapability(capabilityChecker, "entity.delete", authzOptions);

  router.post("/", requireCreate, async (request, response, next) => {
    try {
      const body = parseOrThrow(createEntityBodySchema, request.body);
      const result = await service.createEntity(body);
      await writeEntityAuditEvent(request, platformSecurityRepository, "entity_created");
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", requireRead, async (request, response, next) => {
    try {
      const query = parseOrThrow(listEntitiesQuerySchema, request.query);
      response.status(200).json(await service.listEntities({
        page: query.page,
        pageSize: query.pageSize,
        orderBy: query.orderBy,
        orderDirection: query.orderDirection,
        filters: {
          namePrefix: query.namePrefix,
          status: query.status,
          includeArchived: query.includeArchived,
          createdAtFrom: query.createdAtFrom,
          createdAtTo: query.createdAtTo,
          updatedAtFrom: query.updatedAtFrom,
          updatedAtTo: query.updatedAtTo,
        },
      }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:entityId", requireRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(getEntityParamsSchema, request.params);
      const query = parseOrThrow(getEntityQuerySchema, request.query);
      response.status(200).json(await service.getEntity({
        entityId: params.entityId,
        includeArchived: query.includeArchived,
      }));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:entityId", requireUpdate, async (request, response, next) => {
    try {
      const params = parseOrThrow(updateEntityParamsSchema, request.params);
      const body = parseOrThrow(updateEntityBodySchema, request.body);
      const result = await service.updateEntity({ ...params, ...body });
      await writeEntityAuditEvent(request, platformSecurityRepository, "entity_updated");
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:entityId", requireDelete, async (request, response, next) => {
    try {
      const params = parseOrThrow(deleteEntityParamsSchema, request.params);
      const result = await service.deleteEntity(params);
      await writeEntityAuditEvent(request, platformSecurityRepository, "entity_archived");
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof EntityError) {
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
