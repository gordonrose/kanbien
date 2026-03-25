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
import { dbPool } from "../../lib/db";

v1Router.use("/root-users", createRootUserFeature(dbPool));
```

Current mount point:

- `src/routes/v1/index.ts`
- base route: `/v1/root-users`

All `rootUsers` routes are protected by root-user authentication.
`rootUsers` is no longer a public feature surface.

## Runtime Contracts

### Router factory

The feature now expects a raw `pg` `Pool` instance:

```ts
createRootUserFeature(dbPool)
```

It no longer expects an object like `{ dbPool }`.

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
