# Tenant Auth Policy And Tenant Configuration Guide

## Purpose

Explain how tenant-scoped runtime configuration should be modeled so the first
password-policy slice stays compatible with later SSO, multi-provider, and
broader tenant-configuration work.

## Governing ADRs

- [ADR-0019](../adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md)
- [ADR-0020](../adr/0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md)

## Separation Rules

Keep these seams separate:

- shared principal identity
- tenant access grant
- tenant auth policy
- tenant-scoped auth-method binding

They answer different questions:

- principal identity:
  who is the durable non-root account?
- tenant access grant:
  which tenant-scoped subject contexts can that principal enter?
- tenant auth policy:
  what authentication methods and constraints are allowed or required for that
  tenant?
- tenant-scoped auth-method binding:
  which provider/account/path may that principal use for that tenant?

Do not collapse these into one record.

## Configuration Foundation Rules

For tenant-scoped runtime configuration:

- use a dedicated feature-owned seam
- resolve one effective tenant policy from:
  - system defaults
  - tenant overrides
- prefer family-specific typed persistence
- do not use one generic JSON blob as the default durable source of truth
- keep configuration-family validation explicit
- keep audit and ownership rules explicit per family

## First Family: Tenant Auth Policy

The first configuration family should be `tenantAuthPolicy`.

Its scope should stay broader than password-only settings so it can later own:

- password difficulty rules
- allowed auth methods such as password, SSO, or hybrid transition states
- tenant session-policy differences
- SSO enforcement requirements
- MFA requirements if introduced later

### Password Policy Fields

The initial password-policy slice should support:

- `minLength`
- `maxLength`
- `minUppercase`
- `maxUppercase`
- `minLowercase`
- `maxLowercase`
- `minNumbers`
- `maxNumbers`
- `minSymbols`
- `maxSymbols`

Recommended storage posture:

- one tenant-scoped typed row for password-policy overrides
- nullable override columns
- durable audit timestamps
- explicit ownership by `tenantId`

Recommended validation rules:

- all minimum values are zero or greater
- all maximum values are zero or greater when present
- `min <= max` for each character class when a maximum exists
- aggregate minimum character requirements do not exceed `maxLength` when a
  maximum exists
- policy changes do not mutate stored credentials directly

## Password Enforcement Rule

Password policy should be enforced when:

- a password is first set
- a password is changed
- a password is reset

Password policy should not be used to retroactively reject login for an already
stored credential just because tenant policy became stricter later.

## Compatibility With The Current Shared-Principal Model

Today one shared principal can access multiple tenants.

That means tenant password policy is not equivalent to one tenant owning one
separate password store.

Until tenant-scoped auth-method bindings are added:

- password access still behaves as a shared principal credential path
- effective password requirements should be resolved compatibly across the
  principal's active tenant grants that still allow password authentication
- the safest interim rule is to aggregate to the strictest compatible effective
  password policy rather than diverging credential semantics per tenant

This preserves compatibility with the current shared-principal architecture
while leaving room for richer tenant-scoped auth later.

## Future SSO / Federation Compatibility

The intended future model is compatible with:

- Tenant A using password only
- Tenant B using SSO only
- Tenant C allowing both password and SSO during migration
- different tenants using different providers
- the same human reaching different tenants with different auth paths

To support that cleanly:

- keep the shared principal as the durable identity seam
- model SSO providers as tenant-scoped provider configuration
- model provider-account links as tenant-scoped auth-method bindings
- let tenant auth policy decide which methods are allowed or required
- continue to resolve exactly one current tenant context per request after
  authentication succeeds

## Persistence Guidance

Default persistence posture for tenant configuration:

- use scalar searchable columns for scalar searchable settings
- use one table per enduring configuration family when the family has its own
  lifecycle, validation, or indexing needs
- avoid comma-separated lists
- require explicit approval before using JSONB or arrays for searchable
  tenant-configuration state

## Implementation Direction

The recommended first implementation slice is:

1. add a dedicated tenant-configuration feature seam
2. add a `tenantAuthPolicy` family with system defaults plus tenant overrides
3. move tenant password validation behind a feature-owned policy resolver seam
4. stop depending on `rootAuth` error types for tenant password validation
5. leave provider-specific SSO records out of the first slice, but shape the
   auth-policy seam so they fit without redesign
