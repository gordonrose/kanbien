# T-S010-01: Create reference-value storage with stable type/key uniqueness, lifecycle status, archive/deprecate timestamps, replacement link, label search index, and audit table.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S010-01 |
| Parent Story ID | S-010 |
| Task Type | DEV:migration-persistence |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Create reference-value storage with stable type/key uniqueness, lifecycle status, archive/deprecate timestamps, replacement link, label search index, and audit table. |
| Allowed Write Set | `src/features/organizationReferenceCatalogues/persistence/**`; `tests/integration/organizationReferenceCatalogues/**`; shared Postgres harness only if required by migration proof. |
| Non-Goals | No app UI, no grouped search implementation, no export job assembly, no Organization core rewrite, no generic platform catalogue. |
| Dependencies | S-002 permission map exists; live schema inspection before editing. |
| Shared Seams | migration runner; Postgres harness; root/tenant identity tables only as audit actor references. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S010 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S010-01 | S-010 | Reference values are root-managed, tenant-usable, immediately reflected by label changes, and archived, deprecated, or explicitly replaced when already used. | mixed | unit, integration, security, audit, compatibility | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-010 | AC-S010-01 | CAP-ORG-CAT-001 | root/tenant-use | create-or-refresh-required | Reference values. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S010-01 | single-behavior | 1 | AC-S010-01 requires persistence before behavior proof can be honest. | Reference-value durable storage, stable key/type uniqueness, lifecycle fields, replacement link, search/index posture, and audit rows. | migration and repository schema seam | Live schema and persistence proof show constraints match data dictionary. | none | Splitting indexes from table creation would leave no executable read/write proof. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S010-01 | source-truth-mismatch | Live schema, migration conventions, API contract, and data dictionary disagree on reference-value field names, lifecycle states, replacement fields, stable key uniqueness, or indexes. | Stop and route to data/API alignment before migration. | no | Migration shape must not silently choose between source truths. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S010-01 | `src/features/*/persistence/migrations/`; `tests/harness/postgres/`; existing feature-local catalogue or lifecycle examples. | migration runner, Postgres test harness, audit actor references. | Reference-value data dictionary, PRD, API contracts, AGENTS migration safety. |

### Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S010-01 | new-migration | Inspect live schema and current migrations before editing; confirm no existing reference-value table, indexes, or conflicting names. | Validate fields against data dictionary: organization_reference_value_id, reference_type, reference_value_key, label, replacement_reference_value_id, lifecycle_status, archived_at, deprecated_at, created_at, updated_at. | New rows must have non-empty type/key/label, unique key per type, valid replacement target of compatible type, and lifecycle state from the approved set. | Invalid fixture rows fail tests; no silent conversion of bad source shape. | Create a new zero-padded migration file; do not rename applied migrations. | Verify self-FK, unique key, lifecycle constraints/defaults, timestamp type, and index execution semantics in Postgres. | Persistence tests create, read, update label, archive, deprecate, replace, reject invalid replacement, and retain used/deprecated/replaced values. | Review and update `tests/harness/postgres/migrations.ts` when new migration is added. |

### Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S010-01 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and representative read/write paths in the migration task itself. | Covers reference-value table, stable key/type uniqueness, lifecycle columns, replacement self-link, label/status indexes, and audit table. | Persistence-backed tests cover create, label update, archive, deprecate, replace, invalid replacement denial, used-value retention posture, and harness migration run. | not-applicable: data dictionary and contract docs are current from S-010 story evidence. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S010-01 | narrow-pattern | `src/features/organizationReferenceCatalogues/persistence/**`; `tests/integration/organizationReferenceCatalogues/**`; `tests/harness/postgres/**` only if harness proof requires it. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S010-01 | task-specific | Reference-value migration and persistence proof for stable keys, lifecycle states, replacement link, indexes, and audit rows. | Broad migration suite may supplement focused persistence proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S010-01 | task-specific | Reference-value migration and persistence proof for stable keys, lifecycle states, replacement link, indexes, and audit rows. | Broad migration suite may supplement focused persistence proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`