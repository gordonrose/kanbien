# ADR-0034: Add A BullMQ-Backed Job Processing Foundation With Transactional Outbox

- Status: Proposed
- Date: 2026-04-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform needs a shared foundation for asynchronous work.

Current feature work increasingly needs capabilities such as:

- sending emails after a request commits
- retrying transient provider failures
- processing large batches without blocking HTTP requests
- resuming interrupted work
- eventually showing progress for imports, exports, campaigns, and maintenance
  workflows
- isolating routine work from long-running or bulk workloads

Without a shared job-processing foundation, each feature would be tempted to
invent its own timers, retry loops, direct provider calls, or queue integration.
That would create drift across:

- retry behavior
- failure recording
- tenant-boundary handling
- idempotency expectations
- operator visibility
- payload safety
- future scheduling semantics

The repo also has strong constraints that affect the queue design:

- feature code should depend on explicit platform or feature seams, not hidden
  provider internals
- durable domain facts should not depend only on mutable external state
- tenant context is a security boundary
- persisted business state and required asynchronous work should not drift apart
- shared platform seams and lasting patterns require ADR coverage

The platform has chosen BullMQ with Redis as the first queue engine for local
development and early implementation, but feature code should not become coupled
to BullMQ APIs. A later migration to SQS, RabbitMQ, or another provider should
remain realistic if operational needs change.

## Decision

Add a shared job-processing foundation, expected to live under:

`src/features/jobProcessing/`

unless the implementation blueprint identifies a stronger repo-local placement.

Use BullMQ backed by Redis as the first queue provider.

Local development defaults to a local Redis instance reachable through:

`REDIS_URL=redis://localhost:6379`

Production provider selection is deferred. The application should read queue
provider settings from environment configuration rather than hardcoding local
connection details.

The foundation must expose a provider-neutral platform seam. Feature code must
not import BullMQ, Redis, or provider-specific job objects directly.

The first provider boundary should have this shape conceptually:

```txt
Feature code
  -> jobProcessing service / public seam
    -> queue provider adapter
      -> BullMQ
        -> Redis
```

The platform contract is the behavior the app depends on:

- at-least-once execution
- durable job request persistence
- transactional outbox enqueue for domain-coupled work
- explicit registered job types and handlers
- versioned JSON payloads
- retry and dead-letter semantics
- queue and priority defaults
- worker execution with graceful shutdown
- durable attempt/status metadata for later operator visibility

BullMQ-specific features may be used inside the provider adapter, but they
should not become feature-facing contracts unless a future ADR explicitly
promotes them.

### Transactional Outbox

When a feature creates durable domain state and required asynchronous work in
one workflow, it must write the job request through the job-processing seam in
the same PostgreSQL transaction as the domain records.

The foundation then dispatches committed outbox rows to BullMQ after commit.

The intended flow is:

1. feature writes domain records
2. feature writes durable job request / outbox row through `jobProcessing`
3. transaction commits
4. dispatcher publishes the durable request to BullMQ
5. worker executes the registered handler
6. attempts and terminal state are recorded durably

This avoids the failure mode where domain state commits but the process crashes
before Redis enqueue.

### Execution Semantics

The foundation uses at-least-once execution semantics.

Handlers must be idempotent because a job may run more than once after worker
crashes, provider retries, stalled job recovery, or dispatcher duplication.

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
- exhausted jobs move to a durable dead-letter state

Job types may declare constrained overrides when their operational profile
requires it.

### Job Types And Payloads

Every executable job type must be registered explicitly.

Registered job types declare:

- owner feature
- supported payload versions
- payload validation schemas
- execution scope
- default queue
- default priority
- retry policy
- handler

Payloads are JSON and versioned.

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

When historical exactness matters, the owning feature must persist the
historically exact fact in durable domain state or in an approved durable
snapshot before enqueueing. The job payload should reference that durable
record.

### Tenant And Authority Boundaries

Every job type must declare execution scope:

- `root`
- `tenant`
- `platform-internal`
- `shared-cross-tenant`

`shared-cross-tenant` requires explicit approval and should be rare.

Tenant-scoped jobs must carry exactly one tenant context. Handlers must verify
object ownership through tenant-scoped feature seams.

Jobs may carry requester actor IDs for audit attribution, but jobs must not
replay the original HTTP session or bearer token.

Authorization normally happens at enqueue time. Execution runs under
constrained system authority inside the recorded scope plus current domain-state
validation.

### Queues, Priority, And Workers

The initial platform queues are:

- `critical`
- `default`
- `bulk`
- `maintenance`

Separate queues isolate workload classes.

Priority sorts work inside a queue.

Long-running or high-volume work should be split into smaller idempotent chunk
jobs and should normally run on `bulk` or `maintenance`, not `critical` or
`default`.

Initial implementation should support:

- queue-level worker concurrency
- job-type default queue
- job-type default priority
- job-type retry policy
- dedicated worker process separate from the HTTP server
- graceful worker shutdown
- stable worker identity on attempts

Job-type concurrency limits, runtime operator overrides, queue pause/resume, and
rate limits are deferred but should fit the model later.

### Operator Visibility And Deferred Controls

The initial implementation may run without operator APIs or UI.

However, the persistence model must preserve enough metadata to later add:

- job list and exact read APIs
- queue health APIs
- worker health APIs
- manual retry
- cancel
- queue pause/resume

Future root/operator capability candidates include:

- `jobProcessing.job.read`
- `jobProcessing.job.retry`
- `jobProcessing.job.cancel`
- `jobProcessing.queue.manage`

Future operator APIs must be root-authorized and audited. They must expose
redacted payload metadata by default and must not reveal secrets, credentials,
tokens, or sensitive full payloads.

### Scheduling Boundary

The first job-processing foundation may support one-off delayed jobs through
`runAt`.

A broader scheduling toolkit is deferred.

Deferred scheduling work includes:

- recurring jobs
- cron expressions
- schedule management APIs
- scheduling UI
- calendar and time-zone semantics for scheduled workflows

### Completion Semantics

The job foundation owns generic execution state.

Business completion semantics belong to the owning feature.

Initial supported patterns:

- fire-and-forget jobs
- feature-owned status/progress polling
- dead-letter state with feature-owned failure handling

A generic completion event bus or workflow-choreography engine is deferred until
a concrete workflow needs it.

Batch-capable features should persist item-level domain progress when they need
interruption recovery or user-facing progress/ETA.

## Consequences

### Positive

- features get one repeatable seam for asynchronous work
- feature code stays decoupled from BullMQ and Redis APIs
- committed domain state and required job requests can be made atomic through
  PostgreSQL transactions
- retry, dead-letter, payload validation, and attempt recording become
  consistent across features
- tenant-boundary rules can be enforced explicitly for background execution
- local development can run against a simple local Redis instance
- the provider boundary keeps future SQS or RabbitMQ exploration realistic
- the data model can support future operator troubleshooting without requiring a
  redesign

### Negative

- Redis becomes a required local dependency once implementation starts
- BullMQ/Redis adds operational complexity compared with a pure Postgres queue
- the transactional outbox adds dispatcher plumbing in addition to workers
- at-least-once execution requires handler idempotency discipline in every
  consuming feature
- provider-neutral seams may not expose every BullMQ feature directly
- future provider migration will still need careful work because queue ordering,
  priority, delay, and locking semantics do not translate perfectly between
  engines

### Neutral / Follow-up

- create PRD-derived test cases for enqueue, outbox dispatch, worker execution,
  retry, dead-letter, payload safety, tenant boundaries, idempotency, and worker
  shutdown
- create an implementation blueprint before code changes
- decide whether registered job-type metadata should be persisted in v1 or stay
  code-defined until operator APIs exist
- decide whether the first implementation should expose any read-only debug
  route or keep operator APIs fully deferred
- define exact Redis environment variables in implementation, likely centered
  on `REDIS_URL`
- decide whether worker startup uses one generic worker script or separate
  queue-class scripts
- implement notification-delivery automatic retry as a later adoption slice
- design the scheduling toolkit in a later capability matrix and PRD
