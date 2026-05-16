# Job Processing Foundation Test Cases

## PRD Scope

- PRD:
  [2026-04-25-0021-job-processing-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-25-0021-job-processing-foundation.md)
- Related ADR:
  [0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md](/home/gordon/kanbien/docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md)
- Primary features involved:
  - `jobProcessing`
- Cross-feature seams:
  - feature-owned services enqueue durable job requests through the
    job-processing public seam
  - registered job handlers may call owning feature public seams, but must not
    import private feature persistence
  - `notificationDelivery` is the first consumer for provider-safe stored email
    delivery through `notification.email.send`
  - shared PostgreSQL persistence backs durable job, outbox, and attempt state
  - BullMQ/Redis is hidden behind a provider adapter
- QA coverage-matrix classification:
  privileged shared platform foundation with persistence-backed workflow,
  external dependency integration, worker lifecycle, retry/dead-letter behavior,
  tenant-boundary implications, and compatibility-sensitive provider seam
- Journey inventory required:
  no separate end-to-end journey inventory required for the first backend
  foundation slice; future feature-specific batch progress UIs or operator job
  UIs may require journey inventories
- Required human QA artifacts:
  standards-oriented review of async execution safety, payload redaction,
  tenant-boundary enforcement, transactional outbox correctness, local Redis
  bootstrap instructions, and deferred operator API honesty
- Notes:
  - Traceability Enforcement: partially executable
  - executable `TC-JOB-PROC-*` coverage exists for the provider-neutral
    foundation seam
  - executable `TC-SCHED-*` coverage exists for the code-declared recurring
    scheduler foundation added as the first platform-maintenance extension
  - Redis-backed BullMQ coverage exists behind the explicit opt-in
    `RUN_REDIS_JOB_PROVIDER_TESTS=true` flag so normal local and CI runs do not
    require Redis
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - executable provider-neutral coverage added for the first foundation slice
  - executable Redis-backed BullMQ coverage added for the provider adapter and
    gated by `RUN_REDIS_JOB_PROVIDER_TESTS=true`
- Overall execution status:
  - fake-provider unit and integration coverage implemented
  - Redis-backed BullMQ integration coverage implemented but skipped unless
    explicitly enabled
- Layer summary:
  - `UNIT`: implemented for provider-neutral foundation
  - `INT`: implemented for fake-provider foundation flows; Postgres-backed
    persistence test is gated by `RUN_POSTGRES_TESTS`; BullMQ provider test is
    gated by `RUN_REDIS_JOB_PROVIDER_TESTS`
  - `SEC`: implemented through provider-neutral payload and tenant-boundary
    assertions
  - `AUD`: implemented through attribution, attempt, and dispatch-failure
    assertions
  - `EDGE`: implemented through provider-neutral edge assertions
  - `CONCURRENCY/IDEMPOTENCY`: implemented with fake repository/provider
    contract assertions
  - `RESILIENCE/COMPATIBILITY`: implemented with fake provider contract
    assertions
  - `PERFORMANCE/STRESS`: implemented light fake-provider batch proof
  - `E2E`: not required for the first backend foundation slice

## Existing Test Impact

- Existing executable tests likely affected:
  - provider-neutral job-processing tests should continue to run without Redis
  - Redis-backed provider tests run only when
    `RUN_REDIS_JOB_PROVIDER_TESTS=true`
  - future persistence tests may require shared Postgres migration harness
    updates if the job-processing feature adds migrations
- Nature of impact:
  - additive expected
  - implementation may add new test folders under `tests/unit/jobProcessing/`,
    `tests/integration/jobProcessing/`, `tests/security/jobProcessing/`, and
    `tests/audit/jobProcessing/`
  - Redis-backed BullMQ integration tests now cover the selected provider
    adapter without changing the normal suite's daemon requirements
- Discussion needed before changing existing tests:
  - yes if existing global test runners are changed to require Redis
  - yes if persistence harness scripts gain Redis lifecycle responsibilities
  - yes if traceability enforcement is enabled before executable IDs exist

## Unit Tests For Individual Capabilities

- Capability: `enqueueTransactionalJobRequest`
  Test Case ID: `TC-JOB-PROC-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no for pure unit tests
  Cleanup Expectation: none
  Coverage:
  - validates registered job type, payload version, queue, priority, retry
    policy, execution scope, and idempotency key before persistence
  - returns durable job request metadata without exposing BullMQ types
  Notes:
  - should use fake repository and fake registry seams

- Capability: `validateVersionedJobPayload`
  Test Case ID: `TC-JOB-PROC-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - accepts schema-valid JSON for supported payload versions
  - rejects unsupported versions, malformed payloads, oversized payloads, and
    forbidden secret-bearing or authority-bearing fields
  - preserves stable-reference and approved durable-snapshot classifications
  Notes:
  - should include examples for bearer tokens, session IDs, role claims,
    permission lists, and credential-like field names

- Capability: `registerJobTypeAndHandler`
  Test Case ID: `TC-JOB-PROC-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - registers unique job types with owner feature, payload schemas, scope,
    default queue, priority, retry policy, and handler
  - rejects duplicate job types, missing schemas, unsupported execution scopes,
    invalid queues, invalid priorities, and missing handlers

- Capability: `applyRetryBackoffAndDeadLetterPolicy`
  Test Case ID: `TC-JOB-PROC-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - computes exponential backoff delays from the default policy
  - applies jitter within an approved range
  - caps delays at the configured max delay
  - classifies exhausted jobs as dead
  - short-circuits non-retryable errors where policy requires it

- Capability: `configureQueuesPriorityAndConcurrency`
  Test Case ID: `TC-JOB-PROC-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - accepts initial queues `critical`, `default`, `bulk`, and `maintenance`
  - rejects unknown queues and unauthorized critical-queue defaults
  - resolves job-type default priority and queue-level concurrency
  - preserves room for future runtime overrides without making them required in
    v1

- Capability: `preserveExecutionScopeAndTenantBoundary`
  Test Case ID: `TC-JOB-PROC-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - requires one tenant ID for tenant-scoped jobs
  - rejects ambiguous or missing tenant context
  - rejects unapproved shared-cross-tenant scope
  - treats requester actor identity as audit attribution rather than runtime
    authority

- Capability: `recordJobMetadataForFutureOperatorVisibility`
  Test Case ID: `TC-JOB-PROC-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - builds safe job metadata with job ID, queue, job type, payload version,
    status, priority, runAt, attempt counts, idempotency key, dead-letter state,
    related domain references, and redacted payload display metadata
  - does not include raw secrets or sensitive full payloads in operator-facing
    projections

- Capability: `deferSchedulingToolkit`
  Test Case ID: `TC-JOB-PROC-UNIT-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - accepts valid one-off `runAt` delayed jobs
  - rejects unsupported recurring schedule or cron expression input in v1
  - validates runAt bounds if the implementation defines bounds

## Integration Tests For Features Working Together

- Flow: transactional enqueue persists domain-coupled job request
  Test Case ID: `TC-JOB-PROC-INT-001`
  Recommended Test Layer: `persistence-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are preserved
  Cleanup Expectation: job, outbox, and attempt records should be attributable
  to a test run or reset by the Postgres harness
  Features:
  - `jobProcessing`
  Coverage:
  - commits a durable job request and outbox row in the same transaction
  - proves rollback leaves neither durable domain stub nor job request behind
  - enforces idempotency key uniqueness where supplied

- Flow: outbox dispatcher publishes committed requests to provider adapter
  Test Case ID: `TC-JOB-PROC-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes for persistence-backed rows
  Cleanup Expectation: dispatcher-created state reset by Postgres harness
  Features:
  - `jobProcessing`
  Coverage:
  - claims undispatched rows safely
  - calls the queue provider adapter with provider-neutral job data
  - marks rows dispatched with provider job metadata
  - leaves failed dispatch rows durable and retryable
  Notes:
  - may use a fake provider adapter unless a Redis-backed provider test is
    explicitly enabled

- Flow: worker executes registered handler and records attempts
  Test Case ID: `TC-JOB-PROC-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: attempt records reset by Postgres harness
  Features:
  - `jobProcessing`
  Coverage:
  - loads durable job data
  - validates job type and payload version before execution
  - calls the registered handler
  - records worker ID, attempt start, attempt finish, and succeeded status

- Flow: retryable worker failure schedules retry and records history
  Test Case ID: `TC-JOB-PROC-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset persistence-backed state
  Features:
  - `jobProcessing`
  Coverage:
  - records a failed attempt with safe error summary
  - increments attempt count
  - computes next retry time using backoff policy
  - preserves previous attempt history

- Flow: exhausted job enters dead-letter state
  Test Case ID: `TC-JOB-PROC-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset persistence-backed state
  Features:
  - `jobProcessing`
  Coverage:
  - exhausts max attempts
  - marks job `dead`
  - preserves every attempt
  - stores dead-letter reason without deleting job metadata

- Flow: queue provider adapter contract
  Test Case ID: `TC-JOB-PROC-INT-006`
  Recommended Test Layer: `adapter-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no unless durable rows are written
  Cleanup Expectation: provider queues should be isolated or flushed by test
  setup when Redis-backed mode is enabled
  Features:
  - `jobProcessing`
  - BullMQ provider adapter
  Coverage:
  - maps platform queue names, priority, runAt/delay, retry metadata, and
    idempotency/provider job IDs into BullMQ without leaking BullMQ types to
    callers
  - runs against a fake provider for the provider-neutral foundation seam before
    provider integration
  - gains Redis-backed BullMQ coverage once the BullMQ provider adapter is
    selected and integrated

- Flow: notification-delivery adoption remains seam-compatible
  Test Case ID: `TC-JOB-PROC-INT-007`
  Recommended Test Layer: `contract-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no for contract-only proof
  Cleanup Expectation: none unless persistence-backed fixture rows are created
  Features:
  - `jobProcessing`
  - `notificationDelivery`
  Coverage:
  - proves the `notification.email.send` job can be represented with a
    small payload such as `outboundEmailId`
  - confirms the job-processing contract does not require raw email content in
    the job payload
  Notes:
  - redacted verification/reset email content remains outside async delivery
    until a richer owner-regenerated content model is approved

## End-To-End Journey Tests

- Flow: first backend foundation slice
  Test Case ID: `TC-JOB-PROC-E2E-001`
  Related Journey ID: N/A
  Recommended Test Layer: `not-required`
  Suggested Test Folder: N/A
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - no end-to-end journey test is required until a real user-facing workflow,
    operator UI, or feature-specific batch progress surface consumes the
    foundation
  Notes:
  - future notification retry, import/export, campaign, or operator job UI
    slices should create their own journey inventory if they add durable user
    journeys

## NFR Security Tests

- Scenario: payload safety rejects secrets and authority grants
  Test Case ID: `TC-JOB-PROC-SEC-001`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/security/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - rejects bearer tokens, session IDs, passwords, private keys, credentials,
    live role claims, live permission lists, and broad authority grants in job
    payloads
  - verifies safe error responses do not echo secret values

- Scenario: tenant-scoped jobs require exactly one tenant context
  Test Case ID: `TC-JOB-PROC-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persistence is used
  Cleanup Expectation: reset durable rows
  Coverage:
  - rejects missing tenant ID for tenant jobs
  - rejects ambiguous tenant context
  - rejects object/entity execution when the handler cannot prove tenant
    ownership through the owning feature seam

- Scenario: jobs do not replay request sessions or bearer tokens
  Test Case ID: `TC-JOB-PROC-SEC-003`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/security/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - stores requester actor identity only as audit attribution
  - prevents handler execution context from being built from an HTTP session ID
    or bearer token payload field

- Scenario: unregistered or disabled job types cannot execute
  Test Case ID: `TC-JOB-PROC-SEC-004`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persistence is used
  Cleanup Expectation: reset durable rows
  Coverage:
  - rejects enqueue for unknown job type
  - refuses worker execution for unknown or unsupported job type
  - records safe failure posture without invoking arbitrary code

- Scenario: future operator metadata projection is redacted
  Test Case ID: `TC-JOB-PROC-SEC-005`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/security/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - safe job metadata excludes raw payload values marked sensitive
  - error summaries are sanitized before storage or projection
  - provider metadata does not include Redis connection secrets or credentials

## NFR Logging Or Audit Tests

- Scenario: enqueue attribution is persisted without becoming authority
  Test Case ID: `TC-JOB-PROC-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows
  Coverage:
  - persists requester actor attribution when supplied
  - does not use attribution as runtime authz input
  - preserves attribution through dispatch and execution metadata

- Scenario: attempt history is durable and inspectable
  Test Case ID: `TC-JOB-PROC-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows
  Coverage:
  - records attempt number, worker ID, started/finished timestamps, status, and
    safe error summary
  - preserves previous attempts after retry and dead-letter transitions

- Scenario: dispatch failures are operationally visible
  Test Case ID: `TC-JOB-PROC-AUD-003`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows
  Coverage:
  - records dispatch failure count, last dispatch error summary, and retryable
    dispatch state
  - avoids logging sensitive payload bodies

- Scenario: future manual retry/cancel hooks preserve audit requirements
  Test Case ID: `TC-JOB-PROC-AUD-004`
  Recommended Test Layer: `audit-unit`
  Suggested Test Folder: `tests/audit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - verifies state model includes actor, reason, and affected job hooks for
    future operator retry/cancel without exposing mutation APIs in v1

## NFR Concurrency And Idempotency Tests

- Scenario: concurrent enqueue with same idempotency key creates one logical job
  Test Case ID: `TC-JOB-PROC-CONC-001`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows
  Coverage:
  - concurrent calls using the same job type and idempotency key resolve to one
    durable job request
  - duplicate callers receive deterministic idempotency metadata

- Scenario: concurrent dispatchers do not publish the same outbox row twice
  Test Case ID: `TC-JOB-PROC-CONC-002`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows and provider queue state
  Coverage:
  - two dispatcher loops racing over pending rows claim rows safely
  - provider publish is idempotent where duplicate publish cannot be completely
    avoided

- Scenario: worker retry is safe after partial handler failure
  Test Case ID: `TC-JOB-PROC-CONC-003`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows
  Coverage:
  - simulates handler failure after a side-effect marker is written
  - verifies retry relies on handler idempotency key or domain state rather than
    blindly duplicating side effects

- Scenario: bulk queue work does not starve critical/default queue work
  Test Case ID: `TC-JOB-PROC-CONC-004`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows and provider queue state
  Coverage:
  - loads bulk jobs and critical/default jobs
  - verifies queue-level worker configuration keeps non-bulk work eligible for
    timely execution

## NFR Performance, Stress, And Soak Tests

- Scenario: dispatcher handles a moderate pending outbox batch deterministically
  Test Case ID: `TC-JOB-PROC-PERF-001`
  Recommended Test Layer: `performance-light`
  Suggested Test Folder: `tests/performance/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when using durable rows
  Cleanup Expectation: reset durable rows and provider queue state
  Coverage:
  - verifies dispatcher batch processing stays deterministic for a moderate
    local dataset
  - validates indexes support pending-row polling by status, runAt, priority,
    and lock fields
  Notes:
  - this is not a production throughput benchmark

- Scenario: retry jitter avoids synchronized retry storm
  Test Case ID: `TC-JOB-PROC-PERF-002`
  Recommended Test Layer: `performance-unit`
  Suggested Test Folder: `tests/performance/jobProcessing/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - computes retry delays for many failed jobs
  - verifies jitter distributes retry times within the approved window rather
    than scheduling every retry at the same instant

## NFR Resilience And Compatibility Tests

- Scenario: Redis/BullMQ provider unavailable during dispatch
  Test Case ID: `TC-JOB-PROC-RESILIENCE-001`
  Recommended Test Layer: `resilience-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows
  Coverage:
  - provider publish failure does not delete or mark outbox row dispatched
  - dispatch retry metadata and safe error summary are persisted

- Scenario: worker crash or stalled provider job remains retryable
  Test Case ID: `TC-JOB-PROC-RESILIENCE-002`
  Recommended Test Layer: `resilience-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows and provider queue state
  Coverage:
  - simulates a worker failing during execution
  - verifies durable attempt state is not left as a false success
  - verifies the job remains eligible for retry according to provider and
    platform state

- Scenario: graceful shutdown stops new work and drains in-flight work
  Test Case ID: `TC-JOB-PROC-RESILIENCE-003`
  Recommended Test Layer: `resilience-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - worker runtime handles `SIGTERM`/`SIGINT`
  - stops accepting new jobs
  - waits for bounded in-flight drain
  - closes provider workers cleanly

- Scenario: provider-neutral seam does not leak BullMQ types
  Test Case ID: `TC-JOB-PROC-COMPAT-001`
  Recommended Test Layer: `contract-compatibility`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - enqueue, dispatcher, and handler interfaces expose platform-owned types
  - feature-facing tests can use a fake provider adapter without BullMQ imports
  - provider adapter translates from platform contracts to BullMQ internally

- Scenario: queued historical payload version remains executable
  Test Case ID: `TC-JOB-PROC-COMPAT-002`
  Recommended Test Layer: `contract-compatibility`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persistence-backed
  Cleanup Expectation: reset durable rows
  Coverage:
  - registers multiple payload versions for one job type
  - executes an older queued payload version after a newer version is registered
  - rejects removed/unsupported versions explicitly rather than misparsing them

## Edge Cases And Negative Tests

- Scenario: unknown queue or invalid priority is rejected
  Test Case ID: `TC-JOB-PROC-EDGE-001`
  Recommended Test Layer: `edge-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - rejects unsupported queue names
  - rejects invalid priority values
  - keeps error response provider-neutral

- Scenario: unsupported recurring schedule is rejected in v1
  Test Case ID: `TC-JOB-PROC-EDGE-002`
  Recommended Test Layer: `edge-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - rejects cron expression or recurring schedule fields
  - accepts one-off `runAt` where valid
  - clearly communicates that public enqueue requests cannot create ad hoc
    recurring schedules; recurring maintenance uses the separate
    code-declared scheduler seam

## Recurring Scheduler Foundation Tests

- Capability: `createRecurringScheduleRegistry`
  Test Case ID: `TC-SCHED-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - rejects duplicate schedule keys
  - rejects unstable or malformed schedule keys
  - rejects unsupported job type and payload-version references when a job
    registry is supplied
  - enforces a minimum supported cadence for platform maintenance schedules

- Capability: `runRecurringSchedulerOnce`
  Test Case ID: `TC-SCHED-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - upserts code-declared schedule definitions before claiming due work
  - enqueues one due maintenance job through the job-processing service seam
  - uses deterministic due-slot idempotency keys
  - advances the schedule to the next future cadence after a successful enqueue

- Scenario: scheduler replay does not duplicate an already-claimed due slot
  Test Case ID: `TC-SCHED-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - records a due-slot run outcome
  - prevents a repeated scheduler tick from enqueueing the same due slot twice
  - preserves at-least-once retry posture for retryable scheduler failures

- Scenario: code-declared platform maintenance schedules validate against the registry
  Test Case ID: `TC-SCHED-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - registers multiple code-declared platform maintenance schedules
  - validates those schedules against the job-processing job registry
  - keeps schedule payloads scoped to internal platform maintenance work

- Capability: recurring scheduler persistence
  Test Case ID: `TC-SCHED-INT-001`
  Recommended Test Layer: `persistence-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable recurring schedule and run rows
  Coverage:
  - persists schedule definitions and next-run timestamps
  - claims due schedules with scheduler identity and a lease
  - records due-slot run outcomes durably
  - prevents a completed due slot from being claimed again

- Scenario: non-retryable handler error does not churn all attempts
  Test Case ID: `TC-JOB-PROC-EDGE-003`
  Recommended Test Layer: `edge-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows
  Coverage:
  - handler classifies an error as non-retryable
  - job transitions to terminal failure/dead posture according to policy
  - safe error summary is stored once

- Scenario: canceled or dead job is not executed by normal worker path
  Test Case ID: `TC-JOB-PROC-EDGE-004`
  Recommended Test Layer: `edge-integration`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows
  Coverage:
  - worker receives or loads a job whose durable state is terminal
  - handler is not invoked
  - state remains honest and auditable

- Scenario: job metadata indexes support future operator filters
  Test Case ID: `TC-JOB-PROC-EDGE-005`
  Recommended Test Layer: `persistence-edge`
  Suggested Test Folder: `tests/integration/jobProcessing/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset durable rows
  Coverage:
  - verifies persistence supports filtering by status, queue, job type, tenant,
    related entity, created/completed timestamps, and dead-letter posture
  - avoids relying on raw JSON payload search for operator metadata

## Coverage Gaps Or Open Questions

- Item:
  Redis-backed BullMQ tests are implemented as explicit provider-integration
  tests. They require Redis and `RUN_REDIS_JOB_PROVIDER_TESTS=true`; the normal
  local suite continues to use fake-provider contract coverage.
- Item:
  The implementation blueprint must decide whether registered job-type metadata
  is persisted in v1 or remains code-defined until operator APIs exist.
- Item:
  The implementation blueprint must decide whether any read-only debug endpoint
  exists in v1 or operator APIs remain fully deferred.
- Item:
  The implementation blueprint must decide whether worker startup is one generic
  script or multiple queue-class scripts.
- Item:
  Traceability should remain deferred until executable tests are added.

## Required QA Evidence

- QA checklist required:
  yes, for backend/platform foundation implementation
- Exploratory QA note required:
  recommended after implementation, focused on local Redis bootstrap,
  worker/dispatcher operation, and failure-mode observability
- Curated test-run summary required:
  yes, once executable tests are implemented
- Waiver or quarantine record expected:
  no waiver required for the adapter slice because Redis-backed provider tests
  exist; their opt-in flag is intentional so the normal suite does not require
  Redis
