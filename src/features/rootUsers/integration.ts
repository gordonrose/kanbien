import type { Pool } from "pg";
import { createRootUsersService } from "./domain/service";
import { createPostgresRootUsersRepository } from "./persistence/postgresRepository";
import { createRootUsersRouter } from "./transport/router";
import type { AssetsService } from "../assets";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";

export function createRootUserFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
  assetsService?: AssetsService,
) {
  const repository = createPostgresRootUsersRepository(dbPool);
  const service = createRootUsersService(repository, assetsService);

  return createRootUsersRouter(service, capabilityChecker, platformSecurityRepository);
}
