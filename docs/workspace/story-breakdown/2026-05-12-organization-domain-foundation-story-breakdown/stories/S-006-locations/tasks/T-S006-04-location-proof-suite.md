# T-S006-04: Add S-006 proof suite for many-locations rule, same-tenant enforcement, lifecycle visibility, system-managed fields, optional field validation, audit, and concurrency.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S006-04 |
| Parent Story ID | S-006 |
| Task Type | TEST:test-only |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add S-006 proof suite for many-locations rule, same-tenant enforcement, lifecycle visibility, system-managed fields, optional field validation, audit, and concurrency. |
| Allowed Write Set | `tests/unit/organizationLocations/**`; `tests/integration/organizationLocations/**`; `tests/security/organizationLocations/**`; test fixtures under `tests/fixtures/organizationLocations/**` if needed. |
| Non-Goals | No production behavior change, no API contract edits, no permission truth edits. |
| Dependencies | T-S006-01 through T-S006-03 complete. |
| Shared Seams | live API and persistence fixtures must match implementation contracts. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S006 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S006-01 | S-006 | Location records allow many locations per organization, allow multiple descriptive head-office flags, validate optional coordinates, support lifecycle visibility, and remain scoped to the owning tenant. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-006 | AC-S006-01 | CAP-ORG-LOC-001 | tenant/root | create-or-refresh-required | Locations. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-04 | single-proof-target | 1 | Proof-only task validates completed S-006 slice. | Executable proof suite. | test harness | Focused S-006 TC coverage proves accepted and denied states against real implementation. | none | Production behavior changes route back to DEV tasks. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S006-04 | proof-gap | Tests require behavior not implemented by T-S006-01 through T-S006-03. | Split missing production behavior to DEV task. | no | TEST:test-only must not change product behavior. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S006-04 | PRD test-case document; new source tests from T-S006-01 through T-S006-03. | test harness, live API/persistence fixtures. | AC-S006-01, TC-ORG-FOUNDATION unit/int/sec/audit/edge/conc rows. |

### Test-Only Coverage Contract

| Task ID | Test Change Class | Test-Only Coverage Source | Test-Only Traceability IDs | Test-Only Test Layer | Test-Only Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Test-Only Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-04 | prd-test-case | PRD-derived test cases and AC-S006-01 | AC-S006-01; TC-ORG-FOUNDATION-UNIT-004; TC-ORG-FOUNDATION-INT-003; TC-ORG-FOUNDATION-CONC-002 | unit, integration, security, audit, persistence, concurrency | Location implementation from T-S006-01 through T-S006-03. | Live API/repository/persistence fixtures under `tests/**/organizationLocations/**`. | Mock-honesty comparison against live API/repository/persistence shape required. | no production behavior change; test-only posture | `npx vitest run tests/unit/organizationLocations tests/security/organizationLocations`; `npx vitest run tests/integration/organizationLocations/persistence.test.ts` | Missing product behavior routes to DEV:backend or DEV:migration-persistence task. |

### Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-04 | Organization location routes and domain operations | allowed root admin actor, allowed tenant admin actor, denied unauthenticated actor, denied expired session actor, denied wrong tenant actor | permission states: allowed location manage/read capability; denied missing grant permission; denied wrong authority role | object lifecycle states: active, archived, deleted locations; active/archived/deleted owning Organizations | boundary states: selected tenant, current tenant, cross-tenant Organization, same-tenant Organization | invalid coordinates location, cross-tenant Organization, archived normal update, deleted normal update, invalid optional field, system-managed fields | not-applicable: matrix is applicable and covered. | none |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S006-04 | narrow-pattern | `tests/unit/organizationLocations/**`; `tests/integration/organizationLocations/**`; `tests/security/organizationLocations/**`; `tests/fixtures/organizationLocations/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S006-04 | task-specific | S-006 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S006-04 | task-specific | S-006 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`