# Root Users API Contract

## Scope

- Contract name: `root-users`
- Feature: `rootUsers`
- Route family or capability group: Protected root-user lifecycle and listing
  backend routes
- In-scope routes:
  - `POST /v1/root-users`
  - `GET /v1/root-users`
  - `GET /v1/root-users/active`
  - `GET /v1/root-users/deleted`
  - `GET /v1/root-users/{rootUserId}`
  - `PATCH /v1/root-users/{rootUserId}`
  - `DELETE /v1/root-users/{rootUserId}`
  - `POST /v1/root-users/{rootUserId}/remove`
  - `POST /v1/root-users/{rootUserId}/reactivate`
- Out-of-scope but closely related routes:
  - `/v1/root-auth/*` routes that establish the bearer session required here

## Capability

- Feature: `rootUsers`
- Capability: Manage the durable lifecycle of privileged root-user records and
  expose a protected CRUD-plus-list backend surface

## Authentication

- Required auth state: Authenticated root-user session is required for every
  route in this family
- Session transport(s):
  - `Authorization: Bearer <sessionId>` for API/manual callers
  - same-origin root-admin browser session cookie for the current browser
    operator console

## Authorization

- Allowed roles: Current root-user-authenticated boundary only
- Denied roles: Unauthenticated callers and any non-root actor model
- Enforcement point: Shared `createRequireRootSession(...)` middleware mounted
  in `src/routes/v1/index.ts`

## Middleware And Platform Effects

- Route protection middleware: Shared root-session middleware rejects missing
  session transport with `401 UNAUTHORIZED` and invalid/expired sessions with
  `401 INVALID_SESSION`
- Rate limiting / abuse controls: Shared authenticated-general rate limiting
  applies to the entire `/v1/root-users` subtree and may return
  `429 RATE_LIMITED`
- Browser-specific behavior: There is still no route-local cookie logic inside
  `rootUsers` itself, but the mounted shared root-session middleware now
  accepts the same root-admin browser-session cookie used by the same-origin
  operator console.
- Other shared platform behavior: App-level JSON error middleware handles
  unexpected failures outside the feature-local `RootUserError` mapping

## Route

- Method: mixed
- Path: `/v1/root-users*`

## Request Contract

- Params:
  - `rootUserId` is required where present and must be a UUID
- Query:
  - `GET /v1/root-users?email=<email>` performs exact visible lookup by
    normalized email
  - `GET /v1/root-users` without `email` performs a paginated list
  - list defaults: `page=1`, `pageSize=25`, `orderDirection=desc`
  - `GET /v1/root-users` supports `orderBy` in
    `email|firstName|lastName|status|createdAt|updatedAt|deletedAt`
  - `GET /v1/root-users/active` supports `orderBy` in
    `email|firstName|lastName|createdAt|updatedAt`
  - `GET /v1/root-users/deleted` supports `excludeAnonymized`
  - prefix filters require at least 3 trimmed characters
  - date filters must be ISO-8601 date-time strings with offset
- Body:
  - create: `{ email, firstName?, lastName? }`
  - update: at least one of `{ email?, firstName?, lastName?, status? }`
  - delete, remove, reactivate: no body
- Validation rules:
  - request bodies and query objects are strict; unexpected fields are rejected
  - email is trimmed, validated, and normalized to lowercase
  - names must be non-empty when supplied
  - create does not accept system-managed fields or initial `status`
  - update requires at least one supplied field

## Response Contract

- Success payload:
  - single-item routes return a `RootUserResponse` shape:
    `{ rootUserId, email, firstName?, lastName?, anonymized, status, createdAt, updatedAt, deletedAt }`
  - list routes return
    `{ items, page, pageSize, totalPages, totalSearchableRecords, totalMatchingRecords }`
  - `GET /v1/root-users` is overloaded:
    - with `email`: returns one `RootUserResponse`
    - without `email`: returns paginated list payload
- Status code:
  - `201` for create
  - `200` for all reads and lifecycle mutations
- Response headers or cookies:
  - no route-family-specific headers or cookies

## Error Contract

- Error codes:
  - feature-local: `INVALID_REQUEST`, `ROOT_USER_NOT_FOUND`,
    `ROOT_USER_EMAIL_ALREADY_EXISTS`, `ROOT_USER_ALREADY_DELETED`,
    `ROOT_USER_NOT_DELETED`, `ROOT_USER_ALREADY_ANONYMIZED`
  - shared middleware: `UNAUTHORIZED`, `INVALID_SESSION`, `RATE_LIMITED`
- Representative messages:
  - `INVALID_REQUEST`: "Your request could not be accepted because one or more fields are missing or invalid."
  - `ROOT_USER_EMAIL_ALREADY_EXISTS`: "That email address is already in use by another active root user."
  - `ROOT_USER_ALREADY_ANONYMIZED`: "That root user has already been anonymized and cannot be changed in this way."
- `details` shape:
  - when present: `{ field?: string, reason?: string }`
  - validation failures may use reasons such as `unexpected_field` or schema
    messages
  - duplicate email uses `{ field: "email", reason: "duplicate_active_email" }`
- Shared middleware errors:
  - `401 UNAUTHORIZED` when no accepted session transport is present
  - `401 INVALID_SESSION` when session is invalid or expired
  - `429 RATE_LIMITED` from authenticated-general platform throttling

## Persistence / Side Effects

- Durable writes:
  - create inserts a `root_users` row
  - update changes editable fields and refreshes `updated_at`
  - delete sets `status='inactive'`, `deleted_at`, and `updated_at`
  - remove anonymizes fields in place, marks the row deleted, and prevents
    future reactivation
  - reactivate clears `deleted_at`, sets `status='active'`, and refreshes
    `updated_at`
- Audit effects:
  - no feature-local durable audit entity is currently written by `rootUsers`
- Cross-feature reads:
  - none at route execution time
  - this feature separately exports `createRootUsersAuthStateReader` and
    `createRootUsersBrowserSummaryReader` seams for `rootAuth`
- Other side effects:
  - visible reads exclude deleted and anonymized rows by default
  - deleted-only listing can optionally suppress anonymized rows

## Compatibility / Lifecycle Notes

- Notes:
  - The route family is protected-only. `rootUsers` is no longer a public API
    surface.
  - `GET /v1/root-users` intentionally combines exact email lookup and paginated
    listing. Callers must branch on whether they supplied the `email` query.
  - The same protected route family is now reachable through either bearer
    session transport or the same-origin root-admin browser-session cookie.
  - The persisted lifecycle contract distinguishes soft delete from irreversible
    anonymized remove.

## Traceability

- PRD / design docs:
  - `docs/prd/2026-03-29-0002-root-users-backend.md`
  - `docs/featureDocs/rootUsers-feature.md`
- OpenAPI:
  - `docs/swagger/openapi.yaml` paths under `/v1/root-users*`
- Tests required or existing:
  - PRD-derived cases under `docs/prd/test_cases/` should cover create, exact
    lookup, list filtering, delete, remove, and reactivate behavior

## Tests Required

- Unit:
  - email normalization and duplicate rejection
  - update validation and lifecycle transition rules
- Integration:
  - protected-route enforcement
  - exact email lookup vs paginated list behavior
  - delete/remove/reactivate persistence outcomes
- Security:
  - unauthorized and invalid-session access rejection
  - authenticated-general rate limiting on representative routes
- Audit:
  - n/a for feature-local audit writes in the current phase
- Edge:
  - deleted rows hidden from visible reads
  - anonymized rows excluded from visible reads and reactivate flow
  - `excludeAnonymized=true` on deleted listing
