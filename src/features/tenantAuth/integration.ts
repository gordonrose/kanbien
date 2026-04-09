import type { Pool } from "pg";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
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
) {
  const repository = createPostgresTenantAuthRepository(dbPool);
  const service = createTenantAuthService(
    repository,
    createTenantAdminsAuthBootstrapReader(dbPool),
    createVisibleTenantsReader(dbPool),
    platformSecurityRepository,
  );

  return createTenantAuthRouter(repository, service, platformSecurityRepository);
}
