import type { Pool } from "pg";
import { createRootUsersService } from "./domain/service";
import { createPostgresRootUsersRepository } from "./persistence/postgresRepository";
import { createRootUsersRouter } from "./transport/router";

export function createRootUserFeature(dbPool: Pool) {
  const repository = createPostgresRootUsersRepository(dbPool);
  const service = createRootUsersService(repository);

  return createRootUsersRouter(service);
}
