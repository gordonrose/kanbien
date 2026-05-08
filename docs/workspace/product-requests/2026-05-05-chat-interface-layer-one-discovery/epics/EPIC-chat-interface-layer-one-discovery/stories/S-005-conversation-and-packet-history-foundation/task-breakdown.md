# Task Breakdown Packet: Chat Interface S-005 Conversation And Packet History Foundation

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-07
- Task Breakdown ID:
  `TBD-CHAT-S005`
- Source Story Breakdown packet:
  docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation/story.md
- Selected Story ID(s):
  S-005
- Related Product Discovery packet:
  docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md
- Related Technical Steering packet:
  docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md
- Related PRD:
  docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md
- Related capability matrix:
  docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv
- Validation command:
  npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation/story.md
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
| TS-CHAT-001 | feature-local | DEV:migration-persistence | T-S005-01, T-S005-02 | covered | Durable chat conversation and packet history facts belong to the harness-chat feature. |
| TS-CHAT-008 | feature-local | DOC:data-dictionary | T-S005-01, T-S005-02 | covered | Data dictionary exists and is consumed as persistence source authority. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-005 | DEV:migration-persistence | Durable persistence | T-S005-01, T-S005-02 | Covered by the conversation/message storage task and packet revision storage task. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-005 | ready-for-task-breakdown | system-value | DEV:backend | Conversation and packet history foundation | This is its own story because people need confidence that their discovery conversations and generated packets are not lost or mixed together. | chat feature | Split conversation/message durable facts from packet revision durable facts so Layer 5 can prove each storage invariant deeply. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | S-005 | Conversation records persist actor, platform or tenant scope, page/module/role context, lifecycle state, retention posture, and system-managed timestamps. | persistence-level | persistence integration; lifecycle; validation | data dictionary; migration plan |
| AC-S005-02 | S-005 | Packet records support generated, downloaded, failed, and superseded states, with newer packets marking earlier packets from the same conversation as superseded. | persistence-level | lifecycle; audit; regression | data dictionary; test cases |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-005 | AC-S005-01 | chatInterface.persistConversation | chat feature | create-or-refresh-required | data dictionary; migration plan |
| S-005 | AC-S005-02 | chatInterface.persistPacketVersion | chat feature | create-or-refresh-required | data dictionary; test cases |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-01 | S-005 | DEV:migration-persistence | Add durable conversation and message storage for actor, root/future tenant scope, page/module/role context, lifecycle, retention posture, and system-managed timestamps. | src/features/harnessChat/**; tests/integration/harnessChat/**; tests/harness/postgres/**; docs/data-dictionary/harness-chat-conversation.md; docs/data-dictionary/harness-chat-message.md; docs/architecture/generated/feature-dependency-graph.* | packet revision storage, API routes, permission mapping, root-admin UI, evidence sweep | data dictionary source truth; implementation blueprint | not-applicable: feature-local persistence | queued-for-delivery |
| T-S005-02 | S-005 | DEV:migration-persistence | Add packet revision/version storage for generated, downloaded, failed, and superseded states. | src/features/harnessChat/**; tests/integration/harnessChat/**; tests/harness/postgres/**; docs/data-dictionary/harness-chat-packet-revision.md; docs/data-dictionary/harness-chat-pdf-attempt.md; docs/architecture/generated/feature-dependency-graph.* | conversation/message base storage, API routes, PDF renderer, permission mapping, root-admin UI, evidence sweep | T-S005-01; S-003 PDF decision | not-applicable: feature-local persistence | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-01 | single-behavior | 1 | One AC covers conversation/message durable storage. | Conversation and message records persist approved actor, scope, context, lifecycle, retention, and timestamp facts. | harness-chat persistence | Representative create/read/write persistence proof passes. | no packet revision lifecycle | Packet revisions split to T-S005-02. |
| T-S005-02 | single-behavior | 1 | One AC covers packet revision/version durable storage. | Packet revision records persist generated/downloaded/failed/superseded lifecycle and supersession facts. | harness-chat persistence | Representative packet create/read/supersede persistence proof passes. | no base conversation storage | Conversation/message storage split to T-S005-01. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S005-01 | source-truth-mismatch | Stop if data dictionary, PRD, or blueprint disagree on conversation actor/scope/context/lifecycle/retention fields. | Return to data dictionary or Technical Steering owner. | no | Durable facts must not be invented inside migration delivery. |
| T-S005-02 | source-truth-mismatch | Stop if data dictionary, PDF decision, PRD, or blueprint disagree on packet revision lifecycle, supersession, or PDF attempt relationship. | Return to data dictionary, asset decision, or Technical Steering owner. | no | Packet history becomes durable approval/download evidence. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S005-01 | docs/data-dictionary/harness-chat-conversation.md; docs/data-dictionary/harness-chat-message.md; docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md; tests/harness/postgres/migrations.ts; tests/harness/postgres/testDatabase.ts | existing migration loader and Postgres test harness | S-005 story; Technical Steering TS-CHAT-001/008; data dictionary; implementation blueprint |
| T-S005-02 | docs/data-dictionary/harness-chat-packet-revision.md; docs/data-dictionary/harness-chat-pdf-attempt.md; docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md; docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md; tests/harness/postgres/migrations.ts; tests/harness/postgres/testDatabase.ts | T-S005-01 base conversation storage; existing migration loader and Postgres test harness | S-005 story; S-003 PDF decision; data dictionary; implementation blueprint |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-01 | Conversation and packet history storage | not-applicable | harness chat backend | build discovery | not-applicable | root-operator | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | feature-local-state-machine | not-applicable | not-governed | none | not-applicable | not-applicable | Persistence has no direct browser surface; APIs and UI consume it later. |
| T-S005-02 | Conversation and packet history storage | not-applicable | harness chat backend | build discovery | not-applicable | root-operator | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | feature-local-state-machine | not-applicable | not-governed | none | not-applicable | not-applicable | Persistence has no direct browser surface; APIs and UI consume it later. |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S005-01 | not-applicable | not-applicable: DEV:migration-persistence task | not-applicable: no frontend work | not-applicable |
| T-S005-02 | not-applicable | not-applicable: DEV:migration-persistence task | not-applicable: no frontend work | not-applicable |

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
| T-S005-01 | new-migration | Inspect `src/features/harnessChat/persistence/migrations/*harness_chat*`, `tests/harness/postgres/migrations.ts`, and live-schema output before editing for absence or drift of `harness_chat_conversations` and `harness_chat_messages` plus expected indexes. | Source data shape validation uses `docs/data-dictionary/harness-chat-conversation.md`, `docs/data-dictionary/harness-chat-message.md`, and `docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md`; no backfill source rows exist for the new tables. | Per-row eligibility is not-applicable: no existing rows transformed; future writes validate actor, root/future tenant scope, lifecycle, and context fields. | rejected-row behavior: fail atomically on invalid future write and do not persist partial conversation/message facts. | new migration with sortable zero-padded .sql identity; applied migration files remain untouched. | SQL execution semantics check covers table creation, foreign keys, unique conversation/message sequence indexes, system-managed timestamps, and transaction visibility. | Representative read/write proof creates conversation, appends ordered message, refreshes updated_at, and reads root-visible history. | Review tests/harness/postgres/migrations.ts, tests/harness/postgres/testDatabase.ts, and package persistence scripts; update only if new migration loading requires it. |
| T-S005-02 | new-migration | Inspect `src/features/harnessChat/persistence/migrations/*harness_chat*`, `tests/harness/postgres/migrations.ts`, and live-schema output before editing for absence or drift of `harness_chat_packet_revisions` and packet supersession indexes. | Source data shape validation uses `docs/data-dictionary/harness-chat-packet-revision.md`, `docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md`, and `docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md`; no backfill source rows exist for the new table. | Per-row eligibility validates conversation exists, packet data is approved, version is next for conversation, and superseded links are consistent. | rejected-row behavior: fail atomically on invalid packet data, duplicate version, missing conversation, or inconsistent supersession. | new migration with sortable zero-padded .sql identity; applied migration files remain untouched. | SQL execution semantics check covers table creation, foreign keys, unique conversation/version constraint, current/superseded linkage, lifecycle state constraints, and transaction visibility. | Representative read/write proof generates packet revision, supersedes prior revision, reads current and previous/next links, and preserves failed state without invalid successful packet. | Review tests/harness/postgres/migrations.ts, tests/harness/postgres/testDatabase.ts, and package persistence scripts; update only if new migration loading requires it. |

## Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S005-01 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and read/write paths. | harness_chat_conversations and harness_chat_messages schema, foreign keys, lifecycle fields, retention posture, actor/scope/context facts, system timestamps, and indexes. | Persistence read/write tests for create conversation, append message, ordered transcript read, updated_at refresh, and root-visible history. | API behavior routes to DOC:api-contract/DEV:backend; permission proof routes to DOC:permission-mapping; evidence capture routes to EVIDENCE:qa-evidence. |
| T-S005-02 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and read/write paths. | harness_chat_packet_revisions schema, conversation/version uniqueness, lifecycle states, supersession links, approved packet data, actor/scope facts, and PDF attempt relationship boundary. | Persistence read/write tests for create packet revision, supersede previous revision, read current/history, and reject invalid duplicate or missing conversation writes. | PDF delivery proof routes to S-003/S-006; data dictionary final sweep routes to DOC:data-dictionary; executable evidence routes to EVIDENCE:qa-evidence. |

## Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S005-01 | narrow-pattern | src/features/harnessChat/**; tests/integration/harnessChat/**; tests/harness/postgres/**; docs/data-dictionary/harness-chat-conversation.md; docs/data-dictionary/harness-chat-message.md; docs/architecture/generated/feature-dependency-graph.* | Narrow harness-chat persistence and test harness paths only. |
| T-S005-02 | narrow-pattern | src/features/harnessChat/**; tests/integration/harnessChat/**; tests/harness/postgres/**; docs/data-dictionary/harness-chat-packet-revision.md; docs/data-dictionary/harness-chat-pdf-attempt.md; docs/architecture/generated/feature-dependency-graph.* | Narrow harness-chat packet persistence and test harness paths only. |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Focused Proof Command Or Evidence | Mock-Honesty Note |
| --- | --- | --- | --- |
| T-S005-01 | task-specific | npx vitest run tests/integration/harnessChat; npm run check:feature-dependencies; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation/story.md | Persistence fixtures must match data dictionary fields and not invent missing fallback states. |
| T-S005-02 | task-specific | npx vitest run tests/integration/harnessChat; npm run check:feature-dependencies; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation/story.md | Packet fixtures must use approved packet data shape and not invent PDF fallback behavior. |

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
| T-S005-01 | Do not infer tenant-builder activation, tenant-scoped runtime access, API route behavior, or UI history behavior from persistence storage. | Route to Product Discovery/Technical Steering or S-006/S-007. |
| T-S005-02 | Do not infer public PDF delivery, stored PDF asset behavior, arbitrary packet mutation, or automatic deletion/expiry from packet revision storage. | Route to S-003, S-006, data dictionary, or Technical Steering. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Guardrail Reference | Approval Status | Notes |
| --- | --- | --- | --- | --- |
| T-S005-01 | DEV:migration-persistence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/migration-persistence-task-guardrail.md | approved | Migration guardrail reviewed for new tables, live schema, SQL semantics, rejected-row behavior, indexes, read/write proof, and Postgres harness impact. |
| T-S005-02 | DEV:migration-persistence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/migration-persistence-task-guardrail.md | approved | Migration guardrail reviewed for packet revisions, supersession, lifecycle states, approved packet data, read/write proof, and Postgres harness impact. |

## Task Guardrail Evidence

| Task ID | Check ID | Status | Evidence / Rationale |
| --- | --- | --- | --- |
| T-S005-01 | migration-source-authority | pass | Data dictionary, PRD, Technical Steering, and implementation blueprint approve conversation/message storage. |
| T-S005-01 | migration-change-class | pass | Change type is new-migration. |
| T-S005-01 | migration-live-schema | pass | Task requires live schema and migration file inspection before editing. |
| T-S005-01 | migration-storage-decision-boundary | pass | Storage model is consumed from approved data dictionary; no new model decision. |
| T-S005-01 | migration-source-data-shape | pass | New tables require no backfill; future source data is API/domain validated. |
| T-S005-01 | migration-per-row-eligibility | pass | No existing rows transformed; future writes validate actor/scope/lifecycle/context. |
| T-S005-01 | migration-rejected-row-behavior | pass | Invalid writes fail atomically. |
| T-S005-01 | migration-compatibility-repair | pass | Applied migrations are untouched; unexpected live drift routes before mutation. |
| T-S005-01 | migration-applied-file-safety | pass | New sortable migration; no applied migration rename/edit. |
| T-S005-01 | migration-index-normalization-uniqueness | pass | Unique message sequence and lookup indexes required. |
| T-S005-01 | migration-security-tenant-proof | pass | Root/future tenant scope facts stored durably; runtime access proof split to S-006. |
| T-S005-01 | migration-read-write-proof | pass | Representative create/read/message append proof required. |
| T-S005-01 | migration-postgres-harness | pass | Shared Postgres harness impact must be reviewed. |
| T-S005-02 | migration-source-authority | pass | Data dictionary, PDF decision, PRD, and blueprint approve packet revision storage. |
| T-S005-02 | migration-change-class | pass | Change type is new-migration. |
| T-S005-02 | migration-live-schema | pass | Task requires live schema and migration file inspection before editing. |
| T-S005-02 | migration-storage-decision-boundary | pass | Storage model is consumed from approved packet revision dictionary. |
| T-S005-02 | migration-source-data-shape | pass | New table requires approved packet data input and existing conversation. |
| T-S005-02 | migration-per-row-eligibility | pass | Conversation existence, next version, approved packet data, and supersession consistency checked. |
| T-S005-02 | migration-rejected-row-behavior | pass | Invalid packet writes fail atomically. |
| T-S005-02 | migration-compatibility-repair | pass | Applied migrations are untouched; unexpected live drift routes before mutation. |
| T-S005-02 | migration-applied-file-safety | pass | New sortable migration; no applied migration rename/edit. |
| T-S005-02 | migration-index-normalization-uniqueness | pass | Unique conversation/version and supersession indexes required. |
| T-S005-02 | migration-security-tenant-proof | pass | Actor/scope and immutable packet data facts preserved for later access proof. |
| T-S005-02 | migration-read-write-proof | pass | Representative create/read/supersede proof required. |
| T-S005-02 | migration-postgres-harness | pass | Shared Postgres harness impact must be reviewed. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Shared-Code Guardrail Required | Compatibility / Move Notes | Review Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-01 | feature-local | harness-chat persistence | harness-chat persistence | no | not-applicable | Feature-local persistence; no shared extraction. | approved |
| T-S005-02 | feature-local | harness-chat persistence | harness-chat persistence | no | not-applicable | Feature-local persistence; no shared extraction. | approved |

## Allowed Write Set Classification

| Task ID | Path | Write Class | Reason |
| --- | --- | --- | --- |
| T-S005-01 | src/features/harnessChat/** | feature-local | Feature-owned persistence/domain/repository code. |
| T-S005-01 | src/features/harnessChat/persistence/migrations/*harness_chat* | feature-local | New harness-chat migration. |
| T-S005-01 | tests/integration/harnessChat/**; tests/harness/postgres/** | test | Persistence and harness proof. |
| T-S005-02 | src/features/harnessChat/** | feature-local | Feature-owned packet persistence/domain/repository code. |
| T-S005-02 | src/features/harnessChat/persistence/migrations/*harness_chat* | feature-local | New harness-chat migration. |
| T-S005-02 | tests/integration/harnessChat/**; tests/harness/postgres/** | test | Packet lifecycle persistence and harness proof. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S005-01 | API routes, permission mapping, root-admin UI, packet revision lifecycle, PDF delivery, evidence sweep, tenant-builder activation | Keep storage task narrow and non-contaminating. |
| T-S005-02 | API routes, permission mapping, root-admin UI, PDF renderer, public delivery, evidence sweep, tenant-builder activation | Keep packet storage task narrow and non-contaminating. |

## Task Acceptance Criteria Coverage

| Task ID | AC ID | Coverage Notes |
| --- | --- | --- |
| T-S005-01 | AC-S005-01 | Covers conversation/message durable facts, lifecycle, retention, and timestamps. |
| T-S005-02 | AC-S005-02 | Covers packet revision lifecycle, supersession, and durable packet history. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) | Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S005-01 | chatInterface.persistConversation | approved | Capability row exists or must be refreshed by artifact alignment. |
| T-S005-02 | chatInterface.persistPacketVersion | approved | Capability row exists or must be refreshed by artifact alignment. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S005-01 | not-applicable: approved data dictionary exists | Conversation/message storage source truth exists. | no |
| T-S005-02 | T-S005-01 | Packet revisions require an owning conversation. | no |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S005-01 | not-applicable: feature-local persistence | not-applicable | not-applicable | Data dictionary owns storage truth. |
| T-S005-02 | not-applicable: feature-local persistence | not-applicable | not-applicable | Data dictionary and PDF decision own storage truth. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S005-01 | data dictionary and implementation blueprint | prove-current | data-dictionary-maintainer / implementation blueprint | yes |
| T-S005-02 | data dictionary, PDF decision, PRD-derived test cases | prove-current | data-dictionary-maintainer / PRD test planning | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S005-01 | persistence-level | npx vitest run tests/integration/harnessChat; npm run check:feature-dependencies; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation/story.md | Persistence fixtures must match live schema and data dictionary. |
| T-S005-02 | persistence-level | npx vitest run tests/integration/harnessChat; npm run check:feature-dependencies; npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-005-conversation-and-packet-history-foundation/story.md | Packet fixtures must match approved packet data and supersession rules. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-01 | not-applicable: DEV:migration-persistence focused proof | not-applicable: evidence capture split to S-008 | not-applicable | not-applicable until implementation runs | not-applicable: fixture honesty in proof plan | not-applicable | not-applicable | persistence reviewer judges schema/source alignment |
| T-S005-02 | not-applicable: DEV:migration-persistence focused proof | not-applicable: evidence capture split to S-008 | not-applicable | not-applicable until implementation runs | not-applicable: fixture honesty in proof plan | not-applicable | not-applicable | persistence reviewer judges schema/source alignment |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |

## Branch Worktree Bootstrap Strategy

| Task ID | Suggested Branch | Worktree Strategy | Bootstrap Source | Base Ref | Pre-Edit Check | Promote Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S005-01 | codex/s005-conversation-message-persistence | dedicated task branch | story-local task packet | origin/main | inspect live schema and migration files before edits | main after promote guardrail |
| T-S005-02 | codex/s005-packet-revision-persistence | dedicated task branch after T-S005-01 | story-local task packet | origin/main | confirm T-S005-01 schema exists | main after promote guardrail |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S005-01 | queued-for-delivery | none | Layer 5 migration-persistence pilot candidate after T-S004-01. |
| T-S005-02 | queued-for-delivery | none | Queue after T-S005-01 in execution order because packet revisions need conversations. |
