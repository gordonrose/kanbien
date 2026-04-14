# Tenant Admins Auth-Ready Foundation Specification

## Purpose

Define the first backend slice for `tenantAdmins` after the shared one-time
token and `notificationDelivery` foundations were added.

This slice introduces a durable tenant-scoped admin actor record that is ready
for later tenant authentication without prematurely collapsing the larger
shared-principal and tenant-session architecture into the `tenantAdmins`
feature itself.

It provides the backend capabilities required for:

- create
- exact visible lookup
- tenant-scoped filtered and paginated visible listing
- profile update
- send verification email
- resend verification email
- redeem verification token
- restart onboarding for an already verified tenant-admin
- soft delete
- reactivation

It also establishes:

- tenant-owned admin actor records
- durable creator attribution
- tenant-scoped active-email uniqueness
- durable email-verification state
- feature-owned verification workflow semantics
- a clean migration path toward the later shared tenant-auth and
  principal/membership architecture

---

## Scope

This phase includes:

- authenticated backend routes under `/v1/tenants/:tenantId/admins`
- creation of tenant-admin records for one tenant
- exact visible lookup by `tenantAdminId` inside one tenant
- filtered and paginated visible listing inside one tenant
- update of editable tenant-admin profile metadata
- root-operator-triggered verification email send
- root-operator-triggered verification email resend
- public verification-token redemption without tenant login
- protected operator onboarding restart for already verified tenant-admins who
  still need tenant-auth password setup
- soft delete
- reactivation
- durable creator attribution through `createdByRootAdminUserId`
- durable tenant ownership through `tenantId`
- durable normalized email storage and active uniqueness inside one tenant
- durable verification-state storage on the tenant-admin record

This phase does **not** include:

- tenant-admin login
- tenant-admin browser session creation
- shared auth-principal creation
- password creation or password reset
- tenant selection or current-tenant resolution
- tenant memberships
- tenant roles or role assignments
- tenant-user lifecycle management
- permanent remove
- self-service tenant-admin signup
- tenant-admin-managed creation of memberships or tenant users

Those later capabilities are exactly why this slice exists, but they are not
implemented here.

The new onboarding-restart capability is intentionally narrow:

- it does not create a tenant session
- it does not replace password setup
- it does not resend verification for already verified rows
- it only recovers the verified-but-not-finished onboarding gap by asking the
  shared tenant-auth layer for a fresh onboarding result

---

## Core Concepts

### Tenant admin

A `tenantAdmin` is a durable tenant-owned admin actor record.

In this phase, it is still a tenant-scoped admin/profile record, not yet a
full authenticated principal.

Each row is expected to have at least:

- `tenantAdminId`
- `tenantId`
- `email`
- optional `firstName`
- optional `lastName`
- `emailVerificationStatus`
- `emailVerifiedAt`
- `lastVerificationEmailRequestedAt`
- `createdByRootAdminUserId`
- `createdAt`
- `updatedAt`
- `deletedAt`

### Tenant ownership

Every `tenantAdmin` belongs to exactly one tenant in this phase.

All tenant-admin routes must carry the owning `tenantId`, and every exact read
or mutation must verify that the target `tenantAdmin` belongs to that route
tenant.

### Email identity rule

`email` is required and stored in normalized form.

Rules:

- trim whitespace
- store lowercase
- reject empty values
- enforce active uniqueness within one tenant only

That means:

- `(tenantId, normalizedEmail)` must be unique among active rows
- the same email may appear in different tenants

This keeps the slice compatible with the later shared principal and membership
architecture where one human may belong to multiple tenants.

### Email verification state

This phase introduces durable verification readiness on the tenant-admin row.

Initial rules:

- create sets `emailVerificationStatus` to `pending`
- create sets `emailVerifiedAt` to `null`
- create sets `lastVerificationEmailRequestedAt` to `null`
- successful token redemption sets:
  - `emailVerificationStatus` to `verified`
  - `emailVerifiedAt` to the redemption time
- if the normalized email changes later, prior verification evidence is no
  longer trusted and the row returns to:
  - `emailVerificationStatus = pending`
  - `emailVerifiedAt = null`
- verification send and resend stamp `lastVerificationEmailRequestedAt`

This phase keeps the enum intentionally small:

- `pending`
- `verified`

Richer verification-state values are deferred until a later slice proves they
are required for distinct behavior.

### Creator attribution

Each row stores `createdByRootAdminUserId` durably.

It must be populated from the authenticated root session's `rootUserId`, not
from client input.

### Visible row

A visible tenant-admin row is one whose `deletedAt` is `null`.

Visible rows participate in:

- normal exact lookup
- normal list
- update
- verification send and resend

### Soft delete

Soft delete preserves the tenant-admin row while removing it from normal active
visibility.

Rules:

- `deletedAt` is set
- `updatedAt` is refreshed
- the durable row remains available for later reactivation
- existing verification tokens for that tenant-admin must no longer be usable
- verification trust must not remain active while the row is deleted

### Reactivation

Reactivation is the inverse of soft delete.

Rules:

- only deleted rows may be reactivated
- `deletedAt` is cleared
- `updatedAt` is refreshed
- active `(tenantId, normalizedEmail)` uniqueness is rechecked before restore
- the row returns to:
  - `emailVerificationStatus = pending`
  - `emailVerifiedAt = null`
- prior verified state is not trusted after delete/reactivate in this slice

---

## Why This Slice Exists Before Shared Tenant Auth

The future architecture wants:

- authentication as its own concern
- a shared non-root auth principal
- credential ownership separated from tenant-scoped actor/profile records
- tenant selection or current-tenant resolution after authentication
- tenant memberships and tenant role assignments

That is still the right enduring direction.

This `tenantAdmins` slice is the smaller safe step because it gives the repo a
real tenant-owned admin actor record with:

- tenant ownership
- tenant-scoped PII handling
- lifecycle semantics
- verification-readiness
- auditability
- cross-tenant isolation rules

without prematurely deciding:

- where tenant passwords live
- how tenant sessions are issued
- how tenant selection works
- how shared principals link to tenant-owned records

This slice must therefore stay intentionally narrow and migration-friendly.

---

## Two-Loop Boundary

This PRD should be read as the first of **two** related but separate feature
loops.

### Loop 1: `tenantAdmins` auth-ready foundation

This loop owns:

- the durable tenant-admin actor/profile record
- root-managed lifecycle
- verification-ready state
- verification send and resend
- verification-token redemption

This loop does **not** own:

- password creation
- login
- session issuance
- tenant selection
- shared principal creation

### Loop 2: shared tenant-auth foundation

This later loop should own:

- shared non-root auth principal
- credential ownership
- initial password set after verification
- login
- session issuance
- tenant selection and current-tenant resolution
- linkage from principal to tenant-scoped actor/profile or membership

That split preserves the intended architecture:

- authentication remains its own concern
- tenant-scoped actor/profile records remain separate
- tenant context is resolved after authentication rather than being baked into
  the authenticating identity record itself

---

## Feature Name

Recommended feature folder:

`src/features/tenantAdmins/`

This feature should stay separate from:

- `src/features/tenants/`
- `src/features/rootAuth/`
- `src/features/rootUsers/`
- `src/features/rootRoles/`
- `src/features/notificationDelivery/`

`tenants` owns tenant lifecycle and existence.

`tenantAdmins` owns tenant-owned admin actor records and verification workflows.

`notificationDelivery` owns transport and durable outbound-email history.

`rootAuth` continues to own authenticated root session state.

`rootRoles` continues to own the current root authorization capability model.

---

## Trust Boundary And Privileged Actor

### Trust boundary

This first slice remains primarily root-operated.

- unauthenticated callers may not access tenant-admin operator routes
- authenticated root users may access tenant-admin operator routes only when
  they hold the required capability
- the initial granting role is `RootUserAdmin`
- tenant admins do not log in or call protected tenant-admin routes yet

### Capability boundary

For this phase, the tenant-admin lifecycle and verification-send capabilities
are still classified as:

- `root`

The verification-token redemption route is intentionally different:

- it is a public transport surface
- but it remains governed by feature-owned one-time-token validation and subject
  ownership checks rather than by a tenant session

### Tenant context rule

For operator routes, the target tenant is explicit in the route:

- `/v1/tenants/:tenantId/admins/...`

For verification-token redemption, tenant context is not resolved from an
authenticated session. It is resolved from the durable verification-token
record and the tenant-admin subject it points to.

---

## Verification Workflow

### Send verification email

The `tenantAdmins` feature owns the workflow meaning:

- is this tenant-admin eligible to receive verification?
- which tenant-admin record is the subject?
- what verification-state change should follow later?

The shared token seam owns token mechanics only:

- token generation
- token parsing
- token verification against stored metadata

The `notificationDelivery` feature owns transport only:

- email provider integration
- durable outbound-email metadata
- durable attempt history

### Resend verification email

Verification resend must mint fresh token-bearing content.

Rules:

- resend must not blindly replay old secret-bearing content
- existing active verification tokens for the same tenant-admin may be
  superseded or invalidated
- resend should leave durable operator-visible evidence through
  `notificationDelivery`

### Redeem verification token

Verification-token redemption is the public completion step.

Rules:

- a presented token must be parsed and verified through the shared token seam
- the feature must verify:
  - token purpose
  - subject ownership
  - expiry
  - used state
  - supersession or invalidation state
- successful redemption sets tenant-admin verification state durably
- successful redemption does **not** create a tenant login session in this
  phase

### Rate limiting posture

Verification send and resend should use the shared
`authenticated-sensitive` protected-route rate-limit posture rather than the
looser authenticated-general policy.

---

## What This Slice Deliberately Defers

### Initial password set

Initial password set is deferred to the later shared tenant-auth loop because
that loop must decide:

- which shared principal owns the credential
- where the password hash lives
- how sessions are created after login
- how tenant context selection works

### Forgot-password reset

Forgot-password reset is also deferred.

The shared token and email tooling now makes it feasible later, but reset is
not the next safe step because:

- there is no tenant password to reset yet
- credential ownership is still part of the later shared tenant-auth design

So the recommended sequence is:

- verification now
- initial password set later in the shared tenant-auth loop
- forgot-password reset after credential ownership and session issuance are
  settled in that model

---

## Lifecycle Visibility Rules

- normal exact read excludes deleted rows
- normal list excludes deleted rows
- deleted rows must not be updated through normal update paths
- this phase does not require explicit deleted-read and deleted-list routes if
  they would distract from the auth-ready core slice
- soft delete plus reactivation remains in scope because it preserves durable
  historical state and future migration compatibility

---

## Compatibility Direction

This slice must remain compatible with:

- later shared principal introduction
- later tenant membership modeling
- later tenant role assignment
- later initial password set
- later tenant login and session issuance
- later tenant selection

That means:

- do not let `tenantAdmins` become the authenticating identity itself
- do not store password material on the tenant-admin record in this phase
- do not create tenant sessions in this phase
- keep verification-state meaning durable and explicit on the tenant-admin row
- keep token and delivery ownership separated from business workflow ownership

---

## Standards And Risk Notes

This slice is standards-sensitive because it introduces:

- tenant-scoped personal data
- verification-state lifecycle
- public token redemption
- third-party email processor use through shared delivery infrastructure

The final implementation must therefore pay close attention to:

- authorization boundaries
- token replay resistance
- secret redaction in durable email records
- auditability of operator-triggered sends and token redemption
- privacy posture for tenant-admin PII and verification metadata

---

## Recommended Next Artifact

After this PRD refresh, the next correct step is:

- derive PRD test cases aligned to this auth-ready two-loop boundary

That test-case doc should be careful to prove:

- root-only operator lifecycle and verification-send access
- public token-redemption correctness
- no accidental tenant-session creation
- clean separation between `tenantAdmins`, shared token mechanics, and
  `notificationDelivery`
