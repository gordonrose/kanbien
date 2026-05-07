# Task Breakdown Packet: Chat Interface S-004 Product Discovery Harness Adapter

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-07
- Task Breakdown ID:
  `TBD-CHAT-S004`
- Source Story Breakdown packet:
  docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-004-product-discovery-harness-adapter/story.md
- Selected Story ID(s):
  S-004
- Related Product Discovery packet:
  docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md
- Related Technical Steering packet:
  docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md
- Related PRD:
  docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md
- Related capability matrix:
  docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv
- Validation command:
  npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-004-product-discovery-harness-adapter --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-004-product-discovery-harness-adapter/story.md
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
  none

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-002 | platform-seam | DEV:platform-seam | T-S004-01 | covered | Adapter must consume the established Layer 1 Product Discovery process. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-004 | DEV:platform-seam | Platform harness adapter | T-S004-01 | Covered by the adapter seam task. |
| S-004 | DEV:backend | Recoverable adapter failure behavior | T-S004-02 | Blocked until T-S004-01 names the adapter seam shape. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-004 | ready-for-task-breakdown | harness-value | DEV:backend | Product Discovery harness adapter | This is its own story because the chat should create the same discovery packet people already expect, not a lookalike version. | harness/system | Split the shared adapter seam from failure recording so Layer 5 can prove the boundary before backend lifecycle behavior depends on it. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | S-004 | Harness adapter produces canonical Product Discovery packet data and uses the existing Product Discovery taxonomy/template semantics. | contract-level | adapter contract; packet validation | PRD; capability matrix; API contract |
| AC-S004-02 | S-004 | Adapter failure leaves the conversation recoverable and records a non-success state without creating an invalid packet version. | runtime-api | resilience; lifecycle; audit | test cases; API contract |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-004 | AC-S004-01 | chatInterface.generateDiscoveryPacketData | harness adapter | create-or-refresh-required | PRD; capability matrix; API contract |
| S-004 | AC-S004-02 | chatInterface.recordAdapterFailure | harness adapter | create-or-refresh-required | test cases; API contract |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | S-004 | DEV:platform-seam | Create the narrow Product Discovery harness adapter seam that returns canonical packet data. | src/lib/productDiscovery/**; src/scripts/productDiscovery*; tests/unit/productDiscovery/**; tests/integration/productDiscovery/** | conversation persistence, API routes, permission mapping, PDF rendering, UI adoption, artifact closure | S-001 planning artifacts; S-003 PDF source-content decision | Product Discovery harness seam | queued-for-delivery |
| T-S004-02 | S-004 | DEV:backend | Record recoverable adapter failure without creating an invalid packet version. | src/features/harnessChat/**; tests/unit/harnessChat/**; tests/integration/harnessChat/** | adapter seam definition, schema migrations, API route implementation, UI behavior | T-S004-01 | not-applicable: feature-local failure behavior | blocked |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | single-behavior | 1 | One AC covers adapter output contract. | Product Discovery harness adapter returns canonical packet data. | Product Discovery harness seam | Adapter output validates against approved packet semantics. | no failure recording | Failure lifecycle is split to T-S004-02. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S004-01 | source-truth-mismatch | Stop if Product Discovery packet semantics, PRD, API contract, or implementation blueprint disagree on generated packet data shape. | Return to Product Discovery or Technical Steering owner. | no | Adapter must not invent a second discovery format. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S004-01 | docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md; docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md; existing Product Discovery templates and validators | Product Discovery taxonomy/template semantics and packet validation | S-004 story; Technical Steering TS-CHAT-002; PRD; implementation blueprint |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | Product Discovery harness adapter | not-applicable | harness chat backend | build discovery | not-applicable | root-operator | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | feature-local-state-machine | not-applicable | not-governed | none | not-applicable | not-applicable | Adapter has no browser surface; frontend consumes downstream APIs. |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S004-01 | not-applicable | not-applicable: DEV:platform-seam task | not-applicable: no frontend work | not-applicable |

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
| T-S004-01 | cross-feature-seam-infrastructure | additive-compatible | Technical Steering TS-CHAT-002 and implementation blueprint approve the Product Discovery adapter seam. | platform harness adapter under src/lib/productDiscovery or equivalent platform-owned helper | docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md; docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md; docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md; src/lib/productDiscovery/**/*.ts; src/scripts/productDiscovery*.ts | Add a narrow adapter seam that converts approved conversation input into canonical Product Discovery packet data. | narrow exact patterns: src/lib/productDiscovery/**/*.ts; src/scripts/productDiscovery*.ts; tests/unit/productDiscovery/**/*.ts; tests/integration/productDiscovery/**/*.ts | Not feature-local because it must preserve Product Discovery authority for current harness use and future non-chat consumers. | current: Product Discovery harness; future: chat interface and other builder entrypoints; unsupported: generic document generation or arbitrary transcript-to-packet conversion | Additive compatible; existing Product Discovery packet semantics remain backwards compatible and authoritative. | Focused adapter consumer test validates generated packet data and existing Product Discovery validation still passes. | not-required: adapter helper change only; no server restart beyond normal test runtime | additive rollout with revert/backout by removing adapter consumer path before route adoption | not-applicable: no generated artifact materialization | not-applicable: no generator/apply command | Adapter seam output is canonical Product Discovery packet data. | no authority changes, no architecture changes, and no standards changes; route API, permission, persistence, and evidence work are split. | DEV:backend for failure behavior; DOC:api-contract for routes; DEV:migration-persistence for storage; EVIDENCE:qa-evidence for runtime evidence. | npm run product-request:validate -- --all; npx vitest run tests/unit/productDiscovery tests/integration/productDiscovery | Human review judges Product Discovery authority preservation and compatibility sufficiency. |

## Platform Seam Class Contract

| Task ID | Platform Seam Class | Class-Specific Required Proof | Required Consumer Coverage | Runtime / Materialization Expectation | Forbidden Contamination / Split Notes |
| --- | --- | --- | --- | --- | --- |
| T-S004-01 | cross-feature-seam-infrastructure | Prove cross-feature seam mechanics, owning public seam posture, and adapter output contract. | Current Product Discovery harness consumer and future chat-interface consumer boundaries are named; unsupported generic document generation is denied. | not-required: helper seam has no runtime materialization; normal test runtime is enough. | API contracts route to DOC:api-contract; persistence routes to DEV:migration-persistence; evidence sweep routes to EVIDENCE:qa-evidence. |

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
| T-S004-01 | narrow-pattern | src/lib/productDiscovery/**; src/scripts/productDiscovery*; tests/unit/productDiscovery/**; tests/integration/productDiscovery/** | Narrow Product Discovery adapter seam and proof only. |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Focused Proof Command Or Evidence | Mock-Honesty Note |
| --- | --- | --- | --- |
| T-S004-01 | task-specific | npx vitest run tests/unit/productDiscovery tests/integration/productDiscovery; npm run product-request:validate -- --all | Adapter fixtures must be approved packet-shape examples, not invented fallback packet data. |

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
| T-S004-01 | Do not infer arbitrary transcript-to-packet conversion, generic document generation, UI authority, API route behavior, persistence, or PDF rendering from the adapter seam. | Return to the owning Layer 4 task type or Technical Steering. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Guardrail Reference | Approval Status | Notes |
| --- | --- | --- | --- | --- |
| T-S004-01 | DEV:platform-seam | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/platform-seam-task-guardrail.md | approved | Platform seam guardrail reviewed for cross-feature adapter seam, compatibility, source inventory, split routing, and representative consumer proof. |
| T-S004-02 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Backend guardrail reviewed; delivery handoff remains blocked until T-S004-01 fixes the adapter seam shape. |

## Task Guardrail Evidence

| Task ID | Check ID | Status | Evidence / Rationale |
| --- | --- | --- | --- |
| T-S004-01 | platform-source-authority | pass | Technical Steering TS-CHAT-002 and implementation blueprint approve the seam. |
| T-S004-01 | platform-seam-kind | pass | Seam kind is cross-feature-seam-infrastructure. |
| T-S004-01 | platform-seam-class | pass | Platform Seam Class Contract matches cross-feature-seam-infrastructure. |
| T-S004-01 | platform-seam-owner | pass | Owner/location is a platform Product Discovery adapter helper. |
| T-S004-01 | platform-seam-source-inventory | pass | Source inventory names docs and src/test path patterns. |
| T-S004-01 | platform-not-feature-local | pass | Seam preserves Product Discovery authority for multiple current/future consumers. |
| T-S004-01 | platform-exact-write-envelope | pass | Write envelope is narrow. |
| T-S004-01 | platform-consumer-inventory | pass | Current, future, and unsupported consumers are named. |
| T-S004-01 | platform-compatibility-mode | pass | Additive compatible. |
| T-S004-01 | platform-compatibility-contract | pass | Existing Product Discovery semantics remain authoritative. |
| T-S004-01 | platform-representative-consumer-proof | pass | Adapter consumer proof is required. |
| T-S004-01 | platform-runtime-restart-impact | pass | Runtime restart not required beyond normal tests. |
| T-S004-01 | platform-rollout-backout | pass | Additive rollout and backout posture named. |
| T-S004-01 | platform-artifact-materialization | pass | No generated artifact materialization. |
| T-S004-01 | platform-expected-output | pass | Expected output is canonical Product Discovery packet data. |
| T-S004-01 | platform-architecture-boundary | pass | No architecture or standards authority changes. |
| T-S004-01 | platform-split-routing | pass | Backend, API, persistence, and evidence work are split. |
| T-S004-01 | platform-proof-commands | pass | Focused vitest and validation commands named. |
| T-S004-01 | platform-human-review-boundary | pass | Human review boundary names Product Discovery authority preservation. |
| T-S004-02 | backend-source-authority | pass | Story and implementation blueprint authority identified; handoff remains blocked by dependency. |
| T-S004-02 | backend-change-class | pass | Future change class is lifecycle-behavior/error-resilience after adapter seam exists. |
| T-S004-02 | backend-owning-feature | pass | Future owner is src/features/harnessChat. |
| T-S004-02 | backend-source-inventory | pass | Future source inventory names harnessChat feature paths and adapter contract output. |
| T-S004-02 | backend-exact-write-envelope | pass | Future write envelope is narrow harnessChat feature and tests. |
| T-S004-02 | backend-layer-responsibilities | pass | Domain owns lifecycle decision; persistence/API split to owning tasks. |
| T-S004-02 | backend-cross-feature-seams | pass | Consumes T-S004-01 adapter seam only. |
| T-S004-02 | backend-authz-tenant-lifecycle | pass | Lifecycle posture records recoverable failure without invalid packet version. |
| T-S004-02 | backend-api-contract-boundary | pass | API contract behavior remains split to S-006. |
| T-S004-02 | backend-persistence-migration-boundary | pass | Persistence/migration remains split to S-005. |
| T-S004-02 | backend-scripted-scaffold-posture | pass | Scaffold posture to be confirmed after adapter seam exists. |
| T-S004-02 | backend-artifact-obligations | pass | Test cases and API contract obligations carried. |
| T-S004-02 | backend-expected-output | pass | Expected output is recoverable non-success lifecycle behavior. |
| T-S004-02 | backend-split-routing | pass | Persistence/API/evidence work stays split. |
| T-S004-02 | backend-proof-commands | pass | Future proof will be focused lifecycle/audit tests. |
| T-S004-02 | backend-human-review-boundary | pass | Human review covers recoverability and no invalid packet version. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Shared-Code Guardrail Required | Compatibility / Move Notes | Review Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | platform-seam | Product Discovery harness | Product Discovery adapter seam | no | not-applicable | Additive helper seam; no shared-lib extraction. | approved |
| T-S004-02 | feature-local | harness chat feature | harness chat feature | no | not-applicable | Blocked until adapter seam shape exists. | approved |

## Allowed Write Set Classification

| Task ID | Path | Write Class | Reason |
| --- | --- | --- | --- |
| T-S004-01 | src/lib/productDiscovery/** | platform-seam | Product Discovery adapter helper seam. |
| T-S004-01 | src/scripts/productDiscovery* | config-script | Existing Product Discovery validation or helper scripts if needed. |
| T-S004-01 | tests/unit/productDiscovery/**; tests/integration/productDiscovery/** | test | Focused adapter proof. |
| T-S004-02 | src/features/harnessChat/** | feature-local | Future recoverable failure behavior. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S004-01 | Conversation persistence, API routes, permission mapping, PDF rendering, UI adoption, artifact closure, arbitrary transcript conversion | Keep adapter seam narrow and non-contaminating. |
| T-S004-02 | Editing before T-S004-01 defines adapter seam shape | Failure behavior depends on the adapter contract. |

## Task Acceptance Criteria Coverage

| Task ID | AC ID | Coverage Notes |
| --- | --- | --- |
| T-S004-01 | AC-S004-01 | Covers canonical Product Discovery packet-data adapter output. |
| T-S004-02 | AC-S004-02 | Covers recoverable failure behavior after adapter seam exists. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) | Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S004-01 | chatInterface.generateDiscoveryPacketData | approved | Capability row exists or must be refreshed by S-001/S-009 artifact alignment. |
| T-S004-02 | chatInterface.recordAdapterFailure | approved | Handoff remains dependency-blocked, but capability coverage is named. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S004-01 | not-applicable: approved upstream artifacts exist | Technical Steering and implementation blueprint approve adapter seam. | no |
| T-S004-02 | T-S004-01 | Failure behavior depends on adapter result/error contract. | yes |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S004-01 | Product Discovery harness adapter | cross-feature-seam-infrastructure | new | Adapter must preserve Product Discovery packet semantics and consumer boundaries. |
| T-S004-02 | not-applicable: feature-local failure behavior after adapter seam exists | not-applicable | not-applicable | Failure behavior stays feature-local. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S004-01 | PRD, capability matrix, API contract | prove-current | implementation delivery and artifact sweep | yes |
| T-S004-02 | PRD-derived test cases and API contract | prove-current | implementation delivery and artifact sweep | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S004-01 | contract-level | npx vitest run tests/unit/productDiscovery tests/integration/productDiscovery; npm run product-request:validate -- --all | Adapter fixtures must match approved Product Discovery packet shape. |
| T-S004-02 | runtime-api | blocked until T-S004-01; later focused lifecycle/audit tests | Runtime evidence split to S-008. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | not-applicable: DEV:platform-seam focused proof | not-applicable: evidence task split to S-008 | not-applicable | not-applicable | not-applicable: fixture honesty recorded in proof plan | not-applicable | not-applicable | Product Discovery authority review |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |

## Branch Worktree Bootstrap Strategy

| Task ID | Suggested Branch | Worktree Strategy | Bootstrap Source | Base Ref | Pre-Edit Check | Promote Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | codex/s004-product-discovery-adapter-seam | dedicated task branch | story-local task packet | origin/main | record exact base commit and run validator before edits | main after promote guardrail |
| T-S004-02 | codex/s004-adapter-failure-behavior | dedicated task branch after T-S004-01 | story-local task packet | origin/main | confirm T-S004-01 delivered | main after promote guardrail |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |
| BLK-T-S004-02 | T-S004-02 | dependency | T-S004-01 | Failure behavior must consume the adapter seam result/error contract. | T-S004-01 owner |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S004-01 | queued-for-delivery | none | First Layer 5 pilot candidate: one platform adapter seam with focused packet validation proof. |
| T-S004-02 | blocked | BLK-T-S004-02 | Define after T-S004-01 delivers the adapter result/error contract. |
