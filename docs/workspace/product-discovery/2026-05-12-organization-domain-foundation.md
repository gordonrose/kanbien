# Product Discovery Packet: Organization Domain Foundation

## Status

- Discovery status: `ready-for-technical-steering`
- Draft posture: `governed-discovery`
- Original request: Start the feature loop for the organization domain foundation.
- Plain-language request summary: Build the first version of a customer/account organization structure foundation that root admins and tenant admins can use to create, manage, search, brand, and export organization records and their related structure.
- Packet date: 2026-05-12
- Owner / requester: Gordon
- Related product template: `docs/product-discovery/templates/generic-feature-template.md`
- Product template posture: `generic-template-used`
- Taxonomy version: `2026-05-03.1`
- Prior packet or feedback reference:
  - `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
  - `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft-notes.md`
  - `docs/workspace/implementation-blueprints/2026-05-11-organization-domain-foundation-capability-blueprint.md`

Canonical Layer 1 stop condition:

- Packet confidence is high enough for Technical Steering because the v1 product scope, actors, lifecycle posture, asset/export posture, and main deferrals are now explicit.
- Implementation is not approved by this packet. Technical Steering, PRD, capability matrix reconciliation, API contracts, data dictionaries, permission mapping, asset decision, job/cleanup decision, and PRD-derived test cases remain required before source implementation.

## Discovery Interview Summary

- Initial understanding shared with requester: The feature loop should define the Organization domain foundation before source implementation, beginning with who manages the records, how broad v1 should be, and which business behaviors must be in scope.
- Interview cadence: `one-question-at-a-time-followed`
- If interview cadence exception was approved, why: not applicable
- Coverage areas tracked internally: `see Universal Coverage Matrix and Triggered Overlay Coverage below`
- Assumptions confirmed by requester:
  - Root admins and tenant admins both manage organization-domain data from v1.
  - Tenant admins may manage all organization-domain records inside their own customer/account space.
  - Root admins use the same general experience but have access to more functionality and entities.
  - Organizations are created when an admin adds them; no default organization is automatically created.
  - Child organizations are allowed.
  - Organization hierarchy and business-unit hierarchy each have a max depth of 10 for v1.
  - Parent organization or parent business-unit archiving should offer either archive-whole-branch or move children elsewhere.
  - Locations are many per organization; head-office flags are descriptive booleans and not uniqueness-restricted.
  - Opening hours are optional and weekly-only for v1.
  - Memberships must link to real existing users/roles; placeholders are not allowed.
  - Integrations are high-level official records only in v1.
  - Branding includes actual logo uploads and public logo delivery.
  - Uploaded organization logos become public automatically once accepted as safe/usable.
  - Logo replacement updates public usage everywhere, with safety processing expected before the old logo is displaced.
  - Multiple logo types are required.
  - Legal details allow one active legal profile per organization in v1.
  - Reference catalogues are system-owned; tenant admins can use values, root admins can create/edit/archive/deprecate values.
  - Catalogue label updates apply everywhere immediately.
  - Used catalogue values are archived/deprecated or explicitly replaced with another value; they do not disappear silently.
  - Search/filter should cover the whole organization structure and return results separated by type.
  - Exports are in scope, section-selectable, background-job-backed, private, available for 24 hours or until deleted, and include actual logo image files.
  - Exports include all retained data, including active, archived, deprecated, and historical retained records.
  - Tenant admins may export all retained organization-domain data for their own customer/account.
  - Audit/change history is behind the scenes for v1, not admin-visible.
  - Import/bulk upload is out of scope for v1.
  - Admin UI should expose separate management areas rather than one giant Organization screen.
- Business questions explicitly signed off as deferred until later:
  - Special closures, holidays, seasonal opening hours, and temporary exceptions.
  - Deeper integration configuration, credentials, endpoints, webhook secrets, payload examples, and provider configuration.
  - Multiple active legal profiles per organization.
  - Import/bulk upload.
  - Public-facing non-logo organization pages.
  - Admin-visible audit-history UI.
- Technical questions packaged for technical stakeholder:
  - Exact feature split and feature names.
  - Domain manifest metadata/schema v2 adoption.
  - API route family shape for shared root/tenant experience.
  - Search/read-model/index strategy across many record types.
  - Public logo asset delivery model and scanning/verification pipeline.
  - Export bundle storage, job model, cleanup, and private download delivery.
  - Permission mapping and object-rule model for tenant admins across all organization-domain entities.
- Questions still blocking packet confidence: none at Product Discovery layer
- Scope cuts used to reach confidence:
  - No import/bulk upload.
  - Weekly opening hours only.
  - High-level integration records only.
  - One active legal profile per organization.
  - Behind-the-scenes audit history only.
- Confidence for chosen status: `96%; ready for Technical Steering`

## Discovery Complexity And Completion Gate

- Request complexity: `complex/foundational`
- Complexity rationale: The request creates a broad, reusable domain foundation with tenant-boundary behavior, root and tenant admin authority, public logo assets, private export bundles, background jobs, lifecycle/archive behavior, broad search, and governed admin UI implications.
- Draft-ready rationale: The main v1 product policies have been answered and remaining uncertainties are technical steering questions rather than business-owner questions.
- First-version path known: `yes`
- Deferred future support explored: `yes`
- Deferred future support summary: Import, deep integration configuration, special opening-hour exceptions, multiple active legal profiles, public non-logo organization pages, and visible audit-history UI are deferred with known direction.
- High-risk unknowns remain: `none at Product Discovery layer; technical risk flags listed for steering`
- Packet may proceed: `yes`

## Universal Coverage Matrix

| Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- |
| Goal and success outcome | answered | Admins can manage the full customer/account organization structure and export it when needed. | no |
| Primary users and actors | answered | Root admins and tenant admins both participate; root has broader access. | no |
| Normal first-version workflow | answered | Admin creates organizations and related records manually through separate management areas. | no |
| Authority and responsibility boundaries | answered | Tenant admins manage their own customer/account space; root admins oversee more entities/functions; catalogues are system-owned. | no |
| Data created, changed, viewed, retained, or deleted | answered | Organization records, legal details, locations, opening hours, units, memberships, integrations, branding/logos, catalogues, exports. | no |
| Lifecycle states and transitions | answered | Archive/reactivate expected; parent archive offers archive branch or move children. | no |
| Exceptions, reversals, and recovery | answered | Used catalogue values archive/deprecate or replace; failed logo replacement should preserve old logo until new one is usable. | no |
| Visibility, notifications, and user feedback | answered | Separate management areas; search results separated by type; audit history not user-visible in v1. | no |
| Security, privacy, audit, compliance, and abuse baseline | assumed-baseline | Tenant boundaries, audit evidence, private export delivery, public asset safety, and baseline compliance are required by repo policy. | no |
| Business policy decisions | answered | Key business rules confirmed in interview. | no |
| Configuration or customization | answered | System-owned catalogues editable by root; tenant-admin custom hierarchy levels allowed; max depths set to 10. | no |
| Billing, plan, quota, or entitlement impact | deferred-with-known-direction | No billing behavior requested for v1; quota may be technical for exports/assets. | no |
| Operational and support needs | assumed-baseline | Background export jobs, 24-hour cleanup, asset processing, and failure recording require operational posture. | no |
| Reporting, history, and evidence needs | answered | Export is in scope; audit is behind the scenes. | no |
| Compatibility with existing behavior | assumed-baseline | Existing tenant lifecycle and authz behavior must remain compatible. | no |
| Future extensibility pressure | answered | Several features are intentionally deferred but shaped. | no |
| Explicit out of scope | answered | Import, deep integration config, special opening-hour calendars, visible audit history, multiple active legal profiles. | no |
| Open blockers | not-applicable | No Product Discovery blockers remain; Technical Steering blockers expected. | no |

## Triggered Overlay Coverage

| Overlay | Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- | --- |
| access / authorization | actor classes and authority worlds | answered | Root admins and tenant admins both manage data; root has broader access. | no |
| access / authorization | root/operator versus tenant/account responsibilities | answered | Tenant admins manage all tenant-owned organization records; root also manages plus system catalogues. | no |
| access / authorization | current tenant context and cross-tenant deny posture | assumed-baseline | Tenant admins act only in their own customer/account space. | no |
| access / authorization | object/entity-level rule direction | answered | Parent/child relationships must stay in same tenant/account and validate hierarchy depth. | no |
| access / authorization | audit/history visibility and retention expectations | answered | Audit behind the scenes; not admin-visible v1. | no |
| tenant boundary | owning tenant context | answered | Organization-domain records are tenant/customer/account-scoped except system-owned catalogues. | no |
| tenant boundary | root/operator exception posture | answered | Root admins have broader oversight and catalogue management. | no |
| tenant boundary | tenant lifecycle impact | assumed-baseline | Organization behavior inherits tenant disabled/deleted baseline behavior. | no |
| frontend / UX | surface and management location | answered | Separate management areas rather than one giant screen. | no |
| frontend / UX | list size, search, comparison, and review needs | answered | Search/filter across all pieces; results separated by type. | no |
| frontend / UX | mistake recovery and confirmation needs | answered | Archive branch must be explicit; move children alternative required. | no |
| frontend / UX | governed design-system or frontend topology signal | assumed-baseline | App UI requires design-system governance before implementation. | no |
| user-managed assets | asset owner and consuming relationship | answered | Organization branding owns multiple public logo types per organization. | no |
| user-managed assets | allowed asset kinds and visibility | answered | Logo image assets are public-facing automatically after accepted upload. | no |
| user-managed assets | upload, replace, read, download, delete, and publish authority | answered | Authorized root/tenant admins upload; public delivery automatic; replacement updates everywhere. | no |
| user-managed assets | privacy, scanning, checksum, and verification assumptions | assumed-baseline | Required by repo asset gate before implementation. | no |
| user-managed assets | quota, cleanup, retention, export, and legal-hold expectations | answered | Exports include actual logo images; logo asset lifecycle requires asset decision. | no |
| data lifecycle and retention | archive, restore, and purge expectations | answered | Archive/reactivate in scope; used catalogue values archive/deprecate or replace. | no |
| data lifecycle and retention | retained history and user-visible history | answered | Exports include retained historical data; audit history is behind the scenes. | no |
| integration / API | generated contracts and machine-readable interfaces | assumed-baseline | API contracts required before implementation. | no |
| integration / API | external provider authority and fallback posture | deferred-with-known-direction | Deep integration provider configuration is future scope. | no |
| compliance / reporting | exportability and retention expectations | answered | Section-selectable export, all retained data, private download, 24-hour expiry or delete. | no |
| compliance / reporting | permission filtering and sensitive-field visibility | answered | Tenant admins export their own account; root admins broader; exports private only. | no |
| operations / support | retry, failure, cleanup posture | assumed-baseline | Export background jobs and asset processing require retry/failure recording. | no |

## Known Questions Gate

- Plain-language summary shown before drafting: We are defining the Organization domain foundation so requirements are clear before implementation.
- First one question asked before drafting: For the first version, who should manage organization records day to day: root admins, tenant admins, or both?
- Requester answered, corrected, or explicitly deferred first question: `yes`
- Known important product questions left unasked: `none`
- For each unasked business question, requester signoff for "deferred until later": `none`
- Technical questions not asked of business owner and packaged for technical stakeholder:
  - Exact schema, API, index, job, route, asset scanning, and generated artifact architecture.
- If any known question was not asked, why was it safe to defer or package: Technical implementation choices should be decided in Technical Steering.
- Packet status allowed: `yes`

## Change Routing

- Requested change type: core organization-domain platform foundation
- Secondary change types:
  - entity management
  - asset-backed feature
  - import / export
  - admin / operator tooling
  - settings / configuration
  - authentication / access
- Likely delivery path: `core-platform-pr`
- Routing confidence: `97%`
- Routing rationale: The request creates reusable platform behavior, durable entities, migrations, APIs, permissions, assets, jobs, exports, and governed admin UI.
- Config-first check: Not sufficient; this creates new durable domain capabilities.
- Tenant-specific extension check: Not tenant-specific; reusable cross-platform foundation.
- Core platform check: Required.
- Backlog item shape: Multi-epic foundation split into thin vertical/backend slices after Technical Steering, PRD, and task breakdown.
- Approval posture: Requires Technical Steering and artifact chain before implementation.
- Evidence expectation: Runtime, persistence, security, audit, compatibility, asset, job, export, and browser evidence depending on slice.
- Routing blockers: Technical Steering decisions and required artifacts.

## Product Intent

- Problem to solve: The platform needs an official organization structure foundation so customers/accounts can represent real business entities, locations, units, memberships, integrations, branding, and exports in a durable governed way.
- Business outcome: Root and tenant admins can maintain a trustworthy organization map that other features can later reference without inventing their own unstable structures.
- Primary user outcome: Admins can create, search, update, archive, brand, and export organization-domain data with clear tenant boundaries.
- Why now: Existing planning artifacts identify Organization as a foundational domain needed before downstream Discovery Intelligence, Build inspector, and account-structure features can safely rely on it.
- Success signal: Authorized admins can manage and export organization-domain records without cross-tenant leakage, unsafe asset behavior, or stale downstream artifacts.
- Non-goal summary: No import, deep integration secrets/configuration, special opening-hour calendars, visible audit-history UI, or multiple active legal profiles in v1.

## Taxonomy Classification

- Product feature type: `entity management; settings / configuration; import / export; asset-backed feature; admin / operator tooling`
- UX pattern(s): `searchable catalog; detail view; create/edit form; settings panel`
- Data ownership shape: tenant-scoped durable records with system-owned reference catalogues and public organization logo assets
- Surface / management location: root-admin and tenant-admin organization management areas
- Actor and permission shape: root admin full oversight, tenant admin full tenant-scoped management, root-only catalogue management, public logo read delivery
- Relationship shape: parent/child organization hierarchy, organization locations, business-unit hierarchy, memberships to real user/role records, branding asset relationships
- Reporting / read model shape: broad separated-by-type search plus private background export bundle
- Lifecycle shape: active/archive/reactivate style lifecycle with branch archive/move-child recovery, retained historical export
- Integration / externality shape: high-level integration records only; public asset delivery; private export bundle delivery
- Evidence / compliance sensitivity: high due to tenant boundaries, public assets, private exports, retained historical data, and audit needs
- New taxonomy value needed: no
- New taxonomy axis needed: no

## Feature Family / Product Template Fit

- Existing feature family: no single existing feature family fully owns this domain
- Reusable product template used: generic feature template
- Template overrides: Organization requires access, tenant boundary, asset, export, lifecycle, frontend, and operations overlays.
- New family or template needed: no new Product Discovery template required before Technical Steering, but Organization should become a durable product/domain family.
- Reuse rationale: Existing generic template plus overlays captures enough Product Discovery intent.
- Existing families/templates considered: tenant management, asset foundation, tenant branding, tenant auth, capability contract catalog
- Why rejected: Each covers one adjacent concern, but none owns the full organization-domain record structure.

## New Family Candidate

- New family candidate needed: yes
- Proposed family name: Organization Domain
- Business problem it exists to solve: Represent customer/account business structure in a stable, searchable, brandable, exportable, tenant-scoped model.
- Why existing taxonomy values/templates do not fit: This combines entity management, structure hierarchy, branding assets, exports, and cross-feature public seams.
- Reusable user/job pattern: Admin manages structured business records and relationships so other features can rely on them.
- Expected journeys: create/manage organizations, manage locations/hours, manage hierarchy/unit structures, manage memberships, manage integrations, manage branding/logos, search, export.
- Expected capability groups: create/read/update/archive/reactivate, relate/move, search/filter, upload/replace assets, export, catalogue governance.
- Expected actors / permissions: root admin, tenant admin, public logo reader, background export job.
- Expected data ownership shape: tenant-owned records plus system-owned catalogues and asset/export records.
- Expected relationship shape: tree structures and typed entity relationships.
- Expected reporting / read model shape: separated-by-type search and private export bundle.
- Expected lifecycle shape: active/archived/deprecated with retained history and cleanup for exports.
- Product-template candidate needed: not immediately; revisit after first implementation slice if the pattern repeats.
- Approval needed before requirements lock: Technical Steering must approve domain family boundaries and artifact chain.

## UX / Design-System Extension Signal

- Existing signed-off UX family appears sufficient: unknown
- Existing UX pattern likely needs extension: yes
- New UX pattern may be needed: possible for separated-by-type cross-domain search and branch archive/move-child flows
- Design-system extension may be needed: yes, before any governed app UI implementation
- Affected surfaces: root-admin and tenant-admin organization management areas, logo management, export request/status/download surface, catalogue management
- User workflow reason: Admins need focused separate areas but a consistent experience across root and tenant contexts.
- Product constraints: Root and tenant admins should share the same general experience while root sees more functionality/entities.
- Existing design-system references checked: not checked in Product Discovery; Technical Steering/design-system governance must inspect.
- Must stop before app UI implementation: yes
- Technical Steering / design-system questions:
  - Which signed-off list/detail/form/search/export patterns exist?
  - Does branch archive/move-child require a governed confirmation/reassignment pattern?
  - Does public logo management reuse asset-management governed seams?

## Users, Actors, And Context

- Primary actor: tenant admin
- Secondary actors: root admin, background export job, public logo reader
- Configuration / governance actors: root admin for system catalogues and broader platform oversight
- Support / root / operator actors: root admin; support/emergency posture to be decided in Technical Steering if needed
- System or external-provider actors: asset processor/storage, export job processor, cleanup job
- Affected modules / surfaces: organization management, location management, business unit management, memberships, integrations, branding/logos, catalogues, exports
- Root / tenant / public posture: tenant-scoped management; root oversight; public logo delivery only; private export delivery
- Permission-sensitive decisions still open: exact capability keys/grants and object rules
- Current context: admin is managing organization-domain data for a customer/account
- Trigger event: admin needs to add, correct, organize, brand, search, or export organization structure

## User Journey Flow

### Primary Journey

1. User starts from: a root-admin or tenant-admin organization management area.
2. User wants to: create or maintain organization-domain structure across separate management areas.
3. System helps by: offering scoped create/edit/archive/search/export/logo-management workflows with tenant-safe authority.
4. User completes when: the relevant records are saved, searchable, correctly related, optionally branded, and exportable.

### Alternate / Edge Journeys

- Admin archives a parent organization or business unit and chooses archive whole branch.
- Admin archives a parent organization or business unit and moves child records elsewhere.
- Admin replaces a logo; public logo updates everywhere after safe acceptance.
- Root admin deprecates a catalogue value or replaces it with another active value.
- Admin requests an export and waits for background processing.
- Admin deletes an export before the 24-hour expiry.

### Denied, Empty, Failed, Or Degraded States

- Empty: no organization exists until an admin adds one.
- Denied: tenant admin attempts another tenant/account's data.
- Denied: tenant admin attempts root-only catalogue management.
- Failed: logo upload fails safety/processing, old logo remains active.
- Failed: export job fails, failure is recorded and retry/recovery posture follows job decision.
- Degraded: export cleanup fails, failure is recorded for retry/operations.

## Job-To-Be-Done Bridge

### Actor Perspective Map

| Perspective | Actor | Product responsibility | Included? | Why / why not |
| --- | --- | --- | --- | --- |
| End user journey | tenant admin | manages organization structure inside own customer/account | yes | Primary day-to-day manager |
| Admin / configuration | root admin | manages broader platform view and system catalogues | yes | Root has more functionality/entities |
| Support / root / governance | root admin / support posture TBD | supports, audits, and governs sensitive behavior | yes | Required by scope and repo baseline |
| System / external provider | asset processor, export job, cleanup job | affects public logos, export bundles, and cleanup | yes | Product behavior depends on them |

### JTBD Statements

| JTBD ID | Actor perspective | User type | Needs to | So they can | Trigger / context | Success looks like |
| --- | --- | --- | --- | --- | --- | --- |
| JTBD-001 | end user journey | tenant admin | manage organization records, locations, units, memberships, integrations, branding, and exports | keep their customer/account structure accurate | customer/account structure changes | records are accurate, searchable, branded, and exportable |
| JTBD-002 | admin / configuration | root admin | manage the same experience with broader authority and root-only catalogues | oversee customers and keep system-owned options governed | platform setup or correction | root can manage without weakening tenant boundaries |
| JTBD-003 | system | export job | generate private selected-section export bundles | admins can download all retained structure data safely | admin requests export | export is ready, private, audited, expires after 24 hours or deletion |
| JTBD-004 | system | asset processor | verify and deliver public organization logos | public logo usage is safe and consistent | admin uploads/replaces logo | logo becomes public after accepted processing and replaces prior logo everywhere |

### Epic-Level Job Summary

- User type: root admin and tenant admin
- Needs to: manage the complete organization-domain structure
- So they can: keep customer/account business records trustworthy and reusable across the platform
- Current context: organization data is not yet a governed foundation
- Trigger event: customer/account needs official organization structure, branding, search, and export
- Desired outcome: complete v1 foundation planned for safe implementation
- Success looks like: clear product intent, technical steering handoff, and no implementation on stale or incomplete artifacts

### Current Satisfaction

They are currently happy with:

- Existing tenant/account concepts can anchor scope.
- Existing asset/job/authz foundations appear adjacent enough to reuse after steering.

They are currently unhappy with:

- No official organization-domain foundation exists.
- Downstream features would otherwise invent their own unstable organization structure.

### Proposed Product Idea

Their idea would:

- Add a full organization-domain management foundation with root/tenant admin access, public logo support, broad search, and private exports.

### Examples / Evidence

Examples involve:

- Customer/account has multiple organizations.
- Organizations can have child organizations.
- Organizations have locations, business units, memberships, integrations, branding, and export needs.

## Use Case Statements

| Use case | Derived from JTBD | User type | Action type | Goal | Example evidence | Product implication |
| --- | --- | --- | --- | --- | --- | --- |
| UC-001 | JTBD-001 | tenant admin | create/update/archive | Manage organization records and child organizations | Admin adds organizations manually; child orgs allowed | Organization hierarchy, depth validation, branch archive/move |
| UC-002 | JTBD-001 | tenant admin | create/update/archive | Manage locations and weekly opening hours | Many locations; weekly hours optional | Location and opening-hour records |
| UC-003 | JTBD-001 | tenant admin | create/update/archive | Manage business units and memberships | 10-level depth; real user/role records only | Unit hierarchy, cycle prevention, membership validation |
| UC-004 | JTBD-001 | tenant admin | upload/replace | Manage multiple public logo types | Public automatically; multiple logo types | Asset decision, logo type model, public delivery |
| UC-005 | JTBD-001 | tenant admin | search/filter | Search across all pieces separated by type | User requested all pieces, separated by type | Cross-domain search/read model |
| UC-006 | JTBD-001 | tenant admin | export | Export selected sections and all retained data | Background job, private, 24-hour expiry, actual images | Export job, bundle, private delivery, cleanup |
| UC-007 | JTBD-002 | root admin | govern | Manage system-owned catalogues | Tenant admins cannot edit; root can edit/archive/replace | Catalogue governance and compatibility |

## State-Based Journey Matrix

### State Inventory

| Entity / object | States considered | Notes |
| --- | --- | --- |
| Organization | active, archived, child/parent, no organization exists | Created manually; no default organization |
| Business unit | active, archived, parent/child | Max depth 10; branch archive or move children |
| Legal details | active, archived/replaced | One active profile per organization |
| Location | active, archived; opening hours present/absent | Opening hours optional |
| Catalogue value | active, archived/deprecated, replaced | Labels update everywhere immediately |
| Logo asset | pending upload, processing, accepted/public, rejected, replaced | Public only after accepted as usable |
| Export | requested, processing, ready, failed, expired, deleted | Private; 24-hour expiry or delete |
| Tenant/account | active, disabled/deleted baseline | Organization behavior inherits tenant baseline |

### Journey Permutations

| Journey ID | Actor | Actor state | Object | Object state | Action | Outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-STATE-001 | tenant admin | authorized current account | organization | none exists | create organization | first organization created manually | ready-for-signoff |
| JY-STATE-002 | tenant admin | authorized current account | parent organization | has child organizations | archive parent | choose archive branch or move children | ready-for-signoff |
| JY-STATE-003 | tenant admin | authorized current account | business unit | depth would exceed 10 | create/move child | denied with understandable validation | ready-for-signoff |
| JY-STATE-004 | tenant admin | authorized current account | membership | target user/role missing | create membership | denied; placeholders not allowed | ready-for-signoff |
| JY-STATE-005 | tenant admin | authorized current account | logo | new upload accepted | replace logo | public logo updates everywhere | ready-for-signoff |
| JY-STATE-006 | tenant admin | authorized current account | logo | new upload rejected | replace logo | old public logo remains | ready-for-signoff |
| JY-STATE-007 | root admin | root authorized | catalogue value | in use | remove value | archive/deprecate or explicit replacement | ready-for-signoff |
| JY-STATE-008 | tenant admin | authorized current account | export | ready | download export | private download until 24 hours or deletion | ready-for-signoff |

### State Transitions

| Transition ID | Actor | From state | To state | Object affected | Trigger | Expected outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | admin | no record | active | organization | create | tenant-scoped organization exists | ready-for-signoff |
| ST-002 | admin | active | archived | organization/business unit | archive branch | selected branch archived | ready-for-signoff |
| ST-003 | admin | active child under parent A | active child under parent B | organization/business unit | move children | child moves if depth/cycle rules pass | ready-for-signoff |
| ST-004 | root admin | active | archived/deprecated | catalogue value | deprecate | value hidden from new selection but historical records remain understandable | ready-for-signoff |
| ST-005 | root admin | active value A | active value B | catalogue usage | replace | references move to replacement value | ready-for-signoff |
| ST-006 | admin | previous logo public | replacement logo public | logo type | accepted replacement | new logo used everywhere | ready-for-signoff |
| ST-007 | export job | processing | ready | export bundle | job completes | private bundle includes selected sections and actual images | ready-for-signoff |
| ST-008 | cleanup job/admin | ready | expired/deleted | export bundle | 24-hour expiry or manual delete | private bundle removed, failure recorded if cleanup fails | ready-for-signoff |

## Context Variation And Unhappy Path Coverage

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
| Tenant admin attempts cross-account access | in-scope | no | Deny by default; technical details in authz steering |
| Root admin and tenant admin use same general experience | in-scope | no | Root sees more functionality/entities |
| Public logo delivery | in-scope | no | Requires asset decision before implementation |
| Private export delivery | in-scope | no | Requires job/file delivery decision before implementation |
| Export includes actual logo images | in-scope | no | Bundled private export |
| Import/bulk upload | out-of-scope | no | Explicitly deferred |
| Special/holiday opening hours | out-of-scope | no | Deferred for later iteration |
| Deep integration secrets/configuration | out-of-scope | no | Deferred for later iteration |
| Multiple active legal profiles | out-of-scope | no | Deferred for later iteration |
| Admin-visible audit history | out-of-scope | no | Behind-the-scenes audit only |

## Specialized Product Template / Checklist Reference

- Specialized template/checklist used: `generic-feature`
- Required because: no organization-domain-specific product template exists
- Checklist posture: `completed`
- Product answers imported into this packet: actor, journey, lifecycle, asset, export, tenant-boundary, and technical-handoff answers
- Deferred checklist items and reason: none at Product Discovery layer
- Reference: `docs/product-discovery/templates/generic-feature-template.md`

## Product Capability Breakdown

| Capability | Derived from JTBD/use case | Derived from state journey / transition | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Manage organizations | UC-001 | JY-STATE-001; JY-STATE-002; ST-001; ST-002; ST-003 | Admins maintain organization hierarchy | root admin; tenant admin | separate organization area | Max depth 10 |
| Manage legal details | UC-001 | State inventory | Admins maintain one active legal profile | root admin; tenant admin | legal details area | One active profile v1 |
| Manage locations | UC-002 | State inventory | Admins maintain many locations | root admin; tenant admin | locations area | Head-office flags not unique |
| Manage weekly opening hours | UC-002 | State inventory | Admins optionally add weekly hours | root admin; tenant admin | location hours area | No holidays/special closures v1 |
| Manage business units | UC-003 | JY-STATE-003; ST-002; ST-003 | Admins maintain unit hierarchy | root admin; tenant admin | business units area | Max depth 10; no cycles |
| Manage memberships | UC-003 | JY-STATE-004 | Admins link real users/roles to units | root admin; tenant admin | memberships area | No placeholders |
| Manage integrations | JTBD-001 | State inventory | Admins record high-level integrations | root admin; tenant admin | integrations area | No secrets/config v1 |
| Manage organization logos | UC-004 | JY-STATE-005; JY-STATE-006; ST-006 | Admins publish multiple logo types | root admin; tenant admin | branding/logos area | Public automatically after accepted upload |
| Manage reference catalogues | UC-007 | JY-STATE-007; ST-004; ST-005 | Root governs system options | root admin | catalogues area | Tenant admins read/use only |
| Search organization domain | UC-005 | State inventory | Admins find records across all pieces | root admin; tenant admin | search/results areas | Results separated by type |
| Export organization domain | UC-006 | JY-STATE-008; ST-007; ST-008 | Admins get private export bundles | root admin; tenant admin; export job | exports area | Selected sections, all data, actual images, 24-hour expiry |

## Business Questions Before Requirements Lock

| Question | Why it matters in plain language | Required before steering? | Current answer / owner | Deferred until later signed off by requester? |
| --- | --- | --- | --- | --- |
| Who manages organization data in v1? | Determines permissions and surfaces. | yes | Both root admins and tenant admins. | not-applicable |
| How broad is v1? | Determines whether this is only top-level orgs or full structure. | yes | The whole organization-domain structure. | not-applicable |
| Are public logos allowed? | Public delivery is normally denied by default unless approved. | yes | Yes, public automatically after accepted upload. | not-applicable |
| Are exports required? | Adds jobs, private files, cleanup, and audit. | yes | Yes, private background exports with 24-hour expiry or delete. | not-applicable |
| Should imports be included? | Would add larger parsing/error/recovery scope. | no | No, export only for now. | yes |
| Should audit history be visible to admins? | Determines UI and reporting scope. | no | No, behind the scenes is fine. | yes |

## Technical Questions For Technical Stakeholders

| Question | Plain-language context | Suggested technical owner | Blocks Technical Steering handoff? |
| --- | --- | --- | --- |
| Should the feature names stay domain-prefixed or use plural entity names? | The blueprint lists many feature folders; naming affects manifests, routes, and dependency graph. | Technical Steering / architecture | yes |
| Should feature manifests adopt domain/runtime-boundary metadata now? | The blueprint proposes schema v2-like metadata. | Architecture / repo governance | yes |
| What route-family shape supports the same root/tenant experience safely? | Root and tenant admins share workflows but authority differs. | Backend/API architecture | yes |
| What asset decision approves public logo delivery? | Logos become public automatically after safe upload. | Assets/security/privacy | yes |
| What export/job decision approves private export bundles with actual images? | Exports include all retained data and images, expire after 24 hours, and are private. | Job processing/assets/security | yes |
| What search/index/read-model strategy supports separated-by-type search across all pieces? | Search covers the whole organization domain. | Persistence/API architecture | yes |
| How should permissions and object rules be mapped for tenant admins across every organization-domain entity? | Tenant admins can manage all tenant-owned organization-domain records. | Platform authorization | yes |
| Which design-system seams exist for the required admin areas? | App UI cannot proceed before governed design-system adoption. | Frontend/design-system | yes |

## Explicitly Out Of Scope

- Import or bulk upload of organization structure.
- Deep integration configuration, credentials, endpoints, webhook secrets, payload examples, or provider-specific setup.
- Special closures, holidays, seasonal opening hours, and temporary exceptions.
- Multiple active legal profiles for branches, jurisdictions, or subsidiaries.
- Admin-visible audit-history UI.
- Bank accounts, pricing, service tiers, support tiers, entitlements, compliance assessments, and generic data-governance implementation inside Organization features.
- Letting tenant admins edit system-owned reference catalogues.
- Public export links.
- Placeholder users/roles in business-unit memberships.

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed | Owner / signoff |
| --- | --- | --- | --- | --- | --- |
| Shared admin experience | Root and tenant admins share the general experience; root sees more functionality/entities. | high | UI and route planning may split incorrectly. | no | confirmed |
| Public logo replacement | Replacement feels global, but old logo remains until new asset is accepted as safe. | high | Unsafe or failed uploads could break public logos. | no | confirmed with technical safety assumption |
| Export contents | Exports include all retained data and actual logo images. | high | Job/storage/security scope larger than expected. | no | confirmed |
| Search breadth | Search/filter spans all pieces, separated by result type. | high | Persistence/read-model scope may be underestimated. | no | confirmed |
| Catalogue label updates | Existing records display updated labels immediately by reference. | high | Historical label snapshots are not preserved by default. | no | confirmed |
| Tenant admin authority | Tenant admins can manage all organization-domain tenant-owned data. | high | Permission model must be broad but tenant-safe. | no | confirmed |
| Quotas | Asset/export quotas are technical/product policy details not answered here. | medium | Technical Steering may need quota decisions before implementation. | yes | technical owner |

## Discovery Feedback Loop

- Feedback status: `incorporated`
- First iteration reference: user interview in chat on 2026-05-12
- Feedback sources:
  - user interview: yes
  - support issue: no
  - analytics / usage signal: no
  - runtime defect: no
  - sales / stakeholder input: no
  - internal operator note: existing organization capability matrix and blueprint
- Feedback review date: 2026-05-12
- Decision owner: Gordon

| Feedback ID | Source | Observation | Affects JTBD / journey / capability / out-of-scope / assumption? | Decision | Follow-up |
| --- | --- | --- | --- | --- | --- |
| FDBK-001 | user interview | Both root and tenant admins manage organization-domain data. | actor, permission, journey | accept | Technical Steering permission mapping |
| FDBK-002 | user interview | V1 includes the whole structure, public logos, and private exports. | capability, overlays | accept | Asset and job decisions required |
| FDBK-003 | user interview | Import, special hours, deep integrations, visible audit UI, and multiple legal profiles are later. | out-of-scope | accept | Preserve in PRD non-goals |

## Discovery Revision Ledger

| Revision | Changed because | Product discovery impact | Downstream artifacts to revisit |
| --- | --- | --- | --- |
| R1 | Initial governed discovery packet created from interview and existing organization matrix/blueprint. | Establishes v1 product intent and Technical Steering handoff flags. | Technical Steering, PRD, capability matrix, API contracts, data dictionary, permission mapping, asset decision, job/cleanup decision, test cases, design-system governance |

## Technical Steering Handoff

- Product decisions locked:
  - v1 covers the full organization-domain foundation.
  - Both root admins and tenant admins manage organization-domain records.
  - Tenant admins manage all tenant-owned organization-domain records.
  - Root admins have broader access and system-owned catalogue management.
  - Organizations are manually created and may have child organizations.
  - Organization and business-unit hierarchies max at 10 levels.
  - Parent archive offers archive-whole-branch or move-children.
  - Locations are many; head-office flags are descriptive booleans.
  - Opening hours are optional weekly slots only.
  - Memberships require real user/role records.
  - Integrations are high-level official records only.
  - Branding includes multiple public logo types with automatic public delivery after accepted upload.
  - Reference catalogue labels update everywhere immediately; used values archive/deprecate or explicitly replace.
  - Search spans all pieces and returns separated result types.
  - Exports are private background jobs, section-selectable, include all retained data and actual images, expire after 24 hours or deletion.
  - Audit history is behind the scenes for v1.
- Business decisions intentionally deferred until later with requester signoff:
  - Import/bulk upload.
  - Special opening-hour calendars and exceptions.
  - Deep integration configuration/secrets.
  - Multiple active legal profiles.
  - Admin-visible audit-history UI.
- Technical questions packaged for technical stakeholder:
  - Feature naming/domain metadata, route family, search/index strategy, permission mapping, asset decision, export job/private delivery, design-system seams.
- Packet confidence for handoff: `96%`
- Scope cuts made to reach confidence:
  - Export yes, import no.
  - Logo public delivery yes, broader public pages no.
  - Weekly hours only.
  - High-level integrations only.
- Risk flags for Technical Steering:
  - permission-sensitive: yes
  - tenant-boundary: yes
  - state-based journey matrix: yes
  - governed frontend: yes
  - new UX pattern: possible
  - design-system extension: possible
  - asset/user file: yes
  - reporting/read model: yes
  - migration/persistence: yes
  - async/job: yes
  - external provider: no for v1 integrations; yes for storage/asset/job infrastructure
  - privacy/compliance: yes
- Recommended next artifact: Technical Steering packet for Organization Domain Foundation.
- Stop condition triggered: Source implementation remains blocked until Technical Steering and downstream artifact gates are satisfied.
