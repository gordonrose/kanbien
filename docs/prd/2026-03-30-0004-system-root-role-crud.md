# System Root-Role CRUD Specification

## Purpose

Define the backend contract for the `rootRoles` feature that manages durable
system root-role definitions and root-user role assignments.

This feature is the first concrete administrative slice built on top of the
platform authorization architecture.

It provides the backend capabilities required for:

- creation of system root roles
- exact lookup and paginated listing of system root roles
- update of editable role metadata
- deactivation and reactivation of system root roles
- inspection and bulk management of role-to-capability grants
- assignment and unassignment of roles to root users
- atomic replacement of one assigned root role with another
- inspection of effective permissions for a root user

It also establishes the first durable root-role lifecycle and assignment model
that later tenant-role features can follow.

---

## Scope

This phase includes:

- authenticated backend routes under `/v1/root-roles`
- authenticated backend routes for root-user role assignments under
  `/v1/root-users/:rootUserId`
- durable system root-role records
- stable machine `roleKey` plus editable `displayName` and `description`
- protected bootstrap role support for `RootUserAdmin`
- exact lookup by role ID
- paginated listing of system root roles
- update of editable role metadata
- deactivation of roles from future assignment
- reactivation of eligible inactive roles
- root capability catalog inspection for role editing
- root role capability-assignment inspection
- bulk-first capability grant updates
- assignment of roles to root users
- unassignment of roles from root users
- atomic replacement of one assigned role with another
- effective-permission inspection for a target root user
- durable auditability of role and assignment administration

This phase does **not** include:

- a full browser CRUD UI for root-role administration
- tenant-role CRUD
- tenant-role assignment
- explicit deny semantics
- materialized authorization read models
- lower-privilege read-only root roles
- bulk assignment or bulk replacement across many root users in one request

---

## Core Concepts

### System root role

A system root role is a durable platform-managed authorization bundle for
root-user operators.

Each role has:

- a stable machine `roleKey`
- an editable `displayName`
- an editable `description`
- protected and lifecycle metadata

### Protected bootstrap role

`RootUserAdmin` is the initial protected bootstrap role.

It is special because:

- it must exist from day one
- it must remain protected from accidental hollowing-out
- at least one `RootUserAdmin` assignment must always remain in the platform

### Role capability grant

A role capability grant links one system root role to one eligible root authz
capability.

The first management model is bulk-first:

- callers submit the desired grant set for a role
- the server preserves required protected grants
- the server audits the before/after difference durably

### Root-user role assignment

A root-user role assignment links one root user to one system root role.

Rules:

- a root user may hold multiple root roles
- a root user must always retain at least one role
- assignments take effect immediately
- assignment history must remain durable and auditable

### Role retirement

Role deletion is modeled as deactivation, not hard deletion.

When a role is deactivated:

- it is preserved historically
- it no longer appears in normal assignable-role surfaces
- it cannot be newly assigned
- existing assignments may remain until explicitly transitioned or removed

### Role replacement

Role replacement is a first-class administrative workflow.

It atomically:

- retires one assignment for a target root user
- creates a replacement assignment
- refreshes the target user’s effective access in one controlled operation

This avoids fragile multi-step unassign/reassign flows.

---

## Feature Name

Recommended feature folder:

`src/features/rootRoles/`

This feature is separate from:

- `src/features/rootAuth/`
- `src/features/rootUsers/`

`rootUsers` continues to own root-user lifecycle.

`rootAuth` continues to own root-user identity and authenticated session state.

`rootRoles` owns root-role definitions, root-role capability grants, and
root-user root-role assignments.

---

## Capability Matrix

| Capability | Purpose | Request | Response | Rules | Persistence | Errors | Tests |
|---|---|---|---|---|---|---|---|
| `createSystemRootRole` | Create a new system root role | `roleKey`, `displayName`, `description` | created role summary | `roleKey` is stable, normalized, and unique among active roles; system-managed fields rejected | insert root role row | duplicate role key, invalid input, protected-role rule violation | valid create, duplicate key, invalid payload |
| `getSystemRootRole` | Exact lookup of one role | `rootRoleId` | role summary with lifecycle and grant summary | returns protected and assignable status; exact route param required | read role and linked grant summary | invalid id, not found | visible lookup, protected metadata, grant summary |
| `listSystemRootRoles` | Paginated list of roles | pagination, filters, optional search | paginated role list | default list excludes deactivated roles; standard pagination defaults apply; rows expose assignable state | read paginated role list | invalid query | pagination, filtering, default visibility |
| `updateSystemRootRole` | Update editable role metadata | `rootRoleId`, changed metadata | updated role summary | only `displayName` and `description` are editable; `roleKey` immutable | update role row, refresh `updatedAt` | invalid input, not found | update metadata, reject key mutation |
| `deleteSystemRootRole` | Deactivate a role from future assignment | `rootRoleId`, optional reason | deactivated role summary | soft delete only; inactive roles cannot be newly assigned; protected platform safety rules still apply | set lifecycle fields, preserve durable history | invalid request, not found, safety violation | deactivate role, later assignment rejected |
| `reactivateSystemRootRole` | Reactivate an inactive role | `rootRoleId` | reactivated role summary | must be currently inactive; active uniqueness rules rechecked on reactivation | clear lifecycle fields, refresh `updatedAt` | invalid request, not found, active-key conflict | valid reactivate, conflict rejection |
| `listSystemRootRoleEligibleAuthzCapabilities` | List assignable root authz capabilities for a role editor | `rootRoleId`, pagination/filters if needed | eligible capability list | catalog-backed; includes descriptions and protected/mandatory indicators | read capability catalog plus role context | invalid request, not found | eligible list, metadata visibility |
| `listSystemRootRoleCapabilityAssignments` | List currently assigned grants for one role | `rootRoleId`, pagination/filters if needed | assigned capability list | assigned/non-assigned split derives from catalog plus assignment state | read role-grant rows | invalid request, not found | assigned list, protected grant visibility |
| `updateSystemRootRoleCapabilityGrants` | Replace the capability grant set for one role | `rootRoleId`, desired capability key set, optional reason | updated grant set summary | bulk-first update; mandatory/protected grants cannot be removed | upsert/deactivate grant rows, audit before/after | invalid request, not found, protected-grant violation | bulk update, required grant protection |
| `assignSystemRootRoleToRootUser` | Assign one role to one root user | `rootUserId`, `rootRoleId`, optional reason | created assignment summary | root user may hold multiple roles; inactive roles cannot be assigned | insert assignment row | invalid request, target not found, duplicate assignment, inactive role | valid assign, duplicate rejection, inactive-role rejection |
| `unassignSystemRootRoleFromRootUser` | Remove one role assignment from one root user | `rootUserId`, assignment id, optional reason | deactivated assignment summary | must not leave target root user with zero roles; must not leave platform with zero `RootUserAdmin` assignments | deactivate assignment row | invalid request, not found, safety violation | valid unassign, last-role rejection, last-admin rejection |
| `listRootUserAssignedSystemRootRoles` | View active root-role assignments for one root user | `rootUserId`, pagination/filters if needed | paginated assignment list | default list excludes inactive assignment rows; may still show currently assigned inactive role definitions | read assignment rows joined to role metadata | invalid request, target not found | assignment list, lifecycle-aware display |
| `replaceRootUserSystemRootRole` | Atomically swap one assigned role for another | `rootUserId`, source assignment or source role, target role, optional reason | replacement summary plus refreshed effective access | must be atomic; target role must be active; safety invariants must hold throughout | deactivate old assignment and create new assignment in one transaction | invalid request, not found, safety violation, inactive target | atomic replacement, zero-role prevention, last-admin preservation |
| `getEffectiveRootUserPermissions` | Read the effective permission set for a root user | `rootUserId` | assigned roles plus flattened effective grants and grant source explanation | effective access is union of positive grants across active assignments; source roles must be visible in the response | read assignments and role grants, evaluate effective set | invalid request, target not found | effective set union, source attribution, retired-role source visibility |

---

## API Endpoints

Protected backend routes:

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

Current boundary rules:

- all routes require a valid root-user authenticated session
- all routes are restricted to `RootUserAdmin`
- all routes should enforce through the central authorization seam using the
  mapped root-role authz capability
- all routes should also pass through the shared authenticated-general rate
  limiting boundary unless a later explicit decision changes that

---

## Authorization Mapping Rules

The governing root authz capabilities for this slice are:

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

Current root boundary expectations:

- all mutation and assignment-management capabilities are both protected and
  mandatory for `RootUserAdmin`
- read-style capabilities are protected but not mandatory, leaving room for
  future read-only root roles without redefining the feature shape

This PRD should remain consistent with:

- [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
- [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)

---

## Data Rules

- `roleKey` values must be trimmed and stored in a stable normalized form
- `displayName` and `description` must reject empty strings where provided
- client input must not set system-managed fields
- requests that supply unexpected or system-managed fields must be rejected
  explicitly with `INVALID_REQUEST`
- normal role reads and lists must exclude deactivated rows by default
- inactive roles must be exposed only through explicit lifecycle-aware surfaces
  if later approved
- successful update, deactivate, and reactivate operations must refresh
  `updatedAt`
- deactivation must preserve durable role, grant, and assignment history
- inactive roles must not be assignable
- uniqueness must be enforced on normalized active `roleKey`
- effective permission inspection must union positive grants across all active
  assignments and show the role source for each grant

---

## Cross-Feature Rules

`rootRoles` may inspect root-user existence and lifecycle state only through a
narrow `rootUsers` public seam.

It must not import `rootUsers/persistence/*` directly.

`rootRoles` may rely on `rootAuth` only for authenticated session context and
the shared root-user trust boundary.

It must not embed independent authentication logic.

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the backend supports the documented protected `/v1/root-roles` and
   root-user role-assignment routes
2. system root roles are durable records with stable `roleKey` identity and
   editable presentation metadata
3. `RootUserAdmin` is preserved as a protected bootstrap role
4. normal role lists exclude deactivated rows by default
5. deactivation retires a role from future assignment without destroying
   durable history
6. reactivation restores the same durable role identity rather than creating a
   new one
7. bulk capability-grant updates preserve mandatory/protected grants
8. inactive roles cannot be newly assigned
9. a root user may hold multiple roles but may never be left with zero roles
10. the platform may never be left with zero `RootUserAdmin` assignments
11. role replacement is atomic and never leaves the target root user in an
    invalid intermediate authorization state
12. effective permission inspection returns assigned roles, flattened effective
    grants, and grant-source explanation
13. representative invalid-request, not-found, conflict, and safety-rule
    failures return stable error payloads with `code`, `message`, and relevant
    `details`

---

## Risks And Open Questions

- whether root-role lifecycle should later expose an explicit historical role
  listing surface rather than folding that into existing list/read behavior
- whether grant editing should later gain incremental add/remove endpoints in
  addition to the bulk-first set operation
- whether operator administration will later need bulk assignment or bulk
  replacement workflows across many root users
- whether future read-only root roles should receive narrower route-level
  visibility and capability access without changing the durable role model
