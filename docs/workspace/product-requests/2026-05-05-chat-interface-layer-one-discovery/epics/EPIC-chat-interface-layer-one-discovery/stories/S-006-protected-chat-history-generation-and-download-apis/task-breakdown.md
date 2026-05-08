# Task Breakdown Packet: Chat Interface S-006 Protected Chat History Generation And Download APIs

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-07
- Task Breakdown ID:
  `TBD-CHAT-S006`
- Source Story Breakdown packet:
  docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-006-protected-chat-history-generation-and-download-apis/story.md
- Selected Story ID(s):
  S-006
- Related Product Discovery packet:
  docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md
- Related Technical Steering packet:
  docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md
- Related PRD:
  docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md
- Related capability matrix:
  docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv
- Validation command:
  npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-006-protected-chat-history-generation-and-download-apis --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-006-protected-chat-history-generation-and-download-apis/story.md
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
  Backend implementation depends on S-004 adapter, S-005 persistence, API contract, and permission mapping.

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-005 | feature-public-seam | DOC:api-contract | T-S006-01 | covered | Protected route family contract truth is owned by the API contract task. |
| TS-CHAT-006 | feature-local | DOC:permission-mapping | T-S006-02 | covered | Root-builder/future tenant authority is owned by the permission mapping task. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-006 | DOC:api-contract | API contract | T-S006-01 | Protected route contract truth is queued before backend implementation. |
| S-006 | DOC:permission-mapping | Permission mapping | T-S006-02 | Permission truth is queued before backend implementation. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-006 | ready-for-task-breakdown | system-value | DEV:backend | Protected chat, history, generation, and download APIs | This is its own story because starting chats, returning to history, generating packets, and downloading files are separate things people expect to work reliably. | root-admin API consumer | Split API contract and permission mapping as queued source-truth tasks; keep backend implementation blocked until those and persistence exist. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S006-01 | S-006 | API contracts define create/read/history/generate/download behavior, exact route params, ISO timestamps, normalized validation, and rejection of system-managed client fields. | contract-level | API contract; validation | API contract docs; OpenAPI/Postman if maintained |
| AC-S006-02 | S-006 | Permission mapping proves creator history access, root-builder review access, unauthenticated denial, unauthorized denial, and tenant cross-scope denial. | runtime-api | authz allow/deny; tenant boundary | permission mapping; test cases |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-006 | AC-S006-01 | chatInterface.rootAdminApiContracts | API | prove-current | API contract docs; OpenAPI/Postman if maintained |
| S-006 | AC-S006-02 | chatInterface.enforceDiscoveryChatAccess | authz | prove-current | permission mapping; test cases |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-01 | S-006 | DOC:api-contract | Refresh protected Build chat API contract for conversation create, append, history, generation, revision listing, and PDF download behavior. | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | backend implementation, permission mapping, migrations, UI, executable tests | not-applicable: consumes external S-004/S-005 source plans and existing API contract | not-applicable: documentation artifact | queued-for-delivery |
| T-S006-02 | S-006 | DOC:permission-mapping | Refresh Build chat permission mapping for root-builder access, unauthenticated/unauthorized denial, tenant-scope denial, download authority, and audit proof. | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md; docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv; docs/api-contracts/chat-interface-layer-one-discovery.md | runtime authz implementation, grant migrations, UI eligibility changes, API shape changes | T-S006-01 contract source; Technical Steering TS-CHAT-006 | not-applicable: documentation artifact | queued-for-delivery |
| T-S006-03 | S-006 | DEV:backend | Implement protected route behavior for create/read/history/generate/download after persistence, API contract, and permission mapping source truth is complete. | src/features/harnessChat/**; src/routes/v1/**; tests/integration/harnessChat/**; tests/security/harnessChat/**; docs/architecture/generated/feature-dependency-graph.* | API contract authoring, permission mapping authoring, migrations, root-admin UI, PDF renderer design, evidence sweep | T-S006-01; T-S006-02 | feature-public transport seam | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-01 | single-proof-target | 1 | One AC covers API contract truth. | Protected chat API contract is current and compatibility posture is explicit. | docs/api-contracts | Contract review passes. | no runtime code | Route family kept together because the Build chat workflow contract is inseparable across create/read/history/generate/download. |
| T-S006-02 | single-proof-target | 1 | One AC covers permission mapping truth. | Allow/deny and audit/proof posture are current. | permission mapping | Permission review passes. | no runtime code | Permission family kept together because the allow/deny matrix is inseparable across protected Build chat actions. |
| T-S006-03 | single-behavior | 1 | Runtime API implementation is one backend seam and source truth is now available from dependencies. | Protected route behavior consumes approved contract, permission, and persistence. | harness-chat transport/domain | Focused backend/security proof after unblock. | no frontend/evidence sweep | Kept as one route-family task because create/read/history/generate/download share authz and lifecycle semantics. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S006-01 | source-truth-mismatch | Stop if route paths, request/response shape, status code, or compatibility posture is missing or contradictory. | Return to API contract owner or Technical Steering. | no | Contract task must not invent wire truth. |
| T-S006-02 | source-truth-mismatch | Stop if authority world, actor boundary, grant source, denial category, or tenant-scope posture is missing. | Return to permission mapping or Technical Steering owner. | no | Permission docs must not invent authorization policy. |
| T-S006-03 | proof-gap | Stop if external prerequisites S-004 adapter, S-005 persistence, T-S006-01, or T-S006-02 are incomplete or contradictory. | Route back to the blocked dependencies. | no | Runtime backend work must consume source truth. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S006-01 | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | existing API contract conventions | S-006 story; TS-CHAT-005; API contract guardrail |
| T-S006-02 | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md; docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv; docs/api-contracts/chat-interface-layer-one-discovery.md | existing permission mapping vocabulary | S-006 story; TS-CHAT-006; permission mapping guardrail |
| T-S006-03 | src/features/harnessChat/**; src/routes/v1/index.ts; docs/api-contracts/chat-interface-layer-one-discovery.md; docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md | S-004 adapter; S-005 persistence; feature router conventions | S-006 story; completed T-S006-01/T-S006-02 |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-01 | Protected chat API contract | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | feature-public-seam | not-topology | none | root-admin Build API calls | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | docs/api-contracts | Contract task only; no frontend implementation. |
| T-S006-02 | Protected chat permission mapping | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | feature-public-seam | not-topology | none | root-admin Build API calls | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | docs/architecture/permission-mappings | Permission task only; no frontend implementation. |
| T-S006-03 | Protected chat backend APIs | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | feature-public-seam | not-topology | none | root-admin Build API calls | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | src/features/harnessChat | Backend task; frontend adoption waits for S-007. |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S006-01 | not-applicable | not-applicable: DOC:api-contract task | no frontend work | not-applicable |
| T-S006-02 | not-applicable | not-applicable: DOC:permission-mapping task | no frontend work | not-applicable |
| T-S006-03 | not-applicable | not-applicable: DEV:backend task | no frontend work | not-applicable |

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

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Backend Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-03 | transport-route | S-006 story, completed API contract, completed permission mapping, S-005 persistence | src/features/harnessChat | service-composition-only | src/features/harnessChat/**; src/routes/v1/index.ts; tests/integration/harnessChat/**; tests/security/harnessChat/** | src/features/harnessChat/**; src/routes/v1/**; tests/integration/harnessChat/**; tests/security/harnessChat/**; docs/architecture/generated/feature-dependency-graph.* | contract, transport, domain, persistence consumers, integration, manifest if public seam changes | transport parses/validates/authorizes; domain owns lifecycle; persistence consumes S-005 repository; integration wires feature | approved API contract from T-S006-01; do not invent route shape | consume completed T-S006-02 root authority and tenant-deny mapping | not-applicable: no schema change; consumes S-005 repository | update manifest/graph only if public seam changes | API contract, permission mapping, feature manifest, generated dependency graph if affected | not-applicable: implementation is unblocked by completed source truth | Protected route behavior for conversation create/read/history/generate/download | Dependencies resolved; evidence routes to EVIDENCE:qa-evidence S-008 and closure sweeps route to DOC:api-contract, DOC:permission-mapping, DOC:data-dictionary, and GOV:architecture-update S-009. | npx vitest run tests/integration/harnessChat tests/security/harnessChat; npm run check:feature-dependencies | regenerate generated dependency graph only if manifest/dependency changes | Backend reviewer decides source-truth consumption and security proof sufficiency. |

## Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |

## Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S006-01 | exact-files | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | Exact API contract and traceability docs only. |
| T-S006-02 | exact-files | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md; docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv; docs/api-contracts/chat-interface-layer-one-discovery.md | Exact permission mapping and capability traceability docs only. |
| T-S006-03 | narrow-pattern | src/features/harnessChat/**; src/routes/v1/**; tests/integration/harnessChat/**; tests/security/harnessChat/**; docs/architecture/generated/feature-dependency-graph.* | Blocked backend implementation needs feature-local source, v1 route mount, focused tests, and generated graph only if manifest changes. |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Focused Proof Command Or Evidence | Mock-Honesty Note |
| --- | --- | --- | --- |
| T-S006-01 | task-specific | npm run product-request:validate -- --all; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-006-protected-chat-history-generation-and-download-apis --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-006-protected-chat-history-generation-and-download-apis/story.md | Contract docs must not invent runtime behavior not backed by source artifacts. |
| T-S006-02 | task-specific | npm run product-request:validate -- --all; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-006-protected-chat-history-generation-and-download-apis --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-006-protected-chat-history-generation-and-download-apis/story.md | Permission docs must not make blocked/future tenant authority selectable or runtime-enforced. |
| T-S006-03 | task-specific | npx vitest run tests/integration/harnessChat tests/security/harnessChat; npm run check:feature-dependencies | Runtime mocks must match API contract, permission mapping, and S-005 persistence shapes. |

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
| T-S006-02 | runtime-enforced-row | Technical Steering TS-CHAT-006; PRD; API contract; existing permission-mapping doc | chatInterface.enforceDiscoveryChatAccess over create/read/history/generate/download surfaces | root authority world; root-builder actor boundary; future tenant authority blocked until approved | runtime-enforced | current | current tenant object boundary is not-applicable for root-admin MVP; future tenant object boundary denied by default | allow authenticated root builder; deny unauthenticated, unauthorized, future tenant, and cross-scope attempts | root Build chat rows selectable only when runtime-enforced; future tenant rows blocked and not selectable | safe denial category plus audit/proof expectation for denied API and download attempts | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md; docs/api-contracts/chat-interface-layer-one-discovery.md; docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | no grant migration in this task; not-applicable unless grant changes split to DEV:migration-persistence | runtime enforcement to DEV:backend T-S006-03; API-visible changes to DOC:api-contract T-S006-01; grant migration changes to DEV:migration-persistence; executable proof to TEST:test-only or S-008 evidence | Permission reviewer confirms mapping posture and blocked future tenant authority. |

## API Contract

| Task ID | API Contract Class | Route Family | Contract Source / Authority | Methods / Paths | Params / Query / Body | Response / Status / Error Shape | Authn / Authz / Tenant Boundary | Validation / Pagination / Sorting / System Fields | Compatibility Posture | Maintained API Artifacts | Maintained Artifact Inventory | Split / Blocked Follow-Up | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-01 | additive-route-contract | chat-interface-layer-one-discovery | S-006 story; PRD; Technical Steering TS-CHAT-005; existing docs/api-contracts/chat-interface-layer-one-discovery.md | POST /v1/root-admin/harness-chat/conversations; POST /v1/root-admin/harness-chat/conversations/:conversationId/messages; GET /v1/root-admin/harness-chat/conversations; GET /v1/root-admin/harness-chat/conversations/:conversationId; POST /v1/root-admin/harness-chat/conversations/:conversationId/packet-generations; GET /v1/root-admin/harness-chat/conversations/:conversationId/packet-revisions; GET /v1/root-admin/harness-chat/packet-revisions/:packetRevisionId; GET /v1/root-admin/harness-chat/packet-revisions/:packetRevisionId/pdf | route params conversationId and packetRevisionId required; request body rejects system-managed fields; pagination uses repo defaults where listing applies | response shape includes conversation, message, history, packet revision, and PDF download result payloads; status/error posture covers created, ok, validation failure, unauthenticated, unauthorized, not found, conflict, and generation failure | session and CSRF required for browser mutations; root-builder authz; tenant boundary is denied by default until future tenant authority is approved; no tenant context comes from URL state | exact route params required; ISO timestamps; normalized inputs; default pagination/sorting where list endpoints apply; system-managed fields rejected | additive | docs-api-contract-only | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md | runtime handlers to DEV:backend T-S006-03; permission rows to DOC:permission-mapping T-S006-02; persistence or migration changes to DEV:migration-persistence S-005; evidence to S-008 | API reviewer confirms route wording and compatibility. | npm run product-request:validate -- --all; task-breakdown validation |

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
| T-S006-02 | chatInterface.* Build chat capabilities | authenticated root builder with approved root-admin MVP authority | unauthenticated, unauthorized root user, future tenant builder until activated, cross-scope request | conversation and packet lifecycle states from S-005 | permission mapping review and later security tests |
| T-S006-03 | chatInterface.protectedRuntimeApi | authenticated root builder with approved permission rows | unauthenticated, unauthorized, future tenant, cross-scope, missing/invalid object | conversation new/in-progress/generated/abandoned; packet generated/downloaded/failed/superseded | security/integration proof required |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Required Escalation |
| --- | --- | --- |
| T-S006-01 | Do not invent route paths, response fields, OpenAPI/Postman maintenance posture, or compatibility behavior. | Route to API contract owner or Technical Steering. |
| T-S006-02 | Do not treat future tenant-builder, relationship-based, ABAC, ReBAC, or UI eligibility as runtime-enforced without approved source truth. | Route to permission mapping or architecture owner. |
| T-S006-03 | Do not implement routes before contract, permission, adapter, and persistence source truth is complete. | Keep task blocked. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Guardrail Reference | Approval Status | Notes |
| --- | --- | --- | --- | --- |
| T-S006-01 | DOC:api-contract | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/api-contract-task-guardrail.md | approved | API contract guardrail reviewed for route family, request/response, authz, compatibility, maintained artifact inventory, split routing, and validation. |
| T-S006-02 | DOC:permission-mapping | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/permission-mapping-task-guardrail.md | approved | Permission mapping guardrail reviewed for authz model source, capability rows, boundary, grant/UI posture, denial/audit, allow/deny proof, split routing, and grant migration boundaries. |
| T-S006-03 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Backend guardrail reviewed; delivery handoff is unblocked by completed source truth. |

## Task Guardrail Evidence

| Task ID | Check ID | Status | Evidence / Rationale |
| --- | --- | --- | --- |
| T-S006-01 | api-route-family | pass | Route family is chat-interface-layer-one-discovery. |
| T-S006-01 | api-contract-class | pass | Class is additive-route-contract for MVP protected routes. |
| T-S006-01 | api-contract-source | pass | Source is S-006, PRD, Technical Steering, and existing API contract. |
| T-S006-01 | api-request-response | pass | Task requires request/response/status/error shape review. |
| T-S006-01 | api-authz-validation | pass | Session, CSRF, authz, exact params, and validation must be documented. |
| T-S006-01 | api-compatibility | pass | Additive posture required; compatibility-sensitive changes block. |
| T-S006-01 | api-maintained-artifact-inventory | pass | OpenAPI/Postman/generated docs must be inventoried or marked not-maintained. |
| T-S006-01 | api-maintained-artifacts | pass | Human-readable API contract and stale traceability rows are exact targets. |
| T-S006-01 | api-split-routing | pass | Runtime, permission, persistence, frontend, and evidence work are split. |
| T-S006-01 | api-validation-command | pass | Product Request and task-breakdown validation named. |
| T-S006-02 | permission-authz-model-source | pass | Technical Steering, PRD, API contract, and existing mapping are source authority. |
| T-S006-02 | permission-mapping-class | pass | Runtime-enforced root rows and blocked/documentation-only future tenant rows are required. |
| T-S006-02 | permission-capability-rows | pass | Build chat capability rows are named. |
| T-S006-02 | permission-boundary | pass | Root authority, future tenant deferral, and cross-scope denial are named. |
| T-S006-02 | permission-grant-source-ui | pass | Grant source and UI eligibility must remain explicit. |
| T-S006-02 | permission-mapping-row-posture | pass | Current, blocked, and architecture-target posture is required. |
| T-S006-02 | permission-denial-audit | pass | Safe denial category and audit/proof expectation required. |
| T-S006-02 | permission-allow-deny | pass | Allowed and denied actor states are named. |
| T-S006-02 | permission-evidence-inventory | pass | Mapping, API contract, capability matrix, PRD tests, and journey inventory are named. |
| T-S006-02 | permission-grants-migration | pass | No grant migration in this task; split if grants change. |
| T-S006-02 | permission-split-routing | pass | Runtime enforcement, frontend, and evidence are split. |
| T-S006-02 | permission-authz-proof | pass | Review and later security proof are named. |
| T-S006-03 | backend-source-authority | pass | Backend source authority consumes completed API, permission, adapter, and persistence tasks. |
| T-S006-03 | backend-change-class | pass | Change class is transport-route. |
| T-S006-03 | backend-owning-feature | pass | Owner is harnessChat. |
| T-S006-03 | backend-source-inventory | pass | Feature, route, contract, permission, and tests are inventoried. |
| T-S006-03 | backend-exact-write-envelope | pass | Narrow feature, route, focused tests, and generated graph paths are named. |
| T-S006-03 | backend-layer-responsibilities | pass | Transport/domain/persistence/integration responsibilities are named. |
| T-S006-03 | backend-cross-feature-seams | pass | Consumes S-004 adapter and S-005 persistence; no direct persistence imports across features. |
| T-S006-03 | backend-authz-tenant-lifecycle | pass | Root-builder, unauthenticated, unauthorized, future tenant, and cross-scope posture required. |
| T-S006-03 | backend-api-contract-boundary | pass | Consumes completed T-S006-01 contract source truth. |
| T-S006-03 | backend-persistence-migration-boundary | pass | Consumes S-005; no migration in backend task. |
| T-S006-03 | backend-scripted-scaffold-posture | pass | No scaffold command required before unblock. |
| T-S006-03 | backend-artifact-obligations | pass | Manifest/graph only if public seam changes; closure to S-009. |
| T-S006-03 | backend-expected-output | pass | Protected route behavior target is named. |
| T-S006-03 | backend-split-routing | pass | Contract, permission, persistence, frontend, evidence, and closure are split. |
| T-S006-03 | backend-proof-commands | pass | Focused integration/security proof named for after unblock. |
| T-S006-03 | backend-human-review-boundary | pass | Backend reviewer boundary named. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Shared-Code Guardrail Required | Compatibility / Move Notes | Review Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-01 | feature-local | API contract docs | API contract docs | no | not-applicable | Documentation-only; no shared extraction. | approved |
| T-S006-02 | feature-local | permission mapping docs | permission mapping docs | no | not-applicable | Documentation-only; no shared extraction. | approved |
| T-S006-03 | feature-local | harnessChat | harnessChat | no | not-applicable | Feature-owned backend route behavior; shared extraction deferred until another consumer. | approved |

## Allowed Write Set Classification

| Task ID | Path | Write Class | Reason |
| --- | --- | --- | --- |
| T-S006-01 | docs/api-contracts/chat-interface-layer-one-discovery.md | docs-artifact | API contract truth. |
| T-S006-01 | docs/prd/** | docs-artifact | Traceability updates only when stale. |
| T-S006-02 | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md | docs-artifact | Permission source truth. |
| T-S006-02 | docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv | docs-artifact | Capability traceability if stale. |
| T-S006-03 | src/features/harnessChat/**; src/routes/v1/** | feature-local | Backend route behavior after unblock. |
| T-S006-03 | tests/integration/harnessChat/**; tests/security/harnessChat/** | test | Focused route/security proof. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S006-01 | Runtime route handlers, permission mapping, migrations, UI, executable tests | Keep contract task source-independent. |
| T-S006-02 | Runtime authz, grant migrations, UI eligibility changes, API shape invention | Keep mapping task source-independent. |
| T-S006-03 | Contract authoring, permission authoring, migrations, frontend, evidence sweep | Keep backend task dependency-gated and narrow. |

## Task Acceptance Criteria Coverage

| Task ID | AC ID | Coverage Notes |
| --- | --- | --- |
| T-S006-01 | AC-S006-01 | Covers API contract truth. |
| T-S006-02 | AC-S006-02 | Covers permission mapping truth. |
| T-S006-03 | AC-S006-02 | Covers runtime backend enforcement after dependencies complete. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) | Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S006-01 | chatInterface.rootAdminApiContracts | approved | Contract coverage queued. |
| T-S006-02 | chatInterface.enforceDiscoveryChatAccess | approved | Permission coverage queued. |
| T-S006-03 | chatInterface.enforceDiscoveryChatAccess | approved | Handoff is unblocked by completed dependencies. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S006-01 | not-applicable: external S-004 and S-005 source plans | API contract consumes adapter and persistence planned seams. | no |
| T-S006-02 | T-S006-01 | Permission mapping needs API-visible denial and route family source. | no |
| T-S006-03 | T-S006-01; T-S006-02 | Runtime backend behavior also consumes external completed S-004 adapter and S-005 persistence source truth. | yes |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S006-01 | not-applicable: docs artifact | not-applicable | not-applicable | API contract owns route truth. |
| T-S006-02 | not-applicable: docs artifact | not-applicable | not-applicable | Permission mapping owns authz truth. |
| T-S006-03 | harnessChat public transport seam | feature-public-seam | new | Feature manifest and generated dependency graph updated if public seam changes. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S006-01 | API contract | prove-current | api-contract-maintainer | yes |
| T-S006-02 | permission mapping | prove-current | permission mapping workflow | yes |
| T-S006-03 | feature manifest and generated dependency graph if public seam changes | update-if-affected | backend implementation / architecture generated artifacts | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S006-01 | contract-level | npm run product-request:validate -- --all; task-breakdown validation | Contract must not claim runtime proof. |
| T-S006-02 | permission-level | npm run product-request:validate -- --all; task-breakdown validation | Mapping must not claim runtime enforcement for blocked rows. |
| T-S006-03 | integration; security | npx vitest run tests/integration/harnessChat tests/security/harnessChat; npm run check:feature-dependencies | Runtime fixtures must match contract, permission, and persistence shapes. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-01 | not-applicable: contract task | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | evidence capture split to S-008 | contract reviewer |
| T-S006-02 | not-applicable: permission task | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | evidence capture split to S-008 | permission reviewer |
| T-S006-03 | runtime evidence | API contract, permission mapping, persistence rows, route tests | integration/security tests | required after implementation | required after implementation | route/security proof and later S-008 evidence | backend proof available; broader evidence split to S-008 | backend/security reviewer |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |

## Branch Worktree Bootstrap Strategy

| Task ID | Suggested Branch | Worktree Strategy | Bootstrap Source | Base Ref | Pre-Edit Check | Promote Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S006-01 | codex/s006-api-contract | dedicated task branch | story-local task packet | origin/main | inspect API contract and PRD traceability | main after promote guardrail |
| T-S006-02 | codex/s006-permission-mapping | dedicated task branch | story-local task packet | origin/main | inspect permission mapping and capability matrix | main after promote guardrail |
| T-S006-03 | codex/s006-protected-backend-apis | dedicated task branch after dependencies | story-local task packet | origin/main | confirm dependencies complete | main after promote guardrail |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |
| BLK-S006-01 | T-S006-03 | dependency | T-S004-01; T-S005-01; T-S005-02; T-S006-01; T-S006-02 | Runtime route behavior must consume adapter, persistence, API, and permission truth. | resolved: dependencies completed before queueing backend. |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S006-01 | queued-for-delivery | none | API contract task can run after S-005 packet backfill. |
| T-S006-02 | queued-for-delivery | none | Permission mapping task can run with API contract source inventory. |
| T-S006-03 | queued-for-delivery | none | Backend implementation may run against completed source-truth and persistence dependencies; broader runtime evidence remains split to S-008. |
