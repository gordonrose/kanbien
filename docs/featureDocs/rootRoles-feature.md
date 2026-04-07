# Root Roles Feature Reference

## Purpose

The `rootRoles` feature owns durable system root-role definitions, root-role
capability grants, root-user role assignments, and root-role audit history.

It is the first executable slice of the platform authorization architecture and
acts as the current shared authorization seam for protected root-platform
routes.

## Where It Lives

- `src/features/rootRoles/contract`
- `src/features/rootRoles/domain`
- `src/features/rootRoles/persistence`
- `src/features/rootRoles/transport`
- `src/features/rootRoles/integration.ts`
- `src/features/rootRoles/index.ts`

## Platform Integration

Feature export:

- `createRootRolesFeature`

Mounting:

```ts
import { createRootRolesFeature } from "../../features/rootRoles";
import { createPostgresPlatformSecurityRepository } from "../../lib/security/postgresRepository";
import { dbPool } from "../../lib/db";

const platformSecurityRepository = createPostgresPlatformSecurityRepository(dbPool);
const rootRolesFeature = createRootRolesFeature(dbPool, platformSecurityRepository);

v1Router.use(
  "/root-roles",
  requireRootSession,
  authenticatedGeneralRateLimit,
  rootRolesFeature.rootRolesRouter,
);

v1Router.use(
  "/root-users",
  requireRootSession,
  authenticatedGeneralRateLimit,
  rootRolesFeature.rootUserRoleAssignmentsRouter,
  createRootUserFeature(dbPool, rootRolesFeature.capabilityChecker, platformSecurityRepository),
);
```

The same feature also exports the current `capabilityChecker`, which `rootAuth`
and `rootUsers` consume so capability enforcement stays centralized rather than
being embedded in each feature’s service logic.
The same backend surface is also now consumed by the rudimentary same-origin
root-admin browser console through the shared cookie-backed root-session
boundary, including a dedicated system-root-roles workspace and drawer-based
editor.

## API Surface

Base paths:

- `/v1/root-roles`
- `/v1/root-users/:rootUserId/...` for root-role assignment and effective-access
  routes

Routes:

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

## Current Authorization Model

- all `rootRoles` routes require a valid root-user session
- all `rootRoles` routes also require the governing root authz capability
- `RootUserAdmin` is the current protected bootstrap system root role
- protected `rootAuth` and `rootUsers` routes now enforce capabilities through
  this feature’s central checker
- denied capability checks are written to platform-security audit events as
  `root_capability_denied`

Current root-role capabilities:

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

## Persistence And Safety Notes

- `RootUserAdmin` is seeded and auto-assigned to eligible root users during
  bootstrap
- role deactivation retires a role from future assignment but preserves durable
  history
- root users must retain at least one active role
- the platform must retain at least one active `RootUserAdmin` assignment
- root-role mutations and assignment changes are written to
  `root_role_audit_events`

## Cross-Feature Seams

- `rootRoles` reads root-user eligibility through the public `rootUsers`
  auth-state seam
- `rootAuth` and `rootUsers` consume the exported capability checker rather
  than importing `rootRoles` persistence internals

## Supporting Artifacts

- API contract:
  [`root-roles.md`](/home/gordon/kanbien/docs/api-contracts/root-roles.md)
- PRD:
  [`2026-03-30-0004-system-root-role-crud.md`](/home/gordon/kanbien/docs/prd/2026-03-30-0004-system-root-role-crud.md)
- PRD-derived test cases:
  [`2026-03-30-0004-system-root-role-crud-test-cases.md`](/home/gordon/kanbien/docs/prd/test_cases/2026-03-30-0004-system-root-role-crud-test-cases.md)
