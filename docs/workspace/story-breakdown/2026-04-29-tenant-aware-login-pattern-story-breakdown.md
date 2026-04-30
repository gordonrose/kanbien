# Story Breakdown: Tenant-Aware Login Pattern

## Status

- Packet status:
  `blocked`
- Packet date:
  2026-04-29
- Epic ID:
  `EPIC-TENANT-AWARE-LOGIN-PATTERN`
- Epic title:
  Tenant-aware login pattern
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-04-29-tenant-aware-login-pattern.md`
- Source Technical Steering packet:
  `docs/workspace/technical-steering/2026-04-29-tenant-aware-login-pattern-steering.md`
- Related PRD:
  not created in this layer
- Related capability matrix:
  not created in this layer
- Related design-system, asset, ADR, or architecture artifacts:
  `docs/architecture/guides/story-breakdown-test-design-guide.md`; ADRs and
  auth/design-system guides named by Technical Steering for tenant auth,
  configuration, tokens, notification delivery, frontend topology, page-state
  replay, and governed app adoption
- Validation command:
  `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-04-29-tenant-aware-login-pattern-story-breakdown.md`
- Validation status:
  `pass`

## Handoff Validation

- Product Discovery status:
  `ready-for-technical-steering`
- Technical Steering status:
  `ready-for-layer-3-after-auth-and-design-system-governance`
- Steering non-goals preserved:
  no source code, no route contract, no schema, no provider integration, no
  session mechanism, no SSO platform, no app UI, no copied root-login markup,
  no PRD, no capability matrix, no Task Breakdown in this packet
- Steering stop conditions resolved or carried as blockers:
  requester asked for the remaining Layer 3 pass; PRD decisions, capability
  matrix coverage, auth/session architecture, SSO provider posture, design-
  system behavior locks, API/data contracts, permission mappings, audit model,
  and implementation blueprint remain downstream blockers
- Architecture invention check:
  `consumes-steering-only`
- Governed frontend seam posture:
  `missing-seam`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  high-sensitivity auth flow; risks include enumeration, per-tenant normalized
  email uniqueness, exactly one selected tenant context, removed-user and
  disabled-tenant interruption, provider outage, password-reset bypass,
  session invalidation, replay-state leakage, audit privacy, and current
  membership refresh
- Missing source-of-truth artifacts:
  PRD, capability matrix, API contracts, OpenAPI/Postman artifacts, data
  dictionary entries, permission mappings, design-system behavior lock,
  reference pack, verification checklist, implementation blueprint, feature
  manifest decisions, generated dependency graph refresh if new seams are
  introduced

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| C-001 | Tenant-aware login feature boundary and auth scope | architecture-foundation-required | PRD and auth architecture governance | deferred-with-owner | Architecture-foundation task for tenantAuth, tenantConfiguration, identity, provider, and session-authority decisions before delivery |
| C-002 | Root-managed tenant auth configuration | feature-local | Tenant auth or tenant configuration owning feature, exact owner deferred to PRD | deferred-with-owner | Backend, API-contract, migration/persistence, permission-mapping, and data-dictionary tasks after PRD and capability matrix approval |
| C-003 | Pre-auth email resolution, tenant selection, and method choice | feature-local | Tenant login route family and tenant-auth session seams | deferred-with-owner | Backend and API-contract tasks for generic no-match behavior and exactly one selected tenant context |
| C-004 | Email-password reset and SSO provider posture | feature-public-seam | One-time token, notification, and provider callback seams | deferred-with-owner | Architecture-foundation, API-contract, migration/persistence, and backend tasks after provider and token lifecycle decisions |
| C-005 | Active-session interruption and authority refresh | platform-seam | Auth/session authority seam | deferred-with-owner | Platform-seam and backend tasks only after the invalidation or refresh mechanism is selected |
| C-006 | Tenant login governed frontend pattern | design-system-seam | Design-system login render/controller/style seams | deferred-with-owner | Design-system and frontend tasks after behavior lock, reference pack, verification checklist, and adoption path exist |
| C-007 | Security, audit, privacy, and artifact conformance | feature-local | Tenant auth, audit, permission, API, data, and test planning artifacts | deferred-with-owner | Permission-mapping, data-dictionary, API-contract, QA/evidence, and docs-artifact tasks after source-of-truth artifacts exist |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-000 | Capability matrix normalization | blocked | No approved tenant-aware login capability matrix exists and ART-001 blocks delivery stories. | docs-artifact |
| S-001 | Auth scope and feature-boundary lock | blocked | PRD has not selected feature boundaries, durable identity model, provider posture, or session authority mechanics. | architecture-foundation |
| S-002 | Root-managed tenant auth configuration | blocked | Root configuration needs PRD, capability matrix, API, permission, data, and migration decisions before implementation. | backend |
| S-002 | Root auth configuration route contract | blocked | Root manage/read behavior, validation, and audit evidence require API contract planning. | API-contract |
| S-002 | Tenant auth configuration persistence | blocked | Durable method set, provider reference metadata, policy version, timestamps, and lifecycle state require persistence planning. | migration/persistence |
| S-003 | Pre-auth email and tenant resolution | blocked | Generic no-match behavior and safe tenant-choice disclosure need approved API and security posture. | backend |
| S-003 | Pre-auth route contract | blocked | Email normalization, validation, and disclosure threshold require API contract rows. | API-contract |
| S-004 | Tenant selection and method choice | blocked | Method execution must bind exactly one selected tenant context after PRD/session decisions. | backend |
| S-004 | Selected-tenant state contract | blocked | Request-body tenant inference and disabled-method transition behavior require API contract planning. | API-contract |
| S-005 | Email-password and password-reset policy | blocked | Reset availability and token lifecycle depend on selected tenant, enabled method policy, token, and notification seams. | backend |
| S-005 | Password reset persistence and token lifecycle | blocked | Tenant-bound, single-use, short-lived reset tokens require data and lifecycle planning. | migration/persistence |
| S-006 | SSO unavailable and fallback posture | blocked | Provider handoff, callback, outage, and fallback behavior are intentionally deferred. | backend |
| S-006 | SSO provider architecture | blocked | Provider-specific behavior affects security, session state, audit, and fallback contracts. | architecture-foundation |
| S-007 | Session interruption and authority refresh | blocked | Active-session interruption mechanism has not been selected. | platform-seam |
| S-007 | Current tenant authority enforcement | blocked | Removed users, membership changes, disabled tenants, and forced-login state need backend enforcement planning. | backend |
| S-008 | Audit, privacy, and replay-state controls | blocked | Audit event inventory and forbidden sensitive fields require source-independent security and API artifacts. | QA/evidence |
| S-008 | Permission and privacy mapping | blocked | Authz boundaries, audit access, and replay-state exclusions need permission and security documentation. | permission-mapping |
| S-009 | Governed tenant login pattern | blocked | Tenant login UI requires signed-off design-system seams and cannot copy root-login markup. | design-system |
| S-009 | Tenant login app adoption | blocked | Future app UI can proceed only after governed render/controller/style seams exist. | frontend |
| S-010 | Maintained artifact conformance | blocked | API, data, permission, design-system, feature-manifest, generated graph, and test-case artifacts do not yet exist. | docs-artifact |
| S-010 | PRD-derived test planning | blocked | Detailed TC planning is required before delivery stories can claim proof coverage. | test-only |

## Epic Summary

- Epic job to be done:
  Tenant users need to authenticate into exactly one tenant through that
  tenant's enabled methods while root governs tenant auth configuration and
  stale sessions are interrupted when authority changes.
- Epic outcome:
  Tenant-aware login is planned as a permissioned, tenant-bound,
  enumeration-resistant, auditable auth vertical slice with governed login UI
  seams before implementation.
- Epic actors:
  tenant user, root operator, auth/session system, tenant/membership evaluator,
  SSO provider, notification provider, audit/operations reviewer
- Epic non-goals:
  broad identity-provider platform, copied root-login implementation, tenant
  admin self-service configuration, app UI before signoff, public tenant
  discovery, secret-bearing replay links, source edits
- Epic dependency summary:
  Tenant-aware login depends on tenant auth policy/configuration, principals
  and memberships, tenants, root-managed configuration, one-time tokens,
  notification delivery, session authority checks, audit, and governed
  design-system login seams.
- Epic-level proof target:
  `mixed`

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | needs-capability-matrix | harness-value | docs-artifact | Capability matrix normalization | As the delivery harness, I need tenant-aware login stories translated into capability rows so security-sensitive work starts from explicit obligations. | harness | Approved capability rows cover every acceptance criterion and identity/security boundary. | Blocks all delivery stories |
| S-001 | needs-prd-refinement | system-value | architecture-foundation | Auth scope and feature-boundary lock | As architecture governance, I need root-managed tenant auth configuration, tenantAuth boundaries, identities, memberships, provider references, and session authority seams decided. | architecture governance | Downstream contracts can describe tenant-aware login without inventing auth architecture during delivery. | Blocks S-002 through S-010 |
| S-002 | needs-capability-matrix | user-value | backend | Root-managed tenant auth configuration | As a root operator, I need to configure enabled auth methods for exactly one tenant. | root operator | Tenant auth method policy is durable, permissioned, auditable, and separate from mutable provider state. | Depends on S-000 and S-001 |
| S-003 | needs-capability-matrix | user-value | backend | Pre-auth email and tenant resolution | As a tenant user, I need email entry and tenant resolution to reveal only safe next steps. | tenant user | Email is normalized, no-match outcomes are generic, and multi-tenant choices appear only after approved resolution. | Depends on S-000 and S-001 |
| S-004 | needs-capability-matrix | user-value | backend | Tenant selection and method choice | As a tenant user, I need to select exactly one tenant and choose among that tenant's enabled methods. | tenant user | Auth method execution is bound to one selected tenant context and disabled methods redirect safely. | Depends on S-003 |
| S-005 | needs-capability-matrix | user-value | backend | Email-password and password-reset policy | As a tenant user, I need email-password login and reset only when enabled for the selected tenant. | tenant user | Password reset cannot bypass tenant method policy and tokens remain tenant-bound, short-lived, and secret-safe. | Depends on S-002 through S-004 |
| S-006 | needs-capability-matrix | system-value | backend | SSO unavailable and fallback posture | As the auth system, I need SSO outage or misconfiguration outcomes to fall back only when another enabled method exists. | auth/session system and SSO provider | SSO unavailability blocks or routes to an enabled fallback without becoming a broad provider platform. | Depends on S-002 through S-004 |
| S-007 | needs-capability-matrix | system-value | backend | Session interruption and authority refresh | As the auth/session system, I need removed users, membership changes, disabled tenants, deleted tenants, and forced-login policy changes to affect active sessions. | auth/session system | Active access reflects current tenant, membership, user, and auth-policy state with audit evidence. | Depends on S-001 through S-004 |
| S-008 | needs-capability-matrix | system-value | backend | Audit, privacy, and replay-state controls | As security and operations governance, I need mandatory audit events without credentials, tokens, provider secrets, or authority-bearing replay payloads. | security, audit, operations | Auth events are reviewable and privacy-safe, and debug/replay state cannot grant tenant access. | Depends on S-001 through S-007 |
| S-009 | needs-capability-matrix | user-value | frontend | Governed tenant login pattern | As a tenant user, I need signed-off login, tenant selection, method choice, recovery, unavailable-provider, disabled-method, and forced-login states. | tenant user | Tenant login UI consumes governed render/controller/style seams instead of copying root login. | Depends on S-001 through S-008 |
| S-010 | needs-capability-matrix | harness-value | standards-compliance | Maintained artifact conformance | As repo governance, I need API, data, permission, design-system, feature-manifest, and test-case artifacts to reflect the approved story set before Task Breakdown. | repo governance | Delivery begins from coherent contracts and traceable proof obligations. | Depends on S-000 through S-009 |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | The capability matrix names root tenant-auth configuration, pre-auth resolution, tenant selection, method choice, password reset, SSO fallback, session interruption, audit evidence, and governed UI rows. | contract-level | capability-matrix coverage; traceability review | capability matrix |
| AC-S000-02 | S-000 | Every acceptance criterion in this packet maps to an approved capability row or records why the criterion is governance-only. | contract-level | traceability review | capability matrix |
| AC-S001-01 | S-001 | The PRD selects whether tenant-aware login extends tenantAuth, tenantConfiguration, or a narrower auth-method configuration seam and records public seams for every affected feature. | source-level | architecture decision review; feature-seam review | PRD; feature manifest plan |
| AC-S001-02 | S-001 | The PRD defines durable identities, tenant memberships, per-tenant normalized email uniqueness, provider references, session policy/version facts, and exact current-tenant authority timing. | contract-level | data model review; tenant-boundary review | PRD; data dictionary; API contracts |
| AC-S001-03 | S-001 | The PRD decides active-session invalidation mechanics for removed users, membership changes, disabled or deleted tenants, and forced new login after auth configuration changes. | contract-level | lifecycle matrix; session authority review | PRD; capability matrix; runbook note |
| AC-S002-01 | S-002 | Root configuration writes require root authorization, exactly one target tenant, normalized configuration values, no client-supplied system-managed fields, and audit evidence. | runtime-api | authz; validation; audit | API contract; permission mapping; data dictionary |
| AC-S002-02 | S-002 | Tenant auth configuration persists enabled method set, provider reference metadata, policy version, timestamps, lifecycle state, and force-login posture without depending only on mutable provider state. | persistence-level | persistence integration; lifecycle review | data dictionary; migration plan |
| AC-S003-01 | S-003 | Email entry trims and lowercases email, rejects empty strings and invalid email format, and preserves generic no-match messaging for absent user, tenant, or membership states. | runtime-api | validation; security; enumeration resistance | API contract; capability matrix |
| AC-S003-02 | S-003 | Single-tenant and multi-tenant outcomes expose only approved tenant choice information after the pre-auth resolution threshold and never grant authority before method execution succeeds. | runtime-api | privacy; auth flow; tenant boundary | API contract; permission mapping |
| AC-S004-01 | S-004 | Tenant selection binds exactly one selected tenant context before method execution and rejects request-body tenant inference where server-side selection state should own authority. | runtime-api | tenant authz; state transition; replay security | API contract; data dictionary |
| AC-S004-02 | S-004 | Method choice shows only enabled methods for the selected tenant, and a method disabled during login redirects to login with an approved next-step state. | runtime-api | state matrix; lifecycle transition | PRD; API contract; frontend scenarios |
| AC-S005-01 | S-005 | Email-password login and password reset are available only when email-password is enabled for the selected tenant and the user membership is active. | runtime-api | auth; lifecycle; validation | API contract; capability matrix |
| AC-S005-02 | S-005 | Password reset tokens are tenant-bound, method-policy-bound, short-lived, single-use, audit-visible, and never logged or serialized into replay URLs. | persistence-level | token lifecycle; privacy; audit | data dictionary; API contract; runbook note |
| AC-S006-01 | S-006 | SSO handoff and return are scoped to exactly one selected tenant and one provider reference, with provider outage or misconfiguration producing approved fallback or blocked states. | runtime-api | provider-state matrix; security | PRD; API contract; capability matrix |
| AC-S006-02 | S-006 | SSO unavailable falls back only when another enabled method exists for the selected tenant; otherwise login is blocked with approved generic messaging. | runtime-api | fallback state; privacy | PRD; frontend scenarios |
| AC-S007-01 | S-007 | Removed users, removed memberships, disabled or deleted tenants, and forced-login policy changes interrupt active sessions by the approved mechanism and record audit evidence. | mixed | session lifecycle; audit; resilience | PRD; API contract; runbook note |
| AC-S007-02 | S-007 | Membership and role changes are reflected in active access according to the approved refresh seam without granting broad implicit access across tenants. | mixed | tenant authz; session refresh; compatibility | permission mapping; API contract |
| AC-S008-01 | S-008 | Audit events cover root configuration changes, login attempts, tenant selection, method choice, reset requests, SSO provider failures, fallback/block outcomes, forced logout, and membership-change effects. | persistence-level | audit integration; privacy log review | audit docs; capability matrix |
| AC-S008-02 | S-008 | Credentials, reset tokens, provider secrets, raw assertions, bearer/session tokens, and sensitive proof material are excluded from logs, replay payloads, URLs, and browser-visible diagnostics. | source-level | privacy; replay security; source inspection | security notes; API contract |
| AC-S009-01 | S-009 | Design-system governance identifies signed-off render, controller, style, accessibility, and verification seams for email entry, tenant selection, method choice, recovery, unavailable provider, disabled method, and forced re-login states. | human-visible-parity | design-system canonical review; accessibility review | behavior lock; reference pack; verification checklist |
| AC-S009-02 | S-009 | Tenant login app UI consumes governed seams and does not copy root-login markup, controller behavior, or app-page CSS unless an explicit exception is approved. | source-level | governed adoption review; source inspection | adoption artifact |
| AC-S010-01 | S-010 | API contracts, OpenAPI/Postman artifacts, data dictionaries, permission mappings, feature manifests, generated dependency graph artifacts, design-system artifacts, and test-case planning reflect every approved seam and dependency. | source-level | artifact consistency; generated artifact verification | maintained artifacts |
| AC-S010-02 | S-010 | PRD-derived test-case planning records actor, permission, state, object, value, validation, lifecycle, system-error, accessibility, privacy, audit, performance, resilience, and compatibility obligations for each delivery story. | contract-level | TC planning review; traceability review | PRD-derived test-case packet |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | Tenant-aware login capability matrix control rows | planning | create-or-refresh-required | Default control story because no approved matrix exists. |
| S-000 | AC-S000-02 | Tenant-aware login traceability rows | planning | create-or-refresh-required | Must cover AC-to-row mapping. |
| S-001 | AC-S001-01 | tenant-auth.feature-boundary | architecture governance | create-or-refresh-required | Owning feature and public seams. |
| S-001 | AC-S001-02 | tenant-auth.identity-and-session-model | tenant auth | create-or-refresh-required | Durable facts and uniqueness. |
| S-001 | AC-S001-03 | tenant-auth.session-invalidation-policy | tenant auth | create-or-refresh-required | Active-session interruption. |
| S-002 | AC-S002-01 | root.tenant-auth-configuration.manage | root selected tenant | create-or-refresh-required | Root-only configuration write. |
| S-002 | AC-S002-02 | tenant-auth-configuration.persist | tenant configuration | create-or-refresh-required | Durable method and provider policy facts. |
| S-003 | AC-S003-01 | tenant-login.pre-auth-email.resolve | public pre-auth | create-or-refresh-required | Normalization and generic no-match. |
| S-003 | AC-S003-02 | tenant-login.tenant-choice.list | public pre-auth | create-or-refresh-required | Safe tenant choice disclosure. |
| S-004 | AC-S004-01 | tenant-login.tenant.select | pre-auth selected tenant | create-or-refresh-required | Exactly one selected tenant context. |
| S-004 | AC-S004-02 | tenant-login.method.choose | selected tenant | create-or-refresh-required | Enabled-method choice and disabled-method redirect. |
| S-005 | AC-S005-01 | tenant-login.email-password.authenticate | selected tenant | create-or-refresh-required | Email-password policy binding. |
| S-005 | AC-S005-02 | tenant-login.password-reset.request | selected tenant | create-or-refresh-required | Tenant-bound reset token lifecycle. |
| S-006 | AC-S006-01 | tenant-login.sso.start; tenant-login.sso.complete | selected tenant and provider | create-or-refresh-required | Provider handoff and return. |
| S-006 | AC-S006-02 | tenant-login.sso.fallback | selected tenant | create-or-refresh-required | Fallback or blocked posture. |
| S-007 | AC-S007-01 | tenant-session.invalidate | active tenant session | create-or-refresh-required | Forced logout and lifecycle interruption. |
| S-007 | AC-S007-02 | tenant-session.authority.refresh | active tenant session | create-or-refresh-required | Membership and role refresh. |
| S-008 | AC-S008-01 | tenant-auth.audit.record | audit | create-or-refresh-required | Event inventory. |
| S-008 | AC-S008-02 | tenant-auth.privacy.redact-sensitive-proof | security/privacy | create-or-refresh-required | Forbidden fields and replay posture. |
| S-009 | AC-S009-01 | tenant-login.design-system.pattern | governed frontend | create-or-refresh-required | Login pattern signoff. |
| S-009 | AC-S009-02 | tenant-login.governed-adoption | governed frontend | create-or-refresh-required | No copied root login. |
| S-010 | AC-S010-01 | tenant-aware-login.artifact-conformance | repo governance | create-or-refresh-required | Maintained artifact sweep. |
| S-010 | AC-S010-02 | tenant-aware-login.test-case-planning | test planning | create-or-refresh-required | Detailed TC IDs come later. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | S-001 / AC-S001-01 | tenantAuth feature boundary | feature-public-seam | existing or changed | PRD and manifest plan name owned public seams. | Feature manifest and dependency graph proof when implemented. |
| D-002 | S-001 / AC-S001-02 | tenant principals and memberships | pre-existing-capability | existing | Data dictionary defines normalized email uniqueness within tenant. | Persistence tests prove cross-tenant email reuse and within-tenant uniqueness. |
| D-003 | S-001 / AC-S001-03 | session authority and invalidation seam | new-capability | new | PRD records request-time, push, polling, job, or support-command mechanism. | Runtime tests prove removed or disabled access interruption. |
| D-004 | S-002 / AC-S002-01 | root authz policy evaluation | authz-capability | existing or changed | Permission mapping names root manage/read grants and denies. | Authz tests cover root allow and non-root deny. |
| D-005 | S-002 / AC-S002-02 | tenant auth configuration persistence | persistence-table-or-index | existing or new | Migration and data dictionary define durable method and provider facts. | Persistence tests cover lifecycle, timestamps, and policy version. |
| D-006 | S-003 / AC-S003-01 | pre-auth identity resolution seam | new-capability | new | API contract proves generic no-match and email normalization. | API tests cover invalid, absent, and eligible outcomes. |
| D-007 | S-004 / AC-S004-01 | selected tenant state seam | new-capability | new | API contract binds method execution to one server-side selected tenant. | Runtime tests cover tenant mismatch and replay attempts. |
| D-008 | S-005 / AC-S005-02 | one-time token library | feature-public-seam | existing or changed | Token contract proves tenant, method, expiry, single-use, and audit binding. | Token lifecycle tests cover expiry, reuse, wrong tenant, disabled method. |
| D-009 | S-005 / AC-S005-02 | notification delivery | feature-public-seam | existing or changed | Contract proves password reset delivery without token logging. | Integration tests cover reset request and delivery failure evidence. |
| D-010 | S-006 / AC-S006-01 | SSO provider reference seam | external-provider | future | PRD/API contract names provider state and callback posture. | Provider-state tests cover outage, mismatch, and blocked states. |
| D-011 | S-008 / AC-S008-01 | audit event writer | feature-public-seam | existing or changed | Audit artifact defines events, fields, and forbidden fields. | Audit integration tests cover success, deny, fallback, forced logout. |
| D-012 | S-009 / AC-S009-01 | tenant login design-system pattern | design-system-seam | new | Behavior lock names render/controller/style/accessibility seams. | Browser canonical tests cover login, choice, recovery, and forced states. |
| D-013 | S-009 / AC-S009-02 | governed frontend adoption seam | feature-public-seam | future | Adoption artifact confirms app consumes shared seam. | Source review and browser proof block copied root-login implementation. |
| D-014 | S-010 / AC-S010-01 | feature manifests and generated dependency graph | feature-public-seam | existing maintained artifact | Manifests list public seams and cross-feature dependencies. | Standards gate verifies generated artifacts after manifest changes. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| Tenant auth configuration seam | root configuration transport; tenant login policy resolution | Root-managed tenant method policy, provider references, policy version, lifecycle state | Mutable provider state as the only durable fact | Root configuration API and policy-resolution integration |
| Pre-auth identity resolution seam | tenant login transport | Normalized email validation and generic no-match behavior before safe tenant choice | Tenant membership disclosure before approved threshold | API security and privacy tests |
| Selected tenant method execution seam | email-password, password reset, SSO flows | Exactly one selected tenant context governs method execution | Request body tenant inference or broad membership grant | Runtime tenant mismatch and replay tests |
| Session authority refresh and invalidation seam | active tenant sessions | Removed, changed, disabled, deleted, or force-login states affect access | Long-lived stale session assumptions | Session lifecycle and audit tests |
| Tenant login design-system seam | tenant login app route | Shared render/controller/style behavior for login states | Copied root login markup, app-page CSS, local controller reconstruction | Canonical visual and future adoption proof |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | harness reviewer | repo artifact author | matrix absent; packet drafted | ACs unmapped; capability rows missing | stable story and AC IDs | draft queue to matrix-covered queue | missing matrix row; stale traceability | traceability; standards compliance |
| S-001 | architect; security reviewer | architecture approval | steering accepted; PRD absent | feature boundary undecided; session seam undecided | normalized email; tenant ID; provider reference; policy version | steering to PRD-ready scope | source-of-truth conflict; missing auth guide alignment | security; privacy; compatibility |
| S-002 | root operator; unauthorized actor | root manage grant; denied non-root | active root session; expired session | tenant active; tenant disabled; config active; config soft-deleted | enabled method set; provider reference; force-login flag | create config; change config; force login | tenant missing; authz denial; persistence conflict | audit; security; durability |
| S-003 | unauthenticated user | public pre-auth only | invalid email; valid email; no match; eligible single tenant; eligible multi-tenant | user active; user removed; membership active; tenant disabled | trimmed lowercase email; empty string rejection | email entry to tenant choice | enumeration attempt; identity seam unavailable | privacy; security; performance |
| S-004 | tenant user | public pre-auth with selected tenant | no tenant selected; one tenant selected; stale selection | method enabled; method disabled; method unavailable | tenant selector; method key | select tenant; choose method; redirect on disabled method | replay attempt; tenant mismatch | security; compatibility |
| S-005 | tenant user; notification system | selected tenant auth method | active membership; reset requested; reset expired | email-password enabled; method disabled; token active; token used | password credential; reset token; email value | login; request reset; consume reset; expire token | delivery failure; token reuse; wrong tenant | privacy; audit; resilience |
| S-006 | tenant user; SSO provider | selected tenant SSO method | provider available; provider unavailable; fallback available; fallback absent | provider reference active; provider misconfigured | provider state; callback state | start SSO; return; fallback; block login | provider outage; callback mismatch | security; resilience; audit |
| S-007 | tenant user; auth/session system | active tenant session | logged in; removed; role changed; forced-login flagged | tenant active; tenant disabled; membership active; membership removed | session ID; policy version; membership version | continue session; refresh authority; invalidate session | invalidation failure; stale cache | security; operational evidence; compatibility |
| S-008 | security reviewer; audit reviewer | policy review; audit read if approved | success; denial; fallback; forced logout | event stored; forbidden field absent | event names; tenant IDs; user IDs; provider IDs without secrets | record event; redact field; inspect replay payload | audit writer failure; sensitive field leak | privacy; auditability; compliance |
| S-009 | tenant user; frontend governance reviewer | not-applicable: design-system sample and future adoption approval | login; tenant choice; method choice; recovery; disabled method; forced-login | empty state; unavailable provider; blocked state; generic no-match | screen copy; focus target; control state | enter email; select tenant; choose method; redirect; forced-login return | focus loss; copied root markup; missing seam | accessibility; rendered-browser; governed adoption |
| S-010 | repo governance reviewer | artifact governance | artifacts absent; artifacts refreshed | API/data/permission/design/test artifacts stale or aligned | stable story IDs; AC IDs; seam names | story packet to coherent downstream artifacts | validation failure; generated graph drift | standards compliance; rebuild readiness |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | harness reviewer; matrix absent | tenant-aware login control rows | contract-level | TC obligation: matrix coverage review | no |
| AC-S000-02 | harness reviewer; unmapped ACs | tenant-aware login traceability rows | contract-level | TC obligation: AC-to-row review | no |
| AC-S001-01 | architect; feature boundary undecided | feature-boundary row | source-level | TC obligation: feature-seam source review | yes |
| AC-S001-02 | architect; identity and session model | identity-and-session row | contract-level | TC obligation: data model and tenant-boundary review | yes |
| AC-S001-03 | auth/session reviewer; lifecycle states | session-invalidation-policy row | contract-level | TC obligation: lifecycle matrix and authority review | yes |
| AC-S002-01 | root operator; unauthorized actor | root manage config row | runtime-api | TC obligation: root allow and deny cases | yes |
| AC-S002-02 | root operator; config persistence states | config persist row | persistence-level | TC obligation: persistence and lifecycle cases | yes |
| AC-S003-01 | unauthenticated user; invalid and absent states | pre-auth email row | runtime-api | TC obligation: validation and generic no-match cases | yes |
| AC-S003-02 | unauthenticated user; single and multi-tenant outcomes | tenant-choice row | runtime-api | TC obligation: safe tenant disclosure cases | yes |
| AC-S004-01 | tenant user; selected tenant states | tenant select row | runtime-api | TC obligation: selected-tenant binding and replay cases | yes |
| AC-S004-02 | tenant user; enabled and disabled methods | method choose row | runtime-api | TC obligation: method state transition cases | yes |
| AC-S005-01 | tenant user; email-password states | email-password authenticate row | runtime-api | TC obligation: method-policy-bound auth cases | yes |
| AC-S005-02 | tenant user; reset token lifecycle | password-reset row | persistence-level | TC obligation: token lifecycle and privacy cases | yes |
| AC-S006-01 | tenant user; SSO provider states | SSO start and complete rows | runtime-api | TC obligation: provider handoff and return cases | yes |
| AC-S006-02 | tenant user; fallback states | SSO fallback row | runtime-api | TC obligation: fallback and blocked state cases | yes |
| AC-S007-01 | active tenant user; lifecycle interruption | session invalidate row | mixed | TC obligation: forced logout and audit cases | yes |
| AC-S007-02 | active tenant user; membership and role change | session authority refresh row | mixed | TC obligation: current authority refresh cases | yes |
| AC-S008-01 | audit reviewer; success and deny events | audit record row | persistence-level | TC obligation: event inventory and forbidden field review | yes |
| AC-S008-02 | security reviewer; replay and log surfaces | privacy redact row | source-level | TC obligation: forbidden secret surface review | yes |
| AC-S009-01 | tenant user; login visual states | design-system pattern row | human-visible-parity | TC obligation: canonical visual and accessibility scenarios | yes |
| AC-S009-02 | frontend governance reviewer; adoption state | governed adoption row | source-level | TC obligation: no copied root-login source review | no |
| AC-S010-01 | repo governance; artifact refresh | artifact conformance row | source-level | TC obligation: standards and generated artifact verification | yes |
| AC-S010-02 | test planner; story obligations | test-case planning row | contract-level | TC obligation: PRD-derived TC planning packet | no |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| B-001 | S-002 through S-010 | capability-matrix | No approved tenant-aware login capability matrix exists. | Capability matrix covering every AC row or explicit non-capability rationale. | Task Breakdown for delivery stories waits until matrix coverage exists. |
| B-002 | S-002 through S-008 | architecture-foundation | PRD has not selected exact feature boundaries, identity model, provider posture, or session authority mechanics. | PRD decisions and source-of-truth alignment with named ADRs and guides. | Backend delivery waits until auth architecture is recorded. |
| B-003 | S-005 and S-006 | architecture-foundation | Password reset and SSO provider behavior can alter token, notification, provider, and callback architecture. | PRD/API/data decisions for reset and SSO lifecycle. | Method delivery waits until provider and token posture are recorded. |
| B-004 | S-007 | architecture-foundation | Active-session interruption mechanism is not selected. | Approved invalidation or authority-refresh mechanism with audit and retry posture. | Session delivery waits until enforcement model is recorded. |
| B-005 | S-009 | design-system-foundation | Tenant login design-system render/controller/style seams are not confirmed. | Behavior lock, reference pack, verification checklist, and adoption path. | App UI delivery waits until consumable seams exist or explicit exception is approved. |
| B-006 | S-010 | artifact-drift | Downstream source-independent artifacts do not yet exist for the feature. | API/data/permission/design/test artifacts created through owner workflows. | Task Breakdown waits on artifacts marked blocking by change-control requirements. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-001 | B-002 | Does tenant-aware login extend tenantAuth, tenantConfiguration, or a narrower auth-method configuration seam? | yes | requester accepted architectural recommendation: split ownership so `tenantConfiguration` owns root-managed tenant auth policy/configuration and `tenantAuth` owns login flow, tenant selection, method execution, password reset, SSO handoff, session authority, and active-session checks |
| Q-002 | B-002 | What durable identity, membership, per-tenant email uniqueness, provider reference, and session policy/version records own the auth facts? | yes | architectural recommendation recorded: durable tenant auth policy/configuration, normalized tenant-scoped identity and membership facts, provider references, policy version, and session authority facts must be persisted; they must not depend only on provider or UI state |
| Q-003 | B-004 | Which mechanism interrupts active sessions after user, membership, tenant, or auth-policy state changes? | yes | requester accepted architectural recommendation: start with request-time authority checks plus tenant auth policy/session version checks; defer scheduler, pub/sub, or worker invalidation until runtime requirements demand it |
| Q-004 | B-003 | Which SSO provider posture and callback constraints are approved for the first slice, and which provider-specific behaviors remain out of scope? | yes | requester accepted architectural recommendation: plan the SSO seam but defer broad SSO provider implementation; first delivery can focus on email/password and method choice while SSO remains a bounded future method with explicit callback constraints |
| Q-005 | B-005 | Does an existing governed login pattern expose sufficient tenant selection, method choice, recovery, disabled-method, unavailable-provider, and forced-login seams? | yes | requester accepted UX recommendation: base tenant and method selection on the existing SSH-key-selection pattern, using a selectable list/radio-card style for tenant choice followed by method choice and next-step disclosure |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-001 | S-001 through S-008 | Q-001; Q-002; ART-002; ART-003 | prd-required | not-applicable: architectural ownership and durable fact recommendations are recorded | not-applicable: split ownership between `tenantConfiguration` policy/configuration and `tenantAuth` execution/session behavior | Create tenant-aware login PRD and data dictionary entries using the recorded split ownership and durable auth fact model. | yes | ready-to-create-artifact |
| U-002 | S-007 | Q-003 | prd-required | not-applicable: active-session interruption recommendation is recorded | not-applicable: request-time authority checks plus tenant auth policy/session version checks are the first-slice default | Capture request-time authority and policy/session version checks in PRD, API contracts, data dictionary, and tests; defer scheduler or worker invalidation. | yes | ready-to-create-artifact |
| U-003 | S-005; S-006 | Q-004 | prd-required | not-applicable: SSO first-slice posture is recorded | not-applicable: defer broad SSO provider implementation while preserving a bounded future SSO method seam | Record first-slice email/password and method-choice scope plus future SSO callback constraints in PRD and capability matrix. | yes | ready-to-create-artifact |
| U-004 | S-009 | Q-005; ART-006; ART-007; ART-008; ART-009 | design-system-governance | not-applicable: tenant/method selection UX recommendation is recorded | not-applicable: adapt the SSH-key-selection pattern for tenant choice and method choice | Create tenant login behavior lock, reference pack, verification checklist, and adoption contract using selectable tenant and method-choice states. | yes | ready-to-create-artifact |
| U-005 | S-000 | ART-001 | capability-matrix-required | not-applicable: capability matrix can be derived from recorded auth and design-system recommendations | not-applicable: no product choice required once recommendations are recorded | Create tenant-aware login capability matrix rows for every AC or explicit non-capability rationale. | yes | ready-to-create-artifact |
| U-006 | S-002 through S-008 | ART-004; ART-005 | artifact-creation | not-applicable: API and permission artifacts depend on PRD and capability rows | not-applicable: use recorded split ownership, session authority, and SSO posture as source decisions | Create API contracts and permission mappings after PRD and capability rows exist. | yes | deferred-with-owner |
| U-007 | S-010 | ART-010; ART-011; ART-012 | artifact-creation | not-applicable: final planning artifacts depend on PRD, matrix, API, data, permission, and design-system artifacts | not-applicable: no standalone safe default before upstream artifacts exist | Create PRD-derived test cases, implementation blueprint, feature manifests, and generated graph after upstream artifacts are coherent. | yes | deferred-with-owner |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-001 | S-000 | capability matrix | create tenant-aware login capability matrix | capability-matrix workflow | yes |
| ART-002 | S-001 | PRD | create tenant-aware login PRD with auth, tenant, lifecycle, and provider decisions | PRD workflow | yes |
| ART-003 | S-001 | data dictionary | create or refresh tenant auth configuration, identity, membership, session, provider, token, and audit entries | data-dictionary-maintainer | yes |
| ART-004 | S-002 through S-007 | API contract | create route contracts for configuration, login, selection, method execution, reset, SSO, session continuation, and logout | api-contract-maintainer | yes |
| ART-005 | S-002 through S-008 | permission mapping | map root configuration, tenant login/session, reset, SSO, audit, and cross-tenant deny capabilities | permission-mapping workflow | yes |
| ART-006 | S-009 | design-system behavior lock | create tenant login pattern behavior lock | frontend-design-system-loop-maintainer | yes |
| ART-007 | S-009 | design-system reference pack | create tenant login pattern reference pack | frontend-design-system-loop-maintainer | yes |
| ART-008 | S-009 | verification checklist | create tenant login pattern verification checklist | frontend-test-case-maintainer | yes |
| ART-009 | S-009 | adoption contract | create first-consumer adoption contract before app UI | frontend-design-system-loop-maintainer | yes |
| ART-010 | S-010 | PRD-derived test cases | create test-case packet with story and AC traceability | prd-test-case-planner | yes |
| ART-011 | S-010 | implementation blueprint | create after PRD, capability, API, data, authz, and design-system artifacts are coherent | implementation-blueprint-maintainer | yes |
| ART-012 | S-010 | feature manifests and generated graph | refresh after public seams or cross-feature dependencies are approved | feature manifest workflow | yes |

## Story Readiness Summary

- Ready stories:
  none
- Blocked stories:
  S-000 through S-010 remain blocked on capability matrix, PRD/auth
  architecture decisions, design-system seam governance, and maintained
  artifact creation.
- Stories needing capability matrix:
  S-000 through S-010
- Stories needing PRD refinement:
  S-001 through S-008
- Stories needing Technical Steering revisit:
  none if the work stays within root-managed tenant auth configuration,
  tenant-aware login, bounded reset, bounded SSO fallback, and governed UI.
- Stories needing Product Discovery revisit:
  none.
- Broad cleanup or shortcut risk:
  `listed-below`
- Architecture invention risk:
  `none`

Shortcut risks:

- Copying root-login markup or controller behavior into tenant login UI before
  governed design-system seams exist.
- Letting password reset bypass selected-tenant method policy.
- Treating tenant selection, SSO callback, reset tokens, replay links, or
  provider state as authority without server-side validation.
- Deferring active-session interruption mechanics into source implementation.
- Beginning Task Breakdown before PRD, capability matrix, API, data,
  permission, design-system, and test-case artifacts exist.

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | blocked | Capability matrix does not yet exist. |
| S-001 | blocked | PRD and auth architecture decisions are not recorded. |
| S-002 | blocked | Root configuration delivery waits on feature-boundary, data, API, and permission decisions. |
| S-003 | blocked | Pre-auth resolution delivery waits on PRD, API, privacy, and capability rows. |
| S-004 | blocked | Tenant selection and method choice wait on selected-tenant authority contract. |
| S-005 | blocked | Email-password and reset work waits on token, notification, and method-policy decisions. |
| S-006 | blocked | SSO fallback work waits on provider posture and callback constraints. |
| S-007 | blocked | Session interruption waits on approved enforcement and retry/audit posture. |
| S-008 | blocked | Audit and privacy controls wait on event inventory and forbidden-field rules. |
| S-009 | blocked | Tenant login UI waits on signed-off design-system seams. |
| S-010 | blocked | Artifact conformance waits on upstream artifacts and generated graph decisions. |
