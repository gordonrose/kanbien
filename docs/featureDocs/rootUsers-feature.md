# Root Users Feature Reference

## Purpose

The `rootUsers` feature manages privileged platform users. It owns:

- root user creation
- visible lookup by ID
- exact lookup by email
- filtered and paginated listing
- soft deletion
- irreversible anonymized removal
- reactivation of soft-deleted, non-anonymized users

## Where It Lives

- `src/features/rootUsers/contract`
- `src/features/rootUsers/domain`
- `src/features/rootUsers/persistence`
- `src/features/rootUsers/transport`
- `src/features/rootUsers/integration.ts`
- `src/features/rootUsers/index.ts`

## Platform Integration

Feature export:

- `createRootUserFeature`

Mounting:

```ts
import { createRootUserFeature } from "../../features/rootUsers";
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
const requireRootSession = createRequireRootSession(rootAuthRepository);
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
  "/root-users",
  requireRootSession,
  authenticatedGeneralRateLimit,
  rootRolesFeature.rootUserRoleAssignmentsRouter,
  createRootUserFeature(dbPool, rootRolesFeature.capabilityChecker, platformSecurityRepository),
);
```

Current mount point:

- `src/routes/v1/index.ts`
- base route: `/v1/root-users`

All `rootUsers` routes are protected by root-user authentication.
All `rootUsers` routes also pass through shared authenticated-general rate
limiting.
All `rootUsers` CRUD routes now also pass through governing root authz
capability checks enforced by the shared `rootRoles` authorization seam.
`rootUsers` is no longer a public feature surface.
The platform now also has a same-origin root-admin browser shell that
authenticates through `rootAuth` and exposes a rudimentary operator console for
current `rootUsers` and `rootRoles` workflows. It is still intentionally much
narrower than a full polished admin product.
The feature also exports a narrow auth-state reader that other features can use
when they need root-user sign-in eligibility without reaching into
`rootUsers/persistence/*`.

## Runtime Contracts

### Feature factory

The feature entry point expects a raw `pg` `Pool` instance:

```ts
createRootUserFeature(dbPool)
```

It no longer expects an object like `{ dbPool }`.
`integration.ts` owns repository and service wiring.
`transport/router.ts` now accepts a prebuilt `RootUsersService` so the transport
layer stays focused on HTTP concerns.

### Cross-feature auth-state seam

The feature exports a narrow auth-state reader for other features:

```ts
import { createRootUsersAuthStateReader } from "../../features/rootUsers";

const rootUsersAuthStateReader = createRootUsersAuthStateReader(dbPool);
```

This seam exists so features like `rootAuth` can check root-user sign-in
eligibility without importing `rootUsers` private persistence internals.

### Browser shell relationship

The root-admin browser shell is a separate frontend app area in the repo and
consumes backend behavior through public HTTP routes.

For the current phase:

- browser-authenticated root users can reach the shell through `rootAuth`
- the shell can show minimal current-user information sourced from `rootUsers`
- the shell now adopts the signed-off `List Page` baseline for the real
  `Users` route, driving the visible `rootUsers` directory through the same
  cookie-backed protected session boundary
- the shell can also drive the current `rootRoles` management routes through
  that same protected boundary
- the browser console remains a rudimentary operator surface rather than a full
  mature admin UI

### Error handling

Feature routes call `next(error)` for unexpected failures.
Known feature errors are translated to JSON inside the feature router.
The platform must still provide an app-level JSON error middleware for unhandled errors.

In this repo, that fallback lives in `src/app.ts`.

### Migrations

The migration runner already scans:

- `src/features/**/migrations/*.sql`

That means this feature's migration file is discovered automatically:

- `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`

The migration manifest key is the file's relative path in `schema_migrations`, so renaming a migration file changes its identity to the runner.

## API Surface

Base path:

- `/v1/root-users`

Authentication:

- all routes require a valid root-user bearer session
- sessions are established through `/v1/root-auth/*`
- the root-admin browser shell uses a cookie-backed session transport through
  `/v1/root-auth/browser/*`, but `rootUsers` routes themselves remain the same
  protected backend API surface
- shared authenticated-general rate limiting may return `429 RATE_LIMITED`

Routes:

- `POST /v1/root-users`
- `GET /v1/root-users`
- `GET /v1/root-users/active`
- `GET /v1/root-users/deleted`
- `GET /v1/root-users/:rootUserId`
- `PATCH /v1/root-users/:rootUserId`
- `DELETE /v1/root-users/:rootUserId`
- `POST /v1/root-users/:rootUserId/remove`
- `POST /v1/root-users/:rootUserId/reactivate`

Current governing authz capabilities:

- `root-user.create`
- `root-user.read.visible`
- `root-user.read.active`
- `root-user.read.deleted`
- `root-user.update`
- `root-user.delete`
- `root-user.remove`
- `root-user.reactivate`

Related root-role administration routes mounted under the same `/v1/root-users`
base path:

- `POST /v1/root-users/:rootUserId/root-role-assignments`
- `POST /v1/root-users/:rootUserId/root-role-assignments/:rootRoleAssignmentId/unassign`
- `GET /v1/root-users/:rootUserId/root-roles`
- `POST /v1/root-users/:rootUserId/root-role-assignments/replace`
- `GET /v1/root-users/:rootUserId/effective-permissions`

## Response Shapes

Responses are returned directly.
They are no longer wrapped in a `{ "body": ... }` envelope.

Example single-item response:

```json
{
  "rootUserId": "11111111-1111-1111-1111-111111111111",
  "email": "ada.lovelace@example.com",
  "firstName": "Ada",
  "lastName": "Lovelace",
  "anonymized": false,
  "status": "active",
  "createdAt": "2026-03-25T10:00:00.000Z",
  "updatedAt": "2026-03-25T10:00:00.000Z",
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
    "field": "rootUserId",
    "reason": "Invalid UUID"
  }
}
```

## Request Semantics

### Create

`POST /v1/root-users`

Body:

```json
{
  "email": "ada.lovelace@example.com",
  "firstName": "Ada",
  "lastName": "Lovelace"
}
```

Notes:

- `status` is not accepted on create
- email is normalized to lowercase
- duplicate non-deleted emails are rejected
- create and other protected routes inherit platform-level authenticated-general
  rate limiting after root-session authentication succeeds

### Exact lookup by email

`GET /v1/root-users?email=person@example.com`

Notes:

- exact email lookup is handled on the collection route
- if `email` is present, the route returns a single root user instead of a paginated list
- only visible, non-deleted, non-anonymized users are returned

### List all

`GET /v1/root-users`

Supported query params:

- `page`
- `pageSize`
- `orderBy`
- `orderDirection`
- `emailPrefix`
- `firstNamePrefix`
- `lastNamePrefix`
- `createdAtFrom`
- `createdAtTo`
- `updatedAtFrom`
- `updatedAtTo`
- `deletedAtFrom`
- `deletedAtTo`
- `status`

### List active

`GET /v1/root-users/active`

Returns active, visible root users only.

### List deleted

`GET /v1/root-users/deleted`

Supported extra filter:

- `excludeAnonymized`

### Remove

`POST /v1/root-users/:rootUserId/remove`

Remove anonymizes the record in place. It does not hard-delete the row.

### Reactivate

`POST /v1/root-users/:rootUserId/reactivate`

A user can be reactivated only when:

- the row exists
- it is deleted
- it is not anonymized
- its email does not conflict with another non-deleted root user

## How To Try It

### Try it with Postman or another API client

Prerequisites:

- the app is running
- you already have a valid root-user session from the `rootAuth` flow
- you have the bearer `sessionId` returned by `POST /v1/root-auth/login/ssh`

Steps:

1. Set:

```text
Authorization: Bearer <sessionId>
```

2. Create a root user with `POST /v1/root-users`:

```json
{
  "email": "ada.lovelace@example.com",
  "firstName": "Ada",
  "lastName": "Lovelace"
}
```

3. List root users with:
   - `GET /v1/root-users`

4. Fetch the created user directly with:
   - `GET /v1/root-users/:rootUserId`

5. Try an exact email lookup with:
   - `GET /v1/root-users?email=ada.lovelace@example.com`

6. Try a normal soft delete with:
   - `DELETE /v1/root-users/:rootUserId`

7. Confirm it appears in:
   - `GET /v1/root-users/deleted`

8. Reactivate it with:
   - `POST /v1/root-users/:rootUserId/reactivate`

9. If you want to exercise irreversible removal behavior, use:
   - `POST /v1/root-users/:rootUserId/remove`

Notes:

- `remove` anonymizes the record in place and is intentionally not reversible
- full route and schema details live in
  [`openapi.yaml`](/home/gordon/kanbien/docs/swagger/openapi.yaml)

### Try it from the browser shell

What you can verify in the browser today:

1. Complete browser login through:
   - `http://localhost:<app-port>/root-admin`

2. Confirm the authenticated console loads successfully and shows the current
   root-user summary sourced through the backend seam.

3. Use the `Root Users` workbench to:
   - create a root user
   - inspect visible and deleted users
   - update a selected visible user
   - soft-delete, reactivate, or remove a root user

4. Use the selected-user panel to:
   - inspect active root-role assignments
   - inspect effective permissions
   - assign, unassign, or replace root-role assignments

5. Use browser devtools or your network inspector to confirm the console is
   using:
   - `GET /v1/root-auth/browser/session`
   - `/v1/root-users/*`
   - `/v1/root-users/:rootUserId/root-roles`
   - `/v1/root-users/:rootUserId/effective-permissions`
