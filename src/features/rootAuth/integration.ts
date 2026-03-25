import type { Pool } from "pg";
import { createRootUsersAuthStateReader } from "../rootUsers";
import { createPostgresRootAuthRepository } from "./persistence/postgresRepository";
import { createRootAuthRouter } from "./transport/router";
import type { PlatformSecurityRepository } from "../../lib/security/repository";

export function createRootAuthFeature(
  dbPool: Pool,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const rootAuthRepository = createPostgresRootAuthRepository(dbPool);
  const rootUsersAuthStateReader = createRootUsersAuthStateReader(dbPool);

  return createRootAuthRouter(
    rootAuthRepository,
    rootUsersAuthStateReader,
    platformSecurityRepository,
  );
}
