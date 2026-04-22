import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  canonicalFamilyIdParamsSchema,
  canonicalReferenceIdParamsSchema,
  createCanonicalFamilyBodySchema,
  createCanonicalReferenceBodySchema,
  familyKeyParamsSchema,
  familyKeyReferenceIdParamsSchema,
  updateCanonicalFamilyBodySchema,
  updateCanonicalReferenceBodySchema,
} from "../contract/schemas";
import { DesignSystemCanonicalsError, InvalidRequestError } from "../contract/errors";
import type { DesignSystemCanonicalsService } from "../domain/service";

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

export function createDesignSystemCanonicalsRouter(
  service: DesignSystemCanonicalsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireManageFamilies = createRequireRootCapability(
    capabilityChecker,
    "design-system-canonicals.family.manage",
    authzOptions,
  );
  const requireManageReferences = createRequireRootCapability(
    capabilityChecker,
    "design-system-canonicals.reference.manage",
    authzOptions,
  );

  router.post("/families", requireManageFamilies, async (request, response, next) => {
    try {
      response.status(201).json(
        await service.createCanonicalFamily(
          parseOrThrow(createCanonicalFamilyBodySchema, request.body),
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/families/:canonicalFamilyId", requireManageFamilies, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getCanonicalFamilyById(
          parseOrThrow(canonicalFamilyIdParamsSchema, request.params).canonicalFamilyId,
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.put("/families/:canonicalFamilyId", requireManageFamilies, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.updateCanonicalFamily({
          ...parseOrThrow(canonicalFamilyIdParamsSchema, request.params),
          ...parseOrThrow(updateCanonicalFamilyBodySchema, request.body),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/families/:canonicalFamilyId/references",
    requireManageReferences,
    async (request, response, next) => {
      try {
        response.status(201).json(
          await service.createCanonicalReference({
            ...parseOrThrow(canonicalFamilyIdParamsSchema, request.params),
            ...parseOrThrow(createCanonicalReferenceBodySchema, request.body),
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    "/references/:canonicalReferenceId",
    requireManageReferences,
    async (request, response, next) => {
      try {
        response.status(200).json(
          await service.getCanonicalReferenceById(
            parseOrThrow(canonicalReferenceIdParamsSchema, request.params).canonicalReferenceId,
          ),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    "/references/:canonicalReferenceId",
    requireManageReferences,
    async (request, response, next) => {
      try {
        response.status(200).json(
          await service.updateCanonicalReference({
            ...parseOrThrow(canonicalReferenceIdParamsSchema, request.params),
            ...parseOrThrow(updateCanonicalReferenceBodySchema, request.body),
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.get("/public/families", async (_request, response, next) => {
    try {
      response.status(200).json(await service.listLiveFamilies());
    } catch (error) {
      next(error);
    }
  });

  router.get("/public/families/:familyKey/launcher", async (request, response, next) => {
    try {
      response.status(200).json(
        await service.getPublicLauncherByFamilyKey(
          parseOrThrow(familyKeyParamsSchema, request.params).familyKey,
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/public/families/:familyKey/references/:referenceId",
    async (request, response, next) => {
      try {
        const params = parseOrThrow(familyKeyReferenceIdParamsSchema, request.params);
        response.status(200).json(
          await service.getPublicRenderingByFamilyKeyAndReferenceId(
            params.familyKey,
            params.referenceId,
          ),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof DesignSystemCanonicalsError) {
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

