# Tenant Auth Foundation Specification

## Purpose

Define the first shared non-root authentication slice for the platform.

This slice introduces a reusable `tenantAuth` feature that allows verified
tenant-scoped actors to become authenticated shared principals without turning
`tenantAdmins` into the login feature itself.

It provides the backend capabilities required for:

- bootstrap of a shared non-root auth principal from a verified `tenantAdmin`
- initial password setup
- email-plus-password login
- authenticated tenant-session read
- available tenant-context listing
- active tenant-context selection
- logout

It also establishes:

- globally unique login-email ownership across non-root principals
- durable separation between authentication and tenant-scoped business records
- reusable principal-to-tenant-access linkage
- server-backed tenant sessions
- frontend-ready auth and tenant-selection API contracts
- a clean path toward later tenant-user, membership, password-recovery, and
  richer authorization work

---

## Scope

This phase includes:

- a new `tenantAuth` feature under `src/features/tenantAuth`
- shared non-root auth-principal bootstrap from a verified `tenantAdmin`
- initial password setup for newly bootstrapped principals
- public email-plus-password login for non-root principals
- server-backed authenticated tenant-session creation
- authenticated exact session read
- authenticated available-tenant-context listing
- authenticated active-tenant selection
- authenticated logout
- durable storage for:
  - shared non-root principals
  - password credentials
  - principal-to-tenant access grants
  - tenant sessions

This phase does **not** include:

- forgot-password reset
- MFA
- tenant-user CRUD
- tenant invitation flows beyond the already-verified `tenantAdmin` bootstrap
- self-service profile editing
- frontend implementation
- browser-shell implementation
- advanced device/session management
- cookie-versus-bearer finalization
- tenant-scoped role-management UX

Those later concerns should build on this slice, not be collapsed into it.

---

## Core Concepts

### Shared non-root auth principal

A shared non-root auth principal is the durable login identity for tenant-side
actors.

This slice keeps the principal separate from tenant-scoped business records so
future tenant users can reuse the same identity layer without introducing a
second auth model.

Each row is expected to have at least:

- `authPrincipalId`
- `loginEmail`
- `passwordState`
- `createdAt`
- `updatedAt`
- `disabledAt`

### Login email rule

`loginEmail` is required and stored in normalized form.

Rules:

- trim whitespace
- store lowercase
- reject empty values
- enforce uniqueness globally across non-root principals

This is intentionally different from the tenant-admin email rule, where the
same email may exist in multiple tenants.

### Tenant-scoped actor stays separate

`tenantAdmins` remains a tenant-scoped actor/profile feature.

It owns:

- tenant-admin lifecycle
- tenant-admin verification state
- tenant-admin profile metadata

It does **not** own:

- password hashes
- login
- session issuance
- active-tenant selection

### Tenant access grant

A `tenantAccessGrant` is the durable linkage between one shared non-root
principal and one tenant-scoped access context.

In this first slice, the source access context is a verified `tenantAdmin`.

The model must remain open to later support:

- one principal with multiple tenants
- one principal with different tenant-scoped actor types
- future tenant users who are not tenant admins

Each durable grant is expected to capture at least:

- `tenantAccessGrantId`
- `authPrincipalId`
- `tenantId`
- `subjectType`
- `subjectId`
- `createdAt`
- `updatedAt`
- `revokedAt`

### Password setup versus password reset

This slice implements **initial password setup**, not password reset.

Rules:

- password setup requires valid single-use onboarding/bootstrap proof
- password setup is allowed only when the principal is in an onboarding or
  password-not-yet-set state
- password setup writes the durable password credential for the principal
- password setup does **not** implicitly create an authenticated tenant session
- login remains a separate explicit step

Separating password setup from login keeps the onboarding flow deterministic
and avoids hiding session semantics inside credential creation.

### Tenant session

A tenant session is the durable authenticated session for a shared non-root
principal.

In this slice:

- sessions are server-backed
- sessions are created only by successful login
- sessions may or may not have an active tenant selected
- active-tenant selection is stored on the session itself

### Active tenant selection rule

After successful login, the platform resolves which tenant contexts the
principal may enter.

Rules:

- if exactly one tenant context exists, the session auto-selects it
- if more than one tenant context exists, the session is authenticated but
  requires tenant selection
- if no tenant contexts exist, login must fail truthfully rather than creating
  a misleading authenticated session

### Frontend-ready contract rule

Frontend-ready in this slice does **not** mean building UI now.

It means the API should already support future browser and app clients with:

- stable login, session, tenant-list, tenant-selection, and logout routes
- deterministic response states for:
  - invalid credentials
  - onboarding required
  - authenticated with one auto-selected tenant
  - authenticated but tenant selection required
  - invalid or expired session
- response shapes that include:
  - principal summary
  - available tenant contexts
  - active tenant context when selected
  - selection-required state

---

## Why This Slice Exists After Tenant Admins

The platform direction already established that authentication must stay
separate from business-profile features.

That is already true for:

- `rootUsers` versus `rootAuth`

It should remain true for tenant-side actors as well.

The `tenantAdmins` auth-ready slice gave the platform:

- durable tenant-owned admin records
- email verification
- soft-delete and reactivation semantics
- a clean place to manage tenant-admin lifecycle

This `tenantAuth` slice is the next safe step because it adds:

- shared principal identity
- credential ownership
- login
- session state
- tenant-context entry

without forcing those concerns into `tenantAdmins`.

---

## Recommended Repo Shape

Recommended feature folder:

`src/features/tenantAuth/`

Suggested initial files:

- `src/features/tenantAuth/index.ts`
- `src/features/tenantAuth/integration.ts`
- `src/features/tenantAuth/README.md`
- `src/features/tenantAuth/contract/errors.ts`
- `src/features/tenantAuth/contract/schemas.ts`
- `src/features/tenantAuth/contract/types.ts`
- `src/features/tenantAuth/domain/types.ts`
- capability-focused domain files such as:
  - `bootstrapPrincipal.ts`
  - `setInitialPassword.ts`
  - `loginWithPassword.ts`
  - `readCurrentSession.ts`
  - `listTenantContexts.ts`
  - `selectTenantContext.ts`
  - `logoutSession.ts`
- `src/features/tenantAuth/domain/service.ts`
- `src/features/tenantAuth/persistence/types.ts`
- `src/features/tenantAuth/persistence/repository.ts`
- `src/features/tenantAuth/persistence/postgresRepository.ts`
- `src/features/tenantAuth/persistence/migrations/*.sql`
- `src/features/tenantAuth/transport/router.ts`

---

## Capability Set

### `createSharedTenantAuthPrincipalFromVerifiedTenantAdmin`

Bootstrap a shared non-root auth principal from a verified active
`tenantAdmin`.

Rules:

- source `tenantAdmin` must exist, be active, and be verified
- source `tenantAdmin` email remains the initial login email
- normalized login email must be globally unique across non-root principals
- one source `tenantAdmin` must not bootstrap multiple active principals
- bootstrap must create:
  - one shared auth principal
  - one durable `tenantAccessGrant`
- bootstrap must require trusted single-use onboarding/bootstrap proof rather
  than a normal authenticated tenant session

Output should include:

- principal summary
- login email
- bootstrap state
- whether password setup is required

### `setInitialTenantPassword`

Allow a newly bootstrapped principal to set its first password.

Rules:

- initial password setup is not password reset
- onboarding/bootstrap proof must be valid, single-use, and unexpired
- password policy should align with the platform password baseline
- password setup is allowed only when no active password has yet been set
- successful password setup does not automatically log the caller in

Output should include:

- principal summary
- password-set confirmation
- next-step hint indicating explicit login is required

### `loginTenantPrincipalWithPassword`

Authenticate a shared non-root principal using email and password.

Rules:

- normalize login email
- use stable safe auth failures for invalid credentials
- principal must be eligible to sign in
- password must verify against the stored hash
- successful login creates one server-backed tenant session
- login must resolve one of three truthful outcomes:
  - `AUTHENTICATED_SINGLE_TENANT`
  - `AUTHENTICATED_SELECTION_REQUIRED`
  - `ONBOARDING_REQUIRED`

If exactly one tenant context is available:

- the session must store that active tenant automatically

If multiple tenant contexts are available:

- the session remains authenticated
- no active tenant is set yet
- tenant selection is required

### `readCurrentTenantSession`

Return the current authenticated tenant session summary.

This response should be frontend-ready and include:

- principal summary
- authenticated state
- active tenant context when one is selected
- available tenant contexts
- whether tenant selection is required
- session expiry metadata where appropriate

Rules:

- invalid or expired sessions fail truthfully
- session read must not depend on tenant-admin-specific transport contracts

### `listAvailableTenantContexts`

List the tenant contexts available to the authenticated principal.

Each returned context should be safe for future chooser UI consumption and
include at least:

- `tenantId`
- tenant display summary
- subject type
- subject id
- actor/profile display summary where appropriate
- role or access summary when safely available
- whether that context is currently active

Rules:

- list is exact to the authenticated principal
- ordering should be deterministic
- the model must remain compatible with future tenant-user roles and actor
  types

### `selectActiveTenantContext`

Select the active tenant context for an already authenticated principal.

Rules:

- session must already be valid
- requested tenant must belong to the principal's allowed contexts
- selection should be idempotent
- when only one tenant exists and login auto-selected it, this route may return
  a safe no-op or conflict according to the final contract, but must remain
  truthful
- successful selection updates server-backed session state

### `logoutTenantSession`

End the current authenticated tenant session.

Rules:

- require current authenticated tenant session
- revoke the server-backed session durably
- clear active-tenant context implicitly by ending the session
- do not mutate tenant-admin lifecycle or principal ownership state

---

## API Endpoints

### `POST /v1/tenant-auth/principals/bootstrap`

Purpose: bootstrap a shared non-root principal from verified tenant-admin
evidence.

#### Request

The final request proof may be:

- a single-use tenant-auth bootstrap token issued after successful
  tenant-admin verification redemption
- or an equivalent feature-owned onboarding proof

The request must not accept:

- client-supplied `authPrincipalId`
- client-supplied `tenantAccessGrantId`
- password hashes
- session identifiers

#### Success Response

```json
{
  "status": "PRINCIPAL_BOOTSTRAPPED",
  "authPrincipalId": "ap_123",
  "loginEmail": "admin@example.com",
  "passwordSetupRequired": true
}
```

### `POST /v1/tenant-auth/password/setup`

Purpose: set the first password for a bootstrapped principal.

#### Request

```json
{
  "bootstrapToken": "boot_123",
  "newPassword": "user-typed-password",
  "repeatPassword": "user-typed-password"
}
```

#### Success Response

```json
{
  "status": "PASSWORD_SET",
  "authPrincipalId": "ap_123",
  "loginEmail": "admin@example.com",
  "nextStep": "LOGIN_REQUIRED"
}
```

### `POST /v1/tenant-auth/login/password`

Purpose: authenticate a non-root principal and create a tenant session.

#### Request

```json
{
  "email": "admin@example.com",
  "password": "user-typed-password"
}
```

#### Success Response: Single Tenant

```json
{
  "status": "AUTHENTICATED_SINGLE_TENANT",
  "sessionId": "sess_123",
  "authPrincipalId": "ap_123",
  "activeTenantContext": {
    "tenantId": "ten_123",
    "subjectType": "tenant_admin",
    "subjectId": "ta_123"
  },
  "availableTenantContexts": [
    {
      "tenantId": "ten_123",
      "subjectType": "tenant_admin",
      "subjectId": "ta_123",
      "isActive": true
    }
  ],
  "selectionRequired": false
}
```

#### Success Response: Tenant Selection Required

```json
{
  "status": "AUTHENTICATED_SELECTION_REQUIRED",
  "sessionId": "sess_123",
  "authPrincipalId": "ap_123",
  "activeTenantContext": null,
  "availableTenantContexts": [
    {
      "tenantId": "ten_123",
      "subjectType": "tenant_admin",
      "subjectId": "ta_123",
      "isActive": false
    },
    {
      "tenantId": "ten_456",
      "subjectType": "tenant_admin",
      "subjectId": "ta_456",
      "isActive": false
    }
  ],
  "selectionRequired": true
}
```

#### Success Response: Onboarding Required

```json
{
  "status": "ONBOARDING_REQUIRED",
  "loginEmail": "admin@example.com"
}
```

### `GET /v1/tenant-auth/session`

Purpose: read the current authenticated tenant session.

#### Success Response

```json
{
  "status": "AUTHENTICATED",
  "sessionId": "sess_123",
  "authPrincipalId": "ap_123",
  "activeTenantContext": {
    "tenantId": "ten_123",
    "subjectType": "tenant_admin",
    "subjectId": "ta_123"
  },
  "availableTenantContexts": [
    {
      "tenantId": "ten_123",
      "subjectType": "tenant_admin",
      "subjectId": "ta_123",
      "isActive": true
    }
  ],
  "selectionRequired": false
}
```

### `GET /v1/tenant-auth/tenant-contexts`

Purpose: list tenant contexts available to the authenticated principal.

### `POST /v1/tenant-auth/tenant-selection`

Purpose: select the active tenant for the current authenticated session.

#### Request

```json
{
  "tenantId": "ten_123"
}
```

### `POST /v1/tenant-auth/logout`

Purpose: revoke the current authenticated tenant session.

---

## Persistence Expectations

This slice should introduce durable storage for at least:

- shared non-root auth principals
- password credentials
- tenant access grants
- tenant sessions

The storage model must preserve:

- global unique normalized login email
- one durable grant per principal-to-subject tenant-access relationship
- durable session state, including active selected tenant when present
- room for later support of:
  - non-admin tenant users
  - multiple tenant-scoped actor types
  - password reset
  - richer session/device management

---

## Security And Abuse-Prevention Expectations

This slice handles password and session security for tenant-side identities.

Minimum expectations:

- password payloads must never be stored in raw form
- password policy must be explicit and enforced server-side
- login must use safe generic invalid-credential responses where appropriate
- public bootstrap and password-setup flows must use single-use proof
- login and onboarding routes must use stricter public rate limiting than
  normal read routes
- authenticated session routes must use shared authenticated middleware
- tenant selection must verify that the requested tenant is actually reachable
  by the authenticated principal
- logout must durably revoke the current session

---

## Compatibility And Migration Direction

This slice must stay compatible with:

- ADR-0009 separation of authentication from business features
- the existing `tenantAdmins` auth-ready foundation
- future tenant-user lifecycle work
- future tenant role and membership work
- later password recovery and reset targeting the shared principal model

This slice must **not**:

- make `tenantAdmin` the login identity
- assume every principal is a tenant admin forever
- hard-code one principal to one tenant
- couple session contracts to tenant-admin-only fields

---

## Deferred Follow-On Work

This PRD intentionally defers:

- forgot-password reset
- tenant invitations beyond the current bootstrap path
- MFA
- browser cookie and frontend-shell implementation details
- richer session management
- broader tenant-user onboarding
- self-service account management

These should be future feature loops built on top of this shared auth
foundation rather than reasons to overbuild the first slice.
