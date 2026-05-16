# T-S005-02: Implement legal-profile create, read/list, update, archive, restore, delete, and export-projection domain behavior.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S005-02 |
| Parent Story ID | S-005 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement legal-profile create, read/list, update, archive, restore, delete, and export-projection domain behavior. |
| Allowed Write Set | `src/features/organizationLegalDetails/contract/**`; `src/features/organizationLegalDetails/domain/**`; `src/features/organizationLegalDetails/persistence/**`; `tests/unit/organizationLegalDetails/**`; `tests/integration/organizationLegalDetails/**`. |
| Non-Goals | No transport mounting, no UI, no grouped search, no export bundle generation. |
| Dependencies | T-S005-01 complete. |
| Shared Seams | organizationLegalDetails repository seam; organizationCore public identity/object seam. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S005 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | S-005 | Legal profile records enforce one active profile per organization and support optional tax/VAT number, optional registered address, lifecycle visibility, retained profile reads where approved, and same-tenant enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-005 | AC-S005-01 | CAP-ORG-LEGAL-001 | tenant/root | create-or-refresh-required | Legal profiles. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-02 | single-behavior | 1 | Covers legal-profile domain behavior only. | Legal-profile create/read/update/lifecycle/export projection behavior. | organizationLegalDetails domain service | Unit and integration proof for valid fields, one-active denial, lifecycle, and projection. | none | Transport and authz are split to T-S005-03. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S005-02 | proof-gap | organizationCore public seam cannot prove the owning Organization exists in the actor tenant/account. | Stop and route to organizationCore public seam refinement. | no | Legal profiles must not attach across tenant/account boundaries. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S005-02 | `src/features/organizationCore/index.ts`; `src/features/*/domain/`; `src/features/*/contract/`; `src/features/*/persistence/`; S-005 story. | T-S005-01 repository/storage seam; organizationCore public identity seam. | PRD, data dictionary mutation rules, API request rules. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-02 | domain-behavior | S-005 story, PRD, data dictionary, API contract, permission mapping, implementation blueprint | `src/features/organizationLegalDetails` | new-capability-file | Inspect `src/features/organizationCore`, feature domain/contract/persistence examples, and `docs/data-dictionary/organization-legal-profile.md`. | `src/features/organizationLegalDetails/contract/**`; `src/features/organizationLegalDetails/domain/**`; `src/features/organizationLegalDetails/persistence/**`; `tests/unit/organizationLegalDetails/**`; `tests/integration/organizationLegalDetails/**` | contract schemas, domain capability files, repository consumer types, focused tests | Domain validates legal name, optional fields, system-managed fields, one-active lifecycle, tenant-bound current records, and repository consumption. | approved API contract posture from root and tenant Organization contracts; no contract change in task unless routed. | tenant context required; object rules deny wrong tenant; normal reads exclude archived/deleted. | consumes T-S005-01 storage output; no schema changes in this task. | exposes domain functions for route and export projection consumers; manifest closeout in T-S005-05. | Story evidence links and data dictionary remain source; artifact closeout in T-S005-05. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | legal-profile behavior and export projection. | route/auth split to T-S005-03; grouped search/export bundle work deferred. | `npx vitest run tests/unit/organizationLegalDetails tests/integration/organizationLegalDetails` | Format with repo tooling; generated artifacts unchanged. | Reviewer checks validation, one-active, tenant, lifecycle, and projection behavior only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S005-02 | narrow-pattern | `src/features/organizationLegalDetails/contract/**`; `src/features/organizationLegalDetails/domain/**`; `src/features/organizationLegalDetails/persistence/**`; `tests/unit/organizationLegalDetails/**`; `tests/integration/organizationLegalDetails/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S005-02 | task-specific | Legal-profile domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S005-02 | task-specific | Legal-profile domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`