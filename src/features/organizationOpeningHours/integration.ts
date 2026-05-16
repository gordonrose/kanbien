import type { Pool } from "pg";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { OrganizationLocationsService } from "../organizationLocations";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import { createOrganizationOpeningHoursService } from "./domain/service";
import { createPostgresOrganizationOpeningHoursRepository } from "./persistence/postgresRepository";
import {
  createRootOrganizationOpeningHoursRouter,
  createTenantOrganizationOpeningHoursRouter,
} from "./transport/router";

export function createOrganizationOpeningHoursFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository,
  organizationLocationsService: OrganizationLocationsService,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresOrganizationOpeningHoursRepository(dbPool);
  const service = createOrganizationOpeningHoursService(repository, organizationLocationsService);

  return {
    organizationOpeningHoursService: service,
    rootOrganizationOpeningHoursRouter: createRootOrganizationOpeningHoursRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    tenantOrganizationOpeningHoursRouter: createTenantOrganizationOpeningHoursRouter(
      tenantSessionLookupRepository,
      service,
    ),
  };
}
