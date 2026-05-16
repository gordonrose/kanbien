import type { Pool } from "pg";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import { createOrganizationSearchService } from "./domain/service";
import { createPostgresOrganizationSearchRepository } from "./persistence/postgresRepository";
import {
  createRootOrganizationSearchRouter,
  createTenantOrganizationSearchRouter,
} from "./transport/router";

export function createOrganizationSearchFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresOrganizationSearchRepository(dbPool);
  const service = createOrganizationSearchService(repository);

  return {
    organizationSearchService: service,
    rootOrganizationSearchRouter: createRootOrganizationSearchRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    tenantOrganizationSearchRouter: createTenantOrganizationSearchRouter(
      tenantSessionLookupRepository,
      service,
    ),
  };
}

