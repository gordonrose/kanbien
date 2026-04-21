import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createNotificationEmailWriter } from "../notificationDelivery";
import type { TenantAuthOnboardingProvisioner } from "../tenantAuth";
import { createVisibleTenantsReader } from "../tenants";
import { createTenantAdminsService } from "./domain/service";
import { createPostgresTenantAdminsRepository } from "./persistence/postgresRepository";
import {
  createTenantAdminsRouter,
  createTenantAdminVerificationRouter,
} from "./transport/router";

export function createTenantAdminsFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
  tenantAuthOnboardingProvisioner: TenantAuthOnboardingProvisioner,
) {
  const repository = createPostgresTenantAdminsRepository(dbPool);
  const service = createTenantAdminsService(
    repository,
    createVisibleTenantsReader(dbPool),
    createNotificationEmailWriter(dbPool),
    platformSecurityRepository,
    tenantAuthOnboardingProvisioner,
  );

  return {
    tenantAdminsRouter: createTenantAdminsRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    tenantAdminVerificationRouter: createTenantAdminVerificationRouter(
      service,
      platformSecurityRepository,
    ),
  };
}
