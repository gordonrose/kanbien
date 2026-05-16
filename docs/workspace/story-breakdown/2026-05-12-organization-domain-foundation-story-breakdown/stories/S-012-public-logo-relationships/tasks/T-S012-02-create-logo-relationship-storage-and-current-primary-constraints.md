# T-S012-02: Create logo relationship storage and current-primary constraints

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S012-02 |
| Parent Story ID | S-012 |
| Task Type | DEV:migration-persistence |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Create logo relationship storage and current-primary constraints |
| Allowed Write Set | src/features/organizationBrandingReferences/persistence/**; tests/integration/organizationBrandingReferences/** |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | T-S012-01 where sequencing is required. |
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
| T-S012-02 | single-behavior | 1 | AC-S012-01 is the only acceptance criterion for S-012. | Organization logo relationship storage supports one current primary logo, lifecycle, replacement, removal, alt text, and cleanup metadata. | migration and persistence seam | Create logo relationship storage and current-primary constraints proves its scoped part of AC-S012-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S012-02 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S012-02 | src/features/organizationBrandingReferences/persistence/**; tests/integration/organizationBrandingReferences/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-02 | new-migration | Inspect live schema and current migrations before editing. | Validate field/index/lifecycle truth against data dictionary and API contract. | Validate tenant/object ownership, lifecycle state, required fields, and normalized values per row. | Invalid fixtures fail tests; no silent conversion of rejected row shape. | Create a new zero-padded migration; do not rename applied migrations. | Verify constraints, indexes, FKs, timestamps, and transaction semantics in Postgres. | Persistence tests prove representative create/read/update/lifecycle paths. | Review tests/harness/postgres migrations when new migration is added. |

### Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S012-02 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, indexes, and read/write paths. | Organization logo relationship storage supports one current primary logo, lifecycle, replacement, removal, alt text, and cleanup metadata. | Persistence-backed tests cover representative read/write and harness migration run. | not-applicable: data dictionary and contract truth are source inputs. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S012-02 | narrow-pattern | src/features/organizationBrandingReferences/persistence/**; tests/integration/organizationBrandingReferences/** | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S012-02 | task-specific | Organization logo relationship storage supports one current primary logo, lifecycle, replacement, removal, alt text, and cleanup metadata. | Broad gates may supplement focused proof but do not replace it. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S012-02 | task-specific | Organization logo relationship storage supports one current primary logo, lifecycle, replacement, removal, alt text, and cleanup metadata. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`