import type { Pool } from "pg";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { TenantAuthPolicyResolver } from "../tenantConfiguration";
import {
  createTenantAdminsAuthBootstrapReader,
} from "../tenantAdmins";
import { createVisibleTenantsReader } from "../tenants";
import { createTenantAuthService } from "./domain/service";
import { createPostgresTenantAuthRepository } from "./persistence/postgresRepository";
import { createTenantAuthRouter } from "./transport/router";

export function createTenantAuthFeature(
  dbPool: Pool,
  platformSecurityRepository: PlatformSecurityRepository,
  tenantAuthPolicyResolver?: TenantAuthPolicyResolver,
) {
  const repository = createPostgresTenantAuthRepository(dbPool);
  const service = createTenantAuthService(
    repository,
    createTenantAdminsAuthBootstrapReader(dbPool),
    createVisibleTenantsReader(dbPool),
    tenantAuthPolicyResolver,
    platformSecurityRepository,
  );

  return {
    tenantAuthRouter: createTenantAuthRouter(repository, service, platformSecurityRepository),
    onboardingProvisioner: service.onboardingProvisioner,
  };
}
