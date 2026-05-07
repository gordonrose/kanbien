# Task Breakdown Packet: Chat Interface S-002 Work Panel Design-System Governance

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-07
- Task Breakdown ID:
  `TBD-CHAT-S002`
- Source Story Breakdown packet:
  docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-002-work-panel-and-chat-design-system-governance/story.md
- Selected Story ID(s):
  S-002
- Related Product Discovery packet:
  docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md
- Related Technical Steering packet:
  docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md
- Related PRD:
  docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md
- Related capability matrix:
  docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv
- Validation command:
  npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-002-work-panel-and-chat-design-system-governance --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-002-work-panel-and-chat-design-system-governance/story.md
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
  BLK-SB-CHAT-002 blocks S-007 if the governed seam is missing or CSS-only.

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-003 | design-system-seam | GOV:design-system | T-S002-01 | covered | Root-admin app adoption must consume design-system-owned render, behavior, accessibility, and style seams. |
| TS-CHAT-011 | shared-lib-candidate | DECISION:refactor-first | T-S002-01 | deferred-with-owner | Broad shared-lib extraction is deferred until another active consumer exists; the MVP task preserves the no-extraction boundary. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-002 | GOV:design-system | Governed work panel and conversation-panel seam | T-S002-01 | Covered by the governed seam preservation task. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-002 | ready-for-task-breakdown | system-value | GOV:design-system | Work panel and chat design-system governance | This is needed so the root builder has one clear place to use Build chat because a one-off panel would be hard for later product areas to reuse or trust. | design-system/frontend governance | One governed design-system task preserves or proves the consumable seam before S-007 app adoption. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S002-01 | S-002 | Design-system artifacts define the right-side panel, mobile floating action, chat thread, contextual starter prompts, history posture, PDF action, and inactive Reporting/Support states. | human-visible-parity | visual; accessibility; interaction; responsive | design-system behavior lock; reference pack; verification |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-002 | AC-S002-01 | chatInterface.designSystemWorkPanel | governed frontend seam | not-capability-backed | design-system behavior lock; canonical/reference evidence; adoption artifact |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S002-01 | S-002 | GOV:design-system | Preserve or refresh the governed work panel and conversation-panel seam contract for Build chat adoption. | src/frontend/designSystem/assets/conversationPanel.*; src/frontend/designSystem/assets/buildWorkPanel*; docs/design-system/**/build-work-panel*; tests/visual/designSystem/*build*; tests/visual/designSystem/*conversation* | root-admin app adoption, API implementation, persistence changes, permission mapping changes, PDF renderer wiring, broad shared-lib extraction | approved Technical Steering design-system seam | design-system-owned work panel and conversation-panel render/controller/accessibility/style seam | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S002-01 | single-proof-target | 1 | One acceptance criterion covers the governed seam contract and proof target. | Governed work panel and conversation-panel seam is consumable by S-007 without local reconstruction. | design-system work panel / conversation panel seam | Canonical route and adoption artifact prove the seam contract. | no runtime app implementation | The task is an artifact-alignment proof of one existing governed seam; future feature behavior remains split to S-007. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S002-01 | design-system-seam-gap | Stop if there is no consumable design-system-owned render, behavior, accessibility, and style seam for root-admin to consume. | Return to design-system governance before S-007 app adoption. | no | App-local reconstruction would violate the governed frontend adoption rule. |
| T-S002-01 | human-decision | Stop if the task requires broad shared-lib extraction for Reporting or Support reuse. | Return to Technical Steering for refactor-first decision. | no | TS-CHAT-011 defers shared extraction until another active consumer exists. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S002-01 | src/frontend/designSystem/assets/conversationPanel.*; src/frontend/designSystem/assets/buildWorkPanel*; design-system canonical routes for build work panel and conversation panel; tests/visual/designSystem | design-system-owned render, behavior/controller, accessibility, and style seams | S-002 story; Technical Steering TS-CHAT-003 and ADA-CHAT-003; PRD; journey inventory |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S002-01 | Root-admin work panel adoption | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | app-shell | app-adoption | ui-state | none | root-admin shell work panel | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | ui-local | DS-owned-shell-required | DS-task-required | shell-registry-update | shell-bootstrap | ready | DS-owned panel/chat seams before app adoption; one-off app-local implementation rejected. |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S002-01 | visual-rendering | not-applicable | This task proves one existing consumable seam; future app adoption remains split to S-007. | Canonical screenshot/visual proof plus behavior lock and adoption artifact. |

## Frontend Performance Posture

| Task ID | Performance Posture | Evidence / Proof Plan | Rationale |
| --- | --- | --- | --- |
| T-S002-01 | interactive-low-risk | Interaction proof with no repeated work or fetch loop, plus visual/browser proof for bounded panel states. | Work panel and chat controls are interactive but bounded; no large table or canvas behavior. |

## Design-System Seam Contract

| Task ID | Seam Posture | Seam Name / Export / Route | Owned Render Structure | Owned Behavior Controller | Owned Accessibility Semantics | Canonical / Behavior Lock / Evidence | Frontend Consumption Contract |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S002-01 | proves-existing-seam | design-system work panel / conversationPanel seam | Design-system-owned panel, chat thread, starter prompts, inactive actions, history, and PDF affordance render structure | Design-system-owned controller or documented event/state contract for panel/chat affordances | Design-system-owned roles, labels, focus, disabled/inactive actions, empty/failed/degraded state semantics | behavior lock, canonical route, visual proof, adoption artifact | S-007 must consume the shared seam and must not copy markup, controller behavior, ARIA semantics, or CSS. |

## Design-System Seam Class Contract

| Task ID | Design-System Seam Class | Class-Specific Required Proof | Downstream Consumption Boundary | Forbidden App / Evidence / Standards Work |
| --- | --- | --- | --- | --- |
| T-S002-01 | canonical-evidence-update | Named canonical route, behavior lock, screenshot/visual command, and adoption artifact prove the existing consumable seam. | S-007 consumes DS render/controller/accessibility/style seams. | No root-admin app-page CSS, no local reconstruction, no API implementation. |

## Frontend Adoption Contract

| Task ID | Consumed DS Render Seam | Consumed DS Behavior / Controller Seam | Consumed DS Accessibility Semantics | Consumed DS Style / CSS Seam | Allowed App-Local Composition / Data Binding | Forbidden Local Reconstruction | Adoption Proof Route / Scenario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S002-01 | design-system work panel/conversation-panel render seam | design-system panel/chat controller or event contract | design-system role/name/state/focus semantics | design-system CSS/style seam | Future S-007 may bind root-admin data and route actions to the seam. | copying panel markup, controller logic, ARIA/state behavior, or app-page CSS | root-admin Build panel adoption proof after S-007 |

## Frontend Security Evidence

| Task ID | Security Area | Source Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Layer 4 Evidence Plan / Blocking Reason |
| --- | --- | --- | --- | --- | --- |
| T-S002-01 | session-cookie | yes | Root-admin panel and chat actions use existing authenticated browser session posture. | Governed canonical and app adoption proof must not bypass session-based route access. | Visual proof names served route access posture; protected runtime actions split to S-006/S-007. |
| T-S002-01 | csp-assets | yes | Design-system canonical and app adoption must use served, approved assets. | Visual proof must run against served routes and CSP-compatible assets. | Run served design-system visual/browser proof. |
| T-S002-01 | csrf-mutation | yes | Chat generation/download actions may become protected browser mutations downstream. | Design-system behavior must not fake mutation authority or encode secrets. | Runtime mutation proof split to S-006; canonical proof confirms no fake authority. |
| T-S002-01 | url-replay-state | yes | Panel state and starter prompts are UI state, not authority. | Canonicals and app adoption must avoid sensitive replay state in URLs. | Browser proof verifies no sensitive replay state or authority in URLs. |
| T-S002-01 | sensitive-rendering | yes | Conversation history and generated packet status may render sensitive planning information. | Denied, empty, failed, degraded, and allowed states need explicit evidence. | Canonical proof names allowed/denied/failed/degraded states; runtime sensitive-data proof splits to S-008. |
| T-S002-01 | asset-delivery | yes | PDF download affordance points to approved generated-document delivery posture. | Download action must remain an affordance until protected API/download tasks exist. | Canonical proof keeps PDF as affordance; API/download proof split to S-006. |

## Frontend Permission Rendering Evidence

| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |
| --- | --- | --- | --- | --- | --- |
| T-S002-01 | Build chat panel shell, history preview, packet status, PDF affordance | canonical allowed Build state | canonical denied/inactive state | canonical unauthenticated or unavailable state if route supports it | not-applicable: root-admin-only DS canonical; runtime denial proof splits to S-006/S-008 |

## Frontend Runtime Data And Mock Honesty

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |
| T-S002-01 | docs/api-contracts/chat-interface-layer-one-discovery.md | design-system canonical fixtures or static state fixtures | not-applicable: design-system seam proof only | Runtime API payloads are owned by S-006/S-008 after API implementation. | Fixtures must be labeled as canonical state fixtures and must not imply production fallback behavior. |

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
| T-S002-01 | exact-files | src/frontend/designSystem/assets/conversationPanel.*; src/frontend/designSystem/assets/buildWorkPanel*; docs/design-system/**/build-work-panel*; tests/visual/designSystem/*build*; tests/visual/designSystem/*conversation* | Narrow governed design-system seam and proof paths only. |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Focused Proof Command Or Evidence | Mock-Honesty Note |
| --- | --- | --- | --- |
| T-S002-01 | task-specific | design-system canonical visual/browser proof for work panel/conversation panel; task-breakdown validation | Canonical fixtures must not encode production-only fallback behavior. |

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

| Task ID | Docs Artifact Class | Source Truth Reviewed | Scriptable Source Inventory | Stale Artifact Sweep | Status Posture | Validation Command | Specialized Routing |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Standards Compliance Contract

| Task ID | Standards Gate | Source Path | Control Evidence Inventory | Posture Recorded | Command | Coverage Summary | Status Artifact | Follow-Up Routing |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Standards Update Contract

| Task ID | Approved Change Source | Update Class | Change Owner | Rationale | Affected Surfaces | Invalidation Sweep | Enforcement Plan | Rollout Compatibility | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Permission Mapping Contract

| Task ID | Authz Model Source | Permission Mapping Class | Capability Rows | Boundary | Grant Source UI | Mapping Row Posture | Denial Audit | Allow / Deny Coverage | Evidence Inventory | Grants Migration | Split Routing | Authz Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## API Contract

| Task ID | Route Family | API Contract Class | Contract Source | Request / Response | Authz / Validation | Compatibility | Maintained Artifact Inventory | Maintained Artifacts | Split Routing | Validation Command |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Data Dictionary Contract

| Task ID | Entity / Table | Source Reviewed | Field / Index / Lifecycle | Durable Facts | Classification / Compliance | Standards Trace | Enforcement Trace | Enforcement Evidence | Test Evidence Trace | Split Routing | Compliance Health | Retention Review Disposition | Validation Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test-Only Coverage Contract

| Task ID | Test Change Class | Source Authority | Traceability | Proof Layer | Mock Honesty | No Behavior Change | Sensitive State Coverage | Focused Command | Coverage Strength | Split Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test Suite Alignment Contract

| Task ID | Source Authority | Source Map | Mismatch Class | Edit Envelope | No Production Change | Split New Proof | Traceability Command | Coverage Strength | Source Truth Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Capability Permission / State Matrix

| Task ID | Capability / Permission | Allowed Actor / State | Denied Actor / State | Object / Lifecycle States | Required Proof |
| --- | --- | --- | --- | --- | --- |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Required Escalation |
| --- | --- | --- |
| T-S002-01 | Do not assume CSS sharing alone is governed adoption; do not assume root-admin may copy design-system markup, controller behavior, ARIA semantics, or app-page CSS. | Return to design-system governance or human exception approval. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Guardrail Reference | Approval Status | Notes |
| --- | --- | --- | --- | --- |
| T-S002-01 | GOV:design-system | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/design-system-task-guardrail.md | approved | Design-system guardrail reviewed for consumable seam, visual proof, security evidence, mock honesty, performance posture, and adoption path. |

## Task Guardrail Evidence

| Task ID | Check ID | Status | Evidence / Rationale |
| --- | --- | --- | --- |
| T-S002-01 | design-system-family | pass | Work panel and conversation-panel family is named. |
| T-S002-01 | design-system-behavior-lock | pass | Task requires behavior lock or equivalent signoff artifact. |
| T-S002-01 | design-system-seam-class | pass | Seam class is canonical-evidence-update for an existing governed seam. |
| T-S002-01 | design-system-consumable-seam | pass | Render, behavior, accessibility, and style seams are named for S-007 consumption. |
| T-S002-01 | design-system-render-behavior | pass | Render structure and behavior/controller ownership are named. |
| T-S002-01 | design-system-visual-proof | pass | Visual/browser proof command is required. |
| T-S002-01 | design-system-security-evidence | pass | Browser security posture rows are copied from the story. |
| T-S002-01 | design-system-runtime-data-mock-honesty | pass | Runtime data is split downstream; canonical fixture honesty is required. |
| T-S002-01 | design-system-adoption-path | pass | S-007 adoption contract boundary is named. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Shared-Code Guardrail Required | Compatibility / Move Notes | Review Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S002-01 | feature-local | design-system asset/canonical files | design-system asset/canonical files | no | not-applicable | No shared-lib extraction in MVP; app adoption consumes DS seam later. | approved |

## Allowed Write Set Classification

| Task ID | Path | Write Class | Reason |
| --- | --- | --- | --- |
| T-S002-01 | src/frontend/designSystem/assets/conversationPanel.* | feature-local | Governed design-system seam source. |
| T-S002-01 | src/frontend/designSystem/assets/buildWorkPanel* | feature-local | Governed work panel seam source. |
| T-S002-01 | docs/design-system/**/build-work-panel* | docs-artifact | Behavior lock, reference, or adoption artifact. |
| T-S002-01 | tests/visual/designSystem/*build*; tests/visual/designSystem/*conversation* | test | Visual proof for governed canonical states. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S002-01 | Root-admin app implementation, app-page CSS, copied markup, copied controller behavior, API routes, persistence, permission mapping, PDF renderer wiring, broad shared-lib extraction | This task preserves the upstream governed seam only. |

## Task Acceptance Criteria Coverage

| Task ID | AC ID | Coverage Notes |
| --- | --- | --- |
| T-S002-01 | AC-S002-01 | Covers governed work panel and conversation-panel seam contract and proof obligations. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) | Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S002-01 | chatInterface.designSystemWorkPanel | not-capability-backed | Design-system governance is upstream of runtime feature capability rows. |

## Task Dependencies

| Task ID | Depends On | Dependency Reason | Blocks Delivery |
| --- | --- | --- | --- |
| T-S002-01 | not-applicable: approved Technical Steering exists | DS seam governance source is approved. | no |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S002-01 | design-system work panel and conversation-panel seam | design-system-seam | existing-or-new | S-007 must consume render/controller/accessibility/style seams, not reconstruct them locally. |

## Artifact Obligations

| Task ID | Artifact | Required Action | Owner | Blocks Delivery |
| --- | --- | --- | --- | --- |
| T-S002-01 | behavior lock, canonical/reference evidence, adoption artifact | prove-current | frontend-design-system-loop-maintainer | yes |

## Proof And Command Plan

| Task ID | Proof Layer | Command / Evidence | Mock-Honesty Note |
| --- | --- | --- | --- |
| T-S002-01 | rendered-browser | design-system canonical visual/browser proof; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-002-work-panel-and-chat-design-system-governance --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-002-work-panel-and-chat-design-system-governance/story.md | Canonical fixtures must not imply runtime fallback behavior. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S002-01 | not-applicable: GOV:design-system focused proof | not-applicable: QA evidence task split to S-008 | not-applicable: design-system proof plan owns canonical evidence | not-applicable: runtime payload evidence split to S-008 | not-applicable: canonical fixture honesty recorded in task proof | not-applicable: no QA evidence artifact produced by this task | not-applicable: no QA evidence sweep in this task | design-system reviewer judges canonical seam sufficiency |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |

## Branch Worktree Bootstrap Strategy

| Task ID | Suggested Branch | Worktree Strategy | Bootstrap Source | Base Ref | Pre-Edit Check | Promote Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S002-01 | codex/s002-chat-work-panel-ds-governance | current branch or dedicated task worktree | story-local task proof | origin/main | record exact base commit before Delivery edits | main after promote guardrail |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Layer 5 Delivery Handoff

| Task ID | Delivery Status | Known Blockers | Handoff Notes |
| --- | --- | --- | --- |
| T-S002-01 | queued-for-delivery | none | Ready for Layer 5 as an isolated governed design-system seam proof task. |
