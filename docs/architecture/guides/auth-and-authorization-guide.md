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
- [`2026-03-30-0003-tenant-role-based-authorization-architecture.md`](../../prd/2026-03-30-0003-tenant-role-based-authorization-architecture.md)

That tenant-scoped implementation is still pending, but the intended
architecture is now documented rather than left implicit.

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

Now that the dedicated architecture is defined, new authorization-sensitive
work should align with the ADR/PRD pair above instead of inventing local role
or capability patterns.
