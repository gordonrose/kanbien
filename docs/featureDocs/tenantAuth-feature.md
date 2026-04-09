# Tenant Auth Feature Reference

## Purpose

The `tenantAuth` feature provides shared non-root authentication for tenant-side
actors.

It owns:

- shared non-root auth principals
- initial password setup
- email-plus-password login
- server-backed tenant sessions
- active tenant selection on the session

It does not own tenant-admin lifecycle.
When auth needs source-actor evidence, it reads that through the exported
`tenantAdmins` auth-bootstrap seam rather than importing `tenantAdmins`
private persistence internals.

## Where It Lives

- `src/features/tenantAuth/contract`
- `src/features/tenantAuth/domain`
- `src/features/tenantAuth/persistence`
- `src/features/tenantAuth/transport`
- `src/features/tenantAuth/integration.ts`
- `src/features/tenantAuth/index.ts`

## Platform Integration

Feature export:

- `createTenantAuthFeature`

Mounting:

```ts
import { createTenantAuthFeature } from "../../features/tenantAuth";
import { createPostgresPlatformSecurityRepository } from "../../lib/security/postgresRepository";
import { dbPool } from "../../lib/db";

const platformSecurityRepository = createPostgresPlatformSecurityRepository(dbPool);

v1Router.use(
  "/tenant-auth",
  createTenantAuthFeature(dbPool, platformSecurityRepository),
);
```

Public bootstrap, password-setup, and login routes pass through shared
`public-auth` rate limiting.
Authenticated tenant-session routes use shared bearer-session middleware plus
authenticated-sensitive rate limiting.

## Current Auth Model

- authentication is separate from tenant-scoped business/profile features
- a verified `tenantAdmin` can bootstrap a shared principal
- one principal may hold access grants for multiple tenants
- initial password setup is separate from login
- successful login creates one server-backed tenant session
- if exactly one tenant context exists, login auto-selects it
- if multiple tenant contexts exist, login succeeds but requires later
  tenant selection
- active tenant context is stored on the session itself

## API Surface

Public routes:

- `POST /v1/tenant-auth/principals/bootstrap`
- `POST /v1/tenant-auth/password/setup`
- `POST /v1/tenant-auth/login/password`

Authenticated routes:

- `GET /v1/tenant-auth/session`
- `GET /v1/tenant-auth/tenant-contexts`
- `POST /v1/tenant-auth/tenant-selection`
- `POST /v1/tenant-auth/logout`

Transport notes:

- bearer token transport is the current supported authenticated transport
- protected tenant-auth routes use the opaque `tenant_session.session_id`
- the current contracts are frontend-ready but do not yet imply browser-shell
  implementation or final cookie behavior

## Data And Security Notes

- login email is trimmed and lowercased before persistence and lookup
- login email is globally unique across non-root principals
- passwords are stored as hashes, never plaintext
- password setup depends on a single-use bootstrap token generated after
  verified source-actor proof succeeds
- bootstrap currently consumes a tenant-admin verification token as the trusted
  onboarding proof
- tenant-admin rows remain tenant-scoped profile records rather than becoming
  the login identity themselves
- active tenant selection is validated against durable principal-to-tenant
  access grants
- public onboarding and login routes are protected by shared public-auth
  throttling
- authenticated session routes are protected by shared
  authenticated-sensitive throttling
- bootstrap, password setup, login, tenant selection, and logout are audit
  visible through the shared security audit surface

## Cross-Feature Seams

- `tenantAdmins`
  - exported seam:
    `createTenantAdminsAuthBootstrapReader`
  - current use:
    consume verification proof and resolve verified active tenant-admin
    subjects by normalized email or exact ID
- `tenants`
  - exported seam:
    `createVisibleTenantsReader`
  - current use:
    resolve tenant display and visibility state for tenant-context responses

## How To Try It

1. Create a `tenantAdmin` and send verification email through the existing
   root-only `tenantAdmins` routes.
2. Copy the raw verification token from the email link.
3. Call `POST /v1/tenant-auth/principals/bootstrap` with that verification
   token.
4. Use the returned `bootstrapToken` with
   `POST /v1/tenant-auth/password/setup`.
5. Log in with `POST /v1/tenant-auth/login/password`.
6. If more than one tenant context is returned, call
   `POST /v1/tenant-auth/tenant-selection`.
7. Use the returned `sessionId` as:

```text
Authorization: Bearer <sessionId>
```

8. Read the current session through `GET /v1/tenant-auth/session`.
9. End the session with `POST /v1/tenant-auth/logout`.
