# Tenants Feature Reference

## Purpose

The `tenants` feature manages durable platform tenant records. It owns:

- tenant creation
- exact visible tenant lookup by ID
- filtered and paginated visible tenant listing
- exact deleted tenant lookup by ID
- filtered and paginated deleted tenant listing
- editable tenant metadata updates
- soft deletion
- reactivation of deleted tenants
- irreversible remove while tenants remain isolated durable records

## Where It Lives

- `src/features/tenants/contract`
- `src/features/tenants/domain`
- `src/features/tenants/persistence`
- `src/features/tenants/transport`
- `src/features/tenants/integration.ts`
- `src/features/tenants/index.ts`

## Platform Integration

Feature export:

- `createTenantsFeature`

Mounting:

```ts
import { createTenantsFeature } from "../../features/tenants";
import { createRootRolesFeature } from "../../features/rootRoles";
import { createPostgresRootAuthRepository } from "../../features/rootAuth/persistence/postgresRepository";
import { createPostgresPlatformSecurityRepository } from "../../lib/security/postgresRepository";
import { dbPool } from "../../lib/db";
import { createRequireRootSession } from "../../lib/auth/middleware";
import { createRateLimitMiddleware } from "../../lib/security/rateLimit";
import { env } from "../../config/env";

const rootAuthRepository = createPostgresRootAuthRepository(dbPool);
const platformSecurityRepository = createPostgresPlatformSecurityRepository(dbPool);
const rootRolesFeature = createRootRolesFeature(dbPool, platformSecurityRepository);
const requireRootSession = createRequireRootSession(rootAuthRepository, {
  allowBrowserCookie: true,
});
const authenticatedGeneralRateLimit = createRateLimitMiddleware({
  enabled: env.platformSecurity.enabled,
  repository: platformSecurityRepository,
  policy: {
    endpointClass: "authenticated-general",
    windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
    maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
    responseCode: "RATE_LIMITED",
    responseMessage: "Too many requests. Please wait and try again.",
  },
  subjectScope: "auth_user",
  getSubjectKey: (request) =>
    request.rootSession ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}` : null,
});

v1Router.use(
  "/tenants",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createTenantsFeature(dbPool, rootRolesFeature.capabilityChecker, platformSecurityRepository),
);
```

Current mount point:

- `src/routes/v1/index.ts`
- base route: `/v1/tenants`

All `tenants` routes are protected by root-user authentication.
All `tenants` routes also pass through shared authenticated-general rate
limiting.
All `tenants` routes pass through governing root authz capability checks
enforced by the shared `rootRoles` authorization seam.

## Runtime Contracts

### Feature factory

The feature entry point expects:

- raw `pg` `Pool`
- a `RootCapabilityChecker`
- a `PlatformSecurityRepository`

`integration.ts` owns repository and service wiring.
`domain/service.ts` is a composition layer over capability-focused files such
as `createTenant.ts`, `getTenant.ts`, and `softDeleteTenant.ts`.
`transport/router.ts` accepts a prebuilt `TenantsService` so the transport
layer stays focused on HTTP concerns.

### Error handling

Feature routes call `next(error)` for unexpected failures.
Known `TenantError` failures are translated to JSON inside the feature router.
The platform still provides the app-level JSON fallback middleware in
`src/app.ts` for unhandled failures.

### Migrations

The migration runner scans:

- `src/features/**/persistence/migrations/*.sql`

That means this feature's migration file is discovered automatically:

- `src/features/tenants/persistence/migrations/0006_create_tenants.sql`

The migration manifest key is the file's relative path in
`schema_migrations`, so renaming the migration file changes its identity to the
runner.

### Relationship To Root Roles

The `tenants` feature does not own authorization policy.
Instead, it consumes the shared root capability checker owned by the `rootRoles`
feature and depends on these capabilities being present in the root capability
catalog:

- `tenant.create`
- `tenant.read`
- `tenant.list`
- `tenant.update`
- `tenant.read.deleted`
- `tenant.list.deleted`
- `tenant.delete`
- `tenant.reactivate`
- `tenant.remove`

## API Surface

Base path:

- `/v1/tenants`

Authentication:

- all routes require a valid root-user session
- sessions are established through `/v1/root-auth/*`
- browser callers may also reach these routes through the same root-admin
  cookie-backed protected session transport accepted by the shared
  root-session middleware
- shared authenticated-general rate limiting may return `429 RATE_LIMITED`

Routes:

- `POST /v1/tenants`
- `GET /v1/tenants`
- `GET /v1/tenants/deleted`
- `GET /v1/tenants/:tenantId`
- `GET /v1/tenants/deleted/:tenantId`
- `PATCH /v1/tenants/:tenantId`
- `POST /v1/tenants/:tenantId/delete`
- `POST /v1/tenants/:tenantId/reactivate`
- `POST /v1/tenants/:tenantId/remove`

Current governing authz capabilities:

- `tenant.create`
- `tenant.read`
- `tenant.list`
- `tenant.update`
- `tenant.read.deleted`
- `tenant.list.deleted`
- `tenant.delete`
- `tenant.reactivate`
- `tenant.remove`

## Response Shapes

Responses are returned directly.
They are not wrapped in a `{ "body": ... }` envelope.

Example single-item response:

```json
{
  "tenantId": "11111111-1111-4111-8111-111111111111",
  "bizId": "tenant-alpha",
  "name": "Tenant Alpha",
  "category": "customer",
  "status": "draft",
  "createdByRootAdminUserId": "00000000-0000-0000-0000-000000000001",
  "createdAt": "2026-04-07T10:00:00.000Z",
  "updatedAt": "2026-04-07T10:00:00.000Z",
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
  "code": "INVALID_REQUEST",
  "message": "Your request could not be accepted because one or more fields are missing or invalid.",
  "details": {
    "field": "tenantId",
    "reason": "Invalid UUID"
  }
}
```

## Request Semantics

### Create

`POST /v1/tenants`

Body:

```json
{
  "bizId": "tenant-alpha",
  "name": "Tenant Alpha",
  "category": "customer",
  "status": "draft"
}
```

Rules:

- `bizId` is trimmed and stored lowercase
- `status` defaults to `draft` when omitted
- `createdByRootAdminUserId` is stamped from the authenticated root session,
  not from client input

### Visible reads and list

- `GET /v1/tenants`
- `GET /v1/tenants/:tenantId`

Rules:

- visible routes exclude deleted rows by default
- exact visible reads include `createdByRootAdminUserId`
- list rows omit `createdByRootAdminUserId` in the current slice

### Deleted reads and list

- `GET /v1/tenants/deleted`
- `GET /v1/tenants/deleted/:tenantId`

Rules:

- deleted visibility is explicit
- active rows do not appear on deleted routes

### Update

`PATCH /v1/tenants/:tenantId`

Body:

```json
{
  "name": "Tenant Alpha Updated",
  "category": "demo",
  "status": "disabled"
}
```

Rules:

- only `name`, `category`, and `status` are editable
- `bizId` remains immutable after create
- deleted tenants are not updated through the normal update route

### Soft delete and reactivate

- `POST /v1/tenants/:tenantId/delete`
- `POST /v1/tenants/:tenantId/reactivate`

Rules:

- soft delete sets `deletedAt`, forces visible `status = inactive`, preserves
  `preDeleteStatus`, and refreshes `updatedAt`
- reactivate clears `deletedAt`, restores the preserved status, and refreshes
  `updatedAt`

### Remove

`POST /v1/tenants/:tenantId/remove`

Body:

```json
{
  "confirm": true,
  "reason": "cleanup test tenant"
}
```

Rules:

- remove requires explicit confirmation and a reason
- remove is irreversible in the current tenant-only slice
- this behavior should tighten once tenant-owned durable entities exist
