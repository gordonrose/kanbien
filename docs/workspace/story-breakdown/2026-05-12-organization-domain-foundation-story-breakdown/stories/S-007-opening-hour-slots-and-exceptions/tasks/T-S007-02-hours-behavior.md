# T-S007-02: Implement weekly slot and exception create, read/list, update, delete, export-projection, and effective-hours precedence behavior.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S007-02 |
| Parent Story ID | S-007 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement weekly slot and exception create, read/list, update, delete, export-projection, and effective-hours precedence behavior. |
| Allowed Write Set | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/domain/**`; `src/features/organizationOpeningHours/persistence/**`; `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**`. |
| Non-Goals | No transport mounting, no UI, no grouped search, no export bundle generation. |
| Dependencies | T-S007-01 complete. |
| Shared Seams | organizationOpeningHours repository seam; organizationLocations public identity/object seam. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S007 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | S-007 | Opening-hour slots and exceptions enforce weekday slot order, same-day open/close validation, no overlapping active slots, no overnight v1 slots, and exception precedence of closed day, replacement day, closed slot, then special opening. | persistence-level | unit, integration, security, persistence | PRD, API contract, data dictionary |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-007 | AC-S007-01 | CAP-ORG-HOURS-001 | tenant/root | create-or-refresh-required | Weekly slots and exceptions. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-02 | single-behavior | 1 | Covers opening-hour domain behavior only. | Opening-hour create/read/update/lifecycle/export projection behavior. | organizationOpeningHours domain service | Unit and integration proof for valid fields, multiple descriptive head-office flags allowed, lifecycle, and projection. | none | Transport and authz are split to T-S007-03. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S007-02 | proof-gap | organizationCore public seam cannot prove the owning Organization exists in the actor tenant/account. | Stop and route to organizationCore public seam refinement. | no | Opening Hours must not attach across tenant/account boundaries. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S007-02 | `src/features/organizationCore/index.ts`; `src/features/*/domain/`; `src/features/*/contract/`; `src/features/*/persistence/`; S-007 story. | T-S007-01 repository/storage seam; organizationCore public identity seam. | PRD, data dictionary mutation rules, API request rules. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S007-02 | domain-behavior | S-007 story, PRD, data dictionary, API contract, permission mapping, implementation blueprint | `src/features/organizationOpeningHours` | new-capability-file | Inspect `src/features/organizationCore`, feature domain/contract/persistence examples, and `docs/data-dictionary/organization-opening-hours.md`. | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/domain/**`; `src/features/organizationOpeningHours/persistence/**`; `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**` | contract schemas, domain capability files, repository consumer types, focused tests | Domain validates weekday and time range, optional fields, system-managed fields, multiple opening-hour slots lifecycle, tenant-bound current records, and repository consumption. | approved API contract posture from root and tenant Organization contracts; no contract change in task unless routed. | tenant context required; object rules deny wrong tenant; normal reads exclude archived/deleted. | consumes T-S007-01 storage output; no schema changes in this task. | exposes domain functions for route and export projection consumers; manifest closeout in T-S007-05. | Story evidence links and data dictionary remain source; artifact closeout in T-S007-05. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | opening-hour behavior and export projection. | route/auth split to T-S007-03; grouped search/export bundle work deferred. | `npx vitest run tests/unit/organizationOpeningHours tests/integration/organizationOpeningHours` | Format with repo tooling; generated artifacts unchanged. | Reviewer checks validation, multiple opening-hour slots, tenant, lifecycle, and projection behavior only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S007-02 | narrow-pattern | `src/features/organizationOpeningHours/contract/**`; `src/features/organizationOpeningHours/domain/**`; `src/features/organizationOpeningHours/persistence/**`; `tests/unit/organizationOpeningHours/**`; `tests/integration/organizationOpeningHours/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S007-02 | task-specific | Opening-hour domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S007-02 | task-specific | Opening-hour domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`