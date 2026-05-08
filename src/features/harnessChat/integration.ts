import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import { createDefaultProductDiscoveryConversationAdapter } from "../../lib/productDiscovery/conversationAdapter";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createHarnessChatService } from "./domain/service";
import { createPostgresHarnessChatRepository } from "./persistence/postgresRepository";
import { createHarnessChatRouter } from "./transport/router";

export function createHarnessChatPersistence(dbPool: Pool) {
  return createPostgresHarnessChatRepository(dbPool);
}

export function createHarnessChatFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresHarnessChatRepository(dbPool);
  const service = createHarnessChatService(repository, createDefaultProductDiscoveryConversationAdapter());
  return createHarnessChatRouter(service, capabilityChecker, platformSecurityRepository);
}
