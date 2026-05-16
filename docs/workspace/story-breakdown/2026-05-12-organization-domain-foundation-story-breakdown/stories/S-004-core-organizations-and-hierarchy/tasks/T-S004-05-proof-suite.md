# T-S004-05: Add S-004 proof suite for hierarchy, lifecycle, uniqueness, tenant denial, audit, system-managed fields, and concurrency.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S004-05 |
| Parent Story ID | S-004 |
| Task Type | TEST:test-only |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add S-004 proof suite for hierarchy, lifecycle, uniqueness, tenant denial, audit, system-managed fields, and concurrency. |
| Allowed Write Set | `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`; `tests/security/organizationCore/**`; test fixtures under `tests/fixtures/organizationCore/**` if needed. |
| Non-Goals | No production behavior change, no API contract edits, no permission truth edits. |
| Dependencies | T-S004-01 through T-S004-04 complete. |
| Shared Seams | live API and persistence fixtures must match implementation contracts. |

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
| T-S004-05 | single-proof-target | 1 | Proof-only task validates the completed S-004 slice. | Executable proof suite. | test harness | Focused S-004 TC coverage proves accepted and denied states against real implementation. | none | Production behavior changes route back to DEV tasks. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S004-05 | proof-gap | Tests require behavior not implemented by T-S004-01 through T-S004-04. | Split missing production behavior to DEV task. | no | TEST:test-only must not change product behavior. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S004-05 | PRD test-case document; new source tests from T-S004-01 through T-S004-04. | test harness, live API/persistence fixtures. | AC-S004-01, TC-ORG-FOUNDATION unit/int/sec/audit/edge/conc rows. |

### Test-Only Coverage Contract

| Task ID | Test Change Class | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-05 | prd-test-case | PRD test-case document and S-004 task packet | TC-ORG-FOUNDATION-UNIT-001; TC-ORG-FOUNDATION-UNIT-002; TC-ORG-FOUNDATION-UNIT-003; TC-ORG-FOUNDATION-INT-001; TC-ORG-FOUNDATION-INT-002; TC-ORG-FOUNDATION-SEC-002; TC-ORG-FOUNDATION-AUD-001; TC-ORG-FOUNDATION-EDGE-001; TC-ORG-FOUNDATION-EDGE-002; TC-ORG-FOUNDATION-CONC-001; AC-S004-01 | service-unit, feature-integration, security-integration, audit-integration, concurrency-integration | Prove S-004 accepted and denied behavior against implemented organizationCore routes, domain, and persistence. | Real persistence fixtures and API payloads from T-S004 implementation; no invented fallback shapes. | Mock-honesty required: fixtures must match live API, repository, and persistence payloads; mocked authz states must match permission mapping. | no-production-change | `npx vitest run tests/unit/organizationCore/domain.test.ts tests/security/organizationCore/security.test.ts`; `npx vitest run tests/integration/organizationCore/persistence.test.ts` | not-applicable: production gaps route back to T-S004-01 through T-S004-04; API contract gaps route to DOC:api-contract; permission gaps route to DOC:permission-mapping. |

### Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-05 | Organization core record routes and domain operations | allowed root admin actor, allowed tenant admin actor, denied unauthenticated actor, denied expired session actor, denied wrong tenant actor | permission states: allowed organization.create/read/list/update/move/archive/restore/delete capability; denied missing grant permission; denied wrong authority role | object lifecycle states: active, archived, deleted, parented, childed organizations | boundary states: selected tenant, current tenant, cross-tenant parent object, stale parent object, same-tenant parent object | duplicate name, cycle, depth over 10, cross-tenant parent object, stale parent object, deleted normal update, system-managed fields | not-applicable: matrix is applicable and covered. | none |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S004-05 | narrow-pattern | `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`; `tests/security/organizationCore/**`; `tests/fixtures/organizationCore/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S004-05 | task-specific | S-004 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S004-05 | task-specific | S-004 PRD-derived TC suite implementation proof. | Coverage-strength summary supplements focused tests. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`