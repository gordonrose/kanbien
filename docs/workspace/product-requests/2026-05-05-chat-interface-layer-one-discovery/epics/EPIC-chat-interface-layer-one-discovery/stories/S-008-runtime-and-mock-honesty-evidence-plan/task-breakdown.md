# Task Breakdown Packet: Chat Interface S-008 Runtime And Mock Honesty Evidence Plan

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-07
- Task Breakdown ID:
  `TBD-CHAT-S008`
- Source Story Breakdown packet:
  docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-008-runtime-and-mock-honesty-evidence-plan/story.md
- Selected Story ID(s):
  S-008
- Validation command:
  npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-008-runtime-and-mock-honesty-evidence-plan --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-008-runtime-and-mock-honesty-evidence-plan/story.md
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
  `yes`
- Story blockers carried forward:
  Runtime evidence tasks depend on the implementation tasks whose live shapes they prove.

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-009 | feature-public-seam | EVIDENCE:qa-evidence | T-S008-02, T-S008-03, T-S008-04 | covered | Evidence tasks are blocked until implementation exists; T-S008-01 queues the placement map first. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-008 | TEST:test-suite-alignment | Test suite alignment | T-S008-01 | Journey inventory placement can be queued before runtime evidence exists. |
| S-008 | EVIDENCE:qa-evidence | Runtime/browser evidence | T-S008-02, T-S008-03, T-S008-04 | Evidence capture is defined but blocked until implementation dependencies complete. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-008 | ready-for-task-breakdown | harness-value | TEST:test-suite-alignment | Runtime and mock-honesty evidence plan | This is needed to decide what evidence will prove the chat works in the real workspace, not only in simplified examples. | QA governance | Queue the test-suite alignment map now and block runtime evidence tasks until live seams exist. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S008-01 | S-008 | Evidence plan includes persistence-backed tests, API authz tests, generated PDF tests, browser scenarios for desktop/mobile, denied/empty/failed/degraded states, and mock-honesty checks. | source-level | QA planning; fixture review | PRD-derived test cases; QA evidence plan |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-008 | AC-S008-01 | chatInterface.qaEvidencePlan | QA governance | prove-current | PRD-derived test cases; QA evidence plan |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-01 | S-008 | TEST:test-suite-alignment | Convert journey inventory IDs into executable test placement, fixture-source rules, and traceability expectations. | docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; docs/workspace/qa-evidence/** | production behavior, new executable assertions, runtime evidence capture, frontend/browser implementation | not-applicable: source plan exists | not-applicable: test metadata planning | queued-for-delivery |
| T-S008-02 | S-008 | EVIDENCE:qa-evidence | Capture persistence/API live-shape and mock-honesty evidence for conversation and history flows. | docs/workspace/qa-evidence/chat-interface-layer-one-discovery/**; test-results/** | production fixes, executable test additions, API contract changes, permission changes | T-S005-01; T-S006-03 | not-applicable: evidence artifact | blocked |
| T-S008-03 | S-008 | EVIDENCE:qa-evidence | Capture generated PDF success, denial, retry, and failure evidence. | docs/workspace/qa-evidence/chat-interface-layer-one-discovery/**; test-results/** | PDF renderer changes, route implementation, permission mapping, executable test additions | T-S003-01; T-S005-02; T-S006-03 | not-applicable: evidence artifact | blocked |
| T-S008-04 | S-008 | EVIDENCE:qa-evidence | Capture root-admin browser and design-system adoption evidence after first-consumer parity exists. | docs/workspace/qa-evidence/chat-interface-layer-one-discovery/**; test-results/** | app CSS, app UI implementation, DS seam changes, executable test additions | T-S002-01; T-S007-01; T-S007-02 | not-applicable: evidence artifact | blocked |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-01 | single-proof-target | 1 | One AC covers evidence-plan placement truth. | Journey inventory maps to executable proof locations and fixture-source rules. | PRD journey inventory | Traceability and coverage-strength commands expose placement truth. | no runtime evidence | Evidence capture split to T-S008-02 through T-S008-04. |
| T-S008-02 | single-proof-target | 1 | One AC covers runtime/mock-honesty proof but this task isolates conversation/history live shape. | Live persistence/API shape compared with mocks and fixtures. | QA evidence artifact | Payload/mock comparison artifact exists after implementation. | no PDF/browser proof | PDF and browser evidence split separately. |
| T-S008-03 | single-proof-target | 1 | One AC covers runtime evidence but this task isolates PDF success/denial/failure. | Generated PDF evidence follows the asset decision. | QA evidence artifact | PDF evidence artifact exists after implementation. | no conversation/browser proof | Conversation and browser evidence split separately. |
| T-S008-04 | single-proof-target | 1 | One AC covers browser proof but this task isolates root-admin/DS adoption evidence. | Served browser proof and DS adoption evidence captured. | QA evidence artifact | Browser evidence artifact exists after implementation. | no API/PDF proof | API and PDF evidence split separately. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S008-01 | source-truth-mismatch | Stop if journey inventory and PRD test cases disagree on proof placement or fixture source. | Return to QA evidence plan owner. | no | Alignment must not rewrite product proof expectations. |
| T-S008-02 | proof-gap | Stop until S-005 persistence and S-006 backend runtime exist. | Keep evidence task blocked. | no | Live-shape evidence cannot be captured before live shape exists. |
| T-S008-03 | proof-gap | Stop until S-003 PDF decision, S-005 packet revisions, and S-006 backend runtime exist. | Keep evidence task blocked. | no | PDF evidence needs implemented route and packet state. |
| T-S008-04 | proof-gap | Stop until S-002 DS seam and S-007 root-admin adoption exist. | Keep evidence task blocked. | no | Browser evidence needs served app adoption. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S008-01 | docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | test traceability and coverage-strength commands | S-008 story; TEST:test-suite-alignment guardrail |
| T-S008-02 | docs/data-dictionary/harness-chat-conversation.md; docs/api-contracts/chat-interface-layer-one-discovery.md; tests/integration/harnessChat/** | runtime API/persistence payloads after implementation | S-005, S-006, journey inventory |
| T-S008-03 | docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md; docs/api-contracts/chat-interface-layer-one-discovery.md | PDF route and packet revision evidence after implementation | S-003, S-005, S-006, journey inventory |
| T-S008-04 | docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md; root-admin served route; design-system canonicals | signed-off DS seam and root-admin adoption after implementation | S-002, S-007, journey inventory |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-01 | Evidence placement map | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | evidence-plan | ui-state | none | root-admin Build panel state | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | docs/prd | Alignment task only; no frontend implementation. |
| T-S008-02 | Live-shape evidence | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | evidence-plan | ui-state | none | root-admin Build API payloads | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | docs/workspace/qa-evidence | Blocked until runtime exists. |
| T-S008-03 | PDF evidence | root-admin | in-app harness chat | packet export | hidden/internal | root-operator | browser-workflow | evidence-plan | ui-state | none | root-admin Build PDF action | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | never-serialize | DS-owned-shell-required | DS-task-required | shell-registry-update | docs/workspace/qa-evidence | Blocked until PDF route exists. |
| T-S008-04 | Browser DS evidence | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | evidence-plan | ui-state | none | root-admin Build panel state | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | docs/workspace/qa-evidence | Blocked until app adoption exists. |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S008-01 | not-applicable | not-applicable: TEST:test-suite-alignment task | no frontend work | not-applicable |
| T-S008-02 | not-applicable | not-applicable: evidence task | no frontend work | not-applicable |
| T-S008-03 | not-applicable | not-applicable: evidence task | no frontend work | not-applicable |
| T-S008-04 | evidence-only-browser-proof | served browser and design-system adoption evidence | no frontend implementation | Browser proof after S-007. |

## Frontend Performance Posture

| Task ID | Performance Posture | Evidence / Proof Plan | Rationale |
| --- | --- | --- | --- |

## Design-System Seam Contract

| Task ID | Seam Posture | Seam Name / Export / Route | Owned Render Structure | Owned Behavior Controller | Owned Accessibility Semantics | Canonical / Behavior Lock / Evidence | Frontend Consumption Contract |
| --- | --- | --- | --- | --- | --- | --- | --- |

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

| Task ID | Backend Change Class | Approved Source Authority | Backend Feature Owner | Backend Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
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
| T-S008-01 | narrow-pattern | docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; docs/workspace/qa-evidence/** | Narrow QA planning artifacts only. |
| T-S008-02 | narrow-pattern | docs/workspace/qa-evidence/chat-interface-layer-one-discovery/**; test-results/** | Evidence artifact and captured output paths only. |
| T-S008-03 | narrow-pattern | docs/workspace/qa-evidence/chat-interface-layer-one-discovery/**; test-results/** | Evidence artifact and captured output paths only. |
| T-S008-04 | narrow-pattern | docs/workspace/qa-evidence/chat-interface-layer-one-discovery/**; test-results/** | Evidence artifact and captured output paths only. |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Focused Proof Command Or Evidence | Mock-Honesty Note |
| --- | --- | --- | --- |
| T-S008-01 | task-specific | npm run test:traceability -- --doc docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; npm run test:coverage-strength; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-008-runtime-and-mock-honesty-evidence-plan --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-008-runtime-and-mock-honesty-evidence-plan/story.md | Alignment must describe fixture source honestly and not add assertions. |
| T-S008-02 | task-specific | blocked: capture API/persistence payload and mock-honesty comparison after S-005/S-006 implementation | Compare mocks/fixtures with live payload or contract shape. |
| T-S008-03 | task-specific | blocked: capture PDF success/denial/retry/failure evidence after PDF route exists | Compare PDF fixtures with approved packet data shape. |
| T-S008-04 | task-specific | blocked: capture served browser/design-system evidence after S-007 | Compare browser fixtures with served app and DS canonical truth. |

## Refactor-First Contract

| Task ID | Trigger | Refactor Type | Target Inventory | Detection Hints | Existing Behavior Preserved | Affected Consumers | Compatibility Proof | Downstream Unblocker | No Product Change | Human Review Boundary | Routing Check |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Foundation Contract

| Task ID | Concern Area | Trigger | Question | Decision Provenance | ADRs / Sources Reviewed | Missing Decision | Sources To Review | Output Artifact Target | Decision Analysis Checklist | Owner | Downstream Tasks Blocked | Compatibility Posture | Final Authority Route | Human Review Boundary | Forbidden Implementation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Update Contract

| Task ID | Approved Decision Source | Update Class | Authority Reviewed | Change Owner | Output Artifact | Consistency Inventory | Downstream Impact | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Standards Compliance Contract

| Task ID | Compliance Target Type | Standard / Gate | Source Standard Path / Reference | Scope Under Review | Control / Evidence Inventory | Review Method / Command | Compliance Posture | Evidence Artifact Target | Coverage Summary Command | Findings Summary | Follow-Up Routing | Human Review Boundary | Waiver / Blocker Posture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Standards Update Contract

| Task ID | Approved Change Source | Update Class | Change Owner | Rationale | Affected Surfaces | Invalidation Sweep | Enforcement Plan | Rollout Compatibility | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Permission Mapping Contract

| Task ID | Permission Mapping Class | Approved Authz Source | Capability / Route / Surface | Authority World / Actor Boundary | Grant Source Posture | Mapping Row Posture | Tenant / Object Boundary | Allow / Deny Expectations | UI Eligibility | Denial / Audit / Proof Expectation | Evidence Mapping Inventory | Migration Impact | Split / Blocked Follow-Up | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## API Contract

| Task ID | API Contract Class | Route Family | Contract Source / Authority | Methods / Paths | Params / Query / Body | Response / Status / Error Shape | Authn / Authz / Tenant Boundary | Validation / Pagination / Sorting / System Fields | Compatibility Posture | Maintained API Artifacts | Maintained Artifact Inventory | Split / Blocked Follow-Up | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Data Dictionary Contract

| Task ID | Entity / Table | Source Reviewed | Field / Index / Lifecycle | Durable Facts | Classification / Compliance | Standards Trace | Enforcement Trace | Enforcement Evidence | Test Evidence Trace | Split Routing | Compliance Health | Retention Review Disposition | Validation Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test-Only Coverage Contract

| Task ID | Test Change Class | Source Authority | Traceability | Proof Layer | Mock Honesty | No Behavior Change | Sensitive State Coverage | Focused Command | Coverage Strength | Split Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test Suite Alignment Contract

| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-01 | S-008 story; PRD test cases; journey inventory | proof-layer-drift; fixture-doc-drift | docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; docs/workspace/qa-evidence/chat-interface-layer-one-discovery/ | not-applicable: executable test targets are mapped, not edited, until implementation tasks create proof | docs-only; test-title-or-comment-only if existing labels need traceability | no new proof in this alignment task; missing executable proof routes to TEST:test-only and evidence capture routes to EVIDENCE:qa-evidence | npm run test:traceability | before/after traceability delta and alignment evidence recorded with coverage-strength summary |

## Capability Permission / State Matrix

| Task ID | Capability / Permission | Allowed Actor / State | Denied Actor / State | Object / Lifecycle States | Required Proof |
| --- | --- | --- | --- | --- | --- |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Required Escalation |
| --- | --- | --- |
| T-S008-01 | Do not add assertions or change production behavior inside alignment work. | Split to TEST:test-only or DEV task. |
| T-S008-02 | Do not claim live-shape evidence before S-005/S-006 runtime exists. | Keep task blocked. |
| T-S008-03 | Do not claim PDF evidence before packet revision and download route exist. | Keep task blocked. |
| T-S008-04 | Do not claim browser adoption evidence before root-admin adoption exists. | Keep task blocked. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Guardrail Reference | Approval Status | Notes |
| --- | --- | --- | --- | --- |
| T-S008-01 | TEST:test-suite-alignment | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/test-suite-alignment-task-guardrail.md | approved | Test-suite alignment guardrail reviewed for source map, mismatch class, edit envelope, no production change, traceability, and coverage-strength summary. |
| T-S008-02 | EVIDENCE:qa-evidence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/qa-evidence-task-guardrail.md | approved | Evidence guardrail reviewed; delivery handoff remains blocked until live runtime exists. |
| T-S008-03 | EVIDENCE:qa-evidence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/qa-evidence-task-guardrail.md | approved | Evidence guardrail reviewed; delivery handoff remains blocked until PDF route exists. |
| T-S008-04 | EVIDENCE:qa-evidence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/qa-evidence-task-guardrail.md | approved | Evidence guardrail reviewed; delivery handoff remains blocked until browser adoption exists. |

## Task Guardrail Evidence

| Task ID | Check ID | Status | Evidence / Rationale |
| --- | --- | --- | --- |
| T-S008-01 | test-alignment-source-authority | pass | S-008 story, PRD tests, and journey inventory are source authority. |
| T-S008-01 | test-alignment-source-map | pass | Exact source map named. |
| T-S008-01 | test-alignment-mismatch-class | pass | Traceability and fixture-source placement drift named. |
| T-S008-01 | test-alignment-edit-envelope | pass | Docs/QA planning envelope only. |
| T-S008-01 | test-alignment-no-production-change | pass | No production behavior changes. |
| T-S008-01 | test-alignment-split-new-proof | pass | New proof splits to TEST:test-only or EVIDENCE:qa-evidence. |
| T-S008-01 | test-alignment-traceability-command | pass | npm run test:traceability named. |
| T-S008-01 | test-alignment-coverage-strength | pass | npm run test:coverage-strength named. |
| T-S008-01 | test-alignment-source-truth-boundary | pass | Do not weaken PRD/test intent. |
| T-S008-02 | qa-proof-target | pass | Live payload and mock-honesty proof target named. |
| T-S008-02 | qa-command-plan | pass | Capture commands blocked until runtime exists. |
| T-S008-02 | qa-evidence-class | pass | mock-honesty-comparison evidence class selected. |
| T-S008-02 | qa-evidence-source-inventory | pass | API contract, data dictionary, and runtime payload sources named. |
| T-S008-02 | qa-evidence-instruments | pass | Live API/persistence payload and fixture comparison instruments named. |
| T-S008-02 | qa-runtime-evidence | pass | Runtime evidence required after S-005/S-006. |
| T-S008-02 | qa-mock-honesty | pass | Fixtures compared with live payload or contract shape. |
| T-S008-02 | qa-expected-output | pass | Evidence artifact output named. |
| T-S008-02 | qa-evidence-status | pass | Blocked until runtime exists. |
| T-S008-02 | qa-coverage-strength-summary | pass | Coverage-strength row included. |
| T-S008-02 | qa-human-review-boundary | pass | QA reviewer boundary named. |
| T-S008-03 | qa-proof-target | pass | PDF success/denial/retry/failure evidence target named. |
| T-S008-03 | qa-command-plan | pass | PDF evidence commands blocked until route exists. |
| T-S008-03 | qa-evidence-class | pass | evidence-sweep evidence class selected. |
| T-S008-03 | qa-evidence-source-inventory | pass | Asset decision, API contract, and packet revision sources named. |
| T-S008-03 | qa-evidence-instruments | pass | PDF route, denial, retry, and failure instruments named. |
| T-S008-03 | qa-runtime-evidence | pass | Runtime PDF evidence required after implementation. |
| T-S008-03 | qa-mock-honesty | pass | PDF fixtures compared with approved packet data shape. |
| T-S008-03 | qa-expected-output | pass | Evidence artifact output named. |
| T-S008-03 | qa-evidence-status | pass | Blocked until route exists. |
| T-S008-03 | qa-coverage-strength-summary | pass | Coverage-strength row included. |
| T-S008-03 | qa-human-review-boundary | pass | QA/security reviewer boundary named. |
| T-S008-04 | qa-proof-target | pass | Browser and DS adoption proof target named. |
| T-S008-04 | qa-command-plan | pass | Browser evidence commands blocked until S-007. |
| T-S008-04 | qa-evidence-class | pass | browser-proof evidence class selected. |
| T-S008-04 | qa-evidence-source-inventory | pass | DS adoption contract, served route, and browser targets named. |
| T-S008-04 | qa-evidence-instruments | pass | Browser screenshot/served asset/DS comparison instruments named. |
| T-S008-04 | qa-runtime-evidence | pass | Served browser evidence required after implementation. |
| T-S008-04 | qa-mock-honesty | pass | Browser fixtures compared with served app and DS canonical truth. |
| T-S008-04 | qa-expected-output | pass | Evidence artifact output named. |
| T-S008-04 | qa-evidence-status | pass | Blocked until browser adoption exists. |
| T-S008-04 | qa-coverage-strength-summary | pass | Coverage-strength row included. |
| T-S008-04 | qa-human-review-boundary | pass | Frontend/QA reviewer boundary named. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Shared-Code Guardrail Required | Compatibility / Move Notes | Review Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-01 | feature-local | QA planning artifacts | QA planning artifacts | no | not-applicable | No source extraction. | approved |
| T-S008-02 | feature-local | QA evidence artifacts | QA evidence artifacts | no | not-applicable | No source extraction. | approved |
| T-S008-03 | feature-local | QA evidence artifacts | QA evidence artifacts | no | not-applicable | No source extraction. | approved |
| T-S008-04 | feature-local | QA evidence artifacts | QA evidence artifacts | no | not-applicable | No source extraction. | approved |

## Allowed Write Set Classification

| Task ID | Path | Write Class | Reason |
| --- | --- | --- | --- |
| T-S008-01 | docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | docs-artifact | Test placement and traceability docs only. |
| T-S008-01 | docs/workspace/qa-evidence/** | docs-artifact | Evidence placement notes only. |
| T-S008-02 | docs/workspace/qa-evidence/chat-interface-layer-one-discovery/**; test-results/** | docs-artifact | Captured evidence output only. |
| T-S008-03 | docs/workspace/qa-evidence/chat-interface-layer-one-discovery/**; test-results/** | docs-artifact | Captured evidence output only. |
| T-S008-04 | docs/workspace/qa-evidence/chat-interface-layer-one-discovery/**; test-results/** | docs-artifact | Captured evidence output only. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S008-01 | Production source changes, new assertions, fixture semantic changes, runtime evidence claims | Keep alignment honest and non-behavioral. |
| T-S008-02 | Runtime fixes, new tests, contract changes | Evidence task only. |
| T-S008-03 | PDF route or renderer changes, new tests, permission changes | Evidence task only. |
| T-S008-04 | App CSS, app UI implementation, DS seam changes, new tests | Evidence task only. |

## Task Acceptance Criteria Coverage

| Task ID | AC ID | Coverage Notes |
| --- | --- | --- |
| T-S008-01 | AC-S008-01 | Covers test placement and fixture-source alignment. |
| T-S008-02 | AC-S008-01 | Covers conversation/history live-shape and mock-honesty evidence after implementation. |
| T-S008-03 | AC-S008-01 | Covers generated PDF evidence after implementation. |
| T-S008-04 | AC-S008-01 | Covers browser/design-system evidence after implementation. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) | Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S008-01 | chatInterface.qaEvidencePlan | approved | Alignment task queued. |
| T-S008-02 | chatInterface.qaEvidencePlan | approved | Handoff remains blocked until live runtime exists. |
| T-S008-03 | chatInterface.qaEvidencePlan | approved | Handoff remains blocked until PDF route exists. |
| T-S008-04 | chatInterface.qaEvidencePlan | approved | Handoff remains blocked until browser adoption exists. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S008-01 | not-applicable: first task for story | Source plan exists. | no |
| T-S008-02 | not-applicable: external S-005/S-006 implementation dependencies | Live-shape evidence needs implemented persistence and APIs. | yes |
| T-S008-03 | not-applicable: external S-003/S-005/S-006 implementation dependencies | PDF evidence needs implemented packet and download route. | yes |
| T-S008-04 | not-applicable: external S-002/S-007 implementation dependencies | Browser evidence needs DS seam and app adoption. | yes |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S008-01 | not-applicable: planning artifact | not-applicable | not-applicable | Journey inventory owns placement source. |
| T-S008-02 | not-applicable: evidence artifact | not-applicable | not-applicable | Evidence captures implemented runtime shape. |
| T-S008-03 | not-applicable: evidence artifact | not-applicable | not-applicable | Evidence captures implemented PDF shape. |
| T-S008-04 | not-applicable: evidence artifact | not-applicable | not-applicable | Evidence captures implemented browser shape. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S008-01 | journey inventory and PRD test cases | prove-current | TEST:test-suite-alignment | yes |
| T-S008-02 | QA evidence artifact | create-after-implementation | EVIDENCE:qa-evidence | yes |
| T-S008-03 | QA evidence artifact | create-after-implementation | EVIDENCE:qa-evidence | yes |
| T-S008-04 | QA evidence artifact | create-after-implementation | EVIDENCE:qa-evidence | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S008-01 | source-level | npm run test:traceability -- --doc docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; npm run test:coverage-strength; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-008-runtime-and-mock-honesty-evidence-plan --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-008-runtime-and-mock-honesty-evidence-plan/story.md | No runtime evidence claim. |
| T-S008-02 | runtime-api; mock-honesty | blocked until live payload exists | Compare fixtures/mocks to live payload or contract. |
| T-S008-03 | runtime-api; asset-delivery | blocked until PDF route exists | Compare PDF evidence with approved packet data. |
| T-S008-04 | rendered-browser; served-assets | blocked until app adoption exists | Compare served browser output with DS canonical truth. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-02 | mock-honesty-comparison | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/data-dictionary/harness-chat-conversation.md; docs/workspace/qa-evidence/chat-interface-layer-one-discovery/ | live API payload capture, persistence row sample, fixture comparison command | Live API payload and persistence evidence required after S-005/S-006 implementation. | Compare mocks and fixtures with live payload or contract shape; invented fallback behavior is a gap. | QA evidence markdown with payload/fixture comparison and residual-risk notes. | blocked: runtime not implemented yet | QA reviewer decides evidence sufficiency and accepted unavailable proof. |
| T-S008-03 | evidence-sweep | docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md; docs/api-contracts/chat-interface-layer-one-discovery.md; docs/workspace/qa-evidence/chat-interface-layer-one-discovery/ | PDF success, denial, retry, and failure capture commands | Live PDF route payload and generated artifact evidence required after implementation. | Compare PDF fixtures with approved packet data contract and avoid draft-chat fallback. | QA evidence markdown with PDF success/denial/retry/failure proof. | blocked: PDF route not implemented yet | QA/security reviewer decides evidence sufficiency. |
| T-S008-04 | browser-proof | docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md; root-admin served route; docs/workspace/qa-evidence/chat-interface-layer-one-discovery/ | browser screenshots, served asset checks, DS canonical comparison | Served browser/process/asset evidence required after S-007 implementation. | Compare browser fixtures with served app and design-system canonical truth. | QA evidence markdown with browser, served asset, and DS adoption proof. | blocked: app adoption not implemented yet | Frontend/QA reviewer decides evidence sufficiency. |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |
| T-S008-01 | npm run test:coverage-strength | not-run: delivery task must run during Layer 5 alignment | unknown until command runs | accepted-deferred | T-S008-01 delivery owner |
| T-S008-02 | npm run test:coverage-strength | not-run: blocked until runtime exists | unknown until command runs | accepted-deferred | T-S008-02 delivery owner |
| T-S008-03 | npm run test:coverage-strength | not-run: blocked until PDF route exists | unknown until command runs | accepted-deferred | T-S008-03 delivery owner |
| T-S008-04 | npm run test:coverage-strength | not-run: blocked until browser adoption exists | unknown until command runs | accepted-deferred | T-S008-04 delivery owner |

## Branch Worktree Bootstrap Strategy

| Task ID | Suggested Branch | Worktree Strategy | Bootstrap Source | Base Ref | Pre-Edit Check | Promote Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S008-01 | codex/s008-test-suite-alignment | dedicated task branch | story-local task packet | origin/main | inspect journey inventory and PRD tests | main after promote guardrail |
| T-S008-02 | codex/s008-live-shape-evidence | dedicated task branch after runtime | story-local task packet | origin/main | confirm S-005/S-006 implementation exists | main after promote guardrail |
| T-S008-03 | codex/s008-pdf-evidence | dedicated task branch after runtime | story-local task packet | origin/main | confirm PDF route exists | main after promote guardrail |
| T-S008-04 | codex/s008-browser-ds-evidence | dedicated task branch after frontend | story-local task packet | origin/main | confirm S-007 app adoption exists | main after promote guardrail |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |
| BLK-S008-01 | T-S008-02 | dependency | S-005/S-006 implementation | Live-shape evidence needs runtime. | Complete runtime implementation first. |
| BLK-S008-02 | T-S008-03 | dependency | S-003/S-005/S-006 implementation | PDF evidence needs packet and route behavior. | Complete runtime implementation first. |
| BLK-S008-03 | T-S008-04 | dependency | S-007 implementation | Browser evidence needs root-admin adoption. | Complete frontend adoption first. |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S008-01 | queued-for-delivery | none | Can run in parallel with early backend work. |
| T-S008-02 | blocked | S-005/S-006 runtime implementation | Evidence capture only after live payload exists. |
| T-S008-03 | blocked | S-003/S-005/S-006 runtime implementation | Evidence capture only after PDF route exists. |
| T-S008-04 | blocked | S-007 frontend adoption | Evidence capture only after served browser adoption exists. |
