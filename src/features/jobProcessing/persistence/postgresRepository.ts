import type { Pool, PoolClient } from "pg";
import type {
  ClaimedOutboxJob,
  DurableAttemptRecord,
  DurableJobRecord,
  DurableOutboxRecord,
  RecurringScheduleDefinition,
  RecurringScheduleRunRecord,
} from "../domain/types";
import type { JobProcessingRepository } from "./repository";
import type {
  JobProcessingAttemptRecord,
  JobProcessingJobRecord,
  JobProcessingOutboxRecord,
  JobProcessingRecurringScheduleRecord,
  JobProcessingRecurringScheduleRunRecord,
} from "./types";

type Queryable = Pick<Pool | PoolClient, "query">;

function toJob(record: JobProcessingJobRecord): DurableJobRecord {
  return {
    jobId: record.job_id,
    jobType: record.job_type,
    queueName: record.queue_name,
    payloadVersion: record.payload_version,
    payloadJson: record.payload_json,
    executionScope: record.execution_scope,
    tenantId: record.tenant_id,
    requestedByActorType: record.requested_by_actor_type,
    requestedByActorId: record.requested_by_actor_id,
    idempotencyKey: record.idempotency_key,
    status: record.status,
    priority: record.priority,
    runAt: record.run_at,
    attemptCount: record.attempt_count,
    maxAttempts: record.max_attempts,
    deadLetterReason: record.dead_letter_reason,
    relatedEntityType: record.related_entity_type,
    relatedEntityId: record.related_entity_id,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    completedAt: record.completed_at,
  };
}

function toOutbox(record: JobProcessingOutboxRecord): DurableOutboxRecord {
  return {
    outboxId: record.outbox_id,
    jobId: record.job_id,
    dispatchStatus: record.dispatch_status,
    providerJobId: record.provider_job_id,
    dispatchAttemptCount: record.dispatch_attempt_count,
    lockedBy: record.locked_by,
    lockedUntil: record.locked_until,
    lastErrorSummary: record.last_error_summary,
    dispatchedAt: record.dispatched_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function toAttempt(record: JobProcessingAttemptRecord): DurableAttemptRecord {
  return {
    attemptId: record.attempt_id,
    jobId: record.job_id,
    attemptNumber: record.attempt_number,
    workerId: record.worker_id,
    status: record.status,
    startedAt: record.started_at,
    finishedAt: record.finished_at,
    errorCode: record.error_code,
    errorSummary: record.error_summary,
  };
}

function toRecurringSchedule(record: JobProcessingRecurringScheduleRecord): RecurringScheduleDefinition {
  return {
    scheduleKey: record.schedule_key,
    jobType: record.job_type,
    payloadVersion: record.payload_version,
    cadenceSeconds: record.cadence_seconds,
    enabled: record.enabled,
    nextRunAt: record.next_run_at,
  };
}

function toRecurringScheduleRun(
  record: JobProcessingRecurringScheduleRunRecord,
): RecurringScheduleRunRecord {
  return {
    runId: record.run_id,
    scheduleKey: record.schedule_key,
    dueSlotAt: record.due_slot_at,
    status: record.status,
    jobId: record.job_id,
    attemptCount: record.attempt_count,
    errorCategory: record.error_category,
    errorSummary: record.error_summary,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function createPostgresJobProcessingRepository(db: Queryable): JobProcessingRepository {
  return {
    async createJobRequest(input) {
      const existing =
        input.request.idempotencyKey === null || input.request.idempotencyKey === undefined
          ? null
          : await this.findJobByIdempotencyKey(input.request.jobType, input.request.idempotencyKey);
      if (existing) {
        return existing;
      }

      const result = await db.query<JobProcessingJobRecord>(
        `
          INSERT INTO job_processing_job (
            job_id, job_type, queue_name, payload_version, payload_json,
            execution_scope, tenant_id, requested_by_actor_type, requested_by_actor_id,
            idempotency_key, status, priority, run_at, attempt_count, max_attempts,
            dead_letter_reason, related_entity_type, related_entity_id, completed_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'queued',$11,$12,0,$13,NULL,$14,$15,NULL)
          ON CONFLICT (job_type, idempotency_key) WHERE idempotency_key IS NOT NULL
          DO UPDATE SET updated_at = job_processing_job.updated_at
          RETURNING *
        `,
        [
          input.jobId,
          input.request.jobType,
          input.queueName,
          input.request.payloadVersion,
          JSON.stringify(input.payloadJson),
          input.executionScope,
          input.request.tenantId ?? null,
          input.request.requestedByActorType ?? null,
          input.request.requestedByActorId ?? null,
          input.request.idempotencyKey ?? null,
          input.priority,
          input.runAt,
          input.maxAttempts,
          input.request.relatedEntityType ?? null,
          input.request.relatedEntityId ?? null,
        ],
      );
      const job = toJob(result.rows[0]!);

      await db.query(
        `
          INSERT INTO job_processing_outbox (outbox_id, job_id, dispatch_status)
          VALUES ($1, $2, 'pending')
          ON CONFLICT (job_id) DO NOTHING
        `,
        [input.outboxId, job.jobId],
      );

      return job;
    },

    async findJobById(jobId) {
      const result = await db.query<JobProcessingJobRecord>(
        `SELECT * FROM job_processing_job WHERE job_id = $1`,
        [jobId],
      );
      return result.rows[0] ? toJob(result.rows[0]) : null;
    },

    async findJobByIdempotencyKey(jobType, idempotencyKey) {
      const result = await db.query<JobProcessingJobRecord>(
        `SELECT * FROM job_processing_job WHERE job_type = $1 AND idempotency_key = $2`,
        [jobType, idempotencyKey],
      );
      return result.rows[0] ? toJob(result.rows[0]) : null;
    },

    async claimPendingOutbox(input) {
      const result = await db.query<
        JobProcessingOutboxRecord & JobProcessingJobRecord
      >(
        `
          WITH claimed AS (
            SELECT o.outbox_id
            FROM job_processing_outbox o
            JOIN job_processing_job j ON j.job_id = o.job_id
            WHERE o.dispatch_status IN ('pending', 'failed')
              AND j.status IN ('queued', 'retryable')
              AND j.run_at <= $1
              AND (o.locked_until IS NULL OR o.locked_until <= $1)
            ORDER BY j.priority ASC, j.run_at ASC, o.created_at ASC
            FOR UPDATE SKIP LOCKED
            LIMIT $2
          )
          UPDATE job_processing_outbox o
          SET locked_by = $3,
              locked_until = $4,
              dispatch_attempt_count = o.dispatch_attempt_count + 1,
              updated_at = NOW()
          FROM claimed
          JOIN job_processing_job j ON j.job_id = o.job_id
          WHERE o.outbox_id = claimed.outbox_id
          RETURNING o.*, j.*
        `,
        [input.now, input.limit, input.dispatcherId, input.leaseUntil],
      );

      return result.rows.map((row) => ({
        outbox: toOutbox(row),
        job: toJob(row),
      }));
    },

    async markOutboxDispatched(input) {
      await db.query(
        `
          UPDATE job_processing_outbox
          SET dispatch_status = 'dispatched',
              provider_job_id = $2,
              dispatched_at = $3,
              locked_by = NULL,
              locked_until = NULL,
              updated_at = NOW()
          WHERE outbox_id = $1
        `,
        [input.outboxId, input.providerJobId, input.dispatchedAt],
      );
      await db.query(
        `
          UPDATE job_processing_job
          SET status = 'dispatched', updated_at = NOW()
          WHERE job_id = (SELECT job_id FROM job_processing_outbox WHERE outbox_id = $1)
            AND status = 'queued'
        `,
        [input.outboxId],
      );
    },

    async markOutboxDispatchFailed(input) {
      await db.query(
        `
          UPDATE job_processing_outbox
          SET dispatch_status = 'failed',
              last_error_summary = $2,
              locked_by = NULL,
              locked_until = NULL,
              updated_at = $3
          WHERE outbox_id = $1
        `,
        [input.outboxId, input.errorSummary, input.failedAt],
      );
    },

    async recordAttemptStart(input) {
      const result = await db.query<JobProcessingAttemptRecord>(
        `
          INSERT INTO job_processing_attempt (
            attempt_id, job_id, attempt_number, worker_id, status, started_at
          )
          VALUES ($1,$2,$3,$4,'running',$5)
          RETURNING *
        `,
        [input.attemptId, input.jobId, input.attemptNumber, input.workerId, input.startedAt],
      );
      await db.query(
        `
          UPDATE job_processing_job
          SET status = 'running', attempt_count = GREATEST(attempt_count, $2), updated_at = NOW()
          WHERE job_id = $1
        `,
        [input.jobId, input.attemptNumber],
      );
      return toAttempt(result.rows[0]!);
    },

    async recordAttemptFinish(input) {
      const result = await db.query<JobProcessingAttemptRecord>(
        `
          UPDATE job_processing_attempt
          SET status = $2,
              finished_at = $3,
              error_code = $4,
              error_summary = $5
          WHERE attempt_id = $1
          RETURNING *
        `,
        [
          input.attemptId,
          input.status,
          input.finishedAt,
          input.errorCode ?? null,
          input.errorSummary ?? null,
        ],
      );
      await db.query(
        `
          UPDATE job_processing_job
          SET status = $2,
              run_at = COALESCE($3, run_at),
              dead_letter_reason = COALESCE($4, dead_letter_reason),
              completed_at = CASE WHEN $2 IN ('succeeded', 'dead', 'canceled') THEN $5 ELSE completed_at END,
              updated_at = $5
          WHERE job_id = $1
        `,
        [
          input.jobId,
          input.jobStatus,
          input.nextRunAt ?? null,
          input.deadLetterReason ?? null,
          input.finishedAt,
        ],
      );
      return toAttempt(result.rows[0]!);
    },

    async listAttempts(jobId) {
      const result = await db.query<JobProcessingAttemptRecord>(
        `SELECT * FROM job_processing_attempt WHERE job_id = $1 ORDER BY attempt_number ASC`,
        [jobId],
      );
      return result.rows.map(toAttempt);
    },

    async getOutboxByJobId(jobId) {
      const result = await db.query<JobProcessingOutboxRecord>(
        `SELECT * FROM job_processing_outbox WHERE job_id = $1`,
        [jobId],
      );
      return result.rows[0] ? toOutbox(result.rows[0]) : null;
    },

    async upsertRecurringScheduleDefinitions(definitions) {
      const persisted: RecurringScheduleDefinition[] = [];
      for (const definition of definitions) {
        const result = await db.query<JobProcessingRecurringScheduleRecord>(
          `
            INSERT INTO job_processing_recurring_schedule (
              schedule_key, job_type, payload_version, cadence_seconds, enabled, next_run_at
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            ON CONFLICT (schedule_key)
            DO UPDATE SET
              job_type = EXCLUDED.job_type,
              payload_version = EXCLUDED.payload_version,
              cadence_seconds = EXCLUDED.cadence_seconds,
              enabled = EXCLUDED.enabled,
              next_run_at = LEAST(job_processing_recurring_schedule.next_run_at, EXCLUDED.next_run_at),
              updated_at = NOW()
            RETURNING *
          `,
          [
            definition.scheduleKey,
            definition.jobType,
            definition.payloadVersion,
            definition.cadenceSeconds,
            definition.enabled,
            definition.nextRunAt,
          ],
        );
        persisted.push(toRecurringSchedule(result.rows[0]!));
      }
      return persisted;
    },

    async claimDueRecurringSchedules(input) {
      const result = await db.query<
        JobProcessingRecurringScheduleRecord & JobProcessingRecurringScheduleRunRecord
      >(
        `
          WITH due AS (
            SELECT schedule_key, next_run_at
            FROM job_processing_recurring_schedule
            WHERE enabled = TRUE
              AND next_run_at <= $1
              AND (lease_until IS NULL OR lease_until <= $1)
            ORDER BY next_run_at ASC, schedule_key ASC
            FOR UPDATE SKIP LOCKED
            LIMIT $2
          ),
          leased AS (
            UPDATE job_processing_recurring_schedule s
            SET lease_owner = $3,
                lease_until = $4,
                updated_at = NOW()
            FROM due
            WHERE s.schedule_key = due.schedule_key
            RETURNING s.*
          ),
          runs AS (
            INSERT INTO job_processing_recurring_schedule_run (
              run_id, schedule_key, due_slot_at, status, attempt_count
            )
            SELECT gen_random_uuid(), schedule_key, next_run_at, 'leased', 1
            FROM leased
            ON CONFLICT (schedule_key, due_slot_at)
            DO UPDATE SET
              status = 'skipped_overlap',
              attempt_count = job_processing_recurring_schedule_run.attempt_count + 1,
              updated_at = NOW()
            RETURNING *
          )
          SELECT leased.*, runs.*
          FROM leased
          JOIN runs ON runs.schedule_key = leased.schedule_key
        `,
        [input.now, input.limit, input.schedulerId, input.leaseUntil],
      );

      return result.rows.map((row) => ({
        definition: toRecurringSchedule(row),
        run: toRecurringScheduleRun(row),
      }));
    },

    async recordRecurringScheduleRunOutcome(input) {
      const result = await db.query<JobProcessingRecurringScheduleRunRecord>(
        `
          UPDATE job_processing_recurring_schedule_run
          SET status = $3,
              job_id = $4,
              error_category = $5,
              error_summary = $6,
              updated_at = $7
          WHERE schedule_key = $1
            AND due_slot_at = $2
          RETURNING *
        `,
        [
          input.scheduleKey,
          input.dueSlotAt,
          input.status,
          input.jobId ?? null,
          input.errorCategory ?? null,
          input.errorSummary ?? null,
          input.finishedAt,
        ],
      );

      await db.query(
        `
          UPDATE job_processing_recurring_schedule
          SET next_run_at = $2,
              last_run_at = $3,
              lease_owner = NULL,
              lease_until = NULL,
              failure_count = CASE WHEN $4 IN ('retryable_failed', 'terminal_failed') THEN failure_count + 1 ELSE 0 END,
              last_error_category = CASE WHEN $4 IN ('retryable_failed', 'terminal_failed') THEN $5 ELSE NULL END,
              last_error_summary = CASE WHEN $4 IN ('retryable_failed', 'terminal_failed') THEN $6 ELSE NULL END,
              updated_at = $3
          WHERE schedule_key = $1
        `,
        [
          input.scheduleKey,
          input.nextRunAt,
          input.finishedAt,
          input.status,
          input.errorCategory ?? null,
          input.errorSummary ?? null,
        ],
      );

      return result.rows[0] ? toRecurringScheduleRun(result.rows[0]) : null;
    },
  };
}
