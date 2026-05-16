# Task Breakdown

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-15
- Task Breakdown ID:
  `TB-ORG-S007`
- Source Story Breakdown packet:
  `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`
- Selected Story ID(s):
  `S-007`
- Related Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-12-organization-domain-foundation.md`
- Related Technical Steering packet:
  `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md`
- Related PRD:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`
- Related capability matrix:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
- Validation command:
  `npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-007-opening-hour-slots-and-exceptions --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`
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
  none for S-007 source implementation; app UI, grouped search, private export job assembly, recurring holiday calendars, seasonal schedules, and external opening-hour feeds remain outside this task breakdown.

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-ORG-001 | architecture-foundation-required | DECISION:architecture-foundation | deferred: S-003 complete | deferred-with-owner | Domain family metadata is already governed before S-007 source work. |
| TS-ORG-002 | feature-local | DEV:migration-persistence | deferred: S-004 complete | deferred-with-owner | Organization core records are a prerequisite consumed by S-007. |
| TS-ORG-003 | feature-local | DEV:migration-persistence | deferred: S-005 complete | deferred-with-owner | Legal profiles are a completed prerequisite sibling, not part of S-007. |
| TS-ORG-004 | feature-local | DEV:migration-persistence | T-S007-01 | covered | Weekly slots and exceptions belong in the planned `organizationOpeningHours` feature bundle for this backend slice. |
| TS-ORG-005 | feature-local | DEV:migration-persistence | deferred: S-008 and S-009 | deferred-with-owner | Business units and memberships are outside S-007. |
| TS-ORG-006 | feature-local | FUTURE:product-discovery | deferred: S-017 | deferred-with-owner | Integrations remain deferred from v1. |
| TS-ORG-007 | feature-public-seam | DOC:asset-decision | deferred: S-012 | deferred-with-owner | Logo work is outside S-007. |
| TS-ORG-008 | feature-local | DECISION:architecture-foundation | deferred: S-010 | deferred-with-owner | Reference catalogues are outside S-007. |
| TS-ORG-009 | platform-seam | DOC:technical-signoff | resolved: S-011; deferred: S-012 | deferred-with-owner | Public logo delivery is outside this story and is ready for S-012 task breakdown. |
| TS-ORG-010 | platform-seam | DECISION:job-cleanup | blocked: S-014 and S-015 | deferred-with-owner | Export job assembly is outside S-007; S-007 only exposes hours projections for later export consumption. |
| TS-ORG-011 | feature-public-seam | DOC:permission-mapping | T-S007-03, T-S007-04 | covered | Runtime tasks consume the completed Organization permission mapping. |
| TS-ORG-012 | architecture-foundation-required | DECISION:architecture-foundation | deferred: S-013 | deferred-with-owner | Grouped search is outside S-007. |
| TS-ORG-013 | design-system-seam | GOV:design-system | blocked: S-016 | deferred-with-owner | No app UI in S-007. |
| TS-ORG-014 | feature-public-seam | DOC:feature-manifest | T-S007-03, T-S007-05 | covered | Manifest and public projection seam are created with backend integration. |
| TS-ORG-015 | feature-local | DOC:docs-artifact | T-S007-05 | covered | S-007 carries feature docs, story evidence, manifest, and generated graph closeout. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-007 | DEV:backend | opening-hour slots and exceptions | T-S007-02, T-S007-03 | DEV:backend work is split by persistence, domain behavior, transport/authz, proof, and artifact closeout. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-007 | ready-for-task-breakdown | user-value | DEV:backend | Manage opening-hour slots and exceptions | This is needed because normal weekly hours and exceptional closures need deterministic rules. | admin | Split into persistence, slot/exception behavior, route/auth/audit integration, executable proof, and artifact closeout. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | S-007 | Opening-hour slots and exceptions enforce weekday slot order, same-day open/close validation, no overlapping active slots, no overnight v1 slots, and exception precedence of closed day, replacement day, closed slot, then special opening. | persistence-level | unit, integration, security, persistence | PRD, API contract, data dictionary |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-007 | AC-S007-01 | CAP-ORG-HOURS-001 | tenant/root | create-or-refresh-required | Weekly slots and exceptions. |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | S-007 | DEV:migration-persistence | Create weekly slot and exception tables, lifecycle fields, type checks, slot-order uniqueness, and lookup indexes. | `src/features/organizationOpeningHours/persistence/**`; `tests/integration/organizationOpeningHours/**`; shared Postgres harness only if required by migration proof. | No API routes, no UI, no search implementation, no export job assembly, no recurring holiday calendar. | S-006 Organization Location exists; live schema inspection before editing. | organizationLocations identity seam; tenant table; migration runner; Postgres harness. | queued-for-delivery |
| T-S007-02 | S-007 | DEV:backend | Implement weekly slot and exception create, read/list, update, delete, export-projection, and effective-hours precedence behavior. | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/domain/**`; `src/features/organizationOpeningHours/persistence/**`; `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**`. | No transport mounting, no UI, no grouped search, no export bundle generation. | T-S007-01 complete. | organizationOpeningHours repository seam; organizationLocations public identity/object seam. | queued-for-delivery |
| T-S007-03 | S-007 | DEV:backend | Add root and tenant weekly-slot and exception child routes, authz enforcement, audit events, feature wiring, manifest, and public export projection seam. | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/transport/**`; `src/features/organizationOpeningHours/integration.ts`; `src/features/organizationOpeningHours/index.ts`; `src/features/organizationOpeningHours/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationOpeningHours/**`; `tests/security/organizationOpeningHours/**`. | No app UI, no OpenAPI/Postman expansion unless already maintained, no export job assembly, no search routes. | T-S007-01 and T-S007-02 complete. | root session middleware, tenant session context, platform authorization, audit seam, v1 router, organizationLocations object seam. | queued-for-delivery |
| T-S007-04 | S-007 | TEST:test-only | Add S-007 proof suite for slot order, same-day validation, overlap denial, no overnight slots, same-tenant enforcement, lifecycle visibility, and exception precedence. | `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**`; `tests/security/organizationOpeningHours/**`; test fixtures under `tests/fixtures/organizationOpeningHours/**` if needed. | No production behavior change, no API contract edits, no permission truth edits. | T-S007-01 through T-S007-03 complete. | live API and persistence fixtures must match implementation contracts. | queued-for-delivery |
| T-S007-05 | S-007 | DOC:docs-artifact | Refresh S-007 feature docs and story evidence after implementation lands. | `docs/features/organization-opening-hours.md`; S-007 story folder; generated dependency graph artifacts when manifest changes require regeneration. | No production source changes, no new product decisions, no unrelated entity docs, no API contract rewrite, no permission mapping rewrite. | T-S007-01 through T-S007-04 complete. | feature manifest and generated dependency graph artifact chain. | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | single-behavior | 1 | AC-S007-01 requires persistence before behavior proof can be honest. | Opening-hour durable storage, descriptive office flags, coordinate fields, lifecycle columns, and tenant/Organization indexes. | migration and repository schema seam | Live schema and persistence proof show constraints match data dictionary. | none | Splitting indexes from table creation would leave no executable read/write proof. |
| T-S007-02 | single-behavior | 1 | Covers opening-hour domain behavior only. | Opening-hour create/read/update/lifecycle/export projection behavior. | organizationOpeningHours domain service | Unit and integration proof for valid fields, multiple descriptive head-office flags allowed, lifecycle, and projection. | none | Transport and authz are split to T-S007-03. |
| T-S007-03 | single-behavior | 1 | Covers route-facing enforcement and public seam integration. | Root/tenant route, authz, audit, manifest, and export projection seam. | v1 router and organizationOpeningHours integration seam | Integration and security proof for root selected tenant, tenant current context, denied cross-tenant object access, and audit events. | none | Behavior is already split to T-S007-02. |
| T-S007-04 | single-proof-target | 1 | Proof-only task validates completed S-007 slice. | Executable proof suite. | test harness | Focused S-007 TC coverage proves accepted and denied states against real implementation. | none | Production behavior changes route back to DEV tasks. |
| T-S007-05 | single-proof-target | 1 | Artifact-only task closes S-007 documentation and generated evidence. | Maintained artifact closeout. | docs and generated dependency graph artifacts | Review shows docs and generated records no longer describe pre-S007 state. | none | Source or test changes route back to owning tasks. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S007-01 | source-truth-mismatch | Live schema, migration conventions, API contract, and data dictionary disagree on opening-hour field names, optional address-summary shape, lifecycle, or indexes. | Stop and route to data/API alignment before migration. | no | Migration shape must not silently choose between source truths. |
| T-S007-02 | proof-gap | organizationCore public seam cannot prove the owning Organization exists in the actor tenant/account. | Stop and route to organizationCore public seam refinement. | no | Opening Hours must not attach across tenant/account boundaries. |
| T-S007-03 | source-truth-mismatch | Permission mapping and implemented platform authz capability names disagree. | Stop and reconcile permission mapping or grant source. | no | Runtime eligibility must not drift from mapping. |
| T-S007-04 | proof-gap | Tests require behavior not implemented by T-S007-01 through T-S007-03. | Split missing production behavior to DEV task. | no | TEST:test-only must not change product behavior. |
| T-S007-05 | none-known | No new decision expected; docs closeout may proceed when source diff and test evidence are available. | Manual review if artifacts reveal stale upstream source. | yes | Artifact task is allowed to report drift but not invent behavior. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S007-01 | `src/features/organizationCore/**`; `src/features/*/persistence/migrations/`; `tests/harness/postgres/`; existing child-record persistence examples. | organizationCore identity, migration runner, Postgres test harness, tenant/account identity table. | Opening-hour data dictionary, PRD, API contracts, AGENTS migration safety. |
| T-S007-02 | `src/features/organizationCore/index.ts`; `src/features/*/domain/`; `src/features/*/contract/`; `src/features/*/persistence/`; S-007 story. | T-S007-01 repository/storage seam; organizationCore public identity seam. | PRD, data dictionary mutation rules, API request rules. |
| T-S007-03 | `src/routes/v1/index.ts`; protected route examples; audit examples; feature manifest examples; organizationCore transport. | root session middleware, tenant context, authz evaluator, audit/event seam, v1 router. | API contracts, permission mapping, ADR-0036, ADR-0042. |
| T-S007-04 | PRD test-case document; new source tests from T-S007-01 through T-S007-03. | test harness, live API/persistence fixtures. | AC-S007-01, TC-ORG-FOUNDATION unit/int/sec/audit/edge/conc rows. |
| T-S007-05 | implementation diff, feature manifest, generated graph artifacts, docs/features inventory, story evidence. | feature manifest and dependency graph generator. | change-artifact requirements, story packet, implementation evidence. |

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

| Task ID | Seam Kind | Compatibility Mode | Approved Authority Source | Seam Owner / Opening-hour | Seam Source Inventory | Seam Change Scope | Exact Write Envelope | Why Not Feature-Local | Current / Future / Unsupported Consumers | Compatibility Contract | Representative Consumer Proof | Runtime / Restart Impact | Rollout / Backout Posture | Artifact / Materialization Impact | Generated / Apply / Check Command | Expected Seam Output | Architecture / Standards Boundary | Split / Blocked Follow-Up | Proof Commands | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Platform Seam Class Contract

| Task ID | Platform Seam Class | Class-Specific Required Proof | Required Consumer Coverage | Runtime / Materialization Expectation | Forbidden Contamination / Split Notes |
| --- | --- | --- | --- | --- | --- |

## Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-02 | domain-behavior | S-007 story, PRD, data dictionary, API contract, permission mapping, implementation blueprint | `src/features/organizationOpeningHours` | new-capability-file | Inspect `src/features/organizationCore`, feature domain/contract/persistence examples, and `docs/data-dictionary/organization-opening-hours.md`. | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/domain/**`; `src/features/organizationOpeningHours/persistence/**`; `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**` | contract schemas, domain capability files, repository consumer types, focused tests | Domain validates weekday and time range, optional fields, system-managed fields, multiple opening-hour slots lifecycle, tenant-bound current records, and repository consumption. | approved API contract posture from root and tenant Organization contracts; no contract change in task unless routed. | tenant context required; object rules deny wrong tenant; normal reads exclude archived/deleted. | consumes T-S007-01 storage output; no schema changes in this task. | exposes domain functions for route and export projection consumers; manifest closeout in T-S007-05. | Story evidence links and data dictionary remain source; artifact closeout in T-S007-05. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | opening-hour behavior and export projection. | route/auth split to T-S007-03; grouped search/export bundle work deferred. | `npx vitest run tests/unit/organizationOpeningHours tests/integration/organizationOpeningHours` | Format with repo tooling; generated artifacts unchanged. | Reviewer checks validation, multiple opening-hour slots, tenant, lifecycle, and projection behavior only. |
| T-S007-03 | transport-route | API contracts, permission mapping, ADR-0036, ADR-0042, S-007 story | `src/features/organizationOpeningHours` | transport-only | Inspect `src/routes/v1/index.ts`, organizationCore transport, protected route examples, audit/event examples, feature manifest examples. | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/transport/**`; `src/features/organizationOpeningHours/integration.ts`; `src/features/organizationOpeningHours/index.ts`; `src/features/organizationOpeningHours/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationOpeningHours/**`; `tests/security/organizationOpeningHours/**` | transport, integration, feature manifest, public seam, route mounting, security tests | Transport maps root selected tenant and tenant current context to domain calls; integration owns router wiring and public exports. | approved root and tenant API contracts; no route family broadening. | runtime authz enforced with root/tenant capability, tenant context, object rule, denial and audit. | no schema work; consumes repository/domain outputs from earlier tasks. | creates organizationOpeningHours public seam and manifest; generated graph refresh deferred to T-S007-05. | Feature manifest and generated graph obligations carried to T-S007-05. | not-applicable: no scaffold command approved; route files follow existing patterns. | route responses, authz denial behavior, audit events, manifest and public seam. | docs contract changes route to DOC:api-contract if discovered; generated graph closeout in T-S007-05. | `npx vitest run tests/security/organizationOpeningHours tests/integration/organizationOpeningHours` | Regenerate dependency graph if manifest changes, captured by T-S007-05. | Reviewer checks route/auth/audit/public seam boundaries only. |

## Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | new-migration | Inspect live schema and current migrations before editing; confirm no existing opening-hour table, indexes, or conflicting names. | Validate fields against data dictionary: organization_weekly_opening_hours_id, tenant_id, organization_id, opening-hour_name, address_summary, latitude, longitude, lifecycle_status, archived_at, deleted_at, created_at, updated_at. | New rows must reference a real same-tenant Organization and satisfy multiple opening-hour slots rule. | Invalid fixture rows fail tests; no silent conversion of bad source shape. | Create a new zero-padded migration file; do not rename applied migrations. | Verify FK, partial unique index, lifecycle defaults, timestamp type, and optional field execution semantics in Postgres. | Persistence tests create, read, update, archive, restore, delete, coordinate range validation, multiple head-office flag proof, and foreign Organization denial. | Review and update `tests/harness/postgres/migrations.ts` when new migration is added. |

## Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S007-01 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and representative read/write paths in the migration task itself. | Covers opening-hour table, Organization FK, tenant boundary, lifecycle columns, optional coordinates, optional address summary, descriptive-flag indexes where needed, tenant visibility index, and Organization child index. | Persistence-backed tests cover create, coordinate range validation, lifecycle visibility, same-tenant Organization enforcement, and harness migration run. | not-applicable: data dictionary and contract docs are current from S-007 story evidence. |

## Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S007-01 | narrow-pattern | `src/features/organizationOpeningHours/persistence/**`; `tests/integration/organizationOpeningHours/**`; `tests/harness/postgres/**` only if harness proof requires it. | not-applicable |
| T-S007-02 | narrow-pattern | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/domain/**`; `src/features/organizationOpeningHours/persistence/**`; `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**`. | not-applicable |
| T-S007-03 | narrow-pattern | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/transport/**`; `src/features/organizationOpeningHours/integration.ts`; `src/features/organizationOpeningHours/index.ts`; `src/features/organizationOpeningHours/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationOpeningHours/**`; `tests/security/organizationOpeningHours/**`. | not-applicable |
| T-S007-04 | narrow-pattern | `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**`; `tests/security/organizationOpeningHours/**`; `tests/fixtures/organizationOpeningHours/**`. | not-applicable |
| T-S007-05 | narrow-pattern | `docs/features/organization-opening-hours.md`; S-007 story folder; S-007 review artifact; generated dependency graph artifacts when required by manifest diff. | not-applicable |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S007-01 | task-specific | Opening-hour migration and persistence proof for multiple opening-hour slots uniqueness, FK, indexes, lifecycle, and optional fields. | Broad migration suite may supplement focused persistence proof. |
| T-S007-02 | task-specific | Opening-hour domain behavior proof. | Broad feature tests may supplement focused domain proof. |
| T-S007-03 | task-specific | Root/tenant route, authz denial, audit, manifest, and public seam proof. | Broad route/security suites may supplement focused route proof. |
| T-S007-04 | task-specific | S-007 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |
| T-S007-05 | task-specific | S-007 maintained artifact closeout review. | Story and task validators supplement manual artifact review. |

## Refactor-First Contract

| Task ID | Refactor Trigger | Refactor Type | Refactor Target Inventory | Detection Hints | Unchanged Behavior | Affected Consumers | Downstream Task Unblocked | Compatibility Proof | Routing Check | Human Review Boundary | Forbidden Behavior / Authority Change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Foundation Contract

| Task ID | Concern Area | Architecture Trigger | Architecture Question | Decision Analysis Status | Decision Provenance Source | Missing Analysis Fields | Sources To Review | Decision Source Inventory | Decision Analysis Checklist | Decision Owner | Output Artifact Target | Downstream Tasks Blocked | Compatibility Posture | Final Authority Route | Human Review Boundary | Forbidden Implementation / Guess |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Update Contract

| Task ID | Update Class | Architecture Source | Update Target | Trigger | Compatibility Impact | Generated Artifact Impact | Required Review | Proof Command | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-05 | feature-doc | feature-doc-refresh | Inspect implementation diff, S-007 story folder, `src/features/organizationOpeningHours/feature.manifest.json`, generated graph artifacts, tests, and validation command output. | S-007 story, PRD, implementation evidence, feature manifest, generated graph. | `docs/features/organization-opening-hours.md`; S-007 story evidence links; S-007 review note. | current-state-after-implementation | Sweep docs/features, S-007 story evidence, feature manifest references, generated graph, test:evidence, and source-independent docs touched by opening-hour source. | DOC:api-contract for route contract changes; DOC:permission-mapping for authz truth changes; DOC:data-dictionary for data shape changes; TEST:test-only for new proof; DEV:backend for source behavior. | `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`; `npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-007-opening-hour-slots-and-exceptions --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown` | Reviewer judges artifact truth against implementation evidence, not new behavior. | Validation output plus manual review note. |

## Standards Compliance Contract

| Task ID | Standards Scope | Standards Source | Compliance Gap | Allowed Action | Proof Command | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- |

## Standards Update Contract

| Task ID | Standards Update Class | Standards Source | Update Target | Trigger | Compatibility Impact | Required Review | Proof Command | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Permission Mapping Contract

| Task ID | Mapping Class | Capability / Surface | Authority World | Object Rule | Grant Source | Denial / Audit Posture | Runtime Enforcement Target | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## API Contract

| Task ID | API Contract Class | Route Family | Request / Response / Error Target | Contract Source | Compatibility Posture | Proof Command | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Data Dictionary Contract

| Task ID | Entity / Record | Dictionary Target | Source Truth Inventory | Registry / Persistence Future Posture | Required Sync | Compliance Health Command | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Test-Only Coverage Contract

| Task ID | Test Change Class | Test-Only Coverage Source | Test-Only Traceability IDs | Test-Only Test Layer | Test-Only Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Test-Only Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-04 | prd-test-case | PRD-derived test cases and AC-S007-01 | AC-S007-01; TC-ORG-FOUNDATION-UNIT-004; TC-ORG-FOUNDATION-INT-003; TC-ORG-FOUNDATION-CONC-002 | unit, integration, security, audit, persistence, concurrency | Opening-hour implementation from T-S007-01 through T-S007-03. | Live API/repository/persistence fixtures under `tests/**/organizationOpeningHours/**`. | Mock-honesty comparison against live API/repository/persistence shape required. | no production behavior change; test-only posture | `npx vitest run tests/unit/organizationOpeningHours tests/security/organizationOpeningHours`; `npx vitest run tests/integration/organizationOpeningHours/persistence.test.ts` | Missing product behavior routes to DEV:backend or DEV:migration-persistence task. |

## Test Suite Alignment Contract

| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-04 | Organization opening-hours routes and domain operations | allowed root admin actor, allowed tenant admin actor, denied unauthenticated actor, denied expired session actor, denied wrong tenant actor | permission states: allowed opening-hour manage/read capability; denied missing grant permission; denied wrong authority role | object lifecycle states: active, archived, deleted opening hours; active/archived/deleted owning Organizations | boundary states: selected tenant, current tenant, cross-tenant Organization, same-tenant Organization | invalid opening-hours range, cross-tenant Organization, archived normal update, deleted normal update, invalid optional field, system-managed fields | not-applicable: matrix is applicable and covered. | none |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Escalation Path |
| --- | --- | --- |
| T-S007-01 | Do not rename existing applied migrations or assume live schema from docs only. | Stop and inspect live schema and migration harness. |
| T-S007-02 | Do not create a opening-hour for an Organization that the actor cannot prove in the same tenant/account. | Stop and refine organizationCore seam or route to architecture review. |
| T-S007-03 | Do not expose routes before runtime authz and object rules exist. | Stop and reconcile permission mapping. |
| T-S007-04 | Do not encode rejected fallback behavior in mocks. | Stop and compare fixtures to live runtime shapes. |
| T-S007-05 | Do not use completion language if generated graph, manifest, docs, or evidence remain stale. | Stop and classify as partially documented. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Required Guardrail Reference | Approval Status | Evidence / Rationale |
| --- | --- | --- | --- | --- |
| T-S007-01 | DEV:migration-persistence | migration-persistence-task-guardrail.md | approved | Migration task is isolated and carries live schema, identity, SQL, and read/write proof obligations. |
| T-S007-02 | DEV:backend | backend-task-guardrail.md | approved | Backend domain behavior is feature-local and consumes migration output. |
| T-S007-03 | DEV:backend | backend-task-guardrail.md | approved | Backend route/auth/audit/manifest work consumes approved API and permission sources. |
| T-S007-04 | TEST:test-only | test-only-task-guardrail.md | approved | Test task changes no production behavior and carries TC traceability plus permission/state matrix. |
| T-S007-05 | DOC:docs-artifact | docs-artifact-task-guardrail.md | approved | Docs closeout is isolated from source implementation and routes specialized changes away. |

## Task Guardrail Evidence

| Task ID | Guardrail Check ID | Status | Evidence |
| --- | --- | --- | --- |
| T-S007-01 | migration-source-authority | pass | Source authority is S-007, PRD, data dictionary, API contracts, and AGENTS migration safety. |
| T-S007-01 | migration-change-class | pass | Change class is new-migration. |
| T-S007-01 | migration-live-schema | pass | Task requires live schema inspection before editing. |
| T-S007-01 | migration-storage-decision-boundary | pass | Storage model is opening-hour table and indexes only. |
| T-S007-01 | migration-source-data-shape | pass | Task lists required opening-hours fields and indexes. |
| T-S007-01 | migration-per-row-eligibility | pass | Rows must satisfy real same-tenant Organization and multiple opening-hour slots rules. |
| T-S007-01 | migration-rejected-row-behavior | pass | Invalid rows fail tests and are not silently converted. |
| T-S007-01 | migration-compatibility-repair | pass | Corrective migration is not in scope; drift routes to follow-up. |
| T-S007-01 | migration-applied-file-safety | pass | New zero-padded migration required; applied migrations are not renamed. |
| T-S007-01 | migration-index-normalization-uniqueness | pass | No hidden head-office uniqueness; tenant/Organization indexes named. |
| T-S007-01 | migration-security-tenant-proof | pass | Same-tenant and cross-tenant Organization proof required. |
| T-S007-01 | migration-read-write-proof | pass | Representative read/write proof required. |
| T-S007-01 | migration-postgres-harness | pass | Harness review is required. |
| T-S007-02 | backend-source-authority | pass | Uses S-007, PRD, API, data dictionary, permission mapping, blueprint. |
| T-S007-02 | backend-change-class | pass | Change class is domain-behavior. |
| T-S007-02 | backend-owning-feature | pass | Owner is `src/features/organizationOpeningHours`. |
| T-S007-02 | backend-source-inventory | pass | Requires organizationCore seam, examples, and opening-hour data dictionary. |
| T-S007-02 | backend-exact-write-envelope | pass | Narrow organizationOpeningHours and focused test paths only. |
| T-S007-02 | backend-layer-responsibilities | pass | Contract/domain/repository responsibilities are named. |
| T-S007-02 | backend-cross-feature-seams | pass | Consumes organizationCore public seam; no private persistence imports. |
| T-S007-02 | backend-authz-tenant-lifecycle | pass | Tenant, lifecycle, and multiple opening-hour slots posture named. |
| T-S007-02 | backend-api-contract-boundary | pass | API posture consumes approved contracts and routes changes away. |
| T-S007-02 | backend-persistence-migration-boundary | pass | Migration split to T-S007-01. |
| T-S007-02 | backend-scripted-scaffold-posture | pass | No generator assumed; existing patterns must be inspected. |
| T-S007-02 | backend-artifact-obligations | pass | Closeout artifacts split to T-S007-05. |
| T-S007-02 | backend-expected-output | pass | Expected opening-hour behavior and projection named. |
| T-S007-02 | backend-split-routing | pass | Migration and route work are split. |
| T-S007-02 | backend-proof-commands | pass | Focused organizationOpeningHours proof commands named. |
| T-S007-02 | backend-human-review-boundary | pass | Review boundary is validation, multiple opening-hour slots, tenant/lifecycle behavior. |
| T-S007-03 | backend-source-authority | pass | Uses API contracts, permission mapping, ADR-0036, ADR-0042, S-007. |
| T-S007-03 | backend-change-class | pass | Change class is transport-route. |
| T-S007-03 | backend-owning-feature | pass | Owner is `src/features/organizationOpeningHours`. |
| T-S007-03 | backend-source-inventory | pass | Requires route, middleware, audit, manifest examples. |
| T-S007-03 | backend-exact-write-envelope | pass | Narrow organizationOpeningHours, v1 router, integration/security test paths only. |
| T-S007-03 | backend-layer-responsibilities | pass | Transport/integration/manifest responsibilities named. |
| T-S007-03 | backend-cross-feature-seams | pass | Root session, tenant context, authz, audit, router, and organizationCore seams named. |
| T-S007-03 | backend-authz-tenant-lifecycle | pass | Runtime authz, tenant context, object rules, denial and audit named. |
| T-S007-03 | backend-api-contract-boundary | pass | Approved root/tenant API contracts consumed. |
| T-S007-03 | backend-persistence-migration-boundary | pass | No schema work; consumes earlier tasks. |
| T-S007-03 | backend-scripted-scaffold-posture | pass | No generator assumed; existing patterns must be inspected. |
| T-S007-03 | backend-artifact-obligations | pass | Manifest/generated graph closeout split to T-S007-05. |
| T-S007-03 | backend-expected-output | pass | Route responses, authz, audit, manifest, public seam named. |
| T-S007-03 | backend-split-routing | pass | Contract or permission drift routes to specialized tasks. |
| T-S007-03 | backend-proof-commands | pass | Focused route, authz, audit, manifest proof named. |
| T-S007-03 | backend-human-review-boundary | pass | Review boundary is route/auth/audit/public seam. |
| T-S007-04 | test-source-authority | pass | Uses PRD test cases and AC-S007-01. |
| T-S007-04 | test-change-class | pass | Change class is prd-test-case. |
| T-S007-04 | test-traceability | pass | TC IDs and AC-S007-01 named. |
| T-S007-04 | test-proof-layer | pass | Unit, integration, security, audit, persistence, concurrency layers named. |
| T-S007-04 | test-permission-state-matrix | pass | Matrix covers actors, permissions, object lifecycle, tenant boundaries. |
| T-S007-04 | test-mock-honesty | pass | Mock-honesty against live API/repository/persistence required. |
| T-S007-04 | test-no-behavior-change | pass | Production behavior changes are forbidden. |
| T-S007-04 | test-sensitive-state-coverage | pass | Active, archived, deleted, and cross-tenant states named. |
| T-S007-04 | test-focused-command | pass | Focused organizationOpeningHours test commands named. |
| T-S007-04 | test-coverage-strength | pass | Debt Health Summary includes coverage-strength command. |
| T-S007-04 | test-split-boundary | pass | Missing behavior routes back to DEV tasks. |
| T-S007-05 | docs-source-truth-reviewed | pass | Source truth inventory includes implementation diff, story, PRD, API, data dictionary, permission mapping. |
| T-S007-05 | docs-artifact-class | pass | Class is feature-doc-refresh. |
| T-S007-05 | docs-scriptable-source-inventory | pass | Scriptable inventory and validation commands named. |
| T-S007-05 | docs-stale-artifact-sweep | pass | S-007 docs and generated graph sweep named. |
| T-S007-05 | docs-status-posture | pass | Current-state-after-implementation posture named. |
| T-S007-05 | docs-validation-command | pass | Story and task validation commands named. |
| T-S007-05 | docs-specialized-routing | pass | API, permission, data, source, and test changes are routed away. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Required Supplemental Guardrail References | Compatibility Proof | Approval Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | feature-local | none | `src/features/organizationOpeningHours` | no | not-applicable | New feature-local migration and persistence proof; no shared extraction. | approved |
| T-S007-02 | feature-local | none | `src/features/organizationOpeningHours` | no | not-applicable | Feature-local behavior; no shared extraction. | approved |
| T-S007-03 | feature-local | v1 router owns mounting only | `src/features/organizationOpeningHours` with explicit v1 mount | no | not-applicable | Existing router/middleware seams consumed without moving shared code. | approved |
| T-S007-04 | feature-local | tests | tests | no | not-applicable | Test-only paths stay in test ownership. | approved |
| T-S007-05 | feature-local | docs | docs | no | not-applicable | Docs/generated artifacts stay in artifact owners. | approved |

## Allowed Write Set Classification

| Task ID | Path Pattern | Write Class | Reason |
| --- | --- | --- | --- |
| T-S007-01 | `src/features/organizationOpeningHours/persistence/**` | feature-local | Opening-hour persistence owner. |
| T-S007-01 | `tests/integration/organizationOpeningHours/**` | test | Persistence proof. |
| T-S007-02 | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/domain/**`; `src/features/organizationOpeningHours/persistence/**` | feature-local | Opening-hour behavior. |
| T-S007-02 | `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**` | test | Focused behavior proof. |
| T-S007-03 | `src/features/organizationOpeningHours/transport/**`; `src/features/organizationOpeningHours/integration.ts`; `src/features/organizationOpeningHours/index.ts`; `src/features/organizationOpeningHours/feature.manifest.json`; `src/routes/v1/index.ts` | feature-local | Route, integration, manifest, and public seam. |
| T-S007-03 | `tests/integration/organizationOpeningHours/**`; `tests/security/organizationOpeningHours/**` | test | Route and authz proof. |
| T-S007-04 | `tests/**/organizationOpeningHours/**`; `tests/fixtures/organizationOpeningHours/**` | test | S-007 proof suite. |
| T-S007-05 | `docs/features/organization-opening-hours.md`; S-007 story folder; S-007 review artifacts | docs-artifact | Maintained artifact closeout. |
| T-S007-05 | `docs/architecture/generated/feature-dependency-graph.*` | generated-artifact | Regenerate only when feature manifest changes require it. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S007-01 | API routes, app UI, grouped search, export job assembly, other Organization child entities. | Persistence task must stay narrow. |
| T-S007-02 | Route mounting, UI, grouped search, export bundle generation. | Domain behavior is isolated. |
| T-S007-03 | App UI, logo/export/search/other child entity routes, broad API contract rewrites. | Route/auth slice must stay S-007 only. |
| T-S007-04 | Production behavior, permission truth, API contract edits. | TEST:test-only cannot change behavior. |
| T-S007-05 | Production source changes or new product decisions. | Docs closeout must follow delivered truth. |

## Task Acceptance Criteria Coverage

| Task ID | AC IDs Covered | Coverage Notes |
| --- | --- | --- |
| T-S007-01 | AC-S007-01 | Covers persistence foundation for opening-hours fields, indexes, multiple opening-hour slots uniqueness, and Organization FK. |
| T-S007-02 | AC-S007-01 | Covers create/read/list/update/archive/restore/delete, optional field validation, lifecycle, and export projection behavior. |
| T-S007-03 | AC-S007-01 | Covers root/tenant routes, authorization enforcement, object denial, audit, manifest, and public seam. |
| T-S007-04 | AC-S007-01 | Covers executable proof obligations. |
| T-S007-05 | AC-S007-01 | Covers artifact obligations. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) Covered | Capability Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S007-01 | `manageOrganizationLegalOpening Hours`; `CAP-ORG-LOC-001` | approved | Persistence and migration part of opening-hour row. |
| T-S007-02 | `manageOrganizationLegalOpening Hours`; `CAP-ORG-LOC-001` | approved | Domain behavior part of opening-hour row. |
| T-S007-03 | `manageOrganizationLegalOpening Hours`; `CAP-ORG-LOC-001` | approved | Runtime route/auth/public seam part of opening-hour row. |
| T-S007-04 | `manageOrganizationLegalOpening Hours`; `CAP-ORG-LOC-001` | approved | Executable proof for opening-hour row. |
| T-S007-05 | `manageOrganizationLegalOpening Hours`; `CAP-ORG-LOC-001` | approved | Artifact closeout for opening-hour row. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S007-01 | not-applicable: S-004 prerequisite complete | Opening Hours require durable Organization ownership. | no |
| T-S007-02 | T-S007-01 | Domain behavior needs schema and repository persistence shape. | yes |
| T-S007-03 | T-S007-01; T-S007-02 | Routes should expose implemented behavior with authz and audit. | yes |
| T-S007-04 | T-S007-01; T-S007-02; T-S007-03 | Proof suite targets delivered source behavior. | yes |
| T-S007-05 | T-S007-01; T-S007-02; T-S007-03; T-S007-04 | Artifact closeout needs implementation and proof evidence. | yes |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S007-01 | organizationCore identity and Postgres migration runner | feature/platform seam | existing | Opening-hour table references real Organization records without becoming Organization authority. |
| T-S007-02 | organizationOpeningHours repository seam | feature-local seam | new | Domain consumes repository shapes and organizationCore public identity/object seam. |
| T-S007-03 | root session, tenant context, authz, audit, v1 router | platform seams | existing | Transport consumes existing middleware and exposes organizationOpeningHours through integration. |
| T-S007-04 | test harness and live runtime/persistence fixtures | test seam | existing | Fixtures must match live API/persistence shape. |
| T-S007-05 | feature manifest and generated dependency graph | generated artifact seam | existing | Manifest changes require graph regeneration and review. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S007-01 | migration/persistence evidence | record live schema and read/write proof in task evidence | Layer 5 delivery | yes |
| T-S007-02 | source evidence | record domain behavior proof in task evidence | Layer 5 delivery | yes |
| T-S007-03 | feature manifest and dependency graph | update manifest and regenerate graph when public seam/dependency changes | Layer 5 delivery plus artifact sweep | yes |
| T-S007-04 | executable test evidence | record TC and command evidence | test implementation workflow | yes |
| T-S007-05 | feature docs and story evidence | refresh maintained docs and story evidence links | docs artifact workflow | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S007-01 | persistence-backed, integration | `npm test -- organizationOpeningHours`; migration command used by repo if available. | Use real Postgres harness; no mock-only persistence proof. |
| T-S007-02 | unit, integration, persistence | `npx vitest run tests/unit/organizationOpeningHours tests/integration/organizationOpeningHours` | Fixtures must match data dictionary and API contract. |
| T-S007-03 | integration, security, audit, compatibility | `npx vitest run tests/security/organizationOpeningHours tests/integration/organizationOpeningHours` | Use live route payloads and permission mapping states. |
| T-S007-04 | unit, integration, security, audit, persistence, concurrency | `npx vitest run tests/unit/organizationOpeningHours tests/security/organizationOpeningHours`; `npx vitest run tests/integration/organizationOpeningHours/persistence.test.ts` | Mock-honesty comparison required against live API/persistence payloads. |
| T-S007-05 | docs-alignment, generated-artifact | `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`; `npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-007-opening-hour-slots-and-exceptions --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown` | Evidence links must point to actual outputs or explicit placeholders. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |
| T-S007-04 | `npm run test:coverage-strength` | not-run: no such command was executed in this S-007 planning pass | unknown | accepted-deferred | S-007 closeout |

## Branch Worktree Bootstrap Strategy

| Task ID | Branch Name | Worktree Strategy | Bootstrap Artifact | Base Ref | Base Commit Policy | Promotion Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | `task/S007-01-opening-hour-persistence` | isolated task branch/worktree | this task packet | current feature-loop branch | start clean from current reviewed branch | main feature branch after review |
| T-S007-02 | `task/S007-02-opening-hour-behavior` | isolated task branch/worktree | this task packet | after T-S007-01 | include T-S007-01 output only | main feature branch after review |
| T-S007-03 | `task/S007-03-opening-hour-routes-authz` | isolated task branch/worktree | this task packet | after T-S007-02 | include prior S-007 source tasks only | main feature branch after review |
| T-S007-04 | `task/S007-04-opening-hour-proof-suite` | isolated task branch/worktree | this task packet | after T-S007-03 | include completed implementation tasks | main feature branch after review |
| T-S007-05 | `task/S007-05-opening-hour-artifact-closeout` | isolated task branch/worktree | this task packet | after T-S007-04 | include implementation and proof evidence | main feature branch after review |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S007-01 | queued-for-delivery | none | Start with migration and persistence proof only. |
| T-S007-02 | queued-for-delivery | none | Start after persistence task exists. |
| T-S007-03 | queued-for-delivery | none | Start after domain behavior exists. |
| T-S007-04 | queued-for-delivery | none | Start after source behavior exists; no production source edits. |
| T-S007-05 | queued-for-delivery | none | Start after source and proof evidence exists. |
