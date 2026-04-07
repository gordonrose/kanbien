import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  createRootUserBodySchema,
  deleteRootUserParamsSchema,
  getRootUserByEmailQuerySchema,
  getRootUserParamsSchema,
  listActiveRootUsersQuerySchema,
  listDeletedRootUsersQuerySchema,
  listRootUsersQuerySchema,
  reActivateRootUserParamsSchema,
  removeRootUserParamsSchema,
  updateRootUserBodySchema,
  updateRootUserParamsSchema,
} from "../contract/schemas";
import { InvalidRequestError, RootUserError } from "../contract/errors";
import type { RootUsersService } from "../domain/service";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try { return schema.parse(input); } catch (error) {
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

export function createRootUsersRouter(
  service: RootUsersService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireCreate = createRequireRootCapability(
    capabilityChecker,
    "root-user.create",
    authzOptions,
  );
  const requireReadVisible = createRequireRootCapability(
    capabilityChecker,
    "root-user.read.visible",
    authzOptions,
  );
  const requireReadActive = createRequireRootCapability(
    capabilityChecker,
    "root-user.read.active",
    authzOptions,
  );
  const requireReadDeleted = createRequireRootCapability(
    capabilityChecker,
    "root-user.read.deleted",
    authzOptions,
  );
  const requireUpdate = createRequireRootCapability(
    capabilityChecker,
    "root-user.update",
    authzOptions,
  );
  const requireDelete = createRequireRootCapability(
    capabilityChecker,
    "root-user.delete",
    authzOptions,
  );
  const requireRemove = createRequireRootCapability(
    capabilityChecker,
    "root-user.remove",
    authzOptions,
  );
  const requireReactivate = createRequireRootCapability(
    capabilityChecker,
    "root-user.reactivate",
    authzOptions,
  );

  router.post("/", requireCreate, async (req, res, next) => { try { res.status(201).json(await service.createRootUser(parseOrThrow(createRootUserBodySchema, req.body))); } catch (e) { next(e); } });
  router.get("/active", requireReadActive, async (req, res, next) => { try {
    const query = parseOrThrow(listActiveRootUsersQuerySchema, req.query);
    res.status(200).json(await service.listActiveRootUsers({ page: query.page, pageSize: query.pageSize, orderBy: query.orderBy, orderDirection: query.orderDirection, filters: { emailPrefix: query.emailPrefix, firstNamePrefix: query.firstNamePrefix, lastNamePrefix: query.lastNamePrefix, createdAtFrom: query.createdAtFrom, createdAtTo: query.createdAtTo, updatedAtFrom: query.updatedAtFrom, updatedAtTo: query.updatedAtTo } }));
  } catch (e) { next(e); } });
  router.get("/deleted", requireReadDeleted, async (req, res, next) => { try {
    const query = parseOrThrow(listDeletedRootUsersQuerySchema, req.query);
    res.status(200).json(await service.listDeletedRootUsers({ page: query.page, pageSize: query.pageSize, orderBy: query.orderBy, orderDirection: query.orderDirection, filters: { emailPrefix: query.emailPrefix, firstNamePrefix: query.firstNamePrefix, lastNamePrefix: query.lastNamePrefix, createdAtFrom: query.createdAtFrom, createdAtTo: query.createdAtTo, updatedAtFrom: query.updatedAtFrom, updatedAtTo: query.updatedAtTo, deletedAtFrom: query.deletedAtFrom, deletedAtTo: query.deletedAtTo, excludeAnonymized: query.excludeAnonymized } }));
  } catch (e) { next(e); } });
  router.get("/", requireReadVisible, async (req, res, next) => { try {
    if (typeof req.query.email === "string") {
      res.status(200).json(await service.getRootUserByEmail(parseOrThrow(getRootUserByEmailQuerySchema, req.query)));
      return;
    }
    const query = parseOrThrow(listRootUsersQuerySchema, req.query);
    res.status(200).json(await service.listRootUsers({ page: query.page, pageSize: query.pageSize, orderBy: query.orderBy, orderDirection: query.orderDirection, filters: { emailPrefix: query.emailPrefix, firstNamePrefix: query.firstNamePrefix, lastNamePrefix: query.lastNamePrefix, createdAtFrom: query.createdAtFrom, createdAtTo: query.createdAtTo, updatedAtFrom: query.updatedAtFrom, updatedAtTo: query.updatedAtTo, deletedAtFrom: query.deletedAtFrom, deletedAtTo: query.deletedAtTo, status: query.status } }));
  } catch (e) { next(e); } });
  router.get("/:rootUserId", requireReadVisible, async (req, res, next) => { try { res.status(200).json(await service.getRootUser(parseOrThrow(getRootUserParamsSchema, req.params))); } catch (e) { next(e); } });
  router.patch("/:rootUserId", requireUpdate, async (req, res, next) => { try { const params = parseOrThrow(updateRootUserParamsSchema, req.params); const body = parseOrThrow(updateRootUserBodySchema, req.body); res.status(200).json(await service.updateRootUser({ ...params, ...body })); } catch (e) { next(e); } });
  router.delete("/:rootUserId", requireDelete, async (req, res, next) => { try { res.status(200).json(await service.deleteRootUser(parseOrThrow(deleteRootUserParamsSchema, req.params))); } catch (e) { next(e); } });
  router.post("/:rootUserId/remove", requireRemove, async (req, res, next) => { try { res.status(200).json(await service.removeRootUser(parseOrThrow(removeRootUserParamsSchema, req.params))); } catch (e) { next(e); } });
  router.post("/:rootUserId/reactivate", requireReactivate, async (req, res, next) => { try { res.status(200).json(await service.reActivateRootUser(parseOrThrow(reActivateRootUserParamsSchema, req.params))); } catch (e) { next(e); } });

  router.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof RootUserError) {
      res.status(error.status).json({ code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) });
      return;
    }
    next(error);
  });
  return router;
}
