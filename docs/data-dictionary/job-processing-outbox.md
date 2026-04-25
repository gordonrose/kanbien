# Job Processing Outbox

## Summary

- Description: Durable dispatch record that publishes committed job requests to
  a queue provider after transaction commit.
- Owning feature: `jobProcessing`
- Primary source tables or records: `job_processing_outbox`,
  `JobProcessingOutboxRecord`

## Storage Model

- Primary table or durable record: `job_processing_outbox`
- Parent record: `job_processing_job`
- Primary key: `outbox_id`
- Foreign key relationships:
  `job_id` references `job_processing_job.job_id`

## Fields

- `outbox_id`
  Type / Shape: `UUID`
  Description: Stable outbox-row identifier.
- `job_id`
  Type / Shape: `UUID`
  Description: Durable job request being dispatched.
- `dispatch_status`
  Type / Shape: `'pending' | 'dispatched' | 'failed'`
  Description: Current provider-dispatch state.
- `provider_job_id`
  Type / Shape: `TEXT | NULL`
  Description: Provider metadata after accepted publish.
- `dispatch_attempt_count`
  Type / Shape: `INTEGER`
  Description: Number of dispatch attempts.
- `locked_by`
  Type / Shape: `TEXT | NULL`
  Description: Dispatcher identity holding the current lease.
- `locked_until`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Lease expiry for retryable dispatcher ownership.
- `last_error_summary`
  Type / Shape: `TEXT | NULL`
  Description: Redacted provider failure summary.
- `dispatched_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Provider acceptance time.
- `created_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Lifecycle timestamps.

## Lifecycle Semantics

- created with `pending` status when the job request is persisted
- dispatcher claims rows with leases and marks dispatched only after provider
  acceptance
- failed dispatch rows remain durable and retryable

## Indexes And Uniqueness

- `job_id` is unique
- `provider_job_id` is unique when supplied
- polling indexes support status, lock expiry, and created time
