# T-S012-01: Deliver public primary-logo relationship and app-controlled delivery proof

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S012-01 |
| Parent Story ID | S-012 |
| Task Type | DEV:vertical-slice |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Deliver public primary-logo relationship and app-controlled delivery proof |
| Allowed Write Set | path-unknown: organization domain branding/logo management module path not known until S-016; src/features/organizationBrandingReferences/**; src/features/assets/** only through public seams; tests/integration/organizationBrandingReferences/** |
| Non-Goals | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. |
| Dependencies | Source story and approved planning artifacts. |
| Shared Seams | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S-012 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S012-01 | S-012 | Logo relationships support the v1 primary logo type, accepted-safe public delivery, app-controlled URLs, replacement after new image readiness, removal to deterministic initials, alt text defaulting, and selected actual-file export inclusion. | mixed | unit, integration, security, audit, asset, accessibility, runtime-api | PRD, API contract, asset decision, data dictionary, permission mapping, runbook |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-012 | AC-S012-01 | CAP-ORG-BRAND-001 | tenant/root/public | create-or-refresh-required | Logo relationships and delivery. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | single-behavior | 1 | AC-S012-01 is the only acceptance criterion for S-012. | Admin accepted-logo changes and public delivery proof are inseparable because browser/runtime proof must verify the app-controlled URL returns accepted processed bytes or placeholder without raw storage leakage. | backend-to-frontend public delivery seam | Deliver public primary-logo relationship and app-controlled delivery proof proves its scoped part of AC-S012-01. | none | The task owns one behavior, decision, or proof target. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S012-01 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S012-01 | path-unknown: organization domain branding/logo management module path not known until S-016; src/features/organizationBrandingReferences/**; src/features/assets/** only through public seams; tests/integration/organizationBrandingReferences/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S012-01 | narrow-pattern | path-unknown: organization domain branding/logo management module path not known until S-016; src/features/organizationBrandingReferences/**; src/features/assets/** only through public seams; tests/integration/organizationBrandingReferences/** | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S012-01 | task-specific | Admin accepted-logo changes and public delivery proof are inseparable because browser/runtime proof must verify the app-controlled URL returns accepted processed bytes or placeholder without raw storage leakage. | Broad gates may supplement focused proof but do not replace it. |

### Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | Logo management | root-admin | organization domain | branding/logo management | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization logo management state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | not-applicable | Public asset signoff required before app behavior. |

### Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S012-01 | not-applicable | not-applicable: public delivery proof only | App UI split to S-016 design-system governance. | not-applicable: no governed app UI in this task |

### Design-System Seam Contract

| Task ID | Seam Posture | Seam Name / Export / Route | Owned Render Structure | Owned Behavior Controller | Owned Accessibility Semantics | Canonical / Behavior Lock / Evidence | Frontend Consumption Contract |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | not-applicable | not-applicable: public delivery proof has no app UI seam | not-applicable: no governed render structure in this task | not-applicable: no behavior controller in this task | not-applicable: no app accessibility semantics in this task | not-applicable: S-016 owns behavior lock and canonicals | not-applicable: app consumption waits for S-016 |

### Frontend Security Evidence

| Task ID | Security Area | Source Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Layer 4 Evidence Plan / Blocking Reason |
| --- | --- | --- | --- | --- | --- |
| T-S012-01 | session-cookie | yes | Root and tenant admin browser calls require authenticated sessions. | Security checks for unauthenticated, unauthorized, cross-tenant, and wrong-authority denials. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for session-cookie. |
| T-S012-01 | csrf-mutation | yes | Create, update, archive, move, upload, export, cancel, retry, and delete actions are browser-triggered changes. | Mutation calls preserve existing trusted-origin protection. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for csrf-mutation. |
| T-S012-01 | url-replay-state | yes | Search values may be low-risk state; authority and selected customer/account must remain server-side. | Replay review confirms no customer/account or permission authority in URLs. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for url-replay-state. |
| T-S012-01 | sensitive-rendering | yes | Admin areas may display legal details, memberships, retained records, and private export status. | Visibility and redaction checks match actor authority. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for sensitive-rendering. |
| T-S012-01 | csp-assets | yes | Logo work must not inject unsafe uploaded content. | Image handling remains compatible with content security policy. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for csp-assets. |
| T-S012-01 | privileged-helper | yes | Export, cleanup, asset processing, and cache update signals run under system control. | Background work records authority, retry, and failure evidence. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for privileged-helper. |
| T-S012-01 | asset-delivery | yes | Public logos and private export bundles are file delivery surfaces. | Asset and export decisions are carried into service, data, and proof work. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for asset-delivery. |

### Frontend Permission Rendering Evidence

| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |
| --- | --- | --- | --- | --- | --- |
| T-S012-01 | Public logo/browser delivery and admin-triggered logo state. | Allowed actor can publish accepted logo and public reader can read current accepted bytes. | Denied or unauthorized admin mutation and raw asset access are forbidden. | Expired upload intent and unauthenticated admin mutation are denied. | Cross-tenant denial proof for tenant actor managing another tenant logo. |

### Frontend Runtime Data And Mock Honesty

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |
| T-S012-01 | Organization public logo delivery API and logo relationship contract. | Fixtures must come from real accepted/rejected/replaced/removed logo states. | Runtime route proof must sample current accepted logo or placeholder payload/bytes. | not-applicable: runtime evidence is required during delivery. | mock-honesty fixtures must not invent raw URL fallback or unsafe placeholder behavior. |

### Vertical Slice Coupling

| Task ID | Journey Behavior | Backend Seam | Frontend Seam | API / Data Contract | Browser Proof Story | Why Backend And Frontend Proof Are Inseparable | Split Rejection Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | Public logo journey behavior: admin changes accepted logo and browser/public delivery reads app-controlled image response. | DEV:backend logo relationship and asset readiness service. | DEV:frontend/browser public image request and rendered asset delivery seam. | API/data payload contract for logo relationship, accepted asset state, and app-controlled URL. | Browser workflow scenario verifies accepted, replaced, removed, and raw-denied logo delivery. | Inseparable because backend-to-frontend persisted payload and browser route response risk raw URL leakage or stale placeholder behavior across the seam. | Split proof would miss backend-to-frontend browser runtime coupling between accepted logo state, URL response, cache behavior, and rendered asset evidence. |

### Vertical Slice Split Pressure

| Task ID | Concern | Split Decision | Coupling / Not-Applicable Rationale | Owning Task If Split |
| --- | --- | --- | --- | --- |
| T-S012-01 | backend-behavior | inseparable-in-slice | Inseparable or preexisting because the risk is backend-to-frontend persisted payload, public route response, and browser proof coupling. | T-S012-01 |
| T-S012-01 | frontend-behavior | inseparable-in-slice | Inseparable or preexisting because the risk is backend-to-frontend persisted payload, public route response, and browser proof coupling. | T-S012-01 |
| T-S012-01 | api-data-contract | inseparable-in-slice | Inseparable or preexisting because the risk is backend-to-frontend persisted payload, public route response, and browser proof coupling. | T-S012-01 |
| T-S012-01 | design-system-seam | not-applicable | not-applicable: no governed app UI; S-016 owns DS management screens. | S-016 |
| T-S012-01 | permission-truth | approved-preexisting | Inseparable or preexisting because the risk is backend-to-frontend persisted payload, public route response, and browser proof coupling. | T-S012-01 |
| T-S012-01 | migration-persistence | approved-preexisting | Inseparable or preexisting because the risk is backend-to-frontend persisted payload, public route response, and browser proof coupling. | T-S012-01 |
| T-S012-01 | executable-proof | approved-preexisting | Inseparable or preexisting because the risk is backend-to-frontend persisted payload, public route response, and browser proof coupling. | T-S012-01 |
| T-S012-01 | qa-evidence | approved-preexisting | Inseparable or preexisting because the risk is backend-to-frontend persisted payload, public route response, and browser proof coupling. | T-S012-01 |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S012-01 | task-specific | Admin accepted-logo changes and public delivery proof are inseparable because browser/runtime proof must verify the app-controlled URL returns accepted processed bytes or placeholder without raw storage leakage. | Broad gates may supplement focused proof but do not replace it. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`