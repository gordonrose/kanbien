import type { Pool } from "pg";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { OrganizationCoreService } from "../organizationCore";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import { createOrganizationLegalDetailsService } from "./domain/service";
import { createPostgresOrganizationLegalDetailsRepository } from "./persistence/postgresRepository";
import {
  createRootOrganizationLegalDetailsRouter,
  createTenantOrganizationLegalDetailsRouter,
} from "./transport/router";

export function createOrganizationLegalDetailsFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository,
  organizationCoreService: OrganizationCoreService,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresOrganizationLegalDetailsRepository(dbPool);
  const service = createOrganizationLegalDetailsService(repository, organizationCoreService);

  return {
    organizationLegalDetailsService: service,
    rootOrganizationLegalDetailsRouter: createRootOrganizationLegalDetailsRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    tenantOrganizationLegalDetailsRouter: createTenantOrganizationLegalDetailsRouter(
      tenantSessionLookupRepository,
      service,
    ),
  };
}
