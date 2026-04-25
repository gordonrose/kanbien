import { env } from "./config/env";
import { dbPool } from "./lib/db";
import { createPostgresJobProcessingRepository } from "./features/jobProcessing";
import { dispatchOutboxToQueue } from "./features/jobProcessing";
import { createBullMqQueueProviderAdapter } from "./features/jobProcessing/domain/bullmqQueueProviderAdapter";

async function main(): Promise<void> {
  const repository = createPostgresJobProcessingRepository(dbPool);
  const dispatcherId = `job-dispatcher-${process.pid}`;
  const provider = createBullMqQueueProviderAdapter({ redisUrl: env.jobProcessing.redisUrl });

  try {
    const result = await dispatchOutboxToQueue({
      repository,
      provider,
      dispatcherId,
    });
    console.info("Job dispatcher completed", result);
  } finally {
    await provider.close();
    await dbPool.end();
  }
}

main().catch(async (error: unknown) => {
  console.error("Job dispatcher failed", error);
  await dbPool.end().catch(() => undefined);
  process.exit(1);
});
