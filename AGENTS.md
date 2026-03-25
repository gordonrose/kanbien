# Project Instructions

Follow the architecture guidance in:

- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- `docs/architecture/change-control.md`
- `docs/architecture/adr/`

## Default Change Posture

Assume backwards compatibility is required by default.

Do not make changes that:

- remove or stop persisting durable entity-linked data that may be needed later
- make the system depend on mutable related or external data when a durable
  domain fact is required
- break API, persistence, migration, routing, or feature integration contracts
  without a compatibility plan
- silently change shared platform seams or cross-cutting behavior

If a requested change would be breaking, do not implement it silently.
Instead:

1. explain what would break
2. propose a migration or compatibility strategy
3. wait for approval when the trade-off is non-trivial

## Durable Domain Data Rule

Do not make the system depend only on mutable external or related records for facts that must remain stable over time.

If a fact about a user or any other domain entity may still matter later for behavior, permissions, billing, reporting, auditability, compliance, or historical correctness, persist that fact durably on the owning entity or in a durable domain record.

If a related record can change, merge, disappear, or be reassigned, do not replace the durable fact with a live lookup unless the prompt also includes an approved migration or compatibility strategy.

## API And Entity Behavior Defaults

Unless a prompt explicitly states otherwise and includes an approved
compatibility strategy, follow these defaults for all features.

### Normalization And Validation

- email values must be trimmed and stored lowercase
- empty strings must be rejected, not silently converted to null
- timestamps must be ISO-8601 at the API boundary and UTC in storage
- exact route params must be required, never optional

### System-Managed Fields

Clients must not supply system-managed fields.

System-managed fields include identifiers, audit fields, and lifecycle fields
such as:

- `id` or `<entityName>Id`
- `createdAt`
- `updatedAt`
- `deletedAt`
- version fields
- internal audit metadata

The system must generate or maintain these fields itself.

### Visibility And Soft Delete

- normal read capabilities should exclude soft-deleted rows by default
- deleted rows should be exposed only through explicit capabilities
- soft-deleted rows must not be updated through normal update capabilities
  unless restore or reactivation is explicitly supported

### Mutation Semantics

- every successful update must refresh `updatedAt`
- soft delete must set `deletedAt` and refresh `updatedAt`
- create and update operations must not allow clients to override
  system-managed fields

### Uniqueness

- uniqueness rules must be enforced on normalized values where normalization is
  part of the domain contract
- if a feature declares unique active records, the uniqueness rule must be
  reflected consistently in validation, persistence logic, and storage indexes

### Pagination And Sorting

Default pagination and sorting rules:

- `page` default: `1`
- `pageSize` default: `25`
- `pageSize` minimum: `1`
- `pageSize` maximum: `100`
- default order direction: `desc`

List endpoints should return a consistent shape unless a documented platform
decision says otherwise.

### Searchable Storage Rules

Before introducing a searchable field, define its storage model, supported
operators, and index strategy.

Defaults:

- single-value searchable attributes should be stored in scalar columns
- scalar searchable columns should use an index strategy appropriate to the
  approved operators
- multi-value searchable attributes must not use comma-separated strings
- multi-value searchable attributes that need reliable filtering at scale should
  use junction tables
- array or JSONB storage for searchable multi-value attributes requires explicit
  approval based on query patterns and scale

## Feature Architecture

Prefer feature-local changes inside `src/features/<featureName>`.

Follow the established feature structure:

- `contract/`
- `domain/`
- `persistence/`
- `transport/`
- `integration.ts`
- `index.ts`

Keep platform seams explicit:

- app
- v1 router
- feature router

A feature is not fully integrated until it is explicitly mounted in
`src/routes/v1/index.ts`.

## Migration Safety

Treat applied migration file names and paths as stable.

- use sortable zero-padded prefixes such as `0001_description.sql`
- do not rename applied migrations in shared environments
- fix incorrect applied migrations with a new migration

## Escalate Before Changing

Pause and surface the trade-offs before changing:

- public API contracts
- persisted domain data semantics
- migration discovery or identity rules
- global error handling behavior
- shared platform wiring or feature registration conventions
