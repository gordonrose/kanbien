# Entity Feature

## Summary

The `entity` feature provides the first backend MSP for root-managed Entity
records at `/v1/entity`. Each Entity is a durable platform self-definition seed
that later layers can extend with deterministic route, relationship, attribute,
compliance, reporting, and capability instructions.

## Current Scope

- root-only API routes
- create, exact read, list, update, and archive behavior
- required `name`, `description`, and `status`
- system-generated `entityId`, `createdAt`, `updatedAt`, and `archivedAt`
- current-name uniqueness on normalized names
- mutation audit events through platform security audit storage

## Deferred Scope

- no frontend
- no replacement/removal of `entityBuilder`, `webAppHierarchyBuilder`,
  `webAppSurfaceDiscovery`, or `webAppPageSettings`
- no route, relationship, attribute, compliance, reporting, or capability
  generation yet
- no hard delete, restore, pending cleanup, or cleanup-failed lifecycle states

## Lifecycle

Allowed first-slice status values:

- `draft`
- `active`
- `superseded`
- `archived`

`DELETE /v1/entity/{entityId}` archives the record. Archived records are
excluded from normal exact reads and lists unless `includeArchived=true` is
provided.

## Verification

- `tests/unit/entity/service.test.ts`
- `tests/integration/entity/flow.test.ts`
- `tests/security/entity/security.test.ts`
- `tests/integration/entity/persistence.test.ts`
