# Job Processing Foundation Capability Matrix First Draft Notes

## Generated Artifact

- Matrix:
  [2026-04-25-job-processing-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft.csv)

## Direction Captured In This Draft

- Add a shared asynchronous job-processing foundation for platform features.
- Use BullMQ with Redis as the first queue provider.
- Keep BullMQ/Redis behind a provider boundary so feature code depends on the
  platform job-processing seam, not provider APIs.
- Use at-least-once execution semantics.
- Use a transactional outbox so feature domain writes and job requests do not
  drift apart when a process crashes.
- Persist enough job and attempt metadata for future operator APIs/UI even
  though those surfaces are deferred.

## Provider Direction

- First provider:
  BullMQ backed by Redis.
- Why:
  - BullMQ provides queue, worker, delayed job, retry, priority, stalled job,
    and concurrency mechanics that raw Redis would otherwise force the platform
    to rebuild.
  - Redis is operationally reasonable for a first async foundation and keeps
    the worker implementation familiar in Node.js.
  - Wrapping BullMQ behind a job-processing provider adapter keeps later SQS or
    RabbitMQ exploration realistic.

This draft does **not** treat BullMQ as the feature-facing contract.

Feature code should call platform seams such as:

- enqueue durable job request
- register job type and handler
- read future job metadata through approved APIs when those exist

Feature code should not import BullMQ, Redis, or provider-specific job types.

## Transactional Outbox Direction

The first slice should not enqueue directly to Redis from business feature
transactions when the queued work is part of a durable domain change.

Instead:

1. The feature writes domain records.
2. The feature writes a durable job request through the job-processing seam in
   the same PostgreSQL transaction.
3. A dispatcher process publishes undispatched requests to BullMQ after commit.
4. The worker executes the job and records attempts/status durably.

This avoids the failure mode where the domain record commits but the process
crashes before the queue publish happens.

## Payload Contract Direction

Payload defaults:

- JSON only.
- Explicit `payloadVersion`.
- Validated by the registered job type.
- Small by default.
- Stable IDs and minimal execution metadata by default.
- No secrets, bearer tokens, credentials, password material, private keys, or
  live permission claims.
- No broad authority grants.

Feature-design gate:

- Any feature introducing job-producing capabilities must classify each job
  payload field as:
  - stable reference
  - execution metadata
  - approved durable snapshot
- If historical exactness is required, the historically exact fact should be
  persisted in the owning feature's durable domain model or an approved durable
  snapshot before enqueueing.
- The job payload should then reference that durable record.

## Retry Direction

Default retry posture:

- at-least-once execution
- max attempts:
  `5`
- initial delay:
  `30 seconds`
- backoff:
  exponential
- jitter:
  enabled
- max delay:
  `30 minutes`
- terminal state:
  dead-letter / `dead`

Job types may declare constrained overrides when their operational profile
requires a different policy.

Manual retry/cancel APIs are deferred, but the state model should preserve
attempt history, dead-letter state, and audit hooks so those APIs can be added
later without redesigning execution.

## Queue And Concurrency Direction

Initial platform queue names:

- `critical`
- `default`
- `bulk`
- `maintenance`

Initial principle:

- separate queues isolate workload classes
- priority sorts jobs inside a queue
- chunking prevents long work from monopolizing workers

Long-running or high-volume work should be split into smaller idempotent chunk
jobs and should normally run on `bulk` or `maintenance`, not `critical` or
`default`.

Initial implementation should support:

- queue-level worker concurrency
- job-type default queue
- job-type default priority
- job-type retry policy

Designed-for later:

- runtime/operator overrides for queue assignment
- runtime/operator priority changes
- job-type concurrency limits
- queue pause/resume
- job-type pause/resume
- rate limits

## Worker Runtime Direction

- Job workers run as dedicated processes separate from the HTTP server.
- Workers should support graceful shutdown.
- Workers should record stable worker identity on attempts.
- BullMQ owns live execution locks and stalled job handling.
- The platform persists enough job/attempt status for audit, progress, and
  future operator visibility.
- Long-running work should be chunked rather than solved primarily by very long
  lock durations.

## Tenant Boundary Direction

Every job type must declare execution scope:

- `root`
- `tenant`
- `platform-internal`
- `shared-cross-tenant` only with explicit approval

Tenant-scoped jobs require exactly one tenant context per job.

Jobs may carry stable context such as:

- tenant ID
- entity IDs
- requester actor ID for audit attribution

Jobs must not carry:

- bearer tokens
- session IDs
- role claims
- permission lists
- credentials
- secrets

Authorization should usually happen at enqueue time. Execution should then run
under constrained system authority inside the recorded scope plus current
domain-state validation.

## Batch Progress Direction

Generic job state is not enough for user-facing progress.

Batch-capable features should own durable item-level progress records, such as:

- campaign recipients
- import rows
- export chunks
- reconciliation items

Those records should support interruption recovery and future UI progress such
as:

- total
- pending
- queued
- running
- succeeded
- failed
- dead
- canceled
- recent throughput
- approximate ETA

The queue foundation should provide execution primitives and guidance, not a
generic business-progress model for every feature.

## Deferred Operator APIs/UI Note

The initial foundation may run without root-admin operator APIs or UI, but the
schema should preserve enough state to add them later.

Future operator API candidates:

- `GET /v1/job-processing/jobs`
- `GET /v1/job-processing/jobs/:jobId`
- `POST /v1/job-processing/jobs/:jobId/retry`
- `POST /v1/job-processing/jobs/:jobId/cancel`
- `GET /v1/job-processing/queues`
- `GET /v1/job-processing/workers`

Future root/operator capability candidates:

- `jobProcessing.job.read`
- `jobProcessing.job.retry`
- `jobProcessing.job.cancel`
- `jobProcessing.queue.manage`

Design reminder:

- generic job APIs are for operator troubleshooting
- feature-owned progress APIs are for business progress
- retry/cancel/queue-management mutations must be root-authorized and audited
- do not expose secrets, credentials, bearer tokens, or sensitive full payloads
  through operator APIs

## Scheduling Direction

The first slice should support one-off delayed jobs through `runAt` because
retry backoff and delayed dispatch need that primitive.

The following are deferred:

- recurring jobs
- cron-style schedules
- schedule-management APIs
- scheduling UI
- calendar/time-zone scheduling semantics

Those should become a later scheduling-toolkit capability matrix and PRD.

## Completion Semantics Direction

The job foundation records generic execution outcomes.

Business completion semantics belong to the owning feature.

Initial supported patterns:

- fire-and-forget jobs
- feature-owned progress/status polling
- dead-letter state with feature-owned failure handling

Deferred:

- generic completion event bus
- generic cross-feature workflow choreography

## First-Consumer Direction

The likely first useful adopter is a later `notificationDelivery` automatic
retry slice.

That adoption should probably enqueue jobs such as:

- `notification.email.send`

With small payloads such as:

- `outboundEmailId`

The existing notification-delivery durable logical email and attempt model is a
good fit for the job foundation, but adoption should be a separate
implementation loop with its own docs/test updates.

## Main Questions To Carry Into Later Artifacts

- Should the first implementation include a persisted registry snapshot, or is
  code-defined registry metadata enough until operator APIs are built?
- Should the first implementation expose any read-only debug endpoint, or keep
  operator APIs fully deferred?
- What Redis deployment model is expected for local development, CI, and
  production?
- Should the worker process be one generic worker with queue config, or
  separate npm scripts for classes such as default, email, bulk, and
  maintenance workers?
- Which job type should be the first executable proof consumer after the
  foundation exists?
