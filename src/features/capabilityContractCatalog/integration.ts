import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createCapabilityContractCatalogService } from "./domain/service";
import { createPostgresCapabilityContractCatalogRepository } from "./persistence/postgresRepository";
import { createCapabilityContractCatalogRouter } from "./transport/router";

export function createCapabilityContractCatalogFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresCapabilityContractCatalogRepository(dbPool);
  const service = createCapabilityContractCatalogService(repository);

  return createCapabilityContractCatalogRouter(
    service,
    capabilityChecker,
    platformSecurityRepository,
  );
}
