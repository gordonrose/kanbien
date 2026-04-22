import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { InvalidRequestError, WebAppPageSettingsError } from "../contract/errors";
import { webAppPageIdParamsSchema } from "../contract/schemas";
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

export function createPublicWebAppPageSettingsRouter(
  service: Pick<WebAppPageSettingsService, "getPublicDesignSystemPageSettings">,
): Router {
  const router = Router();

  router.get("/pages/:webAppPageId", async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getPublicDesignSystemPageSettings(
          parseOrThrow(webAppPageIdParamsSchema, request.params),
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
