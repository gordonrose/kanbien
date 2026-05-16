# Recurring Maintenance Scheduler Foundation Implementation Blueprint

## Summary

- Feature:
  `jobProcessing`
- Capability:
  Platform-owned recurring maintenance scheduler for code-declared recurring
  jobs, with durable run history, overlap prevention, missed-run handling, and
  a deferred first-consumer boundary for Organization export maintenance jobs.
- Scope:
  backend/platform foundation planning only; no implementation in this
  blueprint change.
- Phase:
  planning-ready follow-up to ADR-0046.

## Inputs

- Capability matrix reference:
  explicit planning exception. No scheduler-specific capability matrix exists
  yet; this blueprint is scoped from ADR-0046 and current implementation gaps
  surfaced by Organization Domain Foundation S-012 and S-015.
- PRD:
  explicit planning exception. No scheduler-specific PRD exists yet; a PRD or
  targeted Technical Steering addendum should be created before implementation
  if this moves beyond an internal platform seam.
- Exact ADR discovery:
  - ADR files reviewed:
    - `docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md`
    - `docs/architecture/adr/0035-adopt-object-storage-backed-asset-foundation.md`
    - `docs/architecture/adr/0043-use-platform-owned-job-lifecycle-hardening-for-long-running-work.md`
    - `docs/architecture/adr/0044-use-private-generated-export-bundles-for-sensitive-domain-exports.md`
    - `docs/architecture/adr/0045-use-app-controlled-public-asset-delivery-for-rendered-domain-assets.md`
    - `docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md`
  - Change areas reviewed:
    job processing, recurring cadence, one-off delayed jobs, generated export
    cleanup, stale-running timeout sweeps, public asset cleanup/cache
    invalidation, feature-owned lifecycle semantics, operator visibility.
  - Enduring decision areas with no existing ADR found:
    production scheduler provider/process topology, persisted schedule
    declaration model, root/operator schedule APIs, schedule UI.
  - New ADR required:
    no new ADR before planning. Implementation should either promote or
    supersede ADR-0046 with an Accepted concrete scheduler ADR.
  - ADR conflict / stale guidance:
    none. ADR-0034 explicitly deferred recurring jobs; ADR-0046 preserves that
    deferral until this implementation is approved.
- PRD test-case doc:
  none yet. Implementation should add scheduler test cases or a focused
  platform QA artifact before code completion.
- Journey inventory:
  not applicable; no frontend or user journey in the first scheduler slice.
- QA coverage matrix classification:
  shared platform backend foundation with persistence, background process,
  concurrency/lease, idempotency, time-based behavior, resilience, and
  compatibility implications.
- QA release-gate expectation:
  unit, persistence-backed integration, concurrency/overlap, resilience,
  compatibility, and operational runbook proof. Redis/provider integration
  should remain opt-in where external infrastructure is required.

## Scope Confirmation

This blueprint covers the first recurring scheduler foundation only:

- code-declared recurring maintenance schedules
- durable scheduler run records
- leasing/overlap prevention
- missed-run policy
- one scheduler runtime entrypoint separate from HTTP server
- enqueue through existing `jobProcessing` public seams
- a clear deferral boundary for first feature-owned consumers:
  - `organization.export.cleanup`
  - `organization.export.timeout_sweep`
- documentation updates that prevent Organization export scheduler cadence
  from being presented as real until the owning feature slice wires it

This blueprint does **not** implement:

- root-admin scheduler APIs
- scheduler UI
- dynamic user-created schedules
- cron expression editing by users
- business workflow scheduling
- per-tenant custom cadence
- generic calendar/time-zone scheduling
- queue provider replacement
- CDN/cache provider integration

## Frontend Plan

- Route / surface:
  none.
- UI states:
  none in the first scheduler slice.
- Permission visibility behavior:
  no frontend permissions. Future operator APIs/UI would require root/operator
  capabilities and separate Technical Steering.
- Session / expiry behavior:
  no browser session behavior.
- Browser security considerations:
  no browser surface is added.

## Backend Plan

- Route(s):
  none in the first slice.
- Request/response/error contract:
  no public HTTP contract. The scheduler is an internal platform runtime that
  reads code-declared schedules and writes durable scheduler run records.
- Feature-local files expected:
  - `src/features/jobProcessing/domain/recurringScheduleRegistry.ts`
  - `src/features/jobProcessing/domain/recurringScheduler.ts`
  - `src/features/jobProcessing/domain/recurringScheduleTypes.ts`
  - `src/features/jobProcessing/domain/schedulerLease.ts`
  - `src/features/jobProcessing/persistence/repository.ts`
  - `src/features/jobProcessing/persistence/postgresRepository.ts`
  - `src/features/jobProcessing/persistence/types.ts`
  - `src/features/jobProcessing/persistence/migrations/00xx_add_recurring_scheduler.sql`
  - `src/features/jobProcessing/index.ts`
  - `src/features/jobProcessing/integration.ts`
  - `src/features/jobProcessing/feature.manifest.json`
- Platform files expected:
  - `src/jobScheduler.ts`
  - `package.json`
    - add `scheduler:jobs` or equivalent runtime script
  - local helper/bootstrap docs if the scheduler process becomes part of
    normal development or staging operation.
- Cross-feature seams:
  - Scheduler enqueues through `jobProcessing`, not through feature
    persistence.
  - Schedule definitions reference registered job types and payload factories.
  - This isolated platform slice must not import `organizationExports`.
  - Organization export jobs remain owned by `organizationExports` and will
    adopt scheduler definitions in the follow-on Organization export
    slice.
- Feature manifests to update:
  - `src/features/jobProcessing/feature.manifest.json`
    - add scheduler registry/runtime public seam if exported.
  - `src/features/organizationExports/feature.manifest.json`
    - not changed in this platform-only slice; update when cleanup and timeout
      jobs are scheduled through `jobProcessing`.
  - Generated dependency graph artifacts after manifest changes.
- Authorization enforcement point:
  no request-time actor authorization. Scheduled jobs run as
  `platform-internal` and must enqueue only job types whose registered scope
  allows platform-internal execution or whose payload factory supplies the
  exact tenant context required by the target job type.

## Async Job Processing Decision Gate

- Does async work apply?
  yes. The scheduler exists to trigger recurring background maintenance.
- Feature-owned durable entity:
  scheduler run records live in `jobProcessing`; business entities remain in
  their owning features.
- Facts persisted before enqueue:
  schedule key, due time, lease owner, run status, enqueue result, job id when
  created, failure category, safe error summary, started/completed timestamps.
- Job type names:
  no feature-owned first consumers are wired in this slice. Planned follow-on
  consumers remain:
  - `organization.export.cleanup`
  - `organization.export.timeout_sweep`
- Smallest safe payloads:
  cleanup payloads may include bounded operational controls such as `limit`,
  `maxAttempts`, and `timeoutMs`. Payloads must not include secrets, sessions,
  bearer tokens, raw role grants, or live permission claims.
- Idempotency:
  scheduled enqueue should use deterministic idempotency keys based on
  schedule key plus due window, such as
  `<scheduleKey>:<scheduledForIso>`, so repeated scheduler attempts do not
  create duplicate maintenance jobs for the same due slot.
- Tenant/object validation:
  scheduler-foundation tests use platform-internal maintenance payloads only.
  When Organization export jobs adopt the scheduler, they should remain
  `platform-internal` sweeps and tenant/object filtering must remain in the
  Organization export service and persistence queries.
- Outcomes:
  scheduler run status should distinguish at least `due`, `leased`,
  `enqueued`, `skipped_overlap`, `failed_retryable`, and `failed_terminal`.
- Progress and operator metadata:
  record schedule key, due time, next eligible time, lease owner, enqueue job
  id, safe error summary, and attempt count.
- Cleanup and abandoned states:
  stale scheduler leases must expire. Missed runs should coalesce by default
  for sweep-style maintenance jobs rather than replaying every missed interval.
- Required seams/manifests:
  `jobProcessing` owns registry, run persistence, lease, and runtime.
  Consumers register schedule definitions through the job-processing
  integration boundary.
- Tests:
  prove due detection, lease acquisition, overlap prevention, idempotent
  enqueue, missed-run coalescing, retryable enqueue failure, invalid schedule
  rejection, and code-declared schedule validation. First-consumer schedule
  definitions are deferred to the owning feature slice.

## Persistence Plan

- Entities / rows affected:
  - add scheduler definition snapshot/run state table or tables under
    `jobProcessing`.
- Migration changes:
  - add a new `jobProcessing` migration. Do not edit `0040`.
- Suggested storage model:
  - `job_processing_recurring_schedule`
    - `schedule_key`
    - `job_type`
    - `payload_version`
    - `cadence_seconds`
    - `enabled`
    - `next_run_at`
    - `last_run_at`
    - `last_enqueued_job_id`
    - `lease_owner`
    - `lease_expires_at`
    - `failure_count`
    - `last_failure_category`
    - `last_error_summary`
    - `created_at`
    - `updated_at`
  - `job_processing_recurring_schedule_run`
    - `schedule_run_id`
    - `schedule_key`
    - `scheduled_for`
    - `status`
    - `job_id`
    - `attempt_count`
    - `lease_owner`
    - `started_at`
    - `completed_at`
    - `error_category`
    - `error_summary`
    - `created_at`
    - `updated_at`
- Index or uniqueness changes:
  - unique `schedule_key`
  - unique schedule-run key on `(schedule_key, scheduled_for)`
  - index `next_run_at WHERE enabled = TRUE`
  - index `lease_expires_at WHERE lease_owner IS NOT NULL`
  - index run history by `schedule_key`, `status`, and `created_at`
- Search/filter implications:
  no public search in the first slice. Store scalar fields for future operator
  reads; do not rely on JSON payload search.
- Lifecycle / cleanup rules:
  schedule definitions are code-declared. Removing a code-declared schedule
  should disable future runs but preserve run history unless a later retention
  policy says otherwise.
- Expiry / abandoned-state behavior:
  expired leases become eligible for another scheduler process. Missed
  intervals coalesce unless the schedule explicitly opts into catch-up.
- Orphaned external resource handling:
  scheduler does not own external resources; target features own cleanup of
  their generated files or assets.
- Scheduled maintenance or job dependency:
  scheduler depends on `jobProcessing` enqueue and dispatcher/worker
  processes. It must fail safely if enqueue is unavailable.
- Cleanup retry and failure recording:
  failed scheduler enqueues should retry on the next scheduler tick with a
  safe failure category. Feature cleanup failures remain feature-owned.
- Compatibility notes:
  keep `recurringSchedule` rejected on public enqueue requests unless the API
  contract is explicitly expanded. Code-declared schedules should not make
  client-supplied recurring schedules valid.

## Verification Plan

- Journey tier / workflow scope:
  backend/platform only.
- Unit:
  cadence due calculation, schedule normalization, invalid definitions,
  idempotency key generation, missed-run coalescing.
- Integration:
  persistence-backed due schedule leasing, enqueue through repository/service,
  status transitions, recovery after expired lease.
- Security:
  no secrets or session data in schedule definitions, run records, payloads, or
  errors; no client-supplied recurring schedule accepted.
- Audit:
  scheduler run history acts as operational evidence. If formal audit events
  are required later, add a platform audit seam before operator UI/API.
- Edge:
  clock skew tolerance, disabled schedules, schedule key rename/removal,
  enqueue failure, duplicate scheduler processes, stale leases.
- Frontend:
  none.
- Persistence-backed:
  required for lease and uniqueness behavior.
- End-to-end:
  optional first slice; a local worker/dispatcher/scheduler smoke test is
  useful if external Redis is available.
- Concurrency / idempotency:
  required. Two scheduler invocations must not enqueue duplicate jobs for the
  same schedule/due slot.
- Performance:
  due-schedule polling must use indexed scalar fields and bounded batch sizes.
- Resilience / failure-injection:
  required for enqueue failure, process crash after lease, and retry after
  lease expiry.
- Compatibility / contract:
  existing one-off `runAt` jobs still work; `recurringSchedule` remains
  rejected for normal enqueue requests.
- Accessibility:
  not applicable.
- Structured exploratory QA:
  operational dry run: scheduler due -> enqueue through `jobProcessing` for a
  code-declared platform maintenance schedule. Organization export
  cleanup/timeout end-to-end smoke proof belongs to the follow-on feature
  adoption slice.
- QA checklist:
  add or update a scheduler-focused checklist if implementation moves forward.
- Curated test-run summary:
  required for closeout.
- Waiver / quarantine expectation:
  no waiver expected for unit and persistence-backed tests. Redis-backed smoke
  proof may be environment-gated if local provider is unavailable.

## Documentation Plan

- PRD updates:
  create a small scheduler PRD or Technical Steering addendum before
  implementation if this becomes a delivery slice.
- PRD test-case updates:
  create scheduler test cases or add a platform QA artifact.
- Feature docs:
  - any future `docs/features/job-processing.md` if added.
  - `docs/features/organization-exports.md` only when the follow-on
    Organization export first-consumer slice wires schedules.
  - `docs/features/organization-public-logo.md` only when concrete logo
    cleanup/cache jobs are approved.
- API contract docs:
  none unless operator APIs are added.
- OpenAPI:
  none unless operator APIs are added.
- Postman:
  none unless operator APIs are added.
- Data dictionary:
  add scheduler tables if data dictionary coverage is expected for platform
  operational entities.
- Feature manifests:
  update `jobProcessing`; update first consumers only when a schedule
  dependency is actually declared by that feature slice.
- Dependency graph artifacts:
  regenerate after manifest changes.
- Architecture map:
  review platform-layer status because scheduler posture moves from deferred
  to implemented.
- Standards platform-status snapshots:
  review job-processing, async, runtime, and production-readiness status files
  if present.
- Reconstruction questionnaire:
  update if normal local rebuild now expects a scheduler process.
- Bootstrap and helper docs:
  update local helper inventory and staging/deployment runbooks with
  `scheduler:jobs`.
- Maintained-artifacts sweep:
  refresh ADR-0046 status or supersession, AWS staging/deployment notes if
  they describe background processes, and job-processing README/blueprint.
  Organization export docs/runbook and public logo runbook remain follow-on
  consumer work unless their current wording falsely claims scheduler cadence.
- Runbook:
  add scheduler operation checks: process down, stuck lease, missed run,
  duplicate prevention, enqueue failure.
- Privacy note:
  not separate unless scheduler run records begin storing sensitive target
  metadata. Keep run records redacted by default.
- Standards review:
  required because this is a shared platform/runtime seam.
- Repo health review:
  recommended after first scheduler adoption because this touches async,
  cleanup, and production-readiness posture.

## Completion Guardrails

- Blocking QA outcomes:
  - scheduler cannot enqueue duplicates under concurrent runs
  - stale leases recover
  - failed enqueue records safe retryable state
  - existing `recurringSchedule` request rejection remains true
  - Organization export cleanup and timeout sweeps are not represented as
    scheduled until the owning feature slice wires them
- Explicitly deferred verification layers and rationale:
  - frontend/browser proof is deferred because no UI exists
  - operator API tests are deferred because no operator API exists
  - CDN/cache provider proof is deferred because scheduler only records or
    enqueues invalidation work; provider integration is separate
- Expected release-gate residual risk statement:
  recurring scheduler implementation provides platform automation machinery
  but does not by itself move any feature cleanup cadence from manual or
  support-driven operation. Each consumer still needs feature-owned lifecycle,
  retry, failure, audit, schedule registration, and runbook proof.
