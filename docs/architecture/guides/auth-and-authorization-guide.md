# Authentication And Authorization Guide

## Purpose

Explain how authentication and authorization should stay separate, and where
future role/capability enforcement belongs in the repo.

## Current State

The current repo has:

- explicit authentication through `rootAuth`
- root-user lifecycle ownership in `rootUsers`
- shared request auth-context establishment
- browser and bearer transport variants for sessions
- a documented current authorization mapping for the live `RootUserAdmin`
  boundary under `docs/architecture/permission-mappings/`

The repo also has an initial enduring future authorization direction captured in:

- [`ADR-0016`](../adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md)
- [`ADR-0019`](../adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md)
- [`ADR-0020`](../adr/0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md)
- [`ADR-0036`](../adr/0036-adopt-layered-platform-authorization-evaluation.md)
- [`ADR-0037`](../adr/0037-separate-tenant-operational-lifecycle-from-deletion-posture.md)
- [`2026-03-30-0003-tenant-role-based-authorization-architecture.md`](../../prd/2026-03-30-0003-tenant-role-based-authorization-architecture.md)

That tenant-scoped implementation is still pending, but the intended
architecture is now documented rather than left implicit.

The tenant-auth and tenant-configuration direction should also be read together:

- shared `tenantAuth` principal and session architecture comes from ADR-0019
- tenant-scoped auth policy and future tenant-config direction comes from
  ADR-0020
- the layered authorization evaluation order, grant-source posture,
  support/emergency access posture, lifecycle gate, and future ABAC/ReBAC
  extension rules come from ADR-0036
- the separation between tenant operational lifecycle and deletion posture comes
  from ADR-0037
- the shared API denial status/code/message posture comes from
  [`platform-authorization-denials`](../../api-contracts/platform-authorization-denials.md)

For more detail on tenant-scoped auth policy and future SSO compatibility, see:

- [Tenant Auth Policy And Tenant Configuration Guide](./tenant-auth-policy-and-tenant-configuration-guide.md)

## Separation Rule

- `rootAuth` establishes identity and session context.
- Business features must not embed unrelated authentication concerns.
- Authorization decisions should be capability-specific, explicit, and routed
  through the central authorization seam rather than being re-implemented
  inside feature logic.

## Actor Classes

The platform now has two deliberately distinct authorization worlds:

- `root` actors
  permanent platform operators outside normal tenant authorization
- `tenant` actors
  users, admins, or future service actors operating inside one tenant context

Do not blur these classes casually.

Defaults:

- root capabilities govern platform-management behavior
- tenant capabilities govern tenant-scoped business behavior
- any shared-cross-tenant capability should be treated as exceptional and
  explicitly reviewed

## Tenant Context Rule

Now that `tenant` is a durable entity, non-root capabilities that act on
tenant-scoped data must be evaluated in exactly one current tenant context per
request.

That means the design should define:

- which actor type is authenticated
- which tenant is current for the request
- which capability is being checked
- which entity/object rule also applies when relevant
- what the explicit cross-tenant deny rule is

Do not infer tenant context from mutable payload fields when route params,
session context, or an approved explicit selection step should own it.

## Session And Token Guidance

It is not correct to say that `tenantId` must now always be embedded in the
auth token.

The right rule is:

- tenant-scoped requests need a validated current tenant context in the auth
  context
- how that context is carried depends on the session model

For this repo's current architecture:

- bearer tokens are opaque server-backed session identifiers
- the token string itself does not need to expose `tenantId`
- root-user sessions should remain tenant-agnostic platform-operator sessions
  unless a future design explicitly binds them to a tenant context

For a future tenant-actor session model:

- the server-side session or validated token claims may carry the current
  tenant context
- but authorization must still be enforced server-side against exactly one
  current tenant context per request
- a multi-tenant principal should not gain broad tenant access simply because
  it belongs to many tenants; the active tenant context still needs to be
  selected and enforced

## Future Authorization Expectations

For every privileged capability, the docs should define:

- capability boundary:
  `root`, `tenant`, or explicitly approved shared-cross-tenant
- allowed roles
- minimum role required
- explicitly denied roles when a later model introduces denies
- tenant context rule when the capability is tenant-scoped
- frontend visibility rule
- backend enforcement rule
- audit expectations for actor role capture

## Enforcement Rule

- Frontend may hide or disable capability surfaces.
- Backend must remain authoritative and enforce permission rules regardless of
  UI behavior.

## Layered Evaluation Rule

Tenant-scoped authorization should follow the layered evaluation envelope from
ADR-0036:

1. authentication and session context
2. tenant boundary and lifecycle
3. feature, configuration, and entitlement gate
4. RBAC
5. ABAC extension when a feature has approved attribute sources
6. ReBAC or object-rule extension when a feature has approved relationship
   resolvers
7. audit, proof, and safe denial mapping

Do not treat these layers as separate feature-local systems. They should be
represented through a central authorization decision path with explicit inputs,
outputs, reason codes, and downstream proof expectations.

The central evaluator seam is defined in
`docs/workspace/technical-steering/2026-05-04-platform-authorization-model-steering.md`.
The evaluator owns evaluation order, root/tenant authority separation, denial
normalization, and decision proof. Feature-owned resolvers may supply facts, but
they must not bypass the evaluator with independent final allow/deny decisions.

The same Technical Steering packet defines the authz-specific audit/event
taxonomy for support, emergency, access decisions, denials, grant changes,
lifecycle effects, and job authority. That taxonomy is not a complete
observability or alerting architecture.

For v1 tenant authorization:

- the first tenant role is `adminOwner`
- `adminOwner` is globally consistent across tenants
- tenant-specific role divergence is not allowed
- tenant-created custom roles are out of scope
- tenant self-service tenant-admin management is out of scope
- future tenant role template versioning and upgrade policy remains deferred

Root/operator role names should use a `root...` prefix. Tenant/account admin
role names should use an `admin...` prefix. The prefix describes the authority
world, not just the role's power level.

## Feature And Entitlement Gate

Root users own tenant branding, tenant admin management, pricing, tiers,
limits, commercial entitlements, support, and emergency powers.

Tenant admins own day-to-day tenant account operation within root-approved
availability. Once root has made a feature, option, or entitlement available to
a tenant, `adminOwner` may activate or deactivate that option unless a more
specific future policy says otherwise.

Feature flags, plan grants, and tenant configuration must not expand access
beyond root-approved availability and tenant-scoped authorization.

## Grant Source Posture

Authorization artifacts must distinguish planned permission ideas from usable
runtime grants.

Grant source posture values:

- `documentation-only`
  planned or documented only; not selectable or usable
- `seed-backed`
  seeded into durable catalog or grants, but not enough by itself for UI use
- `corrective-migration-backed`
  repaired or backfilled through corrective migration, and usable only with
  runtime enforcement proof
- `runtime-enforced`
  enforced by code in the active request path and eligible only with durable
  source truth
- `blocked`
  must not be granted, selected, or used

Only fully implemented, runtime-backed capabilities may be usable through UI or
admin workflows.

## Support And Emergency Access

Root support access is root-scoped read-only visibility into customer context.
It is not tenant impersonation.

Rules:

- support viewing requires an explicit reason or reference
- support viewing follows root session time-bound rules in v1
- support viewing is internally audit-visible
- customer-visible root staff access history is out of scope for v1
- root staff must not mutate tenant-owned data from inside a tenant context
- root support mutations must happen through explicit root-admin capabilities

`rootAdmin` emergency powers are allowed when backed by explicit root
capabilities. Emergency actions require reason/reference and high-severity
internal audit. A formal product-created post-use review queue is deferred, but
emergency actions should remain reviewable from internal audit history.

## Tenant Lifecycle Gate

Tenant lifecycle should be checked before normal feature authorization.

Tenant operational lifecycle values:

- `draft`
  tenant exists under strict rate and usage limits
- `live`
  tenant is active and billed; limits are tied to plan or entitlement
- `disabled`
  read and export access are allowed; normal writes and new use are restricted
- `inactive`
  normal login is blocked; recovery depends on inactive reason

Tenant deletion posture values:

- `active`
- `softDeleted`
- `hardDeletePending`
- `hardDeleted`

Operational lifecycle answers whether the tenant may operate. Deletion posture
answers whether the tenant still exists for normal product purposes and which
recovery, retention, or purge behavior applies.

`inactive` must have an explicit reason code. Approved reason codes are:

- `nonPayment`
- `contractEnded`
- `securityReview`
- `customerRequestedPause`
- `complianceHold`
- `fraudRisk`
- `migration`
- `rootAdministrative`
- `unknown`

Lifecycle and deletion transitions should be represented as durable events, not
only as current-state fields. ADR-0037 defines the required event families and
the access matrix for `draft`, `live`, `disabled`, `inactive`, `softDeleted`,
`hardDeletePending`, and `hardDeleted` tenants.

Hard delete must be policy-backed and job-executed. UI may request deletion,
but UI must not directly delete tenant data.

Background jobs should respect tenant lifecycle. Jobs may continue for disabled
tenants when needed to avoid disruption. Normal cost-generating tenant work
should not continue for inactive tenants unless it is required for recovery,
retention, compliance, billing resolution, cleanup, or notifications.

Jobs use explicit system authority and must preserve initiating actor, tenant
context, reason or policy source, and relevant authorization proof where
applicable.

## Denial And Proof

API and UI behavior should distinguish at least these product-level denial
categories before route implementation:

- unauthenticated
- tenant selection not complete
- tenant context invalid or unavailable
- tenant lifecycle restricted
- feature, configuration, or entitlement unavailable
- tenant activation or configuration missing
- role or capability missing
- object or relationship rule denied
- attribute rule denied
- sensitive or generic fallback denial

Internal reason codes may be more precise than user-facing messages. User
messages should help recovery when safe and avoid disclosing hidden records,
cross-tenant existence, security internals, or platform detection methods.

Future route-family API contracts should consume
`docs/api-contracts/platform-authorization-denials.md` for shared authn/authz
denial behavior or record an explicit compatibility exception.

## Recoverability Rule

To rebuild authorization safely from specs, the repo needs:

- role definitions
- capability-to-role mapping
- persistence location of role assignments
- session/bootstrap exposure rules
- backend enforcement seam
- test expectations for allow and deny paths

For the current intended model, it also needs:

- tenant membership model
- tenant role copy and divergence rules
- capability catalog ownership
- scope evaluation model for reads and lists
- inheritance and relation-resolution rules
- authorization audit model

## Current Documentation Expectation

For the current implemented root boundary, privileged capabilities should align
with the live permission mapping docs.

For future feature sets that introduce new roles or permissions, every new
privileged capability should at least declare:

- capability boundary classification
- authentication requirement
- intended authorization shape
- tenant context rule when relevant
- cross-tenant deny rule when relevant
- where the future permission rule will be enforced
- grant source posture and runtime enforcement proof when the capability is
  intended to appear in UI or admin workflows
- safe denial category and audit/proof expectation

Now that the dedicated architecture is defined, new authorization-sensitive
work should align with the ADR trail above instead of inventing local role,
capability, or policy-layer patterns.
