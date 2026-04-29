# Layer 2 Technical Steering Packet: Tenant-Aware Login Pattern

## Status

- Steering status: `ready-for-layer-3-after-auth-and-design-system-governance`
- Packet date: 2026-04-29
- Source discovery packet:
  `docs/workspace/product-discovery/2026-04-29-tenant-aware-login-pattern.md`
- Layer boundary:
  This packet stops at Technical Steering. It does not create a PRD,
  capability matrix, implementation blueprint, API contract, migration plan,
  executable test plan, route, schema, provider integration, session
  mechanism, or product code.
- Requested stop condition:
  Do not proceed to Layer 3.

## Steering Summary

Create the tenant-aware login work as an authentication/access vertical slice
that extends the existing tenant-auth and tenant-configuration direction, with
design-system governance before any tenant-facing login UI is implemented.

The first downstream planning slice should decide the durable auth policy,
tenant resolution, method choice, password reset, SSO fallback, membership
refresh, session invalidation, and audit behavior before source changes begin.
The UI path must not copy the root login implementation as a shortcut; the root
login is a product reference, while tenant login needs an explicit governed
pre-auth pattern for tenant selection, method choice, unavailable methods, and
forced re-login messaging.

Steering recommendation:

- Proceed next to PRD/capability planning plus design-system governance for a
  tenant-aware login pattern.
- Treat tenant auth configuration as root-managed tenant-scoped configuration,
  aligned with the existing tenant-configuration and tenant-auth policy
  direction.
- Require exactly one selected tenant context before auth-method execution.
- Preserve generic no-match behavior to avoid account or tenant enumeration.
- Do not implement SSO as a broad identity-provider platform in this slice
  without explicit provider and lifecycle planning.
- Do not add app UI before the reusable login flow has signed-off
  design-system behavior and adoption seams.

## Source Product Decisions

Locked by Product Discovery:

- root configures tenant auth rules
- tenants may have multiple enabled auth methods and users choose among them
- email validation is required
- email addresses are unique per tenant and reusable across tenants
- single-tenant users continue to that tenant's method choice
- multi-tenant users select tenant before method choice
- no-match messaging is generic
- password reset is in scope for email/password
- SSO unavailable falls back only when another enabled method exists
- SSO unavailable with no fallback blocks login
- removed users cannot log in
- removed or deleted logged-in users are logged out with a message
- newly added users can select the tenant on next login
- membership changes update in flight
- deleted or disabled tenants block login and log out active users
- auth configuration changes apply on next auth unless root/admin forces new
  login
- disabled methods during login or password reset show a next-step message and
  redirect to login

## Architectural Classification

- Change family: authentication/access, tenant-scoped configuration, governed
  frontend extension
- Primary feature families likely affected:
  `tenantAuth`, `tenantConfiguration`, `tenantAdmins`, `tenants`, root-admin
  configuration surfaces, and future tenant-facing login routes
- Route family posture:
  public pre-auth tenant login entry plus tenant-auth session routes; exact
  paths deferred to Layer 3
- Backend feature impact:
  likely tenant auth, tenant configuration, tenant and membership reads,
  password reset/token flows, audit, and session lifecycle
- Persistence impact:
  likely durable auth-method configuration, normalized per-tenant identity
  uniqueness, provider references, session policy/version state, and audit
  events
- API contract impact:
  yes, for login, tenant selection, method choice, password reset, logout,
  session continuation, and root auth-configuration management
- Tenant boundary impact:
  high; pre-auth resolution must not grant authority, and post-selection auth
  must evaluate exactly one current tenant context
- Reporting/read-model impact:
  audit and support visibility likely; no reporting dashboard requirement
- Asset upload/read impact:
  none
- New enduring frontend pattern likely:
  yes, tenant login/selection/method-choice pattern
- ADR likely required:
  yes if SSO provider posture, forced re-login/session invalidation, or
  tenant login route/adoption model becomes an enduring architecture rule

## Steering Decisions

| Decision | Steering position | Rationale |
| --- | --- | --- |
| Root login reuse | Treat as product reference, not copied implementation | Tenant login has different actor, tenant, policy, provider, and lifecycle constraints. |
| Auth configuration ownership | Root-managed tenant-scoped configuration | Matches Product Discovery and the existing tenant-configuration direction. |
| Tenant context timing | Resolve and select exactly one tenant before method execution | Prevents broad implicit grants across memberships. |
| Email uniqueness | Enforce on normalized email within tenant | Product decision allows cross-tenant email reuse while preventing duplicate tenant identities. |
| No-match posture | Generic messaging | Avoids account and tenant enumeration. |
| Multiple methods | Show enabled choices after tenant selection | Product Discovery locked multiple methods with user choice. |
| Password reset | Include only when email/password is enabled for the selected tenant | Prevents reset flows that bypass tenant policy. |
| SSO provider scope | Defer exact provider integration and callback model | Provider-specific behavior affects security, session state, audit, and fallback. |
| Session invalidation | Plan explicitly before implementation | Removed users, disabled tenants, and forced login require reliable active-session interruption. |
| In-flight membership updates | Plan as an authority-bearing session/access refresh seam | Product Discovery requires changed membership/role state to affect active access. |
| Frontend path | Design-system governance before app UI | Tenant selection, method choice, fallback, and forced-login messages are governed UX surfaces. |

## Required Downstream Planning Chain

Before implementation, create or update:

- PRD for tenant-aware login and root-managed tenant auth configuration
- capability matrix covering root configuration, public login, tenant
  selection, method choice, password reset, SSO fallback, session continuation,
  forced re-login, and lifecycle interruption
- API contract docs and OpenAPI/Postman artifacts for any route contract
  changes
- data dictionary entries for durable tenant auth policy, identity/membership
  uniqueness, session/version, provider reference, and audit fields
- permission mappings for root auth configuration and tenant-auth/session
  capabilities
- design-system behavior lock/reference pack/verification checklist for
  tenant login, tenant selection, method choice, unavailable methods, and
  forced-login messaging
- implementation blueprint only after PRD/capability/API/data/authz decisions
  are coherent

The downstream PRD must explicitly decide:

- how root-managed auth configuration relates to the existing tenant auth
  policy foundation
- whether the feature extends existing `tenantConfiguration` or introduces a
  narrower auth-method configuration seam
- how identities, principals, tenant memberships, and per-tenant email
  uniqueness are represented durably
- how provider references are stored without depending on mutable external
  provider state for durable domain facts
- how forced re-login and active-session invalidation are triggered, recorded,
  retried, and surfaced
- how membership and tenant lifecycle changes are detected for active sessions
- which audit events are mandatory and which fields must not be logged

## Conceptual Seam Shape

Layer 3 should decide exact names and file paths, but the durable shape should
separate these concerns:

- configuration seam:
  root-managed tenant auth-method configuration and policy resolution
- identity resolution seam:
  normalized email validation, generic no-match behavior, and eligible tenant
  choices without leaking tenant membership details unnecessarily
- tenant selection seam:
  exactly one selected tenant context before auth-method execution
- method execution seam:
  email/password, password reset, SSO handoff/return, unavailable provider,
  fallback, and blocked states
- session authority seam:
  active session lookup, membership/role refresh, tenant lifecycle checks, and
  forced re-login/session invalidation
- audit seam:
  root configuration changes, login attempts, tenant selection, method choice,
  fallback/block outcomes, forced logout, membership-change effects, and
  provider failures
- design-system seam:
  shared render/controller/style behavior for login, tenant selection, method
  choice, recovery, disabled-method, unavailable-provider, and forced-login
  states

No future SSO callback, tenant selection link, replay state, or password-reset
token may act as authority without server-side authn/authz and current
tenant-context validation.

## Security And Privacy Steering

Layer 3 must treat this as a high-sensitivity auth flow.

Required posture:

- trim and lowercase email before uniqueness checks and storage
- reject empty strings rather than converting them to null
- keep no-match results generic across user, tenant, and membership absence
- avoid exposing the list of tenant memberships until the actor has passed the
  approved pre-auth resolution threshold
- bind method execution to exactly one selected tenant context
- validate tenant, membership, user, method, and provider state at each
  authority-changing step
- invalidate or interrupt sessions when user, membership, tenant, or auth
  policy state makes access invalid
- preserve auditability without logging credentials, reset tokens, provider
  secrets, raw assertions, bearer/session tokens, or sensitive proof material
- ensure replay/debug links do not encode secrets or authority-bearing tenant
  state

## Design-System Steering

The tenant login pattern should not enter real app UI until design-system
governance confirms a reusable pattern and consumable seams.

The design-system loop should cover:

- email entry with generic error/no-match states
- single-tenant and multi-tenant selection states
- method choice with one or many enabled methods
- password reset entry and disabled-method interruption
- SSO unavailable with fallback and without fallback
- deleted/disabled tenant and removed-user messaging
- forced re-login messaging
- keyboard, touch, screen-reader, mobile, magnified, RTL where applicable, and
  light/dark states
- focus handling across redirects, method-choice updates, and forced-login
  return states

If no shared render/controller seam exists for this flow, Layer 3 must stop
and ask for a design-system decision rather than copying root-login markup or
controller behavior into a tenant app page.

## Risks And Open Questions

| Risk / question | Steering posture | Required before Layer 3? |
| --- | --- | --- |
| Existing tenant auth policy may not yet model method choice, SSO fallback, or forced re-login. | Extend through explicit PRD/capability/API planning, not ad hoc source edits. | yes |
| Pre-auth tenant discovery can leak tenant membership. | Use generic no-match posture and carefully planned disclosure thresholds. | yes |
| Shared principal across tenants can confuse per-tenant email uniqueness and method policy. | Reconcile with ADR-0019 and ADR-0020 before schema or API design. | yes |
| Active-session invalidation may require scheduler, pub/sub, polling, or request-time checks. | Decide reliable enforcement and retry/audit behavior before implementation. | yes |
| SSO provider outage and callback behavior can become provider-specific architecture. | Defer provider-specific implementation until SSO contract is planned. | yes |
| Design-system login seams may not support tenant selection and method choice. | Run design-system governance before app UI. | yes |
| Password reset must not bypass tenant method policy. | Bind reset availability and tokens to selected tenant/method policy. | yes |

## Layer 3 Entry Criteria

Layer 3 may start only after this steering packet is accepted and the next work
is explicitly requested.

Before implementation planning or source edits, Layer 3 must perform a
source-of-truth review against the current repo, not only this steering packet.
At minimum, review:

- architecture docs:
  `docs/architecture/system-overview.md`,
  `docs/architecture/frontend-overview.md`,
  `docs/architecture/priniciples.md`,
  `docs/architecture/change-control.md`,
  `docs/architecture/guides/auth-and-authorization-guide.md`,
  and
  `docs/architecture/guides/tenant-auth-policy-and-tenant-configuration-guide.md`
- ADR discovery:
  `0002-use-feature-bundle-architecture.md`,
  `0006-standardize-feature-internal-module-conventions.md`,
  `0007-standardize-cross-feature-api-and-entity-behavior-defaults.md`,
  `0009-separate-authentication-from-business-features.md`,
  `0010-use-shared-platform-security-middleware.md`,
  `0011-adopt-prd-driven-traceable-test-coverage.md`,
  `0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`,
  `0017-add-a-shared-one-time-token-library-for-feature-owned-verification-flows.md`,
  `0018-add-a-notification-delivery-feature-with-provider-agnostic-email-delivery-and-durable-attempt-history.md`,
  `0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`,
  `0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md`,
  `0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md`,
  `0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`,
  `0025-adopt-a-security-first-page-state-replay-model.md`,
  `0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md`,
  `0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`,
  `0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`,
  `0030-enforce-feature-public-seams-with-a-generated-dependency-graph.md`,
  `0031-add-feature-manifests-for-declared-seams-and-dependencies.md`,
  and `0032-promote-selected-root-admin-suites-from-hash-aliases-to-path-backed-canonical-routes.md`
- architecture-map layers:
  tenant isolation, authorization, root-user authentication, tenant-side
  authentication, tenant configuration, verification/recovery tokens, SSO
  federation, email platform, browser security, frontend design system,
  frontend implementation, privacy, audit, and compliance/evidence posture
- feature manifests:
  `tenantAuth`, `tenantConfiguration`, `tenantAdmins`, `tenants`, `rootRoles`,
  `rootAuth`, and any touched feature manifests, plus generated dependency
  graph artifacts if public seams or dependencies change
- API and data docs:
  maintained API contracts, OpenAPI/Postman artifacts, data dictionaries,
  auth/session docs, tenant-auth policy docs, and migration files for any
  auth, tenant, membership, session, token, or configuration table touched
- permission docs:
  capability matrices and `docs/workspace/permission-mappings/*` for root
  configuration, tenant-auth session, password reset, and provider/fallback
  capabilities
- design-system docs:
  existing login, shell, page, drawer, form, error, and state-message
  behavior locks/reference packs/canonicals/adoption contracts
- test harness docs:
  auth integration tests, persistence harnesses, session/logout tests,
  token/reset tests, frontend visual/browser scenarios, and mock-honesty
  guidance

If Layer 3 uncovers a missing source-of-truth doc, stale artifact,
contradictory instruction, missing shared render/controller seam, unplanned
permission boundary, or test-harness gap, it must warn explicitly before
implementation proceeds. If the gap affects auth authority, tenant isolation,
session invalidation, account enumeration, design-system adoption, API/data
contract, migration safety, or verification evidence, Layer 3 must stop and
ask for a governance decision instead of filling the gap silently.

Minimum entry criteria for tenant-aware login Layer 3:

- PRD scope and non-goals approved
- capability matrix approved for root config, login, tenant selection, method
  choice, reset, SSO fallback, and session invalidation
- tenant-context, membership-refresh, forced-login, and no-match privacy
  posture approved
- design-system behavior-lock scope approved before app UI
- SSO provider and password-reset boundaries classified
- persistence, migration, audit, and permission planning started from live
  schema and current feature seams

## Explicit Non-Goals For This Packet

- no PRD
- no capability matrix
- no implementation blueprint
- no route or source-code change
- no tenant login UI
- no root-admin configuration UI
- no provider integration
- no password reset implementation
- no session invalidation implementation
- no persistence or migration
- no API contract
- no permission-mapping update
- no generated design-system artifact

## Recommended Next Step

When the requester approves moving beyond Layer 2, start the PRD and
capability-matrix loop for tenant-aware login in parallel with a
design-system governance loop for the reusable login/tenant-selection/method
choice pattern. Do not implement real tenant app UI until the design-system
seam and adoption path are explicitly accepted.
