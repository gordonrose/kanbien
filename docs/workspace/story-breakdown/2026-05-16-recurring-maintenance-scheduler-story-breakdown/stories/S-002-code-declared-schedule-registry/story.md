# S-002: Code-Declared Schedule Registry

## Story Detail

- Story ID:
  S-002
- Title:
  Code-declared schedule registry
- Context:
  The first scheduler should run known maintenance work declared in code, not
  user-created schedules or hidden feature-local timers.
- Value Type:
  system-value
- Delivery Shape:
  DEV:backend
- Job To Be Done:
  As the system, I need validated schedule definitions so due recurring work is
  deterministic and safe to enqueue.
- Actor / System Perspective:
  system
- Outcome:
  Schedule definitions are registered, validated, bounded, and tied to known
  job types and safe payload factories.
- Non-goals:
  No user-edited schedules, cron expression API, operator UI, or per-tenant
  custom cadence.

## Story Narrative

**Situation**
Maintenance jobs should become recurring, but letting arbitrary schedules into
the system would create a much bigger product and security surface.

**Goal**
The scheduler runs only approved, code-declared maintenance schedules with
known job types, known payload versions, and safe payloads.

**Decisions Needed**
Task work must choose the exact registry module shape, but it must preserve
the steering decision that schedules are code-declared in v1.

**Work That Follows**
The runtime uses the registry to decide which schedules are due and which job
request should be enqueued.

**Evidence Of Success**
Tests prove valid schedules register, invalid schedules fail, and normal
client-supplied recurringSchedule requests remain rejected.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Steering packet | actual | docs/workspace/technical-steering/2026-05-16-recurring-maintenance-scheduler-steering.md | Approves code-declared schedules only. |
| Existing rejection | actual | src/features/jobProcessing/domain/enqueueTransactionalJobRequest.ts | Current normal enqueue rejects recurringSchedule. |
| Registry source | actual | src/features/jobProcessing/domain/recurringScheduleRegistry.ts | Implementation seam. |
| Unit tests | actual | tests/unit/jobProcessing/recurringScheduler.test.ts | Registry and scheduler proof. |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S002-001 | S-002 | A code-declared registry accepts schedule definitions with stable key, job type, payload version, cadence, enablement, and payload factory. | source-level | unit | source |
| AC-S002-002 | S-002 | Registry validation rejects duplicate keys, invalid cadence, unknown job type, unsupported payload version, unsafe payloads, and forbidden secrets/session material. | source-level | unit, security | source/tests |
| AC-S002-003 | S-002 | Registry definitions can compute a due slot and deterministic idempotency key for enqueue. | source-level | unit | source/tests |
| AC-S002-004 | S-002 | Normal enqueue requests still reject recurringSchedule as deferred. | contract-level | compatibility, security | tests |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-002 | AC-S002-001 | scheduler behavior map S-000 | jobProcessing domain | new-platform-capability | Capability rows created by S-000. |
| S-002 | AC-S002-002 | scheduler behavior map S-000 | jobProcessing domain | new-platform-capability | Capability rows created by S-000. |
| S-002 | AC-S002-003 | scheduler behavior map S-000 | jobProcessing domain | new-platform-capability | Capability rows created by S-000. |
| S-002 | AC-S002-004 | scheduler behavior map S-000 | jobProcessing domain | new-platform-capability | Capability rows created by S-000. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-S002-000 | S-002 | jobProcessing | owning feature | existing | story owns schedule registry | yes |
| DEP-S002-001 | AC-S002-001 | jobProcessing job registry | platform seam | existing | registered job type lookup | yes |
| DEP-S002-002 | AC-S002-002 | payload safety checker | platform seam | existing | unsafe payload rejection | no |
| DEP-S002-003 | AC-S002-004 | enqueue request validator | platform seam | existing | recurringSchedule remains rejected | yes |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| recurring schedule registry | scheduler runtime | only approved code-declared schedules are eligible | user-supplied schedule authority | registry and enqueue tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-002 | system, caller | platform-internal / none | scheduler starting; caller enqueueing | valid, duplicate, invalid, disabled | cadence bounds, payload safety, job type known | registered to due; invalid to rejected | unknown job type, unsafe payload | security, compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S002-001 | system / valid definition | S-000 behavior map | source-level | TC obligation: valid schedule registry | no |
| AC-S002-002 | system / invalid definition | S-000 behavior map | source-level | TC obligation: invalid schedule rejection | no |
| AC-S002-003 | system / due slot | S-000 behavior map | source-level | TC obligation: due slot and idempotency key | no |
| AC-S002-004 | caller / forbidden recurring request | S-000 behavior map | contract-level | TC obligation: normal enqueue compatibility denial | yes |
