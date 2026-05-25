# Entity Full Feature Standards Audit

Date: 2026-05-24

Scope: full `/entity` backend feature loop, including source structure,
capability split, route integration, authz, persistence, migrations, tests,
API contract, OpenAPI, Postman, data dictionary, permission mappings,
feature manifest, and generated dependency graph.

## Authorities Checked

- `AGENTS.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- `docs/architecture/change-control.md`
- `docs/architecture/adr/0002-use-feature-bundle-architecture.md`
- `docs/architecture/adr/0003-use-explicit-feature-registration-at-the-platform-router.md`
- `docs/architecture/adr/0006-standardize-feature-internal-module-conventions.md`
- `docs/architecture/adr/0007-standardize-cross-feature-api-and-entity-behavior-defaults.md`
- `docs/architecture/adr/0031-add-feature-manifests-for-declared-seams-and-dependencies.md`
- `docs/standards/change-artifact-requirements.md`
- `docs/standards/QA-RELEASE-GATE.md`

## Findings

### Must Fix Soon

No open Must Fix Soon findings remain after this audit pass.

During the audit, an in-progress drift was identified and corrected before it
was left in the worktree: `listEntities` had been changed toward returning a
bare array. That conflicts with ADR-0007 and the Entity capability matrix,
which require the repo-standard paginated list envelope unless an approved
exception exists. The source and tests were restored to the standard
`{ items, page, pageSize, totalPages, totalSearchableRecords,
totalMatchingRecords }` list shape.

### Should Fix Soon

1. OpenAPI was stale for the repo-generation identity fields.

   Evidence:
   - Source returns and accepts `entityKey`, `featureName`, `tableName`,
     `idField`, `idColumn`, `scope`, and `routeBase`.
   - `docs/swagger/openapi.yaml` did not fully describe those fields before
     this audit pass.

   Resolution:
   - `EntityScope`, Entity response fields, create body fields, update body
     fields, and required create fields were added to OpenAPI.

2. Maintained Postman coverage was missing for `/entity`.

   Evidence:
   - `/entity` has a maintained API contract and OpenAPI path.
   - `docs/postman/README.md` did not list an Entity collection.

   Resolution:
   - `docs/postman/collections/entity.postman_collection.json` was added.
   - `docs/postman/README.md` now lists the Entity collection.

3. Data dictionary inventory did not list the implemented Entity record.

   Evidence:
   - `docs/data-dictionary/entity.md` exists for the implemented Entity record.
   - `docs/data-dictionary/index.md` did not list it.

   Resolution:
   - `docs/data-dictionary/index.md` now includes Entity.

### Watchlist / Conscious Debt

1. Persistence-backed Entity proof is present but not executed in the default
   local test command.

   Evidence:
   - `tests/integration/entity/persistence.test.ts` exists.
   - Focused test execution skipped it because Postgres test execution was not
     enabled in the current environment.

   Judgment:
   - Acceptable only as a local evidence limitation. Promotion or release
     evidence should include the Postgres-backed test path when database config
     is available.

2. Runtime authenticated list-shape proof was not completed in this audit pass.

   Evidence:
   - Route mounting was verified after restarting the dev server by receiving
     JSON `401 Unauthorized` for both `GET /v1/entity` and `POST /v1/entity`
     instead of Express `404 Cannot POST`.
   - The current list response shape is covered by the route integration test,
     but not by a live authenticated Postman or curl request in this pass.

   Judgment:
   - The route is mounted and executable tests cover the shape. A live
     authenticated Postman check remains useful before relying on manual API
     exploration.

## Still Aligned

- Feature bundle structure matches ADR-0002 and ADR-0006:
  `contract/`, `domain/`, `persistence/`, `transport/`, `integration.ts`,
  `index.ts`, and `feature.manifest.json` are present.
- Capabilities are split by file:
  `createEntity`, `getEntity`, `listEntities`, `updateEntity`, and
  `deleteEntity`.
- `src/routes/v1/index.ts` explicitly mounts `/entity`, matching ADR-0003.
- Root-only route protection is present through shared root session middleware
  and feature-local root capability checks.
- Root capabilities are present in both the migration seed and rootRoles
  source catalog:
  `entity.create`, `entity.read`, `entity.update`, and `entity.delete`.
- Permission mapping artifacts include Entity backend capability mappings and
  RootUserAdmin grant mappings.
- `feature.manifest.json` declares the public feature factory and response
  types, and `npm run check:feature-dependencies` reports zero violations.
- Migrations are feature-scoped, numbered, and additive.
- Normal reads exclude archived rows by default; explicit archived reads are
  available through `includeArchived=true`.
- System-managed fields are rejected at the API boundary through strict Zod
  schemas.
- Shared cross-tenant scope requires explicit approval before persistence.
- Stored repo-generation identity fields are durable and are not recalculated
  on read.

## Verification Run

- `npm run typecheck`: passed
- `npm run check:feature-dependencies`: passed, zero violations, generated
  outputs up to date
- `npm run test:traceability`: passed, Entity 10/10 active documented tests
  traceable
- `npx vitest run tests/unit/entity/service.test.ts tests/integration/entity/flow.test.ts tests/security/entity/security.test.ts tests/integration/entity/persistence.test.ts`:
  9 passed, 1 skipped because Postgres-backed tests were not enabled
- `docs/postman/collections/entity.postman_collection.json`: JSON parse passed
- `git diff --check` on touched `/entity` source, test, and documentation
  paths: passed
- `npm run dev`: started cleanly, migration runner applied 0 files, server
  listening on port 3000
- `curl -i http://127.0.0.1:3000/v1/entity`: returned JSON `401 Unauthorized`
- `curl -i -X POST http://127.0.0.1:3000/v1/entity ...`: returned JSON
  `401 Unauthorized`

## Audit Judgment

The `/entity` feature is aligned with the current feature-bundle architecture
and capability-per-file structure after this audit pass. The major contract
hazard found during the audit was the attempted bare-array list response; that
has been reverted to the repo-standard paginated envelope required by ADR-0007
and the capability matrix.

The remaining risk is evidence depth, not source architecture: Postgres-backed
proof and a live authenticated manual API check should be captured before this
is treated as fully release-evidenced.
