# Entity API Contract

## Scope

- Contract name: `entity`
- Feature: `entity`
- Route family or capability group:
  root-only Entity CRUD routes for platform self-definition seed records
- In-scope routes:
  - `POST /v1/entity`
  - `GET /v1/entity`
  - `GET /v1/entity/{entityId}`
  - `PATCH /v1/entity/{entityId}`
  - `DELETE /v1/entity/{entityId}`

## Capability

- Feature: `entity`
- Capability:
  Create, read, update, list, and archive root-managed Entity records. Each
  Entity is the durable seed that later platform-definition layers can attach
  route, relationship, attribute, compliance, reporting, and capability
  instructions to.

## Authentication

- Required auth state:
  authenticated root-user session for every route
- Session transports:
  - `Authorization: Bearer <sessionId>`
  - same-origin root-admin browser session cookie through shared root-session
    middleware

## Authorization

- Allowed roles:
  `RootUserAdmin` in the initial implementation
- Denied roles:
  unauthenticated callers and root users without the governing capability
- Enforcement point:
  shared `requireRootSession` middleware plus `createRequireRootCapability(...)`
  checks using:
  - `entity.create`
  - `entity.read`
  - `entity.update`
  - `entity.delete`

## Request Contract

- `POST /v1/entity`
  - body:
    `{ name, description, status? }`
  - `status` defaults to `draft`
  - allowed status values:
    `draft`, `active`, `superseded`, `archived`
  - client-supplied system fields are rejected
- `GET /v1/entity`
  - query:
    repo-standard `page`, `pageSize`, `orderBy`, `orderDirection`
  - `orderBy`:
    `name`, `status`, `createdAt`, `updatedAt`, `archivedAt`
  - filters:
    `namePrefix`, `status`, `includeArchived`, `createdAtFrom`,
    `createdAtTo`, `updatedAtFrom`, `updatedAtTo`
  - archived records are excluded unless `includeArchived=true`
- `GET /v1/entity/{entityId}`
  - path:
    exact UUID `entityId`
  - query:
    optional `includeArchived=true`
- `PATCH /v1/entity/{entityId}`
  - body:
    at least one of `name`, `description`, or `status`
  - archived records are not editable through this normal update route
- `DELETE /v1/entity/{entityId}`
  - archives the record by setting `status=archived`, `archivedAt`, and
    refreshing `updatedAt`
  - this slice does not hard-delete Entity records

## Response Contract

- Entity response:
  - `entityId`
  - `name`
  - `description`
  - `status`
  - `createdAt`
  - `updatedAt`
  - `archivedAt`
- list response:
  - `items`
  - `page`
  - `pageSize`
  - `totalPages`
  - `totalSearchableRecords`
  - `totalMatchingRecords`

## Error Contract

- feature-local:
  - `INVALID_REQUEST`
  - `ENTITY_NOT_FOUND`
  - `ENTITY_NAME_ALREADY_EXISTS`
  - `ENTITY_ALREADY_ARCHIVED`
- shared middleware:
  - `UNAUTHORIZED`
  - `INVALID_SESSION`
  - `FORBIDDEN`
  - `RATE_LIMITED`

## Persistence / Side Effects

- writes table:
  `entities`
- normalized search column:
  `normalized_name`
- current-name uniqueness:
  unique normalized name while `archived_at IS NULL`
- successful create, update, and archive operations write platform security
  audit events:
  - `entity_created`
  - `entity_updated`
  - `entity_archived`

## Compatibility / Lifecycle Notes

- This first slice intentionally does not replace or remove `entityBuilder`,
  `webAppHierarchyBuilder`, `webAppSurfaceDiscovery`, or `webAppPageSettings`.
- `DELETE` means archive in this slice because the fuller delete,
  pending-cleanup, and cleanup-failed lifecycle model has not yet been designed.
- Future deterministic platform-building layers must treat these records as the
  durable owning seed rather than depending on mutable derived records for
  stable domain facts.
