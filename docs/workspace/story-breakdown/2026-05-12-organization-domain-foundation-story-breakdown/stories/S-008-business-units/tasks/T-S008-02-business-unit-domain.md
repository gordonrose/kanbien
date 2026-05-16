# T-S008-02: Implement business-unit create, read/list, update, move, archive, restore, delete, branch archive, child reassignment, and child projection behavior.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S008-02 |
| Parent Story ID | S-008 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement business-unit create, read/list, update, move, archive, restore, delete, branch archive, child reassignment, and child projection behavior. |
| Allowed Write Set | `src/features/organizationBusinessUnits/contract/**`; `src/features/organizationBusinessUnits/domain/**`; `src/features/organizationBusinessUnits/persistence/**`; `tests/integration/organizationBusinessUnits/**`. |
| Non-Goals | No transport mounting, no UI, no grouped search, no export bundle generation. |
| Dependencies | T-S008-01 complete. |
| Shared Seams | organizationBusinessUnits repository seam; organizationCore public identity/object seam. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S008 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S008-01 | S-008 | Business units support hierarchy depth 10, cycle denial, derived child-unit reads from parent links, branch archive, child reassignment, lifecycle visibility, and same-tenant enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-008 | AC-S008-01 | CAP-ORG-UNIT-001 | tenant/root | create-or-refresh-required | Business units. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-02 | single-behavior | 1 | Covers business-unit domain behavior only. | Business-unit hierarchy and lifecycle behavior. | organizationBusinessUnits domain service | Unit and integration proof for depth, cycle denial, child projection, branch archive, child reassignment, lifecycle, and same-tenant behavior. | none | Transport and authz are split to T-S008-03. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S008-02 | proof-gap | organizationCore public seam cannot prove the owning Organization exists in the actor tenant/account. | Stop and route to organizationCore public seam refinement. | no | Business-units must not attach across tenant/account boundaries. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S008-02 | `src/features/organizationCore/index.ts`; `src/features/*/domain/`; `src/features/*/contract/`; `src/features/*/persistence/`; S-008 story. | T-S008-01 repository/storage seam; organizationCore public identity seam. | PRD, data dictionary mutation rules, API request rules. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S008-02 | domain-behavior | S-008 story, PRD, data dictionary, API contract, permission mapping, implementation blueprint | `src/features/organizationBusinessUnits` | new-capability-file | Inspect `src/features/organizationCore`, feature domain/contract/persistence examples, and `docs/data-dictionary/organization-business-unit.md`. | `src/features/organizationBusinessUnits/contract/**`; `src/features/organizationBusinessUnits/domain/**`; `src/features/organizationBusinessUnits/persistence/**`; `tests/integration/organizationBusinessUnits/**` | contract schemas, domain capability files, repository consumer types, focused tests | Domain validates business-unit name, hierarchy fields, system-managed fields, hierarchy lifecycle, tenant-bound current records, and repository consumption. | approved API contract posture from root and tenant Organization contracts; no contract change in task unless routed. | tenant context required; object rules deny wrong tenant; normal reads exclude archived/deleted. | consumes T-S008-01 storage output; no schema changes in this task. | exposes domain functions for route and membership-target consumers; manifest closeout in T-S008-05. | Story evidence links and data dictionary remain source; artifact closeout in T-S008-05. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | business-unit hierarchy and public lookup behavior. | route/auth split to T-S008-03; memberships, grouped search, and export bundle work deferred. | `npx vitest run tests/integration/organizationBusinessUnits/persistence.test.ts` | Format with repo tooling; generated artifacts unchanged. | Reviewer checks validation, hierarchy, tenant, lifecycle, and projection behavior only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S008-02 | narrow-pattern | `src/features/organizationBusinessUnits/contract/**`; `src/features/organizationBusinessUnits/domain/**`; `src/features/organizationBusinessUnits/persistence/**`; `tests/integration/organizationBusinessUnits/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S008-02 | task-specific | Business-unit domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S008-02 | task-specific | Business-unit domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`