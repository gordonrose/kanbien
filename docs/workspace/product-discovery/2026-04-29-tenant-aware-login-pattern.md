# Product Discovery Packet: Tenant-Aware Login Pattern

## Status

- Discovery status: `ready-for-technical-steering`
- Draft posture: `draft-fast-path`
- Original request:
  "I want to create a reusable login pattern based on what root has - but that allows me to set what authentication is requird on a tenant by tenant basis.

  I want to be able to specify for example if it's email and password, or SSO. I also need email addresses validated, emails need to unique per tenant but can be shared across tenants. If a user logs in and they belong to more than one tenant they need to select the tenant and that will then take them on the auth journey that will get the to sign in in the tenant appropriate way."
- Plain-language request summary:
  Create a reusable tenant-facing login pattern, inspired by the root login pattern, where root configures allowed authentication methods per tenant. Users enter email, select a tenant when they belong to more than one, choose among that tenant's enabled auth methods, and complete the chosen journey. Email addresses are validated, unique within a tenant, and reusable across tenants.
- Packet date: 2026-04-29
- Owner / requester: requester
- Related product template: `docs/product-discovery/templates/authentication-access-template.md`
- Product template posture: `template-used-with-overrides`
- Taxonomy version: `2026-04-29.3`
- Prior packet or feedback reference: none

Canonical Layer 1 stop condition:

- This packet stops before PRD, capability matrix, Technical Steering plan, implementation blueprint, route, schema, persistence, migration, API contract, data dictionary, permission mapping, verification design, or product code.
- The request fits the existing `authentication / access` family and the specialized authentication/access template. No new-family candidate stop is required.
- State-based journey coverage is included because the request is authentication/access, tenant-boundary, permission-sensitive, lifecycle-heavy, and configuration-driven.
- Created as a draft discovery artifact; full repo guardrails and artifact sweeps were intentionally skipped.

## Discovery Interview Summary

- Initial understanding shared with requester:
  The requester wants tenant login to reuse the spirit of root login while adding tenant-specific auth configuration, multi-tenant selection, method choice, and safe handling of lifecycle/configuration changes.
- Question groups covered:
  - product intent: reusable tenant login, tenant-specific auth methods, per-tenant email uniqueness, shared email across tenants.
  - actors and governance: root configures tenant auth rules; tenant users complete login; external SSO providers may affect availability.
  - journeys and jobs: email entry, tenant selection, auth method choice, password login, SSO login, password reset, fallback when available.
  - state-based journey permutations: user logged in/out/deleted, tenant deleted/disabled, membership added/removed/changed, auth configuration changed, auth method disabled.
  - context variation: single-tenant user, multi-tenant user, multiple methods enabled, SSO unavailable, password reset in scope.
  - unhappy paths: generic no-match messaging, removed users, deleted/disabled tenants, disabled-method messaging, forced re-login.
  - scope boundaries: no product code or downstream planning artifacts.
  - Technical Steering deferrals: exact architecture, persistence, route/session behavior, provider handling, audit event model, and verification layers.
- Assumptions confirmed by requester:
  Root owns tenant auth configuration; tenants can have multiple enabled auth methods and users choose among them; no-match messaging is generic; password reset is in scope; SSO unavailable allows fallback if another method is enabled, otherwise blocks login; removed users cannot log in and logged-in removed users are immediately logged out with a message; newly added users can select the tenant on next login; membership changes are updated in flight; deleted/disabled tenants block login and log out active users with a message; auth configuration changes apply on next auth unless root/admin forces new login; disabled auth methods show a next-step message and redirect to login.
- Assumptions explicitly deferred:
  Exact technical mechanisms for session revocation, forced re-login, auth policy evaluation timing, provider integration, and audit logging.
- Questions still blocking packet confidence: none.
- Questions safe to defer to Technical Steering:
  How to implement root-owned configuration, force-login semantics, in-flight membership refresh, method disablement handling, and tenant deletion/disablement propagation.
- Confidence for chosen status: `high`

## Known Questions Gate

- Plain-language summary shown before drafting:
  Create a reusable tenant-facing login pattern where tenant-specific authentication methods, tenant selection, email uniqueness within a tenant, and lifecycle/configuration changes produce safe login outcomes.
- First one question asked before drafting:
  Historical packet predates the current one-question gate; discovery summary records the requester-confirmed tenant login scope.
- Requester answered, corrected, or explicitly deferred first question:
  `yes`
- Known important product questions left unasked:
  none for Layer 1 handoff
- For each unasked business question, requester signoff for "deferred until
  later":
  exact technical mechanisms for session revocation, forced re-login, policy evaluation timing, provider integration, and audit logging are deferred to Technical Steering.
- Technical questions not asked of business owner and packaged for technical
  stakeholder:
  root-owned configuration implementation, force-login semantics, in-flight membership refresh, disabled-method handling, and tenant deletion/disablement propagation.
- If any known question was not asked, why was it safe to defer or package:
  Remaining questions are technical implementation questions for Technical Steering, not Layer 1 product-intent blockers.
- Packet status allowed:
  `yes`

## Product Intent

- Problem to solve:
  Tenant users need a reusable login journey that respects tenant-specific auth rules without forcing one platform-wide auth method.
- Business outcome:
  The platform can support tenants with different authentication requirements while preserving tenant isolation, root governance, and privacy-safe login behavior.
- Primary user outcome:
  A tenant user can enter an email, resolve their tenant context, choose among approved auth methods for that tenant, and complete login or receive a safe unavailable/invalid outcome.
- Why now:
  Tenant login needs to mature from a single pattern into a reusable, configurable auth experience.
- Success signal:
  A single-tenant user reaches available auth choices for that tenant; a multi-tenant user selects the intended tenant first; fallback works when SSO is unavailable and another method is enabled; lifecycle/configuration changes produce safe logout, retry, or redirect behavior.
- Non-goal summary:
  This packet does not decide routes, schemas, persistence, session architecture, SSO protocol details, credential storage, design-system implementation, or test design.

## Taxonomy Classification

Reference: `docs/product-discovery/taxonomy.md`.

- Product feature type: `authentication / access`, `settings / configuration`, `onboarding / activation`
- UX pattern(s): `login / authentication flow`, `settings panel`, `wizard`
- Data ownership shape: `owns durable entity`, `reads another feature's durable entity`, `composes multiple feature entities`, `external / provider-sourced`
- Surface / management location: `surfaced in one module, managed in another`, `managed by root, surfaced to tenant`
- Actor and permission shape: `root operator`, `tenant member`, `unauthenticated public actor`, `system / job actor`
- Relationship shape: `many-to-many association`, `state machine`, `external reference`
- Reporting / read model shape: `exact record lookup`, `audit / history report`, `compliance / evidence report`
- Lifecycle shape: `active / inactive`, `enabled / disabled / suspended`, `invitation / onboarding`, `membership added / removed / role changed`, `configuration changed`
- Integration / externality shape: `internal-only`, `external provider call`, `third-party identity or permission dependency`
- Evidence / compliance sensitivity: `security-sensitive`, `permission-sensitive`, `privacy-sensitive`, `audit-critical`, `operationally critical`, `compliance evidence`, `user-visible runtime-sensitive`
- New taxonomy value needed: no
- New taxonomy axis needed: no

## Feature Family / Product Template Fit

- Existing feature family:
  Authentication/access, tenant auth policy, and root-governed tenant configuration.
- Reusable product template used:
  `authentication-access`
- Template overrides:
  The generic packet remains the packet structure, while auth-specific prompts supply login, auth method, SSO, password reset, membership, tenant, and configuration state coverage.
- New family or template needed: no
- Reuse rationale:
  The taxonomy already includes `authentication / access`, `login / authentication flow`, lifecycle/configuration values, and an authentication/access template.
- Existing families/templates considered:
  `authentication-access`, `generic-feature`
- Why rejected:
  Generic-only fit was rejected because the specialized auth template now fits better and requires state-based login coverage.

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
  Unknown. The request references the root login pattern, but this packet does not verify whether the root login is a signed-off reusable tenant-facing family.
- Existing UX pattern likely needs extension:
  Yes. Tenant selection, auth-method choice, disabled-method messaging, fallback, and forced re-login may extend the existing login pattern.
- New UX pattern may be needed:
  Possibly, if tenant selection plus method choice is not already governed.
- Design-system extension may be needed:
  Yes, as a handoff signal only.
- Affected surfaces:
  Tenant login, tenant selection, auth-method choice, password reset, SSO unavailable/fallback messaging, forced re-login messaging, root tenant-auth configuration.
- User workflow reason:
  The user must understand which tenant they are entering, which auth methods are allowed, and why a journey is blocked or restarted when lifecycle/configuration state changes.
- Product constraints:
  Use generic messaging for identity no-match states; avoid account enumeration; preserve exactly one current tenant context; show actionable messages for removed users, deleted/disabled tenants, disabled methods, and forced re-login.
- Existing design-system references checked:
  Not checked in Product Discovery beyond the requester-provided root-login reference.
- Must stop before app UI implementation:
  Yes. Technical Steering and design-system governance must decide whether existing login patterns can be reused or extended.
- Technical Steering / design-system questions:
  What governed flow owns tenant selection, method choice, unavailable fallback, disabled-method redirect, and forced re-login messaging?

## Users, Actors, And Context

- Primary actor:
  Tenant user attempting to sign in or continue an authenticated tenant session.
- Secondary actors:
  Root operator configuring tenant auth rules; external SSO provider affecting SSO availability.
- Configuration / governance actors:
  Root operator.
- Support / root / operator actors:
  Root operator configures, changes, and can force new login for tenant auth configuration changes.
- System or external-provider actors:
  Auth/session system, tenant/membership state evaluator, password reset delivery system, SSO provider.
- Affected modules / surfaces:
  Tenant login, tenant selection, tenant auth method choice, password reset, SSO handoff/return, root tenant configuration, active session continuation.
- Root / tenant / public posture:
  Public pre-auth entry resolves into exactly one tenant context; root governs tenant auth configuration.
- Permission-sensitive decisions still open:
  Exact root permission grants, audit visibility, and operational support wording.
- Current context:
  User begins unauthenticated or is already authenticated when state changes occur.
- Trigger event:
  User starts login, continues a session, or a user/tenant/membership/auth-configuration state changes.

## User Journey Flow

### Primary Journey

1. User starts from:
   Tenant-facing login entry.
2. User wants to:
   Sign into the correct tenant using one of that tenant's enabled authentication methods.
3. System helps by:
   Validating email format, resolving tenant memberships using generic no-match behavior, asking multi-tenant users to choose a tenant, showing enabled auth methods, and routing to the chosen method.
4. User completes when:
   They complete an enabled method and land in exactly one selected tenant context, or receive a safe blocked/unavailable outcome.

### Alternate / Edge Journeys

- Single-tenant user proceeds to that tenant's enabled method choices.
- Multi-tenant user selects tenant before choosing auth method.
- User chooses email/password and can use password reset.
- User chooses SSO; if SSO is unavailable, fallback is allowed only if another enabled method exists.
- User removed from tenant before login cannot log in.
- Logged-in user removed from tenant is immediately logged out with a message.
- User added to tenant can select that tenant on next login.
- User membership/role changes while logged in are updated in flight.
- Tenant deleted or disabled before login cannot be used for login.
- Logged-in user whose tenant is deleted or disabled is immediately logged out with a message.
- Auth configuration changes apply on next auth, unless root/admin forces new login.
- Auth method disabled during a login or password reset journey shows a next-step message and redirects to login.

### Denied, Empty, Failed, Or Degraded States

- Invalid email format.
- No matching user/tenant, presented generically.
- User removed, deleted, disabled, or not activated.
- Tenant deleted, disabled, or suspended.
- SSO unavailable or misconfigured.
- No fallback method enabled.
- Auth method disabled during journey.
- Forced re-login due to configuration change.

## Job-To-Be-Done Bridge

### Actor Perspective Map

| Perspective | Actor | Product responsibility | Included? | Why / why not |
| --- | --- | --- | --- | --- |
| End user journey | Tenant user | completes the product journey | yes | The user must sign in to the intended tenant and handle state changes. |
| Admin / configuration | Root operator | configures or governs rules | yes | Root owns tenant auth configuration. |
| Support / root / governance | Root operator | supports, overrides, audits, or governs | yes | Root can force new login and must govern auth changes safely. |
| System / external provider | Auth/session system and SSO provider | affects behavior, availability, or policy | yes | Membership, tenant, session, password reset, and SSO states change user outcomes. |

### JTBD Statements

| JTBD ID | Actor perspective | User type | Needs to | So they can | Trigger / context | Success looks like |
| --- | --- | --- | --- | --- | --- | --- |
| JTBD-001 | end user journey | Tenant user | identify the intended tenant and choose an enabled auth method | access the correct tenant safely | starting login | user lands in one selected tenant context or sees a safe blocked state |
| JTBD-002 | admin / configuration | Root operator | configure tenant auth methods | enforce the tenant's access posture | tenant setup or policy change | users see only approved methods on next auth |
| JTBD-003 | support / root / governance | Root operator | force re-login when configuration changes require it | prevent stale auth state from continuing | configuration/security change | affected sessions return to login with clear messaging |
| JTBD-004 | system / external provider | Auth/session system or SSO provider | reflect lifecycle and provider state changes | keep access accurate and recoverable | user, tenant, membership, method, or provider state changes | login/session outcome matches current product state |

### Epic-Level Job Summary

- User type:
  Tenant user with zero, one, or many eligible tenant memberships.
- Needs to:
  Authenticate into exactly one tenant using an enabled method.
- So they can:
  Access the tenant product context without violating tenant policy or current lifecycle state.
- Current context:
  User is unauthenticated, logged in, logged out, removed, newly added, or affected by changed tenant/auth configuration.
- Trigger event:
  Login attempt, session continuation, membership change, tenant state change, auth configuration change, or provider outage.
- Desired outcome:
  The product gives a safe, accurate login/session outcome based on the current actor and object states.
- Success looks like:
  Valid users can proceed through approved methods; invalid, removed, blocked, or stale journeys are stopped with safe messaging.

### Current Satisfaction

They are currently happy with:

- The root login pattern is a useful reference.

They are currently unhappy with:

- Tenant login does not yet express root-owned per-tenant auth rules, method choice, multi-tenant selection, or state-change behavior.

### Proposed Product Idea

Their idea would:

- Reuse a familiar login pattern.
- Add tenant selection and auth-method choice.
- Keep email uniqueness tenant-scoped.
- Govern tenant auth via root configuration.
- Handle user, membership, tenant, provider, and configuration changes safely.

### Examples / Evidence

Examples involve:

- Tenant enables email/password.
- Tenant enables SSO.
- Tenant enables multiple methods and user chooses.
- Email exists across tenants.
- User is removed, added, or changed.
- Tenant is deleted/disabled.
- Auth method is disabled while a journey is in progress.

## Use Case Statements

| Use case | Derived from JTBD | User type | Action type | Goal | Example evidence | Product implication |
| --- | --- | --- | --- | --- | --- | --- |
| UC-001 | JTBD-001 | Tenant user | authenticate | Start login with email and reach eligible tenant choices | email validation and tenant selection request | Product needs tenant-aware identity resolution with generic no-match behavior. |
| UC-002 | JTBD-001 | Multi-tenant user | select | Choose the intended tenant | user belongs to more than one tenant | Product needs tenant selection before method choice. |
| UC-003 | JTBD-001 | Tenant user | choose | Choose among enabled methods | multiple with choice | Product needs auth method choice per tenant. |
| UC-004 | JTBD-001 | Tenant user | recover | Reset password when email/password is enabled | password reset is in scope | Product needs password reset journey tied to enabled method state. |
| UC-005 | JTBD-002 | Root operator | configure | Set tenant auth methods | root owns tenant configuration | Product needs root-owned auth configuration. |
| UC-006 | JTBD-003 | Root operator | force | Force new login after relevant configuration change | admin/root can force new login | Product needs forced re-login product behavior. |
| UC-007 | JTBD-004 | Auth/session system | enforce | Stop removed/deleted/disabled access | removed user, deleted tenant | Product needs session interruption and safe messaging. |
| UC-008 | JTBD-004 | SSO provider/auth system | degrade | Use fallback when SSO unavailable if possible | fallback if enabled otherwise block | Product needs provider-unavailable and fallback behavior. |

## State-Based Journey Matrix

Product posture values:

- `ready-for-signoff`
- `needs-product-answer`
- `defer-to-technical-steering`
- `out-of-scope`

### State Inventory

| Entity / object | States considered | Notes |
| --- | --- | --- |
| tenant user | not logged in, logged in, logged out, deleted, disabled, invited/not activated, added to tenant, removed from tenant, membership changed | User state affects login eligibility and active-session continuation. |
| tenant | active, deleted, disabled/suspended | Tenant state affects login and existing sessions. |
| tenant membership | absent, active, added, removed, role changed | Membership changes may affect tenant selection and active access. |
| auth configuration | active, changed before login, changed during login, changed after login, method disabled, force-login requested | Root-owned configuration drives method availability and re-auth. |
| auth method | email/password enabled, SSO enabled, multiple methods enabled, method disabled, no fallback enabled | Method state determines choice, fallback, and blocking. |
| SSO provider | available, unavailable, misconfigured, fails after method selection | Provider state determines fallback or block behavior. |
| password reset | not started, in progress, completed, method disabled during reset | Password reset is in scope for email/password. |

### Journey Permutations

| Journey ID | Actor | Actor state | Object | Object state | Action | Outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-STATE-001 | tenant user | not logged in | tenant membership | active in one tenant | enters valid email | user proceeds to enabled auth method choices for that tenant | ready-for-signoff |
| JY-STATE-002 | tenant user | not logged in | tenant memberships | active in multiple tenants | enters valid email | user selects tenant before method choice | ready-for-signoff |
| JY-STATE-003 | tenant user | not logged in | identity/tenant match | no match | enters email | user sees generic no-match outcome | ready-for-signoff |
| JY-STATE-004 | tenant user | not logged in | auth method | multiple enabled | selects tenant | user chooses among enabled methods | ready-for-signoff |
| JY-STATE-005 | tenant user | not logged in | SSO provider | unavailable and fallback enabled | selects SSO | user can choose another enabled fallback method | ready-for-signoff |
| JY-STATE-006 | tenant user | not logged in | SSO provider | unavailable and no fallback enabled | selects SSO | login is blocked for that tenant until an approved method is available | ready-for-signoff |
| JY-STATE-007 | tenant user | not logged in | password reset | email/password enabled | requests reset | password reset journey is available | ready-for-signoff |
| JY-STATE-008 | tenant user | not logged in | membership | removed before login | attempts login | user cannot log in | ready-for-signoff |
| JY-STATE-009 | tenant user | logged in | membership | removed | continues session | user is immediately logged out with a message | ready-for-signoff |
| JY-STATE-010 | tenant user | logged out | membership | added | starts next login | user can select newly available tenant | ready-for-signoff |
| JY-STATE-011 | tenant user | logged in | membership/role | changed | continues session | access state updates in flight | ready-for-signoff |
| JY-STATE-012 | tenant user | not logged in | tenant | deleted or disabled | attempts login | user cannot log in to that tenant | ready-for-signoff |
| JY-STATE-013 | tenant user | logged in | tenant | deleted or disabled | continues session | user is immediately logged out with a message | ready-for-signoff |
| JY-STATE-014 | tenant user | in login journey | auth configuration | changed during login | proceeds to next step | change applies on next auth unless force-login is requested | ready-for-signoff |
| JY-STATE-015 | tenant user | in login or password reset journey | auth method | disabled | proceeds to next step | user sees method-disabled message and is redirected to login | ready-for-signoff |
| JY-STATE-016 | tenant user | logged in | auth configuration | force-login requested | continues session | user is sent to login with a message | ready-for-signoff |

### State Transitions

| Transition ID | Actor | From state | To state | Object affected | Trigger | Expected outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | tenant user | created | logged out | user/session | account becomes eligible but no active session exists | user can start login when membership/auth state allows | ready-for-signoff |
| ST-002 | tenant user | logged in | logged out | session | user signs out or session ends | user returns to login for next access | ready-for-signoff |
| ST-003 | tenant user | logged in | deleted | user | user is deleted | user is immediately logged out with a message and cannot log in | ready-for-signoff |
| ST-004 | tenant user | absent from tenant | added to tenant | membership | root/system adds membership | tenant appears on next login | ready-for-signoff |
| ST-005 | tenant user | active in tenant | removed from tenant | membership | membership removed | active session is logged out; future login cannot select tenant | ready-for-signoff |
| ST-006 | tenant user | active role/membership | changed role/membership | membership | membership updated | access is updated in flight | ready-for-signoff |
| ST-007 | tenant | active | deleted/disabled | tenant | tenant lifecycle change | login blocked and active users logged out with message | ready-for-signoff |
| ST-008 | auth configuration | previous settings | changed settings | tenant auth configuration | root changes configuration | applied on next auth unless root/admin forces new login | ready-for-signoff |
| ST-009 | auth method | enabled | disabled | tenant auth method | root disables method | current journey shows disabled-method message and redirects to login | ready-for-signoff |
| ST-010 | SSO provider | available | unavailable | SSO method | provider unavailable/misconfigured | fallback if enabled, otherwise block login | ready-for-signoff |

## Context Variation And Unhappy Path Coverage

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
| Single-tenant user | in-scope | no | Proceeds to enabled method choices for that tenant. |
| Multi-tenant user | in-scope | no | Selects tenant before method choice. |
| Email exists across tenants | in-scope | no | Allowed; tenant selection disambiguates. |
| Duplicate email within tenant | in-scope | no | Disallowed by product rule. |
| No match for email | in-scope | no | Generic message. |
| Multiple methods enabled | in-scope | no | User chooses. |
| SSO unavailable with fallback | in-scope | no | User can use another enabled method. |
| SSO unavailable without fallback | in-scope | no | Login blocked. |
| Password reset | in-scope | no | In scope when email/password enabled. |
| User removed before login | in-scope | no | Cannot log in. |
| User removed/deleted while logged in | in-scope | no | Immediately logged out with message. |
| User added to tenant | in-scope | no | Can select on next login. |
| Membership changed while logged in | in-scope | no | Updated in flight. |
| Tenant deleted/disabled before login | in-scope | no | Cannot log in. |
| Tenant deleted/disabled while logged in | in-scope | no | Immediately logged out with message. |
| Auth configuration changed during login | in-scope | no | Applies on next auth unless force-login is triggered. |
| Auth method disabled during journey | in-scope | no | Message on next step and redirect to login. |

## Specialized Product Template / Checklist Reference

- Specialized template/checklist used:
  `docs/product-discovery/templates/authentication-access-template.md`
- Required because:
  The request is authentication/access, login/authentication flow, SSO, password authentication, tenant-aware sign-in, and auth policy configuration.
- Checklist posture: `completed`
- Product answers imported into this packet:
  Tenant membership shapes, no-match messaging, SSO unavailable/fallback behavior, password reset scope, user/membership/tenant/configuration states, and root-owned auth configuration.
- Deferred checklist items and reason:
  Exact technical handling of provider callbacks, session invalidation, and policy refresh timing is deferred to Technical Steering.
- Reference:
  Authentication/access template version reviewed against taxonomy `2026-04-29.3`.

## Product Capability Breakdown

Capabilities should be derived from use cases and state-based journey rows. Do not invent implementation tasks here.

| Capability | Derived from JTBD/use case | Derived from state journey / transition | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Validate login email and preserve generic no-match posture | UC-001 | JY-STATE-003 | User gets safe feedback without account enumeration | tenant user | login | Includes format validation and generic no-match. |
| Resolve tenant choices for an email | UC-001, UC-002 | JY-STATE-001, JY-STATE-002 | User can continue to the right tenant context | tenant user | login | Email is unique per tenant and reusable across tenants. |
| Select tenant before method choice | UC-002 | JY-STATE-002 | Multi-tenant user chooses intended tenant | tenant user | login | Ensures exactly one current tenant context. |
| Choose among enabled auth methods | UC-003 | JY-STATE-004 | User can pick an approved login route | tenant user | login | Multiple methods are allowed. |
| Complete email/password with reset support | UC-004 | JY-STATE-007 | User can recover password when password auth is enabled | tenant user | login/password reset | Reset is in scope. |
| Complete SSO with fallback/block behavior | UC-008 | JY-STATE-005, JY-STATE-006, ST-010 | User can fallback if allowed or is blocked if not | tenant user / SSO provider | login/SSO | Product-level provider unavailable behavior. |
| Configure tenant auth methods | UC-005 | ST-008, ST-009 | Root can govern allowed tenant auth methods | root operator | root tenant configuration | Root owns configuration. |
| Force new login after configuration change | UC-006 | JY-STATE-016, ST-008 | Affected users re-auth when required | root operator / tenant user | root config/login | Product says root/admin should have this ability. |
| Enforce removed/deleted/disabled access outcomes | UC-007 | JY-STATE-008, JY-STATE-009, JY-STATE-012, JY-STATE-013, ST-003, ST-005, ST-007 | Invalid access stops with safe messaging | tenant user / system | login/session | Covers user, membership, and tenant lifecycle. |
| Update membership changes in flight | UC-007 | JY-STATE-011, ST-006 | Active access reflects changed membership | tenant user / system | active session | Technical Steering decides exact refresh mechanism. |
| Handle disabled method during journey | UC-007 | JY-STATE-015, ST-009 | User sees disabled-method message and returns to login | tenant user | login/password reset | Applies to login and reset journeys. |

## Business Questions Before Requirements Lock

| Question | Why it matters | Required before steering? | Current answer / owner |
| --- | --- | --- | --- |
| Who configures tenant auth rules? | Defines governance and permission posture. | no | Answered: root. |
| Can tenants have multiple auth methods? | Defines method choice journey. | no | Answered: multiple with user choice. |
| What no-match message should be shown? | Affects privacy/account enumeration. | no | Answered: generic. |
| Is password reset in scope? | Completes email/password journey. | no | Answered: yes. |
| What happens when SSO is unavailable? | Defines fallback/block behavior. | no | Answered: fallback if enabled, otherwise block. |
| What happens when users are removed/deleted/changed? | Defines lifecycle outcomes. | no | Answered: cannot log in, immediate logout with message, added users can select on next login, changed memberships update in flight. |
| What happens when tenants/configuration/settings change? | Defines tenant/config lifecycle outcomes. | no | Answered: deleted/disabled tenants block login and log out active users; config applies next auth unless force-login; disabled method redirects to login with message. |

## Explicitly Out Of Scope

- Product code.
- PRDs.
- Capability matrices.
- Technical Steering plans.
- Implementation blueprints.
- Route, schema, migration, persistence, session, token, credential, provider, or queue design.
- API contracts, data dictionaries, permission mappings, and test plans.
- Design-system implementation or approval.

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed |
| --- | --- | --- | --- | --- |
| Root pattern reuse | Root login is a product reference, not an instruction to copy implementation. | medium | Tenant UI/security may be over-constrained by root implementation. | yes |
| Root-owned configuration | Root configures tenant auth rules. | high | Wrong actor would change permissions and surfaces. | no |
| Multiple methods | Tenant can enable multiple methods and user chooses. | high | Wrong assumption would simplify or alter login flow. | no |
| Generic no-match | No matching identity/tenant uses generic messaging. | high | Wrong posture could leak account or tenant existence. | no |
| Password reset | Password reset is in scope for email/password. | high | Missing recovery would make password auth incomplete. | no |
| SSO fallback | SSO unavailable allows fallback if another method is enabled, otherwise blocks. | high | Wrong behavior could strand users or bypass tenant policy. | no |
| Removed/deleted users | Removed users cannot log in and active deleted/removed users are logged out with message. | high | Wrong behavior could preserve unauthorized access. | no |
| Added/changed membership | Added tenant appears next login; membership changes update in flight. | high | Wrong behavior could make access stale. | no |
| Tenant deleted/disabled | Login blocked and active users logged out with message. | high | Wrong behavior could preserve tenant access after shutdown. | no |
| Configuration changes | Apply on next auth unless force-login is triggered. | high | Wrong behavior could make changes too disruptive or too weak. | no |
| Design-system readiness | Existing root login may need governed extension for tenant selection, method choice, fallback, and forced-login messaging. | medium | App UI could drift if implemented before design-system governance. | yes |

## Discovery Feedback Loop

- Feedback status: `incorporated`
- First iteration reference: none
- Feedback sources:
  - user interview: original request plus clarification answers on 2026-04-29
  - support issue: none
  - analytics / usage signal: none
  - runtime defect: none
  - sales / stakeholder input: none
  - internal operator note: none
- Feedback review date: 2026-04-29
- Decision owner: requester/product owner

| Feedback ID | Source | Observation | Affects JTBD / journey / capability / out-of-scope / assumption? | Decision | Follow-up |
| --- | --- | --- | --- | --- | --- |
| FDBK-001 | original request | Tenant login must support tenant-specific methods, email validation, per-tenant uniqueness, cross-tenant email reuse, and tenant selection. | JTBD, journey, capability, assumption | accept | Captured in R1 packet. |
| FDBK-002 | user interview | Root owns configuration; multiple methods with choice; generic no-match; password reset; SSO fallback/block; user/membership/tenant/configuration state outcomes. | journey, state matrix, capability, business questions, assumptions | accept | Captured in state-based journey matrix and handoff. |

## Discovery Revision Ledger

| Revision | Changed because | Product discovery impact | Downstream artifacts to revisit |
| --- | --- | --- | --- |
| R1 | Initial packet from raw request and interview answers. | Establishes taxonomy classification, auth/access template fit, JTBD bridge, state-based journey matrix, use-case-to-capability trace, ambiguity ledger, UX signal, and Technical Steering handoff. | None yet; downstream artifacts intentionally not created. |

## Technical Steering Handoff

- Product decisions locked:
  Root configures tenant auth rules; tenant auth supports multiple enabled methods with user choice; email validation is required; email is unique per tenant and reusable across tenants; multi-tenant users select tenant before method choice; no-match messaging is generic; password reset is in scope; SSO fallback is allowed only if another method is enabled, otherwise login is blocked; removed users cannot log in; removed/deleted logged-in users are logged out with message; added users can select tenant on next login; membership changes update in flight; deleted/disabled tenants block login and log out active users; auth config changes apply next auth unless root/admin forces new login; disabled methods show a message and redirect to login.
- Product decisions intentionally deferred:
  Exact technical mechanisms for policy refresh, session invalidation, forced-login propagation, in-flight membership update, provider failure detection, audit/event wording, and design-system adoption.
- Risk flags for Technical Steering:
  - permission-sensitive: yes; root-owned tenant auth configuration and active-session access changes are authority-bearing.
  - tenant-boundary: yes; user must resolve exactly one current tenant context.
  - state-based journey matrix: completed.
  - governed frontend: yes; login, tenant selection, method choice, disabled-method messaging, fallback, and forced-login messaging may need governed UI.
  - new UX pattern: possible; tenant selection plus method choice may need a reusable pre-auth pattern.
  - design-system extension: possible; root login pattern may need tenant-facing extension.
  - asset/user file: no signal.
  - reporting/read model: yes; audit/support visibility likely needed.
  - migration/persistence: yes; durable auth, tenant, membership, policy, and uniqueness facts are implicated.
  - async/job: possible; password reset, provider callbacks, forced re-login, and session invalidation may involve async behavior.
  - external provider: yes; SSO provider dependency.
  - privacy/compliance: yes; generic no-match messaging, tenant membership disclosure, auditability, and access evidence matter.
