# T-S013-01: Add grouped search index/read-model support

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S013-01 |
| Parent Story ID | S-013 |
| Task Type | DEV:migration-persistence |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add grouped search index/read-model support |
| Allowed Write Set | src/features/organizationSearch/persistence/**; tests/integration/organizationSearch/** |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | Source story and approved planning artifacts. |
| Shared Seams | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S-013 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S013-01 | S-013 | Search supports broad text search, explicit exact filters, stable paging, deterministic sorting, grouped result types, index-backed fields, and permission-filtered results without arbitrary advanced query behavior. | runtime-api | unit, integration, security, performance, compatibility | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-013 | AC-S013-01 | CAP-ORG-SEARCH-001 | tenant/root | create-or-refresh-required | Grouped search. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S013-01 | single-behavior | 1 | AC-S013-01 is the only acceptance criterion for S-013. | Search storage/index posture supports broad text, exact filters, stable paging, deterministic sorting, grouped result types, and permission-filterable fields. | migration and persistence seam | Add grouped search index/read-model support proves its scoped part of AC-S013-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S013-01 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S013-01 | src/features/organizationSearch/persistence/**; tests/integration/organizationSearch/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S013-01 | new-migration | Inspect live schema and current migrations before editing. | Validate field/index/lifecycle truth against data dictionary and API contract. | Validate tenant/object ownership, lifecycle state, required fields, and normalized values per row. | Invalid fixtures fail tests; no silent conversion of rejected row shape. | Create a new zero-padded migration; do not rename applied migrations. | Verify constraints, indexes, FKs, timestamps, and transaction semantics in Postgres. | Persistence tests prove representative create/read/update/lifecycle paths. | Review tests/harness/postgres migrations when new migration is added. |

### Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S013-01 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, indexes, and read/write paths. | Search storage/index posture supports broad text, exact filters, stable paging, deterministic sorting, grouped result types, and permission-filterable fields. | Persistence-backed tests cover representative read/write and harness migration run. | not-applicable: data dictionary and contract truth are source inputs. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S013-01 | narrow-pattern | src/features/organizationSearch/persistence/**; tests/integration/organizationSearch/** | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S013-01 | task-specific | Search storage/index posture supports broad text, exact filters, stable paging, deterministic sorting, grouped result types, and permission-filterable fields. | Broad gates may supplement focused proof but do not replace it. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S013-01 | task-specific | Search storage/index posture supports broad text, exact filters, stable paging, deterministic sorting, grouped result types, and permission-filterable fields. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`