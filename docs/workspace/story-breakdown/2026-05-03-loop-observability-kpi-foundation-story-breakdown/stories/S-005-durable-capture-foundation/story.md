# Story Breakdown Story: Durable capture foundation

## Story Detail

- Story ID:
  `S-005`
- Title:
  Durable capture foundation
- Context:
  This is its own story because one completed work loop needs a trustworthy record before scorecards or later reviews can mean anything.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As the harness, I need loop runs, tasks, events, metrics, change sets, and changed artifacts persisted through a feature seam.
- Actor / System Perspective:
  harness/system actor
- Outcome:
  One loop can be captured durably from open to closure.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  S-002 through S-004

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because one completed work loop needs a trustworthy record before scorecards or later reviews can mean anything.

**Goal**
Reviewers can understand what should be true afterward: One loop can be captured durably from open to closure.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Durable capture foundation into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | S-005 | Capture foundation persists loop run, task, event, metric snapshot, change set, and changed artifact records with system-managed fields. | persistence-level | persistence integration; validation; lifecycle | data dictionary; migration plan |
| AC-S005-02 | S-005 | Events and metric snapshots are append-only and corrections are represented as new evidence records rather than silent overwrites. | persistence-level | lifecycle; audit; regression | data dictionary; test cases |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-005 | AC-S005-01 | loopObservability.captureLoopEvidence | loopObservability | create-or-refresh-required | Core durable capture capability. |
| S-005 | AC-S005-02 | loopObservability.appendEvidence | loopObservability | create-or-refresh-required | Append-only behavior. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-001 | S-005 AC-S005-01 | loopObservability persistence | persistence-table-or-index | new | migration and data dictionary | persistence integration tests |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | story actor; story states; story object states | loopObservability.captureLoopEvidence | persistence-level | TC obligation: cover persistence integration; validation; lifecycle for Capture foundation persists loop run, task, event, metric snapshot, change set, and changed artifact records with system-managed fields. | yes |
| AC-S005-02 | story actor; story states; story object states | loopObservability.appendEvidence | persistence-level | TC obligation: cover lifecycle; audit; regression for Events and metric snapshots are append-only and corrections are represented as new evidence records rather than silent overwrites. | yes |
