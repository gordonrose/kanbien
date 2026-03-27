import type { Pool } from "pg";
import { createRootUsersAuthStateReader, createRootUsersBrowserSummaryReader } from "../rootUsers";
import { createPostgresRootAuthRepository } from "./persistence/postgresRepository";
import { createRootAuthRouter } from "./transport/router";
import type { PlatformSecurityRepository } from "../../lib/security/repository";

export function createRootAuthFeature(
  dbPool: Pool,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const rootAuthRepository = createPostgresRootAuthRepository(dbPool);
  const rootUsersAuthStateReader = createRootUsersAuthStateReader(dbPool);
  const rootUsersBrowserSummaryReader = createRootUsersBrowserSummaryReader(dbPool);

  return createRootAuthRouter(
    rootAuthRepository,
    rootUsersAuthStateReader,
    rootUsersBrowserSummaryReader,
    platformSecurityRepository,
  );
}
