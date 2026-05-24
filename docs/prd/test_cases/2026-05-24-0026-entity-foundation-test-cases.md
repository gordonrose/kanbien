# Entity Foundation Test Cases

## PRD Scope

- PRD:
  `docs/prd/2026-05-24-0026-entity-foundation.md`
- Primary features involved:
  - `entity`
- Cross-feature seams:
  - protected Entity routes depend on shared root-session authentication
  - protected Entity routes depend on authenticated-general rate limiting
  - protected Entity routes depend on shared root-capability middleware
  - Entity capabilities are added to the root authorization catalog owned by
    `rootRoles`
  - v1 route mounting owns the public API integration point
- QA coverage-matrix classification:
  privileged root-operated persistence-backed platform metadata feature with
  lifecycle visibility and authorization-sensitive routes
- Journey inventory required:
  no separate journey inventory required for this backend-only CRUD foundation
  slice
- Required human QA artifacts:
  standards-oriented review of privileged route behavior, artifact sync, and
  lifecycle deferral honesty
- Notes:
  - this file covers PRD-derived verification intent, not executable proof by
    itself
  - executable tests now exist for the first implementation slice in:
    - `tests/unit/entity/service.test.ts`
    - `tests/integration/entity/flow.test.ts`
    - `tests/security/entity/security.test.ts`
    - `tests/integration/entity/persistence.test.ts`
  - Traceability Enforcement: scoped executable IDs added for the first slice
  - Lifecycle metadata defaults:
    - `Version: v1`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - active for the current MSP case set
- Overall execution status:
  - unit, integration, and security cases are executable in the default test
    environment
  - persistence-backed case is executable when Postgres test configuration is
    available
- Implemented executable `TC-*` subset:
  - `TC-ENTITY-UNIT-001`
  - `TC-ENTITY-UNIT-002`
  - `TC-ENTITY-UNIT-003`
  - `TC-ENTITY-UNIT-004`
  - `TC-ENTITY-UNIT-005`
  - `TC-ENTITY-INT-001`
  - `TC-ENTITY-SEC-001`
  - `TC-ENTITY-SEC-002`
  - `TC-ENTITY-SEC-003`
  - `TC-ENTITY-INT-002`
- Deferred cases:
  - performance and high-concurrency proof are deferred until Entity volume,
    generation, or bulk behavior exists
  - browser-rendered proof is not applicable because this slice has no frontend

## Existing Test Impact

- Existing executable tests likely affected:
  - shared root auth integration harness
  - root role capability catalog tests
  - feature dependency graph checks
  - OpenAPI/static contract checks if broadened later
- Nature of impact:
  additive
- Discussion needed before changing existing tests:
  no; this feature is new and current changes are additive

## Unit Tests For Individual Capabilities

- Capability: `createEntity`
  Test Case ID: `TC-ENTITY-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entity/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates an Entity with server-generated identifier
  - requires explicit `featureName` and `scope`
  - persists suggested repo-generation identity fields from `featureName` when
    optional resolved values are omitted
  - defaults status to `draft`
  - returns system-managed timestamps
  - leaves `archivedAt` null for current records
  - does not require any frontend or tenant context

- Capability: `createEntity`
  Test Case ID: `TC-ENTITY-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entity/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - rejects duplicate current normalized names
  - permits name reuse after prior record is archived
  - preserves archived history rather than hard-deleting it

- Capability: `deleteEntity`
  Test Case ID: `TC-ENTITY-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entity/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - archives a current Entity
  - sets `status=archived`
  - sets `archivedAt`
  - hides archived records from normal exact reads
  - allows exact archived read only with explicit archived opt-in

- Capability: repo-generation identity resolution
  Test Case ID: `TC-ENTITY-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entity/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - stores explicit `entityKey`, `featureName`, `tableName`, `idField`,
    `idColumn`, `scope`, and `routeBase`
  - returns stored values from the durable record
  - changing `featureName` does not silently recalculate accepted identity
    fields

- Capability: repo-generation scope validation
  Test Case ID: `TC-ENTITY-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entity/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - supports `root`, `tenant`, and `shared-cross-tenant`
  - rejects `shared-cross-tenant` unless explicit approval validation is
    present
  - accepts `shared-cross-tenant` only when `sharedCrossTenantApproved=true`

## Integration Tests

- Capability:
  create, read, list, update, and archive route family
  Test Case ID: `TC-ENTITY-INT-001`
  Recommended Test Layer: `api-integration`
  Suggested Test Folder: `tests/integration/entity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: in-memory route harness state is per-test
  Coverage:
  - authenticated root session can create an Entity
  - create response includes stored repo-generation identity fields
  - exact read returns the created record
  - list supports status and name-prefix filters
  - update changes description and status
  - update can change one stored repo-generation identity field without
    recalculating the others
  - delete archives the record
  - normal exact read hides archived records
  - explicit archived exact read returns retained history

## Security Tests

- Capability:
  protected Entity routes
  Test Case ID: `TC-ENTITY-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/entity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: in-memory route harness state is per-test
  Coverage:
  - unauthenticated caller is rejected
  - protected route returns shared `UNAUTHORIZED` response

- Capability:
  create capability denial
  Test Case ID: `TC-ENTITY-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/entity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: in-memory route harness state is per-test
  Coverage:
  - authenticated root user without `entity.create` is rejected
  - response is shared `FORBIDDEN`
  - denial is visible in platform security audit evidence

- Capability:
  system-managed field rejection
  Test Case ID: `TC-ENTITY-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/entity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: in-memory route harness state is per-test
  Coverage:
  - client-supplied `entityId` is rejected
  - unexpected system-managed fields produce `INVALID_REQUEST`
  - rejection identifies the unexpected field

## Persistence Tests

- Capability:
  durable Entity storage
  Test Case ID: `TC-ENTITY-INT-002`
  Recommended Test Layer: `postgres-integration`
  Suggested Test Folder: `tests/integration/entity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset Postgres test database between runs
  Coverage:
  - migration creates durable `entities` storage
  - migration stores repo-generation identity fields as non-null durable values
  - normalized name is stored
  - duplicate current normalized names are rejected
  - archive hides current visibility without hard delete
  - archived current-name uniqueness is released for a future current Entity
  Notes:
  - executable proof requires `RUN_POSTGRES_TESTS=true` and configured
    Postgres test database variables

## Edge / NFR Cases

- Capability:
  pagination and filter boundaries
  Test Case ID: `TC-ENTITY-EDGE-001`
  Lifecycle Status: pending-review
  Recommended Test Layer: `unit-or-integration`
  Suggested Test Folder: `tests/unit/entity/` or `tests/integration/entity/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - `page` defaults to `1`
  - `pageSize` defaults to `25`
  - `pageSize` rejects values below `1` and above `100`
  - default order direction is `desc`
  - invalid status filter is rejected
  Status:
  - planned; partially covered through contract schemas and integration flow

- Capability:
  concurrent create with same normalized name
  Test Case ID: `TC-ENTITY-EDGE-002`
  Lifecycle Status: pending-review
  Recommended Test Layer: `postgres-integration`
  Suggested Test Folder: `tests/integration/entity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset Postgres test database between runs
  Coverage:
  - two create attempts with same normalized current name cannot both persist
  - storage uniqueness remains the final authority even if service precheck
    races
  Status:
  - planned follow-up if Entity volume or concurrent writer behavior becomes
    material before generation layers are added

## Coverage Summary

| Area | Required? | Current Status | Evidence |
| --- | --- | --- | --- |
| Unit behavior | yes | implemented | `tests/unit/entity/service.test.ts` |
| API integration | yes | implemented | `tests/integration/entity/flow.test.ts` |
| Security denial | yes | implemented | `tests/security/entity/security.test.ts` |
| Audit visibility | yes | implemented for denial; mutation success uses platform security audit path | `tests/security/entity/security.test.ts`; route implementation |
| Persistence / migration | yes | implemented but env-gated | `tests/integration/entity/persistence.test.ts` |
| Performance | no for MSP | deferred | no bulk/list volume requirement yet |
| Browser rendering | no | not applicable | no frontend in PRD |
