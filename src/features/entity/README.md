# Entity Feature

`entity` owns the root-only API foundation for durable platform
self-definition records.

The first slice supports standard Entity CRUD behavior for root operators and
stores the resolved repo-generation identity fields that future capability
generation will consume:

- `entityKey`
- `featureName`
- `tableName`
- `idField`
- `idColumn`
- `scope`
- `routeBase`

`featureName` and `scope` are required on create. `scope` must be explicit and
may be `root`, `tenant`, or `shared-cross-tenant`. Shared cross-tenant scope
requires explicit approval through the request contract before the record can be
created or changed to that scope.

Suggested identity fields are resolved only when the caller omits them. Once
accepted, the resolved values are persisted and returned as stored truth rather
than recalculated on read.

## Shape

- `contract/` owns API validation, request/response types, and feature errors.
- `domain/<capabilityName>.ts` owns one business capability per file.
- `domain/service.ts` composes capability functions behind the feature service.
- `persistence/` owns repository contracts, DB record shapes, PostgreSQL logic,
  and feature migrations.
- `transport/router.ts` owns Express request handling and root capability gates.
- `integration.ts` wires the repository, service, router, and platform
  dependencies.
