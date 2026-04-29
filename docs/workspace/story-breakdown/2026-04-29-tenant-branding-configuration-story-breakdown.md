# Story Breakdown: Tenant Branding Configuration

## Status

- Packet status:
  `draft`
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
  not created in this layer
- Related capability matrix:
  not created in this layer
- Related design-system, asset, ADR, or architecture artifacts:
  `docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`;
  `docs/architecture/guides/story-breakdown-test-design-guide.md`;
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
  contracts, permission mappings, and implementation blueprint remain
  downstream blockers
- Architecture invention check:
  `consumes-steering-only`
- Governed frontend seam posture:
  `missing-seam`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  asset relationship authorization, same-origin private delivery, SVG sanitizer
  readiness, contextual accessibility metadata, selected-tenant root writes,
  current-tenant dashboard reads, cross-tenant deny, lifecycle cleanup, audit
  events, durable fallback facts, and migration/index agreement must be proven
  before delivery
- Missing source-of-truth artifacts:
  PRD, capability matrix, API contract/OpenAPI/Postman artifacts, data
  dictionary entries, permission mappings, design-system behavior locks and
  references, implementation blueprint, feature manifest decisions, generated
  dependency graph refresh if new seams are introduced

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

| Story ID | Status | Value Type | Delivery Shape | Title | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | needs-capability-matrix | harness-value | docs-artifact | Capability matrix normalization | As the delivery harness, I need approved stories translated into capability rows so delivery cannot proceed from broad value statements. | harness | Approved capability rows cover every acceptance criterion and identify non-capability-backed criteria. | Blocks all delivery stories |
| S-001 | needs-prd-refinement | system-value | docs-artifact | Scope and fallback decision lock | As product and architecture governance, I need the owning feature boundary, screen placement, fallback values, logo clear behavior, dashboard surface scope, and old-logo lifecycle decisions locked. | product governance | Downstream contracts can describe exact behavior without inventing architecture during implementation. | Blocks S-003 through S-008 |
| S-002 | needs-prd-refinement | system-value | architecture-foundation | Governed design-system seam readiness | As frontend governance, I need signed-off design-system render, controller, style, and verification seams for the root-admin form and dashboard branding consumption. | design-system governance | App implementation can consume shared seams without app-page CSS or copied governed composition. | Blocks S-007 and S-008 |
| S-003 | needs-capability-matrix | user-value | backend | Root-admin branding configuration record | As a root admin, I need to read and save tenant branding display name and primary colour for exactly one selected tenant. | root admin | Durable tenant branding facts are stored, validated, permissioned, and auditable. | Depends on S-000 and S-001 |
| S-004 | needs-capability-matrix | user-value | backend | Tenant logo relationship management | As a root admin, I need to create, replace, and consume a current tenant logo relationship only when the asset is ready and consumer metadata is present. | root admin and asset system | Tenant branding owns the logo relationship while assets owns file safety, storage policy, and content delivery invariants. | Depends on S-000, S-001, and asset decision |
| S-005 | needs-capability-matrix | user-value | backend | Tenant dashboard branding projection | As a tenant user, I need the dashboard branding projection to return safe display name, primary colour, and logo content reference for my current tenant after login or reload. | tenant user | The dashboard consumes authorized tenant branding without live push behavior or cross-tenant leakage. | Depends on S-000, S-001, S-003, and S-004 |
| S-006 | needs-capability-matrix | system-value | backend | Authorization, audit, and lifecycle evidence | As platform governance, I need allow and deny decisions, audit events, lifecycle cleanup states, quota posture, and privacy exclusions recorded for branding and logo operations. | security, audit, and operations | Permission-sensitive and asset-sensitive behavior has durable evidence and retryable failure visibility. | Depends on S-000 and S-001 |
| S-007 | needs-capability-matrix | user-value | frontend | Root-admin governed branding screen | As a root admin, I need a governed root-admin surface for branding values, logo status, accessibility metadata, validation, and preview. | root admin | Root-admin users can manage branding through signed-off design-system seams. | Depends on S-002, S-003, S-004, and S-006 |
| S-008 | needs-capability-matrix | user-value | frontend | Tenant dashboard governed branding consumption | As a tenant user, I need the tenant dashboard shell to apply branding from the authenticated projection after login or reload with explicit fallback states. | tenant user | Tenant users see configured branding or approved fallback using signed-off dashboard seams. | Depends on S-002, S-005, and S-006 |
| S-009 | needs-capability-matrix | harness-value | standards-compliance | Maintained artifact conformance | As repo governance, I need API, data, permission, feature-manifest, dependency graph, design-system, asset, and test-case artifacts to reflect the approved story set before Task Breakdown. | repo governance | Downstream Task Breakdown starts from coherent source-independent artifacts. | Depends on S-000 through S-008 |

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
| B-001 | S-003 through S-008 | capability-matrix | No approved capability matrix exists for this steering scope. | Capability matrix covering all AC rows or explicit non-capability rationale. | Task Breakdown for delivery stories waits until matrix coverage exists. |
| B-002 | S-003 through S-008 | architecture-foundation | Owning feature boundary is not selected. | PRD decision for new tenantBranding feature versus tenantConfiguration extension and public seams. | Delivery story handoff waits until selected boundary is recorded. |
| B-003 | S-007 and S-008 | design-system-foundation | Governed frontend seams are not confirmed for app adoption. | Behavior locks, reference pack, canonical verification, and adoption path for both surfaces. | App UI story handoff waits until consumable seams exist or explicit exception is approved. |
| B-004 | S-004, S-005, S-006, S-008 | asset-decision | Existing asset decision is approved, but PRD must not change MIME, public delivery, scanning, checksum, or SVG assumptions without approval. | Asset alignment note confirming no changed assumptions or updated asset decision. | Asset-sensitive story handoff waits until alignment is recorded. |
| B-005 | S-003 through S-008 | permission-model | Exact capability keys and grants are not approved. | Permission mapping for root manage/read, tenant dashboard read, and asset capabilities. | Permission-sensitive story handoff waits until allow and deny rules are mapped. |
| B-006 | S-009 | artifact-drift | Downstream source-independent artifacts do not yet exist for the feature. | API/data/permission/design/test artifacts created through their owner workflows. | Task Breakdown waits on artifacts marked blocking by change-control requirements. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-001 | B-002; AC-S001-01 | Should v1 tenant branding be a new `tenantBranding` feature bundle or an extension of the existing tenant-configuration feature? | yes | requester approved conservative v1 default: create a new narrow `tenantBranding` feature bundle |
| Q-002 | B-001; AC-S001-02; AC-S005-02; AC-S008-02 | What exact fallback values should the dashboard use for missing display name, missing primary colour, missing logo, consumer-not-ready logo metadata, and cross-tenant-denied logo reads? | yes | requester approved conservative v1 defaults: canonical tenant name for missing display name; platform default primary colour for missing or invalid colour; no logo for missing, not-ready, metadata-incomplete, or cross-tenant-denied logo reads |
| Q-003 | B-004; AC-S001-03; AC-S004-04 | Does v1 support clearing a tenant logo, or is replacement-only the approved behavior for the first release? | yes | requester approved conservative v1 default: replacement-only; explicit logo clearing is out of scope for v1 |
| Q-004 | B-004; AC-S004-02; AC-S007-02; AC-S008-01 | Is logo accessibility metadata entered by root admin, derived from branding display name, or recorded as an explicit decorative posture per logo relationship? | yes | requester approved conservative v1 default: root admin must provide explicit alt text or explicitly mark the logo decorative per tenant logo relationship |
| Q-005 | B-001; AC-S005-02; AC-S008-01 | Which tenant dashboard surfaces consume branding in v1: dashboard shell only, dashboard content header, login-to-dashboard handoff, or another named surface? | yes | requester approved conservative v1 default: dashboard shell only |
| Q-006 | B-003; AC-S002-01; AC-S002-02 | Do existing design-system seams cover root-admin branding configuration and tenant-dashboard consumption, or must a design-system foundation story be completed first? | yes | requester approved conservative v1 default: require a design-system foundation story first if existing signed-off seams are incomplete |
| Q-007 | B-005; AC-S006-01 | Which exact root-admin, tenant-dashboard, and assets capability keys and grant holders are approved for v1? | yes | requester approved conservative v1 default: use narrow tenant-branding capability keys proposed in this packet as planning names, then finalize exact grants in permission mapping before Task Breakdown |
| Q-008 | B-004; AC-S006-03 | Do failed-cleanup or pending logo records continue to count against tenant quota, actor limits, cost limits, and abuse limits while retry is pending? | yes | requester approved conservative v1 default: pending and failed-cleanup logo records continue to count against limits until cleanup succeeds or a later approved retention policy says otherwise |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| A-001 | S-001 | PRD | Create root-admin managed tenant branding PRD with scope, non-goals, fallback, feature boundary, lifecycle, and dashboard surface decisions. | PRD workflow | yes |
| A-002 | S-000 | capability matrix | Create tenant branding capability matrix rows for every AC or non-capability rationale. | capability matrix workflow | yes |
| A-003 | S-003; S-004; S-005 | API contract | Create root-admin read/save, logo relationship, asset content-read, and tenant-dashboard projection contracts. | api-contract-maintainer | yes |
| A-004 | S-003; S-004; S-005 | OpenAPI/Postman | Add maintained route artifacts after API contract decisions. | API artifact workflow | yes |
| A-005 | S-003; S-004; S-006 | data dictionary | Add branding fields, logo relationship metadata, accessibility metadata, audit/lifecycle fields, indexes, and soft-delete behavior. | data-dictionary-maintainer | yes |
| A-006 | S-006 | permission mapping | Add root-admin manage/read, tenant dashboard read, and required asset capability mappings with deny rules. | permission workflow | yes |
| A-007 | S-004; S-006 | asset decision alignment | Record whether the PRD preserves approved tenant-logo asset assumptions. | asset decision workflow | yes |
| A-008 | S-002; S-007; S-008 | design-system governance | Create behavior locks, references, canonical scenarios, verification checklist, and adoption artifact for governed surfaces. | frontend-design-system-loop-maintainer | yes |
| A-009 | S-003 through S-008 | implementation blueprint | Create blueprint only after PRD, matrix, API, data, authz, asset, and design decisions are coherent. | implementation-blueprint-maintainer | yes |
| A-010 | S-003 through S-008 | PRD-derived test cases | Create TC packet mapping actor, permission, state, object, value, validation, lifecycle, system-error, and NFR obligations. | prd-test-case-planner | yes |
| A-011 | S-003; S-004; S-005 | feature manifest | Create or refresh feature manifests for tenant branding and touched providers/consumers. | feature governance | yes if public seams change |
| A-012 | S-009 | generated dependency graph | Regenerate feature dependency graph after manifest or public seam changes. | generated artifact workflow | yes if manifests change |
| A-013 | S-006 | runbook/privacy note | Record cleanup failure retry, quota posture, forbidden logged fields, and operational visibility. | operational docs workflow | yes |

## Story Readiness Summary

- Ready stories:
  none
- Blocked stories:
  S-002 is blocked for app delivery until governed design-system seams are
  confirmed or an explicit exception is approved
- Stories needing capability matrix:
  S-000, S-003, S-004, S-005, S-006, S-007, S-008, S-009
- Stories needing PRD refinement:
  S-001, S-002, S-003, S-004, S-005, S-006, S-007, S-008
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
| S-000 | control-story-only | Capability matrix normalization is the required control story before delivery stories can advance. |
| S-001 | blocked | PRD decisions are required for feature boundary, fallback, clear/replacement, dashboard surface, and lifecycle semantics. |
| S-002 | blocked | Governed design-system seams are not confirmed for root-admin or dashboard app adoption. |
| S-003 | blocked | Needs PRD decisions, capability rows, API/data contracts, permission mapping, and persistence planning. |
| S-004 | blocked | Needs PRD decisions, capability rows, asset alignment, API/data contracts, and lifecycle planning. |
| S-005 | blocked | Needs projection contract, fallback decisions, authz mapping, and dashboard consumption scope. |
| S-006 | blocked | Needs permission mapping, audit event contract, privacy note, and lifecycle cleanup model. |
| S-007 | blocked | Needs signed-off design-system seams plus backend and permission contracts. |
| S-008 | blocked | Needs signed-off dashboard seams plus projection and logo authorization contracts. |
| S-009 | blocked | Artifact conformance depends on downstream PRD, matrix, API, data, permission, design-system, and test-case artifacts. |
