# Task Breakdown Packet: Chat Interface S-009 Data Permissions API And Feature Manifest Artifact Sweep

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-07
- Task Breakdown ID:
  `TBD-CHAT-S009`
- Source Story Breakdown packet:
  docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/story.md
- Selected Story ID(s):
  S-009
- Validation command:
  npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/story.md
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
  Closure tasks consume the Layer 5 implementation and evidence source truth now recorded for the root-admin MVP; residual DB/renderer/E2E gaps remain explicit.

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-010 | feature-local | DOC:docs-artifact | T-S009-01, T-S009-02, T-S009-03, T-S009-04, T-S009-05 | covered | The steering signal is a source-independent artifact sweep; task-type signal rows split the specialized artifact families. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-009 | DOC:data-dictionary | Data dictionary | T-S009-01 | Closure proof recorded against implemented source truth. |
| S-009 | DOC:api-contract | API contract closure | T-S009-02 | Closure proof recorded against protected route truth. |
| S-009 | DOC:permission-mapping | Permission mapping closure | T-S009-03 | Closure proof recorded against runtime authz and browser context truth. |
| S-009 | GOV:architecture-update | Feature manifest and dependency graph closure | T-S009-04 | Closure proof recorded against manifest/generated graph truth. |
| S-009 | DOC:docs-artifact | Final docs closure sweep | T-S009-05 | Queued now that specialized closure tasks and evidence have proof records. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-009 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Data, permissions, API, and feature-manifest artifact sweep | This is needed to keep the written rules, examples, and tests aligned with the finished chat feature before follow-on work starts. | repo governance | Split each specialized artifact family into its own Layer 5 closure task, then block the final docs sweep until source truth exists. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S009-01 | S-009 | Data dictionary, permission mapping, API contracts, feature manifest, generated dependency graph plan, and source-independent docs are aligned before implementation closure. | source-level | artifact sweep; generated artifact verification | data dictionary; permission mapping; feature manifest |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-009 | AC-S009-01 | chatInterface.artifactAlignment | repo governance | not-capability-backed | data dictionary; permission mapping; API contract; feature manifest; generated dependency graph; status docs |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-01 | S-009 | DOC:data-dictionary | Finalize data dictionary against implemented conversation, message, packet revision, PDF attempt, lifecycle, retention, classification, and audit facts. | docs/data-dictionary/harness-chat-conversation.md; docs/data-dictionary/harness-chat-message.md; docs/data-dictionary/harness-chat-packet-revision.md; docs/data-dictionary/harness-chat-pdf-attempt.md | schema changes, repository changes, API contract changes, permission changes, executable proof changes | not-applicable: external S-005 implementation dependency | data dictionary docs and data compliance health command | queued-for-delivery |
| T-S009-02 | S-009 | DOC:api-contract | Final API contract and maintained API artifact closure after route implementation. | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/workspace/api-contracts/** | runtime route changes, authz changes, persistence changes, executable proof changes | T-S009-01; not-applicable: external T-S006-03 implementation dependency | protected chat API contract | queued-for-delivery |
| T-S009-03 | S-009 | DOC:permission-mapping | Final permission mapping closure after route/browser proof. | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md | runtime enforcement changes, grant migrations, API contract changes, executable proof changes | T-S009-02; not-applicable: external T-S006-03 and T-S007-02 implementation dependencies | permission mapping docs | queued-for-delivery |
| T-S009-04 | S-009 | GOV:architecture-update | Review feature manifest truth and refresh generated architecture map outputs if public seams or cross-feature dependencies changed. | docs/architecture/generated/feature-dependency-graph.json; docs/architecture/generated/feature-dependency-graph.md | implementation changes, source manifest edits, standards changes, API contract changes, permission changes | not-applicable: external S-004 through S-007 implementation dependencies | feature manifest source and dependency graph generator | queued-for-delivery |
| T-S009-05 | S-009 | DOC:docs-artifact | Final source-independent Product Request, PRD/test planning, implementation-blueprint, pilot, and alignment inventory closure sweep. | docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/**; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md; docs/workspace/layer5-pilots/2026-05-07-chat-interface-delivery-pilot.md; docs/workspace/artifact-alignment/2026-05-07-product-request-artifact-alignment-inventory.md | specialized data/API/permission/architecture changes, runtime implementation, executable proof changes | T-S009-01; T-S009-02; T-S009-03; T-S009-04; not-applicable: S-008 evidence proof records already exist | source-independent workspace docs | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-01 | single-proof-target | 1 | One AC includes data dictionary closure; this task isolates that artifact family. | Data dictionary matches source truth. | docs/data-dictionary | Data compliance and dictionary diff prove data truth. | no API/permission closure | API and permission closure split to specialized tasks. |
| T-S009-02 | single-proof-target | 1 | One AC includes API contract closure; this task isolates route contract truth. | API contract matches implemented protected routes. | docs/api-contracts | API artifact diff proves wire truth. | no permission mapping closure | Permission mapping split to T-S009-03. |
| T-S009-03 | single-proof-target | 1 | One AC includes permission mapping closure; this task isolates authz mapping truth. | Permission mapping matches allow/deny/audit behavior. | permission mapping docs | Mapping diff and denied-state proof prove permission truth. | no route implementation | Runtime changes route to implementation tasks. |
| T-S009-04 | single-proof-target | 1 | One AC includes feature manifest and generated graph closure; this task isolates architecture map truth. | Manifest and generated graph match public seams/dependencies. | feature manifest and generated graph | Generated artifact check proves architecture truth. | no implementation change | Implementation belongs to earlier DEV tasks. |
| T-S009-05 | single-proof-target | 1 | One AC includes final source-independent docs closure; this task isolates non-specialized docs. | Product/request status docs match shipped truth. | workspace docs | Stale artifact sweep proves docs truth. | no specialized artifact changes | Specialized artifact families split to T-S009-01 through T-S009-04. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S009-01 | source-truth-mismatch | Stop if implementation, schema, repository, and existing dictionary docs disagree. | Return to data/implementation owner; route API/OpenAPI/Postman updates to DOC:api-contract, permission updates to DOC:permission-mapping, feature graph updates to GOV:architecture-update, and QA proof to EVIDENCE:qa-evidence. | no | Dictionary closure must not invent data truth. |
| T-S009-02 | source-truth-mismatch | Stop if route implementation and API contract source disagree. | Return to API/backend owner; route OpenAPI/Postman updates to DOC:api-contract, permission updates to DOC:permission-mapping, feature graph updates to GOV:architecture-update, data updates to DOC:data-dictionary, and browser/QA proof to EVIDENCE:qa-evidence. | no | API docs must match wire behavior. |
| T-S009-03 | proof-gap | Stop if denied/allow/audit proof is missing. | Return to permission or evidence owner; route API/OpenAPI/Postman updates to DOC:api-contract, data updates to DOC:data-dictionary, and feature graph updates to GOV:architecture-update. | no | Permission mapping needs proof, not intent. |
| T-S009-04 | architecture-decision | Stop if public seam or dependency changed without manifest/architecture authority. | Return to architecture owner; route API/OpenAPI/Postman updates to DOC:api-contract, permission updates to DOC:permission-mapping, data updates to DOC:data-dictionary, browser/QA proof to EVIDENCE:qa-evidence, and Layer 5 harness changes to test:test-suite-alignment and doc:docs-artifact. | no | Generated graph must follow manifest truth. |
| T-S009-05 | source-truth-mismatch | Stop if final docs would conflict with specialized closure outputs. | Return to specialized task owner. | no | Final docs sweep consumes specialized closure, not vice versa. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S009-01 | docs/data-dictionary/harness-chat-*.md; implemented migrations/schema/repository/domain/contract files | data dictionary docs and npm run data:compliance-health | S-009 story; S-005/S-006 implementation outputs |
| T-S009-02 | docs/api-contracts/chat-interface-layer-one-discovery.md; protected chat API routes after T-S006-03 | API contract docs | S-009 story; S-006 implementation outputs |
| T-S009-03 | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md; root-admin/browser denied proof | permission mapping docs | S-009 story; S-006/S-007/S-008 outputs |
| T-S009-04 | src/features/harnessChat/feature.manifest.json; docs/architecture/generated/feature-dependency-graph.* | feature manifest and graph generator | architecture ADRs; S-004 through S-007 implementation outputs |
| T-S009-05 | Product Request, PRD, test cases, implementation blueprint, pilot, alignment inventory | ordinary source-independent docs | S-009 story; T-S009-01 through T-S009-04 outputs; S-008 evidence outputs |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-01 | Data dictionary closure | not-applicable | repo governance | artifact closure | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | docs/data-dictionary | not-applicable | Data dictionary closure is not frontend work. |
| T-S009-02 | API contract closure | not-applicable | repo governance | artifact closure | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | docs/workspace | not-applicable | API contract closure is not frontend work. |
| T-S009-03 | Permission mapping closure | not-applicable | repo governance | artifact closure | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | docs/workspace | not-applicable | Permission mapping closure is not frontend work. |
| T-S009-04 | Feature manifest and graph closure | not-applicable | repo governance | artifact closure | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | generated-output | blocked-on-artifacts | Architecture closure waits for implementation outputs. |
| T-S009-05 | Final docs closure sweep | not-applicable | repo governance | artifact closure | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | docs/workspace | ready-for-closure | Final docs closure consumes specialized closure and evidence outputs. |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S009-01 | not-applicable | not-applicable: data dictionary task | no frontend work | not-applicable |
| T-S009-02 | not-applicable | not-applicable: API contract task | no frontend work | not-applicable |
| T-S009-03 | not-applicable | not-applicable: permission mapping task | no frontend work | not-applicable |
| T-S009-04 | not-applicable | not-applicable: architecture update task | no frontend work | not-applicable |
| T-S009-05 | not-applicable | not-applicable: docs artifact task | no frontend work | not-applicable |

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
| T-S009-01 | exact-files | docs/data-dictionary/harness-chat-conversation.md; docs/data-dictionary/harness-chat-message.md; docs/data-dictionary/harness-chat-packet-revision.md; docs/data-dictionary/harness-chat-pdf-attempt.md | Data dictionary closure only. |
| T-S009-02 | narrow-pattern | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/workspace/api-contracts/** | API contract closure only. |
| T-S009-03 | exact-files | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md | Permission mapping closure only. |
| T-S009-04 | exact-files | docs/architecture/generated/feature-dependency-graph.json; docs/architecture/generated/feature-dependency-graph.md | Architecture map closure only; feature manifest source edits route to the owning implementation task. |
| T-S009-05 | narrow-pattern | docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/**; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md; docs/workspace/layer5-pilots/2026-05-07-chat-interface-delivery-pilot.md; docs/workspace/artifact-alignment/2026-05-07-product-request-artifact-alignment-inventory.md | Ordinary docs closure only; specialized artifacts route to T-S009-01 through T-S009-04. |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Focused Proof Command Or Evidence | Mock-Honesty Note |
| --- | --- | --- | --- |
| T-S009-01 | task-specific | npm run data:compliance-health; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/story.md | not-applicable: docs/data closure. |
| T-S009-02 | task-specific | npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/story.md; npx vitest run tests/integration/harnessChat/router.test.ts tests/security/harnessChat/routerAuthz.test.ts | not-applicable: API contract closure. |
| T-S009-03 | task-specific | npx vitest run tests/security/harnessChat/routerAuthz.test.ts tests/security/rootAdmin/buildPanelContextAuthority.test.ts; npx playwright test tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts --grep=root-admin.*context | not-applicable: permission mapping closure. |
| T-S009-04 | task-specific | npm run check:feature-dependencies; git diff docs/architecture/generated/feature-dependency-graph.json docs/architecture/generated/feature-dependency-graph.md | not-applicable: architecture closure. |
| T-S009-05 | task-specific | npm run product-request:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery; npm run story-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/story.md | not-applicable: docs closure. |

## Refactor-First Contract

| Task ID | Trigger | Refactor Type | Target Inventory | Detection Hints | Existing Behavior Preserved | Affected Consumers | Compatibility Proof | Downstream Unblocker | No Product Change | Human Review Boundary | Routing Check |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Foundation Contract

| Task ID | Concern Area | Trigger | Question | Decision Provenance | ADRs / Sources Reviewed | Missing Decision | Sources To Review | Output Artifact Target | Decision Analysis Checklist | Owner | Downstream Tasks Blocked | Compatibility Posture | Final Authority Route | Human Review Boundary | Forbidden Implementation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Update Contract

| Task ID | Architecture Update Class | Approved Decision Source | Decision Source Path / Reference | Decision Summary | Architecture Artifact Target | Consistency Sweep Targets | Authority / Consistency Inventory | Downstream Impact | Compatibility Posture | Forbidden Implementation / Standards Work | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-04 | architecture-map-update | Layer-2-technical-steering | docs/architecture/adr/0030-enforce-feature-public-seams-with-a-generated-dependency-graph.md; docs/architecture/adr/0031-add-feature-manifests-for-declared-seams-and-dependencies.md; S-009 story | Architecture map outputs must match any implemented chat-interface public seams or cross-feature dependencies, using feature manifest source truth as review input only. | docs/architecture/generated/feature-dependency-graph.md architecture map; docs/architecture/generated/feature-dependency-graph.json architecture map | src/features/harnessChat/feature.manifest.json source review; docs/architecture/generated/feature-dependency-graph.md; docs/architecture/generated/feature-dependency-graph.json; npm run check:feature-dependencies output | docs/architecture/generated/feature-dependency-graph.md architecture map authority; src/features/harnessChat/feature.manifest.json source inventory; npm run check:feature-dependencies command output | Downstream docs closure consumes generated architecture map truth after implementation. | no behavior change; generated artifact alignment only | Forbid implementation work and standards work in this architecture update task; source manifest edits route to the owning DEV task. | Architecture reviewer decides whether seam changes need ADR or manifest follow-up. | npm run check:feature-dependencies passes against generated architecture map outputs. |

## Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-05 | maintained-artifact-sweep | stale-artifact-sweep | docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/**; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md; docs/workspace/layer5-pilots/2026-05-07-chat-interface-delivery-pilot.md; docs/workspace/artifact-alignment/2026-05-07-product-request-artifact-alignment-inventory.md | Product Request, Story Breakdown, Task Breakdown packets, PRD/test cases, implementation blueprint, Layer 5 pilot, and alignment inventory reviewed after specialized closure outputs. | docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/request.md; docs/workspace/layer5-pilots/2026-05-07-chat-interface-delivery-pilot.md; docs/workspace/artifact-alignment/2026-05-07-product-request-artifact-alignment-inventory.md | ready-for-closure | Sweep ordinary workspace and PRD docs for stale Layer 3/4 status, blockers, and closure wording; route-away outcomes recorded. | DOC:data-dictionary routes to T-S009-01; DOC:api-contract routes to T-S009-02; DOC:permission-mapping routes to T-S009-03; GOV:architecture-update routes to T-S009-04; EVIDENCE:qa-evidence routes to S-008 tasks; TEST:test-suite-alignment routes to S-008 task. | rg -n "pending-blocked" docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery docs/workspace/layer5-pilots docs/workspace/artifact-alignment; rg -n "remaining" docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery docs/workspace/layer5-pilots docs/workspace/artifact-alignment; rg -n "stale" docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery docs/workspace/layer5-pilots docs/workspace/artifact-alignment; rg -n "TODO" docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery docs/workspace/layer5-pilots docs/workspace/artifact-alignment; npm run product-request:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery | Product/repo governance reviewer decides closure wording and accepted residual drift. | Final evidence is scoped product-request validation, story validation, task validation, and a stale-phrase sweep with residual runtime gaps explicitly called out. |

## Standards Compliance Contract

| Task ID | Compliance Target Type | Standard / Gate | Source Standard Path / Reference | Scope Under Review | Control / Evidence Inventory | Review Method / Command | Compliance Posture | Evidence Artifact Target | Coverage Summary Command | Findings Summary | Follow-Up Routing | Human Review Boundary | Waiver / Blocker Posture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Standards Update Contract

| Task ID | Approved Change Source | Update Class | Change Owner | Rationale | Affected Surfaces | Invalidation Sweep | Enforcement Plan | Rollout Compatibility | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Permission Mapping Contract

| Task ID | Permission Mapping Class | Approved Authz Source | Capability / Route / Surface | Authority World / Actor Boundary | Grant Source Posture | Mapping Row Posture | Tenant / Object Boundary | Allow / Deny Expectations | UI Eligibility | Denial / Audit / Proof Expectation | Evidence Mapping Inventory | Migration Impact | Split / Blocked Follow-Up | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-03 | runtime-enforced-row | Technical Steering, capability rows, API contract, permission-mapping docs, and S-009 story | chatInterface.contextIsNotAuthority; protected chat history/generation/download routes; root-admin Build panel | root actor boundary; system authority remains server-side and root-admin context display is not authority | runtime-enforced | current | root boundary with object-level conversation, packet revision, and PDF attempt ownership; no tenant context authority in MVP | Allow authorized root builder reads/generation/downloads; deny unauthenticated, unauthorized, expired, wrong-object, and context-only access. | UI selectable only when runtime-enforced permissions and API eligibility exist; blocked states remain not usable. | Deny outcomes require audit/proof expectation and browser/API proof before closure. | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md; docs/api-contracts/chat-interface-layer-one-discovery.md; docs/workspace/qa-evidence/chat-interface-layer-one-discovery/ | not-applicable | Runtime changes route to DEV:backend T-S006-03; API-visible denial contract changes route to DOC:api-contract T-S009-02; tests route to TEST:test-only; authz model changes route to GOV:architecture-update. | Security/repo governance reviewer decides final allow/deny mapping sufficiency. |

## API Contract

| Task ID | API Contract Class | Route Family | Contract Source / Authority | Methods / Paths | Params / Query / Body | Response / Status / Error Shape | Authn / Authz / Tenant Boundary | Validation / Pagination / Sorting / System Fields | Compatibility Posture | Maintained API Artifacts | Maintained Artifact Inventory | Split / Blocked Follow-Up | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-02 | no-wire-change-refresh | harness chat protected Build API | S-006 story, S-009 story, PRD, Technical Steering, implementation blueprint, capability rows, and existing API contract | GET /v1/harness-chat/conversations; POST /v1/harness-chat/conversations; POST /v1/harness-chat/conversations/{conversationId}/messages; POST /v1/harness-chat/conversations/{conversationId}/packet-revisions; GET /v1/harness-chat/packet-revisions/{packetRevisionId}/pdf | Params include conversationId and packetRevisionId; request body validation covers chat message and generation inputs; query pagination and sorting reviewed where lists exist. | Response status and error shape cover success responses, 400 validation, 401 unauthenticated, 403 unauthorized, 404 not found, 409 lifecycle conflict, and degraded PDF/status errors. | Authn/authz required; root boundary only; no tenant context authority in MVP; object-level authorization required for history, generation, and download. | Validation, pagination, sorting, and system-managed field posture follows repo defaults; clients cannot supply ids, timestamps, audit fields, lifecycle fields, or generated PDF attempt state. | no-wire-change | docs-api-contract-only | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/workspace/api-contracts/README.md if present; implementation output diff | Runtime implementation changes route to DEV:backend T-S006-03; permission changes route to DOC:permission-mapping T-S009-03; persistence/schema changes route to DEV:migration-persistence; test changes route to TEST:test-only. | API/backend reviewer decides whether OpenAPI/Postman are not-maintained with rationale or need separate sync. | T-S006-03 route proof recorded; validate with task-breakdown and API contract diff review during Layer 5. |

## Data Dictionary Contract

| Task ID | Entity / Table / Fact Group | Dictionary Artifact Target | Source Truth Reviewed | Field / Index / Lifecycle Truth | Durable Fact / Retention Truth | Classification / Compliance Posture | Standards / Control Trace | Enforcement Trace | Enforcement Evidence | Test / Evidence Trace | Compatibility Posture | Split / Blocked Follow-Up | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-01 | harness chat conversations, messages, packet revisions, and PDF attempts | docs/data-dictionary/harness-chat-conversation.md; docs/data-dictionary/harness-chat-message.md; docs/data-dictionary/harness-chat-packet-revision.md; docs/data-dictionary/harness-chat-pdf-attempt.md | src/features/harnessChat/persistence/migrations/0047_create_harness_chat_conversations.sql; src/features/harnessChat/persistence/migrations/0048_create_harness_chat_packet_revisions.sql; src/features/harnessChat/persistence/types.ts; src/features/harnessChat/persistence/repository.ts; src/features/harnessChat/persistence/postgresRepository.ts; src/features/harnessChat/domain/service.ts; src/features/harnessChat/contract/schemas.ts; docs/data-dictionary/harness-chat-conversation.md | Field, index, lifecycle, retention, normalization, uniqueness, soft-delete, and audit truth must match implemented source. | Durable fact and retention truth covers prompt/message history, generated packet revisions, PDF attempt lifecycle, cleanup, export/delete/legal-hold posture, and audit facts. | Classification, privacy, security, audit, retention, and compliance posture recorded for chat transcripts, generated packet content, and PDF attempts. | AGENTS.md Durable Domain Data Rule, Lifecycle And Cleanup Defaults, API/entity defaults, tenant boundary defaults, and asset decision record controls. | artifact-documented | docs/data-dictionary/harness-chat-conversation.md; docs/data-dictionary/harness-chat-message.md; docs/data-dictionary/harness-chat-packet-revision.md; docs/data-dictionary/harness-chat-pdf-attempt.md; npm run data:compliance-health | tests/integration/harnessChat/persistence.test.ts; docs/workspace/qa-evidence/chat-interface-layer-one-discovery/2026-05-08-live-shape-mock-honesty.md; npm run task-breakdown:validate | docs-only-alignment | Schema/index/runtime changes route to DEV:migration-persistence or DEV:backend; API response changes route to DOC:api-contract; permission/tenant-boundary changes route to DOC:permission-mapping; executable proof routes to TEST:test-only; standards/control follow-up routes to DOC:standards-compliance. | npm run data:compliance-health; npm run task-breakdown:validate evidence recorded during Layer 5. |

## Test-Only Coverage Contract

| Task ID | Test Change Class | Source Authority | Traceability | Proof Layer | Mock Honesty | No Behavior Change | Sensitive State Coverage | Focused Command | Coverage Strength | Split Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test Suite Alignment Contract

| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Capability Permission / State Matrix

| Task ID | Capability / Permission | Allowed Actor / State | Denied Actor / State | Object / Lifecycle States | Required Proof |
| --- | --- | --- | --- | --- | --- |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Required Escalation |
| --- | --- | --- |
| T-S009-01 | Do not invent data facts before implementation exists. | Keep task blocked or return to implementation owner. |
| T-S009-02 | Do not describe protected routes that were not implemented. | Keep task blocked or return to backend/API owner. |
| T-S009-03 | Do not treat UI context as permission authority. | Return to permission/API owner. |
| T-S009-04 | Do not hand-edit generated architecture outputs without source manifest truth. | Run generator or return to architecture owner. |
| T-S009-05 | Do not close source-independent docs while specialized artifacts remain stale. | Keep residual specialized/runtime gaps explicit or return to the owning task. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Guardrail Reference | Approval Status | Notes |
| --- | --- | --- | --- | --- |
| T-S009-01 | DOC:data-dictionary | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/data-dictionary-task-guardrail.md | approved | Data dictionary guardrail reviewed for source truth, compliance posture, enforcement, split routing, and data compliance health. |
| T-S009-02 | DOC:api-contract | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/api-contract-task-guardrail.md | approved | API contract guardrail reviewed for route family, request/response, authz, compatibility, artifact inventory, and split routing. |
| T-S009-03 | DOC:permission-mapping | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/permission-mapping-task-guardrail.md | approved | Permission mapping guardrail reviewed for authz source, boundary, allow/deny, UI eligibility, evidence, and split routing. |
| T-S009-04 | GOV:architecture-update | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/architecture-update-task-guardrail.md | approved | Architecture update guardrail reviewed for approved decision source, map target, consistency inventory, and no implementation/standards work. |
| T-S009-05 | DOC:docs-artifact | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/docs-artifact-task-guardrail.md | approved | Docs artifact guardrail reviewed for source truth, stale sweep, specialized routing, and validation commands. |

## Task Guardrail Evidence

| Task ID | Check ID | Status | Evidence / Rationale |
| --- | --- | --- | --- |
| T-S009-01 | data-entity-table | pass | Conversation, message, packet revision, and PDF attempt fact groups named. |
| T-S009-01 | data-source-reviewed | pass | Migrations/schema/repository/domain/contract/PRD/Technical Steering/capability/data dictionary sources named. |
| T-S009-01 | data-field-index-lifecycle | pass | Field, index, lifecycle, retention, normalization, uniqueness, and soft-delete truth named. |
| T-S009-01 | data-durable-facts | pass | Durable facts and retention posture named. |
| T-S009-01 | data-classification-compliance | pass | Classification, privacy, security, audit, retention, and compliance posture named. |
| T-S009-01 | data-standards-control-trace | pass | Repo controls and standards named. |
| T-S009-01 | data-enforcement-trace | pass | Artifact-documented enforcement trace selected. |
| T-S009-01 | data-enforcement-evidence | pass | Planned/blocked enforcement evidence route named. |
| T-S009-01 | data-test-evidence-trace | pass | Test/evidence trace route named. |
| T-S009-01 | data-split-routing | pass | Schema, runtime, API, permission, test, and standards splits named. |
| T-S009-01 | data-compliance-health | pass | npm run data:compliance-health named. |
| T-S009-01 | data-retention-review-disposition | pass | Retention/export/delete/legal-hold review deferred to data owner until implementation exists. |
| T-S009-01 | data-validation-proof | pass | Validation proof named. |
| T-S009-02 | api-route-family | pass | Protected Build chat route family named. |
| T-S009-02 | api-contract-class | pass | no-wire-change-refresh selected for closure. |
| T-S009-02 | api-contract-source | pass | Story, PRD, Technical Steering, blueprint, capability, and API contract sources named. |
| T-S009-02 | api-request-response | pass | Methods, paths, params, body, response, status, and error shape named. |
| T-S009-02 | api-authz-validation | pass | Authn/authz, validation, pagination, sorting, and system-managed fields named. |
| T-S009-02 | api-compatibility | pass | No-wire-change closure posture selected. |
| T-S009-02 | api-maintained-artifact-inventory | pass | API contract inventory path named. |
| T-S009-02 | api-maintained-artifacts | pass | docs-api-contract-only posture selected. |
| T-S009-02 | api-split-routing | pass | Runtime, permission, persistence, and test splits named. |
| T-S009-02 | api-validation-command | pass | Task validation and API diff review named. |
| T-S009-03 | permission-authz-model-source | pass | Technical Steering, capability, API contract, permission mapping, and story sources named. |
| T-S009-03 | permission-mapping-class | pass | runtime-enforced-row selected. |
| T-S009-03 | permission-capability-rows | pass | Context-not-authority and protected route surfaces named. |
| T-S009-03 | permission-boundary | pass | Root and object boundary named. |
| T-S009-03 | permission-grant-source-ui | pass | Runtime-enforced grant posture and UI eligibility named. |
| T-S009-03 | permission-mapping-row-posture | pass | Current row posture selected. |
| T-S009-03 | permission-denial-audit | pass | Denial audit/proof expectation named. |
| T-S009-03 | permission-allow-deny | pass | Allow and deny expectations named. |
| T-S009-03 | permission-evidence-inventory | pass | Permission mapping, API contract, and QA evidence inventory named. |
| T-S009-03 | permission-grants-migration | pass | No seed/migration grant impact in closure task. |
| T-S009-03 | permission-split-routing | pass | Runtime, API, test, and architecture splits named. |
| T-S009-03 | permission-authz-proof | pass | Browser/API proof boundary named. |
| T-S009-04 | architecture-approved-decision-source | pass | ADR and Technical Steering authority named. |
| T-S009-04 | architecture-update-class | pass | architecture-map-update selected. |
| T-S009-04 | architecture-authority-reviewed | pass | Feature manifest and generated graph authority named. |
| T-S009-04 | architecture-change-owner | pass | Architecture owner/human review boundary named. |
| T-S009-04 | architecture-output-artifact | pass | Generated dependency graph targets named. |
| T-S009-04 | architecture-consistency-inventory | pass | Manifest and generated graph inventory named. |
| T-S009-04 | architecture-downstream-impact | pass | Final docs consume generated graph truth. |
| T-S009-04 | architecture-validation | pass | Graph generator and git diff evidence named. |
| T-S009-05 | docs-source-truth-reviewed | pass | Product Request, Story Breakdown, Task Breakdowns, PRD/test cases, blueprint, pilot, and inventory named. |
| T-S009-05 | docs-artifact-class | pass | stale-artifact-sweep selected. |
| T-S009-05 | docs-scriptable-source-inventory | pass | Concrete docs paths and commands named. |
| T-S009-05 | docs-stale-artifact-sweep | pass | Sweep scope and route-away outcomes named. |
| T-S009-05 | docs-status-posture | pass | Ready-for-closure posture recorded with residual runtime gaps explicit. |
| T-S009-05 | docs-validation-command | pass | Product request, story breakdown, and task breakdown validation named. |
| T-S009-05 | docs-specialized-routing | pass | Specialized artifacts route to dedicated tasks. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Shared-Code Guardrail Required | Compatibility / Move Notes | Review Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-01 | feature-local | data dictionary docs | data dictionary docs | no | not-applicable | No source extraction. | approved |
| T-S009-02 | feature-local | API contract docs | API contract docs | no | not-applicable | No source extraction. | approved |
| T-S009-03 | feature-local | permission mapping docs | permission mapping docs | no | not-applicable | No source extraction. | approved |
| T-S009-04 | feature-local | generated graph docs | generated graph docs | no | not-applicable | No source extraction; source manifest edits route away. | approved |
| T-S009-05 | feature-local | source-independent docs | source-independent docs | no | not-applicable | No source extraction. | approved |

## Allowed Write Set Classification

| Task ID | Path | Write Class | Reason |
| --- | --- | --- | --- |
| T-S009-01 | docs/data-dictionary/harness-chat-conversation.md; docs/data-dictionary/harness-chat-message.md; docs/data-dictionary/harness-chat-packet-revision.md; docs/data-dictionary/harness-chat-pdf-attempt.md | docs-artifact | Data dictionary closure only. |
| T-S009-02 | docs/api-contracts/chat-interface-layer-one-discovery.md; docs/workspace/api-contracts/** | docs-artifact | API contract closure only. |
| T-S009-03 | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md | docs-artifact | Permission mapping closure only. |
| T-S009-04 | docs/architecture/generated/feature-dependency-graph.json; docs/architecture/generated/feature-dependency-graph.md | generated-artifact | Generated graph closure only. |
| T-S009-05 | docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/**; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md; docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md; docs/workspace/layer5-pilots/2026-05-07-chat-interface-delivery-pilot.md; docs/workspace/artifact-alignment/2026-05-07-product-request-artifact-alignment-inventory.md | docs-artifact | Ordinary docs closure only. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S009-01 | Schema, migration, repository, API, permission, or test changes | Data dictionary closure only. |
| T-S009-02 | Runtime route implementation, permission changes, persistence changes, or tests | API contract closure only. |
| T-S009-03 | Runtime authz implementation, grant migrations, API changes, or tests | Permission mapping closure only. |
| T-S009-04 | Implementation work, standards work, API contract work, or permission mapping work | Architecture closure only. |
| T-S009-05 | Specialized data/API/permission/architecture changes, runtime code, or tests | Final ordinary docs sweep only. |

## Task Acceptance Criteria Coverage

| Task ID | AC ID | Coverage Notes |
| --- | --- | --- |
| T-S009-01 | AC-S009-01 | Covers data dictionary closure. |
| T-S009-02 | AC-S009-01 | Covers API contract closure. |
| T-S009-03 | AC-S009-01 | Covers permission mapping closure. |
| T-S009-04 | AC-S009-01 | Covers feature manifest and generated dependency graph closure. |
| T-S009-05 | AC-S009-01 | Covers final source-independent docs closure. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) | Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S009-01 | chatInterface.artifactAlignment | not-capability-backed | Artifact closure control task. |
| T-S009-02 | chatInterface.artifactAlignment | not-capability-backed | Artifact closure control task. |
| T-S009-03 | chatInterface.artifactAlignment | not-capability-backed | Artifact closure control task. |
| T-S009-04 | chatInterface.artifactAlignment | not-capability-backed | Artifact closure control task. |
| T-S009-05 | chatInterface.artifactAlignment | not-capability-backed | Artifact closure control task. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S009-01 | not-applicable: external S-005/S-006 implementation dependencies | Data dictionary closure needs implemented persistence and lifecycle truth. | yes |
| T-S009-02 | T-S009-01; not-applicable: external T-S006-03 implementation dependency | API closure needs implemented protected route truth and data shape context. | yes |
| T-S009-03 | T-S009-02; not-applicable: external T-S006-03 and T-S007-02 implementation dependencies | Permission closure needs route and UI denied/context-not-authority truth. | yes |
| T-S009-04 | not-applicable: external S-004 through S-007 implementation dependencies | Manifest/graph closure needs public seam and dependency impact. | yes |
| T-S009-05 | T-S009-01; T-S009-02; T-S009-03; T-S009-04; not-applicable: S-008 evidence proof records already exist | Final docs closure consumes specialized closure and evidence outputs. | yes |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S009-01 | data dictionary docs | documentation seam | existing | Data dictionary owner reviews source truth. |
| T-S009-02 | API contract docs | documentation seam | existing | API contract owner reviews route truth. |
| T-S009-03 | permission mapping docs | documentation seam | existing | Permission mapping owner reviews allow/deny/audit truth. |
| T-S009-04 | feature manifest and dependency graph | architecture/generated seam | existing and new | Manifest source and generated graph output agree. |
| T-S009-05 | source-independent planning docs | documentation seam | existing | Final docs consume specialized artifact truth. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S009-01 | data dictionary docs | prove-current | DOC:data-dictionary | yes |
| T-S009-02 | API contract docs | prove-current | DOC:api-contract | yes |
| T-S009-03 | permission mapping docs | prove-current | DOC:permission-mapping | yes |
| T-S009-04 | feature manifest and dependency graph | prove-current | GOV:architecture-update | yes |
| T-S009-05 | Product Request, PRD/test cases, blueprint, pilot, alignment inventory | prove-current | DOC:docs-artifact | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S009-01 | source-level | npm run data:compliance-health; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/story.md | No runtime evidence claim beyond implemented schema/source truth. |
| T-S009-02 | source-level | npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/story.md; npx vitest run tests/integration/harnessChat/router.test.ts tests/security/harnessChat/routerAuthz.test.ts | Route behavior claim is limited to focused router/security tests. |
| T-S009-03 | source-level | npx vitest run tests/security/harnessChat/routerAuthz.test.ts tests/security/rootAdmin/buildPanelContextAuthority.test.ts; npx playwright test tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts --grep=root-admin.*context | Permission proof consumes S-008 evidence and focused denied/context proof. |
| T-S009-04 | source-level; generated-artifact | npm run check:feature-dependencies | Generated graph proof consumes manifest truth. |
| T-S009-05 | source-level | npm run product-request:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery; npm run story-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/story.md | Final closure consumes specialized closure and evidence outputs. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |
| T-S009-01 | npm run data:compliance-health | not-run: delivery task must run during Layer 5 closure | unknown until command runs | accepted-deferred | T-S009-01 data dictionary owner |
| T-S009-02 | npm run product-request:validate -- --all | not-run: delivery task must run during Layer 5 closure | unknown until command runs | accepted-deferred | T-S009-02 API contract owner |
| T-S009-03 | npm run product-request:validate -- --all | not-run: delivery task must run during Layer 5 closure | unknown until command runs | accepted-deferred | T-S009-03 permission mapping owner |
| T-S009-04 | npm run git:branch-stack-audit | not-run: delivery task must run during Layer 5 closure | unknown until command runs | accepted-deferred | T-S009-04 architecture owner |
| T-S009-05 | npm run product-request:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery | not-run: scoped validation must run during final docs closure; whole-repo `--all` currently has an unrelated legacy request blocker | unknown until command runs | accepted-deferred | T-S009-05 docs owner |

## Branch Worktree Bootstrap Strategy

| Task ID | Suggested Branch | Worktree Strategy | Bootstrap Source | Base Ref | Pre-Edit Check | Promote Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S009-01 | codex/s009-data-dictionary-closure | dedicated task branch after implementation | story-local task packet | origin/main | inspect implementation and current data dictionary | main after promote guardrail |
| T-S009-02 | codex/s009-api-contract-closure | dedicated task branch after backend | story-local task packet | origin/main | inspect protected routes and API contract | main after promote guardrail |
| T-S009-03 | codex/s009-permission-mapping-closure | dedicated task branch after backend/frontend | story-local task packet | origin/main | inspect permission mapping and denied proof | main after promote guardrail |
| T-S009-04 | codex/s009-architecture-closure | dedicated task branch after seam impact known | story-local task packet | origin/main | inspect manifest and graph outputs | main after promote guardrail |
| T-S009-05 | codex/s009-docs-closure | dedicated task branch after closure/evidence | story-local task packet | origin/main | inspect specialized closure outputs | main after promote guardrail |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S009-01 | queued-for-delivery | none | Persistence and lifecycle source truth exists; run data dictionary closure. |
| T-S009-02 | queued-for-delivery | none | Protected routes and data shape closure exist; run API contract closure. |
| T-S009-03 | queued-for-delivery | none | Runtime allow/deny behavior and API contract closure exist; run permission mapping closure. |
| T-S009-04 | queued-for-delivery | none | Seam/dependency impact is known; run generated graph closure. |
| T-S009-05 | queued-for-delivery | none | Run last as final ordinary docs closure; whole-repo `product-request:validate -- --all` remains blocked by an unrelated legacy Product Request. |
