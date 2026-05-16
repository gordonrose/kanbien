import type { Pool } from "pg";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import { createOrganizationCoreService } from "./domain/service";
import { createPostgresOrganizationCoreRepository } from "./persistence/postgresRepository";
import {
  createRootOrganizationCoreRouter,
  createTenantOrganizationCoreRouter,
} from "./transport/router";

export function createOrganizationCoreFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresOrganizationCoreRepository(dbPool);
  const service = createOrganizationCoreService(repository);

  return {
    organizationCoreService: service,
    rootOrganizationCoreRouter: createRootOrganizationCoreRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    tenantOrganizationCoreRouter: createTenantOrganizationCoreRouter(
      tenantSessionLookupRepository,
      service,
    ),
  };
}
