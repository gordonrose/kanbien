# Task Breakdown

## Status

- Packet status:
  `ready-for-delivery-handoff`
- Packet date:
  2026-05-15
- Task Breakdown ID:
  `TB-ORG-S-012`
- Source Story Breakdown packet:
  `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`
- Selected Story ID(s):
  `S-012`
- Related Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-12-organization-domain-foundation.md`
- Related Technical Steering packet:
  `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md`
- Related PRD:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`
- Related capability matrix:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
- Validation command:
  `npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`
- Validation status:
  `pass`

## Source Story Handoff

- Story packet validation status:
  `pass`
- Selected story handoff status:
  `ready-for-task-breakdown`
- Story scope preserved:
  `yes`
- Acceptance criteria preserved:
  `yes`
- Product intent preserved:
  `yes`
- Technical Steering architecture preserved:
  `yes`
- Architecture invention check:
  `consumes-story-and-steering-only`
- Capability rows complete for implementation tasks:
  `yes`
- Story blockers carried forward:
  none for this selected story; downstream app UI remains governed by S-016 where relevant.

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-ORG-001 | architecture-foundation-required | DECISION:architecture-foundation | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-002 | feature-local | DEV:migration-persistence | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-003 | feature-local | DEV:migration-persistence | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-004 | feature-local | DEV:migration-persistence | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-005 | feature-local | DEV:migration-persistence | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-006 | feature-local | FUTURE:product-discovery | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-007 | feature-public-seam | DOC:asset-decision | T-S012-01 | covered | S-012 carries this classification into its task queue. |
| TS-ORG-008 | feature-local | DECISION:architecture-foundation | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-009 | platform-seam | DOC:technical-signoff | T-S012-01 | covered | S-012 carries this classification into its task queue. |
| TS-ORG-010 | platform-seam | DECISION:job-cleanup | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-011 | feature-public-seam | DOC:permission-mapping | T-S012-01 | covered | S-012 carries this classification into its task queue. |
| TS-ORG-012 | architecture-foundation-required | DECISION:architecture-foundation | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-013 | design-system-seam | GOV:design-system | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-014 | feature-public-seam | DOC:feature-manifest | deferred: outside selected story | deferred-with-owner | Not part of this selected story. |
| TS-ORG-015 | feature-local | DOC:docs-artifact | T-S012-01 | covered | S-012 carries this classification into its task queue. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-012 | DEV:vertical-slice | public logo relationship and delivery | T-S012-01 | Covered by selected task queue; separable supporting work is split by task type. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-012 | ready-for-task-breakdown | user-value | DEV:vertical-slice | Manage public logo relationships | This is needed because public logos touch uploaded files, public delivery, replacement, and export inclusion. | admin and public reader | Split into isolated tasks that preserve the story acceptance criterion and proof obligations. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S012-01 | S-012 | Logo relationships support the v1 primary logo type, accepted-safe public delivery, app-controlled URLs, replacement after new image readiness, removal to deterministic initials, alt text defaulting, and selected actual-file export inclusion. | mixed | unit, integration, security, audit, asset, accessibility, runtime-api | PRD, API contract, asset decision, data dictionary, permission mapping, runbook |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-012 | AC-S012-01 | CAP-ORG-BRAND-001 | tenant/root/public | create-or-refresh-required | Logo relationships and delivery. |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | S-012 | DEV:vertical-slice | Deliver public primary-logo relationship and app-controlled delivery proof | path-unknown: organization domain branding/logo management module path not known until S-016; src/features/organizationBrandingReferences/**; src/features/assets/** only through public seams; tests/integration/organizationBrandingReferences/** | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. | Source story and approved planning artifacts. | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. | queued-for-delivery |
| T-S012-02 | S-012 | DEV:migration-persistence | Create logo relationship storage and current-primary constraints | src/features/organizationBrandingReferences/persistence/**; tests/integration/organizationBrandingReferences/** | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. | T-S012-01 where sequencing is required. | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. | queued-for-delivery |
| T-S012-03 | S-012 | DEV:backend | Implement logo relationship management and export projection | src/features/organizationBrandingReferences/**; src/routes/v1/index.ts; tests/integration/organizationBrandingReferences/** | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. | T-S012-02 where sequencing is required. | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. | queued-for-delivery |
| T-S012-04 | S-012 | DEV:platform-seam | Add public logo delivery and cache invalidation seam | src/features/organizationBrandingReferences/**; src/features/assets/**; tests/security/organizationBrandingReferences/** | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. | T-S012-03 where sequencing is required. | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. | queued-for-delivery |
| T-S012-05 | S-012 | TEST:test-only | Prove public logo lifecycle, security, audit, and accessibility | tests/unit/organizationBrandingReferences/**; tests/integration/organizationBrandingReferences/**; tests/security/organizationBrandingReferences/** | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. | T-S012-04 where sequencing is required. | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. | queued-for-delivery |
| T-S012-06 | S-012 | DOC:docs-artifact | Refresh public logo artifacts after delivery | docs/features/organization-branding-references.md; docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/** | No unrelated source changes, no product scope expansion, no app UI unless this task explicitly owns a governed design-system seam. | T-S012-05 where sequencing is required. | Feature public seams, platform authorization, tenant context, generated artifact chain, and relevant asset/job seams. | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | single-behavior | 1 | AC-S012-01 is the only acceptance criterion for S-012. | Admin accepted-logo changes and public delivery proof are inseparable because browser/runtime proof must verify the app-controlled URL returns accepted processed bytes or placeholder without raw storage leakage. | backend-to-frontend public delivery seam | Deliver public primary-logo relationship and app-controlled delivery proof proves its scoped part of AC-S012-01. | none | The task owns one behavior, decision, or proof target. |
| T-S012-02 | single-behavior | 1 | AC-S012-01 is the only acceptance criterion for S-012. | Organization logo relationship storage supports one current primary logo, lifecycle, replacement, removal, alt text, and cleanup metadata. | migration and persistence seam | Create logo relationship storage and current-primary constraints proves its scoped part of AC-S012-01. | none | The task owns one behavior, decision, or proof target. |
| T-S012-03 | single-behavior | 1 | AC-S012-01 is the only acceptance criterion for S-012. | Logo management enforces Organization object authority, accepted asset readiness, replacement safety, removal placeholder state, export projection, and audit. | feature-local task seam | Implement logo relationship management and export projection proves its scoped part of AC-S012-01. | none | The task owns one behavior, decision, or proof target. |
| T-S012-04 | single-behavior | 1 | AC-S012-01 is the only acceptance criterion for S-012. | Public delivery streams only current accepted processed primary logo bytes or deterministic initials placeholder through app-controlled URL with cache and purge behavior. | platform runtime seam | Add public logo delivery and cache invalidation seam proves its scoped part of AC-S012-01. | none | The task owns one behavior, decision, or proof target. |
| T-S012-05 | single-proof-target | 1 | AC-S012-01 is the only acceptance criterion for S-012. | Executable proof covers upload intent, accepted delivery, replacement, removal placeholder, raw URL denial, cache signal, export inclusion, and alt text. | feature-local task seam | Prove public logo lifecycle, security, audit, and accessibility proves its scoped part of AC-S012-01. | none | The task owns one behavior, decision, or proof target. |
| T-S012-06 | single-proof-target | 1 | AC-S012-01 is the only acceptance criterion for S-012. | Public logo feature docs, story evidence, runbook links, manifest notes, and generated graph status reflect implementation truth. | documentation artifact seam | Refresh public logo artifacts after delivery proves its scoped part of AC-S012-01. | none | The task owns one behavior, decision, or proof target. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S012-01 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |
| T-S012-02 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |
| T-S012-03 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |
| T-S012-04 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |
| T-S012-05 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |
| T-S012-06 | source-truth-mismatch | Stop if PRD, Technical Steering, API contract, data dictionary, permission mapping, or story evidence disagree with the task scope. | Route back to the owning planning artifact before editing implementation. | no | Layer 5 must not invent behavior or authority. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S012-01 | path-unknown: organization domain branding/logo management module path not known until S-016; src/features/organizationBrandingReferences/**; src/features/assets/** only through public seams; tests/integration/organizationBrandingReferences/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |
| T-S012-02 | src/features/organizationBrandingReferences/persistence/**; tests/integration/organizationBrandingReferences/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |
| T-S012-03 | src/features/organizationBrandingReferences/**; src/routes/v1/index.ts; tests/integration/organizationBrandingReferences/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |
| T-S012-04 | src/features/organizationBrandingReferences/**; src/features/assets/**; tests/security/organizationBrandingReferences/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |
| T-S012-05 | tests/unit/organizationBrandingReferences/**; tests/integration/organizationBrandingReferences/**; tests/security/organizationBrandingReferences/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |
| T-S012-06 | docs/features/organization-branding-references.md; docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/**; source story; related feature examples. | Organization public seams, tenant/root auth context, asset/job seams where relevant. | Story breakdown, PRD, Technical Steering, API contracts, data dictionary, permission mapping, asset/export decisions, runbooks. |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | Logo management | root-admin | organization domain | branding/logo management | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization logo management state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | not-applicable | Public asset signoff required before app behavior. | Public asset signoff required before app behavior. |

## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S012-01 | not-applicable | not-applicable: public delivery proof only | App UI split to S-016 design-system governance. | not-applicable: no governed app UI in this task |

## Frontend Performance Posture

| Task ID | Performance Posture | Evidence / Proof Plan | Rationale |
| --- | --- | --- | --- |
| T-S012-01 | asset-heavy | Asset size and loading strategy proof for public image delivery; rendered asset evidence must show bounded bytes and correct cache behavior. | Public logo delivery is asset-heavy even without app UI. |

## Design-System Seam Contract

| Task ID | Seam Posture | Seam Name / Export / Route | Owned Render Structure | Owned Behavior Controller | Owned Accessibility Semantics | Canonical / Behavior Lock / Evidence | Frontend Consumption Contract |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | not-applicable | not-applicable: public delivery proof has no app UI seam | not-applicable: no governed render structure in this task | not-applicable: no behavior controller in this task | not-applicable: no app accessibility semantics in this task | not-applicable: S-016 owns behavior lock and canonicals | not-applicable: app consumption waits for S-016 |

## Design-System Seam Class Contract

| Task ID | Design-System Seam Class | Class-Specific Required Proof | Downstream Consumption Boundary | Forbidden App / Evidence / Standards Work |
| --- | --- | --- | --- | --- |

## Frontend Adoption Contract

| Task ID | Consumed DS Render Seam | Consumed DS Behavior / Controller Seam | Consumed DS Accessibility Semantics | Consumed DS Style / CSS Seam | Allowed App-Local Composition / Data Binding | Forbidden Local Reconstruction | Adoption Proof Route / Scenario |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Frontend Security Evidence

| Task ID | Security Area | Source Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Layer 4 Evidence Plan / Blocking Reason |
| --- | --- | --- | --- | --- | --- |
| T-S012-01 | session-cookie | yes | Root and tenant admin browser calls require authenticated sessions. | Security checks for unauthenticated, unauthorized, cross-tenant, and wrong-authority denials. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for session-cookie. |
| T-S012-01 | csrf-mutation | yes | Create, update, archive, move, upload, export, cancel, retry, and delete actions are browser-triggered changes. | Mutation calls preserve existing trusted-origin protection. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for csrf-mutation. |
| T-S012-01 | url-replay-state | yes | Search values may be low-risk state; authority and selected customer/account must remain server-side. | Replay review confirms no customer/account or permission authority in URLs. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for url-replay-state. |
| T-S012-01 | sensitive-rendering | yes | Admin areas may display legal details, memberships, retained records, and private export status. | Visibility and redaction checks match actor authority. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for sensitive-rendering. |
| T-S012-01 | csp-assets | yes | Logo work must not inject unsafe uploaded content. | Image handling remains compatible with content security policy. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for csp-assets. |
| T-S012-01 | privileged-helper | yes | Export, cleanup, asset processing, and cache update signals run under system control. | Background work records authority, retry, and failure evidence. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for privileged-helper. |
| T-S012-01 | asset-delivery | yes | Public logos and private export bundles are file delivery surfaces. | Asset and export decisions are carried into service, data, and proof work. | npx vitest run tests/integration/organizationBrandingReferences/ provides runtime proof/evidence for asset-delivery. |

## Frontend Permission Rendering Evidence

| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |
| --- | --- | --- | --- | --- | --- |
| T-S012-01 | Public logo/browser delivery and admin-triggered logo state. | Allowed actor can publish accepted logo and public reader can read current accepted bytes. | Denied or unauthorized admin mutation and raw asset access are forbidden. | Expired upload intent and unauthenticated admin mutation are denied. | Cross-tenant denial proof for tenant actor managing another tenant logo. |

## Frontend Runtime Data And Mock Honesty

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |
| T-S012-01 | Organization public logo delivery API and logo relationship contract. | Fixtures must come from real accepted/rejected/replaced/removed logo states. | Runtime route proof must sample current accepted logo or placeholder payload/bytes. | not-applicable: runtime evidence is required during delivery. | mock-honesty fixtures must not invent raw URL fallback or unsafe placeholder behavior. |

## Vertical Slice Coupling

| Task ID | Journey Behavior | Backend Seam | Frontend Seam | API / Data Contract | Browser Proof Story | Why Backend And Frontend Proof Are Inseparable | Split Rejection Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | Public logo journey behavior: admin changes accepted logo and browser/public delivery reads app-controlled image response. | DEV:backend logo relationship and asset readiness service. | DEV:frontend/browser public image request and rendered asset delivery seam. | API/data payload contract for logo relationship, accepted asset state, and app-controlled URL. | Browser workflow scenario verifies accepted, replaced, removed, and raw-denied logo delivery. | Inseparable because backend-to-frontend persisted payload and browser route response risk raw URL leakage or stale placeholder behavior across the seam. | Split proof would miss backend-to-frontend browser runtime coupling between accepted logo state, URL response, cache behavior, and rendered asset evidence. |

## Vertical Slice Split Pressure

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
## Platform Seam Contract

| Task ID | Seam Kind | Compatibility Mode | Approved Authority Source | Seam Owner / Reference-value | Seam Source Inventory | Seam Change Scope | Exact Write Envelope | Why Not Feature-Local | Current / Future / Unsupported Consumers | Compatibility Contract | Representative Consumer Proof | Runtime / Restart Impact | Rollout / Backout Posture | Artifact / Materialization Impact | Generated / Apply / Check Command | Expected Seam Output | Architecture / Standards Boundary | Split / Blocked Follow-Up | Proof Commands | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-04 | shared-runtime-helper | additive-compatible | Technical Steering, story, capability rows, and asset/export decision records. | platform runtime seam under src/lib or feature integration boundary. | rg -n "organizationBrandingReferences export logo" src tests docs | Add public logo delivery and cache invalidation seam | narrow path pattern: src/features/organizationBrandingReferences/**; src/features/assets/**; tests/security/organizationBrandingReferences/** | Shared platform behavior is required by assets/jobs and multiple current/future feature consumers; not feature-local only. | current Organization consumer; future export/logo consumers; unsupported generic hosting/public export links. | Backwards compatible additive seam; existing consumers unchanged. | Representative consumer proof through route/job tests and security check. | Runtime seam may require restart or worker reload; delivery must record restart posture. | Rollout/backout by reverting additive seam and feature wiring. | No generated artifact impact unless manifest changes route to generated graph check. | npm run check:feature-dependencies | Expected seam output is a runtime helper/route/job seam consumed by Organization. | no authority changes and no architecture changes; no standards changes. | not-applicable: specialized API, permission, and persistence work are split. | npx vitest run tests/integration/organizationBrandingReferences/ tests/security/organizationBrandingReferences/ | Review runtime seam behavior and unsupported consumer denial. |

## Platform Seam Class Contract

| Task ID | Platform Seam Class | Class-Specific Required Proof | Required Consumer Coverage | Runtime / Materialization Expectation | Forbidden Contamination / Split Notes |
| --- | --- | --- | --- | --- | --- |
| T-S012-04 | shared-runtime-helper | Prove helper/runtime behavior and existing consumer compatibility for public logo delivery route. | Consumer coverage includes Organization route/job tests and future unsupported generic consumer denial. | Runtime proof names restart/reload posture and representative consumer execution. | not-applicable: API, permission, persistence, and feature behavior are split to owning tasks. |
## Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-03 | domain-behavior | Story, PRD, API contract, data dictionary, permission mapping, Technical Steering, and implementation blueprint. | src/features/organizationBrandingReferences | new-capability-file | rg -n "organizationBrandingReferences organization" src/features tests docs | src/features/organizationBrandingReferences/**; src/routes/v1/index.ts; tests/integration/organizationBrandingReferences/** | contract, domain capability files, repository consumers, transport/integration as scoped. | Domain owns validation/lifecycle; transport owns request mapping; integration owns wiring. | Approved API contract posture; DOC:api-contract split if contract drift appears. | Authorization, tenant boundary, lifecycle, allow/deny, and audit posture from permission mapping. | No schema work unless already split to DEV:migration-persistence; repository consumes approved storage. | Feature manifest/public seam impact must be closed by docs artifact task. | Story and maintained artifact obligations carried to docs closeout task. | not-applicable: no scaffold command approved; inspect repo feature patterns. | Logo management enforces Organization object authority, accepted asset readiness, replacement safety, removal placeholder state, export projection, and audit. | not-applicable: API, permission, and persistence work already split or source-approved. | npx vitest run tests/integration/organizationBrandingReferences/ | Regenerate dependency graph if manifest changes. | Reviewer checks only scoped backend behavior, authority, lifecycle, and audit. |
## Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-02 | new-migration | Inspect live schema and current migrations before editing. | Validate field/index/lifecycle truth against data dictionary and API contract. | Validate tenant/object ownership, lifecycle state, required fields, and normalized values per row. | Invalid fixtures fail tests; no silent conversion of rejected row shape. | Create a new zero-padded migration; do not rename applied migrations. | Verify constraints, indexes, FKs, timestamps, and transaction semantics in Postgres. | Persistence tests prove representative create/read/update/lifecycle paths. | Review tests/harness/postgres migrations when new migration is added. |

## Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S012-02 | new-migration | Prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, indexes, and read/write paths. | Organization logo relationship storage supports one current primary logo, lifecycle, replacement, removal, alt text, and cleanup metadata. | Persistence-backed tests cover representative read/write and harness migration run. | not-applicable: data dictionary and contract truth are source inputs. |

## Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S012-01 | narrow-pattern | path-unknown: organization domain branding/logo management module path not known until S-016; src/features/organizationBrandingReferences/**; src/features/assets/** only through public seams; tests/integration/organizationBrandingReferences/** | not-applicable |
| T-S012-02 | narrow-pattern | src/features/organizationBrandingReferences/persistence/**; tests/integration/organizationBrandingReferences/** | not-applicable |
| T-S012-03 | narrow-pattern | src/features/organizationBrandingReferences/**; src/routes/v1/index.ts; tests/integration/organizationBrandingReferences/** | not-applicable |
| T-S012-04 | narrow-pattern | src/features/organizationBrandingReferences/**; src/features/assets/**; tests/security/organizationBrandingReferences/** | not-applicable |
| T-S012-05 | narrow-pattern | tests/unit/organizationBrandingReferences/**; tests/integration/organizationBrandingReferences/**; tests/security/organizationBrandingReferences/** | not-applicable |
| T-S012-06 | narrow-pattern | docs/features/organization-branding-references.md; docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/** | not-applicable |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S012-01 | task-specific | Admin accepted-logo changes and public delivery proof are inseparable because browser/runtime proof must verify the app-controlled URL returns accepted processed bytes or placeholder without raw storage leakage. | Broad gates may supplement focused proof but do not replace it. |
| T-S012-02 | task-specific | Organization logo relationship storage supports one current primary logo, lifecycle, replacement, removal, alt text, and cleanup metadata. | Broad gates may supplement focused proof but do not replace it. |
| T-S012-03 | task-specific | Logo management enforces Organization object authority, accepted asset readiness, replacement safety, removal placeholder state, export projection, and audit. | Broad gates may supplement focused proof but do not replace it. |
| T-S012-04 | task-specific | Public delivery streams only current accepted processed primary logo bytes or deterministic initials placeholder through app-controlled URL with cache and purge behavior. | Broad gates may supplement focused proof but do not replace it. |
| T-S012-05 | task-specific | Executable proof covers upload intent, accepted delivery, replacement, removal placeholder, raw URL denial, cache signal, export inclusion, and alt text. | Broad gates may supplement focused proof but do not replace it. |
| T-S012-06 | task-specific | Public logo feature docs, story evidence, runbook links, manifest notes, and generated graph status reflect implementation truth. | Broad gates may supplement focused proof but do not replace it. |

## Refactor-First Contract

| Task ID | Refactor Trigger | Refactor Type | Refactor Target Inventory | Detection Hints | Unchanged Behavior | Affected Consumers | Downstream Task Unblocked | Compatibility Proof | Routing Check | Human Review Boundary | Forbidden Behavior / Authority Change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Foundation Contract

| Task ID | Concern Area | Architecture Trigger | Architecture Question | Decision Analysis Status | Decision Provenance Source | Missing Analysis Fields | Sources To Review | Decision Source Inventory | Decision Analysis Checklist | Decision Owner | Output Artifact Target | Downstream Tasks Blocked | Compatibility Posture | Final Authority Route | Human Review Boundary | Forbidden Implementation / Guess |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Update Contract

| Task ID | Update Class | Architecture Source | Update Target | Trigger | Compatibility Impact | Generated Artifact Impact | Required Review | Proof Command | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
## Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-06 | maintained-artifact-sweep | stale-artifact-sweep | rg -n "S-012 AC-S012-01 CAP-ORG-BRAND-001" docs/workspace docs/prd docs/architecture | Story breakdown, PRD, Technical Steering, capability matrix, and ordinary status sources. | docs/features/organization-branding-references.md; docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/** | public logo implementation status | Sweep scope covers story evidence, README/index/status notes, and route specialized artifacts to DOC:api-contract, DOC:data-dictionary, DOC:permission-mapping, GOV:design-system, TEST:test-only, or EVIDENCE:qa-evidence when discovered. | Specialized API/data/permission/design-system/test/evidence changes must route to DOC:api-contract, DOC:data-dictionary, DOC:permission-mapping, GOV:design-system, TEST:test-only, or EVIDENCE:qa-evidence; this task records ordinary docs/status alignment only. | npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown | Reviewer checks source truth alignment and routed follow-ups only. | Task breakdown validation and stale-text scan evidence. |

## Standards Compliance Contract

| Task ID | Compliance Target Type | Standard / Gate | Source Standard Path / Reference | Scope Under Review | Control / Evidence Inventory | Review Method / Command | Compliance Posture | Evidence Artifact Target | Coverage Summary Command | Findings Summary | Follow-Up Routing | Human Review Boundary | Waiver / Blocker Posture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Standards Update Contract

| Task ID | Standards Update Class | Approved Standards Change Source | Source Path / Reference | Standards Change Summary | Standards Artifact Target | Affected Surfaces / Consistency Sweep | Artifact Invalidation Sweep | Enforcement Posture | Compatibility / Rollout Posture | Debt Route If Not Enforced Now | Forbidden Implementation / Architecture / Compliance Work | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Permission Mapping Contract

| Task ID | Permission Mapping Class | Approved Authz Source | Capability / Route / Surface | Authority World / Actor Boundary | Grant Source Posture | Mapping Row Posture | Tenant / Object Boundary | Allow / Deny Expectations | UI Eligibility | Denial / Audit / Proof Expectation | Evidence Mapping Inventory | Migration Impact | Split / Blocked Follow-Up | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## API Contract

| Task ID | API Contract Class | Route Family | Contract Source / Authority | Methods / Paths | Params / Query / Body | Response / Status / Error Shape | Authn / Authz / Tenant Boundary | Validation / Pagination / Sorting / System Fields | Compatibility Posture | Maintained API Artifacts | Maintained Artifact Inventory | Split / Blocked Follow-Up | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Data Dictionary Contract

| Task ID | Entity / Table / Durable Fact Group | Dictionary Artifact Target | Source Truth Reviewed | Field / Index / Lifecycle Truth | Durable Fact / Retention Truth | Classification / Compliance Posture | Standards / Control Trace | Enforcement Trace | Enforcement Evidence | Test Evidence Trace | Compatibility Posture | Split / Blocked Follow-Up | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
## Test-Only Coverage Contract

| Task ID | Test Change Class | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-05 | prd-test-case | Approved story acceptance criterion and PRD-derived TC obligations. | TC-ORG-FOUNDATION-012 | integration/security/unit as scoped | Executable proof covers upload intent, accepted delivery, replacement, removal placeholder, raw URL denial, cache signal, export inclusion, and alt text. | Fixtures from real persistence/API shapes and approved contracts. | mock-honesty comparison against live/runtime payload or contract shape required. | no production behavior change; missing production behavior routes to DEV:backend or DEV:platform-seam tasks. | npx vitest run tests/unit/organizationBrandingReferences/** | not-applicable: production behavior changes route to owning DEV:backend or DEV:platform-seam task. |

## Test Suite Alignment Contract

| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-05 | CAP-ORG-BRAND-001 | root admin, tenant admin, public/system actors where scoped | allowed and denied permission states | active, archived, retained, deleted/removed, failed/expired where scoped | same-tenant, cross-tenant, requester-bound, raw URL/storage denial | unauthenticated, unauthorized, cross-tenant, stale lifecycle, invalid object, raw storage access | not-applicable: matrix applies to this task | not-applicable: coverage planned here |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Forbidden Assumption Escalation Path |
| --- | --- | --- |
| T-S012-01 | Do not assume missing authority, schema, route, asset, job, UI, or retention behavior from adjacent features. | Stop and route to the owning planning source or Technical Steering. |
| T-S012-02 | Do not assume missing authority, schema, route, asset, job, UI, or retention behavior from adjacent features. | Stop and route to the owning planning source or Technical Steering. |
| T-S012-03 | Do not assume missing authority, schema, route, asset, job, UI, or retention behavior from adjacent features. | Stop and route to the owning planning source or Technical Steering. |
| T-S012-04 | Do not assume missing authority, schema, route, asset, job, UI, or retention behavior from adjacent features. | Stop and route to the owning planning source or Technical Steering. |
| T-S012-05 | Do not assume missing authority, schema, route, asset, job, UI, or retention behavior from adjacent features. | Stop and route to the owning planning source or Technical Steering. |
| T-S012-06 | Do not assume missing authority, schema, route, asset, job, UI, or retention behavior from adjacent features. | Stop and route to the owning planning source or Technical Steering. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Guardrail Reference | Approval Status | Guardrail Evidence / Rationale |
| --- | --- | --- | --- | --- |
| T-S012-01 | DEV:vertical-slice | vertical-slice-task-guardrail.md | approved | vertical-slice-task-guardrail.md reviewed through task-breakdown maintainer workflow. |
| T-S012-02 | DEV:migration-persistence | migration-persistence-task-guardrail.md | approved | migration-persistence-task-guardrail.md reviewed through task-breakdown maintainer workflow. |
| T-S012-03 | DEV:backend | backend-task-guardrail.md | approved | backend-task-guardrail.md reviewed through task-breakdown maintainer workflow. |
| T-S012-04 | DEV:platform-seam | platform-seam-task-guardrail.md | approved | platform-seam-task-guardrail.md reviewed through task-breakdown maintainer workflow. |
| T-S012-05 | TEST:test-only | test-only-task-guardrail.md | approved | test-only-task-guardrail.md reviewed through task-breakdown maintainer workflow. |
| T-S012-06 | DOC:docs-artifact | docs-artifact-task-guardrail.md | approved | docs-artifact-task-guardrail.md reviewed through task-breakdown maintainer workflow. |

## Task Guardrail Evidence

| Task ID | Guardrail Check ID | Status | Guardrail Evidence |
| --- | --- | --- | --- |
| T-S012-01 | vertical-inseparable-journey | pass | vertical-inseparable-journey is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-backend-seam | pass | vertical-backend-seam is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-frontend-seam | pass | vertical-frontend-seam is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-api-data-shape | pass | vertical-api-data-shape is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-browser-workflow | pass | vertical-browser-workflow is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-split-pressure | pass | vertical-split-pressure is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-security-evidence | pass | vertical-security-evidence is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-permission-rendering | pass | vertical-permission-rendering is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-runtime-data-mock-honesty | pass | vertical-runtime-data-mock-honesty is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-mock-honesty | pass | vertical-mock-honesty is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-artifacts | pass | vertical-artifacts is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-01 | vertical-proof-commands | pass | vertical-proof-commands is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-source-authority | pass | migration-source-authority is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-change-class | pass | migration-change-class is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-live-schema | pass | migration-live-schema is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-storage-decision-boundary | pass | migration-storage-decision-boundary is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-source-data-shape | pass | migration-source-data-shape is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-per-row-eligibility | pass | migration-per-row-eligibility is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-rejected-row-behavior | pass | migration-rejected-row-behavior is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-compatibility-repair | pass | migration-compatibility-repair is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-applied-file-safety | pass | migration-applied-file-safety is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-index-normalization-uniqueness | pass | migration-index-normalization-uniqueness is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-security-tenant-proof | pass | migration-security-tenant-proof is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-read-write-proof | pass | migration-read-write-proof is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-02 | migration-postgres-harness | pass | migration-postgres-harness is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-source-authority | pass | backend-source-authority is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-change-class | pass | backend-change-class is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-owning-feature | pass | backend-owning-feature is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-source-inventory | pass | backend-source-inventory is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-exact-write-envelope | pass | backend-exact-write-envelope is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-layer-responsibilities | pass | backend-layer-responsibilities is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-cross-feature-seams | pass | backend-cross-feature-seams is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-authz-tenant-lifecycle | pass | backend-authz-tenant-lifecycle is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-api-contract-boundary | pass | backend-api-contract-boundary is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-persistence-migration-boundary | pass | backend-persistence-migration-boundary is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-scripted-scaffold-posture | pass | backend-scripted-scaffold-posture is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-artifact-obligations | pass | backend-artifact-obligations is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-expected-output | pass | backend-expected-output is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-split-routing | pass | backend-split-routing is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-proof-commands | pass | backend-proof-commands is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-03 | backend-human-review-boundary | pass | backend-human-review-boundary is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-source-authority | pass | platform-source-authority is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-seam-kind | pass | platform-seam-kind is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-seam-class | pass | platform-seam-class is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-seam-owner | pass | platform-seam-owner is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-seam-source-inventory | pass | platform-seam-source-inventory is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-not-feature-local | pass | platform-not-feature-local is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-exact-write-envelope | pass | platform-exact-write-envelope is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-consumer-inventory | pass | platform-consumer-inventory is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-compatibility-mode | pass | platform-compatibility-mode is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-compatibility-contract | pass | platform-compatibility-contract is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-representative-consumer-proof | pass | platform-representative-consumer-proof is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-runtime-restart-impact | pass | platform-runtime-restart-impact is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-rollout-backout | pass | platform-rollout-backout is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-artifact-materialization | pass | platform-artifact-materialization is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-expected-output | pass | platform-expected-output is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-architecture-boundary | pass | platform-architecture-boundary is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-split-routing | pass | platform-split-routing is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-proof-commands | pass | platform-proof-commands is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-04 | platform-human-review-boundary | pass | platform-human-review-boundary is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-source-authority | pass | test-source-authority is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-change-class | pass | test-change-class is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-traceability | pass | test-traceability is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-proof-layer | pass | test-proof-layer is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-permission-state-matrix | pass | test-permission-state-matrix is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-mock-honesty | pass | test-mock-honesty is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-no-behavior-change | pass | test-no-behavior-change is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-sensitive-state-coverage | pass | test-sensitive-state-coverage is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-focused-command | pass | test-focused-command is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-coverage-strength | pass | test-coverage-strength is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-05 | test-split-boundary | pass | test-split-boundary is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-06 | docs-source-truth-reviewed | pass | docs-source-truth-reviewed is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-06 | docs-artifact-class | pass | docs-artifact-class is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-06 | docs-scriptable-source-inventory | pass | docs-scriptable-source-inventory is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-06 | docs-stale-artifact-sweep | pass | docs-stale-artifact-sweep is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-06 | docs-status-posture | pass | docs-status-posture is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-06 | docs-validation-command | pass | docs-validation-command is addressed by this task packet, source story, and exact write/proof rows. |
| T-S012-06 | docs-specialized-routing | pass | docs-specialized-routing is addressed by this task packet, source story, and exact write/proof rows. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Required Supplemental Guardrail References | Compatibility Proof | Approval Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | feature-local | current story-owned planning/source area | src/features/organizationBrandingReferences | no | not-applicable: no extraction in this task | Compatibility proof comes from focused tests or docs validation named in proof plan. | approved |
| T-S012-02 | feature-local | current story-owned planning/source area | src/features/organizationBrandingReferences | no | not-applicable: no extraction in this task | Compatibility proof comes from focused tests or docs validation named in proof plan. | approved |
| T-S012-03 | feature-local | current story-owned planning/source area | src/features/organizationBrandingReferences | no | not-applicable: no extraction in this task | Compatibility proof comes from focused tests or docs validation named in proof plan. | approved |
| T-S012-04 | platform-seam | current story-owned planning/source area | approved platform seam | no | not-applicable: no extraction in this task | Compatibility proof comes from focused tests or docs validation named in proof plan. | approved |
| T-S012-05 | feature-local | current story-owned planning/source area | src/features/organizationBrandingReferences | no | not-applicable: no extraction in this task | Compatibility proof comes from focused tests or docs validation named in proof plan. | approved |
| T-S012-06 | feature-local | current story-owned planning/source area | src/features/organizationBrandingReferences | no | not-applicable: no extraction in this task | Compatibility proof comes from focused tests or docs validation named in proof plan. | approved |

## Allowed Write Set Classification

| Task ID | Path Pattern | Write Class | Write Set Reason |
| --- | --- | --- | --- |
| T-S012-01 | path-unknown: organization domain branding/logo management module path not known until S-016; src/features/organizationBrandingReferences/**; src/features/assets/** only through public seams; tests/integration/organizationBrandingReferences/** | feature-local | Matches the task queue allowed write set. |
| T-S012-02 | src/features/organizationBrandingReferences/persistence/**; tests/integration/organizationBrandingReferences/** | feature-local | Matches the task queue allowed write set. |
| T-S012-03 | src/features/organizationBrandingReferences/**; src/routes/v1/index.ts; tests/integration/organizationBrandingReferences/** | feature-local | Matches the task queue allowed write set. |
| T-S012-04 | src/features/organizationBrandingReferences/**; src/features/assets/**; tests/security/organizationBrandingReferences/** | platform-seam | Matches the task queue allowed write set. |
| T-S012-05 | tests/unit/organizationBrandingReferences/**; tests/integration/organizationBrandingReferences/**; tests/security/organizationBrandingReferences/** | test | Matches the task queue allowed write set. |
| T-S012-06 | docs/features/organization-branding-references.md; docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/** | docs-artifact | Matches the task queue allowed write set. |

## Forbidden Work

| Task ID | Forbidden Work | Forbidden Work Reason |
| --- | --- | --- |
| T-S012-01 | Do not broaden route families, add app-page CSS, introduce unsupported logo/export behavior, or edit unrelated Organization stories. | Keeps Layer 5 delivery isolated and source-truth aligned. |
| T-S012-02 | Do not broaden route families, add app-page CSS, introduce unsupported logo/export behavior, or edit unrelated Organization stories. | Keeps Layer 5 delivery isolated and source-truth aligned. |
| T-S012-03 | Do not broaden route families, add app-page CSS, introduce unsupported logo/export behavior, or edit unrelated Organization stories. | Keeps Layer 5 delivery isolated and source-truth aligned. |
| T-S012-04 | Do not broaden route families, add app-page CSS, introduce unsupported logo/export behavior, or edit unrelated Organization stories. | Keeps Layer 5 delivery isolated and source-truth aligned. |
| T-S012-05 | Do not broaden route families, add app-page CSS, introduce unsupported logo/export behavior, or edit unrelated Organization stories. | Keeps Layer 5 delivery isolated and source-truth aligned. |
| T-S012-06 | Do not broaden route families, add app-page CSS, introduce unsupported logo/export behavior, or edit unrelated Organization stories. | Keeps Layer 5 delivery isolated and source-truth aligned. |

## Task Acceptance Criteria Coverage

| Task ID | AC IDs Covered |
| --- | --- |
| T-S012-01 | AC-S012-01 |
| T-S012-02 | AC-S012-01 |
| T-S012-03 | AC-S012-01 |
| T-S012-04 | AC-S012-01 |
| T-S012-05 | AC-S012-01 |
| T-S012-06 | AC-S012-01 |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) Covered | Capability Coverage Status |
| --- | --- | --- |
| T-S012-01 | CAP-ORG-BRAND-001 | approved |
| T-S012-02 | CAP-ORG-BRAND-001 | approved |
| T-S012-03 | CAP-ORG-BRAND-001 | approved |
| T-S012-04 | CAP-ORG-BRAND-001 | approved |
| T-S012-05 | CAP-ORG-BRAND-001 | approved |
| T-S012-06 | CAP-ORG-BRAND-001 | approved |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S012-01 | not-applicable: no dependency | No task dependency inside packet. | no |
| T-S012-02 | T-S012-01 | Previous task produces the source/proof surface consumed by this task. | no |
| T-S012-03 | T-S012-02 | Previous task produces the source/proof surface consumed by this task. | no |
| T-S012-04 | T-S012-03 | Previous task produces the source/proof surface consumed by this task. | no |
| T-S012-05 | T-S012-04 | Previous task produces the source/proof surface consumed by this task. | no |
| T-S012-06 | T-S012-05 | Previous task produces the source/proof surface consumed by this task. | no |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S012-01 | Organization domain public seams, auth/session context, and relevant asset/job/generated artifact seams. | feature-public | existing-or-feature-local | Proof must show owning feature authorizes domain behavior before shared seams are consumed. |
| T-S012-02 | Organization domain public seams, auth/session context, and relevant asset/job/generated artifact seams. | feature-public | existing-or-feature-local | Proof must show owning feature authorizes domain behavior before shared seams are consumed. |
| T-S012-03 | Organization domain public seams, auth/session context, and relevant asset/job/generated artifact seams. | feature-public | existing-or-feature-local | Proof must show owning feature authorizes domain behavior before shared seams are consumed. |
| T-S012-04 | Organization domain public seams, auth/session context, and relevant asset/job/generated artifact seams. | platform | new-or-extended | Proof must show owning feature authorizes domain behavior before shared seams are consumed. |
| T-S012-05 | Organization domain public seams, auth/session context, and relevant asset/job/generated artifact seams. | feature-public | existing-or-feature-local | Proof must show owning feature authorizes domain behavior before shared seams are consumed. |
| T-S012-06 | Organization domain public seams, auth/session context, and relevant asset/job/generated artifact seams. | feature-public | existing-or-feature-local | Proof must show owning feature authorizes domain behavior before shared seams are consumed. |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S012-01 | S-012 story evidence and affected maintained artifacts | refresh-if-source-truth-changes | task-breakdown-maintainer or owning artifact workflow | yes |
| T-S012-02 | S-012 story evidence and affected maintained artifacts | refresh-if-source-truth-changes | task-breakdown-maintainer or owning artifact workflow | yes |
| T-S012-03 | S-012 story evidence and affected maintained artifacts | refresh-if-source-truth-changes | task-breakdown-maintainer or owning artifact workflow | yes |
| T-S012-04 | S-012 story evidence and affected maintained artifacts | refresh-if-source-truth-changes | task-breakdown-maintainer or owning artifact workflow | yes |
| T-S012-05 | S-012 story evidence and affected maintained artifacts | refresh-if-source-truth-changes | task-breakdown-maintainer or owning artifact workflow | yes |
| T-S012-06 | S-012 story evidence and affected maintained artifacts | refresh-if-source-truth-changes | task-breakdown-maintainer or owning artifact workflow | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S012-01 | mixed | npx vitest run tests/integration/organizationBrandingReferences/ | Mocks and fixtures must match approved contract/live persistence shape; runtime proof required for served routes or generated files. |
| T-S012-02 | mixed | npx vitest run tests/integration/organizationBrandingReferences/ | Mocks and fixtures must match approved contract/live persistence shape; runtime proof required for served routes or generated files. |
| T-S012-03 | mixed | npx vitest run tests/integration/organizationBrandingReferences/ | Mocks and fixtures must match approved contract/live persistence shape; runtime proof required for served routes or generated files. |
| T-S012-04 | mixed | npx vitest run tests/integration/organizationBrandingReferences/ tests/security/organizationBrandingReferences/ | Mocks and fixtures must match approved contract/live persistence shape; runtime proof required for served routes or generated files. |
| T-S012-05 | mixed | npx vitest run tests/unit/organizationBrandingReferences/** | Mocks and fixtures must match approved contract/live persistence shape; runtime proof required for served routes or generated files. |
| T-S012-06 | mixed | npm run task-breakdown:validate -- /home/gordon/kanbien/docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown | Mocks and fixtures must match approved contract/live persistence shape; runtime proof required for served routes or generated files. |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |
| T-S012-05 | npm run test:coverage-strength | not-run: to be run during delivery | no scoped debt asserted in planning | not-applicable: planning packet only | not-applicable: delivery owns execution |

## Branch Worktree Bootstrap Strategy

| Task ID | Branch Name | Worktree Strategy | Bootstrap Artifact | Base Ref | Base Commit Policy | Promotion Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S012-01 | codex/org-t-s012-01 | use existing workspace or preserved task worktree | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/task-breakdown.md | current branch | run git preflight before delivery | current Organization domain foundation branch stack |
| T-S012-02 | codex/org-t-s012-02 | use existing workspace or preserved task worktree | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/task-breakdown.md | current branch | run git preflight before delivery | current Organization domain foundation branch stack |
| T-S012-03 | codex/org-t-s012-03 | use existing workspace or preserved task worktree | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/task-breakdown.md | current branch | run git preflight before delivery | current Organization domain foundation branch stack |
| T-S012-04 | codex/org-t-s012-04 | use existing workspace or preserved task worktree | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/task-breakdown.md | current branch | run git preflight before delivery | current Organization domain foundation branch stack |
| T-S012-05 | codex/org-t-s012-05 | use existing workspace or preserved task worktree | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/task-breakdown.md | current branch | run git preflight before delivery | current Organization domain foundation branch stack |
| T-S012-06 | codex/org-t-s012-06 | use existing workspace or preserved task worktree | docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/task-breakdown.md | current branch | run git preflight before delivery | current Organization domain foundation branch stack |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Layer 5 Delivery Handoff

| Task ID | Layer 5 Handoff Status | Blockers Remaining |
| --- | --- | --- |
| T-S012-01 | queued-for-delivery | none |
| T-S012-02 | queued-for-delivery | none |
| T-S012-03 | queued-for-delivery | none |
| T-S012-04 | queued-for-delivery | none |
| T-S012-05 | queued-for-delivery | none |
| T-S012-06 | queued-for-delivery | none |
