import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  discoveredWebAppStructureNodeIdParamsSchema,
  discoveredWebAppSurfaceIdParamsSchema,
  listDiscoveredWebAppStructureTreeQuerySchema,
  listDiscoveredWebAppSurfacesQuerySchema,
  listWebAppDiscoveryRunsQuerySchema,
  runWebAppSurfaceDiscoveryBodySchema,
  webAppDiscoveryRunIdParamsSchema,
} from "../contract/schemas";
import {
  InvalidRequestError,
  WebAppSurfaceDiscoveryError,
} from "../contract/errors";
import type { WebAppSurfaceDiscoveryService } from "../domain/service";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && "keys" in issue && issue.keys[0]) {
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

export function createWebAppSurfaceDiscoveryRouter(
  service: WebAppSurfaceDiscoveryService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireRun = createRequireRootCapability(
    capabilityChecker,
    "web-app-surface-discovery.run",
    authzOptions,
  );
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "web-app-surface-discovery.read",
    authzOptions,
  );
  const requireReadRuns = createRequireRootCapability(
    capabilityChecker,
    "web-app-surface-discovery.read-runs",
    authzOptions,
  );
  const requireReadStructure = createRequireRootCapability(
    capabilityChecker,
    "web-app-surface-discovery.read-structure",
    authzOptions,
  );

  router.post("/runs", requireRun, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      response.status(200).json(
        await service.runWebAppSurfaceDiscovery({
          ...parseOrThrow(runWebAppSurfaceDiscoveryBodySchema, request.body),
          createdByRootAdminUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/surfaces/:discoveredWebAppSurfaceId", requireRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(discoveredWebAppSurfaceIdParamsSchema, request.params);
      response.status(200).json(
        await service.getDiscoveredWebAppSurface(params.discoveredWebAppSurfaceId),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/surfaces", requireRead, async (request, response, next) => {
    try {
      const query = parseOrThrow(listDiscoveredWebAppSurfacesQuerySchema, request.query);
      response.status(200).json(
        await service.listDiscoveredWebAppSurfaces({
          page: query.page,
          pageSize: query.pageSize,
          filters: {
            rootFamilyId: query.rootFamilyId,
            surfaceKind: query.surfaceKind,
            userFacingDisposition: query.userFacingDisposition,
            providerKey: query.providerKey,
            staleStatus: query.staleStatus,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/structure/:discoveredWebAppStructureNodeId",
    requireReadStructure,
    async (request, response, next) => {
      try {
        const params = parseOrThrow(
          discoveredWebAppStructureNodeIdParamsSchema,
          request.params,
        );
        response.status(200).json(
          await service.getDiscoveredWebAppStructureNode(
            params.discoveredWebAppStructureNodeId,
          ),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.get("/structure", requireReadStructure, async (request, response, next) => {
    try {
      const query = parseOrThrow(listDiscoveredWebAppStructureTreeQuerySchema, request.query);
      response.status(200).json(
        await service.listDiscoveredWebAppStructureTree({
          filters: {
            rootFamilyId: query.rootFamilyId,
            staleStatus: query.staleStatus,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/runs/:webAppDiscoveryRunId", requireReadRuns, async (request, response, next) => {
    try {
      const params = parseOrThrow(webAppDiscoveryRunIdParamsSchema, request.params);
      response.status(200).json(await service.getWebAppDiscoveryRun(params.webAppDiscoveryRunId));
    } catch (error) {
      next(error);
    }
  });

  router.get("/runs", requireReadRuns, async (request, response, next) => {
    try {
      const query = parseOrThrow(listWebAppDiscoveryRunsQuerySchema, request.query);
      response.status(200).json(
        await service.listWebAppDiscoveryRuns({
          page: query.page,
          pageSize: query.pageSize,
          filters: {
            status: query.status,
            triggerKind: query.triggerKind,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof WebAppSurfaceDiscoveryError) {
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
