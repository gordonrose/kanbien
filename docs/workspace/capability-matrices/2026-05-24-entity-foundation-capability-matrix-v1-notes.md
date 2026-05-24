# Entity Foundation Capability Matrix Notes

## Source

- PRD: `docs/prd/2026-05-24-0026-entity-foundation.md`
- API contract: `docs/api-contracts/entity.md`
- Data dictionary: `docs/data-dictionary/entity.md`
- Test cases: `docs/prd/test_cases/2026-05-24-0026-entity-foundation-test-cases.md`

## Scope

This matrix covers the backend-only `/v1/entity` MSP:

- `createEntity`
- `getEntity`
- `listEntities`
- `updateEntity`
- `deleteEntity`

The matrix intentionally treats `deleteEntity` as archive semantics. Hard
delete, restore, pending cleanup, cleanup failure, route generation,
relationship modeling, attribute modeling, compliance rules, reporting rules,
and capability generation are out of scope.

## Governance Notes

- Capability boundary is root-only.
- Tenant context is not applicable.
- Frontend is not required.
- Permission mapping, API contract, data dictionary, feature manifest, OpenAPI,
  generated dependency graph, and test-case docs are required because this is a
  new protected route family and durable platform metadata feature.
- No asset decision record is required because this slice does not upload,
  read, link, display, download, replace, delete, or publish user-managed
  assets.
- No job/cleanup decision is required for the first slice because the only
  lifecycle terminal action is retained archive. Adding delete, pending cleanup,
  cleanup failure, purge, restore, or scheduled cleanup requires a new governed
  lifecycle decision.

