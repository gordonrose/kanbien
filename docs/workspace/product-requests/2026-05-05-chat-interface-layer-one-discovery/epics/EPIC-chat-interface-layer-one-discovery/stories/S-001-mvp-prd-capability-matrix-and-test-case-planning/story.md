# Story Breakdown Story: Mvp Prd Capability Matrix And Test Case Planning

## Story Narrative

**Situation**
The system needs a clear first version of Build chat before work starts. Today,
the idea is understood, but the approved scope, proof expectations, and open
questions are spread across planning notes.

**Goal**
Reviewers can see exactly what the first Build chat version includes, what it
does not include, and what must be proven before the work is considered safe to
start.

**Decisions Needed**
We need to confirm the first version is root-admin only, Build is the only
active action, Reporting and Support stay inactive, and future tenant-builder
work remains separate.

**Work That Follows**
The work will establish the approved product plan, the explicit behavior list,
and the proof expectations for the first version.

**Evidence Of Success**
A reviewer can trace every first-version promise to a clear expected behavior,
see that out-of-scope work is named, and confirm the proof expectations are not
left as broad prose.

## Status

- Packet status:
  `ready-for-task-breakdown`

## Handoff Validation

- Architecture invention check:
  `consumes-steering-only`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-012 | Maintained docs and artifact alignment | feature-local | planning and source-independent artifact sweep | approved | DOC:docs-artifact |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MVP planning artifacts | not-applicable | not-applicable: planning artifact | not-applicable: planning artifact | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | S-001 produces planning artifacts only. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| not-applicable | no | S-001 creates planning artifacts only and has no browser runtime surface. | not-applicable: no DEV:frontend task | no |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-001 | PRD scope artifact | yes | The first chat version needs a PRD that records root-admin MVP scope, active Build behavior, inactive Reporting and Support, history, retention, PDF output, and non-goals. | DOC:docs-artifact |
| S-001 | capability planning artifact | yes | The first chat version needs capability rows or explicit non-capability rationale before implementation tasks can be planned safely. | DOC:docs-artifact |
| S-001 | PRD-derived test planning artifact | yes | The first chat version needs test-case obligations for permissions, tenant-scope deny, lifecycle, generated PDF, browser states, and mock honesty. | DOC:docs-artifact |

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | MVP PRD, capability matrix, and test-case planning | This is needed to break down the first chat version into individual capabilities and proof expectations, so we can plan the implementation more accurately. | As the delivery harness, I need the root-admin MVP captured in PRD, capability rows, and test-case obligations before implementation tasks are cut. | harness/planning | PRD, capability matrix, and PRD-derived test cases exist for every MVP capability and acceptance criterion. | none |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | S-001 | PRD records root-admin-only MVP scope, Build as the only active action, coming-soon Reporting and Support, history visibility, retention, PDF output, and explicit non-goals. | source-level | docs alignment review | PRD |
| AC-S001-02 | S-001 | Capability matrix maps every MVP behavior to explicit capability rows or a non-capability governance rationale. | contract-level | capability traceability review | capability matrix |
| AC-S001-03 | S-001 | PRD-derived test cases cover permissions, tenant-scope deny, lifecycle, generated PDF, browser states, and mock-honesty obligations. | contract-level | TC planning review | PRD-derived test cases |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-001 | AC-S001-01 | chatInterface.mvpPlanning | planning | create-or-refresh-required | PRD must preserve approved root-admin MVP scope and non-goals. |
| S-001 | AC-S001-02 | chatInterface.capabilityTrace | planning | create-or-refresh-required | Capability matrix must map every MVP behavior or name a non-capability rationale. |
| S-001 | AC-S001-03 | chatInterface.testPlanning | planning | prove-current | PRD-derived test cases exist and must stay aligned to the PRD and capability matrix. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-001 | S-001 AC-S001-01 through AC-S001-03 | Product Discovery and Technical Steering packets | pre-existing-capability | existing | validated source artifact references | not-applicable: planning artifact source |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | requester, planning maintainer, QA planner | repo planning authority | active | PRD, matrix, and test cases present or absent | source references must be exact | absent to drafted artifacts | missing source packet; contradictory steering | traceability; auditability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | planning maintainer; PRD absent | chatInterface.mvpPlanning | source-level | TC obligation: PRD scope alignment | no |
| AC-S001-02 | planning maintainer; matrix absent | chatInterface.capabilityTrace | contract-level | TC obligation: capability traceability | no |
| AC-S001-03 | QA planner; TC packet absent | chatInterface.testPlanning | contract-level | TC obligation: PRD-derived TC coverage | no |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-001 | S-001 | PRD | prove-current | PRD maintainer workflow | no |
| ART-CHAT-002 | S-001 | capability matrix | prove-current | capability-matrix maintainer workflow | no |
| ART-CHAT-003 | S-001 | PRD-derived test cases | prove-current | prd-test-case-planner | no |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-001 | ready-for-task-breakdown | PRD, capability matrix, and PRD-derived test cases exist; downstream implementation remains blocked by later stories and artifact decisions. |
