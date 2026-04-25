import type { Pool } from "pg";
import { createJobTypeRegistry } from "./domain/jobRegistry";
import { createJobProcessingService } from "./domain/service";
import type { QueueProviderAdapter } from "./domain/provider";
import type { JobTypeDefinition } from "./domain/types";
import { createPostgresJobProcessingRepository } from "./persistence/postgresRepository";

export function createJobProcessingFeature(input: {
  dbPool: Pool;
  provider?: QueueProviderAdapter;
  jobTypes?: JobTypeDefinition[];
}) {
  const registry = createJobTypeRegistry(input.jobTypes ?? []);
  const repository = createPostgresJobProcessingRepository(input.dbPool);
  const service = createJobProcessingService({
    registry,
    repository,
    provider: input.provider,
  });

  return { registry, repository, service };
}
