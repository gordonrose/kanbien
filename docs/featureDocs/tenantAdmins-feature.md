# Tenant Admins Feature Reference

## Purpose

The `tenantAdmins` feature manages durable tenant-scoped admin profile records
and the email-verification workflow that prepares those records for later
shared tenant authentication. It owns:

- tenant-admin creation inside a tenant
- exact tenant-admin lookup by tenant and ID
- filtered and paginated tenant-admin listing per tenant
- editable tenant-admin profile updates
- automatic verification-email send on create and pending-state update, plus
  explicit send and resend routes
- public redemption of tenant-admin verification tokens
- soft deletion and reactivation
- feature-owned durable verification-token records linked to tenant-admins

This feature does not own login, password setup, password reset, tenant
sessions, or tenant selection. Those concerns belong to the shared
`tenantAuth` foundation.

## Where It Lives

- `src/features/tenantAdmins/contract`
- `src/features/tenantAdmins/domain`
- `src/features/tenantAdmins/persistence`
- `src/features/tenantAdmins/transport`
- `src/features/tenantAdmins/integration.ts`
- `src/features/tenantAdmins/index.ts`

## Platform Integration

Feature export:

- `createTenantAdminsFeature`

Current mount points:

- `src/routes/v1/index.ts`
- protected base route: `/v1/tenants/:tenantId/admins`
- public verification route: `/v1/tenant-admin-verification`

Protected tenant-admin routes are mounted behind:

- shared root-session authentication
- shared root capability checks
- shared authenticated-general rate limiting at the `/v1/tenants` family

Verification send and resend additionally use:

- shared authenticated-sensitive rate limiting

Public token redemption uses:

- shared public-write rate limiting

## Runtime Contracts

### Feature factory

The feature entry point expects:

- raw `pg` `Pool`
- a `RootCapabilityChecker`
- a `PlatformSecurityRepository`
- public seams from:
  - `tenants`
  - `notificationDelivery`
  - shared `src/lib/tokens`

`integration.ts` owns repository and service wiring.
`transport/router.ts` stays focused on HTTP concerns and capability gates.
The domain service owns lifecycle, verification, resend, token invalidation,
and audit coordination behavior.

### Cross-feature seams

`tenantAdmins` uses narrow public seams rather than feature-private imports:

- `tenants` validates visible tenant ownership and reads tenant display data for
  email workflows
- `notificationDelivery` sends and resends verification emails while keeping
  delivery persistence and attempt history feature-owned there
- `src/lib/tokens` provides shared one-time-token generation, parsing, and
  verification mechanics

`tenantAuth` later consumes verified onboarding proof through the exported
tenant-admin bootstrap reader rather than private tenant-admin persistence
internals.

### Migrations

The migration runner scans:

- `src/features/**/persistence/migrations/*.sql`

This feature currently contributes:

- `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`

## Relationship To Root Roles

`tenantAdmins` does not own authorization policy.
It consumes the shared root capability checker and depends on these capability
keys in the root capability catalog:

- `tenant-admin.create`
- `tenant-admin.read`
- `tenant-admin.list`
- `tenant-admin.update`
- `tenant-admin.verification.send`
- `tenant-admin.verification.resend`
- `tenant-admin.delete`
- `tenant-admin.reactivate`

## API Surface

Protected base path:

- `/v1/tenants/:tenantId/admins`

Public verification path:

- `/v1/tenant-admin-verification`

Protected routes:

- `POST /v1/tenants/:tenantId/admins`
- `GET /v1/tenants/:tenantId/admins`
- `GET /v1/tenants/:tenantId/admins/:tenantAdminId`
- `PATCH /v1/tenants/:tenantId/admins/:tenantAdminId`
- `POST /v1/tenants/:tenantId/admins/:tenantAdminId/verification/send`
- `POST /v1/tenants/:tenantId/admins/:tenantAdminId/verification/resend`
- `POST /v1/tenants/:tenantId/admins/:tenantAdminId/onboarding/restart`
- `POST /v1/tenants/:tenantId/admins/:tenantAdminId/delete`
- `POST /v1/tenants/:tenantId/admins/:tenantAdminId/reactivate`

Public route:

- `POST /v1/tenant-admin-verification/redeem`

## Response Shapes

Responses are returned directly without a `{ "body": ... }` envelope.

Example tenant-admin response:

```json
{
  "tenantAdminId": "11111111-1111-4111-8111-111111111111",
  "tenantId": "22222222-2222-4222-8222-222222222222",
  "email": "tenant.admin@example.com",
  "firstName": "Tenant",
  "lastName": "Admin",
  "emailVerificationStatus": "pending",
  "emailVerifiedAt": null,
  "lastVerificationEmailRequestedAt": "2026-04-08T14:30:00.000Z",
  "createdByRootAdminUserId": "33333333-3333-4333-8333-333333333333",
  "createdAt": "2026-04-08T14:00:00.000Z",
  "updatedAt": "2026-04-08T14:30:00.000Z",
  "deletedAt": null
}
```

Example list response:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 25,
  "totalPages": 0,
  "totalSearchableRecords": 0,
  "totalMatchingRecords": 0
}
```

Error response:

```json
{
  "code": "TENANT_ADMIN_VERIFICATION_TOKEN_INVALID",
  "message": "That tenant-admin verification token is missing, invalid, or no longer accepted.",
  "details": {
    "field": "token",
    "reason": "invalid"
  }
}
```

## Request Semantics

### Create

`POST /v1/tenants/:tenantId/admins`

Body:

```json
{
  "email": "tenant.admin@example.com",
  "firstName": "Tenant",
  "lastName": "Admin"
}
```

Rules:

- `email` is trimmed, normalized lowercase, and must be unique among active
  tenant-admins in the same tenant
- `createdByRootAdminUserId` is stamped from the authenticated root session
- new tenant-admins start with `emailVerificationStatus = "pending"` and the
  feature automatically sends the initial verification email

### List and exact read

- `GET /v1/tenants/:tenantId/admins`
- `GET /v1/tenants/:tenantId/admins/:tenantAdminId`

Rules:

- visible reads exclude soft-deleted rows by default
- exact read is tenant-scoped; cross-tenant lookups return
  `404 TENANT_ADMIN_NOT_FOUND`
- list supports pagination, sorting, and filters for:
  - `emailPrefix`
  - `firstNamePrefix`
  - `lastNamePrefix`
  - `emailVerificationStatus`
  - `createdAtFrom`, `createdAtTo`
  - `updatedAtFrom`, `updatedAtTo`

### Update

`PATCH /v1/tenants/:tenantId/admins/:tenantAdminId`

Rules:

- at least one editable field is required
- `email`, `firstName`, and `lastName` are the only client-editable fields
- changing `email` resets verification state to `pending`, clears
  `emailVerifiedAt`, and invalidates active verification tokens
- when the tenant admin remains in pending verification state after an update,
  the feature automatically sends a fresh verification email
- updating a deleted tenant-admin through the normal update route is rejected

### Verification send and resend

- `POST /v1/tenants/:tenantId/admins/:tenantAdminId/verification/send`
- `POST /v1/tenants/:tenantId/admins/:tenantAdminId/verification/resend`

Rules:

- both routes are protected root-operator actions
- both routes use authenticated-sensitive throttling
- send and resend invalidate previously active verification tokens before
  issuing a fresh accepted token
- resend may attach a `resendReason`
- onboarding restart is root-only and reuses the shared tenant-auth
  provisioning seam for already verified tenant-admin rows
- notification delivery persists the logical email, content snapshot, and
  attempt history in the owning `notificationDelivery` feature
- `lastVerificationEmailRequestedAt` is updated on the tenant-admin record

### Public verification redemption

`POST /v1/tenant-admin-verification/redeem`

Body:

```json
{
  "token": "<tokenId>.<secret>"
}
```

Rules:

- the route is public and intended for browser/email-link onboarding flows
- invalid, expired, used, invalidated, or deleted-subject tokens are rejected
- successful redemption marks the tenant-admin verified and consumes the token
- successful redemption also provisions or reuses the tenant-auth principal,
  creates any missing tenant access grants for matching verified tenant-admin
  subjects with the same normalized email, and returns the next onboarding step
  for password setup or login

### Protected onboarding restart

`POST /v1/tenants/:tenantId/admins/:tenantAdminId/onboarding/restart`

Rules:

- the route is protected and root-operator only
- the target tenant-admin must be visible and already verified
- the route does not send a new verification email
- it returns the same tenant-auth onboarding payload shape used by public
  verification redemption
- it exists to recover the verified-but-not-finished onboarding state where the
  original setup proof is no longer available

### Delete and reactivate

- `POST /v1/tenants/:tenantId/admins/:tenantAdminId/delete`
- `POST /v1/tenants/:tenantId/admins/:tenantAdminId/reactivate`

Rules:

- soft delete stamps `deletedAt`, refreshes `updatedAt`, and invalidates active
  verification tokens
- reactivation restores the record to visible active use
- reactivation resets verification state back to `pending`

## Persistence Notes

Feature-owned durable records:

- `tenant_admin`
- `tenant_admin_verification_token`

Important durable facts:

- normalized tenant-admin email
- verification state and verified timestamp
- last verification-email request timestamp
- creator attribution
- feature-owned token lifecycle state including expiry, invalidation, and use

The feature intentionally stores verification-token state durably rather than
depending on mutable delivery or related records alone.

## Audit And Security Notes

- successful protected mutations write operator-visible security audit events
- denied protected actions rely on shared authz middleware audit behavior
- public verification redemption writes success and failure audit events
- protected routes require root-user authentication and mapped root capability
  checks
- verification email bodies are sent through `notificationDelivery`, which
  stores sanitized content and durable attempt history rather than raw live
  secret links in support surfaces

## How To Try It

Postman collection:

- `docs/postman/collections/tenantAdmins.postman_collection.json`

Typical manual flow:

1. complete root login through the built-in root-auth requests
2. create a tenant admin inside an existing tenant
3. the feature auto-sends the verification email on create and on later
   pending-state updates; operators may still use send or resend explicitly
   when needed
4. copy the raw token from the real inbox verification link
5. redeem it through the public verification route
6. use the returned tenant-auth onboarding payload to set the initial password
   when `passwordSetupRequired = true`
7. exact-read the tenant admin again to confirm
   `emailVerificationStatus = "verified"`

## Traceability

- PRD:
  [2026-04-07-0006-tenant-admins-backend-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-07-0006-tenant-admins-backend-foundation.md)
- PRD test cases:
  [2026-04-07-0006-tenant-admins-backend-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-07-0006-tenant-admins-backend-foundation-test-cases.md)
- implementation blueprint:
  [2026-04-08-tenant-admins-auth-ready-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-08-tenant-admins-auth-ready-foundation.md)
