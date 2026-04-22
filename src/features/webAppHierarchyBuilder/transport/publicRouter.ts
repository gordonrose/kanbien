import { Router, type NextFunction, type Request, type Response } from "express";
import type { WebAppHierarchyBuilderService } from "../domain/service";
import { WebAppHierarchyError } from "../contract/errors";

export function createPublicWebAppHierarchyBuilderRouter(
  service: Pick<WebAppHierarchyBuilderService, "readAppliedDesignSystemTopologyTree">,
): Router {
  const router = Router();

  router.get("/design-system/applied-tree", async (_request, response, next) => {
    try {
      response.status(200).json(await service.readAppliedDesignSystemTopologyTree());
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
