import path from "node:path";
import type { Pool } from "pg";
import { env } from "../../config/env";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createLocalStorageAdapter } from "../../lib/storage/localStorageAdapter";
import { createAssetsService } from "./domain/service";
import { createPostgresAssetsRepository } from "./persistence/postgresRepository";
import { createAssetsRouter } from "./transport/router";

export function createAssetsFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresAssetsRepository(dbPool);
  const storageRoot = env.assets.localStorageRoot ?? path.resolve(process.cwd(), ".local-assets");
  const storage = createLocalStorageAdapter(storageRoot);
  const service = createAssetsService(repository, storage);

  return {
    assetsRouter: createAssetsRouter(service, capabilityChecker, platformSecurityRepository),
    assetsService: service,
  };
}
