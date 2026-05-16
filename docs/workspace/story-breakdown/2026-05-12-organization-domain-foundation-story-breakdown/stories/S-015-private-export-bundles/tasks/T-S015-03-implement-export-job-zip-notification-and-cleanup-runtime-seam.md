# T-S015-03: Implement export job, ZIP, notification, and cleanup runtime seam

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S015-03 |
| Parent Story ID | S-015 |
| Task Type | DEV:platform-seam |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement export job, ZIP, notification, and cleanup runtime seam |
| Allowed Write Set | src/features/organizationExports/**; src/lib/**/export*; tests/integration/organizationExports/** |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | T-S015-02 where sequencing is required. |
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
| T-S015-03 | single-behavior | 1 | AC-S015-01 is the only acceptance criterion for S-015. | Background worker generates PIN/password ZIP, manifest, actual selected files, checksum, ready/failed notifications, expiry, delete, cleanup retry, and safe failure categories. | platform runtime seam | Implement export job, ZIP, notification, and cleanup runtime seam proves its scoped part of AC-S015-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S015-03 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S015-03 | src/features/organizationExports/**; src/lib/**/export*; tests/integration/organizationExports/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Platform Seam Contract

| Task ID | Seam Kind | Compatibility Mode | Approved Authority Source | Seam Owner / Reference-value | Seam Source Inventory | Seam Change Scope | Exact Write Envelope | Why Not Feature-Local | Current / Future / Unsupported Consumers | Compatibility Contract | Representative Consumer Proof | Runtime / Restart Impact | Rollout / Backout Posture | Artifact / Materialization Impact | Generated / Apply / Check Command | Expected Seam Output | Architecture / Standards Boundary | Split / Blocked Follow-Up | Proof Commands | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S015-03 | scheduler-job-runtime | additive-compatible | Technical Steering, story, capability rows, and asset/export decision records. | platform runtime seam under src/lib or feature integration boundary. | rg -n "organizationExports export logo" src tests docs | Implement export job, ZIP, notification, and cleanup runtime seam | narrow path pattern: src/features/organizationExports/**; src/lib/**/export*; tests/integration/organizationExports/** | Shared platform behavior is required by assets/jobs and multiple current/future feature consumers; not feature-local only. | current Organization consumer; future export/logo consumers; unsupported generic hosting/public export links. | Backwards compatible additive seam; existing consumers unchanged. | Representative consumer proof through route/job tests and security check. | Runtime seam may require restart or worker reload; delivery must record restart posture. | Rollout/backout by reverting additive seam and feature wiring. | No generated artifact impact unless manifest changes route to generated graph check. | npm run check:feature-dependencies | Expected seam output is a runtime helper/route/job seam consumed by Organization. | no authority changes and no architecture changes; no standards changes. | not-applicable: specialized API, permission, and persistence work are split. | npx vitest run tests/integration/organizationExports/ tests/security/organizationExports/ | Review runtime seam behavior and unsupported consumer denial. |

### Platform Seam Class Contract

| Task ID | Platform Seam Class | Class-Specific Required Proof | Required Consumer Coverage | Runtime / Materialization Expectation | Forbidden Contamination / Split Notes |
| --- | --- | --- | --- | --- | --- |
| T-S015-03 | scheduler-job-runtime | Prove job scheduling/runtime behavior, timing or retry posture, and Organization export job consumer. | Consumer coverage includes Organization route/job tests and future unsupported generic consumer denial. | Runtime proof names restart/reload posture and representative consumer execution. | not-applicable: API, permission, persistence, and feature behavior are split to owning tasks. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S015-03 | narrow-pattern | src/features/organizationExports/**; src/lib/**/export*; tests/integration/organizationExports/** | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S015-03 | task-specific | Background worker generates PIN/password ZIP, manifest, actual selected files, checksum, ready/failed notifications, expiry, delete, cleanup retry, and safe failure categories. | Broad gates may supplement focused proof but do not replace it. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S015-03 | task-specific | Background worker generates PIN/password ZIP, manifest, actual selected files, checksum, ready/failed notifications, expiry, delete, cleanup retry, and safe failure categories. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`