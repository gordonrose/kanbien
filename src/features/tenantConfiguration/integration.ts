import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createPostgresTenantAuthRepository } from "../tenantAuth/persistence/postgresRepository";
import { createVisibleTenantsReader } from "../tenants";
import { createTenantConfigurationService } from "./domain/service";
import { createPostgresTenantConfigurationRepository } from "./persistence/postgresRepository";
import {
  createRootTenantConfigurationRouter,
  createTenantConfigurationTenantRouter,
} from "./transport/router";

export function createTenantConfigurationFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
) {
  const repository = createPostgresTenantConfigurationRepository(dbPool);
  const service = createTenantConfigurationService(
    repository,
    createVisibleTenantsReader(dbPool),
    platformSecurityRepository,
  );

  return {
    rootTenantConfigurationRouter: createRootTenantConfigurationRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    tenantTenantConfigurationRouter: createTenantConfigurationTenantRouter(
      createPostgresTenantAuthRepository(dbPool),
      service,
    ),
    policyResolver: service.policyResolver,
  };
}
