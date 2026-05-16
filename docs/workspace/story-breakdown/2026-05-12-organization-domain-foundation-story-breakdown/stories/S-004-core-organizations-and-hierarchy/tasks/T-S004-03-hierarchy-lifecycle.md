# T-S004-03: Implement Organization move, archive, restore, delete, branch archive, and child reassignment domain behavior.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S004-03 |
| Parent Story ID | S-004 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement Organization move, archive, restore, delete, branch archive, and child reassignment domain behavior. |
| Allowed Write Set | `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`. |
| Non-Goals | No route mounting, no UI, no child feature lifecycle implementation. |
| Dependencies | T-S004-01 and T-S004-02 complete. |
| Shared Seams | organizationCore repository seam and future child-record lifecycle contract notes. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S004 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | S-004 | Organization records support create, read, update, archive, restore, parent move, branch archive, child reassignment, normalized tenant-level name uniqueness, depth 10, cycle denial, and same-tenant enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-004 | AC-S004-01 | CAP-ORG-CORE-001 | tenant/root | create-or-refresh-required | ART-ORG-S004 plus ART-ORG-004 API and data alignment source. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-03 | single-behavior | 1 | Covers hierarchy and lifecycle subset only. | Move/archive/restore/delete branch behavior. | organizationCore hierarchy lifecycle domain service | Unit and integration proof for depth, cycle, branch archive, child reassignment, archive and deleted visibility. | none | Transport and authz are split to T-S004-04. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S004-03 | product-decision | Branch archive or move-children behavior cannot be represented with approved request fields. | Stop and update API/data docs before source changes. | no | User chose both options; task may not narrow that. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S004-03 | `src/features/organizationCore/domain/**`; hierarchy examples in repo if present. | T-S004-01 repository/storage seam and T-S004-02 core domain types. | PRD hierarchy rules, data dictionary lifecycle and relationship inventory. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-03 | lifecycle-behavior | S-004 story, PRD hierarchy requirements, data dictionary relationship inventory, permission mapping | `src/features/organizationCore` | new-capability-file | Inspect `docs/data-dictionary/organization.md`, `docs/prd/2026-05-12-0025-organization-domain-foundation.md`, and organizationCore domain from T-S004-02. | `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**` | hierarchy lifecycle domain files, repository methods, focused tests | Domain owns depth 10, cycle denial, same-tenant parent checks, archive branch, move children, restore, delete visibility. | approved API contract posture for archive, restore, move; no contract change in task unless routed. | authz object rule inputs are preserved for T-S004-04; lifecycle operations deny invalid archived/deleted parent states. | consumes T-S004-01 repository and index behavior; no schema changes in this task; storage drift routes to DEV:migration-persistence. | no public seam change except domain service functions consumed by routes. | Story evidence links and data dictionary remain source; artifact closeout in T-S004-06. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | hierarchy lifecycle behavior for move/archive/restore/delete and branch choices. | route and audit integration split to T-S004-04. | `npm run test -- organizationCore` focused lifecycle behavior proof for hierarchy, archive, restore, delete, and repository state. | Format with repo tooling; generated artifacts unchanged. | Reviewer checks lifecycle and hierarchy edge behavior only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S004-03 | narrow-pattern | `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S004-03 | task-specific | Organization hierarchy and lifecycle transition proof. | Broad feature tests may supplement focused hierarchy proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S004-03 | task-specific | Organization hierarchy and lifecycle transition proof. | Broad feature tests may supplement focused hierarchy proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`