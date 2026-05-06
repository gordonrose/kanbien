# Story Breakdown Story: Capability matrix normalization

## Story Detail

- Story ID:
  `S-000`
- Title:
  Capability matrix normalization
- Context:
  This is needed to break down what the dashboard needs to be able to do into individual capabilities, so we can plan the implementation more accurately.
- Value Type:
  `harness-value`
- Delivery Shape:
  `DOC:docs-artifact`
- Job To Be Done:
  As the delivery harness, I need reporting dashboard template stories translated into capability rows so design-system delivery starts from explicit obligations.
- Actor / System Perspective:
  harness
- Outcome:
  Capability rows cover every story acceptance criterion or record non-capability rationale.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Blocks all delivery stories

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | The capability matrix names the template scope, composition behavior, required widgets, detail behavior, filter intent, context controls, canonical states, and adoption guardrail rows. | contract-level | capability-matrix coverage; traceability review | capability matrix |
| AC-S000-02 | S-000 | Every acceptance criterion in this packet maps to an approved capability row or records why the criterion is governance-only. | contract-level | traceability review | capability matrix |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | Reporting dashboard template capability matrix control rows | planning | create-or-refresh-required | Default control story because no approved matrix exists. |
| S-000 | AC-S000-02 | Reporting dashboard template traceability rows | planning | create-or-refresh-required | Must cover AC-to-row mapping. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | harness reviewer | repo artifact author | matrix absent; packet drafted | ACs unmapped; capability rows missing | stable story and AC IDs | draft queue to matrix-covered queue | missing matrix row; stale traceability | traceability; standards compliance |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | harness reviewer; matrix absent | reporting dashboard control rows | contract-level | TC obligation: matrix coverage review | no |
| AC-S000-02 | harness reviewer; unmapped ACs | reporting dashboard traceability rows | contract-level | TC obligation: AC-to-row review | no |
