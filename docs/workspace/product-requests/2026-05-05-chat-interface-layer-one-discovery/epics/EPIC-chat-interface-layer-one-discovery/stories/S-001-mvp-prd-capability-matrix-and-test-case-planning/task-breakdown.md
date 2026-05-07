# Task Breakdown Packet: Chat Interface S-001 MVP Planning Artifacts

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-07
- Task Breakdown ID:
  `TBD-CHAT-S001`
- Source Story Breakdown packet:
  docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md
- Selected Story ID(s):
  S-001
- Related Product Discovery packet:
  docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md
- Related Technical Steering packet:
  docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md
- Related PRD:
  docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md
- Related capability matrix:
  docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv
- Validation command:
  npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md
- Validation status:
  `pass`

## Source Story Handoff

- Story packet validation status:
  `pass`
- Selected story handoff status:
  `ready-for-task-breakdown`
- Story scope preserved:
  `yes`
- Acceptance criteria preserved:
  `yes`
- Product intent preserved:
  `yes`
- Technical Steering architecture preserved:
  `yes`
- Architecture invention check:
  `consumes-story-and-steering-only`
- Capability rows complete for implementation tasks:
  `not-applicable`
- Story blockers carried forward:
  none

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-012 | feature-local | DOC:docs-artifact | T-S001-01, T-S001-02, T-S001-03 | covered | S-001 is a planning-artifact story and preserves the source-independent artifact alignment signal. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-001 | DOC:docs-artifact | PRD scope artifact | T-S001-01 | Covered by the PRD scope alignment task. |
| S-001 | DOC:docs-artifact | capability planning artifact | T-S001-02 | Covered by the capability matrix traceability task. |
| S-001 | DOC:docs-artifact | PRD-derived test planning artifact | T-S001-03 | Covered by the PRD-derived test-case alignment task. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | MVP PRD, capability matrix, and test-case planning | This is needed to break down the first chat version into individual capabilities and proof expectations, so we can plan the implementation more accurately. | harness/planning | Split into three artifact tasks so each AC has one clear owner and proof target. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | S-001 | PRD records root-admin-only MVP scope, Build as the only active action, coming-soon Reporting and Support, history visibility, retention, PDF output, and explicit non-goals. | source-level | docs alignment review | PRD |
| AC-S001-02 | S-001 | Capability matrix maps every MVP behavior to explicit capability rows or a non-capability governance rationale. | contract-level | capability traceability review | capability matrix |
| AC-S001-03 | S-001 | PRD-derived test cases cover permissions, tenant-scope deny, lifecycle, generated PDF, browser states, and mock-honesty obligations. | contract-level | TC planning review | PRD-derived test cases |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-001 | AC-S001-01 | chatInterface.mvpPlanning | planning | create-or-refresh-required | PRD |
| S-001 | AC-S001-02 | chatInterface.capabilityTrace | planning | create-or-refresh-required | capability matrix |
| S-001 | AC-S001-03 | chatInterface.testPlanning | planning | prove-current | PRD-derived test cases |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | S-001 | DOC:docs-artifact | Align the chat-interface PRD with approved root-admin MVP scope and non-goals. | docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md | capability matrix rows, executable tests, runtime implementation, design-system artifacts | not-applicable: first task for story | not-applicable: no shared seams | queued-for-delivery |
| T-S001-02 | S-001 | DOC:docs-artifact | Align the capability matrix so every MVP behavior maps to a row or non-capability rationale. | docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv | PRD prose changes, executable tests, runtime implementation, design-system artifacts | T-S001-01 | not-applicable: no shared seams | queued-for-delivery |
| T-S001-03 | S-001 | DOC:docs-artifact | Align PRD-derived test cases to PRD scope, capability rows, and fixture-honesty obligations. | docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | production test implementation, runtime implementation, design-system artifacts | T-S001-01, T-S001-02 | not-applicable: no shared seams | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | single-proof-target | 1 | One acceptance criterion covers PRD scope alignment. | PRD source-truth alignment for the root-admin MVP | PRD artifact | PRD records the approved first-version boundaries. | no | One artifact and one AC. |
| T-S001-02 | single-proof-target | 1 | One acceptance criterion covers capability traceability. | Capability matrix traceability for MVP behavior | capability matrix artifact | Every MVP behavior has a row or explicit non-capability rationale. | no | One artifact and one AC. |
| T-S001-03 | single-proof-target | 1 | One acceptance criterion covers PRD-derived test planning. | Test-case planning alignment for permissions, PDF, browser states, and mock honesty | PRD-derived test cases artifact | Test cases cover the proof obligations required before implementation. | no | One artifact and one AC. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S001-01 | source-truth-mismatch | Stop if Product Discovery, Technical Steering, PRD, or the approved PDF decision disagree on MVP scope. | Return to Product Discovery or Technical Steering owner for resolution. | no | PRD scope must not invent or erase approved product boundaries. |
| T-S001-02 | proof-gap | Stop if a behavior cannot be mapped to a capability row or explicit non-capability rationale. | Route the gap back to capability planning before implementation tasking. | no | Implementation tasks need traceable capability intent. |
| T-S001-03 | proof-gap | Stop if a required permission, lifecycle, PDF, browser, or mock-honesty obligation has no test-case home. | Route the missing proof to PRD test-case planning before implementation tasking. | no | Test obligations must not be rediscovered during delivery. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S001-01 | docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md; docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md; docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md | none: planning artifact only | S-001 story; Product Discovery; Technical Steering; PDF asset decision |
| T-S001-02 | docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md | none: planning artifact only | S-001 story; PRD; Technical Steering |
| T-S001-03 | docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv | none: planning artifact only | S-001 story; PRD; capability matrix |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | MVP planning artifacts | not-applicable | not-applicable: planning artifact | not-applicable: planning artifact | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | S-001 produces planning artifacts only. |
| T-S001-02 | MVP planning artifacts | not-applicable | not-applicable: planning artifact | not-applicable: planning artifact | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | S-001 produces planning artifacts only. |
| T-S001-03 | MVP planning artifacts | not-applicable | not-applicable: planning artifact | not-applicable: planning artifact | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | S-001 produces planning artifacts only. |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S001-01 | not-applicable | not-applicable: DOC:docs-artifact task | not-applicable: no DEV:frontend or GOV:design-system work | not-applicable: planning artifact only |
| T-S001-02 | not-applicable | not-applicable: DOC:docs-artifact task | not-applicable: no DEV:frontend or GOV:design-system work | not-applicable: planning artifact only |
| T-S001-03 | not-applicable | not-applicable: DOC:docs-artifact task | not-applicable: no DEV:frontend or GOV:design-system work | not-applicable: planning artifact only |

## Frontend Performance Posture

| Task ID | Performance Posture | Evidence / Proof Plan | Rationale |
| --- | --- | --- | --- |

## Design-System Seam Contract

| Task ID | Seam Posture | Seam Name / Export / Route | Owned Render Structure | Owned Behavior Controller | Owned Accessibility Semantics | Canonical / Behavior Lock / Evidence | Frontend Consumption Contract |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | not-applicable | not-applicable: planning artifact task has no governed UI seam | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable |
| T-S001-02 | not-applicable | not-applicable: planning artifact task has no governed UI seam | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable |
| T-S001-03 | not-applicable | not-applicable: planning artifact task has no governed UI seam | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable |

## Design-System Seam Class Contract

| Task ID | Design-System Seam Class | Class-Specific Required Proof | Downstream Consumption Boundary | Forbidden App / Evidence / Standards Work |
| --- | --- | --- | --- | --- |

## Frontend Adoption Contract

| Task ID | Consumed DS Render Seam | Consumed DS Behavior / Controller Seam | Consumed DS Accessibility Semantics | Consumed DS Style / CSS Seam | Allowed App-Local Composition / Data Binding | Forbidden Local Reconstruction | Adoption Proof Route / Scenario |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Frontend Security Evidence

| Task ID | Security Area | Source Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Layer 4 Evidence Plan / Blocking Reason |
| --- | --- | --- | --- | --- | --- |

## Frontend Permission Rendering Evidence

| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |
| --- | --- | --- | --- | --- | --- |

## Frontend Runtime Data And Mock Honesty

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |

## Vertical Slice Coupling

| Task ID | Journey Behavior | Backend Seam | Frontend Seam | API / Data Contract | Browser Proof Story | Why Backend And Frontend Proof Are Inseparable | Split Rejection Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Vertical Slice Split Pressure

| Task ID | Concern | Split Decision | Coupling / Not-Applicable Rationale | Owning Task If Split |
| --- | --- | --- | --- | --- |

## Platform Seam Contract

| Task ID | Seam Kind | Compatibility Mode | Approved Authority Source | Seam Owner / Location | Seam Source Inventory | Seam Change Scope | Exact Write Envelope | Why Not Feature-Local | Current / Future / Unsupported Consumers | Compatibility Contract | Representative Consumer Proof | Runtime / Restart Impact | Rollout / Backout Posture | Artifact / Materialization Impact | Generated / Apply / Check Command | Expected Seam Output | Architecture / Standards Boundary | Split / Blocked Follow-Up | Proof Commands | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Platform Seam Class Contract

| Task ID | Platform Seam Class | Class-Specific Required Proof | Required Consumer Coverage | Runtime / Materialization Expectation | Forbidden Contamination / Split Notes |
| --- | --- | --- | --- | --- | --- |

## Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |

## Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S001-01 | exact-files | docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md | not-applicable: exact file only |
| T-S001-02 | exact-files | docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv | not-applicable: exact file only |
| T-S001-03 | exact-files | docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | not-applicable: exact file only |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S001-01 | task-specific | PRD root-admin MVP scope alignment review | not-applicable: one PRD scope proof target |
| T-S001-02 | task-specific | capability matrix MVP behavior traceability review | not-applicable: one capability traceability proof target |
| T-S001-03 | task-specific | PRD-derived test case proof-obligation alignment review | not-applicable: one test planning proof target |

## Refactor-First Contract

| Task ID | Refactor Trigger | Refactor Type | Refactor Target Inventory | Detection Hints | Unchanged Behavior | Affected Consumers | Downstream Task Unblocked | Compatibility Proof | Routing Check | Human Review Boundary | Forbidden Behavior / Authority Change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Foundation Contract

| Task ID | Concern Area | Architecture Trigger | Architecture Question | Decision Analysis Status | Decision Provenance Source | Missing Analysis Fields | Sources To Review | Decision Source Inventory | Decision Analysis Checklist | Decision Owner | Output Artifact Target | Downstream Tasks Blocked | Compatibility Posture | Final Authority Route | Human Review Boundary | Forbidden Implementation / Guess |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Update Contract

| Task ID | Architecture Update Class | Approved Decision Source | Decision Source Path / Reference | Decision Summary | Architecture Artifact Target | Consistency Sweep Targets | Authority / Consistency Inventory | Downstream Impact | Compatibility Posture | Forbidden Implementation / Standards Work | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | ordinary-doc-sync | template-or-example-sync | docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md; docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md; docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md; docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md | root-admin MVP scope, active Build action, inactive Reporting/Support, history visibility, PDF output, and non-goals reviewed | docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md | update-or-confirm-current | PRD checked against Product Discovery, Technical Steering, PDF decision, and S-001 story | Capability matrix and PRD-derived test cases are split to T-S001-02 and T-S001-03; DOC:data-dictionary owns durable data lifecycle truth; DOC:api-contract, DOC:permission-mapping, GOV:design-system, EVIDENCE:qa-evidence, and implementation work remain in later stories. | git diff -- docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md | human review limited to PRD scope wording matching approved source truth | Task Breakdown validation and PRD diff review |
| T-S001-02 | ordinary-doc-sync | workspace-summary-artifact | docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md; docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md | MVP behavior list and non-capability governance rationale reviewed | docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv | update-or-confirm-current | Capability matrix checked against PRD, Technical Steering, and S-001 story | PRD wording is T-S001-01; PRD-derived test cases are T-S001-03; DOC:api-contract, DOC:permission-mapping, DOC:data-dictionary, GOV:design-system, EVIDENCE:qa-evidence, and implementation work remain in later stories. | git diff -- docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md | human review limited to capability traceability sufficiency | Task Breakdown validation and matrix diff review |
| T-S001-03 | ordinary-doc-sync | template-or-example-sync | docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv; docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md | permission, tenant-scope deny, lifecycle, generated PDF, browser state, and fixture-honesty proof obligations reviewed | docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | update-or-confirm-current | Test cases checked against PRD, capability matrix, and S-001 story | PRD wording is T-S001-01; capability matrix is T-S001-02; executable test implementation is split to future TEST:test-only tasks; EVIDENCE:qa-evidence owns live-data evidence capture. | git diff -- docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md | human review limited to planned proof coverage, not executable implementation | Task Breakdown validation and test-case diff review |

## Standards Compliance Contract

| Task ID | Compliance Target Type | Standard / Gate | Source Standard Path / Reference | Scope Under Review | Control / Evidence Inventory | Review Method / Command | Compliance Posture | Evidence Artifact Target | Coverage Summary Command | Findings Summary | Follow-Up Routing | Human Review Boundary | Waiver / Blocker Posture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Standards Update Contract

| Task ID | Standards Update Class | Approved Standards Change Source | Source Path / Reference | Standards Change Summary | Standards Artifact Target | Affected Surfaces / Consistency Sweep | Artifact Invalidation Sweep | Enforcement Posture | Compatibility / Rollout Posture | Debt Route If Not Enforced Now | Forbidden Implementation / Architecture / Compliance Work | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Permission Mapping Contract

| Task ID | Permission Mapping Class | Approved Authz Source | Capability / Route / Surface | Authority World / Actor Boundary | Grant Source Posture | Mapping Row Posture | Tenant / Object Boundary | Allow / Deny Expectations | UI Eligibility | Denial / Audit / Proof Expectation | Evidence Mapping Inventory | Migration Impact | Split / Blocked Follow-Up | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## API Contract

| Task ID | API Contract Class | Route Family | Contract Source / Authority | Methods / Paths | Params / Query / Body | Response / Status / Error Shape | Authn / Authz / Tenant Boundary | Validation / Pagination / Sorting / System Fields | Compatibility Posture | Maintained API Artifacts | Maintained Artifact Inventory | Split / Blocked Follow-Up | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Data Dictionary Contract

| Task ID | Entity / Table / Fact Group | Dictionary Artifact Target | Source Truth Reviewed | Field / Index / Lifecycle Truth | Durable Fact / Retention Truth | Classification / Compliance Posture | Standards / Control Trace | Enforcement Trace | Enforcement Evidence | Test / Evidence Trace | Compatibility Posture | Split / Blocked Follow-Up | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test-Only Coverage Contract

| Task ID | Test Change Class | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test Suite Alignment Contract

| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Escalation Path |
| --- | --- | --- |
| T-S001-01 | Do not activate Reporting, Support, tenant-builder rollout, or implementation behavior through PRD wording. | Stop and route to Product Discovery or Technical Steering before changing scope. |
| T-S001-02 | Do not treat missing capability rows as implementation-ready behavior. | Stop and add explicit capability or non-capability rationale before queueing implementation tasks. |
| T-S001-03 | Do not encode simplified mock behavior that production contracts do not provide. | Stop and route mock-honesty questions to test-case planning or later runtime evidence tasks. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Required Guardrail Reference | Approval Status | Evidence / Rationale |
| --- | --- | --- | --- | --- |
| T-S001-01 | DOC:docs-artifact | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/docs-artifact-task-guardrail.md | approved | Docs artifact guardrail reviewed for PRD source-truth alignment and specialized route-away boundaries. |
| T-S001-02 | DOC:docs-artifact | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/docs-artifact-task-guardrail.md | approved | Docs artifact guardrail reviewed for capability matrix traceability and specialized route-away boundaries. |
| T-S001-03 | DOC:docs-artifact | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/docs-artifact-task-guardrail.md | approved | Docs artifact guardrail reviewed for PRD-derived test-case planning and executable-proof route-away boundaries. |

## Task Guardrail Evidence

| Task ID | Guardrail Check ID | Status | Evidence |
| --- | --- | --- | --- |
| T-S001-01 | docs-source-truth-reviewed | pass | Product Discovery, Technical Steering, PDF decision, and S-001 story are named as source truth. |
| T-S001-01 | docs-artifact-class | pass | Docs artifact class is template-or-example-sync for bounded PRD scope alignment. |
| T-S001-01 | docs-scriptable-source-inventory | pass | Scriptable source inventory names exact source artifacts and PRD target. |
| T-S001-01 | docs-stale-artifact-sweep | pass | Specialized capability matrix and test-case work are split to T-S001-02 and T-S001-03. |
| T-S001-01 | docs-status-posture | pass | Status posture is update-or-confirm-current. |
| T-S001-01 | docs-validation-command | pass | Task Breakdown validation and PRD diff review are required. |
| T-S001-01 | docs-specialized-routing | pass | Runtime, API, permission, data, design-system, and executable proof work are routed to later story/task owners. |
| T-S001-02 | docs-source-truth-reviewed | pass | PRD, Technical Steering, and S-001 story are named as source truth. |
| T-S001-02 | docs-artifact-class | pass | Docs artifact class is workspace-summary-artifact for capability matrix alignment. |
| T-S001-02 | docs-scriptable-source-inventory | pass | Scriptable source inventory names exact source artifacts and matrix target. |
| T-S001-02 | docs-stale-artifact-sweep | pass | PRD and test-case work are split to T-S001-01 and T-S001-03. |
| T-S001-02 | docs-status-posture | pass | Status posture is update-or-confirm-current. |
| T-S001-02 | docs-validation-command | pass | Task Breakdown validation and matrix diff review are required. |
| T-S001-02 | docs-specialized-routing | pass | Runtime, API, permission, data, design-system, and executable proof work are routed to later story/task owners. |
| T-S001-03 | docs-source-truth-reviewed | pass | PRD, capability matrix, and S-001 story are named as source truth. |
| T-S001-03 | docs-artifact-class | pass | Docs artifact class is template-or-example-sync for PRD-derived test-case planning alignment. |
| T-S001-03 | docs-scriptable-source-inventory | pass | Scriptable source inventory names exact source artifacts and test-case target. |
| T-S001-03 | docs-stale-artifact-sweep | pass | Executable proof is routed to future TEST:test-only tasks. |
| T-S001-03 | docs-status-posture | pass | Status posture is update-or-confirm-current. |
| T-S001-03 | docs-validation-command | pass | Task Breakdown validation and test-case diff review are required. |
| T-S001-03 | docs-specialized-routing | pass | Runtime, API, permission, data, design-system, and executable proof work are routed to later story/task owners. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Required Supplemental Guardrail References | Compatibility Proof | Approval Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | feature-local | docs/prd | docs/prd | no | not-applicable: no shared code placement | PRD diff review preserves source truth only. | approved |
| T-S001-02 | feature-local | docs/workspace/capability-matrices | docs/workspace/capability-matrices | no | not-applicable: no shared code placement | Matrix diff review preserves source truth only. | approved |
| T-S001-03 | feature-local | docs/prd/test_cases | docs/prd/test_cases | no | not-applicable: no shared code placement | Test-case diff review preserves source truth only. | approved |

## Allowed Write Set Classification

| Task ID | Path Pattern | Write Class | Reason |
| --- | --- | --- | --- |
| T-S001-01 | docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md | docs-artifact | PRD target for AC-S001-01. |
| T-S001-02 | docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv | docs-artifact | Capability matrix target for AC-S001-02. |
| T-S001-03 | docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | docs-artifact | PRD-derived test-case target for AC-S001-03. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S001-01 | Runtime implementation, API contract change, permission mapping change, data dictionary change, design-system work, executable tests | PRD scope alignment only. |
| T-S001-02 | Runtime implementation, PRD scope change, API contract change, permission mapping change, data dictionary change, design-system work, executable tests | Capability matrix alignment only. |
| T-S001-03 | Runtime implementation, production test implementation, PRD scope change, API contract change, permission mapping change, data dictionary change, design-system work | PRD-derived test-case planning only. |

## Task Acceptance Criteria Coverage

| Task ID | AC IDs Covered | Coverage Notes |
| --- | --- | --- |
| T-S001-01 | AC-S001-01 | Covers PRD root-admin MVP scope and non-goals. |
| T-S001-02 | AC-S001-02 | Covers capability matrix traceability. |
| T-S001-03 | AC-S001-03 | Covers PRD-derived test-case planning. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) Covered | Capability Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S001-01 | chatInterface.mvpPlanning | approved | Planning capability row from source story. |
| T-S001-02 | chatInterface.capabilityTrace | approved | Planning capability row from source story. |
| T-S001-03 | chatInterface.testPlanning | approved | Planning capability row from source story. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S001-01 | not-applicable: first task | PRD scope can be checked first. | no |
| T-S001-02 | T-S001-01 | Capability matrix should consume settled PRD scope. | no |
| T-S001-03 | T-S001-01, T-S001-02 | Test cases should consume PRD scope and capability rows. | no |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S001-01 | not-applicable: no shared seams | not-applicable | not-applicable | PRD alignment task does not consume runtime or shared code seams. |
| T-S001-02 | not-applicable: no shared seams | not-applicable | not-applicable | Capability matrix alignment task does not consume runtime or shared code seams. |
| T-S001-03 | not-applicable: no shared seams | not-applicable | not-applicable | PRD-derived test-case alignment task does not consume runtime or shared code seams. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S001-01 | PRD | prove-current | PRD maintainer workflow | yes |
| T-S001-02 | capability matrix | prove-current | capability-matrix maintainer workflow | yes |
| T-S001-03 | PRD-derived test cases | prove-current | prd-test-case-planner | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S001-01 | source-level | git diff -- docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md | not-applicable: planning artifact, no runtime mock |
| T-S001-02 | contract-level | git diff -- docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md | not-applicable: planning artifact, no runtime mock |
| T-S001-03 | contract-level | git diff -- docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md | Test-case mocks must mirror production contracts and must not invent fallback behavior. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |

## Branch Worktree Bootstrap Strategy

| Task ID | Branch Name | Worktree Strategy | Bootstrap Artifact | Base Ref | Base Commit Policy | Promotion Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | codex/s001-chat-prd-scope | current branch or dedicated task worktree | not-applicable: planning artifact task | origin/main | record exact base commit before Delivery edits | main after promote guardrail |
| T-S001-02 | codex/s001-chat-capability-matrix | current branch or dedicated task worktree | not-applicable: planning artifact task | origin/main | record exact base commit before Delivery edits | main after promote guardrail |
| T-S001-03 | codex/s001-chat-prd-test-cases | current branch or dedicated task worktree | not-applicable: planning artifact task | origin/main | record exact base commit before Delivery edits | main after promote guardrail |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S001-01 | queued-for-delivery | none | Ready as an isolated PRD alignment task. |
| T-S001-02 | queued-for-delivery | none | Ready as an isolated capability matrix alignment task. |
| T-S001-03 | queued-for-delivery | none | Ready as an isolated PRD-derived test-case alignment task. |
