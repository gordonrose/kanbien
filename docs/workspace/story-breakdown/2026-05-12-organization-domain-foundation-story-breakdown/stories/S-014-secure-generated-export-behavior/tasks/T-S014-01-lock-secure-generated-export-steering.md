# T-S014-01: Lock secure generated export steering

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S014-01 |
| Parent Story ID | S-014 |
| Task Type | DECISION:architecture-foundation |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Lock secure generated export steering |
| Allowed Write Set | docs/workspace/technical-steering/2026-05-15-secure-generated-export-behavior-steering.md |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | Source story and approved planning artifacts. |
| Shared Seams | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S-014 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S014-01 | S-014 | Secure generated export steering defines PIN/password ZIP mechanics, requester-only download, cancellation, retry, ready/failed notifications, safety limits, cleanup, expiry, failure recording, and runbook posture. | contract-level | docs-alignment, security, audit, resilience, job | technical steering, reusable export pattern |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-014 | AC-S014-01 | CAP-ORG-EXPORT-SIGNOFF-001 | job/security | create-or-refresh-required | Secure export technical steering. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S014-01 | single-decision | 1 | AC-S014-01 is the only acceptance criterion for S-014. | Secure export steering defines PIN/password ZIP, requester-only download, cancellation, retry, notification, safety limits, cleanup, expiry, failure recording, and runbook posture. | feature-local task seam | Lock secure generated export steering proves its scoped part of AC-S014-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S014-01 | architecture-decision | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S014-01 | docs/workspace/technical-steering/2026-05-15-secure-generated-export-behavior-steering.md; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S014-01 | narrow-pattern | docs/workspace/technical-steering/2026-05-15-secure-generated-export-behavior-steering.md | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S014-01 | task-specific | Secure export steering defines PIN/password ZIP, requester-only download, cancellation, retry, notification, safety limits, cleanup, expiry, failure recording, and runbook posture. | Broad gates may supplement focused proof but do not replace it. |

### Architecture Foundation Contract

| Task ID | Concern Area | Architecture Trigger | Architecture Question | Decision Analysis Status | Decision Provenance Source | Missing Analysis Fields | Sources To Review | Decision Source Inventory | Decision Analysis Checklist | Decision Owner | Output Artifact Target | Downstream Tasks Blocked | Compatibility Posture | Final Authority Route | Human Review Boundary | Forbidden Implementation / Guess |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S014-01 | security-privacy-boundary | lifecycle-cleanup | Lock secure generated export steering | approved-source-exists | Technical Steering and approved story evidence. | none | Technical Steering, ADRs, architecture docs, and story breakdown. | rg -n "S-014 Lock" docs/workspace docs/architecture | Reviewed options, trade-offs, risk, cost, compatibility, operability, testability, reversibility, recommendation, and signoff. | Architecture/repo governance owner. | docs/workspace/technical-steering/2026-05-15-secure-generated-export-behavior-steering.md | not-applicable: approved source exists | compatibility preserved; additive planning decision only. | existing-architecture-source | Review output artifact and downstream unblock posture only. | No source implementation or unapproved authority changes. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S014-01 | task-specific | Secure export steering defines PIN/password ZIP, requester-only download, cancellation, retry, notification, safety limits, cleanup, expiry, failure recording, and runbook posture. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`