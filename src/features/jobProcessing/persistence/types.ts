import type {
  JobActorType,
  JobAttemptStatus,
  JobDispatchStatus,
  JobExecutionScope,
  JobQueueName,
  RecurringScheduleRunStatus,
  JobStatus,
} from "../domain/types";

export interface JobProcessingJobRecord {
  job_id: string;
  job_type: string;
  queue_name: JobQueueName;
  payload_version: number;
  payload_json: unknown;
  execution_scope: JobExecutionScope;
  tenant_id: string | null;
  requested_by_actor_type: JobActorType | null;
  requested_by_actor_id: string | null;
  idempotency_key: string | null;
  status: JobStatus;
  priority: number;
  run_at: Date;
  attempt_count: number;
  max_attempts: number;
  dead_letter_reason: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
}

export interface JobProcessingOutboxRecord {
  outbox_id: string;
  job_id: string;
  dispatch_status: JobDispatchStatus;
  provider_job_id: string | null;
  dispatch_attempt_count: number;
  locked_by: string | null;
  locked_until: Date | null;
  last_error_summary: string | null;
  dispatched_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface JobProcessingAttemptRecord {
  attempt_id: string;
  job_id: string;
  attempt_number: number;
  worker_id: string;
  status: JobAttemptStatus;
  started_at: Date;
  finished_at: Date | null;
  error_code: string | null;
  error_summary: string | null;
}

export interface JobProcessingRecurringScheduleRecord {
  schedule_key: string;
  job_type: string;
  payload_version: number;
  cadence_seconds: number;
  enabled: boolean;
  next_run_at: Date;
  last_run_at: Date | null;
  lease_owner: string | null;
  lease_until: Date | null;
  failure_count: number;
  last_error_category: string | null;
  last_error_summary: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface JobProcessingRecurringScheduleRunRecord {
  run_id: string;
  schedule_key: string;
  due_slot_at: Date;
  status: RecurringScheduleRunStatus;
  job_id: string | null;
  attempt_count: number;
  error_category: string | null;
  error_summary: string | null;
  created_at: Date;
  updated_at: Date;
}
