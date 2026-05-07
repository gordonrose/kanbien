# Story Breakdown Story: Runtime And Mock Honesty Evidence Plan

## Story Narrative

**Situation**
A simplified example can make Build chat look correct even when the real
workspace, protected actions, history, and PDF download path behave
differently. The system needs proof based on realistic shapes, not convenient
fixtures.

**Goal**
Reviewers can trust that the Build chat experience works in the real
root-admin workspace, not only in simplified examples.

**Decisions Needed**
We need to agree which live-like states must be covered, including desktop,
mobile, empty history, denied access, failed document creation, failed
download, and degraded service behavior.

**Work That Follows**
The work will establish proof coverage for the saved records, protected
actions, PDF behavior, browser states, and fixture honesty.

**Evidence Of Success**
A reviewer can compare test fixtures with the real shapes the system serves
and confirm the proof covers realistic success, denial, failure, and recovery
states.

## Source Artifact

- Journey inventory and QA evidence plan:
  `docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md`

## Task Breakdown Alignment

Future S-008 tasks should reference the journey IDs in the inventory instead
of restating the evidence plan. The expected task slices are:

| Candidate Task Slice | Task Type | Primary Output |
| --- | --- | --- |
| `QA-CHAT-L1-001` | `TEST:test-suite-alignment` | Convert the inventory into executable test placement and fixture rules. |
| `QA-CHAT-L1-002` | `EVIDENCE:qa-evidence` | Capture API payload, persistence-row, and mock-honesty evidence for conversation and history flows. |
| `QA-CHAT-L1-003` | `EVIDENCE:qa-evidence` | Capture generated PDF success, denial, retry, and failure evidence. |
| `QA-CHAT-L1-004` | `EVIDENCE:qa-evidence` | Capture root-admin browser and design-system adoption evidence after first-consumer parity exists. |
| `QA-CHAT-L1-005` | `DOC:docs-artifact` | Attach final evidence summary to Product Request, Story Breakdown, PRD test cases, and implementation closure artifacts. |

## Status

- Packet status:
  `ready-for-task-breakdown`

## Handoff Validation

- Architecture invention check:
  `consumes-steering-only`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-009 | QA and browser evidence | feature-public-seam | chat feature tests plus root-admin browser scenarios | approved | EVIDENCE:qa-evidence |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Runtime and mock-honesty evidence plan | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build panel state | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | Evidence planning is ready; runtime/browser capture waits for implementation. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root-admin API evidence must prove allowed and denied session states. | Evidence tasks must name unauthenticated and unauthorized proof. | yes |
| csp-assets | yes | Browser evidence must prove served design-system assets when frontend adoption exists. | Browser evidence task must inspect served assets/process. | yes |
| csrf-mutation | yes | Protected mutations must prove CSRF/session posture after backend work. | Evidence tasks must capture denied mutation posture. | yes |
| url-replay-state | yes | Helpful context must never become authority. | Evidence tasks must compare fixtures/contracts against runtime behavior. | yes |
| sensitive-rendering | yes | Transcripts, packet data, and history are sensitive records. | Evidence tasks must include mock-honesty and deny-state proof. | yes |
| asset-delivery | yes | PDF download proof must follow the asset decision. | Evidence tasks must cover success, denial, retry, and failure states. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-008 | Test suite alignment | yes | Journey inventory IDs need executable placement, fixture-source rules, and traceability expectations before evidence capture. | TEST:test-suite-alignment |
| S-008 | Runtime/browser evidence | yes | Visible frontend plus permission-sensitive API and PDF flow require browser/runtime proof. | EVIDENCE:qa-evidence |

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-008 | ready-for-task-breakdown | harness-value | TEST:test-suite-alignment | Runtime and mock-honesty evidence plan | This is needed to decide what evidence will prove the chat works in the real workspace, not only in simplified examples. | As QA governance, I need tests and browser scenarios that prove the live root-admin panel, APIs, permissions, PDF flow, and fixtures match production shapes. | QA governance | Journey inventory and evidence plan cover persistence, API, permission, generated PDF, browser states, and mock honesty. | PRD-derived test cases and QA evidence plan exist |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S008-01 | S-008 | Evidence plan includes persistence-backed tests, API authz tests, generated PDF tests, browser scenarios for desktop/mobile, denied/empty/failed/degraded states, and mock-honesty checks. | source-level | QA planning; fixture review | PRD-derived test cases; QA evidence plan |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-008 | AC-S008-01 | chatInterface.qaEvidencePlan | QA governance | prove-current | Journey inventory and QA evidence plan exist at `docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md`. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-009 | S-008 AC-S008-01 | frontend and persistence test harnesses | pre-existing-capability | existing | test plan references | mock-honesty and runtime evidence checks |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-008 | QA planner | repo QA authority | active | fixtures absent or stale | fixtures must match live API/persistence shape | plan accepted to evidence captured | mock drift; browser evidence unavailable | mock honesty; runtime evidence |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S008-01 | QA planner; fixture and runtime states | chatInterface.qaEvidencePlan | source-level | TC obligation: mock-honesty and runtime evidence plan | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-009 | S-008 | QA evidence and browser scenario plan | prove-current | docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md | no |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-008 | ready-for-task-breakdown | PRD-derived test cases and journey/evidence plan exist; executable runtime/browser proof remains implementation-time evidence. |
