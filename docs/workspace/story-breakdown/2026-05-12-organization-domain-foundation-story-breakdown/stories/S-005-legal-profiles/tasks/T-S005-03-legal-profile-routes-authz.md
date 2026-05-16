# T-S005-03: Add root and tenant legal-profile child routes, authz enforcement, audit events, feature wiring, manifest, and public export projection seam.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S005-03 |
| Parent Story ID | S-005 |
| Task Type | DEV:backend |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Add root and tenant legal-profile child routes, authz enforcement, audit events, feature wiring, manifest, and public export projection seam. |
| Allowed Write Set | `src/features/organizationLegalDetails/contract/**`; `src/features/organizationLegalDetails/transport/**`; `src/features/organizationLegalDetails/integration.ts`; `src/features/organizationLegalDetails/index.ts`; `src/features/organizationLegalDetails/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationLegalDetails/**`; `tests/security/organizationLegalDetails/**`. |
| Non-Goals | No app UI, no OpenAPI/Postman expansion unless already maintained, no export job assembly, no search routes. |
| Dependencies | T-S005-01 and T-S005-02 complete. |
| Shared Seams | root session middleware, tenant session context, platform authorization, audit seam, v1 router, organizationCore object seam. |

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
| T-S005-03 | single-behavior | 1 | Covers route-facing enforcement and public seam integration. | Root/tenant route, authz, audit, manifest, and export projection seam. | v1 router and organizationLegalDetails integration seam | Integration and security proof for root selected tenant, tenant current context, denied cross-tenant object access, and audit events. | none | Behavior is already split to T-S005-02. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S005-03 | source-truth-mismatch | Permission mapping and implemented platform authz capability names disagree. | Stop and reconcile permission mapping or grant source. | no | Runtime eligibility must not drift from mapping. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S005-03 | `src/routes/v1/index.ts`; protected route examples; audit examples; feature manifest examples; organizationCore transport. | root session middleware, tenant context, authz evaluator, audit/event seam, v1 router. | API contracts, permission mapping, ADR-0036, ADR-0042. |

### Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-03 | transport-route | API contracts, permission mapping, ADR-0036, ADR-0042, S-005 story | `src/features/organizationLegalDetails` | transport-only | Inspect `src/routes/v1/index.ts`, organizationCore transport, protected route examples, audit/event examples, feature manifest examples. | `src/features/organizationLegalDetails/contract/**`; `src/features/organizationLegalDetails/transport/**`; `src/features/organizationLegalDetails/integration.ts`; `src/features/organizationLegalDetails/index.ts`; `src/features/organizationLegalDetails/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationLegalDetails/**`; `tests/security/organizationLegalDetails/**` | transport, integration, feature manifest, public seam, route mounting, security tests | Transport maps root selected tenant and tenant current context to domain calls; integration owns router wiring and public exports. | approved root and tenant API contracts; no route family broadening. | runtime authz enforced with root/tenant capability, tenant context, object rule, denial and audit. | no schema work; consumes repository/domain outputs from earlier tasks. | creates organizationLegalDetails public seam and manifest; generated graph refresh deferred to T-S005-05. | Feature manifest and generated graph obligations carried to T-S005-05. | not-applicable: no scaffold command approved; route files follow existing patterns. | route responses, authz denial behavior, audit events, manifest and public seam. | docs contract changes route to DOC:api-contract if discovered; generated graph closeout in T-S005-05. | `npx vitest run tests/security/organizationLegalDetails tests/integration/organizationLegalDetails` | Regenerate dependency graph if manifest changes, captured by T-S005-05. | Reviewer checks route/auth/audit/public seam boundaries only. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S005-03 | narrow-pattern | `src/features/organizationLegalDetails/contract/**`; `src/features/organizationLegalDetails/transport/**`; `src/features/organizationLegalDetails/integration.ts`; `src/features/organizationLegalDetails/index.ts`; `src/features/organizationLegalDetails/feature.manifest.json`; `src/routes/v1/index.ts`; `tests/integration/organizationLegalDetails/**`; `tests/security/organizationLegalDetails/**`. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S005-03 | task-specific | Root/tenant route, authz denial, audit, manifest, and public seam proof. | Broad route/security suites may supplement focused route proof. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S005-03 | task-specific | Root/tenant route, authz denial, audit, manifest, and public seam proof. | Broad route/security suites may supplement focused route proof. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`