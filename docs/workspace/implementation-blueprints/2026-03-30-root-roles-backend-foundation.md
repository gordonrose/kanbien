# Root Roles Backend Foundation Implementation Blueprint

## Summary

- Feature: `rootRoles`
- Capability: system root-role CRUD, role-grant management, root-user
  role-assignment management, and effective-permission inspection
- Scope: backend feature slice only
- Phase: initial backend implementation landed

## Inputs

- Capability matrix reference:
  [2026-03-30-system-root-role-crud-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-03-30-system-root-role-crud-capability-matrix-first-draft.csv)
- PRD:
  [2026-03-30-0004-system-root-role-crud.md](/home/gordon/kanbien/docs/prd/2026-03-30-0004-system-root-role-crud.md)
- ADR(s):
  [0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md](/home/gordon/kanbien/docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md)
- PRD test-case doc:
  [2026-03-30-0004-system-root-role-crud-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-03-30-0004-system-root-role-crud-test-cases.md)

## Scope Confirmation

This blueprint is for one coherent backend slice:

- create the new `rootRoles` feature
- wire protected root-role routes into `/v1`
- introduce durable root-role, role-grant, and root-user-role-assignment
  persistence
- enforce authorization through the central seam abstraction expected by the
  current authz architecture
- expose the first root-role operator APIs needed for future root-role and
  tenant-role administration

This blueprint does **not** include:

- tenant-role implementation
- tenant authn/authz flows
- browser admin UI
- generalized read-only root roles
- materialized authorization read models

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states:
  none in this slice
- Permission visibility behavior:
  future root-admin UI should only expose these surfaces to `RootUserAdmin`
- Session / expiry behavior:
  rely on existing root authenticated session from `rootAuth`
- Browser security considerations:
  none beyond existing protected API/session boundary in this slice

## Backend Plan

- Route(s):
  - `POST /v1/root-roles`
  - `GET /v1/root-roles`
  - `GET /v1/root-roles/:rootRoleId`
  - `PATCH /v1/root-roles/:rootRoleId`
  - `POST /v1/root-roles/:rootRoleId/deactivate`
  - `POST /v1/root-roles/:rootRoleId/reactivate`
  - `GET /v1/root-roles/:rootRoleId/eligible-authz-capabilities`
  - `GET /v1/root-roles/:rootRoleId/capability-assignments`
  - `PUT /v1/root-roles/:rootRoleId/capability-assignments`
  - `POST /v1/root-users/:rootUserId/root-role-assignments`
  - `POST /v1/root-users/:rootUserId/root-role-assignments/:rootRoleAssignmentId/unassign`
  - `GET /v1/root-users/:rootUserId/root-roles`
  - `POST /v1/root-users/:rootUserId/root-role-assignments/replace`
  - `GET /v1/root-users/:rootUserId/effective-permissions`
- Request/response/error contract:
  derive directly from the PRD and capability matrix; create a dedicated API
  contract doc under `docs/api-contracts/` for this route family before or
  alongside implementation
- Feature-local files expected:
  - `src/features/rootRoles/index.ts`
  - `src/features/rootRoles/integration.ts`
  - `src/features/rootRoles/README.md`
  - `src/features/rootRoles/contract/errors.ts`
  - `src/features/rootRoles/contract/schemas.ts`
  - `src/features/rootRoles/contract/types.ts`
  - `src/features/rootRoles/domain/types.ts`
  - `src/features/rootRoles/domain/service.ts`
  - one domain file per main capability or coherent pair, likely:
    - `createSystemRootRole.ts`
    - `getSystemRootRole.ts`
    - `listSystemRootRoles.ts`
    - `updateSystemRootRole.ts`
    - `deleteSystemRootRole.ts`
    - `reactivateSystemRootRole.ts`
    - `listSystemRootRoleEligibleAuthzCapabilities.ts`
    - `listSystemRootRoleCapabilityAssignments.ts`
    - `updateSystemRootRoleCapabilityGrants.ts`
    - `assignSystemRootRoleToRootUser.ts`
    - `unassignSystemRootRoleFromRootUser.ts`
    - `listRootUserAssignedSystemRootRoles.ts`
    - `replaceRootUserSystemRootRole.ts`
    - `getEffectiveRootUserPermissions.ts`
  - `src/features/rootRoles/persistence/repository.ts`
  - `src/features/rootRoles/persistence/types.ts`
  - `src/features/rootRoles/persistence/postgresRepository.ts`
  - `src/features/rootRoles/persistence/migrations/001_create_root_roles.sql`
  - likely follow-up corrective/additive migration files as the model settles
  - `src/features/rootRoles/transport/router.ts`
- Cross-feature seams:
  - `rootUsers` public seam for target root-user existence and lifecycle checks
  - root authenticated-session context from existing `rootAuth` middleware
  - avoid direct imports from `rootUsers/persistence/*`
- Authorization enforcement point:
  initial implementation should keep route/service boundary enforcement
  centralized rather than embedding authz checks into each domain function;
  if the general authz seam is not yet implemented in code, create a narrow
  root-role-local policy evaluator seam that matches the future `can(...)` and
  `scope(...)` shape rather than hard-coding ad hoc checks in handlers

## Repo File Layout Plan

- Add a new mounted feature under `src/features/rootRoles/`
- Follow the established repo shape already used by `rootUsers` and `rootAuth`
- Mount the feature in [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts)
  behind:
  - `requireRootSession`
  - `authenticatedGeneralRateLimit`
- Prefer wiring through `integration.ts`, not directly in transport
- Export any narrow public seams from `src/features/rootRoles/index.ts` only if
  another feature needs them; do not pre-expose broad persistence readers

## Integration Wiring Plan

- extend [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts) to mount
  `createRootRolesFeature(dbPool)` under:
  - `/root-roles` for role-definition and grant-management routes
  - or mount a combined router that also handles the `/root-users/:rootUserId`
    assignment subroutes if that keeps responsibility clear
- keep one owning feature even if some routes are nested under `/root-users`
- if assignment routes live in `rootRoles`, ensure the router shape makes that
  ownership explicit and does not duplicate `rootUsers` domain behavior

## Persistence Plan

- Entities / rows affected:
  - `system_root_role`
  - `system_root_role_capability_grant`
  - `root_user_role_assignment`
  - durable authorization audit rows, either:
    - within the future `authorization` audit store, or
    - as a root-role-local audit record if that broader store is not yet in
      code
  - durable capability catalog data for eligible root authz capabilities
- Migration changes:
  - create root-role table with stable key, display name, description, and
    lifecycle fields
  - create role-grant table with uniqueness on active role/capability pairs
  - create root-user-role-assignment table with lifecycle fields for durable
    history
  - seed protected `RootUserAdmin` role and its required grants through
    migration/bootstrap logic, not through ad hoc runtime setup
  - seed current live root authz capability catalog entries needed for the
    slice
- Index or uniqueness changes:
  - unique normalized active `roleKey`
  - active uniqueness on role/capability pair
  - active uniqueness on rootUser/role pair
  - indexes for:
    - role listing/filtering
    - assignment reads by `rootUserId`
    - effective permission assembly
- Search/filter implications:
  - role listing follows standard pagination defaults
  - default list excludes deactivated roles
  - assignment list excludes inactive assignment rows by default
  - future historical list routes can be additive later
- Compatibility notes:
  - preserve durable history on role deactivation and assignment unassignment
  - deactivated roles remain visible in historical/effective permission
    contexts as needed, but cannot be newly assigned
  - replacement must be atomic and should use transactional persistence
  - do not rename applied migrations later; additive correction only

## Authorization And Safety Plan

- Implement the governing authz capability checks expected by the mapping docs:
  - `root-role.create`
  - `root-role.read`
  - `root-role.list`
  - `root-role.update`
  - `root-role.delete`
  - `root-role.reactivate`
  - `root-role.capability-catalog.read`
  - `root-role.capability-assignment.read`
  - `root-role.capability-assignment.update`
  - `root-role.assignment.assign`
  - `root-role.assignment.unassign`
  - `root-role.assignment.list`
  - `root-role.assignment.replace`
  - `root-role.effective-permissions.read`
- Treat `RootUserAdmin` as the only initial granting role
- Enforce these safety rules in service/persistence logic, not only in route
  validation:
  - at least one `RootUserAdmin` assignment must always remain
  - a root user must always retain at least one role
  - inactive roles cannot be newly assigned
  - protected/mandatory grants cannot be stripped from protected roles
  - replacement must be atomic

## Verification Plan

- Unit:
  - contract schema validation
  - role-key normalization and uniqueness behavior
  - protected/mandatory grant enforcement
  - deactivate/reactivate rules
  - assignment and replacement safety invariants
  - effective-permission union logic
- Integration:
  - end-to-end route coverage for CRUD, grant management, assignment, and
    effective-permission inspection
  - migration bootstrap of `RootUserAdmin`
  - route mounting and middleware protection in `/v1`
  - cross-feature seam behavior with `rootUsers`
  - update pre-existing protected-feature integration suites so they prove the
    new gate model rather than only authenticated-session access, especially:
    - `tests/integration/rootUsers/`
    - protected `rootAuth` route integration coverage
- Security:
  - unauthorized and wrong-role denial cases
  - inactive-role assignment rejection
  - protected-role/protected-grant tampering attempts
  - stable privileged error payloads without leaking extra detail
  - update pre-existing protected-feature security suites so they prove allow
    and deny behavior under capability gates rather than only session presence,
    especially:
    - `tests/security/rootUsers/`
    - protected `rootAuth` security coverage
- Audit:
  - mutation audit row creation
  - denied-attempt audit behavior where required
  - before/after capture for grant and assignment changes
  - review existing audit suites for affected protected features so the new
    gated-denial and privileged-mutation paths remain visible over time
- Edge:
  - duplicate active `roleKey`
  - repeated deactivate/reactivate behavior
  - duplicate assignment rejection
  - last-role and last-`RootUserAdmin` rejection
  - replacement where source or target is invalid
- Frontend:
  none in this slice
- Persistence-backed:
  - migration schema checks
  - active uniqueness indexes
  - transaction safety for replacement
  - durable lifecycle state after unassign/deactivate/reactivate

## Documentation Plan

- PRD updates:
  keep [2026-03-30-0004-system-root-role-crud.md](/home/gordon/kanbien/docs/prd/2026-03-30-0004-system-root-role-crud.md)
  aligned if route names or safety semantics change during implementation
- PRD test-case updates:
  keep
  [2026-03-30-0004-system-root-role-crud-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-03-30-0004-system-root-role-crud-test-cases.md)
  aligned as executable coverage lands and traceability moves from deferred to
  enforced
- Feature docs:
  add `src/features/rootRoles/README.md`
- Runbook:
  consider a short operator note if bootstrap/recovery handling for
  `RootUserAdmin` becomes non-trivial
- Privacy note:
  not likely a separate note, but document operator-account audit implications
  if the standards review flags it
- Standards review:
  required because this is a privileged permission-sensitive capability set
- Repo health review:
  required after implementation because this adds a new cross-cutting authz
  slice

## Source-Independent Artifact Plan

- update [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
  from `target` to `current` for implemented `rootRoles` rows once code lands
- update [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)
  from `target` to `current` for implemented `rootRoles` rows once code lands
- add a dedicated API contract doc under `docs/api-contracts/` for the
  `rootRoles` route family
- add data-dictionary pages for any new persisted entities introduced by this
  slice
- review relevant `docs/standards/platform-status/` snapshots because this
  slice advances the platform’s authorization and audit posture

## Open Gaps / Blockers

- Likely missing source-independent artifact:
  `rootRoles` API contract doc
- Likely missing persistence artifact:
  data dictionary entries for root-role entities
- Required implementation-time follow-on:
  update pre-existing protected-feature integration, security, and audit tests
  whose assumptions currently stop at authenticated-session access and do not
  yet model role/capability gating
- Central authz seam may still be partially architectural rather than fully
  implemented in code.
  The implementation should preserve the seam shape rather than embedding
  feature-specific authorization decisions everywhere.
