import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { OrganizationCoreService } from "../organizationCore";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import { createOrganizationBusinessUnitsService } from "./domain/service";
import { createPostgresOrganizationBusinessUnitsRepository } from "./persistence/postgresRepository";
import {
  createRootOrganizationBusinessUnitsRouter,
  createTenantOrganizationBusinessUnitsRouter,
} from "./transport/router";

export function createOrganizationBusinessUnitsFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository,
  organizationCoreService: OrganizationCoreService,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresOrganizationBusinessUnitsRepository(dbPool);
  const service = createOrganizationBusinessUnitsService(repository, organizationCoreService);
  return {
    organizationBusinessUnitsService: service,
    rootOrganizationBusinessUnitsRouter: createRootOrganizationBusinessUnitsRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    tenantOrganizationBusinessUnitsRouter: createTenantOrganizationBusinessUnitsRouter(
      tenantSessionLookupRepository,
      service,
    ),
  };
}
