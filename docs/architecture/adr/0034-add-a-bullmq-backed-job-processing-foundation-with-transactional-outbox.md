# ADR-0034: Add A BullMQ-Backed Job Processing Foundation With Transactional Outbox

- Status: Proposed
- Date: 2026-04-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform needs a shared foundation for asynchronous work, including email
retry, large batch processing, interrupted-work recovery, and future operator
visibility. Without one shared foundation, individual features would likely
invent their own timers, retry loops, direct provider calls, or queue
integrations.

The repo also requires explicit seams, durable domain facts, strong tenant
boundaries, and compatibility-aware shared-platform changes.

## Decision

Add a shared job-processing foundation, expected to live under:

`src/features/jobProcessing/`

unless the implementation blueprint identifies a stronger repo-local placement.

Use BullMQ backed by Redis as the first queue provider.

Local development defaults to:

`REDIS_URL=redis://localhost:6379`

Production provider selection is deferred. Queue provider settings should come
from environment configuration.

The foundation must expose provider-neutral seams. Feature code must not import
BullMQ, Redis, or provider-specific job objects directly.

Conceptual boundary:

```txt
Feature code
  -> jobProcessing service / public seam
    -> queue provider adapter
      -> BullMQ
        -> Redis
```

The platform contract is:

- at-least-once execution
- durable job request persistence
- transactional outbox enqueue for domain-coupled work
- explicit registered job types and handlers
- versioned JSON payloads
- retry and dead-letter semantics
- queue and priority defaults
- worker execution with graceful shutdown
- durable attempt/status metadata for later operator visibility

### Transactional Outbox

When a feature creates durable domain state and required asynchronous work in
one workflow, it must write the job request through the job-processing seam in
the same PostgreSQL transaction as the domain records.

The foundation then dispatches committed outbox rows to BullMQ after commit.

### Execution Semantics

The foundation uses at-least-once execution semantics. Handlers must be
idempotent.

Default retry policy:

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
- exhausted jobs move to durable dead-letter state

### Job Types And Payloads

Every executable job type must be registered explicitly with owner feature,
payload versions, validation schemas, execution scope, default queue, default
priority, retry policy, and handler.

Payloads are JSON and versioned. Payloads should contain stable references and
minimal execution metadata by default.

Payloads must not contain secrets, bearer tokens, session IDs, credentials,
passwords, private keys, live role claims, live permission lists, or broad
authority grants.

When historical exactness matters, the owning feature must persist the exact
fact durably before enqueueing, and the job payload should reference that
durable record.

### Tenant And Authority Boundaries

Every job type must declare execution scope:

- `root`
- `tenant`
- `platform-internal`
- `shared-cross-tenant`

`shared-cross-tenant` requires explicit approval and should be rare.

Tenant-scoped jobs must carry exactly one tenant context. Handlers must verify
object ownership through tenant-scoped feature seams. Jobs may carry requester
actor IDs for audit attribution, but must not replay HTTP sessions or bearer
tokens.

Authorization normally happens at enqueue time. Execution runs under
constrained system authority inside the recorded scope plus current domain-state
validation.

### Queues, Priority, And Workers

Initial queues:

- `critical`
- `default`
- `bulk`
- `maintenance`

Separate queues isolate workload classes. Priority sorts inside a queue.
Long-running work should be chunked and should normally use `bulk` or
`maintenance`.

Initial implementation should support queue-level worker concurrency, job-type
default queue/priority/retry policy, a dedicated worker process, graceful
shutdown, and stable worker identity.

### Operator Visibility And Deferred Controls

The initial implementation may run without operator APIs or UI, but persistence
must preserve enough metadata for future job list/read, queue health, worker
health, manual retry, cancel, and pause/resume controls.

Future root/operator capability candidates:

- `jobProcessing.job.read`
- `jobProcessing.job.retry`
- `jobProcessing.job.cancel`
- `jobProcessing.queue.manage`

Future operator APIs must be root-authorized and audited, and must expose
redacted payload metadata by default.

### Scheduling Boundary

The first foundation may support one-off delayed jobs through `runAt`. Recurring
jobs, cron expressions, schedule-management APIs, scheduling UI, and
calendar/time-zone semantics are deferred.

### Completion Semantics

The foundation owns generic execution state. Business completion semantics
belong to the owning feature.

Initial supported patterns:

- fire-and-forget jobs
- feature-owned status/progress polling
- dead-letter state with feature-owned failure handling

Generic completion event bus and workflow choreography are deferred.

## Consequences

### Positive

- features get one repeatable seam for asynchronous work
- feature code stays decoupled from BullMQ and Redis APIs
- domain state and required job requests can be atomic through PostgreSQL
- retry, dead-letter, payload validation, and attempt recording become
  consistent
- tenant-boundary rules can be explicit for background execution
- local development can use a simple local Redis instance
- future SQS or RabbitMQ exploration remains realistic

### Negative

- Redis becomes a required local dependency once implementation starts
- BullMQ/Redis adds operational complexity compared with a pure Postgres queue
- transactional outbox adds dispatcher plumbing
- at-least-once execution requires handler idempotency discipline
- provider-neutral seams may not expose every BullMQ feature directly
- future provider migration will still need careful work because ordering,
  priority, delay, and locking semantics do not translate perfectly

### Neutral / Follow-up

- create PRD-derived test cases for enqueue, outbox dispatch, worker execution,
  retry, dead-letter, payload safety, tenant boundaries, idempotency, and worker
  shutdown
- create an implementation blueprint before code changes
- decide whether registered job-type metadata should be persisted in v1
- decide whether v1 exposes any read-only debug route
- decide worker script layout
- implement notification-delivery automatic retry as a later adoption slice
- design the scheduling toolkit in a later capability matrix and PRD
