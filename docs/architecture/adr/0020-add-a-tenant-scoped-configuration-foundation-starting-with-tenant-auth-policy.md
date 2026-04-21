# ADR-0020: Add A Tenant-Scoped Configuration Foundation Starting With Tenant Auth Policy

- Status: Accepted
- Date: 2026-04-09
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform now has:

- durable `tenant` records
- a shared `tenantAuth` principal model
- an explicit current-tenant session-selection model
- a forward-looking need for tenant-specific runtime behavior

The immediate proof of concept is tenant-specific password requirements.

The longer-term platform direction also needs to support tenant-scoped:

- password rules
- allowed authentication methods
- SSO / federation provider selection
- session-policy differences
- feature toggles
- field-label or field-schema differences
- retention and compliance settings
- billing and other business-rule settings

At the same time, the tenant-auth model already allows one shared principal to
access multiple tenants. A naive tenant-password-policy design can become
incompatible with:

- one tenant using password while another uses SSO only
- two tenants using different identity providers
- one human authenticating differently across different tenant contexts

If the platform stores tenant runtime configuration as one generic JSON blob, it
risks weak validation, unclear ownership, and difficult indexing or auditing.

If the platform stores authentication method directly as a global property of
the shared principal, it risks blocking mixed tenant auth behavior later.

## Decision

Add a dedicated tenant-scoped configuration foundation as a feature-owned seam.

Current rules:

- tenant-scoped runtime configuration should be owned by a dedicated feature
  rather than hidden inside unrelated features
- the first configuration family should be `tenantAuthPolicy`
- the configuration foundation should prefer typed family-specific persistence
  models over one catch-all mutable JSON blob as the primary durable source of
  truth
- family-specific records may still use narrowly approved structured fields when
  justified, but the default posture is explicit columns and explicit contracts
- system defaults remain defined centrally and must be applied whenever a tenant
  has no override for a given configuration family or field
- tenant configuration resolution must produce one explicit effective policy
  rather than forcing downstream features to hand-merge fallback behavior

For tenant-side authentication, keep these concerns distinct:

- shared principal identity
- tenant access grant
- tenant-scoped auth-method binding
- tenant auth policy

Rules for those seams:

- the shared principal remains the durable person/account-level identity seam
- tenant access grants continue to express which tenant-scoped subject contexts
  that principal may access
- authentication-method binding must not be modeled only as a global property of
  the shared principal
- tenant auth policy must govern what auth methods and auth constraints are
  allowed or required for a given tenant
- future SSO or federation work must be modeled as tenant-scoped provider
  definitions and tenant-scoped auth bindings rather than as a replacement for
  the shared principal model

Rules for the initial password-policy slice:

- implement password policy as part of `tenantAuthPolicy`, not as an isolated
  one-off password-settings seam
- password policy should support system defaults plus tenant overrides for:
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
- password-policy overrides should be stored durably per tenant
- policy validation must enforce internally valid bounds such as:
  - minimum values not below zero
  - maximum values not below corresponding minimums
  - aggregate minimum requirements not exceeding a configured maximum length
    when a maximum exists
- password policy should be enforced when credentials are set or changed, not
  retroactively during login

Compatibility rule for the current shared-principal tenant-auth model:

- until tenant-scoped auth-method bindings replace password access as a uniform
  principal-level credential path, effective password requirements for a shared
  principal must be resolved compatibly with all active tenant grants that still
  allow password authentication
- during that phase, stricter compatible aggregation is preferred over
  tenant-by-tenant credential divergence

## Consequences

### Positive

- the platform gets a durable tenant-configuration pattern instead of ad hoc
  settings hidden across features
- tenant-specific password policy can ship now without blocking future mixed
  password and SSO models
- future auth work can add tenant-scoped provider definitions and auth bindings
  without replacing the current principal/access-grant/session architecture
- typed family-specific persistence keeps validation, indexing, and auditing
  clearer than a generic settings blob
- downstream features can depend on resolved effective policy seams rather than
  implementing their own fallback logic

### Negative

- introducing a dedicated tenant-configuration seam adds feature and migration
  work earlier than a quick one-table shortcut
- current shared-password semantics across multiple tenants still create an
  interim compatibility constraint until tenant-scoped auth-method bindings are
  implemented
- some future configuration families may need their own specialized persistence
  models instead of fitting into a single generic admin UI or repository shape

### Neutral / Follow-up

- later work should define:
  - the exact feature name and initial route surface for tenant configuration
  - audit expectations for tenant-configuration changes
  - root-operated versus tenant-operated management scope per configuration
    family
  - tenant-scoped SSO provider definitions
  - tenant-scoped auth-method bindings between principals and providers
  - migration strategy from shared-principal password aggregation to richer
    tenant-scoped auth methods where needed
- future configuration families may include:
  - tenant auth policy
  - feature flags
  - field naming or display configuration
  - entity extension-field configuration
  - retention and compliance policy
  - billing and plan policy
