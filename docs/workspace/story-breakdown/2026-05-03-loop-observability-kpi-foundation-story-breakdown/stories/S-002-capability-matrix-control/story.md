# Story Breakdown Story: Capability matrix control

## Story Detail

- Story ID:
  `S-002`
- Title:
  Capability matrix control
- Context:
  This is needed to break down what loop evidence needs to capture into individual capabilities, so we can plan the implementation more accurately.
- Value Type:
  `harness-value`
- Delivery Shape:
  `DOC:docs-artifact`
- Job To Be Done:
  As the delivery harness, I need approved capability rows for every loop observability behavior before implementation tasks are cut.
- Actor / System Perspective:
  harness
- Outcome:
  Capability matrix covers capture, scorecard, traceability, helper, API, and governance criteria.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  S-000 and S-001

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is needed to break down what loop evidence needs to capture into individual capabilities, so we can plan the implementation more accurately.

**Goal**
Reviewers can understand what should be true afterward: behavior list covers capture, scorecard, traceability, helper, service answer, and governance criteria.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry behavior list control into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S002-01 | S-002 | Capability matrix covers loop run, task, event, metric, change set, changed artifact, scorecard, defect, regression, improvement, helper, and API capabilities. | contract-level | capability traceability review | capability matrix |
| AC-S002-02 | S-002 | Every story acceptance criterion maps to a capability row or a non-capability governance rationale. | contract-level | capability traceability review | capability matrix |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-002 | AC-S002-01 | Capability matrix control rows | planning | create-or-refresh-required | Matrix does not exist yet. |
| S-002 | AC-S002-02 | Capability matrix traceability rows | planning | create-or-refresh-required | Matrix does not exist yet. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-000B | S-002 AC-S002-01 | Product Discovery, Technical Steering, and PRD proposal | pre-existing-capability | existing | source artifact references | not-applicable: docs-only capability planning task |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-002 | planning maintainer | repo planning authority | active | matrix absent | capability rows, non-capability rationale | absent to drafted matrix | missing AC mapping | traceability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S002-01 | planning maintainer; active; matrix absent | Capability matrix control rows | contract-level | TC obligation: cover capability traceability review for Capability matrix covers loop run, task, event, metric, change set, changed artifact, scorecard, defect, regression, improvement, helper, and API capabilities. | yes |
| AC-S002-02 | planning maintainer; active; matrix absent | Capability matrix traceability rows | contract-level | TC obligation: cover capability traceability review for Every story acceptance criterion maps to a capability row or a non-capability governance rationale. | yes |
