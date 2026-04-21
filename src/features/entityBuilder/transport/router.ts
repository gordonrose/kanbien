import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  createEntityDefinitionVersionBodySchema,
  entityDefinitionVersionIdParamsSchema,
  entityKeyParamsSchema,
  exportEntityDefinitionsBodySchema,
  listEntityDefinitionsQuerySchema,
  updateEntityDefinitionVersionBodySchema,
} from "../contract/schemas";
import { EntityBuilderError, InvalidRequestError } from "../contract/errors";
import type { EntityBuilderService } from "../domain/service";

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

export function createEntityBuilderRouter(
  service: EntityBuilderService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireCreate = createRequireRootCapability(
    capabilityChecker,
    "entity-builder.create",
    authzOptions,
  );
  const requireUpdate = createRequireRootCapability(
    capabilityChecker,
    "entity-builder.update",
    authzOptions,
  );
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "entity-builder.read",
    authzOptions,
  );
  const requireCatalogRead = createRequireRootCapability(
    capabilityChecker,
    "entity-builder.catalog.read",
    authzOptions,
  );
  const requireValidate = createRequireRootCapability(
    capabilityChecker,
    "entity-builder.validate",
    authzOptions,
  );
  const requireExport = createRequireRootCapability(
    capabilityChecker,
    "entity-builder.export",
    authzOptions,
  );

  router.post("/", requireCreate, async (request, response, next) => {
    try {
      response
        .status(201)
        .json(
          await service.createEntityDefinitionVersion(
            parseOrThrow(createEntityDefinitionVersionBodySchema, request.body),
          ),
        );
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:entityDefinitionVersionId", requireUpdate, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.updateDraftEntityDefinitionVersion({
          ...parseOrThrow(entityDefinitionVersionIdParamsSchema, request.params),
          ...parseOrThrow(updateEntityDefinitionVersionBodySchema, request.body),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/by-key/:entityKey", requireRead, async (request, response, next) => {
    try {
      response
        .status(200)
        .json(
          await service.getEntityDefinitionCurrent(
            parseOrThrow(entityKeyParamsSchema, request.params),
          ),
        );
    } catch (error) {
      next(error);
    }
  });

  router.get("/versions/:entityDefinitionVersionId", requireRead, async (request, response, next) => {
    try {
      response
        .status(200)
        .json(
          await service.getEntityDefinitionVersion(
            parseOrThrow(entityDefinitionVersionIdParamsSchema, request.params),
          ),
        );
    } catch (error) {
      next(error);
    }
  });

  router.get("/", requireRead, async (request, response, next) => {
    try {
      const query = parseOrThrow(listEntityDefinitionsQuerySchema, request.query);
      response.status(200).json(
        await service.listEntityDefinitions({
          page: query.page,
          pageSize: query.pageSize,
          orderBy: query.orderBy,
          orderDirection: query.orderDirection,
          filters: {
            entityKeyPrefix: query.entityKeyPrefix,
            entityNamePrefix: query.entityNamePrefix,
            status: query.status,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/catalogs/attribute-types", requireCatalogRead, (_request, response) => {
    response.status(200).json(service.listAttributeTypeCatalog());
  });

  router.get("/catalogs/form-patterns", requireCatalogRead, (_request, response) => {
    response.status(200).json(service.listApprovedFormPatterns());
  });

  router.post(
    "/versions/:entityDefinitionVersionId/validate",
    requireValidate,
    async (request, response, next) => {
      try {
        const { entityDefinitionVersionId } = parseOrThrow(
          entityDefinitionVersionIdParamsSchema,
          request.params,
        );
        response.status(200).json(await service.validateEntityDefinitionVersion(entityDefinitionVersionId));
      } catch (error) {
        next(error);
      }
    },
  );

  router.post("/export", requireExport, async (request, response, next) => {
    try {
      response
        .status(200)
        .json(
          await service.exportEntityDefinitionSnapshot(
            parseOrThrow(exportEntityDefinitionsBodySchema, request.body),
          ),
        );
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof EntityBuilderError) {
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
