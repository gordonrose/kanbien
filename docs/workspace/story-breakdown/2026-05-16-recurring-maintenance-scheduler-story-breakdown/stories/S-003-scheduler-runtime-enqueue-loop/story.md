# S-003: Scheduler Runtime Enqueue Loop

## Story Detail

- Story ID:
  S-003
- Title:
  Scheduler runtime enqueue loop
- Context:
  A recurring scheduler is only real when a runtime can find due schedules,
  acquire a lease, and enqueue one job for each due slot without duplicates.
- Value Type:
  system-value
- Delivery Shape:
  DEV:backend
- Job To Be Done:
  As the system, I need a scheduler runtime so recurring maintenance work
  happens without manual enqueue.
- Actor / System Perspective:
  system
- Outcome:
  A runtime entrypoint polls due schedules, leases work, enqueues through
  jobProcessing, records outcomes, and recovers from failures.
- Non-goals:
  No worker implementation rewrite, route contract, operator API, or UI.

## Story Narrative

**Situation**
The platform has job workers and enqueue seams, but it still needs a process
that wakes up recurring maintenance work.

**Goal**
The scheduler runtime can safely turn a due schedule into one job request,
even if the process restarts or another scheduler process is running.

**Decisions Needed**
Task work must set operational defaults such as batch size, tick interval, and
lease duration within the steering-approved model.

**Work That Follows**
Feature-owned schedules can use the runtime later; Organization export
schedule adoption is deferred to the follow-on Organization export slice.

**Evidence Of Success**
Runtime and persistence tests prove due schedules enqueue once, duplicate
processes do not create duplicate jobs, and failed enqueue attempts are safely
recorded for retry.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Steering packet | actual | docs/workspace/technical-steering/2026-05-16-recurring-maintenance-scheduler-steering.md | Approves runtime process. |
| Job foundation blueprint | actual | docs/workspace/implementation-blueprints/2026-04-25-job-processing-foundation.md | Existing worker/dispatcher runtime posture. |
| Runtime entrypoint | actual | src/jobScheduler.ts | Scheduler process. |
| Runtime tests | actual | tests/unit/jobProcessing/recurringScheduler.test.ts | Runtime proof. |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S003-001 | S-003 | Scheduler runtime finds due enabled schedules using bounded batch polling and indexed fields. | persistence-level | persistence-backed, performance | source/tests |
| AC-S003-002 | S-003 | Runtime acquires a lease before enqueue and prevents two scheduler processes from enqueueing the same due slot. | persistence-level | concurrency, resilience | source/tests |
| AC-S003-003 | S-003 | Runtime enqueues through the jobProcessing public seam with deterministic idempotency keys. | mixed | integration, compatibility | source/tests |
| AC-S003-004 | S-003 | Runtime records enqueued, skipped-overlap, retryable failure, and terminal failure outcomes with safe error summaries. | persistence-level | resilience, audit | source/tests |
| AC-S003-005 | S-003 | Package/runtime documentation provides a scheduler process command without changing the HTTP server into a worker. | deployment-runtime-process | operational | package/runbook docs |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-003 | AC-S003-001 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | Capability rows created by S-000. |
| S-003 | AC-S003-002 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | Capability rows created by S-000. |
| S-003 | AC-S003-003 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | Capability rows created by S-000. |
| S-003 | AC-S003-004 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | Capability rows created by S-000. |
| S-003 | AC-S003-005 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | Capability rows created by S-000. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-S003-000 | S-003 | jobProcessing | owning feature | existing | story owns scheduler runtime | yes |
| DEP-S003-001 | all | scheduler persistence | platform persistence | new | lease and run state repository methods | yes |
| DEP-S003-002 | AC-S003-003 | jobProcessing enqueue seam | platform seam | existing | enqueue remains provider-neutral | yes |
| DEP-S003-003 | AC-S003-005 | package runtime scripts | platform runtime | changed | command starts scheduler process | yes |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| scheduler runtime | recurring maintenance jobs | due schedules enqueue once and record outcomes | feature-local cron or direct persistence imports | runtime/integration tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-003 | scheduler process | platform-internal | single process, duplicate process, restarted | due, leased, stale lease, disabled | batch size, lease duration, tick interval | due to leased to enqueued/failed | enqueue failure, DB conflict, crash after lease | resilience, performance, operability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S003-001 | scheduler / due enabled schedules | S-000 behavior map | persistence-level | TC obligation: due polling | yes |
| AC-S003-002 | scheduler / duplicate processes | S-000 behavior map | persistence-level | TC obligation: overlap prevention | yes |
| AC-S003-003 | scheduler / enqueue | S-000 behavior map | mixed | TC obligation: provider-neutral enqueue with idempotency | yes |
| AC-S003-004 | scheduler / failures | S-000 behavior map | persistence-level | TC obligation: safe failure recording | yes |
| AC-S003-005 | operator / runtime process | S-000 behavior map | deployment-runtime-process | TC obligation: process command evidence | yes |
