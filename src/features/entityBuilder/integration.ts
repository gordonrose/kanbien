import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createEntityBuilderService } from "./domain/service";
import { createPostgresEntityBuilderRepository } from "./persistence/postgresRepository";
import { createEntityBuilderRouter } from "./transport/router";

export function createEntityBuilderFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresEntityBuilderRepository(dbPool);
  const service = createEntityBuilderService(repository);

  return createEntityBuilderRouter(service, capabilityChecker, platformSecurityRepository);
}
