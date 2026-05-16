# T-S008-01: Create business-unit table, lifecycle columns, parent id, normalized name, lifecycle fields, depth support, hierarchy indexes, and audit table.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S008-01 |
| Parent Story ID | S-008 |
| Task Type | DEV:migration-persistence |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Create business-unit table, lifecycle columns, parent id, normalized name, lifecycle fields, depth support, hierarchy indexes, and audit table. |
| Allowed Write Set | `src/features/organizationBusinessUnits/persistence/**`; `tests/integration/organizationBusinessUnits/**`; shared Postgres harness only if required by migration proof. |
| Non-Goals | No memberships, no UI, no search implementation, no export job assembly, no Organization core rewrite. |
| Dependencies | S-004 Organization core exists; live schema inspection before editing. |
| Shared Seams | organizationCore identity seam; tenant table; migration runner; Postgres harness. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S008 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S008-01 | S-008 | Business units support hierarchy depth 10, cycle denial, derived child-unit reads from parent links, branch archive, child reassignment, lifecycle visibility, and same-tenant enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-008 | AC-S008-01 | CAP-ORG-UNIT-001 | tenant/root | create-or-refresh-required | Business units. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-01 | single-behavior | 1 | AC-S008-01 requires persistence before behavior proof can be honest. | Business-unit durable storage, hierarchy fields, lifecycle columns, tenant/Organization indexes, and audit rows. | migration and repository schema seam | Live schema and persistence proof show constraints match data dictionary. | none | Splitting indexes from table creation would leave no executable read/write proof. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S008-01 | source-truth-mismatch | Live schema, migration conventions, API contract, and data dictionary disagree on business-unit field names, hierarchy fields, lifecycle, or indexes. | Stop and route to data/API alignment before migration. | no | Migration shape must not silently choose between source truths. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S008-01 | `src/features/organizationCore/**`; `src/features/*/persistence/migrations/`; `tests/harness/postgres/`; existing child-record persistence examples. | organizationCore identity, migration runner, Postgres test harness, tenant/account identity table. | Business-unit data dictionary, PRD, API contracts, AGENTS migration safety. |

### Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-01 | new-migration | Inspect live schema and current migrations before editing; confirm no existing business-unit table, indexes, or conflicting names. | Validate fields against data dictionary: organization_business-unit_id, tenant_id, organization_id, business_unit_id, parent_business_unit_id, name, normalized_name, lifecycle_status, archived_at, deleted_at, created_at, updated_at. | New rows must reference a real same-tenant Organization and satisfy hierarchy and same-organization rules. | Invalid fixture rows fail tests; no silent conversion of bad source shape. | Create a new zero-padded migration file; do not rename applied migrations. | Verify FK, partial unique index, lifecycle defaults, timestamp type, and optional field execution semantics in Postgres. | Persistence tests create, read, update, archive, restore, delete, cycle denial, child reassignment, branch archive, and foreign Organization denial. | Review and update `tests/harness/postgres/migrations.ts` when new migration is added. |

### Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S008-01 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and representative read/write paths in the migration task itself. | Covers business-unit table, Organization FK, tenant boundary, lifecycle columns, parent hierarchy columns, tenant/organization indexes, depth/cycle support queries, lifecycle visibility, and audit table. | Persistence-backed tests cover create, move, branch archive, child reassignment, lifecycle visibility, same-tenant Organization enforcement, and harness migration run. | not-applicable: data dictionary and contract docs are current from S-008 story evidence. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S008-01 | narrow-pattern | `src/features/organizationBusinessUnits/persistence/**`; `tests/integration/organizationBusinessUnits/**`; `tests/harness/postgres/**` only if harness proof requires it. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S008-01 | task-specific | Business-unit migration and persistence proof for hierarchy FK, indexes, lifecycle, child projection, and audit rows. | Broad migration suite may supplement focused persistence proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S008-01 | task-specific | Business-unit migration and persistence proof for hierarchy FK, indexes, lifecycle, child projection, and audit rows. | Broad migration suite may supplement focused persistence proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`