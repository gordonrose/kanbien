# Product Discovery Packet: Platform Authorization Model

Draft safety label:

- Created as a draft discovery artifact.
- Full repo guardrails and artifact sweeps were intentionally skipped.
- This packet is not validated, governed, complete, implementation-ready, or
  artifact-complete.

## Status

- Discovery status: `ready-for-technical-steering`
- Draft posture: `draft-fast-path`
- Original request: Start Layer 2 Technical Steering for Kanbien's durable
  platform authorization model, without runtime authz implementation or Layer 4
  task-type guardrail updates.
- Plain-language request summary: Kanbien needs a durable access model for a
  multi-tenant SaaS platform. The first implementation should stay simple with
  a tenant-level `adminOwner`, while the architecture must support later
  feature configuration, role, attribute, and relationship-based access rules.
- Packet date: 2026-05-04
- Owner / requester: Platform owner / requester
- Related product template: `docs/product-discovery/templates/authentication-access-template.md`
- Product template posture: `template-used-with-overrides`
- Taxonomy version: `2026-05-03.1`
- Prior packet or feedback reference: N/A

## Discovery Interview Summary

- Initial understanding shared with requester: The platform needs an
  authorization model before higher-pace feature work, preserving root and
  tenant boundaries while supporting future ABAC/ReBAC needs.
- Interview cadence: `one-question-at-a-time-followed`
- If interview cadence exception was approved, why: N/A
- Coverage areas tracked internally: see Universal Coverage Matrix and
  Triggered Overlay Coverage.
- Assumptions confirmed by requester:
  - v1 tenant authorization should be simple.
  - `adminOwner` is the first tenant admin role.
  - `adminOwner` has no tenant-specific divergence in v1.
  - Root/operator roles use a `root...` prefix.
  - Tenant/account admin roles use an `admin...` prefix.
  - Cross-tenant access denies by default except explicit root/operator
    support or emergency capabilities.
  - UI can expose only fully implemented, runtime-backed capabilities.
- Business questions explicitly signed off as deferred until later:
  - final ABAC attribute catalog
  - role-template versioning and upgrade policy
  - SSO/MFA assurance-level policy
  - formal emergency review queue
  - full lower-privilege tenant role catalog
  - exact API status and error contract
  - detailed retention duration values
- Technical questions packaged for technical stakeholder:
  - exact policy evaluator shape and seams
  - API response status codes and machine-readable reason code contract
  - role-template versioning strategy
  - retention/legal-hold enforcement model
  - authorization audit storage and event taxonomy
  - job authority implementation and audit propagation
- Questions still blocking packet confidence: none for Layer 1 handoff.
- Scope cuts used to reach confidence:
  - no runtime authz changes in this packet
  - no Layer 4 task-type guardrail updates
  - no tenant-created custom roles
  - no delegated support impersonation
  - no customer-visible root support access history for v1
- Confidence for chosen status: `95%; ready for Technical Steering as draft Layer 1 input`

## Discovery Complexity And Completion Gate

- Request complexity: `complex/foundational`
- Complexity rationale: The request affects authorization, tenant boundaries,
  billing/commercial controls, support access, emergency powers, audit,
  exports, system jobs, and future platform extensibility.
- Draft-ready rationale: The first-version behavior, authority boundaries,
  lifecycle posture, support/emergency model, grant-source posture, and future
  ABAC/ReBAC direction are known. Remaining items are architecture or later
  product refinements and are explicitly deferred.
- First-version path known: `yes`
- Deferred future support explored: `yes`
- Deferred future support summary: The model should support future ABAC,
  relationship-based access, role templates, configuration gates, and
  assurance-level policy, but v1 implements only globally consistent
  tenant-level `adminOwner` authority behind root-defined availability.
- High-risk unknowns remain: `none for Layer 1; see Technical Questions`
- Packet may proceed: `yes`

## Universal Coverage Matrix

| Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- |
| Goal and success outcome | answered | Define a durable authorization envelope for Technical Steering while keeping v1 simple. | no |
| Primary users and actors | answered | Root users, `rootAdmin`, tenant `adminOwner`, future tenant users, support/root operators, system jobs. | no |
| Normal first-version workflow | answered | Root creates/manages tenants and tenant admins; `adminOwner` manages day-to-day tenant account features within root-approved availability. | no |
| Authority and responsibility boundaries | answered | Root owns branding, tenant admin management, plans, pricing, tiers, entitlements, support, emergency powers; `adminOwner` owns day-to-day tenant operation. | no |
| Data created, changed, viewed, retained, or deleted | answered | Tenant data remains tenant-owned; logs/history/export are tenant-visible through approved layers; raw internals remain root-only. | no |
| Lifecycle states and transitions | answered | Operational lifecycle is draft/live/disabled/inactive; deletion posture is active/softDeleted/hardDeletePending/hardDeleted. | no |
| Exceptions, reversals, and recovery | answered | Inactive recovery is reason-dependent; softDeleted recovery is root-only; hard delete waits for retention and legal-hold gates. | no |
| Visibility, notifications, and user feedback | answered | Responsibility-based notifications and transition messaging; denial messages helpful when safe. | no |
| Security, privacy, audit, compliance, and abuse baseline | answered | Support/emergency access require reason/reference and internal audit; sensitive denial stays generic. | no |
| Business policy decisions | answered | v1 role scope, root/tenant split, support visibility, emergency powers, exports, lifecycle access. | no |
| Configuration or customization | answered | Root controls availability; `adminOwner` can activate/deactivate available flags/options. | no |
| Billing, plan, quota, or entitlement impact | answered | Root controls plans/pricing/tier limits; tenant admins manage payment details, billing contacts, usage, and allowed options. | no |
| Operational and support needs | answered | Root read-only support access allowed with explicit reason/reference and internal audit. | no |
| Reporting, history, and evidence needs | answered | Tenant admins can view/export tenant-facing activity, security/access history, and logs through approved reporting layers. | no |
| Compatibility with existing behavior | answered | Preserve current root/tenant boundary; do not fold root capabilities into tenant authz. | no |
| Future extensibility pressure | answered | ABAC/ReBAC, future lower-privilege roles, role templates, SSO/MFA assurance, scheduled changes reserved. | no |
| Explicit out of scope | answered | Tenant-created custom roles, tenant self-service tenant-admin management, delegated support impersonation, customer-visible root support history. | no |
| Open blockers | answered | No Layer 1 blockers; several technical decisions must be handled in Technical Steering. | no |

## Triggered Overlay Coverage

| Overlay | Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- | --- |
| access / authorization | actor classes and authority worlds | answered | Root/operator and tenant/account authority worlds stay distinct. | no |
| access / authorization | root/operator versus tenant/account responsibilities | answered | Root owns setup/commercial/control surfaces; `adminOwner` owns tenant day-to-day operation. | no |
| access / authorization | current tenant context and cross-tenant deny posture | answered | Exactly one active tenant context; tenant switching is explicit; cross-tenant denies by default. | no |
| access / authorization | role naming and role family direction | answered | Root roles use `root...`; tenant admin roles use `admin...`; first tenant role is `adminOwner`. | no |
| access / authorization | grant source posture and lifecycle | answered | UI can use only implemented and runtime-enforced capabilities; docs-only/planned grants are not selectable. | no |
| access / authorization | feature/configuration/flag gate posture | answered | Root controls availability; `adminOwner` toggles available options. | no |
| access / authorization | allow and deny proof expectations | deferred-with-known-direction | Stable internal reason codes and safe external messages should be designed in Technical Steering. | no |
| access / authorization | object/entity-level rule direction | deferred-with-known-direction | v1 no individual ownership transfer; future object rules reserved. | no |
| access / authorization | attribute-based rule direction | deferred-with-known-direction | Future attributes include company, department, team, location, shift, job title, clearance, skillset, plan, flags. | no |
| access / authorization | relationship-based rule direction | deferred-with-known-direction | Future families: owner/editor/viewer, member/manager, team/department. | no |
| access / authorization | support/operator access posture | answered | Root staff may view customer context read-only with reason/reference; changes happen through root-admin capabilities. | no |
| access / authorization | emergency or break-glass access posture | answered | `rootAdmin` has emergency powers with reason/reference and audit; no formal review queue in v1. | no |
| access / authorization | onboarding, offboarding, and role-change lifecycle | answered | Pending invites have no authority; access removal is immediate; ordinary permission changes can wait for refresh. | no |
| access / authorization | audit/history visibility and retention expectations | answered | Tenant admins see tenant activity/security history; root support-view history remains internal-only. | no |
| access / authorization | user-facing denial behavior | answered | Helpful when safe, generic when sensitive; tenant selection incomplete is distinct. | no |
| access / authorization | compatibility with current authn/authz behavior | answered | Preserve current root-user platform capability boundary. | no |
| tenant boundary | owning tenant context | answered | Tenant data and admin actions belong to one tenant context. | no |
| tenant boundary | actor current tenant context | answered | Multi-tenant admin switching must be explicit. | no |
| tenant boundary | cross-tenant deny rule | answered | Deny by default unless explicit root/operator capability. | no |
| tenant boundary | root/operator exception posture | answered | Read-only support and emergency/root-admin actions are explicit root exceptions. | no |
| tenant boundary | tenant admin visibility and management boundaries | answered | Tenant admin management remains root-only in v1. | no |
| tenant boundary | tenant lifecycle impact | answered | Operational lifecycle and deletion posture are separate concepts. | no |
| tenant boundary | tenant-scoped audit and reporting visibility | answered | Tenant admins can view/export tenant-facing logs; internal platform telemetry remains root-only. | no |
| billing / commercial model | plan, price, and tier ownership | answered | Root users own pricing, tiers, limits, and entitlements. | no |
| billing / commercial model | tenant-managed billing details | answered | `adminOwner` manages payment details and billing contacts. | no |
| billing / commercial model | entitlement and quota boundaries | answered | Root availability gate first; tenant activation within approved bounds. | no |
| billing / commercial model | usage measurement and customer-visible usage | answered | `adminOwner` can manage usage within root-defined limits; large exports can be cost-gated. | no |
| billing / commercial model | payment-data sensitivity and provider posture | assumed-baseline | Payment data protection is baseline; provider details belong downstream. | no |
| billing / commercial model | billing history, invoice visibility, and audit needs | answered | Tenant admins can access tenant billing/account history through approved reporting layers. | no |
| billing / commercial model | downgrade, cancellation, suspension, and failed-payment posture | answered | Graceful degrade by default; security/compliance can hard deny; payment failure grace then restricted mode. | no |
| billing / commercial model | compatibility with existing customer access | answered | Preserve data visibility/export where possible; avoid destructive surprise shutoffs. | no |
| configuration / feature flags | root-defined availability | answered | Root makes features/options available through plan, entitlement, or approval. | no |
| configuration / feature flags | tenant activation | answered | Once approved, `adminOwner` may turn options on/off without root approval each time. | no |
| configuration / feature flags | disruptive change timing | deferred-with-known-direction | Immediate by default; disruptive changes may later support scheduled effective time. | no |
| operations / support | support access reason/reference | answered | Explicit reason/reference required; support case preferred. | no |
| operations / support | support access duration | answered | Follows root login session time-bound rules for v1. | no |
| operations / support | root support mutation boundary | answered | Root staff cannot mutate from inside tenant context; changes use root-admin capabilities. | no |
| compliance / reporting | audit/evidence completeness | answered | Support/emergency/job actions require audit attribution and reason/policy source. | no |
| compliance / reporting | customer-visible versus operator-only evidence | answered | Tenant activity visible to tenant admins; root support viewing internal-only for v1. | no |
| data lifecycle and retention | hard-delete retention | answered | Hard delete blocked until configurable minimum retention policy is satisfied. | no |
| data lifecycle and retention | legal hold / export window | assumed-baseline | Legal hold and export/recovery windows should be handled downstream. | no |
| data lifecycle and retention | tenant export by lifecycle | answered | Draft/live/disabled/inactive can export; softDeleted is root-mediated; hardDeleted has no normal export. | no |
| integration / API | tenant selection incomplete | answered | Valid session without tenant selection should return distinct tenant selection not complete behavior. | no |
| integration / API | denial categories | deferred-with-known-direction | Exact API status/error contract belongs to Technical Steering/API contract work. | no |
| operations / support | system/job actor authority | answered | Jobs use explicit system authority and preserve initiating actor, tenant context, reason/policy source. | no |

## Known Questions Gate

- Plain-language summary shown before drafting: Yes. The requester was told
  the v1 implementation should stay simple while the architecture must support
  later detailed access rules.
- First one question asked before drafting: Whether the first version should be
  a simple customer admin or a more divided model based on team, department,
  ownership, or assigned responsibility.
- Requester answered, corrected, or explicitly deferred first question: `yes`
- Known important product questions left unasked: `none for Layer 1`
- For each unasked business question, requester signoff for "deferred until later": N/A
- Technical questions not asked of business owner and packaged for technical stakeholder: see Technical Questions.
- If any known question was not asked, why was it safe to defer or package:
  Remaining questions are technical implementation or broader platform policy
  questions, not required to understand product intent.
- Packet status allowed: `yes`

## Product Intent

- Problem to solve: Kanbien needs a durable authorization model before
  higher-pace multi-tenant feature development so access rules do not fragment
  across features.
- Business outcome: The platform can ship a simple v1 tenant admin model while
  retaining a clear path to richer access policies.
- Primary user outcome: Customer account admins can manage their account within
  root-approved bounds, while root staff retain platform/operator control.
- Why now: Current repo guidance already treats tenant context as a security
  boundary and has root authorization basics, but tenant authorization is not
  yet fully designed.
- Success signal: Technical Steering can define an approved authorization
  envelope that later PRDs, capability matrices, API contracts, and task
  breakdowns can consume.
- Non-goal summary: No runtime authorization changes, no Layer 4 guardrail
  updates, no root-admin traceability work, and no complete lower-privilege role
  catalog in this packet.

## Taxonomy Classification

- Product feature type: authentication / access; settings / configuration;
  admin / operator tooling
- UX pattern(s): settings panel; audit / history report; support/internal
  tooling
- Data ownership shape: composes tenant, auth/session, role/grant, audit,
  billing/config, and future feature data
- Surface / management location: root-managed platform controls surfaced partly
  to tenant; tenant-managed account controls surfaced to tenant admins
- Actor and permission shape: root operator; tenant admin; system/job actor;
  future tenant member; cross-tenant support/operator action
- Relationship shape: tenant-scoped account boundary now; future
  owner/editor/viewer, member/manager, team/department relationships
- Reporting / read model shape: audit/history report; compliance/evidence
  report; exportable tenant reports
- Lifecycle shape: tenant lifecycle; invitation/onboarding; membership
  added/removed/role changed; configuration changed; deleted/retained/purged
- Integration / externality shape: future API contract and payment/provider
  concerns; not implemented here
- Evidence / compliance sensitivity: high
- New taxonomy value needed: no
- New taxonomy axis needed: no

## Feature Family / Product Template Fit

- Existing feature family: tenant authentication/authorization foundation
- Reusable product template used:
  `docs/product-discovery/templates/authentication-access-template.md`
- Template overrides: Added new universal matrix and overlay coverage because
  this request is foundational.
- New family or template needed: no
- Reuse rationale: The request is primarily authentication/access and tenant
  boundary policy.
- Existing families/templates considered: generic feature template
- Why rejected: authentication/access template is more specific.

## UX / Design-System Extension Signal

- Existing signed-off UX family appears sufficient: not decided
- Existing UX pattern likely needs extension: likely later for tenant admin
  settings, audit/history, support access, export, and feature flag management
- New UX pattern may be needed: possible, but not part of this packet
- Design-system extension may be needed: possible later
- Affected surfaces: future tenant admin surfaces, root-admin support/emergency
  surfaces, audit/history/export views
- User workflow reason: Access and billing/config changes need clear recovery,
  warning, denial, and transition experiences.
- Product constraints: Do not implement app UI before governed design-system
  signoff where required.
- Existing design-system references checked: not applicable in draft fast path
- Must stop before app UI implementation: yes
- Technical Steering / design-system questions: Future UI surfaces must be
  classified separately before implementation.

## Users, Actors, And Context

- Primary actor: tenant `adminOwner`
- Secondary actors: future tenant lower-privilege users; affected tenant users
  who need notifications or transition guidance
- Configuration / governance actors: root users, especially `rootAdmin`
- Support / root / operator actors: root staff with read-only support access;
  `rootAdmin` with emergency powers
- System or external-provider actors: background jobs, billing/payment
  provider, scheduled retention/purge jobs, notifications
- Affected modules / surfaces: future tenant admin, root-admin, billing/config,
  feature flags, audit/history, exports, and authz policy evaluator
- Root / tenant / public posture: root and tenant authority worlds stay
  distinct; no public access implication except auth/session flows
- Permission-sensitive decisions still open: exact technical evaluator shape,
  exact API contract, role-template versioning, final ABAC catalog
- Current context: multi-tenant SaaS with root-user platform capabilities and
  tenant authentication basics
- Trigger event: Need durable authz model before higher-pace feature delivery

## User Journey Flow

### Primary Journey

1. Root user creates/manages a tenant and tenant admins.
2. Tenant admin completes setup and becomes `adminOwner`.
3. `adminOwner` operates inside exactly one active tenant context.
4. System checks tenant lifecycle, root-approved feature availability,
   `adminOwner` authority, and any future object/attribute/relationship rules.
5. User completes work when allowed actions succeed and denied actions provide
   safe, helpful recovery guidance.

### Alternate / Edge Journeys

- Root staff opens read-only support view with reason/reference.
- `rootAdmin` uses emergency power through explicit root-admin capability.
- Tenant becomes disabled, inactive, softDeleted, hardDeletePending, or
  hardDeleted.
- Tenant admin is invited, completes setup, is removed, or has access changed.
- Tenant exceeds plan/usage limits or loses entitlement.
- Background job runs on behalf of user, root, tenant, or policy source.

### Denied, Empty, Failed, Or Degraded States

- Tenant selection not complete.
- Tenant inactive or softDeleted.
- Feature not available under root-approved plan/entitlement.
- Tenant has not activated an available option.
- Missing role/capability.
- Future object/attribute/relationship rule denied.
- Sensitive denial requiring generic fallback.
- Disabled tenant read/export allowed but writes/new usage restricted.
- Over-limit usage degraded without destructive data loss where possible.

## Job-To-Be-Done Bridge

### Actor Perspective Map

| Perspective | Actor | Product responsibility | Included? | Why / why not |
| --- | --- | --- | --- | --- |
| End user journey | `adminOwner` | manages tenant day-to-day account and business features | yes | first implementation target |
| Admin / configuration | root user / `rootAdmin` | governs tenant setup, commercial package, tenant admins, emergency powers | yes | controls platform boundary |
| Support / root / governance | root staff | views tenant context read-only for support with reason/reference | yes | required support posture |
| System / external provider | jobs, billing/payment provider, policy source | executes async work and external billing/payment behavior | yes | affects lifecycle, access, and audit |

### JTBD Statements

| JTBD ID | Actor perspective | User type | Needs to | So they can | Trigger / context | Success looks like |
| --- | --- | --- | --- | --- | --- | --- |
| JTBD-001 | admin / configuration | root user | define and manage tenant setup and commercial availability | control platform obligations safely | tenant/customer setup or support | tenant boundaries and root-only powers are preserved |
| JTBD-002 | end user journey | tenant `adminOwner` | manage day-to-day tenant settings, usage, payment details, exports, and allowed options | operate their account without root involvement for routine work | account administration | allowed actions work in the current tenant and denied actions explain safe recovery |
| JTBD-003 | support / governance | root staff | view tenant context read-only with reason/reference | help customers without mutating tenant-owned data | support case or investigation | access is auditable and internal-only |
| JTBD-004 | system / provider | background job | run with explicit authority and preserved initiator context | complete exports, cleanup, billing, retention, and notifications safely | queued or scheduled work | audit shows executor, initiator, tenant context, and reason/policy source |

### Epic-Level Job Summary

- User type: platform owner
- Needs to: establish a durable authorization product model
- So they can: build tenant features faster without repeatedly redesigning
  access control
- Current context: root authz exists; tenant auth exists; broad tenant authz is
  not yet designed
- Trigger event: planning Layer 2 Technical Steering for authorization
- Desired outcome: approved architecture envelope
- Success looks like: later Layer 4 tasks can consume the model without
  inventing local policy

## Use Case Statements

| Use case | Derived from JTBD | User type | Action type | Goal | Example evidence | Product implication |
| --- | --- | --- | --- | --- | --- | --- |
| UC-001 | JTBD-001 | root user | configure/govern | manage root-owned tenant setup and commercial availability | root owns tenant branding, tenant admin management, plans, tiers | root capabilities remain distinct |
| UC-002 | JTBD-002 | `adminOwner` | manage | manage day-to-day tenant account features within approved availability | tenant toggles allowed flags/options | tenant config gate follows root availability gate |
| UC-003 | JTBD-002 | `adminOwner` | export | export tenant data/logs | "it's their data" | export supported across draft/live/disabled/inactive baseline |
| UC-004 | JTBD-003 | root staff | support view | view customer context read-only with reason/reference | support visibility internal-only | support access is root-scoped, not impersonation |
| UC-005 | JTBD-001 | `rootAdmin` | emergency action | use emergency power when needed | root admin needs emergency powers | explicit root capability, reason/reference, high-severity audit |
| UC-006 | JTBD-004 | system job | execute | continue or stop processing based on tenant lifecycle and purpose | disabled avoids disruption; inactive avoids cost processing | jobs are purpose-bound and lifecycle-aware |

## State-Based Journey Matrix

### State Inventory

| Entity / object | States considered | Notes |
| --- | --- | --- |
| tenant operational lifecycle | `draft`, `live`, `disabled`, `inactive` | Lifecycle answers whether the tenant may operate. |
| tenant deletion posture | `active`, `softDeleted`, `hardDeletePending`, `hardDeleted` | Deletion posture answers whether the tenant still exists for normal product purposes. |
| tenant admin | invited/pending, accepted/setup complete, removed/suspended | pending has no authority; removed/suspended access ends immediately. |
| support access | requested/open, ended by root session expiry | reason/reference required; no separate v1 support session duration. |
| emergency action | used/audited, reviewable later | formal review queue deferred. |
| capability/grant | documentation-only, seed-backed, corrective-migration-backed, runtime-enforced, blocked | UI requires runtime-enforced backing. |
| background job | queued/running/completed/failed/retried | must preserve system authority and initiating actor/policy source. |

### Journey Permutations

| Journey ID | Actor | Actor state | Object | Object state | Action | Outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-STATE-001 | `adminOwner` | active | tenant | draft | use account | allowed under strict rate/usage limits | ready-for-signoff |
| JY-STATE-002 | `adminOwner` | active | tenant | live | use account | allowed under plan/tier limits | ready-for-signoff |
| JY-STATE-003 | `adminOwner` | active | tenant | disabled | read/export | allowed; writes/new use restricted | ready-for-signoff |
| JY-STATE-004 | `adminOwner` | active | tenant | inactive | normal login/use | blocked, with reason-dependent recovery path | ready-for-signoff |
| JY-STATE-005 | root user | authorized | tenant deletion posture | softDeleted | recover/reactivate | root-only if policy allows | ready-for-signoff |
| JY-STATE-006 | root user | authorized | tenant deletion posture | hardDeleted | read/export tenant data | not available after purge except allowed retained evidence | ready-for-signoff |
| JY-STATE-007 | root staff | authorized | tenant | any posture except `hardDeleted` | support view | read-only with reason/reference and audit | ready-for-signoff |
| JY-STATE-008 | system job | authorized | tenant | inactive | normal cost-generating processing | blocked except recovery/retention/compliance/billing/cleanup needs | ready-for-signoff |

### State Transitions

| Transition ID | Actor | From state | To state | Object affected | Trigger | Expected outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | root user | tenant draft | live | tenant | billing/launch approval | plan/tier limits apply | ready-for-signoff |
| ST-002 | root user/system policy | live | disabled | tenant | commercial/support/admin reason | read/export allowed; writes/new usage restricted | ready-for-signoff |
| ST-003 | root user/system policy | live/disabled | inactive | tenant | reason-dependent inactivity | normal login blocked; recovery path depends on reason | ready-for-signoff |
| ST-004 | root user | active deletion posture | softDeleted | tenant | deletion action | tenant login blocked; normal data hidden; root-only recovery | ready-for-signoff |
| ST-005 | root user/system job | softDeleted | hardDeletePending | tenant data | retention and policy gates being checked | purge workflow starts only when policy allows | ready-for-signoff |
| ST-006 | system job | hardDeletePending | hardDeleted | tenant data | retention satisfied and no blockers | tenant-specific data removed | ready-for-signoff |
| ST-007 | root user | invited | active `adminOwner` | tenant admin | invite accepted and setup complete | authority begins | ready-for-signoff |
| ST-008 | root user | active `adminOwner` | removed/suspended | tenant admin | removal/suspension | sessions revoked immediately; history retained | ready-for-signoff |

## Context Variation And Unhappy Path Coverage

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
| Tenant session valid but tenant selection not complete | in-scope | no | Needs distinct denial/recovery response. |
| Cross-tenant object opened without switching tenant | in-scope | no | Deny safely; no silent tenant switch. |
| Feature available by plan but tenant has not activated it | in-scope | no | Tenant config gate denies with helpful recovery. |
| Feature no longer entitled after downgrade | in-scope | no | Preserve data, block new use, guide transition. |
| Root support view requested without reason/reference | in-scope | no | Deny support access. |
| Root emergency action | in-scope | no | Allowed with root capability, reason/reference, audit. |
| Documentation-only capability appears in UI | in-scope | no | Must not be selectable/usable. |
| Tenant admin asks for raw system logs | in-scope | no | Deny; use approved reporting layers only. |
| Large export processing cost | in-scope | no | May be cost-gated or queued. |
| Final ABAC catalog unknown | defer-to-technical-steering | no | Known direction, not fixed now. |
| Role-template versioning unknown | defer-to-technical-steering | no | v1 avoids divergence. |

## Specialized Product Template / Checklist Reference

- Specialized template/checklist used:
  `docs/product-discovery/templates/authentication-access-template.md`
- Required because: Request affects authorization, roles, tenant context,
  support access, emergency access, audit, and denial behavior.
- Checklist posture: `partially-completed`
- Product answers imported into this packet: actor/authority boundaries,
  lifecycle, support/emergency posture, role naming, future ABAC/ReBAC
  direction.
- Deferred checklist items and reason: Exact API contract, exact evaluator
  shape, and implementation proof belong to Technical Steering and downstream
  artifacts.
- Reference: N/A

## Product Capability Breakdown

| Capability | Derived from JTBD/use case | Derived from state journey / transition | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Root tenant setup governance | JTBD-001 / UC-001 | ST-001 | Tenants can be created/launched under root control | root user | root-admin | Includes branding, tenant admins, entitlements. |
| Tenant day-to-day administration | JTBD-002 / UC-002 | JY-STATE-001/002 | `adminOwner` manages allowed tenant settings and features | `adminOwner` | future tenant admin | Excludes tenant admin management in v1. |
| Tenant data and log export | JTBD-002 / UC-003 | JY-STATE-003/004 | Tenant can retrieve its data/logs across lifecycle states | `adminOwner` | future tenant admin | `softDeleted` export is root-mediated. |
| Root support read visibility | JTBD-003 / UC-004 | JY-STATE-007 | Root staff can help without mutating tenant data | root staff | root-admin/support | Reason/reference required. |
| Root emergency action | JTBD-001 / UC-005 | ST-002/003/004 | Root admin can act in emergency with proof | `rootAdmin` | root-admin | Formal review queue deferred. |
| Lifecycle-aware job execution | JTBD-004 / UC-006 | JY-STATE-008 | Jobs avoid active/costly work when tenant is inactive | system job | backend/system | Preserve initiator and policy source. |

## Business Questions Before Requirements Lock

| Question | Why it matters in plain language | Required before steering? | Current answer / owner | Deferred until later signed off by requester? |
| --- | --- | --- | --- | --- |
| Should v1 allow tenant-specific role divergence? | Custom tenant role variants create upgrade/versioning complexity. | no | No. `adminOwner` is globally consistent in v1. | no |
| Should root support access be visible to customers? | Customers seeing root staff activity changes trust/compliance posture. | no | No for v1; internal-only audit. | no |
| Should tenant admins manage other tenant admins? | This changes account control and lockout risk. | no | No for v1; root-only. | no |
| Should tenant admins see raw system logs? | Raw logs may expose platform internals or unrelated data. | no | No; approved reporting/export layers only. | no |
| Should final ABAC attribute catalog be decided now? | Locking it too early could distort future feature design. | no | No; defer with known direction. | yes |
| Should role-template versioning be decided now? | It touches broader platform upgrade policy. | no | No; v1 avoids divergence. | yes |
| Should formal emergency review workflow exist in v1? | Product-created review tasks add workflow and reporting scope. | no | No; audit is mandatory, formal queue deferred. | yes |

## Technical Questions For Technical Stakeholders

| Question | Plain-language context | Suggested technical owner | Blocks Technical Steering handoff? |
| --- | --- | --- | --- |
| What is the policy evaluator shape? | The product wants tenant boundary, config gate, RBAC, ABAC, and ReBAC in one explainable pipeline. | Technical Steering | yes |
| How are internal reason codes mapped to safe user messages? | Users need helpful recovery without leaking sensitive data. | API/authz architecture | yes |
| How are root support and emergency audit events modeled? | Root customer-context access needs internal proof. | Security/audit architecture | yes |
| How are role templates versioned later? | v1 avoids divergence, but future role template changes need upgrade policy. | Platform architecture | no |
| How are tenant lifecycle and deletion posture represented? | Product model separates operational lifecycle from deletion posture, with explicit inactive reasons and deletion gates. | Tenants/API architecture | yes |
| How are retention and legal hold enforced before hard delete? | Hard delete cannot happen before policy minimums. | Data lifecycle architecture | yes |
| How do jobs carry authority and initiator attribution? | Jobs must be auditable and lifecycle-aware. | Job/security architecture | yes |
| Which artifacts own grant source posture? | UI can only use fully implemented runtime-backed capabilities. | Capability catalog/authz architecture | yes |

## Explicitly Out Of Scope

- Runtime authorization implementation.
- Layer 4 task-type guardrail updates.
- Root-admin traceability work.
- Tenant-created custom roles.
- Tenant self-service tenant-admin management in v1.
- Delegated support impersonation.
- Customer-visible root support access history in v1.
- Raw system logs or internal telemetry for tenant admins.
- Full lower-privilege tenant role catalog.
- Final ABAC attribute catalog.
- SSO/MFA assurance policy.
- Formal emergency review queue.
- Exact API contract/status-code design.

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed | Owner / signoff |
| --- | --- | --- | --- | --- | --- |
| `adminOwner` authority | One globally consistent tenant-level role for v1. | high | Future v1 work may over-customize tenant roles. | no | confirmed |
| Root support visibility | Root staff can view customer context read-only with reason/reference. | high | Support workflows may need mutation paths; those must remain root-admin capabilities. | no | confirmed |
| Root emergency power | `rootAdmin` has emergency powers with audit and reason/reference. | high | Weak evidence if audit model is underspecified. | yes, technical | confirmed / technical owner |
| ABAC direction | Future attributes are supported as extension points, not fully cataloged now. | medium | Technical Steering could overfit or underfit extension model. | yes, technical | deferred by requester |
| Role-template versioning | Not needed for v1; no tenant divergence until broader policy. | medium | Future upgrades need separate architecture. | yes, technical | deferred by requester |
| Large exports | Tenants can export data; heavy exports may be cost-gated. | high | Cost model may need commercial detail. | later | confirmed |
| Tenant lifecycle | Product meanings are clear; technical representation is not final. | medium | Existing tenant status docs/code may need later update. | yes, technical | confirmed / technical owner |

## Discovery Feedback Loop

- Feedback status: `incorporated`
- First iteration reference: current interview
- Feedback sources:
  - user interview: primary
  - support issue: N/A
  - analytics / usage signal: N/A
  - runtime defect: N/A
  - sales / stakeholder input: N/A
  - internal operator note: N/A
- Feedback review date: 2026-05-04
- Decision owner: platform owner / requester

| Feedback ID | Source | Observation | Affects JTBD / journey / capability / out-of-scope / assumption? | Decision | Follow-up |
| --- | --- | --- | --- | --- | --- |
| FDBK-001 | user interview | Earlier discovery nearly stopped too soon. | discovery process | accept | Harness updated with completion gate before packet creation. |

## Discovery Revision Ledger

| Revision | Changed because | Product discovery impact | Downstream artifacts to revisit |
| --- | --- | --- | --- |
| R1 | Initial draft created from authz discovery interview. | Establishes Layer 1 product intent for platform authorization model. | Technical Steering packet, ADR/authz guide updates, API contracts, permission mappings, capability catalog posture. |

## Technical Steering Handoff

- Product decisions locked:
  - v1 `adminOwner` tenant role, globally consistent
  - root/tenant authority split
  - root-only tenant admin management and tenant branding in v1
  - root-owned pricing, tiers, limits, entitlements
  - tenant-admin-owned payment details, billing contacts, allowed flags/options,
    usage, tenant-visible exports/logs
  - support read-only access with reason/reference and internal audit
  - emergency root powers with reason/reference and internal audit
  - tenant lifecycle and deletion posture
  - UI eligibility requires runtime-backed implemented capabilities
- Business decisions intentionally deferred until later with requester signoff:
  - final ABAC catalog
  - role-template versioning/upgrade policy
  - SSO/MFA assurance policy
  - formal emergency review workflow
  - future lower-privilege role catalog
  - detailed retention duration values
- Technical questions packaged for technical stakeholder: yes
- Packet confidence for handoff: `95%`
- Scope cuts made to reach confidence: runtime implementation and downstream
  artifacts excluded; future role/ABAC/API details deferred.
- Risk flags for Technical Steering:
  - permission-sensitive: yes
  - tenant-boundary: yes
  - state-based journey matrix: yes
  - governed frontend: possible later
  - new UX pattern: possible later
  - design-system extension: possible later
  - asset/user file: no direct asset change
  - reporting/read model: yes
  - migration/persistence: yes, later
  - async/job: yes
  - external provider: billing/payment later
  - privacy/compliance: yes
- Recommended next artifact:
  `docs/workspace/technical-steering/2026-05-04-platform-authorization-model-steering.md`
- Stop condition triggered: ready for Technical Steering draft; do not begin
  runtime implementation from this packet alone.
