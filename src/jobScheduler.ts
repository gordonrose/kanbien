import { dbPool } from "./lib/db";
import { createNotificationDeliveryJobTypesForRuntime } from "./features/notificationDelivery";
import {
  createJobTypeRegistry,
  createPostgresJobProcessingRepository,
  createRecurringScheduleRegistry,
  runRecurringSchedulerOnce,
} from "./features/jobProcessing";

async function main(): Promise<void> {
  const repository = createPostgresJobProcessingRepository(dbPool);
  const jobRegistry = createJobTypeRegistry([
    ...createNotificationDeliveryJobTypesForRuntime(dbPool),
  ]);
  const scheduleRegistry = createRecurringScheduleRegistry({
    jobRegistry,
    definitions: [],
  });
  const schedulerId = `job-scheduler-${process.pid}`;

  try {
    const result = await runRecurringSchedulerOnce({
      repository,
      jobRegistry,
      scheduleRegistry,
      schedulerId,
    });
    console.info("Job scheduler completed", result);
  } finally {
    await dbPool.end();
  }
}

main().catch(async (error: unknown) => {
  console.error("Job scheduler failed", error);
  await dbPool.end().catch(() => undefined);
  process.exit(1);
});
