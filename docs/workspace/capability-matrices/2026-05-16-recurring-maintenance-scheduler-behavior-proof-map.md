# Recurring Maintenance Scheduler Behavior Proof Map

## Status

| Field | Value |
| --- | --- |
| Status | implemented-backend-foundation |
| Date | 2026-05-16 |
| Source story breakdown | `docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown` |
| Source task breakdown | `docs/workspace/task-breakdown/2026-05-16-recurring-maintenance-scheduler-task-breakdown.md` |
| Owning feature | `jobProcessing` |
| First consuming feature | deferred to Organization export slice |

## Active V1 Behaviors

| Behavior ID | Behavior | Owner | Proof Layer | Evidence |
| --- | --- | --- | --- | --- |
| SCHED-BEH-001 | Code-declared recurring schedule definitions use stable schedule keys, job type, payload version, cadence, enablement, and payload factory. | `jobProcessing` | source/unit | `src/features/jobProcessing/domain/recurringScheduleRegistry.ts`; `tests/unit/jobProcessing/recurringScheduler.test.ts` |
| SCHED-BEH-002 | Public enqueue requests continue to reject client-supplied `recurringSchedule`. | `jobProcessing` | contract/unit | `src/features/jobProcessing/domain/enqueueTransactionalJobRequest.ts`; `tests/unit/jobProcessing/foundation.test.ts` |
| SCHED-BEH-003 | Durable scheduler state stores schedule definitions, next run, lease, failure, timestamp, and run-history fields. | `jobProcessing` | persistence | `src/features/jobProcessing/persistence/migrations/0041_create_recurring_scheduler.sql`; `tests/integration/jobProcessing/persistence.test.ts` |
| SCHED-BEH-004 | Scheduler runtime claims due schedules with a lease before enqueueing. | `jobProcessing` | source/persistence | `src/features/jobProcessing/domain/runRecurringScheduler.ts`; `tests/unit/jobProcessing/recurringScheduler.test.ts`; `tests/integration/jobProcessing/persistence.test.ts` |
| SCHED-BEH-005 | Due-slot idempotency prevents duplicate job creation for repeated scheduler attempts. | `jobProcessing` | unit/persistence | `tests/unit/jobProcessing/recurringScheduler.test.ts`; `tests/integration/jobProcessing/persistence.test.ts` |
| SCHED-BEH-006 | Scheduler run outcomes record enqueued, skipped-overlap, retryable failure, and terminal failure categories with safe summaries. | `jobProcessing` | source/unit | `src/features/jobProcessing/domain/runRecurringScheduler.ts`; `tests/unit/jobProcessing/recurringScheduler.test.ts` |
| SCHED-BEH-007 | Scheduler process runs separately from HTTP server and worker execution. | `jobProcessing` | operational | `src/jobScheduler.ts`; `package.json`; `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md` |
| SCHED-BEH-008 | Code-declared schedule definitions can be validated against the job registry without importing a feature consumer. | `jobProcessing` | source/unit | `src/features/jobProcessing/domain/recurringScheduleRegistry.ts`; `tests/unit/jobProcessing/recurringScheduler.test.ts` |

## Deferred Behaviors

| Behavior ID | Deferred Behavior | Reason | Revisit Trigger | Owner |
| --- | --- | --- | --- | --- |
| SCHED-DEF-001 | User-created or dynamically edited schedules. | V1 uses code-declared platform schedules only. | Operator scheduling product request. | future platform owner |
| SCHED-DEF-002 | Root-admin/operator scheduler API or UI. | No governed UX/API scope in this slice. | Product Discovery and design-system governance. | future product/platform owner |
| SCHED-DEF-003 | Business workflow scheduling. | Current scheduler is maintenance-only. | Workflow scheduling request. | future product owner |
| SCHED-DEF-004 | Per-tenant custom cadence. | First slice has system-owned cadence only. | Business policy request for tenant-specific cadence. | future product/platform owner |
| SCHED-DEF-005 | Public logo cleanup/cache scheduler adoption. | Concrete logo cleanup/cache job seams are not part of this slice. | Logo/cache job seams exist and are approved. | organization branding/assets owner |
| SCHED-DEF-006 | Public API support for `recurringSchedule`. | Client-supplied schedules remain explicitly rejected. | Explicit API contract and authz design. | future platform owner |
| SCHED-DEF-007 | Organization export cleanup and timeout-sweep schedules as the first feature-owned recurring consumer. | This isolated slice promotes the scheduler platform foundation only, so it must not import `organizationExports`. | Organization export slice starts and can wire the already-planned export jobs against the scheduler seam. | organizationExports owner |
