# Entity Foundation Specification

## Purpose

Define the first backend foundation slice for the `entity` feature.

This feature introduces the durable root-managed Entity record that will become
the core building block for platform self-definition. Each Entity is the stable
seed that later layers can attach deterministic route, relationship, attribute,
compliance, reporting, and capability instructions to.

This first slice is intentionally small. It establishes the stable owning
record and root-only API boundary without pretending that the later generation
or definition layers already exist.

It provides the backend capabilities required for:

- create of durable Entity records
- exact current read by system-generated `entityId`
- paginated list of Entity records
- update of editable metadata and lifecycle status
- archive through the normal delete route

It also establishes:

- durable Entity identity through `entityId`
- normalized current-name uniqueness
- first-slice lifecycle status using `draft`, `active`, `superseded`, and
  `archived`
- root-only access through explicit authorization capabilities
- an intentional compatibility bridge toward, but not a replacement of,
  `entityBuilder`, `webAppHierarchyBuilder`, `webAppSurfaceDiscovery`, and
  `webAppPageSettings`

---

## Scope

This phase includes:

- a new `entity` feature under `src/features/`
- root-only backend routes under `/v1/entity`
- durable storage for Entity records
- required `name`, `description`, and `status`
- system-generated `entityId`, `createdAt`, `updatedAt`, and `archivedAt`
- normalized current-name uniqueness
- standard pagination, sorting, and scalar filtering
- explicit archived-record opt-in for reads and lists
- mutation audit events through platform security audit storage
- root authorization capabilities for create, read, update, and archive

This phase does **not** include:

- frontend implementation
- deterministic route generation
- relationship modeling
- attribute modeling
- compliance-rule modeling
- reporting-definition modeling
- capability-generation modeling
- entity-definition versioning
- replacement or removal of `entityBuilder`
- replacement or removal of `webAppHierarchyBuilder`
- replacement or removal of `webAppSurfaceDiscovery`
- replacement or removal of `webAppPageSettings`
- hard delete, restore, pending cleanup, or cleanup-failed states

Those later concerns should build on this durable Entity seed rather than be
collapsed into the first CRUD slice.

---

## Core Concepts

### Entity

An Entity is a root-managed platform self-definition seed record.

Each Entity has:

- `entityId`
- `name`
- `description`
- `status`
- standard system-managed lifecycle timestamps

The Entity record is not yet a full definition model. It is the stable owning
record that future deterministic platform-building layers can extend.

### Entity name

`name` is a required human-readable identifier for root operators.

Rules:

- it must be non-empty after trim
- the system stores a normalized lowercase name for uniqueness and search
- normalized name must be unique while the record is current
- archived records may keep their historical name without blocking a new
  current record from using that normalized name

### Entity description

`description` is the durable explanation of what the Entity represents.

Rules:

- it must be non-empty after trim
- it should explain the Entity in business/platform terms
- it should not carry route, attribute, compliance, reporting, or capability
  instructions in this slice

### Entity status

Initial allowed status values:

- `draft`
- `active`
- `superseded`
- `archived`

Intended semantics:

- `draft`: exists but is not current/default platform truth yet
- `active`: current/default truth for future platform-building layers
- `superseded`: replaced by a newer current Entity direction
- `archived`: retained but removed from ordinary current work

This slice intentionally does not include `deleted`, `pendingDeletion`,
`pendingCleanup`, or `cleanupFailed`. Those states require a fuller cleanup and
retention model before implementation.

### Archived visibility

Archived records are excluded from normal reads and lists.

Root operators may request archived visibility explicitly with
`includeArchived=true`.

### Archive through delete

`DELETE /v1/entity/{entityId}` archives the Entity.

Rules:

- `status` becomes `archived`
- `archivedAt` is set
- `updatedAt` is refreshed
- the record remains retained
- no hard delete occurs

---

## Feature Name

Recommended feature folder:

`src/features/entity/`

This feature is separate from:

- `src/features/entityBuilder/`
- `src/features/webAppHierarchyBuilder/`
- `src/features/webAppSurfaceDiscovery/`
- `src/features/webAppPageSettings/`

Those older features remain supported in this slice.

---

## Trust Boundary And Privileged Actor

### Trust boundary

This phase establishes a privileged root-operator boundary around Entity
management.

- unauthenticated callers may not access Entity routes
- tenant actors may not access Entity routes
- root users without the governing capability may not access the route
- no tenant context is required or inferred

### Primary actor

The primary actor is `RootUserAdmin`.

---

## Capabilities

### Create Entity

Route:

`POST /v1/entity`

Creates one Entity record.

Request body:

- `name`
- `description`
- optional `status`, defaulting to `draft`

System-managed fields are rejected if supplied by the client.

### Read Entity

Route:

`GET /v1/entity/{entityId}`

Reads one current Entity by exact id.

Archived records are hidden unless `includeArchived=true`.

### List Entities

Route:

`GET /v1/entity`

Lists Entity records using repo-standard pagination.

Supported query inputs:

- `page`
- `pageSize`
- `orderBy`
- `orderDirection`
- `namePrefix`
- `status`
- `includeArchived`
- `createdAtFrom`
- `createdAtTo`
- `updatedAtFrom`
- `updatedAtTo`

### Update Entity

Route:

`PATCH /v1/entity/{entityId}`

Updates editable current Entity fields:

- `name`
- `description`
- `status`

Archived records are not editable through normal update.

### Archive Entity

Route:

`DELETE /v1/entity/{entityId}`

Archives one current Entity record. This is the first-slice delete posture.

---

## Authorization

Required root authorization capabilities:

- `entity.create`
- `entity.read`
- `entity.update`
- `entity.delete`

These capabilities are seeded for the protected `RootUserAdmin` role in the
initial slice.

---

## Persistence Requirements

Table:

`entities`

Required columns:

- `entity_id`
- `name`
- `normalized_name`
- `description`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

Required indexes and constraints:

- primary key on `entity_id`
- unique current normalized name where `archived_at IS NULL`
- status check for `draft`, `active`, `superseded`, and `archived`
- non-empty checks for name, normalized name, and description
- archived consistency check between `status` and `archived_at`
- indexes for status, normalized name prefix, created time, updated time, and
  archived time

---

## API Contract And Docs

The maintained API contract is:

- `docs/api-contracts/entity.md`

The maintained data dictionary entry is:

- `docs/data-dictionary/entity.md`

The OpenAPI route contract is maintained in:

- `docs/swagger/openapi.yaml`

---

## Compatibility Notes

This slice is additive.

It does not change or remove:

- `/v1/entity-definitions`
- `/v1/web-app-hierarchy`
- `/v1/web-app-surface-discovery`
- `/v1/web-app-page-settings`

Future replacement or supersession of those route families requires a separate
compatibility plan.

---

## Acceptance Criteria

- `AC-ENTITY-001`: Root operators can create Entity records with required name,
  description, and controlled status.
- `AC-ENTITY-002`: Normal reads and lists exclude archived records by default
  and expose them only through explicit archived opt-in.
- `AC-ENTITY-003`: Root operators can update current Entity metadata and status,
  with `updatedAt` refreshed.
- `AC-ENTITY-004`: Delete archives the record and does not hard-delete it.
- `AC-ENTITY-005`: Normalized current Entity names are unique while archived
  history remains retained.
- `AC-ENTITY-006`: Unauthenticated callers, tenant actors, and root users
  without governing capabilities are denied.
- `AC-ENTITY-007`: Client-supplied system-managed fields are rejected.
- `AC-ENTITY-008`: API contract, data dictionary, permission mapping, OpenAPI,
  feature manifest, and generated dependency graph artifacts stay synchronized.

