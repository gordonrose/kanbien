import type { Pool } from "pg";
import { createRootUsersService } from "./domain/service";
import { createPostgresRootUsersRepository } from "./persistence/postgresRepository";
import { createRootUsersRouter } from "./transport/router";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";

export function createRootUserFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresRootUsersRepository(dbPool);
  const service = createRootUsersService(repository);

  return createRootUsersRouter(service, capabilityChecker, platformSecurityRepository);
}
