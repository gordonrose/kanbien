# T-S015-05: Refresh private export artifacts and runbook after delivery

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S015-05 |
| Parent Story ID | S-015 |
| Task Type | DOC:docs-artifact |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Refresh private export artifacts and runbook after delivery |
| Allowed Write Set | docs/features/organization-exports.md; docs/workspace/runbooks/organization-private-export-bundles.md; docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-015-private-export-bundles/** |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | T-S015-04 where sequencing is required. |
| Shared Seams | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S-015 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S015-01 | S-015 | Export bundles support selected sections, current-only or include-retained choice, JSON data, selected actual files, requester-bound download, PIN view/email behavior, cancel, retry, ready/failed notification, 24-hour expiry, manual delete, and cleanup failure recording. | mixed | unit, integration, security, audit, privacy, resilience, job | PRD, API contract, data dictionary, permission mapping, runbook |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-015 | AC-S015-01 | CAP-ORG-EXPORT-001 | tenant/root/system-job | create-or-refresh-required | Private export bundles. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S015-05 | single-proof-target | 1 | AC-S015-01 is the only acceptance criterion for S-015. | Export docs, runbook, story evidence, manifest notes, and generated graph status reflect implemented job/file/security behavior. | documentation artifact seam | Refresh private export artifacts and runbook after delivery proves its scoped part of AC-S015-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S015-05 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S015-05 | docs/features/organization-exports.md; docs/workspace/runbooks/organization-private-export-bundles.md; docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-015-private-export-bundles/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S015-05 | maintained-artifact-sweep | stale-artifact-sweep | rg -n "S-015 AC-S015-01 CAP-ORG-EXPORT-001" docs/workspace docs/prd docs/architecture | Story breakdown, PRD, Technical Steering, capability matrix, and ordinary status sources. | docs/features/organization-exports.md; docs/workspace/runbooks/organization-private-export-bundles.md; docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-015-private-export-bundles/** | export implementation status | Sweep scope covers story evidence, README/index/status notes, and route specialized artifacts to DOC:api-contract, DOC:data-dictionary, DOC:permission-mapping, GOV:design-system, TEST:test-only, or EVIDENCE:qa-evidence when discovered. | Specialized API/data/permission/design-system/test/evidence changes must route to DOC:api-contract, DOC:data-dictionary, DOC:permission-mapping, GOV:design-system, TEST:test-only, or EVIDENCE:qa-evidence; this task records ordinary docs/status alignment only. | npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-015-private-export-bundles --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown | Reviewer checks source truth alignment and routed follow-ups only. | Task breakdown validation and stale-text scan evidence. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S015-05 | narrow-pattern | docs/features/organization-exports.md; docs/workspace/runbooks/organization-private-export-bundles.md; docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-015-private-export-bundles/** | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S015-05 | task-specific | Export docs, runbook, story evidence, manifest notes, and generated graph status reflect implemented job/file/security behavior. | Broad gates may supplement focused proof but do not replace it. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S015-05 | task-specific | Export docs, runbook, story evidence, manifest notes, and generated graph status reflect implemented job/file/security behavior. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`