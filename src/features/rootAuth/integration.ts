import type { Pool } from "pg";
import { createRootUsersAuthStateReader, createRootUsersBrowserSummaryReader } from "../rootUsers";
import { createPostgresRootAuthRepository } from "./persistence/postgresRepository";
import { createRootAuthRouter } from "./transport/router";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";

export function createRootAuthFeature(
  dbPool: Pool,
  platformSecurityRepository: PlatformSecurityRepository,
  capabilityChecker: RootCapabilityChecker,
) {
  const rootAuthRepository = createPostgresRootAuthRepository(dbPool);
  const rootUsersAuthStateReader = createRootUsersAuthStateReader(dbPool);
  const rootUsersBrowserSummaryReader = createRootUsersBrowserSummaryReader(dbPool);

  return createRootAuthRouter(
    rootAuthRepository,
    rootUsersAuthStateReader,
    rootUsersBrowserSummaryReader,
    platformSecurityRepository,
    capabilityChecker,
  );
}
