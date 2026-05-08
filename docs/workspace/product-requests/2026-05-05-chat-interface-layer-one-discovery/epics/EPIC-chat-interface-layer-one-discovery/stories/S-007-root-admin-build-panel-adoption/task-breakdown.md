# Task Breakdown Packet: Chat Interface S-007 Root Admin Build Panel Adoption

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-07
- Task Breakdown ID:
  `TBD-CHAT-S007`
- Source Story Breakdown packet:
  docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-007-root-admin-build-panel-adoption/story.md
- Selected Story ID(s):
  S-007
- Validation command:
  npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-007-root-admin-build-panel-adoption --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-007-root-admin-build-panel-adoption/story.md
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
  Frontend delivery depends on S-006 protected APIs, S-008 evidence placement, and signed-off design-system adoption source.

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-004 | feature-public-seam | DEV:frontend | T-S007-01, T-S007-02 | covered | Frontend tasks are defined but blocked until protected APIs and evidence placement exist. |
| TS-CHAT-009 | feature-public-seam | EVIDENCE:qa-evidence | T-S007-01, T-S007-02 | covered | Browser evidence routes to S-008 after implementation. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-007 | DEV:frontend | Frontend adoption | T-S007-01, T-S007-02 | Frontend tasks are defined but delivery handoff remains blocked by backend/evidence dependencies. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-007 | ready-for-task-breakdown | user-value | DEV:frontend | Root-admin Build panel adoption | This is its own story because the root builder needs one clear place to use Build while still understanding that Reporting and Support are not active yet. | root builder | Split DS seam adoption from context-not-authority rendering; both remain blocked until API/runtime dependencies exist. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | S-007 | Root-admin app adoption consumes signed-off design-system seams for panel, mobile action, chat flow, starter prompts, history, inactive actions, and PDF action. | rendered-browser | browser; visual; accessibility; responsive | design-system adoption; frontend evidence |
| AC-S007-02 | S-007 | Page/module/role starter context is displayed as helpful context and never becomes authority for scope or download permission. | runtime-api | browser; security; URL replay | API contract; permission mapping; browser tests |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-007 | AC-S007-01 | chatInterface.rootAdminPanelAdoption | root-admin frontend | create-or-refresh-required | design-system adoption; frontend evidence |
| S-007 | AC-S007-02 | chatInterface.contextIsNotAuthority | security | create-or-refresh-required | API contract; permission mapping; browser tests |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | S-007 | DEV:frontend | Adopt the signed-off design-system Build panel in root admin without app-local CSS, copied markup, or copied controller behavior. | src/frontend/rootAdminShell/**; tests/visual/app/rootAdminShell/**; tests/visual/rootAdmin/**; tests/integration/rootAdmin/**; docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md | app-page CSS, copied DS markup, copied controller behavior, API implementation, evidence-only screenshots | T-S006-03; T-S008-01 | build-work-panel design-system render/controller/style/accessibility seams | queued-for-delivery |
| T-S007-02 | S-007 | DEV:frontend | Display page/module/role starter context as helpful context only, never authority for scope or download permission. | src/frontend/rootAdminShell/**; tests/visual/app/rootAdminShell/**; tests/visual/rootAdmin/**; tests/security/rootAdmin/** | API permission changes, backend implementation, URL authority, tenant activation, evidence-only screenshots | T-S007-01; T-S006-03 | protected chat API and permission mapping | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | single-behavior | 1 | One AC covers governed root-admin app adoption. | Root-admin consumes signed-off design-system seams. | root-admin module journey files | Browser proof shows DS adoption without local reconstruction. | no context-authority behavior | Context authority split to T-S007-02. |
| T-S007-02 | single-behavior | 1 | One AC covers context display security behavior. | Helpful context renders without granting authority. | root-admin module journey files | Browser/security proof shows context does not authorize API or download access. | no DS adoption behavior | DS adoption split to T-S007-01. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S007-01 | design-system-seam-gap | Stop if signed-off render/controller/accessibility/style seams are missing or cannot be consumed without app-page CSS. | Return to design-system owner. | no | Governed app UI must not copy DS internals. |
| T-S007-02 | proof-gap | Stop if API contract, permission mapping, or denied-state proof source is missing. | Return to S-006 or S-008 owner; route API/OpenAPI/Postman updates to DOC:api-contract and feature dependency graph maintenance to GOV:architecture-update. | no | Frontend must not infer authority from UI context. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S007-01 | docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md; docs/workspace/design-system/patterns/build-work-panel-pattern.md; src/frontend/rootAdminShell/** | conversationPanel render/controller/style seam; build-work-panel configured family | S-007 story; S-002 task packet; frontend guardrail |
| T-S007-02 | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md; src/frontend/rootAdminShell/** | protected chat API contract and permission mapping | S-007 story; S-006 task packet; frontend guardrail |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | Root-admin Build panel adoption | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | app-shell | app-adoption | ui-state | none | root-admin shell work panel | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | ui-local | DS-owned-shell-required | signed-off-seam-exists | shell-registry-update | shell-bootstrap | ready | Root-admin app adoption consumes the signed-off Build work panel seam and protected API handlers. |
| T-S007-02 | Page/module/role starter context display | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | app-shell | journey | ui-state | none | root-admin Build panel state | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | ui-local | DS-owned-shell-required | signed-off-seam-exists | shell-registry-update | shell-bootstrap | ready | Context renders through the signed-off Build panel seam as helpful prompt data only; protected API proof exists for Layer 5 delivery. |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |
| T-S007-01 | app-adoption | Frontend Adoption Contract, Design-System Seam Contract, no app-page CSS, no copied behavior | Browser proof with protected API mock payloads after T-S006-03; served asset proof routes to EVIDENCE:qa-evidence S-008 | Evidence-only screenshots route to EVIDENCE:qa-evidence; API changes route to DEV:backend S-006. |
| T-S007-02 | permission-rendering | Permission rendering evidence, runtime data and mock-honesty contract, API contract | Browser/security proof for allowed, denied, expired, and cross-scope states after T-S006-03 | Evidence-only screenshots route to EVIDENCE:qa-evidence; permission changes route to DOC:permission-mapping. |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S007-01 | visual-rendering | accessibility-semantics; interaction-behavior | Inseparable app adoption requires render, behavior, and accessibility seams together while preserving DS ownership. | Browser/canonical screenshot evidence artifact proves signed-off DS adoption without copied markup or app-page CSS. |
| T-S007-02 | fixture-data-contract | permission-rendering proof | Inseparable because context display must be tied to API/permission contract data shape. | Contract/fixture/live/runtime payload proof shows page/module/role context is display-only and no URL authority exists. |

## Frontend Performance Posture

| Task ID | Performance Posture | Evidence / Proof Plan | Rationale |
| --- | --- | --- | --- |
| T-S007-01 | interactive-low-risk | Interaction proof must show no repeated fetch loop or repeated rendering work while opening the Build panel and switching inactive actions. | Root-admin panel is interactive but bounded by signed-off DS seam. |
| T-S007-02 | static-low-risk | Render proof is sufficient for display-only context plus denied-state checks; no new animation or large list behavior. | Context display is small static metadata and cannot own route authority. |

## Design-System Seam Contract

| Task ID | Seam Posture | Seam Name / Export / Route | Owned Render Structure | Owned Behavior Controller | Owned Accessibility Semantics | Canonical / Behavior Lock / Evidence | Frontend Consumption Contract |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | consumes-existing-seam | build-work-panel family consuming conversationPanel.mjs render/controller and conversationPanel.css style seam | DS owns panel/chat render structure | DS owns panel/chat controller behavior | DS owns roles, labels, state semantics, focus behavior | build-work-panel behavior lock, reference pack, pattern, verification checklist, adoption contract | Root-admin may compose data and invoke seams; it must not copy markup, controller, ARIA, or CSS. |
| T-S007-02 | consumes-existing-seam | build-work-panel context/starter render/controller seam | DS owns context/starter render structure | DS owns context/starter interaction behavior | DS owns roles, labels, state semantics, focus behavior | build-work-panel behavior lock and adoption contract | Root-admin may bind page/module/role context as display data only; authority stays server-side. |

## Design-System Seam Class Contract

| Task ID | Design-System Seam Class | Class-Specific Required Proof | Downstream Consumption Boundary | Forbidden App / Evidence / Standards Work |
| --- | --- | --- | --- | --- |

## Frontend Adoption Contract

| Task ID | Consumed DS Render Seam | Consumed DS Behavior / Controller Seam | Consumed DS Accessibility Semantics | Consumed DS Style / CSS Seam | Allowed App-Local Composition / Data Binding | Forbidden Local Reconstruction | Adoption Proof Route / Scenario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | conversationPanel.mjs / build-work-panel render seam | conversationPanel.mjs controller seam | DS-owned roles, names, states, focus, inactive action semantics | conversationPanel.css and build-work-panel governed CSS seam | Bind authenticated root-builder data, API payloads, starter context, history, and PDF action state | Explicitly prohibit copied markup, copied controller behavior, copied ARIA/state semantics, and app-page CSS. | Root-admin Build panel browser scenario after protected APIs exist. |
| T-S007-02 | build-work-panel context/starter render seam | build-work-panel context behavior seam | DS-owned context labels, state, and focus semantics | governed build-work-panel CSS seam | Bind page/module/role context as display data only | Explicitly prohibit copied markup, copied controller behavior, copied ARIA/state semantics, and app-page CSS. | Root-admin context-not-authority browser/security scenario. |

## Frontend Security Evidence

| Task ID | Security Area | Source Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Layer 4 Evidence Plan / Blocking Reason |
| --- | --- | --- | --- | --- | --- |
| T-S007-01 | session-cookie | yes | Root-admin browser calls must use existing authenticated session posture. | Frontend tasks must require allowed and denied browser proof. | protected API handler proof uses root-admin browser session context |
| T-S007-01 | csp-assets | yes | Chat UI and PDF download affordance must use approved served assets and design-system entrypoints. | Frontend tasks must consume DS assets without app-local CSS. | browser proof checks shared conversationPanel stylesheet and render seam |
| T-S007-01 | csrf-mutation | yes | Browser-triggered chat actions are protected mutations. | Frontend tasks must consume protected APIs; backend owns CSRF proof. | root-admin app consumes protected harness-chat APIs; backend CSRF proof remains with S-006/S-008 evidence |
| T-S007-01 | url-replay-state | yes | Page/module/role context must not become authority or serialize sensitive replay state into URLs. | Frontend tasks must display context as helpful data only. | context is sent as display/prompt context only; explicit context rendering proof remains T-S007-02 |
| T-S007-01 | sensitive-rendering | yes | Chat transcripts and packets may include platform or tenant change intent. | Frontend tasks must require denied/unauthorized/expired proof. | denied/expired evidence remains routed to EVIDENCE:qa-evidence S-008 |
| T-S007-01 | asset-delivery | yes | PDF download action needs approved generated-document delivery posture. | Frontend tasks must consume authorized download API only. | browser proof exercises authorized packet PDF route only |
| T-S007-02 | session-cookie | yes | Root-admin browser calls must use existing authenticated session posture. | Frontend tasks must require allowed and denied browser proof. | allowed browser proof runs under root-admin browser session context; denied/expired evidence remains routed to EVIDENCE:qa-evidence S-008 |
| T-S007-02 | csp-assets | yes | Chat UI and PDF download affordance must use approved served assets and design-system entrypoints. | Frontend tasks must consume DS assets without app-local CSS. | browser proof uses shared conversationPanel assets and adds no app-local CSS |
| T-S007-02 | csrf-mutation | yes | Browser-triggered chat actions are protected mutations. | Frontend tasks must consume protected APIs; backend owns CSRF proof. | browser proof exercises protected conversation and packet-generation API calls; backend CSRF proof remains with S-006/S-008 evidence |
| T-S007-02 | url-replay-state | yes | Page/module/role context must not become authority or serialize sensitive replay state into URLs. | Frontend tasks must display context as helpful data only. | browser proof mutates query/hash with tenant-like values and verifies only pathname/page context reaches protected API |
| T-S007-02 | sensitive-rendering | yes | Chat transcripts and packets may include platform or tenant change intent. | Frontend tasks must require denied/unauthorized/expired proof. | allowed browser proof verifies context is prompt data only; denied/unauthorized/expired evidence remains routed to EVIDENCE:qa-evidence S-008 |
| T-S007-02 | asset-delivery | yes | PDF download action needs approved generated-document delivery posture. | Frontend tasks must consume authorized download API only. | browser proof verifies PDF fetch uses only the authorized packet-revision route and does not include URL replay parameters |

## Frontend Permission Rendering Evidence

| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |
| --- | --- | --- | --- | --- | --- |
| T-S007-01 | Build panel, history, inactive actions, PDF action | root-builder allowed browser scenario | unauthorized root user denied state | unauthenticated/expired session state | future tenant and cross-scope denied state |
| T-S007-02 | page/module/role context and PDF action | allowed root-builder browser proof shows context as display data | unauthorized user cannot gain scope from context | unauthenticated/expired session cannot use context | tenant/cross-tenant denial context cannot authorize access |

## Frontend Runtime Data And Mock Honesty

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |
| T-S007-01 | docs/api-contracts/chat-interface-layer-one-discovery.md | journey inventory fixtures, DS reference data, and protected harness-chat API payload mocks | Playwright route mocks match protected conversation, packet generation, and PDF download contract shape | not-applicable: protected backend APIs exist | Mock-honesty: mocks must match API contract and may not invent successful history/PDF fallback behavior. |
| T-S007-02 | docs/api-contracts/chat-interface-layer-one-discovery.md and permission mapping | Playwright route mocks plus static root-admin source guard | captured protected conversation POST includes display-only surface context; captured PDF GET uses packet-revision route without URL replay parameters | not-applicable: protected backend APIs exist | Mock-honesty: mocks record request bodies/URLs and must not treat page context, query params, hash params, tenant-like values, or role-like values as authority. |

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
| T-S007-01 | narrow-pattern | src/frontend/rootAdminShell/**; tests/visual/app/rootAdminShell/**; tests/visual/rootAdmin/**; tests/integration/rootAdmin/**; docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md | Frontend adoption envelope; no app-page CSS allowed. |
| T-S007-02 | narrow-pattern | src/frontend/rootAdminShell/**; tests/visual/app/rootAdminShell/**; tests/visual/rootAdmin/**; tests/security/rootAdmin/** | Frontend security-rendering envelope; no backend or permission mapping changes. |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Focused Proof Command Or Evidence | Mock-Honesty Note |
| --- | --- | --- | --- |
| T-S007-01 | task-specific | npx playwright test tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts --grep "root-admin Build panel" | Mocks must match API contract and DS canonical truth. |
| T-S007-02 | task-specific | npx playwright test tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts --grep=root-admin.*context; npx vitest run tests/security/rootAdmin/buildPanelContextAuthority.test.ts; npm run check:feature-dependencies | Mocks record protected API request bodies/URLs and static source proof prevents URL/query/hash/tenant/authorization authority. |

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

## Capability Permission / State Matrix

| Task ID | Capability / Permission | Allowed Actor / State | Denied Actor / State | Object / Lifecycle States | Required Proof |
| --- | --- | --- | --- | --- | --- |
| T-S007-02 | chatInterface.contextIsNotAuthority | authenticated root builder sees context as helpful data | unauthenticated, unauthorized, future tenant, cross-scope, URL replay attempts | page/module/role context, conversation, packet revision, PDF action | Browser/security proof after backend APIs exist. |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Required Escalation |
| --- | --- | --- |
| T-S007-01 | Do not add app-page CSS or copy DS markup/controller/ARIA/state behavior into root admin. | Return to design-system owner. |
| T-S007-02 | Do not treat page/module/role context, URL state, or fixture data as authority. | Return to API/permission owner. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Guardrail Reference | Approval Status | Notes |
| --- | --- | --- | --- | --- |
| T-S007-01 | DEV:frontend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/frontend-task-guardrail.md | approved | Frontend guardrail reviewed; delivery remains blocked until protected APIs/evidence placement exist. |
| T-S007-02 | DEV:frontend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/frontend-task-guardrail.md | approved | Frontend guardrail reviewed; delivery remains blocked until protected APIs and T-S007-01 exist. |

## Task Guardrail Evidence

| Task ID | Check ID | Status | Evidence / Rationale |
| --- | --- | --- | --- |
| T-S007-01 | frontend-architecture-classification | pass | Source architecture row copied from S-007. |
| T-S007-01 | frontend-change-class | pass | app-adoption class selected. |
| T-S007-01 | frontend-source-placement | pass | shell-bootstrap source placement named. |
| T-S007-01 | frontend-state-owner | pass | ui-local state owner copied. |
| T-S007-01 | frontend-route-topology | pass | root-admin route family and non-topology UI state named. |
| T-S007-01 | frontend-design-system-seam | pass | consumes existing build-work-panel/conversationPanel seams. |
| T-S007-01 | frontend-adoption-contract | pass | adoption contract row included. |
| T-S007-01 | frontend-no-app-css | pass | app-page CSS prohibited. |
| T-S007-01 | frontend-no-copied-behavior | pass | copied markup/controller/ARIA/CSS prohibited. |
| T-S007-01 | frontend-accessibility-state | pass | DS accessibility semantics consumed. |
| T-S007-01 | frontend-rendered-proof | pass | browser proof required after unblock. |
| T-S007-01 | frontend-security-evidence | pass | security evidence rows included. |
| T-S007-01 | frontend-permission-rendering | pass | allowed/denied proof named. |
| T-S007-01 | frontend-runtime-data-mock-honesty | pass | runtime/mock-honesty row included. |
| T-S007-01 | frontend-runtime-evidence | pass | evidence routed to S-008 after implementation. |
| T-S007-01 | frontend-artifacts | pass | DS adoption and browser evidence obligations named. |
| T-S007-02 | frontend-architecture-classification | pass | Source architecture row copied from S-007. |
| T-S007-02 | frontend-change-class | pass | permission-rendering class selected. |
| T-S007-02 | frontend-source-placement | pass | module-journey-files source placement named. |
| T-S007-02 | frontend-state-owner | pass | feature-local-state-machine state owner copied. |
| T-S007-02 | frontend-route-topology | pass | root-admin route family and UI state named. |
| T-S007-02 | frontend-design-system-seam | pass | consumes existing context/starter seams. |
| T-S007-02 | frontend-adoption-contract | pass | adoption contract row included. |
| T-S007-02 | frontend-no-app-css | pass | app-page CSS prohibited. |
| T-S007-02 | frontend-no-copied-behavior | pass | copied markup/controller/ARIA/CSS prohibited. |
| T-S007-02 | frontend-accessibility-state | pass | DS accessibility semantics consumed. |
| T-S007-02 | frontend-rendered-proof | pass | browser/security proof required after unblock. |
| T-S007-02 | frontend-security-evidence | pass | URL replay and asset delivery evidence rows included. |
| T-S007-02 | frontend-permission-rendering | pass | context-not-authority proof named. |
| T-S007-02 | frontend-runtime-data-mock-honesty | pass | runtime/mock-honesty row included. |
| T-S007-02 | frontend-runtime-evidence | pass | evidence routed to S-008 after implementation. |
| T-S007-02 | frontend-artifacts | pass | browser/security evidence obligations named. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Shared-Code Guardrail Required | Compatibility / Move Notes | Review Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | feature-local | root-admin module files | root-admin module files consuming DS seams | no | not-applicable | No shared extraction; consume DS seams. | approved |
| T-S007-02 | feature-local | root-admin module files | root-admin module files consuming API/permission seams | no | not-applicable | No shared extraction; consume server authority. | approved |

## Allowed Write Set Classification

| Task ID | Path | Write Class | Reason |
| --- | --- | --- | --- |
| T-S007-01 | src/frontend/rootAdminShell/** | feature-local | Root-admin module adoption only; no app-page CSS. |
| T-S007-01 | tests/visual/app/rootAdminShell/**; tests/visual/rootAdmin/**; tests/integration/rootAdmin/** | test | Browser/adoption proof. |
| T-S007-02 | src/frontend/rootAdminShell/** | feature-local | Root-admin context display only; no backend changes. |
| T-S007-02 | tests/visual/app/rootAdminShell/**; tests/visual/rootAdmin/**; tests/security/rootAdmin/** | test | Browser/security proof. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S007-01 | app-page CSS, copied DS markup/controller/ARIA/state behavior, API implementation, evidence-only screenshots | Preserve governed DS adoption. |
| T-S007-02 | backend authz changes, permission mapping changes, tenant activation, URL authority, evidence-only screenshots | Preserve server-side authority; route backend API artifact work to DOC:api-contract. |

## Task Acceptance Criteria Coverage

| Task ID | AC ID | Coverage Notes |
| --- | --- | --- |
| T-S007-01 | AC-S007-01 | Covers root-admin DS adoption. |
| T-S007-02 | AC-S007-02 | Covers context-not-authority behavior. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) | Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S007-01 | chatInterface.rootAdminPanelAdoption | approved | Handoff is unblocked by protected backend APIs and evidence placement. |
| T-S007-02 | chatInterface.contextIsNotAuthority | approved | Handoff remains blocked until dependencies complete. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S007-01 | not-applicable: external S-006 and S-008 implementation dependencies | Frontend adoption needs protected APIs and evidence placement. | yes |
| T-S007-02 | T-S007-01 | Context security proof depends on root-admin adoption surface. | yes |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S007-01 | build-work-panel/conversationPanel DS seams | design-system-seam | existing | Consume adoption contract, render/controller/style/accessibility seams. |
| T-S007-02 | protected chat API and permission mapping | feature-public-seam | existing/planned | Consume S-006 contract and permission source truth. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S007-01 | design-system adoption contract and browser evidence | prove-current/create-after-implementation | frontend implementation / EVIDENCE:qa-evidence | yes |
| T-S007-02 | API contract, permission mapping, browser/security evidence | prove-current/create-after-implementation | frontend implementation / EVIDENCE:qa-evidence | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S007-01 | rendered-browser; visual; accessibility; responsive | npx playwright test tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts --grep "root-admin Build panel" | Mock data must match API contract and DS canonical truth. |
| T-S007-02 | runtime-api; browser; security; URL replay | npx playwright test tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts --grep=root-admin.*context; npx vitest run tests/security/rootAdmin/buildPanelContextAuthority.test.ts; npm run check:feature-dependencies | Mock data proves context is display-only by capturing protected API request bodies and rejecting URL replay values as authority. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |

## Branch Worktree Bootstrap Strategy

| Task ID | Suggested Branch | Worktree Strategy | Bootstrap Source | Base Ref | Pre-Edit Check | Promote Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | codex/s007-root-admin-ds-adoption | dedicated task branch after backend | story-local task packet | origin/main | confirm T-S006-03 and T-S008-01 complete | main after promote guardrail |
| T-S007-02 | codex/s007-context-not-authority | dedicated task branch after T-S007-01 | story-local task packet | origin/main | confirm T-S007-01 and T-S006-03 complete | main after promote guardrail |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |
| BLK-S007-01 | T-S007-01 | dependency | T-S006-03; T-S008-01 | Frontend adoption needs protected APIs and proof placement. | resolved: protected APIs and proof placement are available for app adoption. |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S007-01 | queued-for-delivery | none | Root-admin app adoption may consume the signed-off seam and protected API handlers; broader evidence remains routed to S-008. |
| T-S007-02 | queued-for-delivery | none | Context rendering may proceed through the signed-off Build panel seam with page context treated as prompt data only; broader denied-state evidence remains routed to S-008. |
