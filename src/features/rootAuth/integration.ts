import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "../rootUsers/persistence/postgresRepository";
import { createPostgresRootAuthRepository } from "./persistence/postgresRepository";
import { createRootAuthRouter } from "./transport/router";

export function createRootAuthFeature(dbPool: Pool) {
  const rootAuthRepository = createPostgresRootAuthRepository(dbPool);
  const rootUsersRepository = createPostgresRootUsersRepository(dbPool);

  return createRootAuthRouter(rootAuthRepository, rootUsersRepository);
}
