# T-S007-01: Create weekly slot and exception tables, lifecycle fields, type checks, slot-order uniqueness, and lookup indexes.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S007-01 |
| Parent Story ID | S-007 |
| Task Type | DEV:migration-persistence |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Create weekly slot and exception tables, lifecycle fields, type checks, slot-order uniqueness, and lookup indexes. |
| Allowed Write Set | `src/features/organizationOpeningHours/persistence/**`; `tests/integration/organizationOpeningHours/**`; shared Postgres harness only if required by migration proof. |
| Non-Goals | No API routes, no UI, no search implementation, no export job assembly, no recurring holiday calendar. |
| Dependencies | S-006 Organization Location exists; live schema inspection before editing. |
| Shared Seams | organizationLocations identity seam; tenant table; migration runner; Postgres harness. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S007 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | S-007 | Opening-hour slots and exceptions enforce weekday slot order, same-day open/close validation, no overlapping active slots, no overnight v1 slots, and exception precedence of closed day, replacement day, closed slot, then special opening. | persistence-level | unit, integration, security, persistence | PRD, API contract, data dictionary |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-007 | AC-S007-01 | CAP-ORG-HOURS-001 | tenant/root | create-or-refresh-required | Weekly slots and exceptions. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | single-behavior | 1 | AC-S007-01 requires persistence before behavior proof can be honest. | Opening-hour durable storage, descriptive office flags, coordinate fields, lifecycle columns, and tenant/Organization indexes. | migration and repository schema seam | Live schema and persistence proof show constraints match data dictionary. | none | Splitting indexes from table creation would leave no executable read/write proof. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S007-01 | source-truth-mismatch | Live schema, migration conventions, API contract, and data dictionary disagree on opening-hour field names, optional address-summary shape, lifecycle, or indexes. | Stop and route to data/API alignment before migration. | no | Migration shape must not silently choose between source truths. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S007-01 | `src/features/organizationCore/**`; `src/features/*/persistence/migrations/`; `tests/harness/postgres/`; existing child-record persistence examples. | organizationCore identity, migration runner, Postgres test harness, tenant/account identity table. | Opening-hour data dictionary, PRD, API contracts, AGENTS migration safety. |

### Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-01 | new-migration | Inspect live schema and current migrations before editing; confirm no existing opening-hour table, indexes, or conflicting names. | Validate fields against data dictionary: organization_weekly_opening_hours_id, tenant_id, organization_id, opening-hour_name, address_summary, latitude, longitude, lifecycle_status, archived_at, deleted_at, created_at, updated_at. | New rows must reference a real same-tenant Organization and satisfy multiple opening-hour slots rule. | Invalid fixture rows fail tests; no silent conversion of bad source shape. | Create a new zero-padded migration file; do not rename applied migrations. | Verify FK, partial unique index, lifecycle defaults, timestamp type, and optional field execution semantics in Postgres. | Persistence tests create, read, update, archive, restore, delete, coordinate range validation, multiple head-office flag proof, and foreign Organization denial. | Review and update `tests/harness/postgres/migrations.ts` when new migration is added. |

### Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S007-01 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and representative read/write paths in the migration task itself. | Covers opening-hour table, Organization FK, tenant boundary, lifecycle columns, optional coordinates, optional address summary, descriptive-flag indexes where needed, tenant visibility index, and Organization child index. | Persistence-backed tests cover create, coordinate range validation, lifecycle visibility, same-tenant Organization enforcement, and harness migration run. | not-applicable: data dictionary and contract docs are current from S-007 story evidence. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S007-01 | narrow-pattern | `src/features/organizationOpeningHours/persistence/**`; `tests/integration/organizationOpeningHours/**`; `tests/harness/postgres/**` only if harness proof requires it. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S007-01 | task-specific | Opening-hour migration and persistence proof for multiple opening-hour slots uniqueness, FK, indexes, lifecycle, and optional fields. | Broad migration suite may supplement focused persistence proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S007-01 | task-specific | Opening-hour migration and persistence proof for multiple opening-hour slots uniqueness, FK, indexes, lifecycle, and optional fields. | Broad migration suite may supplement focused persistence proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`