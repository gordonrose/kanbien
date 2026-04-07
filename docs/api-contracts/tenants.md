# Tenants API Contract

## Scope

- Contract name: `tenants`
- Feature: `tenants`
- Route family or capability group:
  Protected root-only tenant lifecycle and metadata backend routes
- In-scope routes:
  - `POST /v1/tenants`
  - `GET /v1/tenants`
  - `GET /v1/tenants/deleted`
  - `GET /v1/tenants/{tenantId}`
  - `GET /v1/tenants/deleted/{tenantId}`
  - `PATCH /v1/tenants/{tenantId}`
  - `POST /v1/tenants/{tenantId}/delete`
  - `POST /v1/tenants/{tenantId}/reactivate`
  - `POST /v1/tenants/{tenantId}/remove`
- Out-of-scope but closely related routes:
  - `/v1/root-auth/*` routes that establish the protected root session required
    here
  - `/v1/root-roles/*` routes that manage the root capability grants governing
    access to this route family

## Capability

- Feature: `tenants`
- Capability:
  Manage durable tenant records through root-only create, read, list, update,
  soft delete, reactivate, and remove flows

## Authentication

- Required auth state:
  Authenticated root-user session is required for every route in this family
- Session transport(s):
  - `Authorization: Bearer <sessionId>` for API/manual callers
  - same-origin root-admin browser session cookie through shared root-session
    middleware

## Authorization

- Allowed roles:
  `RootUserAdmin` only in the initial implemented slice
- Denied roles:
  unauthenticated callers, invalid root sessions, and any future narrower root
  role that lacks the governing capability for the route
- Enforcement point:
  shared `requireRootSession` middleware at `/v1` plus central
  `createRequireRootCapability(...)` checks using the mapped `tenant.*`
  capability keys

## Middleware And Platform Effects

- Route protection middleware:
  shared root-session middleware rejects missing accepted session transport
  with `401 UNAUTHORIZED` and invalid/expired sessions with `401 INVALID_SESSION`
- Rate limiting / abuse controls:
  shared authenticated-general rate limiting applies to the mounted `tenants`
  route family and may return `429 RATE_LIMITED`
- Browser-specific behavior:
  there is no tenant-local cookie logic; browser callers rely on the same
  root-admin session cookie accepted by the shared root-session middleware
- Other shared platform behavior:
  app-level JSON error middleware handles unexpected failures outside the
  feature-local error mapping

## Route

- Method:
  mixed
- Path:
  `/v1/tenants*`

## Request Contract

- Params:
  - `tenantId` is required where present and must be an exact UUID
- Query:
  - `GET /v1/tenants` uses standard defaults:
    `page=1`, `pageSize=25`, `orderDirection=desc`
  - `GET /v1/tenants/deleted` uses the same pagination defaults
  - visible list supports:
    `bizIdPrefix`, `namePrefix`, `category`, `status`,
    `createdAtFrom`, `createdAtTo`, `updatedAtFrom`, `updatedAtTo`
  - deleted list supports the same filters plus:
    `deletedAtFrom`, `deletedAtTo`
  - visible list `orderBy` values:
    `bizId`, `name`, `category`, `status`, `createdAt`, `updatedAt`
  - deleted list additionally supports:
    `deletedAt`
- Body:
  - create:
    `{ bizId, name, category, status? }`
  - update:
    at least one of `{ name?, category?, status? }`
  - soft delete:
    no required body
  - reactivate:
    no required body
  - remove:
    `{ confirm: true, reason }`
- Validation rules:
  - request bodies and query objects are strict; unexpected fields are rejected
  - `bizId` is trimmed and normalized to lowercase before persistence and
    uniqueness checks
  - `name` must reject empty strings
  - `category` must be one of `customer`, `demo`, `test`
  - `status` must be one of `draft`, `live`, `disabled`, `inactive`
  - clients must not supply system-managed fields such as `tenantId`,
    `createdAt`, `updatedAt`, `deletedAt`, or `createdByRootAdminUserId`
  - remove requires both explicit confirmation and a non-empty reason

## Response Contract

- Success payload:
  - exact and mutation routes return a tenant summary:
    `{ tenantId, bizId, name, category, status, createdByRootAdminUserId, createdAt, updatedAt, deletedAt }`
  - list routes return a paginated list shape:
    `{ items, page, pageSize, totalPages, totalSearchableRecords, totalMatchingRecords }`
  - list items intentionally omit `createdByRootAdminUserId` in the current
    slice
- Status code:
  - `201` for create success
  - `200` for reads, lists, updates, soft delete, reactivate, and remove
- Response headers or cookies:
  - no route-family-specific headers or cookies

## Error Contract

- Error codes:
  - feature-local:
    - `INVALID_REQUEST`
    - `TENANT_NOT_FOUND`
    - `TENANT_BIZ_ID_ALREADY_EXISTS`
    - `TENANT_ALREADY_DELETED`
    - `TENANT_NOT_DELETED`
  - shared middleware:
    - `UNAUTHORIZED`
    - `INVALID_SESSION`
    - `FORBIDDEN`
    - `RATE_LIMITED`
- Representative messages:
  - invalid request:
    "Your request could not be accepted because one or more fields are missing or invalid."
  - not found:
    "We could not find a tenant with that ID."
  - duplicate active business identifier:
    "That business identifier is already in use by another active tenant."
- `details` shape:
  - when present:
    `{ field?: string, reason?: string }`
  - representative reasons include:
    `unexpected_field`, `already_deleted`, `not_deleted`,
    `duplicate_active_biz_id`, `duplicate_active_biz_id_on_reactivation`

## Persistence / Side Effects

- Durable writes:
  - create inserts a durable tenant row with creator attribution
  - update changes editable tenant metadata and refreshes `updatedAt`
  - soft delete sets `deletedAt`, forces exposed `status = inactive`, preserves
    `preDeleteStatus`, and refreshes `updatedAt`
  - reactivate clears `deletedAt`, restores `preDeleteStatus`, clears
    `preDeleteStatus`, and refreshes `updatedAt`
  - remove hard-deletes the tenant row in the current tenant-only slice
- Audit effects:
  - denied capability-gated requests create shared platform security audit
    events through the central authz middleware
  - successful lifecycle mutations are currently operator-visible through
    authenticated backend responses and tenant test coverage; no tenant-local
    durable success-audit table exists yet
- Cross-feature reads:
  - none in the current runtime implementation
- Other side effects:
  - active uniqueness is enforced on `normalized_biz_id`
  - deleted rows are intentionally hidden from normal visible read and list
    routes

## Compatibility / Lifecycle Notes

- Notes:
  - This contract reflects the currently implemented root-only tenant slice.
  - `bizId` is treated as a durable business identifier and is immutable after
    creation.
  - `disabled` and `inactive` remain distinct status values even though both
    are root-managed in the current slice.
  - Remove is intentionally exceptional and only considered safe while tenants
    do not yet own other durable domain entities.
  - A future tenant-owned durable entity slice should revisit remove semantics,
    purge policy, and durable success-audit expectations.

## Traceability

- PRD / design docs:
  - [2026-04-07-0005-tenants-backend.md](/home/gordon/kanbien/docs/prd/2026-04-07-0005-tenants-backend.md)
  - [2026-04-07-tenants-backend-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-07-tenants-backend-foundation.md)
- OpenAPI:
  - [openapi.yaml](/home/gordon/kanbien/docs/swagger/openapi.yaml)
- Tests required or existing:
  - [2026-04-07-0005-tenants-backend-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-07-0005-tenants-backend-test-cases.md)

## Tests Required

- Unit:
  - `bizId` normalization and duplicate active-business-ID rejection
  - visible vs deleted read separation
  - visible vs deleted list separation
  - update of editable metadata only
  - soft-delete and reactivation lifecycle restoration
  - remove semantics
- Integration:
  - protected-route enforcement through authenticated root session
  - `/v1` mounting behind shared authenticated-general rate limiting
  - end-to-end tenant lifecycle behavior across router, service, and
    persistence
  - visible vs deleted list filtering behavior
- Security:
  - missing or invalid session rejection
  - per-route tenant capability allow and deny coverage
  - malformed UUID, enum, and unexpected-field rejection
  - authenticated-general throttling on representative routes
- Audit:
  - denied capability-gated requests remain visible through platform security
    audit events
  - successful lifecycle actions remain operator-visible through backend
    responses until a durable success-audit sink is approved
