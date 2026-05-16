# T-S008-04: Add S-008 proof suite for depth 10, cycle denial, child projections, branch archive, child reassignment, same-tenant enforcement, lifecycle visibility, audit, and real-record proof.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S008-04 |
| Parent Story ID | S-008 |
| Task Type | TEST:test-only |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add S-008 proof suite for depth 10, cycle denial, child projections, branch archive, child reassignment, same-tenant enforcement, lifecycle visibility, audit, and real-record proof. |
| Allowed Write Set | `tests/integration/organizationBusinessUnits/**`; `tests/fixtures/organizationBusinessUnits/**` if needed. |
| Non-Goals | No production behavior change, no API contract edits, no permission truth edits. |
| Dependencies | T-S008-01 through T-S008-03 complete. |
| Shared Seams | live API and persistence fixtures must match implementation contracts. |

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
| T-S008-04 | single-proof-target | 1 | Proof-only task validates completed S-008 slice. | Executable proof suite. | test harness | Focused S-008 TC coverage proves accepted and denied states against real implementation. | none | Production behavior changes route back to DEV tasks. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S008-04 | proof-gap | Tests require behavior not implemented by T-S008-01 through T-S008-03. | Split missing production behavior to DEV task. | no | TEST:test-only must not change product behavior. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S008-04 | PRD test-case document; new source tests from T-S008-01 through T-S008-03. | test harness, live API/persistence fixtures. | AC-S008-01, TC-ORG-FOUNDATION unit/int/sec/audit/edge/conc rows. |

### Test-Only Coverage Contract

| Task ID | Test Change Class | Test-Only Coverage Source | Test-Only Traceability IDs | Test-Only Test Layer | Test-Only Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Test-Only Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-04 | prd-test-case | PRD-derived test cases and AC-S008-01 | AC-S008-01; TC-ORG-FOUNDATION-UNIT-004; TC-ORG-FOUNDATION-INT-003; TC-ORG-FOUNDATION-CONC-002 | unit, integration, security, audit, persistence, concurrency | Business-unit implementation from T-S008-01 through T-S008-03. | Live API/repository/persistence fixtures under `tests/**/organizationBusinessUnits/**`. | Mock-honesty comparison required against real persistence rows and route payloads; route-level security expansion can follow if missing. | no production behavior change; test-only posture | `npx vitest run tests/integration/organizationBusinessUnits/persistence.test.ts`; `npx vitest run tests/integration/organizationBusinessUnits/persistence.test.ts` | Missing product behavior routes to DEV:backend or DEV:migration-persistence task. |

### Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-04 | Organization business-unit routes and domain operations | allowed root admin actor, allowed tenant admin actor, denied unauthenticated actor, denied expired session actor, denied wrong tenant actor | permission states: allowed business-unit manage/read capability; denied missing grant permission; denied wrong authority role | object lifecycle states: active, archived, deleted business-units; active/archived/deleted owning Organizations | boundary states: selected tenant, current tenant, cross-tenant Organization, same-tenant Organization | invalid parent or cycle, cross-tenant Organization, archived normal update, deleted normal update, invalid optional field, system-managed fields | not-applicable: matrix is applicable and covered. | none |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S008-04 | narrow-pattern | `tests/integration/organizationBusinessUnits/**`; `tests/fixtures/organizationBusinessUnits/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S008-04 | task-specific | S-008 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S008-04 | task-specific | S-008 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`