# Story Breakdown: Tenant Branding Configuration

## Status

- Packet status:
  `ready-for-task-breakdown`
- Packet date:
  2026-04-29
- Epic ID:
  `EPIC-TENANT-BRANDING-CONFIGURATION`
- Epic title:
  Tenant branding configuration
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-04-29-tenant-branding-configuration.md`
- Source Technical Steering packet:
  `docs/workspace/technical-steering/2026-04-29-tenant-branding-configuration-steering.md`
- Related PRD:
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- Related capability matrix:
  `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- Related design-system, asset, ADR, or architecture artifacts:
  `docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`;
  `docs/workspace/asset-consumer-decisions/2026-04-30-tenant-branding-logo-alignment.md`;
  `docs/workspace/runbooks/2026-04-30-tenant-branding-logo-cleanup-and-privacy.md`;
  `docs/api-contracts/tenant-branding.md`;
  `docs/architecture/permission-mappings/tenant-branding-permission-mapping.md`;
  `docs/workspace/implementation-blueprints/2026-04-30-tenant-branding-configuration-v1.md`;
  `docs/prd/test_cases/2026-04-30-0022-tenant-branding-configuration-test-cases.md`;
  `docs/architecture/guides/story-breakdown-test-design-guide.md`;
  `docs/workspace/design-system/behavior-locks/tenant-branding-composition-behavior-lock.md`;
  `docs/workspace/design-system/reference-packs/tenant-branding-composition-reference-pack.md`;
  `docs/workspace/design-system/verification/tenant-branding-composition-verification-checklist.md`;
  `docs/workspace/design-system/adoption/tenant-branding-composition-adoption-contract.md`;
  `docs/workspace/design-system/patterns/tenant-branding-composition-pattern.md`;
  ADRs named by Technical Steering for feature bundles, cross-feature seams,
  tenant authz, asset foundation, frontend topology, and governed app adoption
- Validation command:
  `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-04-29-tenant-branding-configuration-story-breakdown.md`
- Validation status:
  `pass`

## Handoff Validation

- Product Discovery status:
  `ready-for-technical-steering`
- Technical Steering status:
  `ready-for-layer-3-after-asset-and-design-system-governance`
- Steering non-goals preserved:
  no tenant-admin self-service, no public logo delivery, no generic asset
  library, no live dashboard push, no broad portal theming, no app-page CSS,
  no source code, no PRD, no capability matrix, no Task Breakdown in this
  packet
- Steering stop conditions resolved or carried as blockers:
  requester explicitly asked for Story Breakdown after the steering packet; PRD
  decisions, capability matrix coverage, design-system behavior locks, API/data
  contracts, permission mappings, asset/runbook notes, implementation
  blueprint, and PRD-derived test cases are now recorded. OpenAPI/Postman,
  design-system browser signoff, feature manifests, and generated graph
  refresh are preserved as Layer 4 / Layer 5 delivery obligations.
- Architecture invention check:
  `consumes-steering-only`
- Governed frontend seam posture:
  `ready-for-design-system-task-breakdown`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  asset relationship authorization, same-origin private delivery, SVG sanitizer
  readiness, contextual accessibility metadata, selected-tenant root writes,
  current-tenant dashboard reads, cross-tenant deny, lifecycle cleanup, audit
  events, durable fallback facts, and migration/index agreement must be proven
  before delivery
- Missing source-of-truth artifacts:
  none blocking Layer 3. OpenAPI/Postman, browser/canonical signoff, feature
  manifest refresh, generated dependency graph refresh, and final feature docs
  are implementation-time or Layer 4 task obligations.

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| C-001 | Tenant branding owning feature boundary | architecture-foundation-required | PRD and architecture governance for tenantBranding versus tenantConfiguration | deferred-with-owner | Architecture-foundation task for owning feature, public seams, fallback scope, and logo lifecycle decisions |
| C-002 | Root-admin branding configuration record | feature-local | Future tenant branding or tenant configuration feature | deferred-with-owner | Backend, API-contract, migration/persistence, data-dictionary, and permission-mapping tasks after PRD and capability matrix approval |
| C-003 | Tenant logo asset relationship | feature-public-seam | Tenant branding consumer seam plus assets public seams | deferred-with-owner | Backend, API-contract, migration/persistence, permission-mapping, and QA/evidence tasks after asset alignment is recorded |
| C-004 | Tenant dashboard branding projection | feature-local | Tenant branding projection consumed by tenant dashboard shell | deferred-with-owner | Backend and API-contract tasks for projection shape, fallback behavior, and current-tenant authorization |
| C-005 | Authorization, audit, lifecycle, and cleanup posture | feature-local | Root authz, tenant authz, audit, asset lifecycle, and operations artifacts | deferred-with-owner | Permission-mapping, data-dictionary, migration/persistence, QA/evidence, and docs-artifact tasks after source-of-truth artifacts exist |
| C-006 | Root-admin and dashboard governed frontend surfaces | design-system-seam | Design-system form, upload, colour, dashboard branding, and adoption seams | deferred-with-owner | Design-system and frontend tasks only after signed-off render/controller/style seams or approved exception exist |
| C-007 | Maintained artifact conformance | feature-public-seam | Feature manifests, generated dependency graph, API, data, permission, asset, and test-case artifacts | deferred-with-owner | Docs-artifact and standards-compliance tasks before Layer 5 delivery |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-000 | Capability matrix normalization | yes | Tenant branding capability matrix first draft exists and maps the AC inventory for Task Breakdown planning. | docs-artifact |
| S-001 | Scope and fallback decision lock | yes | PRD records owning feature boundary, fallback values, replacement-only logo posture, dashboard scope, and cleanup/quota defaults. | architecture-foundation |
| S-001 | Source-independent PRD and fallback artifacts | yes | PRD, capability matrix, API contract, asset alignment note, runbook/privacy note, data dictionary, and permission mapping exist. | docs-artifact |
| S-002 | Governed design-system seam readiness | yes | Composition artifacts identify the design-system seams and browser/canonical signoff remains an explicit design-system task before app UI delivery. | design-system |
| S-003 | Root-admin branding configuration record | yes | PRD, matrix, API contract, data dictionary, permission mapping, and blueprint define root-admin read/save behavior. | backend |
| S-003 | Branding persistence and durable facts | yes | Data dictionary and blueprint define display name, primary colour, timestamps, soft delete, audit evidence, and tenant-name isolation. | migration/persistence |
| S-003 | Root-admin branding API contract | yes | API contract defines selected-tenant read/save shape, validation, authz, and audit behavior. | API-contract |
| S-004 | Tenant logo relationship management | yes | Asset alignment, API contract, data dictionary, runbook, and blueprint define upload, readiness, content read, replacement, accessibility metadata, and cleanup. | backend |
| S-004 | Logo relationship persistence | yes | Data dictionary and runbook define current logo relationship, consumer readiness, replacement, retention, cleanup, and quota posture. | migration/persistence |
| S-004 | Asset-sensitive API contract | yes | API contract defines upload intent, link, content read, headers, SVG image-resource posture, and no public delivery. | API-contract |
| S-005 | Tenant dashboard branding projection | yes | Projection has approved fallback behavior, current-tenant authorization, logo readiness, and route contract. | backend |
| S-005 | Projection API contract | yes | API contract defines display name, primary colour, logo URL or null, accessibility posture, fallback indicators, and timing metadata. | API-contract |
| S-006 | Authorization, audit, and lifecycle evidence | yes | Permission mapping, PRD, runbook, and test-case packet record capability keys, grants, deny rules, audit fields, cleanup states, quota, and retry semantics. | permission-mapping |
| S-006 | Audit and lifecycle proof | yes | Runbook/privacy note, data dictionary, blueprint, and PRD-derived test cases define cleanup and audit evidence. | QA/evidence |
| S-007 | Root-admin governed branding screen | yes | App UI depends on signed-off design-system seams and backend/API readiness; both dependency paths are now explicit Layer 4 task inputs. | frontend |
| S-007 | Root-admin branding design-system adoption | yes | Behavior lock, reference pack, verification checklist, adoption artifact, and pattern artifact define the design-system adoption task. | design-system |
| S-008 | Tenant dashboard governed branding consumption | yes | Dashboard rendering depends on projection, asset authorization order, fallback table, and design-system signoff; all are task-breakdown inputs. | frontend |
| S-008 | Dashboard branding design-system adoption | yes | Dashboard branding consumption states are recorded for canonical/browser scenario tasks. | design-system |
| S-009 | Maintained artifact conformance | yes | API, data, permission, design-system, asset, runbook, blueprint, and test-case artifacts exist; implementation-time artifacts are recorded in blueprint. | docs-artifact |
| S-009 | Standards and generated artifact proof | yes | Feature manifest and dependency graph verification are planned delivery obligations before Layer 5 completion. | standards-compliance |

## Epic Summary

- Epic job to be done:
  Root admins need to configure a tenant-owned logo, branding display name,
  and primary colour so tenant users see safe tenant branding on the dashboard
  after login or page reload.
- Epic outcome:
  Tenant branding is root-managed, tenant-owned, asset-safe, permissioned,
  auditable, and consumed through governed design-system seams.
- Epic actors:
  root admin, tenant user, asset system, tenant dashboard projection system,
  audit/operations reviewer
- Epic non-goals:
  tenant-admin self-service, public logo delivery, generic file hosting, live
  dashboard theme push, multilingual branding, marketing-site branding, broad
  portal theming, app-page CSS, copied app-local governed UI composition
- Epic dependency summary:
  Tenant branding depends on tenants for selected/current tenant identity,
  assets for upload/read/storage invariants, rootRoles or central authz for
  capabilities, tenant dashboard/session projection for consumption, and
  design-system seams for root-admin and dashboard surfaces.
- Epic-level proof target:
  `mixed`

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | superseded | harness-value | docs-artifact | Capability matrix normalization | This is needed to break down what tenant branding needs to be able to do into individual capabilities, so we can plan the implementation more accurately. | As the delivery harness, I need approved stories translated into capability rows so delivery cannot proceed from broad value statements. | harness | Approved capability rows cover every acceptance criterion and identify non-capability-backed criteria. | Fulfilled by capability matrix first draft |
| S-001 | superseded | system-value | docs-artifact | Scope and fallback decision lock | This is needed to settle what happens when branding is missing, replaced, or only partly configured before the work is split further. | As product and architecture governance, I need the owning feature boundary, screen placement, fallback values, logo clear behavior, dashboard surface scope, and old-logo lifecycle decisions locked. | product governance | Downstream contracts can describe exact behavior without inventing architecture during implementation. | Fulfilled by PRD and source-independent artifacts |
| S-002 | ready-for-task-breakdown | system-value | architecture-foundation | Governed design-system seam readiness | This is needed to define the shared branding screens before root admins and tenant users rely on them. | As frontend governance, I need signed-off design-system render, controller, style, and verification seams for the root-admin form and dashboard branding consumption. | design-system governance | App implementation can consume shared seams without app-page CSS or copied governed composition. | Blocks S-007 and S-008 delivery; ready for design-system task breakdown |
| S-003 | ready-for-task-breakdown | user-value | backend | Root-admin branding configuration record | This is its own story because changing the display name and color is the simplest recognizable branding action for a root admin. | As a root admin, I need to read and save tenant branding display name and primary colour for exactly one selected tenant. | root admin | Durable tenant branding facts are stored, validated, permissioned, and auditable. | Depends on S-002 only for app UI, not backend delivery |
| S-004 | ready-for-task-breakdown | user-value | backend | Tenant logo relationship management | This is its own story because logo handling has safety, ownership, and accessibility expectations beyond text and color. | As a root admin, I need to create, replace, and consume a current tenant logo relationship only when the asset is ready and consumer metadata is present. | root admin and asset system | Tenant branding owns the logo relationship while assets owns file safety, storage policy, and content delivery invariants. | Depends on approved asset decision and assets public seams |
| S-005 | ready-for-task-breakdown | user-value | backend | Tenant dashboard branding projection | This is its own story because tenant users should see the approved branding after login or reload without needing admin context. | As a tenant user, I need the dashboard branding projection to return safe display name, primary colour, and logo content reference for my current tenant after login or reload. | tenant user | The dashboard consumes authorized tenant branding without live push behavior or cross-tenant leakage. | Depends on S-003 and S-004 backend outputs |
| S-006 | ready-for-task-breakdown | system-value | backend | Authorization, audit, and lifecycle evidence | This is its own story because branding and logo changes are sensitive enough to need reviewable decisions and cleanup behavior. | As platform governance, I need allow and deny decisions, audit events, lifecycle cleanup states, quota posture, and privacy exclusions recorded for branding and logo operations. | security, audit, and operations | Permission-sensitive and asset-sensitive behavior has durable evidence and retryable failure visibility. | Cross-cuts S-003 through S-005 |
| S-007 | ready-for-task-breakdown | user-value | frontend | Root-admin governed branding screen | This is its own story because root admins need one clear place to manage branding and understand validation or preview results. | As a root admin, I need a governed root-admin surface for branding values, logo status, accessibility metadata, validation, and preview. | root admin | Root-admin users can manage branding through signed-off design-system seams. | Depends on S-002, S-003, S-004, and S-006 delivery order |
| S-008 | ready-for-task-breakdown | user-value | frontend | Tenant dashboard governed branding consumption | This is its own story because the customer-facing dashboard is where branding value becomes visible to tenant users. | As a tenant user, I need the tenant dashboard shell to apply branding from the authenticated projection after login or reload with explicit fallback states. | tenant user | Tenant users see configured branding or approved fallback using signed-off dashboard seams. | Depends on S-002, S-005, and S-006 delivery order |
| S-009 | ready-for-task-breakdown | harness-value | standards-compliance | Maintained artifact conformance | This is needed to keep the written rules, examples, and tests aligned with the approved branding behavior before follow-on work starts. | As repo governance, I need API, data, permission, feature-manifest, dependency graph, design-system, asset, and test-case artifacts to reflect the approved story set before Task Breakdown. | repo governance | Downstream Task Breakdown starts from coherent source-independent artifacts. | Tracks delivery-time artifact sweep |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | The capability matrix names root-admin branding read, root-admin branding manage, logo relationship create or replace, logo read or content read, tenant-dashboard branding read, fallback projection, cross-tenant denial, and audit evidence rows. | contract-level | capability-matrix coverage; traceability review | capability matrix |
| AC-S000-02 | S-000 | Every acceptance criterion in this packet maps to an approved capability row or records why the criterion is governance-only. | contract-level | traceability review | capability matrix |
| AC-S001-01 | S-001 | The PRD selects tenant branding as either a new feature bundle or an approved tenant-configuration extension and records the public seams each affected feature will expose or consume. | source-level | architecture decision review; feature-seam review | PRD; feature manifest plan |
| AC-S001-02 | S-001 | The PRD defines exact fallback values for missing display name, missing primary colour, missing logo, not-ready logo, invalid logo metadata, and cross-tenant-denied logo states. | contract-level | state matrix review; fallback contract review | PRD; capability matrix; API contract |
| AC-S001-03 | S-001 | The PRD decides whether v1 supports logo clear or only replacement and defines prior-logo retention, dereference, cleanup, quota, and audit behavior. | contract-level | lifecycle review; asset-consumer alignment review | PRD; asset alignment note; data dictionary |
| AC-S002-01 | S-002 | Design-system governance identifies signed-off seams or records a blocker for root-admin form composition, upload status, colour preview, accessibility metadata control, validation states, and fallback messaging. | human-visible-parity | design-system canonical review; accessibility review | design-system behavior lock; reference pack; verification checklist |
| AC-S002-02 | S-002 | Design-system governance identifies signed-off seams or records a blocker for tenant dashboard branding consumption across missing, partial, invalid, not-ready, cross-tenant-denied, mobile, magnified, RTL, light, and dark states. | human-visible-parity | visual scenario review; accessibility review | design-system behavior lock; canonical scenarios |
| AC-S003-01 | S-003 | Root-admin read returns exactly one selected tenant branding record or the approved absence state while excluding soft-deleted records from normal reads. | runtime-api | API contract; persistence integration; authz allow and deny | PRD; capability matrix; API contract; data dictionary |
| AC-S003-02 | S-003 | Root-admin save rejects client-supplied system-managed fields, empty display names, invalid primary-colour values, missing selected tenant, and unauthorized actors. | runtime-api | validation; authz; boundary values; API contract | PRD; capability matrix; API contract; permission mapping |
| AC-S003-03 | S-003 | Successful root-admin save persists durable display name and primary colour as tenant branding facts, refreshes `updatedAt`, records audit evidence, and does not overwrite the canonical tenant name. | persistence-level | persistence integration; audit; regression for canonical tenant isolation | data dictionary; API contract; audit artifact |
| AC-S004-01 | S-004 | Logo upload or replacement creates a short-lived, single-use, actor-bound, scope-bound, storage-key-bound intent for exactly one selected tenant using only the approved MIME and size limits. | runtime-api | asset contract; validation; quota; authz | asset alignment note; capability matrix; API contract |
| AC-S004-02 | S-004 | The logo relationship can become consumer-ready only when the asset is ready, tenant scope matches, lifecycle state is allowed, and contextual alt text or decorative posture is recorded. | persistence-level | asset readiness; state transition; accessibility metadata | data dictionary; asset alignment note; capability matrix |
| AC-S004-03 | S-004 | Dashboard logo delivery uses same-origin authenticated streaming with `nosniff`, never raw bucket URLs, never public delivery, and never direct DOM injection of uploaded SVG markup. | runtime-api | asset content read; security headers; SVG safety | API contract; asset docs; security notes |
| AC-S004-04 | S-004 | Replacement uses a new asset or version with a new storage key and leaves prior bytes governed by approved retention, cleanup, quota, and audit behavior. | persistence-level | lifecycle transition; cleanup evidence; audit | data dictionary; asset alignment note; runbook note |
| AC-S005-01 | S-005 | Tenant dashboard branding read evaluates exactly one current tenant context and denies reads when the current tenant does not match the branding owner and asset tenant. | runtime-api | tenant authz; cross-tenant deny; integration | permission mapping; API contract; capability matrix |
| AC-S005-02 | S-005 | The projection returns display name, primary colour, logo URL or null, logo accessibility posture, fallback indicators, and reload/login timing metadata using approved fallback behavior. | contract-level | API contract; state matrix; compatibility | PRD; API contract; OpenAPI/Postman artifacts |
| AC-S005-03 | S-005 | Branding changes are visible after next login or dashboard reload and no v1 behavior promises live updates to already-open dashboards. | runtime-api | session or projection refresh; compatibility | PRD; API contract; frontend test-case plan |
| AC-S006-01 | S-006 | Permission mapping defines root-admin manage and read capabilities, tenant-dashboard branding read capability, required asset capabilities, and cross-tenant deny rules. | contract-level | permission allow and deny; policy review | permission mapping; capability matrix |
| AC-S006-02 | S-006 | Audit evidence covers branding create, read deny, update, logo intent creation, upload completion, mismatch or failure, link or replacement, delete if approved, cleanup failure, quota denial, and cross-tenant denial without logging forbidden fields. | persistence-level | audit integration; privacy log review | audit docs; privacy note; capability matrix |
| AC-S006-03 | S-006 | Expired, abandoned, rejected, orphaned, and failed-cleanup logo states have owner, retry, quota, cost, and operational visibility semantics before implementation begins. | contract-level | lifecycle matrix; operational evidence review | PRD; asset alignment note; runbook note |
| AC-S007-01 | S-007 | The root-admin branding screen consumes signed-off design-system render, controller, style, and accessibility seams for form layout, upload status, colour preview, validation, and fallback messaging. | rendered-browser | browser visual; accessibility; governed adoption | design-system adoption artifact; frontend test-case plan |
| AC-S007-02 | S-007 | The root-admin screen supports root-admin read, partial value edits that preserve untouched values, invalid colour feedback, empty display-name rejection, logo pending, ready, rejected, replacement, and consumer-not-ready states. | rendered-browser | browser interaction; validation; state matrix | PRD; capability matrix; frontend scenarios |
| AC-S007-03 | S-007 | The root-admin screen does not add app-page CSS, reconstruct governed markup, or duplicate governed controller behavior unless an explicit exception is recorded. | source-level | governed adoption review; source inspection | design-system adoption artifact |
| AC-S008-01 | S-008 | Tenant dashboard shell consumes the approved projection and signed-off design-system seams to render configured display name, primary colour, ready logo, and accessibility posture after login or reload. | rendered-browser | browser visual; accessibility; projection integration | frontend scenarios; design-system adoption artifact |
| AC-S008-02 | S-008 | Tenant dashboard shell renders approved fallback states for missing branding, partial branding, invalid or not-ready logo, missing accessibility metadata, and cross-tenant-denied logo access. | rendered-browser | browser state matrix; accessibility; authz deny | frontend scenarios; PRD fallback table |
| AC-S008-03 | S-008 | Dashboard branding rendering does not infer asset authority from asset ownership alone and uses tenant branding authorization before asset content is requested. | mixed | authz integration; browser/API integration | permission mapping; API contract; capability matrix |
| AC-S009-01 | S-009 | API contracts, OpenAPI/Postman artifacts, data dictionary, permission mappings, feature manifests, and generated dependency graph artifacts reflect every approved public seam and cross-feature dependency. | source-level | artifact consistency; generated artifact verification | API contracts; data dictionary; permission mappings; feature manifests; generated graph |
| AC-S009-02 | S-009 | PRD-derived test-case planning records actor, permission, state, object, value, validation, lifecycle, system-error, accessibility, privacy, audit, performance, resilience, and compatibility obligations for each delivery story. | contract-level | TC planning review; traceability review | PRD-derived test-case packet |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | Tenant branding capability matrix control rows | planning | create-or-refresh-required | Default harness-value control story because no approved matrix exists. |
| S-000 | AC-S000-02 | Tenant branding capability matrix traceability rows | planning | create-or-refresh-required | Must cover this story queue before Task Breakdown. |
| S-001 | AC-S001-01 | Governance-only PRD scope row | planning | create-or-refresh-required | Capability matrix should identify feature-boundary decision as a prerequisite. |
| S-001 | AC-S001-02 | Branding fallback behavior | tenant dashboard projection | create-or-refresh-required | Fallback behavior must be capability-backed. |
| S-001 | AC-S001-03 | Logo clear or replacement lifecycle | tenant logo relationship | create-or-refresh-required | Must align with asset decision. |
| S-002 | AC-S002-01 | Root-admin branding form design-system readiness | governed frontend | create-or-refresh-required | Matrix should block app work until signed-off seams exist. |
| S-002 | AC-S002-02 | Tenant dashboard branding design-system readiness | governed frontend | create-or-refresh-required | Matrix should cover visible fallback and accessibility states. |
| S-003 | AC-S003-01 | root-admin.tenant-branding.read | root-admin selected tenant | create-or-refresh-required | Exact key may change in permission planning. |
| S-003 | AC-S003-02 | root-admin.tenant-branding.manage | root-admin selected tenant | create-or-refresh-required | Includes validation deny behavior. |
| S-003 | AC-S003-03 | root-admin.tenant-branding.manage; tenant-branding.audit.record | persistence and audit | create-or-refresh-required | Durable branding facts must not mutate tenant canonical name. |
| S-004 | AC-S004-01 | root-admin.tenant-branding.logo.update; asset.create | asset relationship | create-or-refresh-required | Uses approved asset use case. |
| S-004 | AC-S004-02 | root-admin.tenant-branding.logo.update; asset.link | asset relationship | create-or-refresh-required | Consumer readiness includes accessibility metadata. |
| S-004 | AC-S004-03 | tenant-branding.logo.read; asset.content.read | asset delivery | create-or-refresh-required | Same-origin private content delivery only. |
| S-004 | AC-S004-04 | root-admin.tenant-branding.logo.update; asset.lifecycle.cleanup | asset lifecycle | create-or-refresh-required | Replacement and old-asset lifecycle need explicit rows. |
| S-005 | AC-S005-01 | tenant-branding.dashboard.read | tenant current context | create-or-refresh-required | Cross-tenant denial must be covered. |
| S-005 | AC-S005-02 | tenant-branding.dashboard.read; tenant-branding.fallback.read | tenant dashboard projection | create-or-refresh-required | Projection shape and fallback indicators need rows. |
| S-005 | AC-S005-03 | tenant-branding.dashboard.read | tenant dashboard projection | create-or-refresh-required | Apply timing is reload/login, not live push. |
| S-006 | AC-S006-01 | root-admin.tenant-branding.read; root-admin.tenant-branding.manage; tenant-branding.dashboard.read; asset.create; asset.link; asset.read; asset.content.read | authz | create-or-refresh-required | Exact grants need permission mapping. |
| S-006 | AC-S006-02 | tenant-branding.audit.record | audit | create-or-refresh-required | Forbidden logged fields are part of proof. |
| S-006 | AC-S006-03 | asset.lifecycle.cleanup; tenant-branding.logo.lifecycle | lifecycle | create-or-refresh-required | Cleanup semantics block delivery planning. |
| S-007 | AC-S007-01 | root-admin.tenant-branding.manage | governed frontend | create-or-refresh-required | App screen depends on design-system seams. |
| S-007 | AC-S007-02 | root-admin.tenant-branding.read; root-admin.tenant-branding.manage; root-admin.tenant-branding.logo.update | governed frontend | create-or-refresh-required | UI state matrix must map to backend rows. |
| S-007 | AC-S007-03 | Governed frontend adoption compliance | governed frontend | create-or-refresh-required | Compliance criterion is standards-backed. |
| S-008 | AC-S008-01 | tenant-branding.dashboard.read; tenant-branding.logo.read | tenant dashboard frontend | create-or-refresh-required | Browser proof must consume projection. |
| S-008 | AC-S008-02 | tenant-branding.dashboard.read; tenant-branding.fallback.read | tenant dashboard frontend | create-or-refresh-required | Fallback states need explicit coverage. |
| S-008 | AC-S008-03 | tenant-branding.dashboard.read; asset.content.read | cross-feature authz | create-or-refresh-required | Authorization order must be explicit. |
| S-009 | AC-S009-01 | Artifact conformance control row | repo governance | create-or-refresh-required | Governance-only but matrix should track. |
| S-009 | AC-S009-02 | PRD-derived test-case planning control row | test planning | create-or-refresh-required | Detailed TC IDs come later. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | S-001 / AC-S001-01 | tenant branding or tenantConfiguration feature boundary | new-capability | new | PRD records owning feature and public seams. | Feature manifest and dependency graph proof when implemented. |
| D-002 | S-001 / AC-S001-02 | tenants canonical tenant name | pre-existing-capability | existing | PRD states fallback may read canonical name without overwriting it. | Projection tests prove branding display name remains separate from canonical tenant name. |
| D-003 | S-002 / AC-S002-01 | design-system root-admin form/upload/colour seams | design-system-seam | existing or new | Behavior lock names consumable render and controller seams. | Browser canonical tests cover form, upload, validation, and accessibility states. |
| D-004 | S-002 / AC-S002-02 | design-system tenant dashboard shell branding seams | design-system-seam | existing or new | Behavior lock names dashboard render and controller seams. | Browser canonical tests cover configured and fallback dashboard states. |
| D-005 | S-003 / AC-S003-01 | selected tenant lookup from tenants/root-admin | cross-feature-read | existing | API contract requires exact selected tenant parameter or context. | Runtime API tests cover missing, unauthorized, and valid selected tenant. |
| D-006 | S-003 / AC-S003-03 | tenant branding persistence table and indexes | persistence-table-or-index | new | Data dictionary and migration plan define durable fields, timestamps, soft delete, and uniqueness. | Persistence tests cover create, update, soft delete exclusion, and normalized validation. |
| D-007 | S-004 / AC-S004-01 | assets upload-intent seam | feature-public-seam | existing or narrow extension | API contract proves actor, tenant scope, storage key, expiry, MIME, and size binding. | Asset integration tests cover allowed and denied upload-intent creation. |
| D-008 | S-004 / AC-S004-02 | assets readiness and lifecycle seam | feature-public-seam | existing or narrow extension | Contract proves ready, rejected, pending, deleted, tenant mismatch, and sanitizer states. | Integration tests cover consumer-ready and consumer-not-ready logo states. |
| D-009 | S-004 / AC-S004-03 | same-origin asset content-read route | feature-public-seam | existing or narrow extension | API contract proves authenticated content read, headers, and no raw bucket URL. | Runtime tests cover content-read authorization, headers, SVG image-resource posture. |
| D-010 | S-005 / AC-S005-01 | tenant auth current-tenant context | pre-existing-capability | existing | API contract requires exactly one current tenant context. | Runtime API tests cover current-tenant allow and cross-tenant deny. |
| D-011 | S-005 / AC-S005-02 | tenant dashboard branding projection route | new-capability | new | API contract defines projection shape and fallback indicators. | Projection integration tests cover complete, partial, absent, and invalid states. |
| D-012 | S-006 / AC-S006-01 | rootRoles or central authz policy evaluation | authz-capability | existing or changed | Permission mapping names grants and deny rules. | Authz tests cover root read/manage, tenant read, non-root deny, cross-tenant deny. |
| D-013 | S-006 / AC-S006-02 | audit event writer | feature-public-seam | existing or changed | Audit artifact defines event names, fields, and forbidden fields. | Audit integration tests cover success and denial evidence. |
| D-014 | S-006 / AC-S006-03 | asset cleanup command or future scheduler seam | job-queue-or-worker | existing or future | Lifecycle plan defines owner, retry, quota, and failure evidence. | Cleanup tests cover expired, abandoned, orphaned, and failed-delete states. |
| D-015 | S-007 / AC-S007-01 | root-admin path-backed topology | frontend-topology-route | existing or new | Frontend topology decision names canonical route and avoids new hash destination. | Browser route tests cover canonical path and compatibility if alias exists. |
| D-016 | S-008 / AC-S008-01 | tenant dashboard shell route and projection consumer | frontend-topology-route | existing or changed | Frontend contract names dashboard surface scope. | Browser integration tests cover login or reload consumption. |
| D-017 | S-009 / AC-S009-01 | feature manifests and generated dependency graph | feature-public-seam | existing maintained artifact | Manifest and generated graph list public seams and dependencies. | Standards gate verifies generated artifacts after manifest changes. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| Tenant branding configuration seam | root-admin transport; tenant dashboard projection | Durable display name, primary colour, current logo relationship, fallback status, validation, timestamps | Canonical tenant name as branding fact; mutable external lookup for durable branding values | Root-admin read/save and dashboard projection integration |
| Tenant branding logo relationship seam | assets feature; dashboard logo display | Tenant branding authorizes relationship before assets content read and requires consumer-ready metadata | Asset ownership alone; raw bucket URLs; public delivery | Asset readiness, relationship authorization, content-read integration |
| Tenant dashboard branding projection seam | tenant dashboard shell | Current-tenant read returns safe branding values and fallback indicators after login or reload | Live update promise; broad tenant portal theming; cross-tenant implicit access | Tenant-authenticated projection and browser consumption |
| Tenant branding authz capabilities | rootRoles or central authz | Root manage/read and tenant dashboard read are distinct and deny cross-tenant by default | Request body tenant inference; broad root session as tenant authority | Allow and deny policy tests |
| Governed frontend adoption seams | root-admin branding page; tenant dashboard shell | App consumes design-system-owned render/controller/style behavior | App-page CSS; copied governed markup; copied controller behavior | Canonical visual scenarios and app adoption browser proof |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | harness reviewer | repo artifact author | capability matrix absent; story packet drafted | acceptance criteria unmapped; capability rows missing | stable AC IDs; capability posture values | draft story queue to matrix-covered story queue | missing matrix row; stale traceability | compatibility: downstream traceability; auditability: planning evidence |
| S-001 | product owner; architect | planning approval | steering accepted; PRD absent | feature boundary undecided; fallback undecided; clear behavior undecided | selected tenant; fallback values; clear versus replacement | discovery/steering to PRD-ready scope | source-of-truth conflict; missing asset alignment | compatibility: avoids breaking tenant/dashboard contracts; privacy/security: preserves private asset stance |
| S-002 | design-system maintainer; frontend architect | design-system governance approval | governed seams absent or partial | root-admin form states; dashboard branding states | colour preview; upload state; alt/decorative posture; fallback messages | no seam to signed-off seam or explicit blocker | app-page CSS gap; missing controller seam | accessibility; human-visible parity; compatibility with governed adoption rules |
| S-003 | root admin; unauthorized actor | root-admin read/manage; denied non-root | selected tenant present; missing selected tenant; unauthorized actor | no branding; active branding; soft-deleted branding | non-empty display name; approved hex; reject system fields | create branding; update branding; soft delete exclusion | persistence conflict; invalid tenant; authz denial | security; audit; compatibility with tenant canonical name |
| S-004 | root admin; asset system; tenant user as logo reader | root logo update; asset create/link/read/content-read; denied mismatch | authorized root; unauthorized actor; tenant user current context | pending asset; ready asset; rejected asset; deleted asset; tenant mismatch; missing alt metadata | approved MIME; size limit; SVG sanitizer; alt text or decorative posture | create intent; complete upload; link; replace; dereference prior logo; cleanup | quota denial; sanitizer failure; content-read deny; cleanup failure | security; privacy; accessibility; resilience; operational evidence |
| S-005 | tenant user; unauthorized tenant actor | tenant dashboard branding read | current tenant selected; no tenant context; wrong tenant context | complete branding; partial branding; no branding; not-ready logo; denied logo | projection fields; fallback indicators; reload/login timing | branding saved to projection consumed after login or reload | stale projection; cross-tenant deny; asset provider failure | security; compatibility; performance for dashboard load |
| S-006 | security reviewer; audit reviewer; operations reviewer | policy review; audit read if approved | root actor; tenant actor; unauthorized actor | success event; denial event; failed cleanup; quota denial | forbidden log fields; event names; tenant IDs; asset IDs without secret values | allowed request; denied request; retryable cleanup failure | audit writer failure; policy misconfiguration; quota service failure | security; privacy; audit; resilience; operational evidence |
| S-007 | root admin | root-admin branding read/manage/logo update | selected tenant; form loaded; validation failure; save success | active branding; partial values; pending logo; rejected logo; consumer-not-ready logo | display name; hex colour; upload metadata; alt/decorative control | load; edit; save; replace logo; show fallback | API validation failure; upload failure; authz denial; projection stale until reload | accessibility; rendered-browser; governed adoption; mobile and RTL |
| S-008 | tenant user | tenant dashboard branding read; logo read | current tenant; reload; next login; already-open dashboard | complete branding; partial branding; absent branding; denied logo; not-ready logo | display name rendering; primary colour token; logo URL/null; alt/decorative posture | login; reload; no live update while open | projection failure; asset content read denial; stale cache | accessibility; rendered-browser; privacy; compatibility |
| S-009 | repo governance reviewer | artifact governance | artifacts absent; artifacts refreshed | API/data/permission/design/test artifacts stale or aligned | stable story IDs; AC IDs; capability rows; seam names | story packet to coherent downstream artifacts | validation failure; generated graph drift; missing test-case obligations | standards compliance; rebuild readiness; traceability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | harness reviewer; matrix absent | Tenant branding capability matrix control rows | contract-level | TC obligation: matrix coverage review | no |
| AC-S000-02 | harness reviewer; unmapped ACs | Tenant branding capability matrix traceability rows | contract-level | TC obligation: AC-to-row traceability review | no |
| AC-S001-01 | architect; feature boundary undecided | Governance-only PRD scope row | source-level | TC obligation: architecture source review | yes, later manifest proof |
| AC-S001-02 | tenant user; fallback states | Branding fallback behavior | contract-level | TC obligation: fallback state matrix | yes |
| AC-S001-03 | root admin; logo lifecycle states | Logo clear or replacement lifecycle | contract-level | TC obligation: asset lifecycle matrix | yes |
| AC-S002-01 | root admin; governed form states | Root-admin branding form design-system readiness | human-visible-parity | TC obligation: canonical form visual and accessibility scenarios | yes |
| AC-S002-02 | tenant user; dashboard fallback states | Tenant dashboard branding design-system readiness | human-visible-parity | TC obligation: dashboard branding canonical scenarios | yes |
| AC-S003-01 | root admin; selected tenant; soft-deleted record | root-admin.tenant-branding.read | runtime-api | TC obligation: root read allow and soft-delete exclusion | yes |
| AC-S003-02 | root admin and unauthorized actor; invalid values | root-admin.tenant-branding.manage | runtime-api | TC obligation: validation and authz deny cases | yes |
| AC-S003-03 | root admin; update success | root-admin.tenant-branding.manage; tenant-branding.audit.record | persistence-level | TC obligation: durable facts and audit persistence | yes |
| AC-S004-01 | root admin; upload intent | root-admin.tenant-branding.logo.update; asset.create | runtime-api | TC obligation: upload intent binding and limits | yes |
| AC-S004-02 | asset system; consumer readiness states | root-admin.tenant-branding.logo.update; asset.link | persistence-level | TC obligation: readiness and accessibility metadata | yes |
| AC-S004-03 | tenant user; logo read | tenant-branding.logo.read; asset.content.read | runtime-api | TC obligation: same-origin stream and header proof | yes |
| AC-S004-04 | root admin; replacement | root-admin.tenant-branding.logo.update; asset.lifecycle.cleanup | persistence-level | TC obligation: replacement and prior asset lifecycle | yes |
| AC-S005-01 | tenant user; current and wrong tenant | tenant-branding.dashboard.read | runtime-api | TC obligation: current-tenant allow and deny | yes |
| AC-S005-02 | tenant user; complete and fallback states | tenant-branding.dashboard.read; tenant-branding.fallback.read | contract-level | TC obligation: projection shape matrix | yes |
| AC-S005-03 | tenant user; login/reload/open dashboard | tenant-branding.dashboard.read | runtime-api | TC obligation: refresh timing behavior | yes |
| AC-S006-01 | root admin; tenant user; unauthorized actor | authz capability rows | contract-level | TC obligation: permission mapping allow and deny | yes |
| AC-S006-02 | audit reviewer; success and deny events | tenant-branding.audit.record | persistence-level | TC obligation: audit events and forbidden fields | yes |
| AC-S006-03 | operations reviewer; cleanup states | asset.lifecycle.cleanup; tenant-branding.logo.lifecycle | contract-level | TC obligation: cleanup lifecycle and retry semantics | yes |
| AC-S007-01 | root admin; governed form | root-admin.tenant-branding.manage | rendered-browser | TC obligation: app adoption visual proof | yes |
| AC-S007-02 | root admin; form state matrix | root-admin.tenant-branding.read; root-admin.tenant-branding.manage; root-admin.tenant-branding.logo.update | rendered-browser | TC obligation: browser interaction matrix | yes |
| AC-S007-03 | frontend governance; source inspection | Governed frontend adoption compliance | source-level | TC obligation: no app-page CSS or copied governed controller review | no |
| AC-S008-01 | tenant user; configured branding | tenant-branding.dashboard.read; tenant-branding.logo.read | rendered-browser | TC obligation: dashboard configured branding visual proof | yes |
| AC-S008-02 | tenant user; fallback states | tenant-branding.dashboard.read; tenant-branding.fallback.read | rendered-browser | TC obligation: dashboard fallback visual matrix | yes |
| AC-S008-03 | tenant user; asset authority ordering | tenant-branding.dashboard.read; asset.content.read | mixed | TC obligation: authorization-before-asset-read proof | yes |
| AC-S009-01 | repo governance; artifact refresh | Artifact conformance control row | source-level | TC obligation: standards and generated artifact verification | yes |
| AC-S009-02 | test planner; story obligations | PRD-derived test-case planning control row | contract-level | TC obligation: PRD-derived TC planning packet | no |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| B-001 | S-003 through S-008 | capability-matrix | Resolved: tenant branding capability matrix first draft exists. | Keep matrix aligned if Task Breakdown changes delivery ordering. | No longer blocks Task Breakdown. |
| B-002 | S-003 through S-008 | architecture-foundation | Resolved: PRD selects a new narrow `tenantBranding` feature bundle and records public seam posture. | Refresh PRD if delivery proposes broader architecture. | No longer blocks Task Breakdown. |
| B-003 | S-007 and S-008 | design-system-foundation | Resolved for Task Breakdown: design-system first-draft artifacts exist; browser/canonical signoff remains a required design-system delivery task before app UI implementation. | Complete behavior lock, canonical/browser verification, and adoption proof before app UI task closes. | Blocks app UI delivery, not Task Breakdown. |
| B-004 | S-004, S-005, S-006, S-008 | asset-decision | Resolved: asset alignment note confirms PRD/API/data posture preserves approved tenant-logo decision. | Create superseding asset decision if delivery broadens scope. | No longer blocks Task Breakdown. |
| B-005 | S-003 through S-008 | permission-model | Resolved: permission mapping first draft names root-admin, tenant-dashboard, asset, and deny-rule boundaries. | Reconcile target rows into canonical mappings and seeds during implementation. | No longer blocks Task Breakdown. |
| B-006 | S-009 | artifact-drift | Resolved for Layer 3: source-independent PRD, matrix, API, data, permission, design, asset, runbook, blueprint, and TC artifacts exist. | OpenAPI/Postman, manifests, generated graph, feature docs, QA evidence, and standards review remain delivery-time artifacts. | No longer blocks Task Breakdown. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-001 | B-002; AC-S001-01 | Should v1 tenant branding be a new `tenantBranding` feature bundle or an extension of the existing tenant-configuration feature? | yes | requester approved conservative v1 default: create a new narrow `tenantBranding` feature bundle |
| Q-002 | B-001; AC-S001-02; AC-S005-02; AC-S008-02 | What exact fallback values should the dashboard use for missing display name, missing primary colour, missing logo, consumer-not-ready logo metadata, and cross-tenant-denied logo reads? | yes | requester approved conservative v1 defaults: canonical tenant name for missing display name; platform default primary colour for missing or invalid colour; no logo for missing, not-ready, metadata-incomplete, or cross-tenant-denied logo reads |
| Q-003 | B-004; AC-S001-03; AC-S004-04 | Does v1 support clearing a tenant logo, or is replacement-only the approved behavior for the first release? | yes | requester approved conservative v1 default: replacement-only; explicit logo clearing is out of scope for v1 |
| Q-004 | B-004; AC-S004-02; AC-S007-02; AC-S008-01 | Is logo accessibility metadata entered by root admin, derived from branding display name, or recorded as an explicit decorative posture per logo relationship? | yes | requester approved conservative v1 default: root admin must provide explicit alt text or explicitly mark the logo decorative per tenant logo relationship |
| Q-005 | B-001; AC-S005-02; AC-S008-01 | Which tenant dashboard surfaces consume branding in v1: dashboard shell only, dashboard content header, login-to-dashboard handoff, or another named surface? | yes | requester approved conservative v1 default: dashboard shell only |
| Q-006 | B-003; AC-S002-01; AC-S002-02 | Do existing design-system seams cover root-admin branding configuration and tenant-dashboard consumption, or must a design-system foundation story be completed first? | yes | requester accepted design-system recommendation: use existing form-template, upload-file or form-image-card, simple-select or choice-group, drawer-form, list-page, page-shell, and context-nav primitives where possible; create only a narrow tenant-branding composition/adoption artifact if no existing artifact already covers the composed surface |
| Q-007 | B-005; AC-S006-01 | Which exact root-admin, tenant-dashboard, and assets capability keys and grant holders are approved for v1? | yes | requester approved conservative v1 default: use narrow tenant-branding capability keys proposed in this packet as planning names, then finalize exact grants in permission mapping before Task Breakdown |
| Q-008 | B-004; AC-S006-03 | Do failed-cleanup or pending logo records continue to count against tenant quota, actor limits, cost limits, and abuse limits while retry is pending? | yes | requester approved conservative v1 default: pending and failed-cleanup logo records continue to count against limits until cleanup succeeds or a later approved retention policy says otherwise |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-001 | S-001 | Q-001; Q-002; Q-003; Q-004; Q-005; Q-008; A-001 | prd-required | not-applicable: human decisions are recorded in Follow-Up Decision Questions | not-applicable: conservative v1 defaults are already recorded | PRD first draft created at `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`; refresh if downstream API/data/authz decisions change source truth. | yes | resolved |
| U-002 | S-000; S-003 through S-009 | A-002 | capability-matrix-required | not-applicable: capability rows can be derived from the accepted story and AC inventory | not-applicable: use recorded planning names until permission mapping finalizes grants | Capability matrix first draft created at `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`; finalize grants in permission mapping. | yes | resolved |
| U-003 | S-003; S-004; S-005 | A-003; A-004 | api-contract-required | not-applicable: route families are named and depend on PRD and matrix completion | not-applicable: route contract is created; executable route artifacts should follow implementation route truth | API contract first draft created at `docs/api-contracts/tenant-branding.md`; OpenAPI/Postman artifacts are implementation-time delivery tasks. | yes | resolved |
| U-004 | S-003; S-004; S-006 | A-005 | data-dictionary-required | not-applicable: data obligations are listed in AC and artifact ledger rows | not-applicable: persistence truth must follow PRD, matrix, and API decisions | Data dictionary first drafts created at `docs/data-dictionary/tenant-branding.md` and `docs/data-dictionary/tenant-branding-logo-relationship.md`; refresh when migration design lands. | yes | resolved |
| U-005 | S-006 | Q-007; A-006 | permission-mapping-required | not-applicable: planning capability names are recorded and exact grants are delegated to permission mapping | not-applicable: no grant default is safe before permission mapping | Permission mapping first draft created at `docs/architecture/permission-mappings/tenant-branding-permission-mapping.md`; reconcile target rows into canonical mapping docs when implementation lands. | yes | resolved |
| U-006 | S-004; S-006 | A-007; A-013 | artifact-creation | not-applicable: asset posture and cleanup defaults are recorded | not-applicable: asset decision remains source of truth | Asset alignment and runbook/privacy first drafts created at `docs/workspace/asset-consumer-decisions/2026-04-30-tenant-branding-logo-alignment.md` and `docs/workspace/runbooks/2026-04-30-tenant-branding-logo-cleanup-and-privacy.md`; refresh when implementation selects exact cleanup command or scheduler seam. | yes | resolved |
| U-007 | S-002; S-007; S-008 | Q-006; A-008 | design-system-governance | not-applicable: design-system composition recommendation is recorded | not-applicable: use existing governed form, upload, image, choice, drawer, list-page, page-shell, and context-nav primitives before creating new primitives | Design-system composition first drafts created under `docs/workspace/design-system/`; canonical/browser signoff and adoption proof are Layer 4/5 task obligations before app UI closes. | yes | resolved |
| U-008 | S-003 through S-009 | A-009; A-010; A-011; A-012 | artifact-creation | not-applicable: final planning and generated artifacts depend on upstream artifact completion | not-applicable: no standalone safe default before PRD, matrix, API, data, permission, asset, and design artifacts exist | Implementation blueprint and PRD-derived test cases created; feature manifests and generated dependency graph are implementation-time artifacts and must be included in delivery tasks when public seams land. | yes | resolved |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| A-001 | S-001 | PRD | Created first draft: `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`; refresh if downstream contracts change source truth. | PRD workflow | no |
| A-002 | S-000 | capability matrix | Created first draft: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`; finalize authz grants in permission mapping. | capability matrix workflow | no |
| A-003 | S-003; S-004; S-005 | API contract | Created first draft: `docs/api-contracts/tenant-branding.md`; refresh if route topology changes. | api-contract-maintainer | no |
| A-004 | S-003; S-004; S-005 | OpenAPI/Postman | Implementation-time artifact: add maintained route artifacts when tenantBranding routes are implemented; API contract records target route family. | API artifact workflow | no |
| A-005 | S-003; S-004; S-006 | data dictionary | Created first drafts: `docs/data-dictionary/tenant-branding.md` and `docs/data-dictionary/tenant-branding-logo-relationship.md`; refresh when migration design lands. | data-dictionary-maintainer | no |
| A-006 | S-006 | permission mapping | Created first draft: `docs/architecture/permission-mappings/tenant-branding-permission-mapping.md`; reconcile into canonical mapping docs when implementation lands. | permission workflow | no |
| A-007 | S-004; S-006 | asset decision alignment | Created first draft: `docs/workspace/asset-consumer-decisions/2026-04-30-tenant-branding-logo-alignment.md`; approved tenant-logo decision remains source truth. | asset decision workflow | no |
| A-008 | S-002; S-007; S-008 | design-system governance | Created first-draft composition artifacts under `docs/workspace/design-system/`; browser canonicals and signoff are required design-system delivery tasks before app UI closes. | frontend-design-system-loop-maintainer | no |
| A-009 | S-003 through S-008 | implementation blueprint | Created first draft: `docs/workspace/implementation-blueprints/2026-04-30-tenant-branding-configuration-v1.md`. | implementation-blueprint-maintainer | no |
| A-010 | S-003 through S-008 | PRD-derived test cases | Created first draft: `docs/prd/test_cases/2026-04-30-0022-tenant-branding-configuration-test-cases.md`. | prd-test-case-planner | no |
| A-011 | S-003; S-004; S-005 | feature manifest | Implementation-time artifact: create or refresh `tenantBranding` and touched consumer/provider manifests when source seams land; blueprint records required manifest plan. | feature governance | no |
| A-012 | S-009 | generated dependency graph | Implementation-time artifact: regenerate feature dependency graph after manifest or public seam changes; blueprint records required generated-artifact plan. | generated artifact workflow | no |
| A-013 | S-006 | runbook/privacy note | Created first draft: `docs/workspace/runbooks/2026-04-30-tenant-branding-logo-cleanup-and-privacy.md`; exact cleanup command or scheduler seam must be finalized during implementation blueprint. | operational docs workflow | no |

## Story Readiness Summary

- Ready stories:
  S-002 through S-009
- Blocked stories:
  none for Task Breakdown. Design-system browser/canonical signoff,
  OpenAPI/Postman, feature manifests, generated dependency graph, feature docs,
  QA evidence, and standards review remain required delivery tasks before
  Layer 5 completion.
- Stories needing capability matrix:
  none for Task Breakdown; permission mapping target rows must still be
  reconciled into canonical mapping/seed artifacts during delivery.
- Stories needing PRD refinement:
  none unless delivery proposes a broader scope than the PRD.
- Stories needing Technical Steering revisit:
  none under the current steering scope; revisit only if PRD proposes public
  logo delivery, generic asset library behavior, tenant-admin self-service,
  live updates, broad portal theming, changed SVG/storage/scanning posture, or
  app-page CSS exception
- Broad cleanup or shortcut risk:
  `listed-below`
- Architecture invention risk:
  `none`

Shortcut risks:

- Treating CSS sharing as governed frontend adoption.
- Inferring dashboard asset access from asset ownership instead of tenant
  branding relationship authorization.
- Collapsing branding display name into canonical tenant name.
- Treating missing or partial branding fallback as a UI convenience instead of
  a contract.
- Beginning delivery before capability matrix and design-system blockers are
  resolved.

## Layer 4 Handoff

A story may hand off to Task Breakdown only when:

- it has a value type and delivery shape
- it has a clear job to be done
- acceptance criteria are concrete and verifiable
- dependency and seam obligations are recorded
- capability matrix posture is recorded
- proof layers and test families are assigned
- required artifact obligations are recorded
- architecture invention check is not blocked
- blockers are resolved or intentionally carried as non-delivery control work

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | control-story-fulfilled | Capability matrix first draft now covers the story and AC inventory. |
| S-001 | control-story-fulfilled | PRD first draft records feature boundary, fallback, replacement-only logo, dashboard surface, and lifecycle semantics. |
| S-002 | ready-for-task-breakdown | Design-system composition artifacts exist; browser canonicals, rendered verification, and adoption proof should become design-system tasks before app UI delivery. |
| S-003 | ready-for-task-breakdown | PRD, matrix, API contract, data dictionary, permission mapping, and blueprint define backend scope and dependencies. |
| S-004 | ready-for-task-breakdown | Asset alignment, API contract, data dictionary, runbook, permission mapping, and blueprint define logo relationship scope and dependencies. |
| S-005 | ready-for-task-breakdown | Projection contract, fallback decisions, authz mapping, and dashboard consumption scope are recorded. |
| S-006 | ready-for-task-breakdown | Permission mapping, audit/privacy note, lifecycle cleanup model, and PRD-derived tests are recorded. |
| S-007 | ready-for-task-breakdown | Depends on S-002 design-system signoff and backend stories; dependencies are explicit enough for Layer 4 task ordering. |
| S-008 | ready-for-task-breakdown | Depends on S-002 design-system signoff and S-005 projection; dependencies are explicit enough for Layer 4 task ordering. |
| S-009 | ready-for-task-breakdown | Layer 3 source-independent artifacts exist; implementation-time artifacts are recorded as delivery obligations. |
