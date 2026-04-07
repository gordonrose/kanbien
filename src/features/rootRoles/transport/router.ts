import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  createRequireAnyRootCapability,
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  assignRootRoleBodySchema,
  createRootRoleBodySchema,
  listCapabilityAssignmentsQuerySchema,
  listRootRolesQuerySchema,
  listRootUserAssignmentsQuerySchema,
  replaceRootRoleAssignmentBodySchema,
  rootRoleAssignmentParamsSchema,
  rootRoleIdParamsSchema,
  rootUserIdParamsSchema,
  unassignRootRoleBodySchema,
  updateCapabilityGrantsBodySchema,
  updateRootRoleBodySchema,
} from "../contract/schemas";
import { InvalidRequestError, RootRoleError } from "../contract/errors";
import type { RootRolesService } from "../domain/service";

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

function handleRootRoleErrors(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof RootRoleError) {
    response.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }
  next(error);
}

export function createRootRolesRouter(
  service: RootRolesService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireCreate = createRequireRootCapability(
    capabilityChecker,
    "root-role.create",
    authzOptions,
  );
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "root-role.read",
    authzOptions,
  );
  const requireList = createRequireRootCapability(
    capabilityChecker,
    "root-role.list",
    authzOptions,
  );
  const requireUpdate = createRequireRootCapability(
    capabilityChecker,
    "root-role.update",
    authzOptions,
  );
  const requireDelete = createRequireRootCapability(
    capabilityChecker,
    "root-role.delete",
    authzOptions,
  );
  const requireReactivate = createRequireRootCapability(
    capabilityChecker,
    "root-role.reactivate",
    authzOptions,
  );
  const requireCatalogRead = createRequireAnyRootCapability(
    capabilityChecker,
    [
      "root-role.capability-catalog.read",
      "root-role.create",
      "root-role.update",
      "root-role.capability-assignment.update",
    ],
    authzOptions,
  );
  const requireCapabilityRead = createRequireAnyRootCapability(
    capabilityChecker,
    [
      "root-role.capability-assignment.read",
      "root-role.update",
      "root-role.capability-assignment.update",
    ],
    authzOptions,
  );
  const requireCapabilityUpdate = createRequireRootCapability(
    capabilityChecker,
    "root-role.capability-assignment.update",
    authzOptions,
  );

  router.post("/", requireCreate, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      response.status(201).json(
        await service.createSystemRootRole({
          ...parseOrThrow(createRootRoleBodySchema, request.body),
          actorRootUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/", requireList, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.listSystemRootRoles(parseOrThrow(listRootRolesQuerySchema, request.query)),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/:rootRoleId", requireRead, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getSystemRootRole(parseOrThrow(rootRoleIdParamsSchema, request.params)),
      );
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:rootRoleId", requireUpdate, async (request, response, next) => {
    try {
      const params = parseOrThrow(rootRoleIdParamsSchema, request.params);
      const body = parseOrThrow(updateRootRoleBodySchema, request.body);
      const session = getRequiredRootSessionContext(request);
      response.status(200).json(
        await service.updateSystemRootRole({
          ...params,
          ...body,
          actorRootUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/:rootRoleId/deactivate", requireDelete, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      response.status(200).json(
        await service.deleteSystemRootRole({
          ...parseOrThrow(rootRoleIdParamsSchema, request.params),
          actorRootUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/:rootRoleId/reactivate", requireReactivate, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      response.status(200).json(
        await service.reactivateSystemRootRole(
          {
            ...parseOrThrow(rootRoleIdParamsSchema, request.params),
            actorRootUserId: session.rootUserId,
          },
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/:rootRoleId/eligible-authz-capabilities",
    requireCatalogRead,
    async (request, response, next) => {
      try {
        const params = parseOrThrow(rootRoleIdParamsSchema, request.params);
        const query = parseOrThrow(listCapabilityAssignmentsQuerySchema, request.query);
        response.status(200).json(
          await service.listSystemRootRoleEligibleAuthzCapabilities({
            ...params,
            ...query,
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    "/:rootRoleId/capability-assignments",
    requireCapabilityRead,
    async (request, response, next) => {
      try {
        const params = parseOrThrow(rootRoleIdParamsSchema, request.params);
        const query = parseOrThrow(listCapabilityAssignmentsQuerySchema, request.query);
        response.status(200).json(
          await service.listSystemRootRoleCapabilityAssignments({
            ...params,
            ...query,
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    "/:rootRoleId/capability-assignments",
    requireCapabilityUpdate,
    async (request, response, next) => {
      try {
        const params = parseOrThrow(rootRoleIdParamsSchema, request.params);
        const body = parseOrThrow(updateCapabilityGrantsBodySchema, request.body);
        const session = getRequiredRootSessionContext(request);
        response.status(200).json(
          await service.updateSystemRootRoleCapabilityGrants({
            ...params,
            ...body,
            actorRootUserId: session.rootUserId,
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.use(handleRootRoleErrors);
  return router;
}

export function createRootUserRoleAssignmentsRouter(
  service: RootRolesService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireAssign = createRequireRootCapability(
    capabilityChecker,
    "root-role.assignment.assign",
    authzOptions,
  );
  const requireUnassign = createRequireRootCapability(
    capabilityChecker,
    "root-role.assignment.unassign",
    authzOptions,
  );
  const requireList = createRequireRootCapability(
    capabilityChecker,
    "root-role.assignment.list",
    authzOptions,
  );
  const requireReplace = createRequireRootCapability(
    capabilityChecker,
    "root-role.assignment.replace",
    authzOptions,
  );
  const requireEffectiveRead = createRequireRootCapability(
    capabilityChecker,
    "root-role.effective-permissions.read",
    authzOptions,
  );

  router.post("/:rootUserId/root-role-assignments", requireAssign, async (request, response, next) => {
    try {
      const params = parseOrThrow(rootUserIdParamsSchema, request.params);
      const body = parseOrThrow(assignRootRoleBodySchema, request.body);
      const session = getRequiredRootSessionContext(request);
      response.status(201).json(
        await service.assignSystemRootRoleToRootUser({
          ...params,
          ...body,
          actorRootUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/:rootUserId/root-role-assignments/:rootRoleAssignmentId/unassign",
    requireUnassign,
    async (request, response, next) => {
      try {
        const params = parseOrThrow(rootRoleAssignmentParamsSchema, request.params);
        const body = parseOrThrow(unassignRootRoleBodySchema, request.body);
        const session = getRequiredRootSessionContext(request);
        response.status(200).json(
          await service.unassignSystemRootRoleFromRootUser({
            ...params,
            ...body,
            actorRootUserId: session.rootUserId,
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.get("/:rootUserId/root-roles", requireList, async (request, response, next) => {
    try {
      const params = parseOrThrow(rootUserIdParamsSchema, request.params);
      const query = parseOrThrow(listRootUserAssignmentsQuerySchema, request.query);
      response.status(200).json(
        await service.listRootUserAssignedSystemRootRoles({
          ...params,
          ...query,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/:rootUserId/root-role-assignments/replace",
    requireReplace,
    async (request, response, next) => {
      try {
        const params = parseOrThrow(rootUserIdParamsSchema, request.params);
        const body = parseOrThrow(replaceRootRoleAssignmentBodySchema, request.body);
        const session = getRequiredRootSessionContext(request);
        response.status(200).json(
          await service.replaceRootUserSystemRootRole({
            ...params,
            ...body,
            actorRootUserId: session.rootUserId,
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.get("/:rootUserId/effective-permissions", requireEffectiveRead, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getEffectiveRootUserPermissions(
          parseOrThrow(rootUserIdParamsSchema, request.params),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use(handleRootRoleErrors);
  return router;
}
