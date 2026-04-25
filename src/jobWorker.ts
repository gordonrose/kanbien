import { env } from "./config/env";
import { dbPool } from "./lib/db";
import { createPostgresJobProcessingRepository } from "./features/jobProcessing";
import { createJobTypeRegistry } from "./features/jobProcessing";

async function main(): Promise<void> {
  const repository = createPostgresJobProcessingRepository(dbPool);
  const registry = createJobTypeRegistry();

  throw new Error(
    `Job worker provider adapter is not configured yet for ${env.jobProcessing.redisUrl}. ` +
      "The provider-neutral runtime entrypoint exists; BullMQ adapter integration remains deferred for this slice.",
  );

  await repository;
  await registry;
}

main().catch(async (error: unknown) => {
  console.error("Job worker failed", error);
  await dbPool.end();
  process.exit(1);
});
