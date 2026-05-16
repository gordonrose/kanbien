# T-S004-01: Create Organization table, hierarchy columns, lifecycle columns, normalized-name uniqueness, and supporting indexes.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S004-01 |
| Parent Story ID | S-004 |
| Task Type | DEV:migration-persistence |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Create Organization table, hierarchy columns, lifecycle columns, normalized-name uniqueness, and supporting indexes. |
| Allowed Write Set | `src/features/organizationCore/persistence/**`; `tests/integration/organizationCore/**`; shared Postgres harness only if required by migration proof. |
| Non-Goals | No API routes, no UI, no child entities, no logo/export/search implementation. |
| Dependencies | S-000 through S-003 complete; live schema inspection before editing. |
| Shared Seams | tenant table or tenant/account identity seam; migration runner; Postgres harness. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S004 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | S-004 | Organization records support create, read, update, archive, restore, parent move, branch archive, child reassignment, normalized tenant-level name uniqueness, depth 10, cycle denial, and same-tenant enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-004 | AC-S004-01 | CAP-ORG-CORE-001 | tenant/root | create-or-refresh-required | ART-ORG-S004 plus ART-ORG-004 API and data alignment source. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | single-behavior | 1 | AC-S004-01 requires persistence before any behavior can be honest. | Organization durable storage and uniqueness/index foundation. | migration and repository schema seam | Live schema and persistence proof show indexes and constraints match data dictionary. | none | Splitting indexes from table creation would leave no executable read/write proof. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S004-01 | source-truth-mismatch | Live schema, migration conventions, API contract, and data dictionary disagree on Organization field names, uniqueness, lifecycle, or indexes. | Stop and route to data/API alignment before migration. | no | Migration shape must not silently choose between source truths. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S004-01 | `src/features/`; `src/features/*/persistence/migrations/`; `tests/harness/postgres/`; existing feature persistence examples. | migration runner, Postgres test harness, tenant/account identity table. | Organization data dictionary, PRD, API contracts, AGENTS migration safety. |

### Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | new-migration | Inspect live schema and current migrations before editing; confirm no existing organization table, indexes, or conflicting names. | Validate planned fields against data dictionary: organization_id, tenant_id, parent_organization_id, name, normalized_name, reference value id, lifecycle_status, archived_at, deleted_at, created_at, updated_at. | New table has no source rows to transform; seed or fixture rows must satisfy tenant, parent, lifecycle, and normalized name rules. | Invalid fixture rows fail tests; no silent conversion of bad source shape. | Create a new zero-padded migration file; do not rename applied migrations. | Verify FK, partial unique index, lifecycle defaults, timestamp type, and parent self-reference execution semantics in Postgres. | Persistence tests create, read, update, move-parent candidate rows, duplicate normalized names, and tenant-separated duplicates. | Review `tests/harness/postgres/migrations.ts` and test database scripts; update only if new migration naming or bootstrap requires it. |

### Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S004-01 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and representative read/write paths in the migration task itself. | Covers organization table, tenant FK, parent FK, lifecycle columns, normalized_name, partial active unique index, tenant lifecycle index, parent index, and live start state. | Persistence-backed read/write path tests cover create, duplicate active name denial, same name in different tenants, parent lookup, archived/deleted visibility indexes, and harness migration run. | not-applicable: data dictionary and contract docs are current from ART-ORG-004; extra executable proof is added in T-S004-05. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S004-01 | narrow-pattern | `src/features/organizationCore/persistence/**`; `tests/integration/organizationCore/**`; `tests/harness/postgres/**` only if harness proof requires it. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S004-01 | task-specific | Organization migration and persistence proof for normalized uniqueness, indexes, and hierarchy columns. | Broad migration suite may supplement focused persistence proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S004-01 | task-specific | Organization migration and persistence proof for normalized uniqueness, indexes, and hierarchy columns. | Broad migration suite may supplement focused persistence proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`