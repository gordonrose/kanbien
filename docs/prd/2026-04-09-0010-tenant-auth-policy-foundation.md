# Tenant Auth Policy Foundation

## Summary

Add the first tenant-scoped configuration family through a new
`tenantConfiguration` feature, starting with `tenantAuthPolicy`.

Phase one delivers:

- root-admin read and update of tenant auth policy
- tenant-admin read of current-tenant effective auth policy
- system defaults plus tenant overrides for password policy
- remediation-required workflow support in `tenantAuth`

This slice is backend-only and must stay compatible with the current shared
tenant-auth principal model and later tenant-scoped SSO work.

## Scope

The slice provides the backend capabilities required for:

- reading effective tenant auth policy as root for any target tenant
- reading effective tenant auth policy as the current tenant-admin actor
- updating tenant password-policy overrides as root
- enforcing effective password policy at password set/change time
- returning truthful remediation-required login/session states when a valid
  existing password no longer satisfies current policy
- allowing remediation-gated password change through `tenantAuth`

This slice does not provide:

- tenant-admin self-service policy edits
- browser/admin UI
- SSO provider records
- MFA
- password reset flows
- policy history read UI

## Business Rules

- system defaults exist centrally and apply whenever a tenant has no override
- phase-one password fields are:
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
- hard platform floors are:
  - `minLength >= 6`
  - `minUppercase >= 1`
  - `minLowercase >= 1`
  - `minNumbers >= 1`
  - `minSymbols >= 1`
- recommended platform ceiling is `maxLength <= 128`
- `min <= max` when a maximum exists
- aggregate mins must not exceed `maxLength` when `maxLength` exists
- root admins can read and edit any tenant policy
- tenant admins can read only their own current tenant's effective policy
- tenant policy changes take effect immediately
- no policy-bypass or support-bypass path exists in phase one

## Shared-Principal Compatibility Rule

The current `tenantAuth` model uses one shared principal credential across
multiple tenant grants.

Therefore:

- password-policy enforcement for password set/change must resolve against the
  strictest compatible aggregate policy across active password-enabled tenant
  contexts
- tenant policy read remains tenant-specific
- remediation state is attached to the authenticated tenant session and must
  remain truthful for the selected tenant workflow

## Phase-One Routes

### Root

- `GET /v1/tenants/:tenantId/auth-policy`
- `PATCH /v1/tenants/:tenantId/auth-policy`

### Tenant

- `GET /v1/tenant/auth-policy`

### Tenant Auth Remediation

- `GET /v1/tenant-auth/remediation`
- `POST /v1/tenant-auth/remediation/password`

## Response Direction

Effective policy responses must return:

- `tenantId`
- `policySource`
- `hasTenantOverride`
- effective password-policy fields
- hard platform floors
- `updatedAt`

Tenant-auth remediation/session responses must return:

- whether remediation is required
- remediation reason
- current tenant summary when available
- effective password-policy requirements relevant to remediation

## Persistence Direction

Add one durable tenant-scoped auth-policy row with explicit override columns
plus timestamps.

Also extend tenant sessions so remediation-required state can persist after
successful login without depending on access to the raw password later.

## Security And Audit Expectations

- root policy reads and writes use explicit root capability checks
- tenant policy self-read uses authenticated current tenant session context only
- remediation routes are self-service only and must deny cross-session access
- successful policy changes are audited
- successful remediation completion is audited
- denied privileged operations remain auditable through existing standards

## Verification Expectations

Required layers for this slice:

- unit
- integration
- security
- audit
- end-to-end journey
- persistence-backed verification
- concurrency/idempotency where one-time remediation or session-state mutation
  truth depends on durable state

Required human QA artifacts:

- QA checklist
- exploratory QA note
- curated run summary

## Follow-Up

Later slices should add:

- auth-method mode such as `password_only` and `sso_only`
- tenant-scoped SSO/provider definitions
- tenant-scoped auth-method binding records
- password reset and non-password remediation workflows
