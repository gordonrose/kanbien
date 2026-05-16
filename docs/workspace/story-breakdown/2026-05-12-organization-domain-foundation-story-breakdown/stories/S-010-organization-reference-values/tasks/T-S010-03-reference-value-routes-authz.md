# T-S010-03: Add root mutation routes and tenant/root read routes, authz enforcement, audit events, feature wiring, manifest, and public reference-value lookup seam.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S010-03 |
| Parent Story ID | S-010 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add root mutation routes and tenant/root read routes, authz enforcement, audit events, feature wiring, manifest, and public reference-value lookup seam. |
| Allowed Write Set | `src/features/organizationReferenceCatalogues/contract/**`; `src/features/organizationReferenceCatalogues/transport/**`; `src/features/organizationReferenceCatalogues/integration.ts`; `src/features/organizationReferenceCatalogues/index.ts`; `src/features/organizationReferenceCatalogues/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationReferenceCatalogues/**`. |
| Non-Goals | No app UI, no OpenAPI/Postman expansion unless already maintained, no export job assembly, no search routes. |
| Dependencies | T-S010-01 and T-S010-02 complete. |
| Shared Seams | root session middleware, tenant session context, platform authorization, audit seam, v1 router. |

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
| T-S010-03 | single-behavior | 1 | Covers route-facing enforcement and public seam integration. | Root mutation routes, tenant/root read routes, authz, audit, manifest, and public lookup seam. | v1 router and organizationReferenceCatalogues integration seam | Integration and security proof for root mutation, tenant read/use, tenant mutation denial, and audit events. | none | Behavior is already split to T-S010-02. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S010-03 | source-truth-mismatch | Permission mapping and implemented platform authz capability names disagree. | Stop and reconcile permission mapping or grant source. | no | Runtime eligibility must not drift from mapping. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S010-03 | `src/routes/v1/index.ts`; protected route examples; audit examples; feature manifest examples; organizationCore transport. | root session middleware, tenant context, authz evaluator, audit/event seam, v1 router. | API contracts, permission mapping, ADR-0036, ADR-0042. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S010-03 | transport-route | API contracts, permission mapping, ADR-0036, ADR-0042, S-010 story | `src/features/organizationReferenceCatalogues` | transport-only | Inspect `src/routes/v1/index.ts`, root/tenant transport examples, protected route examples, audit/event examples, feature manifest examples. | `src/features/organizationReferenceCatalogues/contract/**`; `src/features/organizationReferenceCatalogues/transport/**`; `src/features/organizationReferenceCatalogues/integration.ts`; `src/features/organizationReferenceCatalogues/index.ts`; `src/features/organizationReferenceCatalogues/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationReferenceCatalogues/**` | transport, integration, feature manifest, public seam, route mounting, security tests | Transport maps root sessions to catalogue mutation and tenant/root sessions to read/use; integration owns router wiring and public exports. | approved root and tenant API contracts; no route family broadening. | runtime authz enforced with root manage capability for mutation, tenant/root read capability for reads, tenant mutation denial, and audit. | no schema work; consumes repository/domain outputs from earlier tasks. | creates organizationReferenceCatalogues public seam and manifest; generated graph refresh deferred to T-S010-05. | Feature manifest and generated graph obligations carried to T-S010-05. | not-applicable: no scaffold command approved; route files follow existing patterns. | route responses, authz denial behavior, audit events, manifest and public seam. | docs contract changes route to DOC:api-contract if discovered; generated graph closeout in T-S010-05. | `npx vitest run tests/integration/organizationReferenceCatalogues/persistence.test.ts` | Regenerate dependency graph if manifest changes, captured by T-S010-05. | Reviewer checks route/auth/audit/public seam boundaries only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S010-03 | narrow-pattern | `src/features/organizationReferenceCatalogues/contract/**`; `src/features/organizationReferenceCatalogues/transport/**`; `src/features/organizationReferenceCatalogues/integration.ts`; `src/features/organizationReferenceCatalogues/index.ts`; `src/features/organizationReferenceCatalogues/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationReferenceCatalogues/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S010-03 | task-specific | Root/tenant route, authz denial, audit, manifest, and public seam proof. | Broad route/security suites may supplement focused route proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S010-03 | task-specific | Root/tenant route, authz denial, audit, manifest, and public seam proof. | Broad route/security suites may supplement focused route proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`