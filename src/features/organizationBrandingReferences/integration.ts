import type { Pool } from "pg";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { AssetsService } from "../assets";
import type { OrganizationCoreService } from "../organizationCore";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import { createOrganizationBrandingReferencesService } from "./domain/service";
import { createPostgresOrganizationLogoRepository } from "./persistence/postgresRepository";
import {
  createPublicOrganizationBrandingReferencesRouter,
  createRootOrganizationBrandingReferencesRouter,
  createTenantOrganizationBrandingReferencesRouter,
} from "./transport/router";

export function createOrganizationBrandingReferencesFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository,
  organizationCoreService: OrganizationCoreService,
  assetsService: AssetsService,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresOrganizationLogoRepository(dbPool);
  const service = createOrganizationBrandingReferencesService(
    repository,
    organizationCoreService,
    assetsService,
  );

  return {
    organizationBrandingReferencesService: service,
    publicOrganizationBrandingReferencesRouter: createPublicOrganizationBrandingReferencesRouter(
      service,
    ),
    rootOrganizationBrandingReferencesRouter: createRootOrganizationBrandingReferencesRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    tenantOrganizationBrandingReferencesRouter: createTenantOrganizationBrandingReferencesRouter(
      tenantSessionLookupRepository,
      service,
    ),
  };
}
