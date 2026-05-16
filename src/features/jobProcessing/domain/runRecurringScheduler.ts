import { InvalidJobRequestError } from "../contract/errors";
import type { JobProcessingRepository } from "../persistence/repository";
import { enqueueTransactionalJobRequest } from "./enqueueTransactionalJobRequest";
import type { JobTypeRegistry } from "./jobRegistry";
import { sanitizeErrorSummary } from "./payloadSafety";
import type { RecurringScheduleRegistry } from "./recurringScheduleRegistry";

export interface RunRecurringSchedulerResult {
  inspected: number;
  enqueued: number;
  skippedOverlap: number;
  retryableFailed: number;
  terminalFailed: number;
}

function nextRunAfter(input: { dueSlotAt: Date; cadenceSeconds: number; now: Date }): Date {
  let next = new Date(input.dueSlotAt.getTime() + input.cadenceSeconds * 1000);
  while (next <= input.now) {
    next = new Date(next.getTime() + input.cadenceSeconds * 1000);
  }
  return next;
}

function classifySchedulerError(error: unknown): "terminal_failed" | "retryable_failed" {
  return error instanceof InvalidJobRequestError ? "terminal_failed" : "retryable_failed";
}

export async function runRecurringSchedulerOnce(input: {
  repository: JobProcessingRepository;
  jobRegistry: JobTypeRegistry;
  scheduleRegistry: RecurringScheduleRegistry;
  schedulerId: string;
  now?: Date;
  batchSize?: number;
  leaseMs?: number;
}): Promise<RunRecurringSchedulerResult> {
  const now = input.now ?? new Date();
  const batchSize = input.batchSize ?? 50;
  const leaseMs = input.leaseMs ?? 5 * 60_000;

  await input.repository.upsertRecurringScheduleDefinitions(
    input.scheduleRegistry.toPersistentDefinitions(),
  );

  const claimed = await input.repository.claimDueRecurringSchedules({
    schedulerId: input.schedulerId,
    now,
    limit: batchSize,
    leaseUntil: new Date(now.getTime() + leaseMs),
  });

  const result: RunRecurringSchedulerResult = {
    inspected: claimed.length,
    enqueued: 0,
    skippedOverlap: 0,
    retryableFailed: 0,
    terminalFailed: 0,
  };

  for (const claim of claimed) {
    const definition = input.scheduleRegistry.require(claim.definition.scheduleKey);
    const nextRunAt = nextRunAfter({
      dueSlotAt: claim.definition.nextRunAt,
      cadenceSeconds: definition.cadenceSeconds,
      now,
    });

    try {
      const enqueued = await enqueueTransactionalJobRequest({
        request: input.scheduleRegistry.buildEnqueueRequest({
          scheduleKey: claim.definition.scheduleKey,
          dueSlotAt: claim.definition.nextRunAt,
        }),
        registry: input.jobRegistry,
        repository: input.repository,
        now,
      });
      await input.repository.recordRecurringScheduleRunOutcome({
        scheduleKey: claim.definition.scheduleKey,
        dueSlotAt: claim.definition.nextRunAt,
        status: enqueued.idempotentReplay ? "skipped_overlap" : "enqueued",
        jobId: enqueued.jobId,
        finishedAt: now,
        nextRunAt,
      });
      if (enqueued.idempotentReplay) {
        result.skippedOverlap += 1;
      } else {
        result.enqueued += 1;
      }
    } catch (error) {
      const status = classifySchedulerError(error);
      await input.repository.recordRecurringScheduleRunOutcome({
        scheduleKey: claim.definition.scheduleKey,
        dueSlotAt: claim.definition.nextRunAt,
        status,
        finishedAt: now,
        nextRunAt,
        errorCategory: status,
        errorSummary: sanitizeErrorSummary(error),
      });
      if (status === "terminal_failed") {
        result.terminalFailed += 1;
      } else {
        result.retryableFailed += 1;
      }
    }
  }

  return result;
}

