import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  getWebAppPageSettingsOptionsQuerySchema,
  updateWebAppPageSettingsBodySchema,
  webAppPageContextNavProjectionParamsSchema,
  webAppPageIdParamsSchema,
} from "../contract/schemas";
import { InvalidRequestError, WebAppPageSettingsError } from "../contract/errors";
import type { WebAppPageSettingsService } from "../domain/service";

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

export function createWebAppPageSettingsRouter(
  service: WebAppPageSettingsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "web-app-page-settings.read",
    authzOptions,
  );
  const requireUpdate = createRequireRootCapability(
    capabilityChecker,
    "web-app-page-settings.update",
    authzOptions,
  );
  const requireReadOptions = createRequireRootCapability(
    capabilityChecker,
    "web-app-page-settings.read-options",
    authzOptions,
  );

  router.get(
    "/root-families/:rootFamilyId/pages/:pageKey/context-nav",
    requireRead,
    async (request, response, next) => {
      try {
        response.status(200).json(
          await service.getWebAppPageContextNavProjection(
            parseOrThrow(webAppPageContextNavProjectionParamsSchema, request.params),
          ),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.get("/pages/:webAppPageId", requireRead, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getWebAppPageSettings(
          parseOrThrow(webAppPageIdParamsSchema, request.params),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.put("/pages/:webAppPageId", requireUpdate, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.updateWebAppPageSettings({
          ...parseOrThrow(webAppPageIdParamsSchema, request.params),
          ...parseOrThrow(updateWebAppPageSettingsBodySchema, request.body),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/options", requireReadOptions, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getWebAppPageSettingsOptions(
          parseOrThrow(getWebAppPageSettingsOptionsQuerySchema, request.query),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof WebAppPageSettingsError) {
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
