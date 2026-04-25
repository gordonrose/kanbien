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
- Local development default:
  `REDIS_URL=redis://localhost:6379`
- Production provider selection:
  deferred.

BullMQ is the first implementation engine, not the feature-facing contract.
Feature code should not import BullMQ, Redis, or provider-specific job types.

## Transactional Outbox Direction

The first slice should not enqueue directly to Redis from business feature
transactions when queued work is part of a durable domain change.

Instead:

1. The feature writes domain records.
2. The feature writes a durable job request through the job-processing seam in
   the same PostgreSQL transaction.
3. A dispatcher process publishes undispatched requests to BullMQ after commit.
4. The worker executes the job and records attempts/status durably.

## Payload Contract Direction

Payload defaults:

- JSON only.
- Explicit `payloadVersion`.
- Validated by the registered job type.
- Small by default.
- Stable IDs and minimal execution metadata by default.
- No secrets, bearer tokens, credentials, password material, private keys, live
  permission claims, or broad authority grants.

Feature-design gate:

- Any feature introducing job-producing capabilities must classify each payload
  field as stable reference, execution metadata, or approved durable snapshot.
- If historical exactness is required, persist that fact durably in the owning
  feature or approved snapshot before enqueueing.
- The job payload should reference that durable record.

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

Manual retry/cancel APIs are deferred, but the state model should preserve
attempt history, dead-letter state, and audit hooks so those APIs can be added
later.

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

Initial implementation should support queue-level worker concurrency, job-type
default queue, job-type default priority, and job-type retry policy.

Designed-for later:

- runtime/operator overrides
- job-type concurrency limits
- queue pause/resume
- job-type pause/resume
- rate limits

## Worker Runtime Direction

- Job workers run as dedicated processes separate from the HTTP server.
- Workers support graceful shutdown and stable worker identity.
- BullMQ owns live execution locks and stalled job handling.
- The platform persists enough job/attempt status for audit, progress, and
  future operator visibility.

## Tenant Boundary Direction

Every job type must declare execution scope:

- `root`
- `tenant`
- `platform-internal`
- `shared-cross-tenant` only with explicit approval

Tenant-scoped jobs require exactly one tenant context per job. Jobs may carry
stable context such as tenant ID, entity IDs, and requester actor ID for audit
attribution, but must not carry sessions, tokens, role claims, permission
lists, credentials, or secrets.

Authorization should usually happen at enqueue time. Execution then runs under
constrained system authority inside the recorded scope plus current domain-state
validation.

## Batch Progress Direction

Generic job state is not enough for user-facing progress.

Batch-capable features should own durable item-level progress records, such as:

- campaign recipients
- import rows
- export chunks
- reconciliation items

The queue foundation provides execution primitives and guidance, not a generic
business-progress model for every feature.

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

## Scheduling Direction

The first slice should support one-off delayed jobs through `runAt` because
retry backoff and delayed dispatch need that primitive.

Recurring jobs, cron-style schedules, schedule-management APIs, scheduling UI,
and calendar/time-zone scheduling semantics are deferred.

## Completion Semantics Direction

The job foundation records generic execution outcomes.

Business completion semantics belong to the owning feature.

Initial supported patterns:

- fire-and-forget jobs
- feature-owned progress/status polling
- dead-letter state with feature-owned failure handling

Generic completion event bus and cross-feature workflow choreography are
deferred.

## First-Consumer Direction

The likely first useful adopter is a later `notificationDelivery` automatic
retry slice. That adoption should probably enqueue `notification.email.send`
jobs with a small payload such as `outboundEmailId`.

## Main Questions To Carry Into Later Artifacts

- Should registered job-type metadata be persisted in v1, or remain
  code-defined until operator APIs exist?
- Should v1 expose any read-only debug endpoint, or keep operator APIs fully
  deferred?
- Should worker startup use one generic worker script or separate scripts for
  workload classes?
- Which job type should be the first executable proof consumer after the
  foundation exists?
