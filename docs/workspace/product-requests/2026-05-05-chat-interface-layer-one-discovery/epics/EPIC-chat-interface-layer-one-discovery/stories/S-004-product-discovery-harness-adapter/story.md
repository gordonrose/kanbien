# Story Breakdown Story: Product Discovery Harness Adapter

## Story Narrative

**Situation**
Build chat should create the same short planning document that the existing
discovery process already produces. Without that connection, the app could
create a lookalike document that sounds familiar but does not follow the
approved planning rules.

**Goal**
The system can turn a Build chat conversation into the approved planning
document format without inventing a second version of the discovery process.

**Decisions Needed**
We need to confirm which approved discovery rules and document fields the chat
must use, and what happens when the system cannot create a valid document.

**Work That Follows**
The work will establish a narrow connection from Build chat to the existing
discovery process and define recoverable failure behavior.

**Evidence Of Success**
A reviewer can confirm the generated planning document follows the approved
format, failure does not create a bad document, and the user can recover from a
failed attempt.

## Status

- Packet status:
  `ready-for-task-breakdown`

## Handoff Validation

- Architecture invention check:
  `consumes-steering-only`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-002 | Layer 1 Product Discovery orchestration seam | platform-seam | harness/Product Discovery adapter consumed by chat domain | approved | DEV:platform-seam |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Product Discovery harness adapter | not-applicable | harness chat backend | build discovery | not-applicable | root-operator | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | feature-local-state-machine | not-applicable | not-governed | none | not-applicable | not-applicable | Adapter has no browser surface; frontend consumes downstream APIs. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | no | Adapter has no direct browser surface. | not-applicable: protected API task owns session proof | no |
| csp-assets | no | Adapter has no served asset surface. | not-applicable: no frontend assets | no |
| csrf-mutation | no | Adapter is called by protected backend route work, not directly by the browser. | not-applicable: S-006 owns CSRF proof | no |
| url-replay-state | no | Adapter must not treat page context or URL state as authority. | API/security tasks must prove context is input only, not authority. | yes |
| sensitive-rendering | no | Adapter produces approved packet data for later rendering. | Evidence tasks must prove mock/live packet shapes match. | yes |
| asset-delivery | no | Adapter does not deliver PDFs directly. | S-003 and S-006 own generated PDF delivery posture. | no |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-004 | Platform harness adapter | yes | Build chat must call the canonical Layer 1 Product Discovery harness seam. | DEV:platform-seam |
| S-004 | Recoverable adapter failure behavior | yes | Failure must leave the conversation recoverable and must not create an invalid packet. | DEV:backend |

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-004 | ready-for-task-breakdown | harness-value | DEV:backend | Product Discovery harness adapter | This is its own story because the chat should create the same discovery packet people already expect, not a lookalike version. | As the Build chat, I need a narrow adapter that produces canonical Product Discovery packet data through the existing Layer 1 process. | harness/system | Chat orchestration can create packet data without inventing a parallel discovery format. | API contract and implementation blueprint exist |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | S-004 | Harness adapter produces canonical Product Discovery packet data and uses the existing Product Discovery taxonomy/template semantics. | contract-level | adapter contract; packet validation | PRD; capability matrix; API contract |
| AC-S004-02 | S-004 | Adapter failure leaves the conversation recoverable and records a non-success state without creating an invalid packet version. | runtime-api | resilience; lifecycle; audit | test cases; API contract |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-004 | AC-S004-01 | chatInterface.generateDiscoveryPacketData | harness adapter | create-or-refresh-required | Exact row to be created in capability matrix. |
| S-004 | AC-S004-02 | chatInterface.recordAdapterFailure | harness adapter | create-or-refresh-required | Exact row to be created in capability matrix. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-004 | S-004 AC-S004-01 | Product Discovery harness adapter | feature-public-seam | new | adapter contract and packet validation | adapter integration tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-004 | harness adapter, chat feature | root/internal system authority | active | conversation in progress, packet-ready, failed | packet data must match Product Discovery template semantics | in-progress to packet-ready or failed | harness unavailable; validation failure | resilience; auditability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | harness adapter; packet-ready | chatInterface.generateDiscoveryPacketData | contract-level | TC obligation: adapter output validates as packet data | yes |
| AC-S004-02 | harness adapter; failed generation | chatInterface.recordAdapterFailure | runtime-api | TC obligation: recoverable adapter failure | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-004 | S-004 | adapter contract and packet validation proof | create-or-refresh | implementation blueprint / Layer 5 delivery | no |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-004 | ready-for-task-breakdown | Implementation blueprint defines the Product Discovery adapter boundary, accepted durable conversation inputs, canonical packet output expectation, adapter failure behavior, and validation posture. |
