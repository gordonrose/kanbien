import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  applyDesignSystemMaterializationBodySchema,
  applyStructureAwareWebAppHierarchySyncBodySchema,
  bootstrapWebAppHierarchyBodySchema,
  createDesignSystemPageBodySchema,
  createDesignSystemSubpageBodySchema,
  createWebAppModuleBodySchema,
  createWebAppPageBodySchema,
  getResolvedWebAppHierarchyTreeQuerySchema,
  listWebAppHierarchyDiscoveryLinksQuerySchema,
  listOrphanedWebAppPagesQuerySchema,
  listPlannerSelectableHierarchyNodesQuerySchema,
  moveWebAppPageBodySchema,
  previewDesignSystemMaterializationBodySchema,
  previewStructureAwareWebAppHierarchySyncBodySchema,
  syncWebAppHierarchyFromDiscoveryBodySchema,
  updateWebAppModuleBodySchema,
  updateWebAppModuleLandingPageBodySchema,
  updateWebAppPageBodySchema,
  webAppModuleIdParamsSchema,
  webAppPageIdParamsSchema,
} from "../contract/schemas";
import { InvalidRequestError, WebAppHierarchyError } from "../contract/errors";
import type { BootstrapWebAppHierarchyInput } from "../domain/types";
import type { WebAppHierarchyBuilderService } from "../domain/service";

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

export function createWebAppHierarchyBuilderRouter(
  service: WebAppHierarchyBuilderService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireCreateModule = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.create-module",
    authzOptions,
  );
  const requireUpdateModule = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.update-module",
    authzOptions,
  );
  const requireUpdateModuleLandingPage = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.update-module-landing-page",
    authzOptions,
  );
  const requireCreatePage = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.create-page",
    authzOptions,
  );
  const requireCreateDesignSystemPage = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.create-design-system-page",
    authzOptions,
  );
  const requireCreateDesignSystemSubpage = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.create-design-system-subpage",
    authzOptions,
  );
  const requireUpdatePage = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.update-page",
    authzOptions,
  );
  const requireMovePage = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.move-page",
    authzOptions,
  );
  const requireReadTree = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.read-tree",
    authzOptions,
  );
  const requirePreviewDesignSystemMaterialization = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.preview-design-system-materialization",
    authzOptions,
  );
  const requireApplyDesignSystemMaterialization = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.apply-design-system-materialization",
    authzOptions,
  );
  const requireReadPlannerOptions = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.read-planner-options",
    authzOptions,
  );
  const requireListOrphans = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.list-orphans",
    authzOptions,
  );
  const requireBootstrap = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.bootstrap",
    authzOptions,
  );
  const requireSyncDiscovery = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.sync-discovery",
    authzOptions,
  );
  const requirePreviewDiscoverySync = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.preview-discovery-sync",
    authzOptions,
  );
  const requireApplyDiscoverySync = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.apply-discovery-sync",
    authzOptions,
  );
  const requireReadDiscoveryLinks = createRequireRootCapability(
    capabilityChecker,
    "web-app-hierarchy.read-discovery-link-status",
    authzOptions,
  );

  router.post("/modules", requireCreateModule, async (request, response, next) => {
    try {
      response
        .status(201)
        .json(await service.createWebAppModule(parseOrThrow(createWebAppModuleBodySchema, request.body)));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/modules/:webAppModuleId", requireUpdateModule, async (request, response, next) => {
    try {
      const params = parseOrThrow(webAppModuleIdParamsSchema, request.params);
      const body = parseOrThrow(updateWebAppModuleBodySchema, request.body);
      response.status(200).json(await service.updateWebAppModule({ ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.patch(
    "/modules/:webAppModuleId/landing-page",
    requireUpdateModuleLandingPage,
    async (request, response, next) => {
      try {
        const params = parseOrThrow(webAppModuleIdParamsSchema, request.params);
        const body = parseOrThrow(updateWebAppModuleLandingPageBodySchema, request.body);
        response.status(200).json(await service.updateModuleLandingPage({ ...params, ...body }));
      } catch (error) {
        next(error);
      }
    },
  );

  router.post("/pages", requireCreatePage, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      response.status(201).json(
        await service.createWebAppPage({
          ...parseOrThrow(createWebAppPageBodySchema, request.body),
          createdByRootAdminUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/design-system/pages", requireCreateDesignSystemPage, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      response.status(201).json(
        await service.createDesignSystemPageProposal({
          ...parseOrThrow(createDesignSystemPageBodySchema, request.body),
          createdByRootAdminUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/design-system/subpages",
    requireCreateDesignSystemSubpage,
    async (request, response, next) => {
      try {
        const session = getRequiredRootSessionContext(request);
        response.status(201).json(
          await service.createDesignSystemSubpageProposal({
            ...parseOrThrow(createDesignSystemSubpageBodySchema, request.body),
            createdByRootAdminUserId: session.rootUserId,
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.patch("/pages/:webAppPageId", requireUpdatePage, async (request, response, next) => {
    try {
      const params = parseOrThrow(webAppPageIdParamsSchema, request.params);
      const body = parseOrThrow(updateWebAppPageBodySchema, request.body);
      response.status(200).json(await service.updateWebAppPage({ ...params, ...body }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/pages/:webAppPageId/move", requireMovePage, async (request, response, next) => {
    try {
      const params = parseOrThrow(webAppPageIdParamsSchema, request.params);
      const body = parseOrThrow(moveWebAppPageBodySchema, request.body);
      response.status(200).json(
        await service.moveWebAppPage({
          webAppPageId: params.webAppPageId,
          rootFamilyId: body.rootFamilyId,
          webAppModuleId: body.webAppModuleId,
          targetParentPageId: body.targetParentPageId,
          placementType: body.placementType,
          sortOrder: body.sortOrder,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/tree", requireReadTree, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getResolvedWebAppHierarchyTree(
          parseOrThrow(getResolvedWebAppHierarchyTreeQuerySchema, request.query),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/design-system/applied-tree", requireReadTree, async (_request, response, next) => {
    try {
      response.status(200).json(await service.readAppliedDesignSystemTopologyTree());
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/design-system/materialization/preview",
    requirePreviewDesignSystemMaterialization,
    async (request, response, next) => {
      try {
        response.status(200).json(
          await service.previewDesignSystemMaterialization(
            parseOrThrow(previewDesignSystemMaterializationBodySchema, request.body),
          ),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    "/design-system/materialization/apply",
    requireApplyDesignSystemMaterialization,
    async (request, response, next) => {
      try {
        const session = getRequiredRootSessionContext(request);
        response.status(200).json(
          await service.applyDesignSystemMaterialization({
            ...parseOrThrow(applyDesignSystemMaterializationBodySchema, request.body),
            createdByRootAdminUserId: session.rootUserId,
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.get("/planner-nodes", requireReadPlannerOptions, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.listPlannerSelectableHierarchyNodes(
          parseOrThrow(listPlannerSelectableHierarchyNodesQuerySchema, request.query),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/orphaned-pages", requireListOrphans, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.listOrphanedWebAppPages(
          parseOrThrow(listOrphanedWebAppPagesQuerySchema, request.query),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/bootstrap", requireBootstrap, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const body = parseOrThrow(
        bootstrapWebAppHierarchyBodySchema,
        request.body,
      ) as Omit<BootstrapWebAppHierarchyInput, "createdByRootAdminUserId">;
      response.status(200).json(
        await service.bootstrapWebAppHierarchy({
          ...body,
          createdByRootAdminUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/sync-discovery", requireSyncDiscovery, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const body = parseOrThrow(syncWebAppHierarchyFromDiscoveryBodySchema, request.body);
      response.status(200).json(
        await service.syncWebAppHierarchyFromDiscovery({
          ...body,
          createdByRootAdminUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/discovery-sync/preview", requirePreviewDiscoverySync, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.previewStructureAwareWebAppHierarchySync(
          parseOrThrow(previewStructureAwareWebAppHierarchySyncBodySchema, request.body),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/discovery-sync/apply", requireApplyDiscoverySync, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      response.status(200).json(
        await service.applyStructureAwareWebAppHierarchySync({
          ...parseOrThrow(applyStructureAwareWebAppHierarchySyncBodySchema, request.body),
          createdByRootAdminUserId: session.rootUserId,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/discovery-links", requireReadDiscoveryLinks, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.listWebAppHierarchyDiscoveryLinks(
          parseOrThrow(listWebAppHierarchyDiscoveryLinksQuerySchema, request.query),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof WebAppHierarchyError) {
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
