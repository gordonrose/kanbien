import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createTenantsService } from "./domain/service";
import { createPostgresTenantsRepository } from "./persistence/postgresRepository";
import { createTenantsRouter } from "./transport/router";

export function createTenantsFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresTenantsRepository(dbPool);
  const service = createTenantsService(repository);

  return createTenantsRouter(service, capabilityChecker, platformSecurityRepository);
}
