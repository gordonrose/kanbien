# T-S015-02: Implement export request, status, cancel, retry, delete, PIN view, and download contracts

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S015-02 |
| Parent Story ID | S-015 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement export request, status, cancel, retry, delete, PIN view, and download contracts |
| Allowed Write Set | src/features/organizationExports/**; src/routes/v1/index.ts; tests/integration/organizationExports/** |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | T-S015-01 where sequencing is required. |
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
| T-S015-02 | single-behavior | 1 | AC-S015-01 is the only acceptance criterion for S-015. | Root and tenant export routes enforce requester-bound authority, selected sections, current/retained scope, safe status, PIN view, authenticated download, cancel, retry, delete, and audit. | feature-local task seam | Implement export request, status, cancel, retry, delete, PIN view, and download contracts proves its scoped part of AC-S015-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S015-02 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S015-02 | src/features/organizationExports/**; src/routes/v1/index.ts; tests/integration/organizationExports/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S015-02 | domain-behavior | Story, PRD, API contract, data dictionary, permission mapping, Technical Steering, and implementation blueprint. | src/features/organizationExports | new-capability-file | rg -n "organizationExports organization" src/features tests docs | src/features/organizationExports/**; src/routes/v1/index.ts; tests/integration/organizationExports/** | contract, domain capability files, repository consumers, transport/integration as scoped. | Domain owns validation/lifecycle; transport owns request mapping; integration owns wiring. | Approved API contract posture; DOC:api-contract split if contract drift appears. | Authorization, tenant boundary, lifecycle, allow/deny, and audit posture from permission mapping. | No schema work unless already split to DEV:migration-persistence; repository consumes approved storage. | Feature manifest/public seam impact must be closed by docs artifact task. | Story and maintained artifact obligations carried to docs closeout task. | not-applicable: no scaffold command approved; inspect repo feature patterns. | Root and tenant export routes enforce requester-bound authority, selected sections, current/retained scope, safe status, PIN view, authenticated download, cancel, retry, delete, and audit. | not-applicable: API, permission, and persistence work already split or source-approved. | npx vitest run tests/integration/organizationExports/ | Regenerate dependency graph if manifest changes. | Reviewer checks only scoped backend behavior, authority, lifecycle, and audit. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S015-02 | narrow-pattern | src/features/organizationExports/**; src/routes/v1/index.ts; tests/integration/organizationExports/** | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S015-02 | task-specific | Root and tenant export routes enforce requester-bound authority, selected sections, current/retained scope, safe status, PIN view, authenticated download, cancel, retry, delete, and audit. | Broad gates may supplement focused proof but do not replace it. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S015-02 | task-specific | Root and tenant export routes enforce requester-bound authority, selected sections, current/retained scope, safe status, PIN view, authenticated download, cancel, retry, delete, and audit. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`