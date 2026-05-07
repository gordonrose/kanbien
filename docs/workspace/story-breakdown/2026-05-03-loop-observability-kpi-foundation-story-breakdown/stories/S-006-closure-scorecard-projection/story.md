# Story Breakdown Story: Closure scorecard projection

## Story Detail

- Story ID:
  `S-006`
- Title:
  Closure scorecard projection
- Context:
  This is its own story because maintainers need a readable summary of completion confidence before digging into details.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As a maintainer, I need a scorecard that shows measured, assessed, improvement, standards, and deferral evidence.
- Actor / System Perspective:
  maintainer
- Outcome:
  Closure confidence is derived from persisted records.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  S-005

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because maintainers need a readable summary of completion confidence before digging into details.

**Goal**
Reviewers can understand what should be true afterward: Closure confidence is derived from persisted records.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Closure scorecard projection into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S006-01 | S-006 | Scorecard read model distinguishes measured, assessed, and improvement KPIs and includes standards maintenance plus explicit deferrals. | contract-level | projection; rubric; contract | PRD; capability matrix; API contract |
| AC-S006-02 | S-006 | Scorecard behavior covers complete, blocked, reopened, and partially verified loop states. | persistence-level | state matrix; projection; regression | test cases |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-006 | AC-S006-01 | loopObservability.readScorecard | loopObservability | create-or-refresh-required | Scorecard projection. |
| S-006 | AC-S006-02 | loopObservability.readScorecard | loopObservability | create-or-refresh-required | State coverage. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-002 | S-006 AC-S006-01 | loopObservability scorecard seam | feature-public-seam | new | API/read model contract | projection integration tests |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S006-01 | story actor; story states; story object states | loopObservability.readScorecard | contract-level | TC obligation: cover projection; rubric; contract for Scorecard read model distinguishes measured, assessed, and improvement KPIs and includes standards maintenance plus explicit deferrals. | yes |
| AC-S006-02 | story actor; story states; story object states | loopObservability.readScorecard | persistence-level | TC obligation: cover state matrix; projection; regression for Scorecard behavior covers complete, blocked, reopened, and partially verified loop states. | yes |
