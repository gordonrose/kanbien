# Story Breakdown Story: Capability matrix normalization

## Story Detail

- Story ID:
  `S-000`
- Title:
  Capability matrix normalization
- Context:
  This is needed to break down what the admin owner role needs to be able to do into individual capabilities, so we can plan the implementation more accurately.
- Value Type:
  `harness-value`
- Delivery Shape:
  `DOC:docs-artifact`
- Job To Be Done:
  As the delivery harness, I need v1 `adminOwner` stories translated into explicit capability rows so delivery cannot proceed from vague authorization scope.
- Actor / System Perspective:
  harness
- Outcome:
  Capability rows cover every story acceptance criterion or record non-capability rationale.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Blocks S-003 through S-009

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is needed to break down what the admin owner role needs to be able to do into individual capabilities, so we can plan the implementation more accurately.

**Goal**
Reviewers can understand what should be true afterward: Capability rows cover every story acceptance criterion or record non-capability rationale.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry behavior list normalization into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | The capability matrix names every v1 `adminOwner`, root-owned, support/emergency, lifecycle, denial, audit, and blocked/deferred capability family from this packet. | contract-level | traceability review | capability matrix |
| AC-S000-02 | S-000 | Every acceptance criterion in this story packet maps to an approved capability row or records why the criterion is governance-only. | contract-level | traceability review | capability matrix |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | platform-authz.admin-owner-v1.capability-matrix | planning | create-or-refresh-required | Default control story. |
| S-000 | AC-S000-02 | platform-authz.admin-owner-v1.traceability | planning | create-or-refresh-required | Must map every AC. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-010 | S-000 | story breakdown AC and capability mapping sections | new-capability | new | Capability matrix can be generated from stable story, AC, and capability row IDs in this packet. | Traceability review confirms every AC is represented. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | harness reviewer | artifact author | mapping missing; mapping present | ACs unmapped; rows stale | stable story and AC IDs | draft to matrix-covered | missing row; duplicate row | traceability; standards compliance |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
