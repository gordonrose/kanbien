# T-S009-04: Add S-009 proof suite for business-unit target validation, fixed labels, self-link denial, individual/person target deferral, same-tenant enforcement, lifecycle visibility, and audit rows.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S009-04 |
| Parent Story ID | S-009 |
| Task Type | TEST:test-only |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add S-009 proof suite for business-unit target validation, fixed labels, self-link denial, individual/person target deferral, same-tenant enforcement, lifecycle visibility, and audit rows. |
| Allowed Write Set | `tests/integration/organizationBusinessUnits/**`; `tests/fixtures/organizationBusinessUnitMemberships/**` if needed. |
| Non-Goals | No production behavior change, no API contract edits, no permission truth edits. |
| Dependencies | T-S009-01 through T-S009-03 complete. |
| Shared Seams | live API and persistence fixtures must match implementation contracts. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S009 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S009-01 | S-009 | Membership records accept only real business-unit targets for the current slice, fixed participation labels of owner, manager, member, and viewer, same-tenant ownership, self-link denial, and explicit individual/person target deferral. | persistence-level | unit, integration, security, audit, privacy | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-009 | AC-S009-01 | CAP-ORG-MEMBER-001 | tenant/root | create-or-refresh-required | Memberships. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-04 | single-proof-target | 1 | Proof-only task validates completed S-009 slice. | Executable proof suite. | test harness | Focused S-009 TC coverage proves accepted and denied states against real implementation. | none | Production behavior changes route back to DEV tasks. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S009-04 | proof-gap | Tests require behavior not implemented by T-S009-01 through T-S009-03. | Split missing production behavior to DEV task. | no | TEST:test-only must not change product behavior. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S009-04 | PRD test-case document; new source tests from T-S009-01 through T-S009-03. | test harness, live API/persistence fixtures. | AC-S009-01, TC-ORG-FOUNDATION unit/int/sec/audit/edge/conc rows. |

### Test-Only Coverage Contract

| Task ID | Test Change Class | Test-Only Coverage Source | Test-Only Traceability IDs | Test-Only Test Layer | Test-Only Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Test-Only Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-04 | prd-test-case | PRD-derived test cases and AC-S009-01 | AC-S009-01; TC-ORG-FOUNDATION-UNIT-004; TC-ORG-FOUNDATION-INT-003; TC-ORG-FOUNDATION-CONC-002 | unit, integration, security, audit, persistence, concurrency | Membership implementation from T-S009-01 through T-S009-03. | Real Postgres fixtures in `tests/integration/organizationBusinessUnits/persistence.test.ts`. | Mock-honesty comparison required against real persistence rows and route payloads; route-level security expansion can follow if missing. | no production behavior change; test-only posture | `npx vitest run tests/integration/organizationBusinessUnits/persistence.test.ts`; `npx vitest run tests/integration/organizationBusinessUnits/persistence.test.ts` | Missing product behavior routes to DEV:backend or DEV:migration-persistence task. |

### Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-04 | Organization memberships routes and domain operations | allowed root admin actor, allowed tenant admin actor, denied unauthenticated actor, denied expired session actor, denied wrong tenant actor | permission states: allowed membership manage/read capability; denied missing grant permission; denied wrong authority role | object lifecycle states: active, archived, deleted memberships; active/archived/deleted owning Organizations and business units | boundary states: selected tenant, current tenant, cross-tenant Organization, same-tenant Organization | invalid member target, cross-tenant Organization, archived normal update, deleted normal update, invalid role or target, system-managed fields | not-applicable: matrix is applicable and covered. | none |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S009-04 | narrow-pattern | `tests/integration/organizationBusinessUnits/**`; `tests/fixtures/organizationBusinessUnitMemberships/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S009-04 | task-specific | S-009 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S009-04 | task-specific | S-009 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`