import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { OrganizationBusinessUnitsService } from "../organizationBusinessUnits";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import { createOrganizationBusinessUnitMembershipsService } from "./domain/service";
import { createPostgresOrganizationBusinessUnitMembershipsRepository } from "./persistence/postgresRepository";
import {
  createRootOrganizationBusinessUnitMembershipsRouter,
  createTenantOrganizationBusinessUnitMembershipsRouter,
} from "./transport/router";

export function createOrganizationBusinessUnitMembershipsFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository,
  organizationBusinessUnitsService: OrganizationBusinessUnitsService,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresOrganizationBusinessUnitMembershipsRepository(dbPool);
  const service = createOrganizationBusinessUnitMembershipsService(repository, organizationBusinessUnitsService);
  return {
    organizationBusinessUnitMembershipsService: service,
    rootOrganizationBusinessUnitMembershipsRouter: createRootOrganizationBusinessUnitMembershipsRouter(service, capabilityChecker, platformSecurityRepository),
    tenantOrganizationBusinessUnitMembershipsRouter: createTenantOrganizationBusinessUnitMembershipsRouter(tenantSessionLookupRepository, service),
  };
}
