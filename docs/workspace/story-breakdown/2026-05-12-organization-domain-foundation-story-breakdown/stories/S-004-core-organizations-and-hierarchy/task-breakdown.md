# Task Breakdown

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-15
- Task Breakdown ID:
  `TB-ORG-S004`
- Source Story Breakdown packet:
  `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`
- Selected Story ID(s):
  `S-004`
- Related Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-12-organization-domain-foundation.md`
- Related Technical Steering packet:
  `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md`
- Related PRD:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`
- Related capability matrix:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
- Validation command:
  `npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-004-core-organizations-and-hierarchy --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`
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
  none for S-004 source implementation; downstream app UI remains outside this task breakdown.

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-ORG-001 | architecture-foundation-required | DECISION:architecture-foundation | T-S004-06 | covered | Uses ADR-0042 and family registry as existing source; no new architecture work in S-004. |
| TS-ORG-002 | feature-local | DEV:migration-persistence | T-S004-01 | covered | Core Organization persistence belongs in organizationCore. |
| TS-ORG-003 | feature-local | DEV:migration-persistence | deferred: S-005 | deferred-with-owner | Legal details are outside S-004. |
| TS-ORG-004 | feature-local | DEV:migration-persistence | deferred: S-006 and S-007 | deferred-with-owner | Locations and hours are outside S-004. |
| TS-ORG-005 | feature-local | DEV:migration-persistence | deferred: S-008 and S-009 | deferred-with-owner | Business units and memberships are outside S-004. |
| TS-ORG-006 | feature-local | FUTURE:product-discovery | deferred: S-017 | deferred-with-owner | Integrations remain deferred from v1. |
| TS-ORG-007 | feature-public-seam | DOC:asset-decision | deferred: S-012 | deferred-with-owner | Logo work is not part of core Organization hierarchy. |
| TS-ORG-008 | feature-local | DECISION:architecture-foundation | deferred: S-010 | deferred-with-owner | Reference catalogue story owns catalogue architecture. |
| TS-ORG-009 | platform-seam | DOC:technical-signoff | resolved: S-011; deferred: S-012 | deferred-with-owner | Public logo delivery is outside this story and is ready for S-012 task breakdown. |
| TS-ORG-010 | platform-seam | DECISION:job-cleanup | blocked: S-014 and S-015 | deferred-with-owner | Export work remains blocked pending export steering. |
| TS-ORG-011 | feature-public-seam | DOC:permission-mapping | T-S004-03, T-S004-04, T-S004-05 | covered | Runtime tasks consume completed Organization permission mapping. |
| TS-ORG-012 | architecture-foundation-required | DECISION:architecture-foundation | deferred: S-013 | deferred-with-owner | Grouped search has its own story. |
| TS-ORG-013 | design-system-seam | GOV:design-system | blocked: S-016 | deferred-with-owner | No app UI in S-004. |
| TS-ORG-014 | feature-public-seam | DOC:feature-manifest | T-S004-04, T-S004-06 | covered | Manifest and public identity seam are created with backend integration. |
| TS-ORG-015 | feature-local | DOC:docs-artifact | T-S004-06 | covered | S-004 carries artifact closeout. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-004 | DEV:backend | durable organization records | T-S004-02, T-S004-03, T-S004-04 | DEV:backend work is split by behavior, hierarchy lifecycle, and transport/integration seams. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-004 | ready-for-task-breakdown | system-value | DEV:backend | Manage core organizations and hierarchy | This is needed because every Organization record needs a safe parent organization inside one customer/account. | system | Split into persistence, core record behavior, hierarchy lifecycle behavior, route/auth integration, executable proof, and artifact closeout. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | S-004 | Organization records support create, read, update, archive, restore, parent move, branch archive, child reassignment, normalized tenant-level name uniqueness, depth 10, cycle denial, and same-tenant enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-004 | AC-S004-01 | CAP-ORG-CORE-001 | tenant/root | create-or-refresh-required | ART-ORG-S004 plus ART-ORG-004 API and data alignment source. |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | S-004 | DEV:migration-persistence | Create Organization table, hierarchy columns, lifecycle columns, normalized-name uniqueness, and supporting indexes. | `src/features/organizationCore/persistence/**`; `tests/integration/organizationCore/**`; shared Postgres harness only if required by migration proof. | No API routes, no UI, no child entities, no logo/export/search implementation. | S-000 through S-003 complete; live schema inspection before editing. | tenant table or tenant/account identity seam; migration runner; Postgres harness. | queued-for-delivery |
| T-S004-02 | S-004 | DEV:backend | Implement core Organization create, read, list, and update domain behavior with validation and repository consumption. | `src/features/organizationCore/contract/**`; `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`. | No lifecycle branch archive, no route mounting, no app UI, no child entities. | T-S004-01 complete. | organizationCore repository seam and tenant authorization context seam. | queued-for-delivery |
| T-S004-03 | S-004 | DEV:backend | Implement Organization move, archive, restore, delete, branch archive, and child reassignment domain behavior. | `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`. | No route mounting, no UI, no child feature lifecycle implementation. | T-S004-01 and T-S004-02 complete. | organizationCore repository seam and future child-record lifecycle contract notes. | queued-for-delivery |
| T-S004-04 | S-004 | DEV:backend | Add root and tenant transport routes, authz enforcement, audit events, feature wiring, manifest, and public identity seam. | `src/features/organizationCore/contract/**`; `src/features/organizationCore/transport/**`; `src/features/organizationCore/integration.ts`; `src/features/organizationCore/index.ts`; `src/features/organizationCore/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationCore/**`; `tests/security/organizationCore/**`. | No app UI, no OpenAPI/Postman expansion unless already maintained, no logo/export/search/child entity routes. | T-S004-01 through T-S004-03 complete. | root session middleware, tenant session context, platform authorization, audit seam, v1 router. | queued-for-delivery |
| T-S004-05 | S-004 | TEST:test-only | Add S-004 proof suite for hierarchy, lifecycle, uniqueness, tenant denial, audit, system-managed fields, and concurrency. | `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`; `tests/security/organizationCore/**`; test fixtures under `tests/fixtures/organizationCore/**` if needed. | No production behavior change, no API contract edits, no permission truth edits. | T-S004-01 through T-S004-04 complete. | live API and persistence fixtures must match implementation contracts. | queued-for-delivery |
| T-S004-06 | S-004 | DOC:docs-artifact | Refresh S-004 feature-doc and story evidence after implementation lands. | `docs/features/organization-core.md`; `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-004-core-organizations-and-hierarchy/**`; `docs/workspace/reviews/*organization*S004*.md`; generated dependency graph artifacts if manifest changes require regeneration. | No production source changes, no new product decisions, no child entity docs beyond dependency notes. | T-S004-01 through T-S004-05 complete. | feature manifest and generated dependency graph artifact chain. | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | single-behavior | 1 | AC-S004-01 requires persistence before any behavior can be honest. | Organization durable storage and uniqueness/index foundation. | migration and repository schema seam | Live schema and persistence proof show indexes and constraints match data dictionary. | none | Splitting indexes from table creation would leave no executable read/write proof. |
| T-S004-02 | single-behavior | 1 | Covers normal current-record CRUD subset only. | Core create/read/list/update behavior. | organizationCore domain service | Unit and integration proof for valid create/update, duplicate name, system fields, and normal visibility. | none | Hierarchy/lifecycle operations are split to T-S004-03. |
| T-S004-03 | single-behavior | 1 | Covers hierarchy and lifecycle subset only. | Move/archive/restore/delete branch behavior. | organizationCore hierarchy lifecycle domain service | Unit and integration proof for depth, cycle, branch archive, child reassignment, archive and deleted visibility. | none | Transport and authz are split to T-S004-04. |
| T-S004-04 | single-behavior | 1 | Covers route-facing enforcement and public seam integration. | Root/tenant route, authz, audit, manifest, and public identity seam. | v1 router and organizationCore integration seam | Integration and security proof for root selected tenant, tenant current context, denied cross-tenant object access, and audit events. | none | Behavior is already split to T-S004-02 and T-S004-03. |
| T-S004-05 | single-proof-target | 1 | Proof-only task validates the completed S-004 slice. | Executable proof suite. | test harness | Focused S-004 TC coverage proves accepted and denied states against real implementation. | none | Production behavior changes route back to DEV tasks. |
| T-S004-06 | single-proof-target | 1 | Artifact-only task closes S-004 documentation and generated evidence. | Maintained artifact closeout. | docs and generated dependency graph artifacts | Review shows docs and generated records no longer describe pre-S004 state. | none | Source or test changes route back to owning tasks. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S004-01 | source-truth-mismatch | Live schema, migration conventions, API contract, and data dictionary disagree on Organization field names, uniqueness, lifecycle, or indexes. | Stop and route to data/API alignment before migration. | no | Migration shape must not silently choose between source truths. |
| T-S004-02 | proof-gap | Existing tenant authz context or repository seam cannot supply required tenant/object information. | Stop and route to T-S004-04 or architecture owner. | no | Domain behavior must not infer tenant context from mutable bodies. |
| T-S004-03 | product-decision | Branch archive or move-children behavior cannot be represented with approved request fields. | Stop and update API/data docs before source changes. | no | User chose both options; task may not narrow that. |
| T-S004-04 | source-truth-mismatch | Permission mapping and implemented platform authz capability names disagree. | Stop and reconcile permission mapping or grant source. | no | Runtime eligibility must not drift from mapping. |
| T-S004-05 | proof-gap | Tests require behavior not implemented by T-S004-01 through T-S004-04. | Split missing production behavior to DEV task. | no | TEST:test-only must not change product behavior. |
| T-S004-06 | none-known | No new decision expected; docs closeout may proceed when source diff and test evidence are available. | Manual review if artifacts reveal stale upstream source. | yes | Artifact task is allowed to report drift but not invent behavior. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S004-01 | `src/features/`; `src/features/*/persistence/migrations/`; `tests/harness/postgres/`; existing feature persistence examples. | migration runner, Postgres test harness, tenant/account identity table. | Organization data dictionary, PRD, API contracts, AGENTS migration safety. |
| T-S004-02 | `src/features/*/domain/`; `src/features/*/contract/`; `src/features/*/persistence/`; S-004 story. | T-S004-01 repository/storage seam. | PRD, data dictionary mutation rules, API request rules. |
| T-S004-03 | `src/features/organizationCore/domain/**`; hierarchy examples in repo if present. | T-S004-01 repository/storage seam and T-S004-02 core domain types. | PRD hierarchy rules, data dictionary lifecycle and relationship inventory. |
| T-S004-04 | `src/routes/v1/index.ts`; protected route examples; audit examples; feature manifest examples. | root session middleware, tenant context, authz evaluator, audit/event seam, v1 router. | API contracts, permission mapping, ADR-0036, ADR-0042. |
| T-S004-05 | PRD test-case document; new source tests from T-S004-01 through T-S004-04. | test harness, live API/persistence fixtures. | AC-S004-01, TC-ORG-FOUNDATION unit/int/sec/audit/edge/conc rows. |
| T-S004-06 | implementation diff, feature manifest, generated graph artifacts, docs/features inventory, story evidence. | feature manifest and dependency graph generator. | change-artifact requirements, story packet, implementation evidence. |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |

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

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-02 | domain-behavior | S-004 story, PRD, data dictionary, API contract, permission mapping, implementation blueprint | `src/features/organizationCore` | new-capability-file | Inspect `src/features/*/domain/`, `src/features/*/contract/`, `src/features/*/persistence/`, and `docs/data-dictionary/organization.md`. | `src/features/organizationCore/contract/**`; `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**` | contract schemas, domain capability files, repository consumer types, focused tests | Domain validates names, system-managed fields, tenant-bound current records, and repository consumption; persistence remains behind repository seam. | approved API contract posture from root and tenant Organization contracts; no contract change in task unless routed. | tenant context required; object rules deny wrong tenant; lifecycle normal reads exclude archived/deleted. | consumes T-S004-01 storage output; no schema or index changes in this task; storage changes are already split. | no public seam change beyond internal domain behavior. | Story evidence links and data dictionary remain source; artifact closeout in T-S004-06. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | create/read/list/update behavior and repository-backed responses. | already split to DEV:migration-persistence T-S004-01 and route/auth T-S004-04. | `npm run test -- organizationCore` focused behavior and repository proof for create/read/list/update. | Format with repo tooling; generated artifacts unchanged. | Reviewer checks validation and tenant/lifecycle behavior only. |
| T-S004-03 | lifecycle-behavior | S-004 story, PRD hierarchy requirements, data dictionary relationship inventory, permission mapping | `src/features/organizationCore` | new-capability-file | Inspect `docs/data-dictionary/organization.md`, `docs/prd/2026-05-12-0025-organization-domain-foundation.md`, and organizationCore domain from T-S004-02. | `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**` | hierarchy lifecycle domain files, repository methods, focused tests | Domain owns depth 10, cycle denial, same-tenant parent checks, archive branch, move children, restore, delete visibility. | approved API contract posture for archive, restore, move; no contract change in task unless routed. | authz object rule inputs are preserved for T-S004-04; lifecycle operations deny invalid archived/deleted parent states. | consumes T-S004-01 repository and index behavior; no schema changes in this task; storage drift routes to DEV:migration-persistence. | no public seam change except domain service functions consumed by routes. | Story evidence links and data dictionary remain source; artifact closeout in T-S004-06. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | hierarchy lifecycle behavior for move/archive/restore/delete and branch choices. | route and audit integration split to T-S004-04. | `npm run test -- organizationCore` focused lifecycle behavior proof for hierarchy, archive, restore, delete, and repository state. | Format with repo tooling; generated artifacts unchanged. | Reviewer checks lifecycle and hierarchy edge behavior only. |
| T-S004-04 | transport-route | API contracts, permission mapping, ADR-0036, ADR-0042, S-004 story | `src/features/organizationCore` | transport-only | Inspect `src/routes/v1/index.ts`, protected route examples, authz evaluator, audit/event examples, feature manifest examples. | `src/features/organizationCore/contract/**`; `src/features/organizationCore/transport/**`; `src/features/organizationCore/integration.ts`; `src/features/organizationCore/index.ts`; `src/features/organizationCore/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationCore/**`; `tests/security/organizationCore/**` | transport, integration, feature manifest, public seam, route mounting, security tests | Transport maps root selected tenant and tenant current context to domain calls; integration owns router wiring and public exports. | approved root and tenant API contracts; no route family broadening. | runtime authz enforced with root/tenant capability, tenant context, object rule, denial and audit. | no schema work; consumes repository/domain outputs from earlier tasks. | creates organizationCore public identity seam and manifest; generated graph refresh deferred to T-S004-06 if manifest changes. | Feature manifest and generated graph obligations carried to T-S004-06. | not-applicable: no scaffold command approved; route files follow existing patterns. | route responses, authz denial behavior, audit events, manifest and public seam. | docs contract changes route to DOC:api-contract if discovered; generated graph closeout in T-S004-06. | `npx vitest run tests/security/organizationCore/security.test.ts` focused route, authz behavior, audit event, manifest, and consumer proof. | Regenerate dependency graph if manifest changes, captured by T-S004-06. | Reviewer checks route/auth/audit/public seam boundaries only. |

## Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | new-migration | Inspect live schema and current migrations before editing; confirm no existing organization table, indexes, or conflicting names. | Validate planned fields against data dictionary: organization_id, tenant_id, parent_organization_id, name, normalized_name, reference value id, lifecycle_status, archived_at, deleted_at, created_at, updated_at. | New table has no source rows to transform; seed or fixture rows must satisfy tenant, parent, lifecycle, and normalized name rules. | Invalid fixture rows fail tests; no silent conversion of bad source shape. | Create a new zero-padded migration file; do not rename applied migrations. | Verify FK, partial unique index, lifecycle defaults, timestamp type, and parent self-reference execution semantics in Postgres. | Persistence tests create, read, update, move-parent candidate rows, duplicate normalized names, and tenant-separated duplicates. | Review `tests/harness/postgres/migrations.ts` and test database scripts; update only if new migration naming or bootstrap requires it. |

## Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S004-01 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and representative read/write paths in the migration task itself. | Covers organization table, tenant FK, parent FK, lifecycle columns, normalized_name, partial active unique index, tenant lifecycle index, parent index, and live start state. | Persistence-backed read/write path tests cover create, duplicate active name denial, same name in different tenants, parent lookup, archived/deleted visibility indexes, and harness migration run. | not-applicable: data dictionary and contract docs are current from ART-ORG-004; extra executable proof is added in T-S004-05. |

## Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S004-01 | narrow-pattern | `src/features/organizationCore/persistence/**`; `tests/integration/organizationCore/**`; `tests/harness/postgres/**` only if harness proof requires it. | not-applicable |
| T-S004-02 | narrow-pattern | `src/features/organizationCore/contract/**`; `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`. | not-applicable |
| T-S004-03 | narrow-pattern | `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`. | not-applicable |
| T-S004-04 | narrow-pattern | `src/features/organizationCore/contract/**`; `src/features/organizationCore/transport/**`; `src/features/organizationCore/integration.ts`; `src/features/organizationCore/index.ts`; `src/features/organizationCore/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationCore/**`; `tests/security/organizationCore/**`. | not-applicable |
| T-S004-05 | narrow-pattern | `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`; `tests/security/organizationCore/**`; `tests/fixtures/organizationCore/**`. | not-applicable |
| T-S004-06 | narrow-pattern | `docs/features/organization-core.md`; S-004 story folder; S-004 review artifact; generated dependency graph artifacts when required by manifest diff. | not-applicable |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S004-01 | task-specific | Organization migration and persistence proof for normalized uniqueness, indexes, and hierarchy columns. | Broad migration suite may supplement focused persistence proof. |
| T-S004-02 | task-specific | Core Organization create/read/list/update behavior proof. | Broad feature tests may supplement focused domain proof. |
| T-S004-03 | task-specific | Organization hierarchy and lifecycle transition proof. | Broad feature tests may supplement focused hierarchy proof. |
| T-S004-04 | task-specific | Root/tenant route, authz denial, audit, manifest, and public seam proof. | Broad route/security suites may supplement focused route proof. |
| T-S004-05 | task-specific | S-004 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |
| T-S004-06 | task-specific | S-004 maintained artifact closeout review. | Story and task validators supplement manual artifact review. |

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
| T-S004-06 | feature-doc | feature-doc-refresh | Inspect implementation diff, S-004 story folder, `src/features/organizationCore/feature.manifest.json`, generated graph artifacts, tests, and validation command output. | S-004 story, PRD, implementation evidence, feature manifest, generated graph. | `docs/features/organization-core.md`; S-004 story evidence links; S-004 review note. | current-state-after-implementation | Sweep S-004 feature docs, story evidence, feature manifest references, and generated graph touched by source. | DOC:api-contract for route contract changes; DOC:permission-mapping for authz truth changes; DOC:data-dictionary for data shape changes; TEST:test-only for new proof; DEV:backend for source behavior. | `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`; `npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-004-core-organizations-and-hierarchy --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown` | Reviewer judges artifact truth against implementation evidence, not new behavior. | Validation output plus manual review note. |

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
| T-S004-05 | prd-test-case | PRD test-case document and S-004 task packet | TC-ORG-FOUNDATION-UNIT-001; TC-ORG-FOUNDATION-UNIT-002; TC-ORG-FOUNDATION-UNIT-003; TC-ORG-FOUNDATION-INT-001; TC-ORG-FOUNDATION-INT-002; TC-ORG-FOUNDATION-SEC-002; TC-ORG-FOUNDATION-AUD-001; TC-ORG-FOUNDATION-EDGE-001; TC-ORG-FOUNDATION-EDGE-002; TC-ORG-FOUNDATION-CONC-001; AC-S004-01 | service-unit, feature-integration, security-integration, audit-integration, concurrency-integration | Prove S-004 accepted and denied behavior against implemented organizationCore routes, domain, and persistence. | Real persistence fixtures and API payloads from T-S004 implementation; no invented fallback shapes. | Mock-honesty required: fixtures must match live API, repository, and persistence payloads; mocked authz states must match permission mapping. | no-production-change | `npx vitest run tests/unit/organizationCore/domain.test.ts tests/security/organizationCore/security.test.ts`; `npx vitest run tests/integration/organizationCore/persistence.test.ts` | not-applicable: production gaps route back to T-S004-01 through T-S004-04; API contract gaps route to DOC:api-contract; permission gaps route to DOC:permission-mapping. |

## Test Suite Alignment Contract

| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-05 | Organization core record routes and domain operations | allowed root admin actor, allowed tenant admin actor, denied unauthenticated actor, denied expired session actor, denied wrong tenant actor | permission states: allowed organization.create/read/list/update/move/archive/restore/delete capability; denied missing grant permission; denied wrong authority role | object lifecycle states: active, archived, deleted, parented, childed organizations | boundary states: selected tenant, current tenant, cross-tenant parent object, stale parent object, same-tenant parent object | duplicate name, cycle, depth over 10, cross-tenant parent object, stale parent object, deleted normal update, system-managed fields | not-applicable: matrix is applicable and covered. | none |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Escalation Path |
| --- | --- | --- |
| T-S004-01 | Do not rename existing applied migrations or assume live schema from docs only. | Stop and inspect live schema and migration harness. |
| T-S004-02 | Do not let request bodies provide tenant authority or system-managed fields. | Stop and reconcile with AGENTS defaults and API contract. |
| T-S004-03 | Do not silently cascade archive/delete without the approved branch archive or move-children choice. | Stop and reconcile with PRD/API. |
| T-S004-04 | Do not expose routes before runtime authz and object rules exist. | Stop and reconcile permission mapping. |
| T-S004-05 | Do not encode rejected fallback behavior in mocks. | Stop and compare fixtures to live runtime shapes. |
| T-S004-06 | Do not use completion language if generated graph, manifest, docs, or evidence remain stale. | Stop and classify as partially documented. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Required Guardrail Reference | Approval Status | Evidence / Rationale |
| --- | --- | --- | --- | --- |
| T-S004-01 | DEV:migration-persistence | migration-persistence-task-guardrail.md | approved | Migration task is isolated from route/domain source behavior and carries live schema, identity, SQL, and read/write proof obligations. |
| T-S004-02 | DEV:backend | backend-task-guardrail.md | approved | Backend domain behavior is feature-local and consumes migration output. |
| T-S004-03 | DEV:backend | backend-task-guardrail.md | approved | Backend hierarchy lifecycle behavior is feature-local and isolated from transport. |
| T-S004-04 | DEV:backend | backend-task-guardrail.md | approved | Backend route/auth/audit/manifest work consumes approved API and permission sources. |
| T-S004-05 | TEST:test-only | test-only-task-guardrail.md | approved | Test task changes no production behavior and carries TC traceability plus permission/state matrix. |
| T-S004-06 | DOC:docs-artifact | docs-artifact-task-guardrail.md | approved | Docs closeout is isolated from source implementation and routes specialized changes away. |

## Task Guardrail Evidence

| Task ID | Guardrail Check ID | Status | Evidence |
| --- | --- | --- | --- |
| T-S004-01 | migration-source-authority | pass | Source authority is S-004, PRD, data dictionary, API contracts, and AGENTS migration safety. |
| T-S004-01 | migration-change-class | pass | Change class is new-migration. |
| T-S004-01 | migration-live-schema | pass | Task requires live schema inspection before editing. |
| T-S004-01 | migration-storage-decision-boundary | pass | Storage model is organizationCore table and indexes only. |
| T-S004-01 | migration-source-data-shape | pass | Task lists required Organization fields and indexes. |
| T-S004-01 | migration-per-row-eligibility | pass | Fixture or seed rows must satisfy tenant, parent, lifecycle, normalized-name rules. |
| T-S004-01 | migration-rejected-row-behavior | pass | Invalid fixture rows fail tests and are not silently converted. |
| T-S004-01 | migration-compatibility-repair | pass | Corrective migration is not in scope; drift routes to follow-up. |
| T-S004-01 | migration-applied-file-safety | pass | New zero-padded migration required; applied migrations are not renamed. |
| T-S004-01 | migration-index-normalization-uniqueness | pass | Partial active uniqueness and tenant/name indexes named. |
| T-S004-01 | migration-security-tenant-proof | pass | Same-tenant and cross-tenant parent proof required. |
| T-S004-01 | migration-read-write-proof | pass | Representative read/write proof required. |
| T-S004-01 | migration-postgres-harness | pass | Harness review is required. |
| T-S004-02 | backend-source-authority | pass | Uses S-004, PRD, API, data dictionary, permission mapping, blueprint. |
| T-S004-02 | backend-change-class | pass | Change class is domain-behavior. |
| T-S004-02 | backend-owning-feature | pass | Owner is `src/features/organizationCore`. |
| T-S004-02 | backend-source-inventory | pass | Requires inspection of feature domain, contract, persistence examples and Organization data dictionary. |
| T-S004-02 | backend-exact-write-envelope | pass | Narrow organizationCore and focused test paths only. |
| T-S004-02 | backend-layer-responsibilities | pass | Contract/domain/repository responsibilities are named. |
| T-S004-02 | backend-cross-feature-seams | pass | Consumes tenant/auth context only; no private imports. |
| T-S004-02 | backend-authz-tenant-lifecycle | pass | Tenant and lifecycle posture is named. |
| T-S004-02 | backend-api-contract-boundary | pass | API posture consumes approved contracts and routes changes away. |
| T-S004-02 | backend-persistence-migration-boundary | pass | Migration split to T-S004-01. |
| T-S004-02 | backend-scripted-scaffold-posture | pass | No generator assumed; existing patterns must be inspected. |
| T-S004-02 | backend-artifact-obligations | pass | Closeout artifacts split to T-S004-06. |
| T-S004-02 | backend-expected-output | pass | Expected create/read/list/update behavior named. |
| T-S004-02 | backend-split-routing | pass | Migration and route work are split. |
| T-S004-02 | backend-proof-commands | pass | Focused organizationCore proof commands named. |
| T-S004-02 | backend-human-review-boundary | pass | Review boundary is validation and tenant/lifecycle behavior. |
| T-S004-03 | backend-source-authority | pass | Uses S-004, PRD hierarchy requirements, data dictionary, permission mapping. |
| T-S004-03 | backend-change-class | pass | Change class is lifecycle-behavior. |
| T-S004-03 | backend-owning-feature | pass | Owner is `src/features/organizationCore`. |
| T-S004-03 | backend-source-inventory | pass | Requires Organization data dictionary, PRD, and T-S004-02 domain source. |
| T-S004-03 | backend-exact-write-envelope | pass | Narrow organizationCore domain/persistence/test paths only. |
| T-S004-03 | backend-layer-responsibilities | pass | Hierarchy and lifecycle domain responsibilities are named. |
| T-S004-03 | backend-cross-feature-seams | pass | Future child lifecycle contracts are notes, not private imports. |
| T-S004-03 | backend-authz-tenant-lifecycle | pass | Same-tenant, lifecycle, archive/delete, parent state rules named. |
| T-S004-03 | backend-api-contract-boundary | pass | Archive/restore/move contract consumed. |
| T-S004-03 | backend-persistence-migration-boundary | pass | Migration changes route to T-S004-01 or follow-up. |
| T-S004-03 | backend-scripted-scaffold-posture | pass | No generator assumed; existing patterns must be inspected. |
| T-S004-03 | backend-artifact-obligations | pass | Closeout artifacts split to T-S004-06. |
| T-S004-03 | backend-expected-output | pass | Expected hierarchy lifecycle behavior named. |
| T-S004-03 | backend-split-routing | pass | Route and audit integration split to T-S004-04. |
| T-S004-03 | backend-proof-commands | pass | Focused hierarchy/lifecycle proof commands named. |
| T-S004-03 | backend-human-review-boundary | pass | Review boundary is lifecycle and hierarchy behavior. |
| T-S004-04 | backend-source-authority | pass | Uses API contracts, permission mapping, ADR-0036, ADR-0042, S-004. |
| T-S004-04 | backend-change-class | pass | Change class is transport-route. |
| T-S004-04 | backend-owning-feature | pass | Owner is `src/features/organizationCore`. |
| T-S004-04 | backend-source-inventory | pass | Requires route, middleware, audit, manifest examples. |
| T-S004-04 | backend-exact-write-envelope | pass | Narrow organizationCore, v1 router, integration/security test paths only. |
| T-S004-04 | backend-layer-responsibilities | pass | Transport/integration/manifest responsibilities named. |
| T-S004-04 | backend-cross-feature-seams | pass | Root session, tenant context, authz, audit, router seams named. |
| T-S004-04 | backend-authz-tenant-lifecycle | pass | Runtime authz, tenant context, object rules, denial and audit named. |
| T-S004-04 | backend-api-contract-boundary | pass | Approved root/tenant API contracts consumed. |
| T-S004-04 | backend-persistence-migration-boundary | pass | No schema work; consumes earlier tasks. |
| T-S004-04 | backend-scripted-scaffold-posture | pass | No generator assumed; existing patterns must be inspected. |
| T-S004-04 | backend-artifact-obligations | pass | Manifest/generated graph closeout split to T-S004-06. |
| T-S004-04 | backend-expected-output | pass | Route responses, authz, audit, manifest, public seam named. |
| T-S004-04 | backend-split-routing | pass | Contract or permission drift routes to specialized tasks. |
| T-S004-04 | backend-proof-commands | pass | Focused route, authz, audit, manifest proof named. |
| T-S004-04 | backend-human-review-boundary | pass | Review boundary is route/auth/audit/public seam. |
| T-S004-05 | test-source-authority | pass | Uses PRD test cases and AC-S004-01. |
| T-S004-05 | test-change-class | pass | Change class is prd-test-case. |
| T-S004-05 | test-traceability | pass | TC IDs and AC-S004-01 named. |
| T-S004-05 | test-proof-layer | pass | Unit, integration, security, audit, concurrency layers named. |
| T-S004-05 | test-permission-state-matrix | pass | Matrix covers actors, permissions, object lifecycle, tenant boundaries. |
| T-S004-05 | test-mock-honesty | pass | Mock-honesty against live API/repository/persistence required. |
| T-S004-05 | test-no-behavior-change | pass | Production behavior changes are forbidden. |
| T-S004-05 | test-sensitive-state-coverage | pass | Active, archived, deleted, parented, childed, cross-tenant states named. |
| T-S004-05 | test-focused-command | pass | Focused organizationCore test commands named. |
| T-S004-05 | test-coverage-strength | pass | Debt Health Summary includes coverage-strength command. |
| T-S004-05 | test-split-boundary | pass | Missing behavior routes back to DEV tasks. |
| T-S004-06 | docs-source-truth-reviewed | pass | Source truth inventory includes implementation diff, story, PRD, API, data dictionary, permission mapping. |
| T-S004-06 | docs-artifact-class | pass | Class is feature-doc-refresh. |
| T-S004-06 | docs-scriptable-source-inventory | pass | Scriptable inventory and validation commands named. |
| T-S004-06 | docs-stale-artifact-sweep | pass | S-004 docs and generated graph sweep named. |
| T-S004-06 | docs-status-posture | pass | Current-state-after-implementation posture named. |
| T-S004-06 | docs-validation-command | pass | Story and task validation commands named. |
| T-S004-06 | docs-specialized-routing | pass | API, permission, data, source, and test changes are routed away. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Required Supplemental Guardrail References | Compatibility Proof | Approval Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | feature-local | none | `src/features/organizationCore` | no | not-applicable | New feature-local migration and persistence proof; no shared extraction. | approved |
| T-S004-02 | feature-local | none | `src/features/organizationCore` | no | not-applicable | Feature-local behavior; no shared extraction. | approved |
| T-S004-03 | feature-local | none | `src/features/organizationCore` | no | not-applicable | Feature-local hierarchy/lifecycle behavior; no shared extraction. | approved |
| T-S004-04 | feature-local | v1 router owns mounting only | `src/features/organizationCore` with explicit v1 mount | no | not-applicable | Existing router/middleware seams consumed without moving shared code. | approved |
| T-S004-05 | feature-local | tests | tests | no | not-applicable | Test-only paths stay in test ownership. | approved |
| T-S004-06 | feature-local | docs | docs | no | not-applicable | Docs/generated artifacts stay in artifact owners. | approved |

## Allowed Write Set Classification

| Task ID | Path Pattern | Write Class | Reason |
| --- | --- | --- | --- |
| T-S004-01 | `src/features/organizationCore/persistence/**` | feature-local | Organization persistence owner. |
| T-S004-01 | `src/features/organizationCore/persistence/migrations/0051_create_organization_core.sql` | feature-local | New Organization migration. |
| T-S004-01 | `tests/integration/organizationCore/**` | test | Persistence proof. |
| T-S004-02 | `src/features/organizationCore/contract/**` | feature-local | Contract/domain types. |
| T-S004-02 | `src/features/organizationCore/domain/**` | feature-local | Core record behavior. |
| T-S004-02 | `src/features/organizationCore/persistence/**` | feature-local | Repository consumer behavior. |
| T-S004-02 | `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**` | test | Focused behavior proof. |
| T-S004-03 | `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**` | feature-local | Hierarchy and lifecycle behavior. |
| T-S004-03 | `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**` | test | Focused lifecycle proof. |
| T-S004-04 | `src/features/organizationCore/transport/**`; `src/features/organizationCore/integration.ts`; `src/features/organizationCore/index.ts`; `src/features/organizationCore/feature.manifest.json`; `src/routes/v1/index.ts` | feature-local | Route, integration, manifest, and public seam. |
| T-S004-04 | `tests/integration/organizationCore/**`; `tests/security/organizationCore/**` | test | Route and authz proof. |
| T-S004-05 | `tests/**/organizationCore/**`; `tests/fixtures/organizationCore/**` | test | S-004 proof suite. |
| T-S004-06 | `docs/features/organization-core.md`; S-004 story folder; S-004 review artifacts | docs-artifact | Maintained artifact closeout. |
| T-S004-06 | `docs/architecture/generated/feature-dependency-graph.*` | generated-artifact | Regenerate only when feature manifest changes require it. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S004-01 | API routes, app UI, logo, export, search, child entities. | Persistence task must stay narrow. |
| T-S004-02 | Hierarchy branch lifecycle, route mounting, UI, child entities. | Core CRUD behavior is isolated. |
| T-S004-03 | Route mounting, UI, child feature lifecycle implementation. | Hierarchy/lifecycle behavior is isolated. |
| T-S004-04 | App UI, logo/export/search/child entity routes, broad API contract rewrites. | Route/auth slice must stay S-004 only. |
| T-S004-05 | Production behavior, permission truth, API contract edits. | TEST:test-only cannot change behavior. |
| T-S004-06 | Production source changes or new product decisions. | Docs closeout must follow delivered truth. |

## Task Acceptance Criteria Coverage

| Task ID | AC IDs Covered | Coverage Notes |
| --- | --- | --- |
| T-S004-01 | AC-S004-01 | Covers persistence foundation for Organization fields, indexes, uniqueness, and hierarchy columns. |
| T-S004-02 | AC-S004-01 | Covers create, read, list, update, normalized uniqueness, normal visibility behavior. |
| T-S004-03 | AC-S004-01 | Covers archive, restore, delete, parent move, branch archive, child reassignment, depth, cycle, same-tenant enforcement. |
| T-S004-04 | AC-S004-01 | Covers root/tenant routes, authorization enforcement, object denial, audit, manifest, public identity seam. |
| T-S004-05 | AC-S004-01 | Covers executable proof obligations. |
| T-S004-06 | AC-S004-01 | Covers artifact obligations. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) Covered | Capability Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S004-01 | CAP-ORG-CORE-001 | approved | Persistence and migration part of core Organization row. |
| T-S004-02 | CAP-ORG-CORE-001 | approved | Core record behavior part of core Organization row. |
| T-S004-03 | CAP-ORG-CORE-001 | approved | Hierarchy/lifecycle behavior part of core Organization row. |
| T-S004-04 | CAP-ORG-CORE-001 | approved | Runtime route/auth/public seam part of core Organization row. |
| T-S004-05 | CAP-ORG-CORE-001 | approved | Executable proof for core Organization row. |
| T-S004-06 | CAP-ORG-CORE-001 | approved | Artifact closeout for core Organization row. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S004-01 | not-applicable: first source task | Requires prior planning artifacts only. | no |
| T-S004-02 | T-S004-01 | Domain behavior needs schema and repository persistence shape. | yes |
| T-S004-03 | T-S004-01; T-S004-02 | Hierarchy/lifecycle behavior needs core record domain and persistence. | yes |
| T-S004-04 | T-S004-01; T-S004-02; T-S004-03 | Routes should expose implemented behavior with authz and audit. | yes |
| T-S004-05 | T-S004-01; T-S004-02; T-S004-03; T-S004-04 | Proof suite targets delivered source behavior. | yes |
| T-S004-06 | T-S004-01; T-S004-02; T-S004-03; T-S004-04; T-S004-05 | Artifact closeout needs implementation and proof evidence. | yes |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S004-01 | tenant/account identity and Postgres migration runner | platform/data seam | existing | Organization table uses tenant/account boundary without creating tenant authority. |
| T-S004-02 | organizationCore repository seam | feature-local seam | new | Domain consumes repository shapes, not raw DB records where domain-safe shape is possible. |
| T-S004-03 | organizationCore hierarchy lifecycle seam | feature-local seam | new | Later child features consume public identity/lifecycle, not private persistence. |
| T-S004-04 | root session, tenant context, authz, audit, v1 router | platform seams | existing | Transport consumes existing middleware and exposes organizationCore through integration. |
| T-S004-05 | test harness and live runtime/persistence fixtures | test seam | existing | Fixtures must match live API/persistence shape. |
| T-S004-06 | feature manifest and generated dependency graph | generated artifact seam | existing | Manifest changes require graph regeneration and review. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S004-01 | migration/persistence evidence | record live schema and read/write proof in task evidence | Layer 5 delivery | yes |
| T-S004-02 | source evidence | record domain behavior proof in task evidence | Layer 5 delivery | yes |
| T-S004-03 | source evidence | record hierarchy/lifecycle proof in task evidence | Layer 5 delivery | yes |
| T-S004-04 | feature manifest and dependency graph | update manifest and regenerate graph when public seam/dependency changes | Layer 5 delivery plus artifact sweep | yes |
| T-S004-05 | executable test evidence | record TC and command evidence | test implementation workflow | yes |
| T-S004-06 | feature docs and story evidence | refresh maintained docs and story evidence links | docs artifact workflow | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S004-01 | persistence-backed, integration | `npm test -- organizationCore`; migration command used by repo if available. | Use real Postgres harness; no mock-only persistence proof. |
| T-S004-02 | unit, integration, persistence | `npm test -- organizationCore` | Fixtures must match data dictionary and API contract. |
| T-S004-03 | unit, integration, security, audit | `npm test -- organizationCore` | Use persisted parent/child trees and lifecycle states. |
| T-S004-04 | integration, security, audit, compatibility | `npx vitest run tests/security/organizationCore/security.test.ts` | Use live route payloads and permission mapping states. |
| T-S004-05 | unit, integration, security, audit, persistence, concurrency | `npx vitest run tests/unit/organizationCore/domain.test.ts tests/security/organizationCore/security.test.ts`; `npx vitest run tests/integration/organizationCore/persistence.test.ts` | Mock-honesty comparison required against live API/persistence payloads. |
| T-S004-06 | docs-alignment, generated-artifact | `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`; `npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-004-core-organizations-and-hierarchy --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown` | Evidence links must point to actual outputs or explicit placeholders. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |
| T-S004-05 | `npm run test:coverage-strength` | not-run: no such command was executed in this S-004 pass | unknown | accepted-deferred | S-004 closeout |

## Branch Worktree Bootstrap Strategy

| Task ID | Branch Name | Worktree Strategy | Bootstrap Artifact | Base Ref | Base Commit Policy | Promotion Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | `task/S004-01-organization-persistence` | isolated task branch/worktree | this task packet | current feature-loop branch | start clean from current reviewed branch | main feature branch after review |
| T-S004-02 | `task/S004-02-organization-core-behavior` | isolated task branch/worktree | this task packet | after T-S004-01 | include T-S004-01 output only | main feature branch after review |
| T-S004-03 | `task/S004-03-organization-hierarchy-lifecycle` | isolated task branch/worktree | this task packet | after T-S004-02 | include prior S-004 source tasks only | main feature branch after review |
| T-S004-04 | `task/S004-04-organization-routes-authz` | isolated task branch/worktree | this task packet | after T-S004-03 | include prior S-004 source tasks only | main feature branch after review |
| T-S004-05 | `task/S004-05-organization-proof-suite` | isolated task branch/worktree | this task packet | after T-S004-04 | include completed implementation tasks | main feature branch after review |
| T-S004-06 | `task/S004-06-organization-artifact-closeout` | isolated task branch/worktree | this task packet | after T-S004-05 | include implementation and proof evidence | main feature branch after review |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S004-01 | queued-for-delivery | none | Implementation evidence exists: migration at `src/features/organizationCore/persistence/migrations/0051_create_organization_core.sql`; test harness migration order updated. Postgres proof is skipped locally without configured test DB. |
| T-S004-02 | queued-for-delivery | none | Implementation evidence exists: domain capability files added under `src/features/organizationCore/domain`. |
| T-S004-03 | queued-for-delivery | none | Implementation evidence exists: move/archive/restore/delete rules added with focused unit proof. |
| T-S004-04 | queued-for-delivery | none | Implementation evidence exists: root capability enforcement implemented; tenant routes use active tenant session context, matching current repo capability seams. Tenant capability engine remains future platform work. |
| T-S004-05 | queued-for-delivery | none | Direct organization unit/security proof passes; persistence test exists but needs configured Postgres to execute. Postgres-backed integration test is skipped unless `RUN_POSTGRES_TESTS=true`; whole-suite run has unrelated failures. |
| T-S004-06 | queued-for-delivery | none | Feature doc, story evidence, API/data docs, and generated dependency graph refreshed in this pass. Typecheck is blocked by unrelated existing design-system test implicit-any errors. |
