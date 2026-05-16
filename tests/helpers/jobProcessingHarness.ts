import type {
  ClaimedOutboxJob,
  DurableAttemptRecord,
  DurableJobRecord,
  DurableOutboxRecord,
  EnqueueJobRequest,
  JobAttemptStatus,
  JobStatus,
  RecurringScheduleDefinition,
  RecurringScheduleRunRecord,
  RecurringScheduleRunStatus,
} from "../../src/features/jobProcessing/domain/types";
import type {
  CreateJobRecordInput,
  JobProcessingRepository,
  RecordAttemptFinishInput,
  RecordAttemptStartInput,
} from "../../src/features/jobProcessing/persistence/repository";
import type {
  QueueProviderAdapter,
  QueueProviderPublishInput,
  QueueProviderPublishResult,
} from "../../src/features/jobProcessing/domain/provider";

export class FakeQueueProvider implements QueueProviderAdapter {
  public readonly published: QueueProviderPublishInput[] = [];
  public failNextPublish: Error | null = null;

  async publish(input: QueueProviderPublishInput): Promise<QueueProviderPublishResult> {
    if (this.failNextPublish) {
      const error = this.failNextPublish;
      this.failNextPublish = null;
      throw error;
    }
    this.published.push(input);
    return { providerJobId: input.providerJobId };
  }
}

export class InMemoryJobProcessingRepository implements JobProcessingRepository {
  public readonly jobs = new Map<string, DurableJobRecord>();
  public readonly outboxes = new Map<string, DurableOutboxRecord>();
  public readonly attempts = new Map<string, DurableAttemptRecord>();
  public readonly recurringSchedules = new Map<string, RecurringScheduleDefinition & {
    leaseOwner: string | null;
    leaseUntil: Date | null;
  }>();
  public readonly recurringRuns = new Map<string, RecurringScheduleRunRecord>();

  async createJobRequest(input: CreateJobRecordInput): Promise<DurableJobRecord> {
    const existing =
      input.request.idempotencyKey === null || input.request.idempotencyKey === undefined
        ? null
        : [...this.jobs.values()].find(
            (job) =>
              job.jobType === input.request.jobType &&
              job.idempotencyKey === input.request.idempotencyKey,
          ) ?? null;
    if (existing) {
      return existing;
    }

    const now = new Date();
    const job: DurableJobRecord = {
      jobId: input.jobId,
      jobType: input.request.jobType,
      queueName: input.queueName,
      payloadVersion: input.request.payloadVersion,
      payloadJson: input.payloadJson,
      executionScope: input.executionScope,
      tenantId: input.request.tenantId ?? null,
      requestedByActorType: input.request.requestedByActorType ?? null,
      requestedByActorId: input.request.requestedByActorId ?? null,
      idempotencyKey: input.request.idempotencyKey ?? null,
      status: "queued",
      priority: input.priority,
      runAt: input.runAt,
      attemptCount: 0,
      maxAttempts: input.maxAttempts,
      deadLetterReason: null,
      relatedEntityType: input.request.relatedEntityType ?? null,
      relatedEntityId: input.request.relatedEntityId ?? null,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    };
    const outbox: DurableOutboxRecord = {
      outboxId: input.outboxId,
      jobId: input.jobId,
      dispatchStatus: "pending",
      providerJobId: null,
      dispatchAttemptCount: 0,
      lockedBy: null,
      lockedUntil: null,
      lastErrorSummary: null,
      dispatchedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.jobs.set(job.jobId, job);
    this.outboxes.set(outbox.outboxId, outbox);
    return job;
  }

  async findJobById(jobId: string): Promise<DurableJobRecord | null> {
    return this.jobs.get(jobId) ?? null;
  }

  async findJobByIdempotencyKey(
    jobType: string,
    idempotencyKey: string,
  ): Promise<DurableJobRecord | null> {
    return (
      [...this.jobs.values()].find(
        (job) => job.jobType === jobType && job.idempotencyKey === idempotencyKey,
      ) ?? null
    );
  }

  async claimPendingOutbox(input: {
    dispatcherId: string;
    limit: number;
    leaseUntil: Date;
    now: Date;
  }): Promise<ClaimedOutboxJob[]> {
    const claimable = [...this.outboxes.values()]
      .filter((outbox) => {
        const job = this.jobs.get(outbox.jobId);
        return (
          job !== undefined &&
          ["pending", "failed"].includes(outbox.dispatchStatus) &&
          ["queued", "retryable"].includes(job.status) &&
          job.runAt <= input.now &&
          (!outbox.lockedUntil || outbox.lockedUntil <= input.now)
        );
      })
      .sort((left, right) => {
        const leftJob = this.jobs.get(left.jobId)!;
        const rightJob = this.jobs.get(right.jobId)!;
        return (
          leftJob.priority - rightJob.priority ||
          leftJob.runAt.getTime() - rightJob.runAt.getTime() ||
          left.createdAt.getTime() - right.createdAt.getTime()
        );
      })
      .slice(0, input.limit);

    return claimable.map((outbox) => {
      const updated = {
        ...outbox,
        lockedBy: input.dispatcherId,
        lockedUntil: input.leaseUntil,
        dispatchAttemptCount: outbox.dispatchAttemptCount + 1,
        updatedAt: input.now,
      };
      this.outboxes.set(outbox.outboxId, updated);
      return { outbox: updated, job: this.jobs.get(outbox.jobId)! };
    });
  }

  async markOutboxDispatched(input: {
    outboxId: string;
    providerJobId: string;
    dispatchedAt: Date;
  }): Promise<void> {
    const outbox = this.outboxes.get(input.outboxId)!;
    this.outboxes.set(input.outboxId, {
      ...outbox,
      dispatchStatus: "dispatched",
      providerJobId: input.providerJobId,
      dispatchedAt: input.dispatchedAt,
      lockedBy: null,
      lockedUntil: null,
      updatedAt: input.dispatchedAt,
    });
    const job = this.jobs.get(outbox.jobId)!;
    this.jobs.set(job.jobId, { ...job, status: "dispatched", updatedAt: input.dispatchedAt });
  }

  async markOutboxDispatchFailed(input: {
    outboxId: string;
    errorSummary: string;
    failedAt: Date;
  }): Promise<void> {
    const outbox = this.outboxes.get(input.outboxId)!;
    this.outboxes.set(input.outboxId, {
      ...outbox,
      dispatchStatus: "failed",
      lastErrorSummary: input.errorSummary,
      lockedBy: null,
      lockedUntil: null,
      updatedAt: input.failedAt,
    });
  }

  async recordAttemptStart(input: RecordAttemptStartInput): Promise<DurableAttemptRecord> {
    const attempt: DurableAttemptRecord = {
      attemptId: input.attemptId,
      jobId: input.jobId,
      attemptNumber: input.attemptNumber,
      workerId: input.workerId,
      status: "running",
      startedAt: input.startedAt,
      finishedAt: null,
      errorCode: null,
      errorSummary: null,
    };
    this.attempts.set(attempt.attemptId, attempt);
    const job = this.jobs.get(input.jobId)!;
    this.jobs.set(job.jobId, {
      ...job,
      status: "running",
      attemptCount: input.attemptNumber,
      updatedAt: input.startedAt,
    });
    return attempt;
  }

  async recordAttemptFinish(input: RecordAttemptFinishInput): Promise<DurableAttemptRecord> {
    const attempt = this.attempts.get(input.attemptId)!;
    const updatedAttempt: DurableAttemptRecord = {
      ...attempt,
      status: input.status,
      finishedAt: input.finishedAt,
      errorCode: input.errorCode ?? null,
      errorSummary: input.errorSummary ?? null,
    };
    this.attempts.set(input.attemptId, updatedAttempt);
    const job = this.jobs.get(input.jobId)!;
    this.jobs.set(job.jobId, {
      ...job,
      status: input.jobStatus,
      runAt: input.nextRunAt ?? job.runAt,
      deadLetterReason: input.deadLetterReason ?? job.deadLetterReason,
      completedAt: ["succeeded", "dead", "canceled"].includes(input.jobStatus)
        ? input.finishedAt
        : job.completedAt,
      updatedAt: input.finishedAt,
    });
    return updatedAttempt;
  }

  async listAttempts(jobId: string): Promise<DurableAttemptRecord[]> {
    return [...this.attempts.values()]
      .filter((attempt) => attempt.jobId === jobId)
      .sort((left, right) => left.attemptNumber - right.attemptNumber);
  }

  async getOutboxByJobId(jobId: string): Promise<DurableOutboxRecord | null> {
    return [...this.outboxes.values()].find((outbox) => outbox.jobId === jobId) ?? null;
  }

  async upsertRecurringScheduleDefinitions(
    definitions: RecurringScheduleDefinition[],
  ): Promise<RecurringScheduleDefinition[]> {
    return definitions.map((definition) => {
      const existing = this.recurringSchedules.get(definition.scheduleKey);
      const persisted = {
        ...definition,
        nextRunAt: existing?.nextRunAt ?? definition.nextRunAt,
        leaseOwner: existing?.leaseOwner ?? null,
        leaseUntil: existing?.leaseUntil ?? null,
      };
      this.recurringSchedules.set(definition.scheduleKey, persisted);
      return {
        scheduleKey: persisted.scheduleKey,
        jobType: persisted.jobType,
        payloadVersion: persisted.payloadVersion,
        cadenceSeconds: persisted.cadenceSeconds,
        enabled: persisted.enabled,
        nextRunAt: persisted.nextRunAt,
      };
    });
  }

  async claimDueRecurringSchedules(input: {
    schedulerId: string;
    now: Date;
    limit: number;
    leaseUntil: Date;
  }): Promise<Array<{ definition: RecurringScheduleDefinition; run: RecurringScheduleRunRecord }>> {
    return [...this.recurringSchedules.values()]
      .filter((definition) =>
        definition.enabled &&
        definition.nextRunAt <= input.now &&
        (!definition.leaseUntil || definition.leaseUntil <= input.now)
      )
      .sort((left, right) =>
        left.nextRunAt.getTime() - right.nextRunAt.getTime() ||
        left.scheduleKey.localeCompare(right.scheduleKey)
      )
      .slice(0, input.limit)
      .map((definition) => {
        const leased = {
          ...definition,
          leaseOwner: input.schedulerId,
          leaseUntil: input.leaseUntil,
        };
        this.recurringSchedules.set(definition.scheduleKey, leased);
        const runKey = `${definition.scheduleKey}:${definition.nextRunAt.toISOString()}`;
        const existingRun = this.recurringRuns.get(runKey);
        const now = input.now;
        const run: RecurringScheduleRunRecord = existingRun
          ? {
              ...existingRun,
              status: "skipped_overlap",
              attemptCount: existingRun.attemptCount + 1,
              updatedAt: now,
            }
          : {
              runId: `run-${this.recurringRuns.size + 1}`,
              scheduleKey: definition.scheduleKey,
              dueSlotAt: definition.nextRunAt,
              status: "leased",
              jobId: null,
              attemptCount: 1,
              errorCategory: null,
              errorSummary: null,
              createdAt: now,
              updatedAt: now,
            };
        this.recurringRuns.set(runKey, run);
        return {
          definition: {
            scheduleKey: leased.scheduleKey,
            jobType: leased.jobType,
            payloadVersion: leased.payloadVersion,
            cadenceSeconds: leased.cadenceSeconds,
            enabled: leased.enabled,
            nextRunAt: leased.nextRunAt,
          },
          run,
        };
      });
  }

  async recordRecurringScheduleRunOutcome(input: {
    scheduleKey: string;
    dueSlotAt: Date;
    status: RecurringScheduleRunStatus;
    finishedAt: Date;
    nextRunAt: Date;
    jobId?: string | null;
    errorCategory?: string | null;
    errorSummary?: string | null;
  }): Promise<RecurringScheduleRunRecord | null> {
    const runKey = `${input.scheduleKey}:${input.dueSlotAt.toISOString()}`;
    const run = this.recurringRuns.get(runKey);
    if (!run) return null;
    const updatedRun: RecurringScheduleRunRecord = {
      ...run,
      status: input.status,
      jobId: input.jobId ?? null,
      errorCategory: input.errorCategory ?? null,
      errorSummary: input.errorSummary ?? null,
      updatedAt: input.finishedAt,
    };
    this.recurringRuns.set(runKey, updatedRun);
    const schedule = this.recurringSchedules.get(input.scheduleKey);
    if (schedule) {
      this.recurringSchedules.set(input.scheduleKey, {
        ...schedule,
        nextRunAt: input.nextRunAt,
        leaseOwner: null,
        leaseUntil: null,
      });
    }
    return updatedRun;
  }
}

export function createTestJobRequest(overrides: Partial<EnqueueJobRequest> = {}): EnqueueJobRequest {
  return {
    jobType: "test.echo",
    payloadVersion: 1,
    payload: { entityId: "entity-1" },
    executionScope: "platform-internal",
    priority: 50,
    ...overrides,
  };
}

export function forceJobStatus(
  repository: InMemoryJobProcessingRepository,
  jobId: string,
  status: JobStatus,
): void {
  const job = repository.jobs.get(jobId);
  if (job) {
    repository.jobs.set(jobId, { ...job, status });
  }
}

export function countAttemptsByStatus(
  repository: InMemoryJobProcessingRepository,
  status: JobAttemptStatus,
): number {
  return [...repository.attempts.values()].filter((attempt) => attempt.status === status).length;
}
