# Root Users Backend Specification

## Purpose

Define the backend contract for the `rootUsers` feature that manages privileged
platform users.

This feature owns the durable lifecycle of root-user records and provides the
backend capabilities required for:

- create
- exact lookup
- filtered and paginated listing
- update
- soft delete
- irreversible anonymized removal
- reactivation of eligible soft-deleted rows

It also provides a narrow auth-state seam used by `rootAuth` when sign-in
eligibility depends on root-user lifecycle state.

---

## Scope

This phase includes:

- authenticated backend routes under `/v1/root-users`
- creation of root users
- visible lookup by ID
- exact lookup by normalized email
- filtered and paginated listing
- active-only listing
- deleted-only listing
- update of editable business fields
- soft delete
- anonymized irreversible remove
- reactivation of non-anonymized deleted rows
- auth-state lookup for `rootAuth`

This phase does **not** include:

- a full browser CRUD UI for `rootUsers`
- tenant-user or tenant-admin management
- authorization scopes beyond the current root-user authenticated boundary
- event sourcing or historical snapshot reconstruction beyond the stored row
  lifecycle fields

---

## Core Concepts

### Root user

A `rootUser` is a privileged platform operator record.

It is not an auth principal by itself. Authentication concerns remain in the
separate `rootAuth` feature.

### Visible row

A visible row is:

- not soft-deleted
- not anonymized

Visible rows participate in normal exact lookup and normal update flows.

### Soft delete

Soft delete marks the row deleted while preserving durable history.

Soft-deleted rows:

- are excluded from normal exact and list visibility
- appear through explicit deleted-list capabilities
- may be reactivated if not anonymized and if email uniqueness still allows it

### Remove / anonymize

Remove is irreversible.

It anonymizes the row in place and prevents later reactivation.

### Auth-state seam

`rootAuth` depends on a narrow auth-state seam rather than `rootUsers`
private persistence internals.

That seam must let auth determine whether a root user is:

- active
- inactive
- soft-deleted
- anonymized

---

## Feature Name

Recommended feature folder:

`src/features/rootUsers/`

---

## Capability Matrix

| Capability | Purpose | Request | Response | Rules | Persistence | Errors | Tests |
|---|---|---|---|---|---|---|---|
| `createRootUser` | Create a new root user | email, firstName?, lastName? | created root-user summary | email trimmed/lowercased; duplicate non-deleted email rejected; system generates ID and timestamps | insert root user row | duplicate email, invalid input | valid create, duplicate email, normalization |
| `getRootUser` | Exact visible lookup by ID | rootUserId | root-user summary | only visible rows returned | find visible by ID | not found | visible lookup, deleted hidden, anonymized hidden |
| `getRootUserByEmail` | Exact visible lookup by email | email | root-user summary | normalized email lookup; only visible rows returned | find visible by email | not found | visible lookup, deleted hidden, anonymized hidden |
| `listRootUsers` | Paginated list with filters | query filters, pagination, sorting | paginated list | supports search filters and status filtering; normal list excludes deleted/anonymized rows | list visible rows with totals | invalid query | pagination, filtering, sorting |
| `listActiveRootUsers` | Paginated list of active visible rows | query filters, pagination, sorting | paginated list | only active rows returned | list active visible rows with totals | invalid query | active-only listing |
| `updateRootUser` | Update editable fields | rootUserId plus changed fields | updated root-user summary | only visible rows updated; email uniqueness enforced on normalized email; updatedAt refreshed | update row | not found, duplicate email, invalid input | update names, update status, duplicate email rejection |
| `deleteRootUser` | Soft delete a visible row | rootUserId | updated root-user summary | already-deleted rejected; anonymized rows cannot be deleted again; deletedAt and updatedAt refreshed | soft delete row | not found, already deleted, already anonymized | soft delete, repeat delete rejection |
| `listDeletedRootUsers` | Paginated list of deleted rows | query filters, pagination, sorting, excludeAnonymized | paginated list | explicit deleted-only surface; may hide anonymized rows when requested | list deleted rows with totals | invalid query | deleted listing, exclude anonymized |
| `reActivateRootUser` | Reactivate an eligible deleted row | rootUserId | updated root-user summary | row must exist, be deleted, not be anonymized, and not collide on email | clear deletedAt, refresh updatedAt | not found, not deleted, already anonymized, duplicate email | valid reactivate, conflict rejection |
| `removeRootUser` | Irreversibly anonymize a row | rootUserId | updated root-user summary | operation is irreversible; anonymized row must no longer be reactivatable; anonymized values are system-generated | anonymize row in place, mark lifecycle accordingly | not found | remove/anonymize, later reactivation blocked |
| `readRootUserAuthState` | Expose lifecycle state to auth | rootUserId | narrow auth-state summary | seam must stay narrow and capability-specific | read root-user lifecycle state | missing user -> absent seam result | auth-state integration |

---

## API Endpoints

Protected backend routes:

- `POST /v1/root-users`
- `GET /v1/root-users`
- `GET /v1/root-users/active`
- `GET /v1/root-users/deleted`
- `GET /v1/root-users/:rootUserId`
- `PATCH /v1/root-users/:rootUserId`
- `DELETE /v1/root-users/:rootUserId`
- `POST /v1/root-users/:rootUserId/remove`
- `POST /v1/root-users/:rootUserId/reactivate`

Current boundary rules:

- all routes require a valid root-user authenticated session
- all routes also pass through shared authenticated-general rate limiting

---

## Data Rules

- email values must be trimmed and stored lowercase
- empty strings must be rejected
- client input must not set system-managed fields
- requests that supply unexpected or system-managed fields must be rejected
  explicitly with `INVALID_REQUEST`
- normal reads must exclude soft-deleted rows by default
- deleted rows must be exposed only through explicit deleted-list capabilities
- successful update/delete/reactivate/remove operations must refresh `updatedAt`
- soft delete must set `deletedAt`
- uniqueness is enforced on normalized non-deleted email
- representative invalid-request and duplicate-email errors must return stable
  `code`, `message`, and `details` payloads

---

## Cross-Feature Rule

`rootAuth` may read root-user sign-in eligibility only through the exported
`rootUsers` auth-state seam.

It must not import `rootUsers/persistence/*` directly.

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the backend supports the documented protected `/v1/root-users` routes
2. root-user email is normalized consistently in validation, service logic, and
   persistence
3. visible lookups exclude deleted and anonymized rows
4. deleted rows are exposed only through explicit deleted-list behavior
5. soft delete and remove are behaviorally distinct
6. anonymized rows cannot be reactivated
7. reactivation enforces normalized email uniqueness against non-deleted rows
8. the auth-state seam remains narrow and usable by `rootAuth`
9. shared root-session auth and authenticated-general throttling protect the
   feature routes
10. representative invalid-request and duplicate-email failures return stable
    error payloads with `code`, `message`, and relevant `details`

---

## Risks And Open Questions

- whether later authorization scopes will need narrower route-level permission
  distinctions inside the root-user boundary
- whether the feature should later emit explicit durable audit events of its own
  rather than relying only on surrounding auth/session visibility
- whether root-users browser management should eventually receive its own PRD
  slice rather than extending this backend-focused spec directly
