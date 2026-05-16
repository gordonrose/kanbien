# T-S010-02: Implement reference-value create, list/read, label update, archive, deprecate, replace, replacement validation, active tenant-use filtering, and used-value retention behavior.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S010-02 |
| Parent Story ID | S-010 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement reference-value create, list/read, label update, archive, deprecate, replace, replacement validation, active tenant-use filtering, and used-value retention behavior. |
| Allowed Write Set | `src/features/organizationReferenceCatalogues/contract/**`; `src/features/organizationReferenceCatalogues/domain/**`; `src/features/organizationReferenceCatalogues/persistence/**`; `tests/integration/organizationReferenceCatalogues/**`. |
| Non-Goals | No transport mounting, no UI, no grouped search, no export bundle generation, no hard-delete of used values. |
| Dependencies | T-S010-01 complete. |
| Shared Seams | organizationReferenceCatalogues repository seam; audit-safe lifecycle semantics. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S010 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S010-01 | S-010 | Reference values are root-managed, tenant-usable, immediately reflected by label changes, and archived, deprecated, or explicitly replaced when already used. | mixed | unit, integration, security, audit, compatibility | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-010 | AC-S010-01 | CAP-ORG-CAT-001 | root/tenant-use | create-or-refresh-required | Reference values. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S010-02 | single-behavior | 1 | Covers reference-value domain behavior only. | Catalogue lifecycle and tenant-use behavior. | organizationReferenceCatalogues domain service | Unit and integration proof for create, label update, archive, deprecate, replace, tenant read/use, and used-value retention. | none | Transport and authz are split to T-S010-03. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S010-02 | proof-gap | Existing record usage cannot distinguish a new-use active value from retained archived, deprecated, or replaced values. | Stop and route to catalogue/domain lifecycle refinement. | no | Used values must remain readable without staying selectable for new use. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S010-02 | `src/features/*/domain/`; `src/features/*/contract/`; `src/features/*/persistence/`; S-010 story. | T-S010-01 repository/storage seam. | PRD, data dictionary mutation rules, API request rules. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S010-02 | domain-behavior | S-010 story, PRD, data dictionary, API contract, permission mapping, implementation blueprint | `src/features/organizationReferenceCatalogues` | new-capability-file | Inspect feature domain/contract/persistence examples, existing lifecycle behavior, and `docs/data-dictionary/organization-reference-value.md`. | `src/features/organizationReferenceCatalogues/contract/**`; `src/features/organizationReferenceCatalogues/domain/**`; `src/features/organizationReferenceCatalogues/persistence/**`; `tests/integration/organizationReferenceCatalogues/**` | contract schemas, domain capability files, repository consumer types, focused tests | Domain validates reference type, stable key, label, lifecycle status, replacement target, system-managed fields, active new-use filtering, retained used-value reads, and repository consumption. | approved API contract posture from root and tenant Organization contracts; no contract change in task unless routed. | root-only mutation; tenant/root read/use; tenant mutation denial; archived/deprecated/replaced values retained but not silently selectable as new active values. | consumes T-S010-01 storage output; no schema changes in this task. | exposes domain functions for route and future Organization-record validation consumers; manifest closeout in T-S010-05. | Story evidence links and data dictionary remain source; artifact closeout in T-S010-05. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | reference-value catalogue lifecycle and public lookup behavior. | route/auth split to T-S010-03; memberships, grouped search, and export bundle work deferred. | `npx vitest run tests/integration/organizationReferenceCatalogues/persistence.test.ts` | Format with repo tooling; generated artifacts unchanged. | Reviewer checks validation, tenant/root authority, lifecycle, replacement, and retained-value behavior only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S010-02 | narrow-pattern | `src/features/organizationReferenceCatalogues/contract/**`; `src/features/organizationReferenceCatalogues/domain/**`; `src/features/organizationReferenceCatalogues/persistence/**`; `tests/integration/organizationReferenceCatalogues/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S010-02 | task-specific | Reference-value domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S010-02 | task-specific | Reference-value domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`