import type { Pool } from "pg";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { OrganizationCoreService } from "../organizationCore";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import { createOrganizationLocationsService } from "./domain/service";
import { createPostgresOrganizationLocationsRepository } from "./persistence/postgresRepository";
import {
  createRootOrganizationLocationsRouter,
  createTenantOrganizationLocationsRouter,
} from "./transport/router";

export function createOrganizationLocationsFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository,
  organizationCoreService: OrganizationCoreService,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresOrganizationLocationsRepository(dbPool);
  const service = createOrganizationLocationsService(repository, organizationCoreService);

  return {
    organizationLocationsService: service,
    rootOrganizationLocationsRouter: createRootOrganizationLocationsRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    tenantOrganizationLocationsRouter: createTenantOrganizationLocationsRouter(
      tenantSessionLookupRepository,
      service,
    ),
  };
}
