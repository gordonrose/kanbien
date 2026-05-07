# Story Breakdown Story: ADR and PRD reconciliation

## Story Detail

- Story ID:
  `S-001`
- Title:
  ADR and PRD reconciliation
- Context:
  This is needed to make sure the long-term decision and the product plan describe the same version of loop evidence.
- Value Type:
  `system-value`
- Delivery Shape:
  `DECISION:architecture-foundation`
- Job To Be Done:
  As architecture governance, I need the enduring loop evidence decision and PRD proposal aligned so downstream planning starts from one source of truth.
- Actor / System Perspective:
  architecture governance
- Outcome:
  ADR exists and PRD reflects Technical Steering decisions.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  S-000

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is needed to make sure the long-term decision and the product plan describe the same version of loop evidence.

**Goal**
Reviewers can understand what should be true afterward: ADR exists and PRD reflects Technical Steering decisions.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry ADR and PRD reconciliation into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | S-001 | ADR states that loopObservability owns durable loop evidence while platform helpers consume its public seam. | source-level | architecture review | ADR |
| AC-S001-02 | S-001 | PRD proposal records Technical Steering decisions, v0 scope, deferred UI and OLAP posture, and required artifact chain. | source-level | docs alignment review | PRD proposal |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-001 | AC-S001-01 | Loop observability architecture foundation | architecture | not-capability-backed | ADR governance criterion. |
| S-001 | AC-S001-02 | PRD reconciliation | planning | not-capability-backed | Docs alignment criterion. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-000A | S-001 AC-S001-01 | Product Discovery, Technical Steering, and PRD proposal | pre-existing-capability | existing | source artifact references | not-applicable: docs-only architecture task |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | architecture maintainer | repo planning authority | active | PRD/ADR absent or stale | not-applicable: docs governance | draft to accepted ADR; PRD stale to reconciled | missing source file; contradictory steering | auditability; compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | architecture maintainer; active; PRD/ADR absent or stale | Loop observability architecture foundation | source-level | TC obligation: cover architecture review for ADR states that loopObservability owns durable loop evidence while platform helpers consume its public seam. | yes |
| AC-S001-02 | architecture maintainer; active; PRD/ADR absent or stale | PRD reconciliation | source-level | TC obligation: cover docs alignment review for PRD proposal records Technical Steering decisions, v0 scope, deferred UI and OLAP posture, and required artifact chain. | yes |
