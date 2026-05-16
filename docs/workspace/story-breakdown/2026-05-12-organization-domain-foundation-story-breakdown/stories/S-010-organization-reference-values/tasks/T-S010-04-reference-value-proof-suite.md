# T-S010-04: Add S-010 proof suite for root create/update/archive/deprecate/replace, tenant read/use, tenant mutation denial, replacement validation, used-value retention, audit, and real-record proof.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S010-04 |
| Parent Story ID | S-010 |
| Task Type | TEST:test-only |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add S-010 proof suite for root create/update/archive/deprecate/replace, tenant read/use, tenant mutation denial, replacement validation, used-value retention, audit, and real-record proof. |
| Allowed Write Set | `tests/integration/organizationReferenceCatalogues/**`; `tests/fixtures/organizationReferenceCatalogues/**` if needed. |
| Non-Goals | No production behavior change, no API contract edits, no permission truth edits. |
| Dependencies | T-S010-01 through T-S010-03 complete. |
| Shared Seams | live API and persistence fixtures must match implementation contracts. |

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
| T-S010-04 | single-proof-target | 1 | Proof-only task validates completed S-010 slice. | Executable proof suite. | test harness | Focused S-010 TC coverage proves accepted and denied states against real implementation. | none | Production behavior changes route back to DEV tasks. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S010-04 | proof-gap | Tests require behavior not implemented by T-S010-01 through T-S010-03. | Split missing production behavior to DEV task. | no | TEST:test-only must not change product behavior. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S010-04 | PRD test-case document; new source tests from T-S010-01 through T-S010-03. | test harness, live API/persistence fixtures. | AC-S010-01, TC-ORG-FOUNDATION unit/int/sec/audit/edge/conc rows. |

### Test-Only Coverage Contract

| Task ID | Test Change Class | Test-Only Coverage Source | Test-Only Traceability IDs | Test-Only Test Layer | Test-Only Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Test-Only Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S010-04 | prd-test-case | PRD-derived test cases and AC-S010-01 | AC-S010-01; TC-ORG-FOUNDATION-UNIT-012; TC-ORG-FOUNDATION-INT-008; TC-ORG-FOUNDATION-SEC-003; TC-ORG-FOUNDATION-AUD-001 | unit, integration, security, audit, persistence | Reference-value implementation from T-S010-01 through T-S010-03. | Live API/repository/persistence fixtures under `tests/**/organizationReferenceCatalogues/**`. | Mock-honesty comparison required against real persistence rows and route payloads; route-level security expansion can follow if missing. | no production behavior change; test-only posture | `npx vitest run tests/integration/organizationReferenceCatalogues/persistence.test.ts`; `npx vitest run tests/security/organizationReferenceCatalogues/referenceValueAuthorization.test.ts` | Missing product behavior routes to DEV:backend or DEV:migration-persistence task. |

### Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S010-04 | Organization reference-value routes and domain operations | allowed root admin actor, allowed tenant admin actor, denied unauthenticated actor, denied expired session actor, denied tenant mutation actor | permission states: allowed reference-value manage/read capability; denied missing grant permission; denied wrong authority role | object lifecycle states: active, archived, deprecated, replaced, in-use reference values | boundary states: root system catalogue mutation; tenant current context read/use; wrong authority mutation denial | empty label/type/key, duplicate key in type, invalid replacement target, replacement self-reference, tenant mutation attempt, system-managed fields | not-applicable: matrix is applicable and covered. | none |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S010-04 | narrow-pattern | `tests/integration/organizationReferenceCatalogues/**`; `tests/fixtures/organizationReferenceCatalogues/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S010-04 | task-specific | S-010 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S010-04 | task-specific | S-010 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`