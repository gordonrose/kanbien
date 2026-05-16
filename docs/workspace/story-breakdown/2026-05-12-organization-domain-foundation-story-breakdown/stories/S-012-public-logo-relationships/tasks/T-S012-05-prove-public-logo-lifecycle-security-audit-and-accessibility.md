# T-S012-05: Prove public logo lifecycle, security, audit, and accessibility

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S012-05 |
| Parent Story ID | S-012 |
| Task Type | TEST:test-only |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Prove public logo lifecycle, security, audit, and accessibility |
| Allowed Write Set | tests/unit/organizationBrandingReferences/**; tests/integration/organizationBrandingReferences/**; tests/security/organizationBrandingReferences/** |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | T-S012-04 where sequencing is required. |
| Shared Seams | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S-012 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S012-01 | S-012 | Logo relationships support the v1 primary logo type, accepted-safe public delivery, app-controlled URLs, replacement after new image readiness, removal to deterministic initials, alt text defaulting, and selected actual-file export inclusion. | mixed | unit, integration, security, audit, asset, accessibility, runtime-api | PRD, API contract, asset decision, data dictionary, permission mapping, runbook |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-012 | AC-S012-01 | CAP-ORG-BRAND-001 | tenant/root/public | create-or-refresh-required | Logo relationships and delivery. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-05 | single-proof-target | 1 | AC-S012-01 is the only acceptance criterion for S-012. | Executable proof covers upload intent, accepted delivery, replacement, removal placeholder, raw URL denial, cache signal, export inclusion, and alt text. | feature-local task seam | Prove public logo lifecycle, security, audit, and accessibility proves its scoped part of AC-S012-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S012-05 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S012-05 | tests/unit/organizationBrandingReferences/**; tests/integration/organizationBrandingReferences/**; tests/security/organizationBrandingReferences/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Test-Only Coverage Contract

| Task ID | Test Change Class | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-05 | prd-test-case | Approved story acceptance criterion and PRD-derived TC obligations. | TC-ORG-FOUNDATION-012 | integration/security/unit as scoped | Executable proof covers upload intent, accepted delivery, replacement, removal placeholder, raw URL denial, cache signal, export inclusion, and alt text. | Fixtures from real persistence/API shapes and approved contracts. | mock-honesty comparison against live/runtime payload or contract shape required. | no production behavior change; missing production behavior routes to DEV:backend or DEV:platform-seam tasks. | npx vitest run tests/unit/organizationBrandingReferences/** | not-applicable: production behavior changes route to owning DEV:backend or DEV:platform-seam task. |

### Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-05 | CAP-ORG-BRAND-001 | root admin, tenant admin, public/system actors where scoped | allowed and denied permission states | active, archived, retained, deleted/removed, failed/expired where scoped | same-tenant, cross-tenant, requester-bound, raw URL/storage denial | unauthenticated, unauthorized, cross-tenant, stale lifecycle, invalid object, raw storage access | not-applicable: matrix applies to this task | not-applicable: coverage planned here |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S012-05 | narrow-pattern | tests/unit/organizationBrandingReferences/**; tests/integration/organizationBrandingReferences/**; tests/security/organizationBrandingReferences/** | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S012-05 | task-specific | Executable proof covers upload intent, accepted delivery, replacement, removal placeholder, raw URL denial, cache signal, export inclusion, and alt text. | Broad gates may supplement focused proof but do not replace it. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S012-05 | task-specific | Executable proof covers upload intent, accepted delivery, replacement, removal placeholder, raw URL denial, cache signal, export inclusion, and alt text. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`