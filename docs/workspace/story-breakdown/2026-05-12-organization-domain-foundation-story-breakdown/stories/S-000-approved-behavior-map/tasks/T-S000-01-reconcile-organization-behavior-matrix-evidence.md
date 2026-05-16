# T-S000-01: Reconcile Organization behavior matrix evidence

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S000-01 |
| Parent Story ID | S-000 |
| Task Type | DOC:docs-artifact |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Reconcile Organization behavior matrix evidence |
| Allowed Write Set | docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | Source story and approved planning artifacts. |
| Shared Seams | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S-000 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | The refreshed matrix maps every active v1 Organization behavior to a source decision and story ID, and marks deferred behavior without build-ready posture. | contract-level | docs-alignment, standards | capability matrix |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | CAP-ORG-000 | planning | create-or-refresh-required | Behavior matrix reconciliation. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S000-01 | single-proof-target | 1 | AC-S000-01 is the only acceptance criterion for S-000. | Capability matrix rows trace current Organization behavior, source decisions, and deferred posture. | documentation artifact seam | Reconcile Organization behavior matrix evidence proves its scoped part of AC-S000-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S000-01 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S000-01 | docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S000-01 | maintained-artifact-sweep | stale-artifact-sweep | rg -n "S-000 AC-S000-01 CAP-ORG-000" docs/workspace docs/prd docs/architecture | Story breakdown, PRD, Technical Steering, capability matrix, and ordinary status sources. | docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv | capability matrix status | Sweep scope covers story evidence, README/index/status notes, and route specialized artifacts to DOC:api-contract, DOC:data-dictionary, DOC:permission-mapping, GOV:design-system, TEST:test-only, or EVIDENCE:qa-evidence when discovered. | Specialized API/data/permission/design-system/test/evidence changes must route to DOC:api-contract, DOC:data-dictionary, DOC:permission-mapping, GOV:design-system, TEST:test-only, or EVIDENCE:qa-evidence; this task records ordinary docs/status alignment only. | npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-000-approved-behavior-map --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown | Reviewer checks source truth alignment and routed follow-ups only. | Task breakdown validation and stale-text scan evidence. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S000-01 | narrow-pattern | docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S000-01 | task-specific | Capability matrix rows trace current Organization behavior, source decisions, and deferred posture. | Broad gates may supplement focused proof but do not replace it. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S000-01 | task-specific | Capability matrix rows trace current Organization behavior, source decisions, and deferred posture. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`