import { Router, type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";
import {
  createRootUserBodySchema,
  getRootUserByEmailQuerySchema,
  getRootUserParamsSchema,
  listActiveRootUsersQuerySchema,
  listDeletedRootUsersQuerySchema,
  listRootUsersQuerySchema,
  updateRootUserBodySchema,
} from "../contract/schemas";
import { RootUsersError, InvalidRequestError } from "../contract/errors";
import { createRootUsersService } from "../domain/service";
import { createPostgresRootUsersRepository } from "../persistence/postgresRepository";

type QueryValue = string | undefined;

const parseDateRange = (from?: QueryValue, to?: QueryValue) =>
  from || to ? { from, to } : undefined;

const sendError = (error: unknown, response: Response) => {
  if (error instanceof RootUsersError) {
    return response.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      code: "INVALID_REQUEST",
      message:
        "Your request could not be accepted because one or more fields are missing or invalid.",
      details: {
        issues: error.issues.map((issue) => ({
          field: issue.path.join("."),
          reason: issue.message,
        })),
      },
    });
  }

  return response.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Something went wrong while processing the request.",
  });
};

export interface RootUsersRouterDependencies {
  dbPool: {
    query: (...args: any[]) => Promise<any>;
  };
}

export const createRootUsersRouter = (
  dependencies: RootUsersRouterDependencies,
): Router => {
  const router = Router();
  const repository = createPostgresRootUsersRepository(dependencies.dbPool as any);
  const service = createRootUsersService(repository);

  const wrap =
    (
      handler: (request: Request, response: Response, next: NextFunction) => Promise<void>,
    ) =>
    (request: Request, response: Response, next: NextFunction) =>
      handler(request, response, next).catch((error) => sendError(error, response));

  router.post(
    "/",
    wrap(async (request, response) => {
      const body = createRootUserBodySchema.parse(request.body);
      const created = await service.createRootUser(body);
      response.status(201).json({ body: created });
    }),
  );

  router.get(
    "/by-email",
    wrap(async (request, response) => {
      const query = getRootUserByEmailQuerySchema.parse(request.query);
      const item = await service.getRootUserByEmail({ email: query.email });
      response.status(200).json({ body: item });
    }),
  );

  router.get(
    "/active",
    wrap(async (request, response) => {
      const query = listActiveRootUsersQuerySchema.parse(request.query);
      const result = await service.listActiveRootUsers({
        page: query.page,
        pageSize: query.pageSize,
        orderBy: query.orderBy,
        orderDirection: query.orderDirection,
        filters: {
          emailPrefix: query.emailPrefix,
          firstNamePrefix: query.firstNamePrefix,
          lastNamePrefix: query.lastNamePrefix,
          createdAt: parseDateRange(query.createdAtFrom, query.createdAtTo),
          updatedAt: parseDateRange(query.updatedAtFrom, query.updatedAtTo),
        },
      });
      response.status(200).json({ body: result });
    }),
  );

  router.get(
    "/deleted",
    wrap(async (request, response) => {
      const query = listDeletedRootUsersQuerySchema.parse(request.query);
      const result = await service.listDeletedRootUsers({
        page: query.page,
        pageSize: query.pageSize,
        orderBy: query.orderBy,
        orderDirection: query.orderDirection,
        filters: {
          emailPrefix: query.emailPrefix,
          firstNamePrefix: query.firstNamePrefix,
          lastNamePrefix: query.lastNamePrefix,
          createdAt: parseDateRange(query.createdAtFrom, query.createdAtTo),
          updatedAt: parseDateRange(query.updatedAtFrom, query.updatedAtTo),
          deletedAt: parseDateRange(query.deletedAtFrom, query.deletedAtTo),
          excludeAnonymized: query.excludeAnonymized,
        },
      });
      response.status(200).json({ body: result });
    }),
  );

  router.get(
    "/:rootUserId",
    wrap(async (request, response) => {
      const params = getRootUserParamsSchema.parse(request.params);
      const item = await service.getRootUser(params);
      response.status(200).json({ body: item });
    }),
  );

  router.get(
    "/",
    wrap(async (request, response) => {
      if ("email" in request.query) {
        throw new InvalidRequestError(
          "Use GET /v1/root-users/by-email for exact email lookup.",
        );
      }

      const query = listRootUsersQuerySchema.parse(request.query);
      const result = await service.listRootUsers({
        page: query.page,
        pageSize: query.pageSize,
        orderBy: query.orderBy,
        orderDirection: query.orderDirection,
        filters: {
          emailPrefix: query.emailPrefix,
          firstNamePrefix: query.firstNamePrefix,
          lastNamePrefix: query.lastNamePrefix,
          createdAt: parseDateRange(query.createdAtFrom, query.createdAtTo),
          updatedAt: parseDateRange(query.updatedAtFrom, query.updatedAtTo),
          deletedAt: parseDateRange(query.deletedAtFrom, query.deletedAtTo),
          status: query.status,
        },
      });
      response.status(200).json({ body: result });
    }),
  );

  router.patch(
    "/:rootUserId",
    wrap(async (request, response) => {
      const params = getRootUserParamsSchema.parse(request.params);
      const body = updateRootUserBodySchema.parse(request.body);
      const item = await service.updateRootUser({
        rootUserId: params.rootUserId,
        ...body,
      });
      response.status(200).json({ body: item });
    }),
  );

  router.delete(
    "/:rootUserId",
    wrap(async (request, response) => {
      const params = getRootUserParamsSchema.parse(request.params);
      const item = await service.deleteRootUser(params);
      response.status(200).json({ body: item });
    }),
  );

  router.post(
    "/:rootUserId/remove",
    wrap(async (request, response) => {
      const params = getRootUserParamsSchema.parse(request.params);
      const item = await service.removeRootUser(params);
      response.status(200).json({ body: item });
    }),
  );

  router.post(
    "/:rootUserId/reactivate",
    wrap(async (request, response) => {
      const params = getRootUserParamsSchema.parse(request.params);
      const item = await service.reActivateRootUser(params);
      response.status(200).json({ body: item });
    }),
  );

  return router;
};
