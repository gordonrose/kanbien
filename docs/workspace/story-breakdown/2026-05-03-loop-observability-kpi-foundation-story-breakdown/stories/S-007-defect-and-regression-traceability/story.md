# Story Breakdown Story: Defect and regression traceability

## Story Detail

- Story ID:
  `S-007`
- Title:
  Defect and regression traceability
- Context:
  This is its own story because later problems should be connectable to the work that may have caused or prevented them.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As a root/internal operator, I need later defects linked to suspected and confirmed causing loop evidence.
- Actor / System Perspective:
  root/internal operator
- Outcome:
  Issue investigation can trace loop, task, change set, and artifact.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  S-005 and S-006

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because later problems should be connectable to the work that may have caused or prevented them.

**Goal**
Reviewers can understand what should be true afterward: Issue investigation can trace loop, task, change set, and planning record.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Defect and regression traceability into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | S-007 | Defect records classify layer, severity, status, and detected time. | persistence-level | persistence; validation | data dictionary; test cases |
| AC-S007-02 | S-007 | Regression traces keep suspected and confirmed causing loop, task, change set, and artifact links separate. | persistence-level | lifecycle; regression | data dictionary; test cases |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-007 | AC-S007-01 | loopObservability.recordDefect | loopObservability | create-or-refresh-required | Defect capture. |
| S-007 | AC-S007-02 | loopObservability.linkRegressionTrace | loopObservability | create-or-refresh-required | Regression trace. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-003 | S-007 AC-S007-02 | loopObservability regression trace seam | feature-public-seam | new | lifecycle and link contract | persistence integration tests |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | story actor; story states; story object states | loopObservability.recordDefect | persistence-level | TC obligation: cover persistence; validation for Defect records classify layer, severity, status, and detected time. | yes |
| AC-S007-02 | story actor; story states; story object states | loopObservability.linkRegressionTrace | persistence-level | TC obligation: cover lifecycle; regression for Regression traces keep suspected and confirmed causing loop, task, change set, and artifact links separate. | yes |
