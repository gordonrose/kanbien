# ADR-0019: Add A Shared Tenant Auth Foundation With Principals, Access Grants, And Session-Based Tenant Selection

- Status: Accepted
- Date: 2026-04-09
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform now has:

- `tenantAdmins` as a tenant-scoped actor/profile feature
- shared one-time token support
- shared notification delivery

The next step is to let tenant-side actors authenticate.

The architecture already established through ADR-0009 that authentication must
stay separate from business-profile features. That separation should remain
true for tenant-side actors as well.

At the same time, the longer-term tenant model needs to support:

- one human accessing multiple tenants
- future tenant actors that are not tenant admins
- tenant-scoped authorization evaluated in one current tenant context
- frontend-ready login and tenant-selection flows

If the platform folds credentials and sessions directly into `tenantAdmins`,
it risks creating a one-off login model that future tenant users cannot reuse
cleanly.

## Decision

Add a new shared tenant-side authentication feature:

`src/features/tenantAuth/`

Current rules:

- `tenantAuth` owns non-root tenant-side authentication concerns
- `tenantAdmins` remains the tenant-scoped actor/profile feature for
  tenant-admin lifecycle and verification
- a verified active `tenantAdmin` may bootstrap one shared non-root auth
  principal
- the shared non-root auth principal owns:
  - globally unique normalized login email
  - password state
  - credential ownership
  - tenant-side session identity
- durable access from one principal into one tenant-scoped actor context is
  represented through a feature-owned `tenantAccessGrant`
- `tenantAccessGrant` is the durable linkage between:
  - one shared auth principal
  - one tenant
  - one tenant-scoped subject such as a `tenantAdmin`
- the model must stay open to future tenant-scoped subject types beyond
  `tenantAdmin`
- one principal may hold multiple tenant access grants
- tenant-side login authenticates the shared principal, not the tenant-admin
  row directly
- successful login creates a server-backed tenant session
- active tenant context is owned by the authenticated tenant session
- if the principal can access exactly one tenant context, login auto-selects
  that tenant on the session
- if the principal can access multiple tenant contexts, login succeeds but the
  session requires explicit tenant selection before a current tenant context is
  established
- initial password setup is a separate onboarding capability and does not
  implicitly create a session
- forgot-password reset, MFA, advanced device/session management, and broader
  tenant-user onboarding are intentionally out of scope in the first slice

## Consequences

### Positive

- tenant-side authentication stays separate from tenant-admin business/profile
  lifecycle
- the platform gets one reusable non-root auth model instead of an admin-only
  login design
- one principal can cleanly support multi-tenant access
- session-backed active-tenant selection aligns with ADR-0016's requirement
  that authorization evaluate in one current tenant context
- future tenant users can reuse the same principal/session foundation
- frontend-facing login and tenant-selection flows can be designed once and
  extended rather than rewritten

### Negative

- the first tenant-auth slice introduces more initial plumbing than storing a
  password directly on `tenantAdmins`
- the platform must own new durable models for principals, access grants, and
  tenant sessions before broader tenant-user functionality exists
- bootstrap from verified `tenantAdmin` into shared principal introduces
  cross-feature coordination between `tenantAdmins` and `tenantAuth`

### Neutral / Follow-up

- later work should define:
  - forgot-password reset against the shared principal model
  - MFA or stronger tenant-side proof requirements if needed
  - richer tenant-user onboarding flows
  - final browser transport details such as cookie policy
  - broader tenant membership and role-bearing subject models
- if later work introduces more generalized membership records, the current
  `tenantAccessGrant` model may evolve behind feature-owned seams rather than
  changing consumer-facing authentication contracts
