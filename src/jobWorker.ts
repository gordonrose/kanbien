import { env } from "./config/env";
import { dbPool } from "./lib/db";
import { createNotificationDeliveryJobTypesForRuntime } from "./features/notificationDelivery/emailWriter";
import {
  JOB_QUEUE_NAMES,
  createJobTypeRegistry,
  createJobWorkerRuntime,
  createPostgresJobProcessingRepository,
  createWorkerIdentity,
  executeRegisteredJob,
  installGracefulShutdown,
} from "./features/jobProcessing";
import { createBullMqQueueProviderAdapter } from "./features/jobProcessing/domain/bullmqQueueProviderAdapter";

async function main(): Promise<void> {
  const repository = createPostgresJobProcessingRepository(dbPool);
  const registry = createJobTypeRegistry(createNotificationDeliveryJobTypesForRuntime(dbPool));
  const provider = createBullMqQueueProviderAdapter({ redisUrl: env.jobProcessing.redisUrl });
  const workerId = createWorkerIdentity();
  const runtime = createJobWorkerRuntime({
    provider,
    queueNames: JOB_QUEUE_NAMES,
    workerId,
    handler: async (jobId) => {
      const result = await executeRegisteredJob({
        repository,
        registry,
        jobId,
        workerId,
      });
      if (result === "retryable") {
        throw new Error("Durable job remains retryable.");
      }
    },
  });

  installGracefulShutdown(runtime);
  await runtime.start();
  console.info("Job worker started", { workerId: runtime.workerId });
}

main().catch(async (error: unknown) => {
  console.error("Job worker failed", error);
  await dbPool.end().catch(() => undefined);
  process.exit(1);
});
