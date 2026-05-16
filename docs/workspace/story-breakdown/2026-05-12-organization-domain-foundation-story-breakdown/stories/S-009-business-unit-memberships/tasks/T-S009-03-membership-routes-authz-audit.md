# T-S009-03: Add root and tenant membership child routes, authz enforcement, audit events, feature wiring, manifest, and membership route seam.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S009-03 |
| Parent Story ID | S-009 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add root and tenant membership child routes, authz enforcement, audit events, feature wiring, manifest, and membership route seam. |
| Allowed Write Set | `src/features/organizationBusinessUnitMemberships/contract/**`; `src/features/organizationBusinessUnitMemberships/transport/**`; `src/features/organizationBusinessUnitMemberships/integration.ts`; `src/features/organizationBusinessUnitMemberships/index.ts`; `src/features/organizationBusinessUnitMemberships/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationBusinessUnits/**`. |
| Non-Goals | No app UI, no OpenAPI/Postman expansion unless already maintained, no export job assembly, no search routes. |
| Dependencies | T-S009-01 and T-S009-02 complete. |
| Shared Seams | root session middleware, tenant session context, platform authorization, audit seam, v1 router, organizationBusinessUnits object seam. |

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
| T-S009-03 | single-behavior | 1 | Covers route-facing enforcement and public seam integration. | Root/tenant route, authz, audit, manifest, and membership route seam. | v1 router and organizationBusinessUnitMemberships integration seam | Integration and security proof for root selected tenant, tenant current context, denied cross-tenant object access, and audit events. | none | Behavior is already split to T-S009-02. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S009-03 | source-truth-mismatch | Permission mapping and implemented platform authz capability names disagree. | Stop and reconcile permission mapping or grant source. | no | Runtime eligibility must not drift from mapping. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S009-03 | `src/routes/v1/index.ts`; protected route examples; audit examples; feature manifest examples; organizationCore transport. | root session middleware, tenant context, authz evaluator, audit/event seam, v1 router. | API contracts, permission mapping, ADR-0036, ADR-0042. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-03 | transport-route | API contracts, permission mapping, ADR-0036, ADR-0042, S-009 story | `src/features/organizationBusinessUnitMemberships` | transport-only | Inspect `src/routes/v1/index.ts`, organizationCore transport, protected route examples, audit/event examples, feature manifest examples. | `src/features/organizationBusinessUnitMemberships/contract/**`; `src/features/organizationBusinessUnitMemberships/transport/**`; `src/features/organizationBusinessUnitMemberships/integration.ts`; `src/features/organizationBusinessUnitMemberships/index.ts`; `src/features/organizationBusinessUnitMemberships/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationBusinessUnits/**` | transport, integration, feature manifest, public seam, route mounting, security tests | Transport maps root selected tenant and tenant current context to domain calls; integration owns router wiring and public exports. | approved root and tenant API contracts; no route family broadening. | runtime authz enforced with root/tenant capability, tenant context, object rule, denial and audit. | no schema work; consumes repository/domain outputs from earlier tasks. | creates organizationBusinessUnitMemberships public seam and manifest; generated graph refresh deferred to T-S009-05. | Feature manifest and generated graph obligations carried to T-S009-05. | not-applicable: no scaffold command approved; route files follow existing patterns. | route responses, authz denial behavior, audit events, manifest and public seam. | docs contract changes route to DOC:api-contract if discovered; generated graph closeout in T-S009-05. | `npx vitest run tests/integration/organizationBusinessUnits/persistence.test.ts` | Regenerate dependency graph if manifest changes, captured by T-S009-05. | Reviewer checks route/auth/audit/public seam boundaries only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S009-03 | narrow-pattern | `src/features/organizationBusinessUnitMemberships/contract/**`; `src/features/organizationBusinessUnitMemberships/transport/**`; `src/features/organizationBusinessUnitMemberships/integration.ts`; `src/features/organizationBusinessUnitMemberships/index.ts`; `src/features/organizationBusinessUnitMemberships/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationBusinessUnits/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S009-03 | task-specific | Root/tenant route, authz denial, audit, manifest, and public seam proof. | Broad route/security suites may supplement focused route proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S009-03 | task-specific | Root/tenant route, authz denial, audit, manifest, and public seam proof. | Broad route/security suites may supplement focused route proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`