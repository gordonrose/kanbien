# Job Processing Foundation Implementation Blueprint

## Summary

- Feature:
  `jobProcessing`
- Capability:
  BullMQ-backed asynchronous job-processing foundation with transactional
  outbox, registered handlers, at-least-once execution, retry/dead-letter
  policy, payload safety, tenant-scope rules, and worker runtime
- Scope:
  backend/platform foundation slice only
- Phase:
  first foundation slice implemented with provider-neutral seams and concrete
  BullMQ adapter wiring

## Inputs

- Capability matrix reference:
  [2026-04-25-job-processing-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-25-job-processing-foundation-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-25-job-processing-foundation-capability-matrix-first-draft-notes.md)
- PRD:
  [2026-04-25-0021-job-processing-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-25-0021-job-processing-foundation.md)
- ADR(s):
  [0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md](/home/gordon/kanbien/docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md)
- PRD test-case doc:
  [2026-04-25-0021-job-processing-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-25-0021-job-processing-foundation-test-cases.md)
- Journey inventory:
  not required for this backend foundation slice
- QA coverage matrix classification:
  shared platform foundation with persistence-backed workflow, external
  dependency integration, worker lifecycle, retry/dead-letter behavior,
  tenant-boundary implications, and compatibility-sensitive provider seam
- QA release-gate expectation:
  deterministic unit, integration, security, audit, edge, concurrency,
  resilience, compatibility, and light performance proof, plus local Redis
  bootstrap/runbook evidence before treating implementation as complete

## Scope Confirmation

This blueprint covers the first job-processing foundation only:

- add the `jobProcessing` feature/foundation
- add provider-neutral adapter seams with BullMQ/Redis still the selected
  first-provider direction
- add the concrete BullMQ-backed provider adapter while keeping BullMQ/Redis
  types out of feature-facing public seams
- add PostgreSQL-backed durable job/outbox/attempt persistence
- add transactional enqueue service seam
- add dispatcher runtime
- add worker runtime
- add explicit job type registry
- add retry/dead-letter policy
- add payload and tenant-scope validation
- preserve future operator metadata
- support one-off delayed jobs through `runAt`

This blueprint does **not** implement:

- root-admin operator job APIs or UI
- manual retry/cancel APIs
- recurring scheduling toolkit
- generic workflow/event bus
- security-sensitive notification-delivery async content regeneration
- SQS/RabbitMQ adapters

## Frontend Plan

- Route / surface:
  none in this slice
- UI states:
  none in this slice
- Permission visibility behavior:
  no client-side behavior in v1; future operator UI must gate by
  `jobProcessing.*` capabilities
- Session / expiry behavior:
  no frontend session behavior in v1
- Browser security considerations:
  no browser surface is added; payload redaction matters for future operator UI

## Backend Plan

- Route(s):
  none in v1
- Request/response/error contract:
  no public HTTP contract in the first implementation
  - provider-neutral internal enqueue contract
  - provider-neutral dispatcher contract
  - provider-neutral worker/handler contract
  - stable feature-owned errors for invalid job type, invalid payload,
    invalid scope, duplicate idempotency key, dispatch failure, retry failure,
    and terminal/dead state
- Feature-local files expected:
  - `src/features/jobProcessing/index.ts`
  - `src/features/jobProcessing/integration.ts`
  - `src/features/jobProcessing/README.md`
  - `src/features/jobProcessing/feature.manifest.json`
  - `src/features/jobProcessing/contract/errors.ts`
  - `src/features/jobProcessing/contract/types.ts`
  - `src/features/jobProcessing/domain/types.ts`
  - `src/features/jobProcessing/domain/service.ts`
  - `src/features/jobProcessing/domain/enqueueTransactionalJobRequest.ts`
  - `src/features/jobProcessing/domain/dispatchOutboxToQueue.ts`
  - `src/features/jobProcessing/domain/executeRegisteredJob.ts`
  - `src/features/jobProcessing/domain/retryPolicy.ts`
  - `src/features/jobProcessing/domain/payloadSafety.ts`
  - `src/features/jobProcessing/domain/jobRegistry.ts`
  - `src/features/jobProcessing/domain/queueConfig.ts`
  - `src/features/jobProcessing/domain/workerRuntime.ts`
  - `src/features/jobProcessing/domain/provider.ts`
  - `src/features/jobProcessing/domain/bullmqQueueProviderAdapter.ts`
  - `src/features/jobProcessing/persistence/types.ts`
  - `src/features/jobProcessing/persistence/repository.ts`
  - `src/features/jobProcessing/persistence/postgresRepository.ts`
  - `src/features/jobProcessing/persistence/migrations/0040_create_job_processing.sql`
- Platform files expected:
  - `src/config/env.ts`
    - add Redis/job-processing env parsing, centered on `REDIS_URL`
  - `src/jobWorker.ts`
    - worker entrypoint separate from HTTP server
  - `src/jobDispatcher.ts`
  - `src/jobWorker.ts`
    - wire runtime processes to the BullMQ provider adapter via `REDIS_URL`
  - `package.json`
    - add scripts such as `worker:jobs` and possibly `dispatcher:jobs`
  - `src/routes/v1/index.ts`
    - no route mount in v1 unless implementation explicitly adds a protected
      debug/read-only route, which would require PRD update first
- Cross-feature seams:
  - consuming features use `jobProcessing` exported enqueue seam only
  - job handlers call owning feature public seams only
  - no feature may import `jobProcessing/persistence/*` directly
  - no feature may import BullMQ/Redis directly
- Feature manifests to update:
  - new `src/features/jobProcessing/feature.manifest.json`
  - future consuming features must update their manifests when they add
    job-processing dependencies
  - no existing feature manifest should change in the foundation-only slice
    unless a real consumer is added
- Authorization enforcement point:
  - no HTTP authz in v1 because no API route is added
  - business authorization occurs in the caller feature before enqueue
  - worker execution validates registered job scope and tenant context
  - future operator APIs require root authz capabilities and audit

## Persistence Plan

- Entities / rows affected:
  - durable job request table
  - durable outbox/dispatch table or outbox columns on the job table
  - durable job attempt table
  - optional future operator metadata fields
- Migration changes:
  - add new feature-scoped migration under
    `src/features/jobProcessing/persistence/migrations/`
  - use the next sortable zero-padded prefix after the current migration set
  - do not edit existing migrations
- Suggested storage model:
  - `job_processing_job`
    - `job_id`
    - `job_type`
    - `queue_name`
    - `payload_version`
    - `payload_json`
    - `execution_scope`
    - `tenant_id`
    - `requested_by_actor_type`
    - `requested_by_actor_id`
    - `idempotency_key`
    - `status`
    - `priority`
    - `run_at`
    - `attempt_count`
    - `max_attempts`
    - `dead_letter_reason`
    - `related_entity_type`
    - `related_entity_id`
    - `created_at`
    - `updated_at`
    - `completed_at`
  - `job_processing_outbox`
    - `outbox_id`
    - `job_id`
    - `dispatch_status`
    - `provider_job_id`
    - `dispatch_attempt_count`
    - `locked_by`
    - `locked_until`
    - `last_error_summary`
    - `dispatched_at`
    - `created_at`
    - `updated_at`
  - `job_processing_attempt`
    - `attempt_id`
    - `job_id`
    - `attempt_number`
    - `worker_id`
    - `status`
    - `started_at`
    - `finished_at`
    - `error_code`
    - `error_summary`
- Index or uniqueness changes:
  - unique idempotency key per job type when supplied
  - indexes for outbox polling:
    - `dispatch_status`
    - `run_at`
    - `priority`
    - `locked_until`
    - `created_at`
  - indexes for future operator filters:
    - `status`
    - `queue_name`
    - `job_type`
    - `tenant_id`
    - `related_entity_type`
    - `related_entity_id`
    - `created_at`
    - `completed_at`
    - `dead_letter_reason`
  - indexes for attempt inspection:
    - `job_id`
    - `attempt_number`
    - `worker_id`
    - `started_at`
- Search/filter implications:
  - do not depend on arbitrary JSON payload search
  - searchable operator fields should be scalar columns
  - payload JSON may be stored for execution, but future operator display must
    use redacted projection helpers
- Compatibility notes:
  - payload versions must remain executable while queued historical jobs exist
  - provider job IDs are implementation metadata, not stable domain identity
  - future provider adapters should preserve platform-level state semantics

## Runtime And Dependency Plan

- Dependencies:
  - no new provider dependency in the first provider-neutral slice
  - add `bullmq` and the Redis client dependency required by the selected
    BullMQ version when the concrete adapter is integrated
- Environment:
  - add `REDIS_URL`
  - consider optional development default `redis://localhost:6379`
  - avoid committing credentials
- Local development:
  - document local Redis startup, likely:
    `docker run --name kanbien-redis -p 6379:6379 -d redis:7`
  - local-only Redis is sufficient until an infrastructure provider is chosen
- Startup:
  - web server should not become a worker
  - worker/dispatcher process should fail fast when Redis is required and
    unavailable
  - dispatch and execution are separate scripts:
    `src/jobDispatcher.ts` and `src/jobWorker.ts`
- Test harness:
  - normal unit/integration tests should be able to use fake provider adapters
  - Redis-backed BullMQ tests are explicit provider-integration tests gated by
    `RUN_REDIS_JOB_PROVIDER_TESTS=true`, so the normal suite does not silently
    require a local daemon

## Verification Plan

- Journey tier / workflow scope:
  no end-to-end journey required until a user-facing or operator-facing
  workflow consumes the foundation
- Unit:
  implement `TC-JOB-PROC-UNIT-001` through `TC-JOB-PROC-UNIT-008`
- Integration:
  implement `TC-JOB-PROC-INT-001` through `TC-JOB-PROC-INT-007`
- Security:
  implement `TC-JOB-PROC-SEC-001` through `TC-JOB-PROC-SEC-005`
- Audit:
  implement `TC-JOB-PROC-AUD-001` through `TC-JOB-PROC-AUD-004`
- Edge:
  implement `TC-JOB-PROC-EDGE-001` through `TC-JOB-PROC-EDGE-005`
- Frontend:
  not applicable
- Persistence-backed:
  required for transaction/outbox, idempotency, attempt history, dead-letter,
  and index-backed filter proof
- End-to-end:
  not required for this slice
- Concurrency / idempotency:
  implement `TC-JOB-PROC-CONC-001` through `TC-JOB-PROC-CONC-004`
- Performance:
  implement light local proofs `TC-JOB-PROC-PERF-001` and
  `TC-JOB-PROC-PERF-002`; do not treat these as production benchmarks
- Resilience / failure-injection:
  implement `TC-JOB-PROC-RES-001` through `TC-JOB-PROC-RES-003`
- Compatibility / contract:
  implement `TC-JOB-PROC-COMPAT-001` and `TC-JOB-PROC-COMPAT-002`
- Accessibility:
  not applicable
- Structured exploratory QA:
  recommended after implementation, focused on local Redis bootstrap,
  dispatcher/worker operation, dependency failure behavior, and observability
- QA checklist:
  required for implementation
- Curated test-run summary:
  required once executable tests exist
- Waiver / quarantine expectation:
  not required for this adapter slice because Redis-backed provider tests are
  present and explicitly opt-in

## Documentation Plan

- PRD updates:
  update implementation status after the foundation is implemented
- PRD test-case updates:
  change traceability enforcement from deferred to enforced only after
  executable coverage exists and traceability is clean for `JOB-PROC`
- Feature docs:
  add `src/features/jobProcessing/README.md`
  add or update `docs/featureDocs/job-processing-feature.md` if feature docs
  are maintained for this platform foundation
- API contract docs:
  not required in v1 because no external route is added
  required later if operator APIs are introduced
- OpenAPI:
  not required in v1
  required later if operator APIs are introduced
- Postman:
  not required in v1
  required later if operator APIs are introduced and Postman coverage is
  maintained for that route family
- Data dictionary:
  required for new durable job/outbox/attempt tables
- Feature manifests:
  add `jobProcessing` manifest
  update future consuming feature manifests only when they actually consume the
  seam
- Dependency graph artifacts:
  regenerate
  `docs/architecture/generated/feature-dependency-graph.json` and
  `docs/architecture/generated/feature-dependency-graph.md` after adding the
  feature manifest
- Architecture map:
  review `docs/workspace/architecture-map/` because this slice changes core
  platform capability posture
- Standards platform-status snapshots:
  review:
  - `docs/standards/platform-status/QA-RELEASE-STATUS.md`
  - `docs/standards/platform-status/NIST-SSDF-STATUS.md`
  - `docs/standards/platform-status/OWASP-ASVS-STATUS.md`
  - `docs/standards/platform-status/ISO-27001-27002-STATUS.md`
  - `docs/standards/platform-status/GDPR-DATA-TRANSFER-STATUS.md`
  - `docs/standards/platform-status/AI-ASSISTED-DEVELOPMENT-STATUS.md`
- Reconstruction questionnaire:
  review if the repo has a current build-from-spec questionnaire; Redis and
  worker startup are new rebuild assumptions
- Bootstrap and helper docs:
  update
  [platform-bootstrap-and-local-helpers-guide.md](/home/gordon/kanbien/docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md)
  with Redis, `REDIS_URL`, and worker/dispatcher startup expectations
- Maintained-artifacts sweep:
  review and update:
  - [system-overview.md](/home/gordon/kanbien/docs/architecture/system-overview.md)
  - [priniciples.md](/home/gordon/kanbien/docs/architecture/priniciples.md) only
    if implementation introduces new guardrails beyond ADR-0034
  - `docs/prd/2026-04-08-0008-notification-delivery-foundation.md` because
    notification-delivery now registers its first job-processing handler
  - this blueprint after implementation decisions settle
- Runbook:
  add a lightweight local operations note for:
  - starting Redis locally
  - running worker/dispatcher scripts
  - recognizing dispatch failures
  - clearing local queues safely in development
- Privacy note:
  required because job metadata and payloads may contain tenant/entity/user
  references and future operator projections must be redacted
- Standards review:
  required after implementation
- Repo health review:
  recommended after the foundation and generated dependency artifacts are
  updated

## Implementation Sequence

1. Add dependencies and env parsing in a small, reviewable step.
2. Add feature skeleton, manifest, and provider-neutral domain types.
3. Add persistence migration and repository implementation.
4. Add enqueue service, payload safety, scope validation, and registry.
5. Add dispatcher and fake-provider tests.
6. Add BullMQ provider adapter and Redis-backed provider integration tests once
   that provider integration is in scope.
7. Add worker runtime, retry/dead-letter policy, worker identity, and graceful
   shutdown.
8. Add package scripts and local bootstrap documentation.
9. Add executable tests mapped to `TC-JOB-PROC-*`.
10. Regenerate feature dependency graph and complete maintained-artifact sweep.

## Completion Guardrails

- Blocking QA outcomes:
  - transaction/outbox tests prove no committed business-coupled job request is
    lost on rollback or dispatcher failure
  - payload safety tests reject secret-bearing and authority-bearing payloads
  - tenant-scope tests reject missing or ambiguous tenant context
  - worker/retry tests preserve attempt history and dead-letter state
  - provider boundary tests prove features do not depend on BullMQ types
- Explicitly deferred verification layers and rationale:
  - frontend/accessibility:
    no UI in v1
  - end-to-end journey:
    no user-facing or operator-facing journey in v1
  - production throughput benchmark:
    no production SLA declared; light local performance proof is enough
  - operator API security tests:
    no operator APIs in v1
  - Redis-backed provider integration tests in the normal suite:
    present but skipped unless `RUN_REDIS_JOB_PROVIDER_TESTS=true`, preserving
    normal fake-provider contract coverage without requiring Redis
- Expected release-gate residual risk statement:
  v1 introduces async processing infrastructure and a local Redis dependency,
  but no external operator control surface. Remaining risk should be framed
  around worker/dispatcher operability, provider dependency availability,
  handler idempotency discipline, and the intentionally deferred operator UI/API
  controls.
