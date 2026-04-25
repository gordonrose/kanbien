# Job Processing Job

## Summary

- Description: Durable asynchronous job request and execution-state root owned
  by `jobProcessing`.
- Owning feature: `jobProcessing`
- Primary source tables or records: `job_processing_job`,
  `JobProcessingJobRecord`

## Storage Model

- Primary table or durable record: `job_processing_job`
- Related durable records:
  `job_processing_outbox`, `job_processing_attempt`
- Primary key: `job_id`
- Foreign key relationships:
  none in v1; tenant and related-entity fields are scalar metadata owned by
  caller features

## Fields

- `job_id`
  Type / Shape: `UUID`
  Description: Stable platform job identifier.
- `job_type`
  Type / Shape: `TEXT`
  Description: Registered job type identifier.
- `queue_name`
  Type / Shape: `'critical' | 'default' | 'bulk' | 'maintenance'`
  Description: Effective platform queue.
- `payload_version`
  Type / Shape: `INTEGER`
  Description: Version selected from the registered job-type payload schemas.
- `payload_json`
  Type / Shape: `JSONB`
  Description: Small execution payload. It must not contain secrets, tokens,
  sessions, credentials, live permission claims, or broad authority grants.
- `execution_scope`
  Type / Shape: `'root' | 'tenant' | 'platform-internal' | 'shared-cross-tenant'`
  Description: Declared async execution scope.
- `tenant_id`
  Type / Shape: `UUID | NULL`
  Description: Exactly one tenant context for tenant-scoped jobs; null for
  non-tenant scopes.
- `requested_by_actor_type`
  Type / Shape: `'root_user' | 'tenant_user' | 'system' | NULL`
  Description: Audit attribution only.
- `requested_by_actor_id`
  Type / Shape: `TEXT | NULL`
  Description: Audit actor identifier.
- `idempotency_key`
  Type / Shape: `TEXT | NULL`
  Description: Caller-supplied duplicate guard unique per job type when set.
- `status`
  Type / Shape:
  `'queued' | 'dispatched' | 'running' | 'succeeded' | 'retryable' | 'dead' | 'canceled'`
  Description: Current generic job execution state.
- `priority`
  Type / Shape: `INTEGER`
  Description: Queue-local priority from 1 through 100.
- `run_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Earliest dispatch or retry time.
- `attempt_count`
  Type / Shape: `INTEGER`
  Description: Highest durable attempt number recorded for this job.
- `max_attempts`
  Type / Shape: `INTEGER`
  Description: Effective retry-policy attempt limit.
- `dead_letter_reason`
  Type / Shape: `TEXT | NULL`
  Description: Safe terminal failure reason when the job is dead.
- `related_entity_type`
  Type / Shape: `TEXT | NULL`
  Description: Optional scalar metadata for future operator filters.
- `related_entity_id`
  Type / Shape: `TEXT | NULL`
  Description: Optional scalar related-entity identifier.
- `created_at`, `updated_at`, `completed_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Lifecycle timestamps.

## Lifecycle Semantics

- create writes a durable job row and one outbox row
- dispatcher updates queued jobs to dispatched after provider acceptance
- worker transitions jobs through running, succeeded, retryable, or dead
- normal worker execution skips terminal jobs
- no normal delete behavior exists in v1

## Indexes And Uniqueness

- unique `(job_type, idempotency_key)` where `idempotency_key IS NOT NULL`
- indexes support status, queue, job type, tenant, related entity, created and
  completed timestamps, dead-letter posture, and polling by status/runAt/priority
