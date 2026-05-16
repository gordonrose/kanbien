# T-S004-02: Implement core Organization create, read, list, and update domain behavior with validation and repository consumption.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S004-02 |
| Parent Story ID | S-004 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Implement core Organization create, read, list, and update domain behavior with validation and repository consumption. |
| Allowed Write Set | `src/features/organizationCore/contract/**`; `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`. |
| Non-Goals | No lifecycle branch archive, no route mounting, no app UI, no child entities. |
| Dependencies | T-S004-01 complete. |
| Shared Seams | organizationCore repository seam and tenant authorization context seam. |

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
| T-S004-02 | single-behavior | 1 | Covers normal current-record CRUD subset only. | Core create/read/list/update behavior. | organizationCore domain service | Unit and integration proof for valid create/update, duplicate name, system fields, and normal visibility. | none | Hierarchy/lifecycle operations are split to T-S004-03. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S004-02 | proof-gap | Existing tenant authz context or repository seam cannot supply required tenant/object information. | Stop and route to T-S004-04 or architecture owner. | no | Domain behavior must not infer tenant context from mutable bodies. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S004-02 | `src/features/*/domain/`; `src/features/*/contract/`; `src/features/*/persistence/`; S-004 story. | T-S004-01 repository/storage seam. | PRD, data dictionary mutation rules, API request rules. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-02 | domain-behavior | S-004 story, PRD, data dictionary, API contract, permission mapping, implementation blueprint | `src/features/organizationCore` | new-capability-file | Inspect `src/features/*/domain/`, `src/features/*/contract/`, `src/features/*/persistence/`, and `docs/data-dictionary/organization.md`. | `src/features/organizationCore/contract/**`; `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**` | contract schemas, domain capability files, repository consumer types, focused tests | Domain validates names, system-managed fields, tenant-bound current records, and repository consumption; persistence remains behind repository seam. | approved API contract posture from root and tenant Organization contracts; no contract change in task unless routed. | tenant context required; object rules deny wrong tenant; lifecycle normal reads exclude archived/deleted. | consumes T-S004-01 storage output; no schema or index changes in this task; storage changes are already split. | no public seam change beyond internal domain behavior. | Story evidence links and data dictionary remain source; artifact closeout in T-S004-06. | not-applicable: no scaffold command approved; use repo feature patterns after inspection. | create/read/list/update behavior and repository-backed responses. | already split to DEV:migration-persistence T-S004-01 and route/auth T-S004-04. | `npm run test -- organizationCore` focused behavior and repository proof for create/read/list/update. | Format with repo tooling; generated artifacts unchanged. | Reviewer checks validation and tenant/lifecycle behavior only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S004-02 | narrow-pattern | `src/features/organizationCore/contract/**`; `src/features/organizationCore/domain/**`; `src/features/organizationCore/persistence/**`; `tests/unit/organizationCore/**`; `tests/integration/organizationCore/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S004-02 | task-specific | Core Organization create/read/list/update behavior proof. | Broad feature tests may supplement focused domain proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S004-02 | task-specific | Core Organization create/read/list/update behavior proof. | Broad feature tests may supplement focused domain proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`