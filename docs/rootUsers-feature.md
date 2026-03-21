# RootUsers Feature Reference

## Purpose

The `rootUsers` feature manages privileged user entities for the platform.
It owns:

- creation and lookup of root users
- active/inactive lifecycle state
- soft deletion
- irreversible anonymized removal
- reactivation of soft-deleted, non-anonymized users
- filtered and paginated listing APIs

This document is intended to be enough context to:

- iterate the feature safely
- consume `rootUsers` from another backend feature
- build frontend experiences on top of the feature

## Where It Lives

Source layout:

- `src/features/rootUsers/contract`
- `src/features/rootUsers/domain`
- `src/features/rootUsers/persistence`
- `src/features/rootUsers/transport`
- `src/features/rootUsers/integration.ts`
- `src/features/rootUsers/index.ts`

Platform integration:

- mounted in `src/routes/v1/index.ts`
- base route: `/v1/root-users`

Database migration folder:

- `src/features/rootUsers/persistence/migrations`

## Feature Entry Point

Export:

- `createRootUsersFeature`

Usage:

```ts
import { createRootUsersFeature } from "../../features/rootUsers";
import { dbPool } from "../../lib/db";

v1Router.use("/root-users", createRootUsersFeature({ dbPool }));
```

## Domain Model

Primary entity shape returned by the feature:

- `rootUserId: string`
- `email: string`
- `firstName: string | null`
- `lastName: string | null`
- `anonymized: boolean`
- `status: "active" | "inactive"`
- `createdAt: string`
- `updatedAt: string`
- `deletedAt: string | null`

Important meaning of fields:

- `status` is a business-state flag, not a deletion flag
- `deletedAt !== null` means the record is soft deleted
- `anonymized === true` means the record has been removed in a privacy-preserving way and should generally not be treated as a usable person record anymore

## Lifecycle Rules

### Active user

An active usable root user typically has:

- `status = "active"`
- `deletedAt = null`
- `anonymized = false`

### Inactive user

An inactive user may still be visible and usable in admin flows, depending on deletion state.
Typical cases:

- manually updated to `status = "inactive"`
- soft deleted, which also sets status inactive

### Soft delete

Soft delete means:

- `deleted_at` is set to the current timestamp
- `status` is set to `"inactive"`
- `anonymized` remains `false`

Soft-deleted users can be reactivated later.

### Remove / anonymize

Remove is not a SQL hard delete.
It updates the existing row in place:

- `email` is replaced with a generated anonymized value
- first and last names are replaced with generated anonymized values
- normalized fields are updated too
- `anonymized = true`
- `status = "inactive"`
- `deleted_at` is set if not already present

This keeps referential continuity by preserving `root_user_id`, while destroying personally identifiable data.

Anonymized users cannot be reactivated.

### Reactivate

A user can be reactivated only if:

- the row exists
- it is soft deleted
- it is not anonymized
- its normalized email does not conflict with another active root user

Reactivation sets:

- `status = "active"`
- `deleted_at = null`

## API Surface

Base path:

- `/v1/root-users`

Routes:

- `POST /v1/root-users`
- `GET /v1/root-users`
- `GET /v1/root-users/active`
- `GET /v1/root-users/deleted`
- `GET /v1/root-users/by-email?email=person@example.com`
- `GET /v1/root-users/:rootUserId`
- `PATCH /v1/root-users/:rootUserId`
- `DELETE /v1/root-users/:rootUserId`
- `POST /v1/root-users/:rootUserId/remove`
- `POST /v1/root-users/:rootUserId/reactivate`

Response envelope pattern:

```json
{
  "body": {}
}
```

Error pattern:

```json
{
  "code": "SOME_ERROR_CODE",
  "message": "Human readable message",
  "details": {}
}
```

Validation errors use:

- `code = "INVALID_REQUEST"`

Unexpected server errors use:

- `code = "INTERNAL_ERROR"`

## Request Semantics

### Create

`POST /v1/root-users`

Body:

```json
{
  "email": "ada.lovelace@example.com",
  "firstName": "Ada",
  "lastName": "Lovelace",
  "status": "active"
}
```

Notes:

- `status` is optional and defaults to `active`
- email is normalized to lowercase
- duplicate active emails are rejected

### Get by ID

`GET /v1/root-users/:rootUserId`

Notes:

- returns only visible records
- deleted or anonymized users are treated as not found by the visible lookup path

### Get by Email

`GET /v1/root-users/by-email?email=...`

Notes:

- exact lookup against normalized email
- only visible records are returned

### List all

`GET /v1/root-users`

Supports:

- pagination
- sorting
- prefix filtering
- date-range filtering
- optional status filtering
- inclusion of deleted rows via feature list semantics

Useful query params:

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

### List active only

`GET /v1/root-users/active`

This is the cleanest endpoint for UI screens that should only show currently active, non-deleted users.

### List deleted only

`GET /v1/root-users/deleted`

Useful extra flag:

- `excludeAnonymized`

Use `excludeAnonymized=true` when a screen should show soft-deleted users but hide privacy-scrubbed removed ones.

### Update

`PATCH /v1/root-users/:rootUserId`

Supports updating:

- `email`
- `firstName`
- `lastName`
- `status`

Notes:

- only visible users can be updated
- duplicate active emails are rejected
- at least one field is required

### Soft delete

`DELETE /v1/root-users/:rootUserId`

Notes:

- only non-deleted, non-anonymized users can be soft deleted
- result remains recoverable through reactivation

### Remove

`POST /v1/root-users/:rootUserId/remove`

Notes:

- this is the privacy/anonymization path
- it preserves the record ID but destroys meaningful personal data
- use this only when future restoration is not required

### Reactivate

`POST /v1/root-users/:rootUserId/reactivate`

Notes:

- works only for soft-deleted, non-anonymized users
- fails if the original email conflicts with another active user

## Persistence Model

Table:

- `root_users`

Columns:

- `root_user_id UUID PRIMARY KEY`
- `email TEXT NOT NULL`
- `normalized_email TEXT NOT NULL`
- `first_name TEXT NULL`
- `normalized_first_name TEXT NULL`
- `last_name TEXT NULL`
- `normalized_last_name TEXT NULL`
- `anonymized BOOLEAN NOT NULL DEFAULT FALSE`
- `status TEXT NOT NULL CHECK (status IN ('active', 'inactive'))`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- `deleted_at TIMESTAMPTZ NULL`

Indexes and constraints:

- unique active email constraint on `normalized_email` where `deleted_at IS NULL`
- indexes on normalized first name, normalized last name, created_at, updated_at, deleted_at, status

Why normalized columns exist:

- case-insensitive exact match on email
- case-insensitive prefix search on names and email
- avoids relying on repeated SQL `lower(...)` expressions everywhere

## Repository Semantics

The repository distinguishes between visible and any-record lookups.

Visible lookup:

- excludes deleted rows
- excludes anonymized rows

Any-record lookup:

- returns rows regardless of deletion/anonymization state

This distinction matters when:

- building admin-facing flows
- deciding whether a record should be recoverable
- interpreting not-found responses in other features

## Cross-Feature Integration Guidance

If another backend feature needs to reference a root user:

- prefer storing `rootUserId` as the foreign key/reference
- do not treat email as a stable identifier
- do not assume names remain available forever
- do not assume deleted users are visible through standard lookup endpoints

Safe assumptions:

- `rootUserId` is stable
- `email` may change
- names may change
- removed users may be anonymized
- soft-deleted users may later be reactivated

If another feature needs to validate an acting admin/root user:

- use an active/visible lookup path
- do not rely on list endpoints for authorization checks

If another feature needs historical attribution:

- keep the `rootUserId`
- avoid copying `email`, `firstName`, or `lastName` as permanent truth

## Frontend Guidance

### Recommended screen-to-endpoint mapping

For a primary management table:

- use `GET /v1/root-users`

For an "active users" table:

- use `GET /v1/root-users/active`

For a deleted users / recycle-bin style view:

- use `GET /v1/root-users/deleted`

For exact email search:

- use `GET /v1/root-users/by-email`

For details pages:

- use `GET /v1/root-users/:rootUserId`

### UI distinctions to preserve

The UI should visually distinguish:

- active vs inactive
- deleted vs not deleted
- anonymized vs non-anonymized

Suggested interpretations:

- active + not deleted: normal operational user
- inactive + not deleted: intentionally disabled user
- deleted + not anonymized: soft deleted and potentially restorable
- anonymized: privacy-scrubbed historical record, generally not editable or restorable

### Frontend behavior considerations

- sort and filter state should be preserved in the URL when possible
- list endpoints are paginated, so UI components should not assume full dataset loading
- deleted/anonymized records should be labeled clearly
- reactivate should only be offered for deleted, non-anonymized users
- remove/anonymize should be treated as a high-friction destructive action

## Operational Notes

Migration command:

```bash
npm run db:migrate
```

Development startup:

```bash
npm run dev
```

The migration runner scans:

- `src/features/**/migrations/*.sql`

## Known Design Constraints

- `remove` is not a physical delete; it is an anonymizing update
- visible lookups intentionally hide deleted/anonymized rows
- normalized fields must stay in sync with raw fields
- unique-email behavior is enforced only among active, non-deleted rows

## If You Iterate This Feature

Before changing behavior, decide explicitly whether the rule applies to:

- visible users only
- all records including deleted
- anonymized records too

Common pitfalls:

- confusing inactive with deleted
- treating remove as a hard delete
- forgetting to update normalized fields when changing names or email
- exposing anonymized users in screens that expect real people
- breaking the reactivation conflict check on email uniqueness

If you add new actions:

- define whether they work on visible records or any records
- define whether anonymized records are allowed
- update both the transport contract and this document

