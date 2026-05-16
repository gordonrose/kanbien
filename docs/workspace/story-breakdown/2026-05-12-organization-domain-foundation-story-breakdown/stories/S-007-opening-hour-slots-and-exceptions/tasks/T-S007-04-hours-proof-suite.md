# T-S007-04: Add S-007 proof suite for slot order, same-day validation, overlap denial, no overnight slots, same-tenant enforcement, lifecycle visibility, and exception precedence.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S007-04 |
| Parent Story ID | S-007 |
| Task Type | TEST:test-only |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add S-007 proof suite for slot order, same-day validation, overlap denial, no overnight slots, same-tenant enforcement, lifecycle visibility, and exception precedence. |
| Allowed Write Set | `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**`; `tests/security/organizationOpeningHours/**`; test fixtures under `tests/fixtures/organizationOpeningHours/**` if needed. |
| Non-Goals | No production behavior change, no API contract edits, no permission truth edits. |
| Dependencies | T-S007-01 through T-S007-03 complete. |
| Shared Seams | live API and persistence fixtures must match implementation contracts. |

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
| T-S007-04 | single-proof-target | 1 | Proof-only task validates completed S-007 slice. | Executable proof suite. | test harness | Focused S-007 TC coverage proves accepted and denied states against real implementation. | none | Production behavior changes route back to DEV tasks. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S007-04 | proof-gap | Tests require behavior not implemented by T-S007-01 through T-S007-03. | Split missing production behavior to DEV task. | no | TEST:test-only must not change product behavior. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S007-04 | PRD test-case document; new source tests from T-S007-01 through T-S007-03. | test harness, live API/persistence fixtures. | AC-S007-01, TC-ORG-FOUNDATION unit/int/sec/audit/edge/conc rows. |

### Test-Only Coverage Contract

| Task ID | Test Change Class | Test-Only Coverage Source | Test-Only Traceability IDs | Test-Only Test Layer | Test-Only Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Test-Only Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-04 | prd-test-case | PRD-derived test cases and AC-S007-01 | AC-S007-01; TC-ORG-FOUNDATION-UNIT-004; TC-ORG-FOUNDATION-INT-003; TC-ORG-FOUNDATION-CONC-002 | unit, integration, security, audit, persistence, concurrency | Opening-hour implementation from T-S007-01 through T-S007-03. | Live API/repository/persistence fixtures under `tests/**/organizationOpeningHours/**`. | Mock-honesty comparison against live API/repository/persistence shape required. | no production behavior change; test-only posture | `npx vitest run tests/unit/organizationOpeningHours tests/security/organizationOpeningHours`; `npx vitest run tests/integration/organizationOpeningHours/persistence.test.ts` | Missing product behavior routes to DEV:backend or DEV:migration-persistence task. |

### Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-04 | Organization opening-hours routes and domain operations | allowed root admin actor, allowed tenant admin actor, denied unauthenticated actor, denied expired session actor, denied wrong tenant actor | permission states: allowed opening-hour manage/read capability; denied missing grant permission; denied wrong authority role | object lifecycle states: active, archived, deleted opening hours; active/archived/deleted owning Organizations | boundary states: selected tenant, current tenant, cross-tenant Organization, same-tenant Organization | invalid opening-hours range, cross-tenant Organization, archived normal update, deleted normal update, invalid optional field, system-managed fields | not-applicable: matrix is applicable and covered. | none |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S007-04 | narrow-pattern | `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**`; `tests/security/organizationOpeningHours/**`; `tests/fixtures/organizationOpeningHours/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S007-04 | task-specific | S-007 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S007-04 | task-specific | S-007 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`