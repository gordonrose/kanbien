# T-S006-02: Implement location create, read/list, update, archive, restore, delete, and export-projection domain behavior.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S006-02 |
| Parent Story ID | S-006 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement location create, read/list, update, archive, restore, delete, and export-projection domain behavior. |
| Allowed Write Set | `src/features/organizationLocations/contract/**`; `src/features/organizationLocations/domain/**`; `src/features/organizationLocations/persistence/**`; `tests/unit/organizationLocations/**`; `tests/integration/organizationLocations/**`. |
| Non-Goals | No transport mounting, no UI, no grouped search, no export bundle generation. |
| Dependencies | T-S006-01 complete. |
| Shared Seams | organizationLocations repository seam; organizationCore public identity/object seam. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S006 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S006-01 | S-006 | Location records allow many locations per organization, allow multiple descriptive head-office flags, validate optional coordinates, support lifecycle visibility, and remain scoped to the owning tenant. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-006 | AC-S006-01 | CAP-ORG-LOC-001 | tenant/root | create-or-refresh-required | Locations. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-02 | single-behavior | 1 | Covers location domain behavior only. | Location create/read/update/lifecycle/export projection behavior. | organizationLocations domain service | Unit and integration proof for valid fields, multiple descriptive head-office flags allowed, lifecycle, and projection. | none | Transport and authz are split to T-S006-03. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S006-02 | proof-gap | organizationCore public seam cannot prove the owning Organization exists in the actor tenant/account. | Stop and route to organizationCore public seam refinement. | no | Locations must not attach across tenant/account boundaries. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S006-02 | `src/features/organizationCore/index.ts`; `src/features/*/domain/`; `src/features/*/contract/`; `src/features/*/persistence/`; S-006 story. | T-S006-01 repository/storage seam; organizationCore public identity seam. | PRD, data dictionary mutation rules, API request rules. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S006-02 | domain-behavior | S-006 story, PRD, data dictionary, API contract, permission mapping, implementation blueprint | `src/features/organizationLocations` | new-capability-file | Inspect `src/features/organizationCore`, feature domain/contract/persistence examples, and `docs/data-dictionary/organization-location.md`. | `src/features/organizationLocations/contract/**`; `src/features/organizationLocations/domain/**`; `src/features/organizationLocations/persistence/**`; `tests/unit/organizationLocations/**`; `tests/integration/organizationLocations/**` | contract schemas, domain capability files, repository consumer types, focused tests | Domain validates location name, optional fields, system-managed fields, many-locations lifecycle, tenant-bound current records, and repository consumption. | approved API contract posture from root and tenant Organization contracts; no contract change in task unless routed. | tenant context required; object rules deny wrong tenant; normal reads exclude archived/deleted. | consumes T-S006-01 storage output; no schema changes in this task. | exposes domain functions for route and export projection consumers; manifest closeout in T-S006-05. | Story evidence links and data dictionary remain source; artifact closeout in T-S006-05. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | location behavior and export projection. | route/auth split to T-S006-03; grouped search/export bundle work deferred. | `npx vitest run tests/unit/organizationLocations tests/integration/organizationLocations` | Format with repo tooling; generated artifacts unchanged. | Reviewer checks validation, many-locations, tenant, lifecycle, and projection behavior only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S006-02 | narrow-pattern | `src/features/organizationLocations/contract/**`; `src/features/organizationLocations/domain/**`; `src/features/organizationLocations/persistence/**`; `tests/unit/organizationLocations/**`; `tests/integration/organizationLocations/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S006-02 | task-specific | Location domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S006-02 | task-specific | Location domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`