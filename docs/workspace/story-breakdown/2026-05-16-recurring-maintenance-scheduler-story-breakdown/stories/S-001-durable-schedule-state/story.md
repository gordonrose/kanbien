# S-001: Durable Schedule State

## Story Detail

- Story ID:
  S-001
- Title:
  Durable schedule state
- Context:
  Recurring work needs stored evidence of what was due, leased, enqueued,
  skipped, or failed so the system can recover after restarts and avoid
  duplicate maintenance work.
- Value Type:
  system-value
- Delivery Shape:
  DEV:backend
- Job To Be Done:
  As the system, I need durable schedule and run records so recurring
  maintenance can recover safely.
- Actor / System Perspective:
  system
- Outcome:
  Schedule definitions, run records, and leases are persisted with indexes and
  safe failure evidence.
- Non-goals:
  No scheduler UI, API, dynamic schedule editing, or feature-owned cleanup
  semantics.

## Story Narrative

**Situation**
Today the platform can enqueue jobs, but it has no durable recurring schedule
state. If a scheduler process crashes or two processes run at once, the system
needs stored facts to decide what happened.

**Goal**
The system can tell which schedule was due, who leased it, whether a job was
enqueued, and whether a failed or stale lease can be retried.

**Decisions Needed**
Task work must finalize the exact stored field names while preserving the approved state model.

**Work That Follows**
The registry and runtime stories use these records for due calculation,
leasing, idempotency, and run history.

**Evidence Of Success**
Stored-record tests prove schedule rows, run rows, uniqueness, indexes, and stale lease recovery behavior.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Steering packet | actual | docs/workspace/technical-steering/2026-05-16-recurring-maintenance-scheduler-steering.md | Requires durable schedule/run state. |
| Blueprint | actual | docs/workspace/implementation-blueprints/2026-05-16-recurring-maintenance-scheduler-foundation.md | Suggests storage model. |
| Migration | actual | src/features/jobProcessing/persistence/migrations/0041_create_recurring_scheduler.sql | Scheduler persistence change. |
| Persistence tests | actual | tests/integration/jobProcessing/persistence.test.ts | Persistence-backed scheduler proof. |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S001-001 | S-001 | Scheduler persistence stores code-declared schedule state with schedule key, job type, cadence, enablement, next run, lease, failure, and timestamp fields. | persistence-level | persistence-backed | migration, persistence docs |
| AC-S001-002 | S-001 | Scheduler run history records scheduled slot status, linked job id when enqueued, attempts, safe error category/summary, and timestamps. | persistence-level | persistence-backed, audit | migration, persistence docs |
| AC-S001-003 | S-001 | Persistence enforces uniqueness for schedule keys and due slots and provides indexed due-schedule polling. | persistence-level | persistence-backed, performance | migration |
| AC-S001-004 | S-001 | Stale leases can expire and become eligible for retry without deleting run history. | persistence-level | concurrency, resilience | persistence tests |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-001 | AC-S001-001 | scheduler behavior map S-000 | jobProcessing persistence | new-platform-capability | Capability rows created by S-000. |
| S-001 | AC-S001-002 | scheduler behavior map S-000 | jobProcessing persistence | new-platform-capability | Capability rows created by S-000. |
| S-001 | AC-S001-003 | scheduler behavior map S-000 | jobProcessing persistence | new-platform-capability | Capability rows created by S-000. |
| S-001 | AC-S001-004 | scheduler behavior map S-000 | jobProcessing persistence | new-platform-capability | Capability rows created by S-000. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-S001-000 | S-001 | jobProcessing | owning feature | existing | story owns scheduler records | yes |
| DEP-S001-001 | all | jobProcessing repository | persistence seam | changed | repository methods hide SQL shape | yes |
| DEP-S001-002 | AC-S001-003 | Postgres migration runner | migration seam | existing | migration applies cleanly | yes |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| recurring scheduler persistence | scheduler runtime | durable schedule/run state is queryable through repository seam | direct SQL imports from consumers | persistence-backed tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | system | platform-internal | scheduler active/restarted | due, leased, enqueued, failed, stale lease | schedule key unique; due slot unique; safe summaries | due to leased to enqueued; stale lease to retryable | DB conflict, stale lease | resilience, audit, performance |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S001-001 | system / schedule persisted | S-000 behavior map | persistence-level | TC obligation: schedule state persisted and read | yes |
| AC-S001-002 | system / run history | S-000 behavior map | persistence-level | TC obligation: run history and safe failure evidence | yes |
| AC-S001-003 | system / duplicate due slot | S-000 behavior map | persistence-level | TC obligation: uniqueness and indexed polling | yes |
| AC-S001-004 | system / stale lease | S-000 behavior map | persistence-level | TC obligation: lease expiry and retry eligibility | yes |
