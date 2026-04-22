import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createDesignSystemCanonicalsService } from "./domain/service";
import type { DesignSystemCanonicalsPublicSeam } from "./domain/types";
import { createPostgresDesignSystemCanonicalsRepository } from "./persistence/postgresRepository";
import { createDesignSystemCanonicalsRouter } from "./transport/router";

export function createDesignSystemCanonicalsIntegrationSeam(
  dbPool: Pool,
): DesignSystemCanonicalsPublicSeam {
  return createDesignSystemCanonicalsService(
    createPostgresDesignSystemCanonicalsRepository(dbPool),
  );
}

export function createDesignSystemCanonicalsFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresDesignSystemCanonicalsRepository(dbPool);
  const service = createDesignSystemCanonicalsService(repository);
  return createDesignSystemCanonicalsRouter(
    service,
    capabilityChecker,
    platformSecurityRepository,
  );
}

