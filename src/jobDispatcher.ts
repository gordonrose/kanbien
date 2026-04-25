import { env } from "./config/env";
import { dbPool } from "./lib/db";
import { createPostgresJobProcessingRepository } from "./features/jobProcessing";
import { dispatchOutboxToQueue } from "./features/jobProcessing";

async function main(): Promise<void> {
  const repository = createPostgresJobProcessingRepository(dbPool);
  const dispatcherId = `job-dispatcher-${process.pid}`;

  throw new Error(
    `Job dispatcher provider adapter is not configured yet for ${env.jobProcessing.redisUrl}. ` +
      "The provider-neutral runtime entrypoint exists; BullMQ adapter integration remains deferred for this slice.",
  );

  await dispatchOutboxToQueue;
  await repository;
  await dispatcherId;
}

main().catch(async (error: unknown) => {
  console.error("Job dispatcher failed", error);
  await dbPool.end();
  process.exit(1);
});
