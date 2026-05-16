# T-S009-02: Implement membership create, read/list, update, archive, restore, delete, fixed-role validation, business-unit target validation, self-link denial, and individual/person target deferral.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S009-02 |
| Parent Story ID | S-009 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement membership create, read/list, update, archive, restore, delete, fixed-role validation, business-unit target validation, self-link denial, and individual/person target deferral. |
| Allowed Write Set | `src/features/organizationBusinessUnitMemberships/contract/**`; `src/features/organizationBusinessUnitMemberships/domain/**`; `src/features/organizationBusinessUnitMemberships/persistence/**`; `tests/integration/organizationBusinessUnits/**`. |
| Non-Goals | No transport mounting, no UI, no grouped search, no export bundle generation. |
| Dependencies | T-S009-01 complete. |
| Shared Seams | organizationBusinessUnitMemberships repository seam; organizationBusinessUnits public lookup seam. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S009 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S009-01 | S-009 | Membership records accept only real business-unit targets for the current slice, fixed participation labels of owner, manager, member, and viewer, same-tenant ownership, self-link denial, and explicit individual/person target deferral. | persistence-level | unit, integration, security, audit, privacy | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-009 | AC-S009-01 | CAP-ORG-MEMBER-001 | tenant/root | create-or-refresh-required | Memberships. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-02 | single-behavior | 1 | Covers membership domain behavior only. | Membership create/read/update/lifecycle, target validation, fixed role, and deferral behavior. | organizationBusinessUnitMemberships domain service | Unit and integration proof for business-unit target validation, self-link denial, fixed labels, lifecycle, and individual/person deferral. | none | Transport and authz are split to T-S009-03. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S009-02 | proof-gap | organizationCore public seam cannot prove the owning Organization exists in the actor tenant/account. | Stop and route to organizationCore public seam refinement. | no | Memberships must not attach across tenant/account boundaries. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S009-02 | `src/features/organizationCore/index.ts`; `src/features/*/domain/`; `src/features/*/contract/`; `src/features/*/persistence/`; S-009 story. | T-S009-01 repository/storage seam; organizationCore public identity seam. | PRD, data dictionary mutation rules, API request rules. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-02 | domain-behavior | S-009 story, PRD, data dictionary, API contract, permission mapping, implementation blueprint | `src/features/organizationBusinessUnitMemberships` | new-capability-file | Inspect `src/features/organizationCore`, feature domain/contract/persistence examples, and `docs/data-dictionary/organization-business-unit-membership.md`. | `src/features/organizationBusinessUnitMemberships/contract/**`; `src/features/organizationBusinessUnitMemberships/domain/**`; `src/features/organizationBusinessUnitMemberships/persistence/**`; `tests/integration/organizationBusinessUnits/**` | contract schemas, domain capability files, repository consumer types, focused tests | Domain validates owning business unit, member business-unit target, fixed role labels, self-link denial, system-managed fields, lifecycle, tenant-bound current records, and explicit individual/person target deferral. | approved API contract posture from root and tenant Organization contracts; no contract change in task unless routed. | tenant context required; object rules deny wrong tenant; normal reads exclude archived/deleted. | consumes T-S009-01 storage output; no schema changes in this task. | exposes domain functions for membership routes; manifest closeout in T-S009-05. | Story evidence links and data dictionary remain source; artifact closeout in T-S009-05. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | business-unit membership behavior and target deferral. | route/auth split to T-S009-03; individual/person targets, grouped search, and export bundle work deferred. | `npx vitest run tests/integration/organizationBusinessUnits/persistence.test.ts` | Format with repo tooling; generated artifacts unchanged. | Reviewer checks target validation, fixed labels, tenant, lifecycle, and deferral behavior only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S009-02 | narrow-pattern | `src/features/organizationBusinessUnitMemberships/contract/**`; `src/features/organizationBusinessUnitMemberships/domain/**`; `src/features/organizationBusinessUnitMemberships/persistence/**`; `tests/integration/organizationBusinessUnits/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S009-02 | task-specific | Membership domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S009-02 | task-specific | Membership domain behavior proof. | Broad feature tests may supplement focused domain proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`