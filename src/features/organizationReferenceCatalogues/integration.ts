import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import { createOrganizationReferenceCataloguesService } from "./domain/service";
import { createPostgresOrganizationReferenceCataloguesRepository } from "./persistence/postgresRepository";
import {
  createRootOrganizationReferenceCataloguesRouter,
  createTenantOrganizationReferenceCataloguesRouter,
} from "./transport/router";

export function createOrganizationReferenceCataloguesFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresOrganizationReferenceCataloguesRepository(dbPool);
  const service = createOrganizationReferenceCataloguesService(repository);
  return {
    organizationReferenceCataloguesService: service,
    rootOrganizationReferenceCataloguesRouter: createRootOrganizationReferenceCataloguesRouter(service, capabilityChecker, platformSecurityRepository),
    tenantOrganizationReferenceCataloguesRouter: createTenantOrganizationReferenceCataloguesRouter(tenantSessionLookupRepository, service),
  };
}
