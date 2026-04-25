# Job Processing Attempt

## Summary

- Description: Durable execution-attempt history for one asynchronous job.
- Owning feature: `jobProcessing`
- Primary source tables or records: `job_processing_attempt`,
  `JobProcessingAttemptRecord`

## Storage Model

- Primary table or durable record: `job_processing_attempt`
- Parent record: `job_processing_job`
- Primary key: `attempt_id`
- Foreign key relationships:
  `job_id` references `job_processing_job.job_id`

## Fields

- `attempt_id`
  Type / Shape: `UUID`
  Description: Stable attempt identifier.
- `job_id`
  Type / Shape: `UUID`
  Description: Parent durable job.
- `attempt_number`
  Type / Shape: `INTEGER`
  Description: Monotonic attempt number within the parent job.
- `worker_id`
  Type / Shape: `TEXT`
  Description: Stable worker-process identity for this attempt.
- `status`
  Type / Shape: `'running' | 'succeeded' | 'failed' | 'dead'`
  Description: Attempt outcome.
- `started_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Attempt start time.
- `finished_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Attempt finish time.
- `error_code`
  Type / Shape: `TEXT | NULL`
  Description: Stable redacted failure code.
- `error_summary`
  Type / Shape: `TEXT | NULL`
  Description: Safe redacted error summary.

## Lifecycle Semantics

- worker creates a running attempt before invoking the handler
- successful handlers mark the attempt succeeded and the job succeeded
- retryable errors preserve failed attempt history and move the job to
  retryable
- exhausted or non-retryable failures mark the terminal attempt dead and the
  job dead

## Indexes And Uniqueness

- unique `(job_id, attempt_number)`
- indexes support job, worker, and started-at inspection
