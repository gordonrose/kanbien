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

## Compliance Classification And Governance

- Data classification: internal platform metadata
- Privacy / PII relevance: low: no direct personal data identified in the current dictionary page
- Security relevance: moderate: internal platform metadata still requires integrity protection
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Job Processing Outbox is documented as owned by `jobProcessing` with source record(s) `job_processing_outbox`, `JobProcessingOutboxRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify tenant-scoped or permission-sensitive behavior. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
