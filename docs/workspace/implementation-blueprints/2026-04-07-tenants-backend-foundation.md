# Tenants Backend Foundation Implementation Blueprint

## Summary

- Feature: `tenants`
- Capability:
  tenant CRUD/lifecycle foundation with privileged root-only administration
- Scope:
  backend feature slice only
- Phase:
  pre-implementation blueprint

## Inputs

- Capability matrix reference:
  [2026-04-07-tenant-creation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-07-tenant-creation-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-07-tenant-creation-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-07-tenant-creation-capability-matrix-first-draft-notes.md)
- PRD:
  [2026-04-07-0005-tenants-backend.md](/home/gordon/kanbien/docs/prd/2026-04-07-0005-tenants-backend.md)
- ADR(s):
  no tenant-specific ADR required yet unless this slice introduces a new shared
  seam or enduring storage/search pattern beyond current feature conventions
- PRD test-case doc:
  not yet created; required before implementation is considered fully specified

## Scope Confirmation

This blueprint is for one coherent backend slice:

- create a new `tenants` feature under `src/features/tenants/`
- introduce durable tenant persistence with system-managed UUID identity,
  immutable unique `bizId`, non-unique `name`, mutable `category`, mutable
  `status`, and creator attribution via `createdByRootAdminUserId`
- enforce root-only access through existing root session and root capability
  middleware
- implement active read/list, deleted read/list, update, soft delete,
  reactivate, and remove routes
- make `category` and `status` available for list filtering in v1
- preserve the soft-delete/reactivation lifecycle rule that deleted tenants are
  forced to `inactive` and reactivation restores pre-delete status

This blueprint does **not** include:

- tenant-scoped users, memberships, or roles
- tenant-admin bootstrap at create time
- self-service tenant signup
- frontend/admin-shell tenant pages
- purge/retention handling for future tenant-owned entities beyond noting the
  future tightening required once such entities exist
- `updatedByRootAdminUserId` or `deletedByRootAdminUserId` in the first slice

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states:
  none in this slice
- Permission visibility behavior:
  future root-admin UI should expose tenant administration only to
  `RootUserAdmin`
- Session / expiry behavior:
  rely on existing root authenticated session from `rootAuth`
- Browser security considerations:
  none beyond the existing protected API/session boundary in this slice

## Backend Plan

- Route(s):
  - `POST /v1/tenants`
  - `GET /v1/tenants`
  - `GET /v1/tenants/:tenantId`
  - `PATCH /v1/tenants/:tenantId`
  - `GET /v1/tenants/deleted`
  - `GET /v1/tenants/deleted/:tenantId`
  - `POST /v1/tenants/:tenantId/delete`
  - `POST /v1/tenants/:tenantId/reactivate`
  - `POST /v1/tenants/:tenantId/remove`
- Request/response/error contract:
  - create accepts `bizId`, `name`, `category`, and optional `status`
  - create defaults `status` to `draft` when omitted
  - update accepts `name`, `category`, and `status` only
  - remove should require explicit confirmation and a reason in v1
  - exact reads should return `createdByRootAdminUserId`
  - list responses do not need `createdByRootAdminUserId` in the first slice
  - deleted routes must stay explicit and separate from normal active routes
  - soft delete forces exposed `status` to `inactive`
  - reactivate restores pre-delete status automatically
  - use the repo-standard error JSON shape for validation/authz/not-found/conflict
- Feature-local files expected:
  - `src/features/tenants/index.ts`
  - `src/features/tenants/integration.ts`
  - `src/features/tenants/README.md`
  - `src/features/tenants/contract/errors.ts`
  - `src/features/tenants/contract/schemas.ts`
  - `src/features/tenants/contract/types.ts`
  - `src/features/tenants/domain/types.ts`
  - `src/features/tenants/domain/service.ts`
  - capability-focused domain files, likely:
    - `createTenant.ts`
    - `getTenant.ts`
    - `listTenants.ts`
    - `updateTenant.ts`
    - `getDeletedTenant.ts`
    - `listDeletedTenants.ts`
    - `softDeleteTenant.ts`
    - `reactivateTenant.ts`
    - `removeTenant.ts`
  - `src/features/tenants/persistence/repository.ts`
  - `src/features/tenants/persistence/types.ts`
  - `src/features/tenants/persistence/postgresRepository.ts`
  - `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
  - additive corrective migration files later if the model evolves
  - `src/features/tenants/transport/router.ts`
- Cross-feature seams:
  - existing `requireRootSession` seam for authenticated root identity
  - existing root capability checker seam via `createRequireRootCapability`
  - root capability catalog in `rootRoles` must gain the new tenant capability
    keys
  - avoid direct imports from another feature's `persistence/*`
- Authorization enforcement point:
  central route/service-boundary enforcement through `createRequireRootCapability`
  with capability-specific gates before tenant service execution

## Repo File Layout Plan

- Add a new mounted feature under `src/features/tenants/`
- Follow the existing feature shape already used by `rootUsers`, `rootAuth`,
  and `rootRoles`
- Mount the feature in
  [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts)
  behind:
  - `requireRootSession`
  - `authenticatedGeneralRateLimit`
- Wire through `integration.ts`, not directly inside transport
- Export only narrow public seams from `src/features/tenants/index.ts` if later
  tenant-bound features need exact existence/lifecycle reads

## Integration Wiring Plan

- extend [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts) to mount
  `createTenantsFeature(...)` at `/tenants`
- extend the root authz capability catalog in
  [capabilityCatalog.ts](/home/gordon/kanbien/src/features/rootRoles/domain/capabilityCatalog.ts)
  with:
  - `tenant.create`
  - `tenant.read`
  - `tenant.list`
  - `tenant.update`
  - `tenant.read.deleted`
  - `tenant.list.deleted`
  - `tenant.delete`
  - `tenant.reactivate`
  - `tenant.remove`
- treat `RootUserAdmin` as the only initial granting role
- keep tenant capability enforcement aligned with the existing root-role gate
  model rather than introducing tenant-local authz shortcuts

## Persistence Plan

- Entities / rows affected:
  - new durable `tenant` table
- Durable tenant fields expected:
  - `tenant_id` UUID primary key
  - `biz_id`
  - `normalized_biz_id`
  - `name`
  - `normalized_name`
  - `category`
  - `status`
  - `pre_delete_status` nullable field for deterministic reactivation
  - `created_by_root_admin_user_id`
  - `created_at`
  - `updated_at`
  - `deleted_at`
- Migration changes:
  - create `tenant` table with repo-standard lifecycle columns
  - enforce allowed `category` values: `customer`, `demo`, `test`
  - enforce allowed `status` values: `draft`, `live`, `disabled`, `inactive`
  - persist `created_by_root_admin_user_id` as a durable tenant attribute
  - persist `pre_delete_status` so reactivation does not depend on audit logs
- Index or uniqueness changes:
  - primary key on `tenant_id`
  - unique index on normalized active `biz_id`
  - non-unique index support for approved list/search operators:
    - `normalized_name`
    - `category`
    - `status`
    - `deleted_at`
- Search/filter implications:
  - default pagination/sorting per repo defaults
  - active list supports approved filters for:
    - `bizIdPrefix`
    - `namePrefix`
    - `category`
    - `status`
  - deleted list supports the same filters against deleted rows only
  - exact route params remain UUID-only
- Compatibility notes:
  - `bizId` is immutable after create
  - `name` is required but not unique
  - soft delete must set `deleted_at`, refresh `updated_at`, force visible
    status to `inactive`, and preserve `pre_delete_status`
  - reactivate must clear `deleted_at`, refresh `updated_at`, and restore
    `pre_delete_status`
  - remove may hard-delete in v1 because tenants do not yet own other durable
    entities, but this must be revisited as soon as tenant-bound entities land
  - do not rename applied migrations later; use additive corrective migrations

## Authorization And Safety Plan

- Implement the governing authz capability checks:
  - `tenant.create`
  - `tenant.read`
  - `tenant.list`
  - `tenant.update`
  - `tenant.read.deleted`
  - `tenant.list.deleted`
  - `tenant.delete`
  - `tenant.reactivate`
  - `tenant.remove`
- Enforce these safety rules in service/persistence logic, not only in route
  validation:
  - create stamps `createdByRootAdminUserId` from `request.rootSession.rootUserId`
  - client cannot supply system-managed fields
  - duplicate normalized active `bizId` is rejected consistently
  - soft-deleted rows stay out of normal read/list/update paths
  - reactivation works only for deleted tenants
  - remove is irreversible and should require explicit confirmation and reason
  - remove semantics must be revisited before or alongside the first
    tenant-owned durable entity feature

## Verification Plan

- Unit:
  - schema validation for create/update/list/remove contracts
  - `bizId` normalization and uniqueness behavior
  - `name` required-but-not-unique behavior
  - category/status allowed-value validation
  - create default `status = draft`
  - soft-delete status forcing and pre-delete status capture
  - reactivation status restoration
  - remove confirmation/reason validation
- Integration:
  - end-to-end route coverage for all tenant routes
  - route mounting and middleware protection in `/v1`
  - exact reads expose `createdByRootAdminUserId`
  - list responses omit `createdByRootAdminUserId`
  - list filtering by `category` and `status`
  - deleted list/read separation from active list/read
- Security:
  - unauthenticated denial
  - authenticated but wrong-role denial
  - wrong capability denial per route
  - stable privileged error payloads without leaking extra detail
  - remove confirmation tampering and missing-reason rejection
- Audit:
  - successful create/update/delete/reactivate/remove events
  - denied privileged attempts where current shared audit posture requires them
  - create audit must correlate actor root user with stored
    `createdByRootAdminUserId`
- Edge:
  - duplicate `bizId`
  - duplicate `bizId` collision on reactivation
  - repeated soft delete/reactivate behavior
  - remove of missing tenant
  - exact read/list behavior around deleted vs active visibility
- Frontend:
  none in this slice
- Persistence-backed:
  - migration schema checks
  - active uniqueness index on `normalized_biz_id`
  - filter/index behavior for `category`, `status`, and deleted visibility
  - durable storage of `created_by_root_admin_user_id`
  - durable storage and restoration of `pre_delete_status`

## Documentation Plan

- PRD updates:
  keep
  [2026-04-07-0005-tenants-backend.md](/home/gordon/kanbien/docs/prd/2026-04-07-0005-tenants-backend.md)
  aligned with any implementation-time contract or lifecycle refinements
- PRD test-case updates:
  create a PRD-derived tenant backend test-case doc under `docs/prd/test_cases/`
- Feature docs:
  add `docs/featureDocs/tenants-feature.md`
- API contract docs:
  add `docs/api-contracts/tenants.md`
- OpenAPI:
  update `docs/swagger/openapi.yaml`
- Postman:
  update maintained tenant requests under `docs/postman/` if a collection is
  used for privileged operator workflows
- Data dictionary:
  add tenant entity documentation under `docs/data-dictionary/`
- Runbook:
  add or extend operator guidance if tenant lifecycle actions become part of
  standard admin operations
- Privacy note:
  review whether tenant metadata and creator attribution change privacy posture
  enough to warrant a focused note
- Standards review:
  required because this is a privileged, durable-entity, security-sensitive
  backend slice
- Repo health review:
  recommended after implementation because this slice introduces a new durable
  business root entity and new authz capabilities
- AI-assisted/provenance note:
  expected if implementation relies materially on generative output, especially
  for migrations, authz gates, and irreversible delete behavior

## Gaps And Blockers

- A PRD-derived tenant test-case doc is still missing.
- The capability matrix CSV currently has structural drift in some rows; use
  the notes file as the higher-confidence source until the CSV is normalized.
- The first implementation must decide whether status changes stay inside
  `updateTenant` or get their own dedicated transition capability. Current
  approved direction allows either, but the choice should be made explicitly
  before coding to avoid contract churn.
