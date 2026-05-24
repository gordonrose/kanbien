import type { Pool } from "pg";
import { createEntityService } from "./domain/service";
import { createPostgresEntityRepository } from "./persistence/postgresRepository";
import { createEntityRouter } from "./transport/router";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";

export function createEntityFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresEntityRepository(dbPool);
  const service = createEntityService(repository);
  return createEntityRouter(service, capabilityChecker, platformSecurityRepository);
}
