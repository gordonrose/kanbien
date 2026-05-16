# T-S013-03: Prove grouped search permissions, paging, filters, and performance posture

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S013-03 |
| Parent Story ID | S-013 |
| Task Type | TEST:test-only |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Prove grouped search permissions, paging, filters, and performance posture |
| Allowed Write Set | tests/integration/organizationSearch/**; tests/security/organizationSearch/**; tests/performance/organizationSearch/** |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | T-S013-02 where sequencing is required. |
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
| T-S013-03 | single-proof-target | 1 | AC-S013-01 is the only acceptance criterion for S-013. | Executable proof covers broad text, exact filters, grouped result types, tenant denial, stable paging, sorting, and index-backed performance evidence. | feature-local task seam | Prove grouped search permissions, paging, filters, and performance posture proves its scoped part of AC-S013-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S013-03 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S013-03 | tests/integration/organizationSearch/**; tests/security/organizationSearch/**; tests/performance/organizationSearch/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Test-Only Coverage Contract

| Task ID | Test Change Class | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S013-03 | prd-test-case | Approved story acceptance criterion and PRD-derived TC obligations. | TC-ORG-FOUNDATION-013 | integration/security/unit as scoped | Executable proof covers broad text, exact filters, grouped result types, tenant denial, stable paging, sorting, and index-backed performance evidence. | Fixtures from real persistence/API shapes and approved contracts. | mock-honesty comparison against live/runtime payload or contract shape required. | no production behavior change; missing production behavior routes to DEV:backend or DEV:platform-seam tasks. | npx vitest run tests/integration/organizationSearch/** | not-applicable: production behavior changes route to owning DEV:backend or DEV:platform-seam task. |

### Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S013-03 | CAP-ORG-SEARCH-001 | root admin, tenant admin, public/system actors where scoped | allowed and denied permission states | active, archived, retained, deleted/removed, failed/expired where scoped | same-tenant, cross-tenant, requester-bound, raw URL/storage denial | unauthenticated, unauthorized, cross-tenant, stale lifecycle, invalid object, raw storage access | not-applicable: matrix applies to this task | not-applicable: coverage planned here |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S013-03 | narrow-pattern | tests/integration/organizationSearch/**; tests/security/organizationSearch/**; tests/performance/organizationSearch/** | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S013-03 | task-specific | Executable proof covers broad text, exact filters, grouped result types, tenant denial, stable paging, sorting, and index-backed performance evidence. | Broad gates may supplement focused proof but do not replace it. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S013-03 | task-specific | Executable proof covers broad text, exact filters, grouped result types, tenant denial, stable paging, sorting, and index-backed performance evidence. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`