# Job Processing Foundation Specification

## Implementation Status

- Status:
  planned backend/platform foundation slice as of 2026-04-25
- Implemented:
  - first-pass capability matrix for `jobProcessing`
  - first-pass capability matrix notes
  - ADR for BullMQ/Redis and the transactional outbox decision
- Not yet implemented:
  - PRD-derived test cases
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
safe and repeatable without becoming a full workflow engine, scheduling
product, or operator console.

---

## Scope

This phase includes:

- a new job-processing foundation, expected under `src/features/jobProcessing`
  unless the ADR selects a different platform location
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
- initial queue names:
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

Those later concerns should build on this foundation rather than be collapsed
into the first implementation.

---

## Core Concepts

### Job-processing foundation

`jobProcessing` is the shared asynchronous processing foundation.

It owns generic mechanics:

- durable job request
- dispatch
- provider adapter
- worker execution
- attempts
- retry
- dead-letter state
- future operator metadata

It does not own feature business meaning.

For example, jobProcessing may know that a job failed after five attempts. The
campaign feature owns whether a campaign recipient is marked `dead`, whether a
campaign is still eligible to continue, and what progress UI should show.

### Queue provider

The first provider is BullMQ backed by Redis.

BullMQ should remain behind a platform provider adapter.

Feature code must not import BullMQ, Redis, or provider-specific job objects.

The platform contract is the behavior the repo depends on:

- at-least-once execution
- versioned payloads
- retry and dead-letter semantics
- queue and priority defaults
- durable attempt metadata
- delayed one-off execution

Provider-specific behavior may exist inside the adapter, but should not leak
into feature contracts unless a later ADR explicitly promotes it.

### Transactional outbox

When queued work is part of a durable domain change, feature code should write a
job request through the job-processing seam in the same PostgreSQL transaction
as the domain records.

The platform then dispatches that durable request to BullMQ after commit.

This avoids the failure mode:

1. domain record commits
2. process crashes before Redis enqueue
3. required background job is lost

### Registered job type

A registered job type declares:

- job type identifier
- owner feature
- supported payload versions
- payload validation schemas
- execution scope
- default queue
- default priority
- retry policy
- concurrency/rate-limit hints where applicable
- handler

Only registered job types may be enqueued or executed.

Registration should be explicit at platform/worker composition time. Hidden
runtime discovery is out of scope for v1.

### Job payload

Job payloads are JSON and versioned.

Payloads should contain stable references and minimal execution metadata by
default.

Payloads must not contain:

- secrets
- bearer tokens
- session IDs
- credentials
- passwords
- private keys
- live role claims
- live permission lists
- broad authority grants

If a job requires historically exact facts, those facts should be persisted in
the owning feature's durable domain records or in an approved durable snapshot
before enqueueing. The job payload should then reference that durable record.

### Job scope

Every job type declares one execution scope:

- `root`
- `tenant`
- `platform-internal`
- `shared-cross-tenant`

`shared-cross-tenant` requires explicit approval and should be rare.

Tenant-scoped jobs must carry exactly one tenant context and handlers must
verify object ownership through tenant-scoped feature seams.

Jobs may carry requester actor IDs for audit attribution, but they must not
replay the original session or token.

### Worker

A worker is a process separate from the HTTP server.

The HTTP server handles requests.

The worker handles background jobs.

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

Job types may declare approved overrides.

Dead jobs remain durable and inspectable. Manual retry is deferred, but the
model must preserve enough state for future root-authorized retry APIs.

---

## Capability Set

### `enqueueTransactionalJobRequest`

Persist a durable job request as part of a feature-owned domain transaction.

Inputs include:

- `jobType`
- `queueName` or default selector
- `payloadVersion`
- `payload`
- `idempotencyKey`
- optional `runAt`
- optional priority constrained by job-type policy
- execution scope metadata
- tenant ID when scope requires it
- requester audit attribution when available

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
- records safe dispatch failure summaries
- leaves failed dispatch requests durable and retryable

### `registerJobTypeAndHandler`

Register supported job types and their handlers.

Rules:

- registration is explicit
- duplicate job types are rejected
- unsupported payload versions are rejected
- missing schemas or handlers fail startup/configuration validation
- feature handlers stay behind exported feature seams

### `executeRegisteredJob`

Run registered job handlers from BullMQ workers.

Rules:

- validates job type and payload before handler execution
- records attempt start and finish
- records worker identity
- stores safe error summary
- updates durable job status
- expects handlers to be idempotent
- treats at-least-once execution as the platform guarantee

### `applyRetryBackoffAndDeadLetterPolicy`

Apply retry policy consistently.

Rules:

- retryable errors use exponential backoff with jitter
- non-retryable errors do not churn through all attempts unless policy says so
- exhausted jobs move to dead-letter state
- attempt history is never erased by terminal state

### `validateVersionedJobPayload`

Validate payload shape and safety.

Rules:

- every payload has a supported version
- every payload is schema-validated
- payloads are small by default
- payloads carry stable references by default
- durable snapshots require an explicit feature-design exception
- secrets, tokens, credentials, and authority claims are rejected

### `preserveExecutionScopeAndTenantBoundary`

Keep async execution aligned with root and tenant boundary rules.

Rules:

- every job type declares execution scope
- tenant jobs carry exactly one tenant ID
- tenant handlers verify object ownership
- jobs do not carry authority
- requester attribution is audit metadata only
- shared-cross-tenant work requires explicit approval

### `configureQueuesPriorityAndConcurrency`

Provide operational isolation for workload classes.

Initial queues:

- `critical`
- `default`
- `bulk`
- `maintenance`

Rules:

- queue-level concurrency is supported in v1
- job types declare default queue and priority
- priority sorts inside a queue
- separate queues isolate workload classes
- long work must be chunked where practical
- bulk work should not block critical or default work

### `recordJobMetadataForFutureOperatorVisibility`

Persist metadata needed for later operator APIs/UI.

Required preserved data includes:

- job ID
- queue name
- job type
- payload version
- redacted/safe payload metadata
- status
- priority
- run/delay timestamp
- attempt count
- max attempts
- created/updated/completed timestamps
- worker ID for attempts
- last error code and summary
- related domain entity references where appropriate
- idempotency key
- dead-letter state
- future operator audit hooks

### `supportManualRetryAndCancelLater`

Preserve future root-operator control semantics.

Deferred future capabilities include:

- retry one dead job
- retry filtered dead jobs
- cancel a queued or delayed job
- pause/resume queue
- pause/resume job type
- adjust runtime priority or concurrency

Future mutation controls must be root-authorized and audited.

### `supportDomainBatchProgressPattern`

Define the batch-progress pattern without implementing a generic batch engine.

Rules:

- generic queue state is for operations
- user-facing progress belongs to the owning feature
- batch-capable features persist item-level progress
- workers can resume from durable item state
- progress UI should read feature-owned progress APIs

Example durable item states:

- `pending`
- `queued`
- `processing`
- `succeeded`
- `failed`
- `dead`
- `canceled`

### `gracefulWorkerShutdownAndIdentity`

Ensure worker processes are operable.

Rules:

- workers record stable identity on attempts
- workers handle `SIGTERM` and `SIGINT`
- workers stop accepting new jobs during shutdown
- workers allow bounded in-flight drain
- unfinished work remains retryable through provider/lease mechanics

### `deferSchedulingToolkit`

Support simple delayed jobs while deferring scheduling as a product/toolkit.

Rules:

- one-off `runAt` delayed jobs are in scope
- recurring jobs are out of scope
- cron expressions are out of scope
- schedule-management APIs/UI are out of scope

### `adoptNotificationDeliveryRetryLater`

Preserve a clean adoption path for notification-delivery retry.

Expected future shape:

- job type:
  `notification.email.send`
- payload:
  `outboundEmailId`
- handler:
  loads durable notification-delivery state and creates/records attempts

This adoption is deferred to a later implementation loop.

---

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
5. Worker crashes must leave jobs eligible for retry through provider lock or
   stalled-job mechanics.
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

---

## Deferred Operator APIs/UI

The initial implementation may not expose operator APIs or UI.

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

Rules for future APIs:

- root-authenticated only
- root-authorized by explicit capabilities
- audit mutation actions
- expose redacted payload metadata only by default
- keep generic job operations separate from feature-owned business progress

---

## Batch Progress Guidance

The queue foundation should not be the only source of truth for feature
progress.

For large workflows, features should persist durable item-level progress.

Example: a campaign email send should persist campaign-recipient rows and use
their statuses to answer:

- total recipients
- pending recipients
- queued recipients
- sending recipients
- sent recipients
- failed recipients
- dead recipients
- recent throughput
- approximate ETA

The generic job system can support operational troubleshooting, but the feature
owns business progress.

---

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

---

## Related Artifacts

- ADR:
  [docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md](/home/gordon/kanbien/docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md)
- Capability matrix:
  [docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft.csv)
- Capability matrix notes:
  [docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft-notes.md)

---

## Open Questions

1. Should the first implementation persist registered job-type metadata, or is
   code-defined registry metadata enough until operator APIs exist?
2. Should the first implementation include any read-only debug route, or keep
   operator APIs fully deferred?
3. What Redis deployment model should local development, CI, and production use?
4. Should workers run as one generic worker script or separate scripts per
   workload class?
5. Which concrete job type should prove the foundation after the base layer is
   implemented?
6. Should notification-delivery automatic retry be the first adoption slice, or
   should the foundation initially ship with only synthetic/test handlers?
