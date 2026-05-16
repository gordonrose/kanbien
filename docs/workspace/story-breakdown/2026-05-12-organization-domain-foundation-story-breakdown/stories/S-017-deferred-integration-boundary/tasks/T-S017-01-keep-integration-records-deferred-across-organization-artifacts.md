# T-S017-01: Keep integration records deferred across Organization artifacts

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S017-01 |
| Parent Story ID | S-017 |
| Task Type | DOC:docs-artifact |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Keep integration records deferred across Organization artifacts |
| Allowed Write Set | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-017-deferred-integration-boundary/**; docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | Source story and approved planning artifacts. |
| Shared Seams | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S-017 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S017-01 | S-017 | Integration records are marked deferred in PRD, API contracts, data dictionary, story breakdown, and task planning, with no active v1 route, search, UI, export, or persistence task. | contract-level | docs-alignment, standards | PRD, API contracts, data dictionary |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-017 | AC-S017-01 | CAP-ORG-INT-DEFER-001 | planning | create-or-refresh-required | Deferred integration boundary. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S017-01 | single-proof-target | 1 | AC-S017-01 is the only acceptance criterion for S-017. | Integration records remain future scope and absent from active v1 route, search, UI, export, and persistence tasks. | documentation artifact seam | Keep integration records deferred across Organization artifacts proves its scoped part of AC-S017-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S017-01 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S017-01 | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-017-deferred-integration-boundary/**; docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S017-01 | maintained-artifact-sweep | stale-artifact-sweep | rg -n "S-017 AC-S017-01 CAP-ORG-INT-DEFER-001" docs/workspace docs/prd docs/architecture | Story breakdown, PRD, Technical Steering, capability matrix, and ordinary status sources. | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-017-deferred-integration-boundary/**; docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md | integration deferral status | Sweep scope covers story evidence, README/index/status notes, and route specialized artifacts to DOC:api-contract, DOC:data-dictionary, DOC:permission-mapping, GOV:design-system, TEST:test-only, or EVIDENCE:qa-evidence when discovered. | Specialized API/data/permission/design-system/test/evidence changes must route to DOC:api-contract, DOC:data-dictionary, DOC:permission-mapping, GOV:design-system, TEST:test-only, or EVIDENCE:qa-evidence; this task records ordinary docs/status alignment only. | npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-017-deferred-integration-boundary --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown | Reviewer checks source truth alignment and routed follow-ups only. | Task breakdown validation and stale-text scan evidence. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S017-01 | narrow-pattern | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-017-deferred-integration-boundary/**; docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S017-01 | task-specific | Integration records remain future scope and absent from active v1 route, search, UI, export, and persistence tasks. | Broad gates may supplement focused proof but do not replace it. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S017-01 | task-specific | Integration records remain future scope and absent from active v1 route, search, UI, export, and persistence tasks. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`