import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createWebAppHierarchyIntegrationSeam } from "../webAppHierarchyBuilder";
import { createWebAppPageSettingsService } from "./domain/service";
import { createPostgresWebAppPageSettingsRepository } from "./persistence/postgresRepository";
import { createWebAppPageSettingsRouter } from "./transport/router";

export function createWebAppPageSettingsFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresWebAppPageSettingsRepository(dbPool);
  const service = createWebAppPageSettingsService(
    repository,
    createWebAppHierarchyIntegrationSeam(dbPool),
  );

  return createWebAppPageSettingsRouter(
    service,
    capabilityChecker,
    platformSecurityRepository,
  );
}
