# Job Processing Foundation Specification

## Implementation Status

- Status:
  planned backend/platform foundation slice as of 2026-04-25
- Implemented:
  - first-pass capability matrix for `jobProcessing`
  - first-pass capability matrix notes
  - ADR for BullMQ/Redis and the transactional outbox decision
  - PRD-derived test-case document
- Not yet implemented:
  - implementation blueprint
  - `jobProcessing` feature/foundation
  - Redis/BullMQ configuration
  - worker runtime
  - dispatcher runtime
  - job persistence migrations
  - executable tests
  - operator APIs/UI
  - notification-delivery retry adoption

## Purpose

Define the first asynchronous job-processing and queueing foundation for the
platform.

This foundation lets feature bundles request background work through one
platform-owned seam instead of implementing ad hoc timers, direct Redis access,
or feature-local queue mechanics.

It establishes:

- durable job request persistence
- transactional outbox dispatch to BullMQ
- at-least-once job execution
- explicit job type registration
- versioned payload validation
- retry and dead-letter policy
- queue, priority, and worker-concurrency defaults
- tenant/root/platform execution-scope rules
- durable metadata for future operator troubleshooting

The first slice is intentionally a foundation. It should make asynchronous work
safe and repeatable without becoming a full workflow engine, scheduling product,
or operator console.

## Scope

This phase includes:

- a new job-processing foundation, expected under `src/features/jobProcessing`
  unless the implementation blueprint selects a different repo-local placement
- BullMQ with Redis as the first queue provider
- a provider boundary that prevents features from importing BullMQ directly
- durable PostgreSQL job and outbox persistence
- transactional enqueue seam for feature-owned domain transactions
- dispatcher process that publishes durable outbox rows to BullMQ after commit
- worker process that executes registered handlers
- explicit job type and handler registry
- versioned JSON payload validation
- small-payload and payload-safety gate
- at-least-once execution semantics
- default exponential backoff with jitter
- dead-letter state for exhausted jobs
- initial queues:
  - `critical`
  - `default`
  - `bulk`
  - `maintenance`
- queue-level worker concurrency defaults
- job-type default queue and priority
- durable attempt history and safe error summaries
- worker identity on attempts
- graceful worker shutdown
- one-off delayed jobs through `runAt`
- model support for future operator APIs/UI

This phase does **not** include:

- root-admin operator job UI
- public or root-admin job APIs
- manual retry/cancel APIs
- runtime queue or priority override UI
- recurring jobs or cron-style scheduling
- a general workflow engine
- generic completion event bus
- SQS or RabbitMQ provider adapters
- notification-delivery automatic retry implementation
- feature-specific batch progress APIs

## Core Concepts

### Job-processing foundation

`jobProcessing` owns generic asynchronous mechanics: durable job request,
dispatch, provider adapter, worker execution, attempts, retry, dead-letter
state, and future operator metadata.

It does not own feature business meaning.

### Queue provider

The first provider is BullMQ backed by Redis. Local development uses:

`REDIS_URL=redis://localhost:6379`

BullMQ should remain behind a provider adapter. Feature code must not import
BullMQ, Redis, or provider-specific job objects.

### Transactional outbox

When queued work is part of a durable domain change, feature code should write a
job request through the job-processing seam in the same PostgreSQL transaction
as the domain records.

The platform dispatches that durable request to BullMQ after commit.

### Registered job type

A registered job type declares job type identifier, owner feature, supported
payload versions, payload validation schemas, execution scope, default queue,
default priority, retry policy, concurrency/rate-limit hints where applicable,
and handler.

Only registered job types may be enqueued or executed.

### Job payload

Job payloads are JSON and versioned. Payloads should contain stable references
and minimal execution metadata by default.

Payloads must not contain secrets, bearer tokens, session IDs, credentials,
passwords, private keys, live role claims, live permission lists, or broad
authority grants.

If a job requires historically exact facts, those facts should be persisted in
the owning feature's durable domain records or in an approved durable snapshot
before enqueueing. The payload should reference that durable record.

### Job scope

Every job type declares one execution scope:

- `root`
- `tenant`
- `platform-internal`
- `shared-cross-tenant`

`shared-cross-tenant` requires explicit approval and should be rare.

Tenant-scoped jobs must carry exactly one tenant context and handlers must
verify object ownership through tenant-scoped feature seams.

### Worker

A worker is a process separate from the HTTP server.

Worker concurrency should be configurable by queue in v1. Job-type concurrency
limits and runtime overrides are designed-for but deferred.

### Retry and dead-letter

Default retry policy:

- max attempts:
  `5`
- initial delay:
  `30 seconds`
- strategy:
  exponential backoff
- jitter:
  enabled
- max delay:
  `30 minutes`
- exhausted state:
  `dead`

## Capability Set

### `enqueueTransactionalJobRequest`

Persist a durable job request as part of a feature-owned domain transaction.

Rules:

- validates registered job type
- validates payload version and schema
- rejects forbidden payload content
- enforces tenant context requirements
- persists durable job/outbox metadata
- does not publish directly to BullMQ when part of a domain transaction
- enforces idempotency where supplied

### `dispatchOutboxToBullMQ`

Publish durable undispatched job requests to BullMQ.

Rules:

- runs in a dispatcher process
- claims/leases rows safely
- publishes idempotently where possible
- records provider job ID and dispatch metadata
- leaves failed dispatch requests durable and retryable

### `registerJobTypeAndHandler`

Register supported job types and their handlers.

### `executeRegisteredJob`

Run registered job handlers from BullMQ workers with durable attempt recording.

### `applyRetryBackoffAndDeadLetterPolicy`

Apply retry policy with exponential backoff, jitter, and dead-letter terminal
state.

### `validateVersionedJobPayload`

Validate payload shape, version, and safety.

### `preserveExecutionScopeAndTenantBoundary`

Keep async execution aligned with root and tenant boundary rules.

### `configureQueuesPriorityAndConcurrency`

Provide operational isolation for workload classes.

### `recordJobMetadataForFutureOperatorVisibility`

Persist metadata needed for later operator APIs/UI.

### `supportManualRetryAndCancelLater`

Preserve future root-operator control semantics while deferring APIs.

### `supportDomainBatchProgressPattern`

Define the batch-progress pattern without implementing a generic batch engine.

### `gracefulWorkerShutdownAndIdentity`

Ensure worker processes are operable.

### `deferSchedulingToolkit`

Support simple delayed jobs while deferring recurring scheduling.

### `adoptNotificationDeliveryRetryLater`

Preserve a clean adoption path for notification-delivery retry.

## Requirements

### Functional Requirements

1. The platform must expose a provider-neutral enqueue seam for feature code.
2. The platform must persist durable job request metadata in PostgreSQL.
3. The platform must support transactional enqueue with feature domain writes.
4. The platform must dispatch committed outbox rows to BullMQ.
5. The platform must execute only registered job types.
6. The platform must validate payload version and schema before enqueue and
   execution.
7. The platform must record attempt history for every execution attempt.
8. The platform must apply retry policy with exponential backoff and jitter.
9. The platform must move exhausted jobs to dead-letter state.
10. The platform must support queue names, priorities, and queue-level worker
    concurrency.
11. The platform must support graceful worker shutdown.
12. The platform must preserve enough metadata for future operator job APIs.

### Security Requirements

1. Job payloads must not contain secrets, tokens, credentials, or authority
   grants.
2. Every job type must declare execution scope.
3. Tenant-scoped jobs must carry exactly one tenant ID.
4. Tenant-scoped handlers must verify domain object ownership within that
   tenant context.
5. Jobs must not replay HTTP sessions or bearer tokens.
6. Future operator APIs must be root-authorized and audited.
7. Payloads and error summaries exposed in logs or future APIs must be redacted
   and safe.

### Reliability Requirements

1. The platform guarantee is at-least-once execution.
2. Handlers must be idempotent.
3. Durable domain changes and required job requests must not drift apart.
4. Dispatcher failures must leave requests durable and retryable.
5. Worker crashes must leave jobs eligible for retry.
6. Attempt history must survive retries and terminal failure.
7. Long-running work should be split into smaller idempotent jobs where
   practical.

### Compatibility Requirements

1. Feature code must not depend on BullMQ or Redis APIs directly.
2. The provider boundary must preserve room for future SQS or RabbitMQ
   adapters.
3. Provider-specific features should not become platform contract unless
   approved by ADR.
4. Payload versions must allow old queued jobs to remain executable after
   handler evolution.
5. Future operator APIs/UI should not require redesigning the job state model.

## Deferred Operator APIs/UI

Future API candidates:

- `GET /v1/job-processing/jobs`
- `GET /v1/job-processing/jobs/:jobId`
- `POST /v1/job-processing/jobs/:jobId/retry`
- `POST /v1/job-processing/jobs/:jobId/cancel`
- `GET /v1/job-processing/queues`
- `GET /v1/job-processing/workers`

Future capability candidates:

- `jobProcessing.job.read`
- `jobProcessing.job.retry`
- `jobProcessing.job.cancel`
- `jobProcessing.queue.manage`

## Batch Progress Guidance

The queue foundation should not be the only source of truth for feature
progress. For large workflows, features should persist durable item-level
progress and expose feature-owned progress APIs.

## Acceptance Criteria

The first implementation is acceptable when:

1. Feature code can enqueue a versioned durable job request through a
   provider-neutral seam.
2. A feature can enqueue a job request in the same transaction as related
   domain state.
3. The dispatcher publishes committed requests to BullMQ without losing failed
   dispatches.
4. A worker executes registered handlers with at-least-once semantics.
5. Retryable failures use exponential backoff with jitter.
6. Exhausted jobs become dead and keep attempt history.
7. Job payloads reject forbidden secret-bearing or authority-bearing content.
8. Tenant-scoped jobs require exactly one tenant context.
9. Queue-level concurrency and job-type queue/priority defaults are supported.
10. Worker shutdown and worker identity are covered.
11. Operator APIs/UI remain deferred but supported by persisted metadata.
12. PRD-derived tests cover enqueue, dispatch, execution, retry, payload
    safety, tenant-boundary, idempotency, and worker failure behavior.

## Related Artifacts

- ADR:
  [docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md](/home/gordon/kanbien/docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md)
- Capability matrix:
  [docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft.csv)
- Capability matrix notes:
  [docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft-notes.md)
- PRD-derived test cases:
  [docs/prd/test_cases/2026-04-25-0021-job-processing-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-25-0021-job-processing-foundation-test-cases.md)

## Open Questions

1. Should registered job-type metadata be persisted in v1?
2. Should v1 include any read-only debug route?
3. Should workers run as one generic worker script or separate scripts per
   workload class?
4. Which concrete job type should prove the foundation after the base layer is
   implemented?
