# Product Discovery Packet: Tenant Branding Configuration

## Status

- Discovery status: `ready-for-technical-steering`
- Draft posture: `governed-discovery`
- Original request:
  "i would like to add a tenant configuration screen to root-admin

  this can set tenant branding:
  * logo
  * tenant name
  * primary colour

  When a user belonging to that tenant logs into that tenant portal - those values are applied to their dashboard"
- Plain-language request summary:
  Add a root-admin tenant configuration screen where root admins set tenant
  branding: uploaded logo, branding/display name, and primary colour hex. When
  a user signs into that tenant portal, or reloads the tenant dashboard, those
  branding values apply to the dashboard.
- Packet date: 2026-04-29
- Owner / requester: requester
- Related product template: `docs/product-discovery/templates/generic-feature-template.md`
- Product template posture: `generic-template-used`
- Taxonomy version: `2026-04-29.3`
- Prior packet or feedback reference:
  `docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`

Canonical Layer 1 stop condition:

- This packet stops before PRD, capability matrix, Technical Steering plan,
  implementation blueprint, route, schema, persistence, migration, API
  contract, data dictionary, permission mapping, verification design, or
  product code.
- The request fits existing settings/configuration, admin/operator tooling,
  asset-backed feature, and governed frontend families. No new Product
  Discovery taxonomy value or product template is needed.
- State-based journey coverage is included because the request is
  tenant-boundary, permission-sensitive, configuration-driven, asset-backed,
  and visible after login/reload.

## Discovery Interview Summary

- Initial understanding shared with requester:
  The requester wants root admins to configure branding for each tenant, then
  have tenant users see that branding applied to their tenant dashboard after
  login.
- Question groups covered:
  - product intent: root-admin managed tenant branding for tenant dashboard
    presentation.
  - actors and governance: root admins configure; tenant users consume.
  - journeys and jobs: root admin uploads logo and sets branding values; tenant
    user signs in or reloads and sees tenant branding.
  - important situations and state changes: branding changed while users are
    active; next login/reload applies the change.
  - context variation: logo upload versus URL/reference, display name versus
    canonical tenant name, primary colour scope, editor authority, update
    timing.
  - unhappy paths: logo upload rejected, invalid colour, missing branding
    values, tenant user without branding configured.
  - scope boundaries: no tenant-admin self-service in v1; no live theme push
    to already-open dashboards.
  - Technical Steering deferrals: exact route/schema, session projection,
    asset-linking flow, dashboard theming integration, audit event details,
    and design-system adoption path.
- Assumptions confirmed by requester:
  Logo is uploaded as a managed file. Tenant name is a separate
  branding/display name rather than the canonical tenant record name. Primary
  colour is a hex value consumed by the existing design-system colour system.
  Root admins are the only v1 editors. Branding changes apply after next login
  or page reload, not as live updates to active pages.
- Assumptions explicitly deferred:
  Exact default branding fallback when a value is unset; exact root-admin
  screen placement; exact tenant dashboard surfaces that consume branding
  beyond the dashboard shell.
- Questions still blocking packet confidence: none.
- Questions safe to defer to Technical Steering:
  Which existing root-admin tenant detail or configuration surface should host
  the screen; how branding is projected into tenant session/dashboard payloads;
  whether the logo alt text is required from the root admin or derived from the
  branding display name by default.
- Confidence for chosen status: `high`

## Known Questions Gate

- Plain-language summary shown before drafting:
  Root admins configure tenant logo, branding/display name, and primary colour;
  tenant users see those values applied to the tenant dashboard after login or
  reload.
- First question set asked before drafting:
  Logo upload versus URL/reference; branding name versus canonical tenant
  name; primary-colour scope; root-admin versus tenant-admin editors; immediate
  versus next-login/reload application timing.
- Requester answered, corrected, or explicitly deferred first question set:
  `yes`
- Known important product questions left unasked:
  none
- If any known question was not asked, why was it safe to defer:
  N/A
- Packet status allowed:
  `yes`

## Product Intent

- Problem to solve:
  Tenant users need a tenant portal that visibly reflects the tenant they are
  using, while root admins need a controlled place to manage that branding.
- Business outcome:
  The platform can support tenant-specific branded dashboard experiences
  without giving tenants direct self-service branding control in v1.
- Primary user outcome:
  A tenant user logs into the correct tenant and sees the tenant's configured
  logo, display name, and primary colour applied consistently to the
  dashboard.
- Why now:
  Tenant-facing login and dashboard experiences need tenant-specific visual
  identity as tenant portal behavior matures.
- Success signal:
  A root admin can set tenant branding once, and tenant users see the expected
  logo, branding display name, and primary colour after login or dashboard
  reload.
- Non-goal summary:
  Tenant-admin self-service branding, public logo delivery, generic asset
  library behavior, live theme updates without reload, multilingual branding,
  broad tenant portal theming, and marketing/public site branding are out of
  scope for v1.

## Taxonomy Classification

Reference: `docs/product-discovery/taxonomy.md`.

- Product feature type:
  `settings / configuration`, `asset-backed feature`, `admin / operator tooling`
- UX pattern(s):
  `settings panel`, `create/edit form`, `dashboard / report`
- Data ownership shape:
  `owns durable entity`, `reads another feature's durable entity`,
  `user-uploaded asset-backed`
- Surface / management location:
  `managed by root, surfaced to tenant`, `surfaced in one module, managed in another`
- Actor and permission shape:
  `root operator`, `tenant member`
- Relationship shape:
  `one-to-one owned child`, `polymorphic attachment / link`
- Reporting / read model shape:
  `exact record lookup`, `audit / history report`
- Lifecycle shape:
  `configuration changed`, `active / inactive`
- Integration / externality shape:
  `internal-only`, `user-managed file`
- Evidence / compliance sensitivity:
  `permission-sensitive`, `privacy-sensitive`, `audit-critical`,
  `user-visible runtime-sensitive`
- New taxonomy value needed: no
- New taxonomy axis needed: no

## Feature Family / Product Template Fit

- Existing feature family:
  Root-admin tenant management, tenant branding/configuration, assets, tenant
  dashboard theming, and design-system display settings.
- Reusable product template used:
  `generic-feature`
- Template overrides:
  Asset decision and tenant-boundary coverage are emphasized because the logo
  is a managed upload and the configured values cross from root-admin
  management into tenant-user dashboard display.
- New family or template needed: no
- Reuse rationale:
  Existing taxonomy values cover settings/configuration, admin tooling,
  asset-backed behavior, managed-by-root surfaced-to-tenant behavior, and
  configuration change lifecycle.
- Existing families/templates considered:
  `generic-feature`, `authentication-access`
- Why rejected:
  Authentication/access is adjacent because branding applies after login, but
  this feature is not itself a login or auth-method journey.

## New Family Candidate

- New family candidate needed: no
- Proposed family name: N/A
- Business problem it exists to solve: N/A
- Why existing taxonomy values/templates do not fit: N/A
- Reusable user/job pattern: N/A
- Expected journeys: N/A
- Expected capability groups: N/A
- Expected actors / permissions: N/A
- Expected data ownership shape: N/A
- Expected relationship shape: N/A
- Expected reporting / read model shape: N/A
- Expected lifecycle shape: N/A
- Product-template candidate needed: no
- Approval needed before requirements lock: no

## UX / Design-System Extension Signal

- Existing signed-off UX family appears sufficient:
  Partially. The requester says the design system already supports primary
  colour picking and derives look and feel from a hex value.
- Existing UX pattern likely needs extension:
  Possibly. Root-admin tenant configuration needs a governed form that combines
  logo upload, display-name editing, colour picking, preview/error states, and
  tenant-dashboard consumption.
- New UX pattern may be needed:
  Not clearly for Product Discovery, but Technical Steering/design-system
  governance must verify whether existing display-settings, upload, and
  dashboard shell families cover the required composition.
- Design-system extension may be needed:
  Possibly, if no signed-off root-admin configuration screen composition
  exists for image upload plus colour preview plus tenant-dashboard preview.
- Affected surfaces:
  Root-admin tenant configuration screen, tenant portal dashboard shell,
  tenant login/dashboard handoff payloads or projections, logo upload/read
  controls.
- User workflow reason:
  Root admins need confidence that the configured logo/name/colour will be the
  branding tenant users see.
- Product constraints:
  Use existing primary-colour behavior; do not add page-local app CSS for a
  governed app page; logo must use the approved tenant-logo asset decision.
- Existing design-system references checked:
  Requester-provided signal that primary-colour picking already exists;
  existing design-system display-settings reference pack references primary
  colour; tenant-logo asset decision exists.
- Must stop before app UI implementation:
  Yes. App UI must wait for Technical Steering/design-system governance to
  confirm consumable signed-off seams.
- Technical Steering / design-system questions:
  Which signed-off root-admin form and upload component owns this screen; which
  tenant dashboard shell seam consumes branding; how preview should behave; and
  whether logo alt/decorative posture is captured in the same form.

## Users, Actors, And Context

- Primary actor:
  Root admin configuring tenant branding.
- Secondary actors:
  Tenant users who see the configured branding after login or dashboard reload.
- Configuration / governance actors:
  Root admins only for v1.
- Support / root / operator actors:
  Root admins may need to inspect, correct, replace, or clear tenant branding.
- System or external-provider actors:
  Asset upload/storage system and tenant dashboard/session projection.
- Affected modules / surfaces:
  Root-admin tenant configuration, tenant dashboard, tenant login/session
  projection, design-system display settings, assets feature.
- Root / tenant / public posture:
  Branding is managed from root-admin for a selected tenant and surfaced only
  inside authenticated tenant portal/dashboard contexts in v1.
- Permission-sensitive decisions still open:
  Exact root-admin capability keys, audit visibility, and whether support roles
  can read or only root admins can manage.
- Current context:
  A tenant exists and root admin wants to set or update its user-facing brand.
- Trigger event:
  Tenant setup, tenant branding correction, rebrand, or logo replacement.

## User Journey Flow

### Primary Journey

1. User starts from:
   Root-admin tenant management or tenant detail/configuration.
2. User wants to:
   Set the tenant's dashboard-facing logo, branding display name, and primary
   colour.
3. System helps by:
   Providing a root-admin controlled form with logo upload, branding display
   name, primary colour hex selection, validation, preview or confirmation,
   and safe persistence.
4. User completes when:
   The tenant branding values are saved and become the values tenant users see
   after next login or dashboard reload.

### Alternate / Edge Journeys

- Root admin updates only one branding value and existing values remain stable.
- Root admin replaces an existing logo with a new uploaded logo.
- Root admin clears a logo only if the product later approves clear/remove
  semantics; otherwise replacement is the v1 path.
- Tenant user logs in after branding is configured and sees the new branding.
- Tenant user reloads an already-open dashboard and sees the new branding.
- Tenant user keeps an already-open dashboard without reloading and does not
  receive a live update in v1.

### Denied, Empty, Failed, Or Degraded States

- Non-root actor attempts to edit tenant branding and is denied.
- Root admin selects an invalid hex colour and receives validation feedback.
- Logo upload is rejected due to MIME type, size, sanitizer, readiness,
  tenant/subject mismatch, quota, or lifecycle state.
- Branding display name is empty and should be rejected rather than silently
  converted to null.
- Tenant has no configured branding and tenant dashboard uses approved platform
  fallback branding.
- Logo asset exists but is not ready or lacks required contextual alt text or
  decorative posture; it cannot be consumed as tenant logo until resolved.

## Job-To-Be-Done Bridge

### Actor Perspective Map

| Perspective | Actor | Product responsibility | Included? | Why / why not |
| --- | --- | --- | --- | --- |
| End user journey | Tenant user | completes the product journey | yes | Tenant users need to recognize the branded dashboard after login/reload. |
| Admin / configuration | Root admin | configures or governs rules | yes | Root admins are the only v1 editors. |
| Support / root / governance | Root admin | supports, overrides, audits, or governs | yes | Root must be able to correct branding and review changes. |
| System / external provider | Asset and dashboard/session systems | affects behavior, availability, or policy | yes | Asset readiness and dashboard projection determine what users see. |

### JTBD Statements

| JTBD ID | Actor perspective | User type | Needs to | So they can | Trigger / context | Success looks like |
| --- | --- | --- | --- | --- | --- | --- |
| JTBD-001 | admin / configuration | Root admin | set tenant-facing brand values | control the tenant dashboard identity | tenant setup or rebrand | saved branding values are ready for tenant dashboard use |
| JTBD-002 | end user journey | Tenant user | see the tenant's logo, display name, and primary colour after login/reload | trust they are in the intended tenant context | entering or reloading tenant dashboard | dashboard reflects configured tenant branding |
| JTBD-003 | support / root / governance | Root admin | replace or correct tenant branding safely | fix outdated, wrong, or broken branding | operational correction | changes are auditable and take effect on next login/reload |
| JTBD-004 | system / external provider | Asset/dashboard systems | enforce asset readiness and project branding values | prevent unsafe or stale branding display | logo upload/read or dashboard load | only valid, authorized branding values are served |

### Epic-Level Job Summary

- User type:
  Root admin configuring a tenant; tenant user consuming the tenant dashboard.
- Needs to:
  Configure and consume tenant-specific branding.
- So they can:
  Make the tenant portal feel tenant-specific while preserving root governance.
- Current context:
  Tenant dashboard exists or is planned, and design-system primary colour
  behavior already exists.
- Trigger event:
  Tenant setup, rebrand, correction, logo replacement, login, or dashboard
  reload.
- Desired outcome:
  Root-saved branding values become the dashboard-facing brand for that tenant.
- Success looks like:
  Tenant users see the configured logo, display name, and primary colour after
  next login/reload.

### Current Satisfaction

They are currently happy with:

- The design system already supports picking a primary colour and applying
  derived look-and-feel changes from a hex value.

They are currently unhappy with:

- Root-admin has no tenant configuration screen for tenant-facing branding.
- Tenant dashboard branding is not yet tenant-specific.

### Proposed Product Idea

Their idea would:

- Add root-admin tenant branding configuration.
- Capture uploaded logo, branding display name, and primary colour.
- Apply those values to the tenant dashboard after login or reload.

### Examples / Evidence

Examples involve:

- Root admin uploads a tenant logo, enters a branding display name, chooses a
  hex primary colour, saves, and a tenant member sees that branding on their
  dashboard after signing in.

## Use Case Statements

| Use case | Derived from JTBD | User type | Action type | Goal | Example evidence | Product implication |
| --- | --- | --- | --- | --- | --- | --- |
| UC-001 | JTBD-001 | Root admin | configure | Save tenant branding values | Root admin saves logo, display name, and primary colour | Needs root-admin configuration capability and validation |
| UC-002 | JTBD-002 | Tenant user | read/consume | See configured branding | Dashboard after login/reload reflects tenant branding | Needs tenant-dashboard branding read/projection |
| UC-003 | JTBD-003 | Root admin | update/correct | Replace incorrect branding | Root admin replaces outdated logo or colour | Needs auditable update and replacement semantics |
| UC-004 | JTBD-004 | System | validate/project | Serve only valid branding | Not-ready logo is not consumed | Needs asset readiness and fallback behavior |

## State-Based Journey Matrix

### State Inventory

| Entity / object | States considered | Notes |
| --- | --- | --- |
| Tenant | active, disabled, deleted | Branding is meaningful only for active tenant dashboard display in v1. |
| Tenant branding | missing, partially configured, configured, configuration changed | Missing/partial branding needs approved fallback behavior. |
| Logo asset | pending, ready, rejected, deleted, cleanup-pending | Only ready and consumer-valid logo assets can be used. |
| Root admin | authorized, unauthorized | Only authorized root admins can edit v1 branding. |
| Tenant user session/dashboard | before login, logged in, open dashboard, reloaded dashboard | Branding applies after login or reload, not live without reload. |

### Journey Permutations

| Journey ID | Actor | Actor state | Object | Object state | Action | Outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-STATE-001 | Root admin | authorized | Tenant branding | missing | Create branding | Branding saved for next tenant login/reload | ready-for-signoff |
| JY-STATE-002 | Root admin | authorized | Logo asset | pending or rejected | Save branding with logo | Save is blocked or logo omitted until asset is ready and valid | ready-for-signoff |
| JY-STATE-003 | Root admin | unauthorized | Tenant branding | any | Attempt edit | Edit is denied | ready-for-signoff |
| JY-STATE-004 | Tenant user | before login | Tenant branding | configured | Log in | Dashboard loads configured branding | ready-for-signoff |
| JY-STATE-005 | Tenant user | open dashboard | Tenant branding | configuration changed | Continue without reload | Existing page does not need live update in v1 | ready-for-signoff |
| JY-STATE-006 | Tenant user | open dashboard | Tenant branding | configuration changed | Reload dashboard | Dashboard applies updated branding | ready-for-signoff |
| JY-STATE-007 | Tenant user | logged in | Tenant branding | missing or partial | Load dashboard | Dashboard uses approved fallback values | defer-to-technical-steering |

### State Transitions

| Transition ID | Actor | From state | To state | Object affected | Trigger | Expected outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | Root admin | missing | configured | Tenant branding | Initial save | Branding becomes available for next login/reload | ready-for-signoff |
| ST-002 | Root admin | configured | configuration changed | Tenant branding | Save update | New values apply after next login/reload | ready-for-signoff |
| ST-003 | Root admin | old logo linked | replacement logo linked | Logo relationship | Replace logo | New ready asset becomes current; old bytes follow asset lifecycle | ready-for-signoff |
| ST-004 | Asset system | pending | ready | Logo asset | Upload verification completes | Asset can be consumed if relationship metadata is complete | ready-for-signoff |
| ST-005 | Asset system | pending | rejected | Logo asset | Verification/sanitizer fails | Logo cannot be used; root admin sees failure path | ready-for-signoff |

## Context Variation And Unhappy Path Coverage

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
| Root admin uploads logo file | in-scope | no | Existing tenant-branding logo asset decision covers the narrow upload use case, amended for root-admin management. |
| Root admin uses logo URL/reference instead of upload | out-of-scope | no | Requester chose managed upload. |
| Branding display name differs from canonical tenant name | in-scope | no | Confirmed by requester. |
| Primary colour is a hex value | in-scope | no | Must use existing design-system colour behavior. |
| Tenant admin edits branding | out-of-scope | no | Root admins only for v1. |
| Live update without login/reload | out-of-scope | no | Requester chose next login/page reload only. |
| Missing branding fallback | defer-to-technical-steering | no | Product intent can proceed; Technical Steering/PRD should define fallback. |
| Logo alt text/decorative posture | defer-to-technical-steering | no | Existing asset decision requires contextual accessibility metadata. |

## Specialized Product Template / Checklist Reference

- Specialized template/checklist used:
  None beyond generic feature template.
- Required because:
  N/A
- Checklist posture:
  `not-applicable`
- Product answers imported into this packet:
  N/A
- Deferred checklist items and reason:
  N/A
- Reference:
  N/A

## Product Capability Breakdown

| Capability | Derived from JTBD/use case | Derived from state journey / transition | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Configure tenant branding | JTBD-001 / UC-001 | JY-STATE-001, ST-001, ST-002 | Tenant has saved branding values | Root admin | Root-admin tenant configuration | Includes display name, primary colour, and current logo relationship. |
| Upload and link tenant logo | JTBD-001, JTBD-004 / UC-001, UC-004 | JY-STATE-002, ST-003, ST-004, ST-005 | Logo is safe and ready before use | Root admin and asset system | Root-admin tenant configuration | Must follow tenant-branding logo asset decision. |
| Consume tenant branding on dashboard | JTBD-002 / UC-002 | JY-STATE-004, JY-STATE-006 | Dashboard shows tenant brand | Tenant user | Tenant portal dashboard | Applies after login or page reload. |
| Govern branding access and audit | JTBD-003 / UC-003 | JY-STATE-003, ST-002, ST-003 | Changes are root-controlled and traceable | Root admin | Root-admin tenant configuration | Exact audit and permission keys deferred. |
| Fallback when branding is missing or invalid | JTBD-004 / UC-004 | JY-STATE-007 | Dashboard remains usable | Tenant user and system | Tenant dashboard | Exact fallback values deferred. |

## Business Questions Before Requirements Lock

| Question | Why it matters | Required before steering? | Current answer / owner |
| --- | --- | --- | --- |
| Should a missing logo/name/colour use platform defaults, tenant canonical name, or block dashboard branding? | Defines fallback behavior and user-visible empty states. | no | Defer to Technical Steering/PRD; likely platform defaults plus canonical tenant name fallback. |
| Is logo alt text entered explicitly, derived from branding display name, or can the logo be marked decorative? | Existing asset decision requires contextual accessibility metadata before logo consumption. | no | Defer to Technical Steering/PRD. |
| Where exactly does the root-admin tenant branding screen live? | Affects frontend topology and design-system adoption. | no | Defer to Technical Steering/design-system governance. |
| Does dashboard branding apply to the dashboard shell only or every tenant portal surface later? | Controls v1 scope and prevents accidental broad theming. | no | V1 request says dashboard; broader portal theming is future. |

## Explicitly Out Of Scope

- Tenant-admin self-service branding.
- Logo URL/reference entry instead of upload.
- Public logo delivery or public CDN behavior.
- Generic asset library or file-hosting behavior.
- Documents, audio, video, or non-logo uploads.
- Live updates to already-open dashboards without reload.
- Marketing/public site branding.
- Full tenant portal theming beyond dashboard consumption.
- Route, schema, migration, API contract, or design-system implementation.

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed |
| --- | --- | --- | --- | --- |
| Branding display name | It is separate from canonical tenant name. | high | Could accidentally overwrite durable tenant identity. | no |
| Primary colour | Existing design-system hex primary-colour behavior is sufficient. | high | New design-system work may be larger than expected. | no |
| Logo upload | Managed upload is in scope, not external URL. | high | Asset/security planning changes if URLs are allowed. | no |
| Editor | Root admins only in v1. | high | Permissions and surface change if tenant admins edit later. | no |
| Application timing | Next login or page reload only. | high | Live update infrastructure would otherwise be implied. | no |
| Dashboard fallback | Missing/invalid branding uses approved fallback values. | medium | Bad fallback could confuse users or hide broken branding. | yes, in PRD/Technical Steering |

## Discovery Feedback Loop

- Feedback status:
  `incorporated`
- First iteration reference:
  User conversation on 2026-04-29.
- Feedback sources:
  - user interview: root-admin tenant branding request and answers.
  - support issue: none.
  - analytics / usage signal: none.
  - runtime defect: none.
  - sales / stakeholder input: none.
  - internal operator note: none.
- Feedback review date: 2026-04-29
- Decision owner: requester / product owner

| Feedback ID | Source | Observation | Affects JTBD / journey / capability / out-of-scope / assumption? | Decision | Follow-up |
| --- | --- | --- | --- | --- | --- |
| FDBK-001 | user interview | Logo should be uploaded as a file. | capability, asset decision, scope | accept | Align tenant-logo asset decision for root-admin management. |
| FDBK-002 | user interview | Tenant name is a branding/display name. | product intent, assumption | accept | Keep canonical tenant name separate. |
| FDBK-003 | user interview | Primary colour is an existing design-system hex. | capability, design-system signal | accept | Reuse existing primary-colour behavior. |
| FDBK-004 | user interview | Root admins are the only editors. | actor/permission, scope | accept | Mark tenant-admin editing out of scope. |
| FDBK-005 | user interview | Branding applies on next login/page reload. | journey, state matrix, scope | accept | Mark live updates out of scope. |

## Discovery Revision Ledger

| Revision | Changed because | Product discovery impact | Downstream artifacts to revisit |
| --- | --- | --- | --- |
| R1 | Initial packet from requester interview | Product intent ready for Technical Steering | PRD, capability matrix, API contract, data dictionary, permission mapping, design-system adoption, asset decision, verification plan |

## Technical Steering Handoff

- Product decisions locked:
  V1 is root-admin managed tenant branding with uploaded logo, branding display
  name, and hex primary colour. Branding applies to tenant dashboard after next
  login or reload. Tenant-admin editing, logo URL/reference entry, public logo
  delivery, and live updates are out of scope.
- Product decisions intentionally deferred:
  Exact fallback branding values; exact root-admin screen placement; exact
  permission and audit keys; exact session/dashboard projection shape; exact
  logo alt text or decorative-posture UX; exact design-system composition.
- Risk flags for Technical Steering:
  - permission-sensitive: yes
  - tenant-boundary: yes
  - state-based journey matrix: included
  - governed frontend: yes
  - new UX pattern: possible but not proven
  - design-system extension: possible
  - asset/user file: yes
  - reporting/read model: no beyond exact lookup/audit history
  - migration/persistence: yes
  - async/job: possible for asset processing/cleanup only
  - external provider: no
  - privacy/compliance: yes
- Recommended next artifact:
  Technical Steering/PRD for root-admin managed tenant branding configuration,
  followed by capability matrix and design-system adoption decision.
- Stop condition triggered:
  Stop before implementation until PRD, asset decision alignment,
  design-system governance, API/persistence/permission planning, and test
  planning are completed.
