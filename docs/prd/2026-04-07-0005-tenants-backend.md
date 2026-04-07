# Tenants Backend Specification

## Purpose

Define the backend contract for the `tenants` feature that manages durable
tenant records for the platform.

This feature establishes the first tenant lifecycle and identity model that
future tenant-bound entities, users, memberships, billing rules, and
authorization features will depend on.

It provides the backend capabilities required for:

- create
- exact lookup
- filtered and paginated listing
- update
- explicit deleted lookup
- explicit deleted listing
- soft delete
- reactivation of eligible soft-deleted rows
- irreversible remove while tenants remain isolated durable records

It also establishes durable creator attribution and durable business-rule-ready
tenant classification and status fields.

---

## Scope

This phase includes:

- authenticated backend routes under `/v1/tenants`
- creation of tenant records
- exact visible lookup by tenant ID
- filtered and paginated listing of active tenants
- update of editable tenant metadata
- explicit exact lookup of deleted tenants
- explicit paginated listing of deleted tenants
- soft delete
- reactivation of eligible deleted tenants
- irreversible remove
- durable creator attribution via `createdByRootAdminUserId`
- durable business classification via `category`
- durable tenant lifecycle state via `status`

This phase does **not** include:

- tenant-admin bootstrap during tenant creation
- tenant-user or tenant-admin lifecycle management
- tenant membership assignment
- tenant-scoped authorization roles
- self-service tenant signup
- browser CRUD UI for tenants
- `updatedByRootAdminUserId` and `deletedByRootAdminUserId`
- purge and retention orchestration for future tenant-owned entities beyond
  noting that remove semantics must tighten once such entities exist

---

## Core Concepts

### Tenant

A `tenant` is a durable platform-managed business entity record.

Each tenant has:

- a system-generated `tenantId`
- a durable business identifier `bizId`
- a required display and business `name`
- a business classification `category`
- a business and lifecycle state `status`
- durable creator attribution through `createdByRootAdminUserId`
- standard lifecycle fields

### Durable tenant identity

`bizId` is the tenant's canonical stable business identifier.

Rules:

- it is required
- it is normalized for uniqueness
- it is immutable after creation
- uniqueness applies on normalized active values

`name` is required, but it is not a unique identity field.

### Tenant category

`category` is explicit durable administrative metadata used to support future
business rules.

Initial allowed values:

- `customer`
- `demo`
- `test`

Category may be changed only by privileged root operators and is expected to be
used mainly for administrative correction.

### Tenant status

`status` is explicit durable tenant state used to support future business
rules.

Initial allowed values:

- `draft`
- `live`
- `disabled`
- `inactive`

Rules for this phase:

- create defaults `status` to `draft`
- `RootUserAdmin` may move a tenant from any status to any other status
- human policy, not hard-coded transition restrictions, governs those changes

Intended semantics:

- `disabled` means login visibility may remain but some actions may be blocked
  later for commercial or policy reasons
- `inactive` means logins should be blocked altogether once tenant-bound auth
  exists

### Creator attribution

Each tenant stores `createdByRootAdminUserId` durably.

This must be populated from the authenticated root session's `rootUserId`, not
from client input.

### Visible row

A visible tenant row is one whose `deletedAt` is `null`.

Visible rows participate in:

- normal exact lookup
- normal list
- update

### Deleted visibility

Soft-deleted tenants must remain hidden from normal exact and list routes.

They are exposed only through explicit deleted-read and deleted-list
capabilities.

### Soft delete

Soft delete preserves the tenant row while removing it from normal active
visibility.

Rules:

- `deletedAt` is set
- `updatedAt` is refreshed
- exposed `status` becomes `inactive`
- the tenant's pre-delete status is preserved durably for future reactivation

### Reactivation

Reactivation is the inverse of soft delete.

Rules:

- only deleted tenants may be reactivated
- `deletedAt` is cleared
- `updatedAt` is refreshed
- the pre-delete status is restored automatically
- reactivation must still satisfy normalized active `bizId` uniqueness

### Remove

Remove is irreversible.

For this phase it may hard-delete a tenant because the tenant does not yet own
other tenant-bound durable entities.

Rules:

- it must require explicit confirmation and a reason
- it must remain exceptional and auditable
- its semantics must be revisited before or alongside the first tenant-owned
  durable entity feature

---

## Feature Name

Recommended feature folder:

`src/features/tenants/`

This feature is separate from:

- `src/features/rootAuth/`
- `src/features/rootUsers/`
- `src/features/rootRoles/`

`rootAuth` continues to own authenticated root session state.

`rootRoles` continues to own root authorization capabilities and grants.

`tenants` owns durable tenant lifecycle and tenant metadata.

---

## Trust Boundary And Privileged Actor

### Trust boundary

This phase establishes a privileged root-operator administrative boundary
around tenant management.

- unauthenticated callers may not access tenant routes
- authenticated root users may access tenant routes only when they hold the
  required tenant capability
- the initial granting role is `RootUserAdmin`

### Privileged actor

The privileged actor in this phase is the authenticated root operator with the
required tenant capability.

This feature does not yet introduce tenant-scoped user actors.

---

## Capability Matrix

| Capability | Purpose | Request | Response | Rules | Persistence | Errors | Tests |
|---|---|---|---|---|---|---|---|
| `createTenant` | Create a new durable tenant | `bizId`, `name`, `category`, optional `status` | created tenant summary | `bizId` normalized and unique among active tenants; `bizId` immutable; `name` required but not unique; `status` defaults to `draft`; creator ID stamped from root session | insert tenant row with creator attribution | duplicate `bizId`, invalid input | valid create, duplicate `bizId`, default status, creator attribution |
| `getTenant` | Exact visible lookup by ID | `tenantId` | tenant summary | only non-deleted rows returned; exact reads include `createdByRootAdminUserId` | find visible by ID | invalid ID, not found | visible lookup, deleted hidden, creator visible |
| `listTenants` | Paginated list with approved filters | pagination, filters | paginated list | normal list excludes deleted rows; supports `bizIdPrefix`, `namePrefix`, `category`, and `status`; list rows need not expose creator ID | list visible rows with totals | invalid query | pagination, filtering, active-only visibility |
| `updateTenant` | Update editable tenant metadata | `tenantId` plus changed fields | updated tenant summary | only `name`, `category`, and `status` are editable; `bizId` is immutable; deleted tenants are not updatable | update row and refresh `updatedAt` | not found, invalid input, immutable field violation | update metadata, reject `bizId` mutation |
| `getDeletedTenant` | Exact deleted-only lookup by ID | `tenantId` | deleted tenant summary | deleted rows are exposed only through the explicit deleted-read route | find deleted row by ID | invalid ID, not found | deleted exact lookup, active rows excluded |
| `listDeletedTenants` | Paginated list of deleted rows | pagination, filters | paginated list | explicit deleted-only surface; supports the same approved filters as the active list | list deleted rows with totals | invalid query | deleted listing, filter separation |
| `softDeleteTenant` | Soft-delete a visible tenant | `tenantId` | updated tenant summary | sets `deletedAt`; refreshes `updatedAt`; forces exposed `status` to `inactive`; preserves pre-delete status | update row lifecycle fields | not found, already deleted | soft delete, forced inactive, pre-delete status preserved |
| `reactivateTenant` | Reactivate an eligible deleted tenant | `tenantId` | updated tenant summary | only deleted tenants may reactivate; restores pre-delete status; uniqueness rechecked on active `bizId` | clear lifecycle fields and restore status | not found, not deleted, uniqueness conflict | valid reactivate, conflict rejection |
| `removeTenant` | Irreversibly delete a tenant | `tenantId`, confirmation, reason | irreversible action confirmation | allowed in v1 while no tenant-bound durable entities exist; confirmation and reason required; later phases must tighten this | hard-delete tenant row | not found, invalid confirmation, future dependency guard | valid remove, missing confirmation, repeat remove |

---

## API Endpoints

Protected backend routes:

- `POST /v1/tenants`
- `GET /v1/tenants`
- `GET /v1/tenants/deleted`
- `GET /v1/tenants/:tenantId`
- `GET /v1/tenants/deleted/:tenantId`
- `PATCH /v1/tenants/:tenantId`
- `POST /v1/tenants/:tenantId/delete`
- `POST /v1/tenants/:tenantId/reactivate`
- `POST /v1/tenants/:tenantId/remove`

Current boundary rules:

- all routes require a valid root-user authenticated session
- all routes are restricted to `RootUserAdmin` through tenant capability gates
- all routes should also pass through the shared authenticated-general rate
  limiting boundary unless a later explicit decision changes that

---

## Authorization Mapping Rules

The governing root authz capabilities for this slice are:

- `tenant.create`
- `tenant.read`
- `tenant.list`
- `tenant.update`
- `tenant.read.deleted`
- `tenant.list.deleted`
- `tenant.delete`
- `tenant.reactivate`
- `tenant.remove`

Current root boundary expectations:

- `RootUserAdmin` is the initial granting role for all tenant capabilities
- deleted visibility and remove remain explicit privileged capabilities rather
  than being bundled into normal read and list behavior

This PRD should remain consistent with:

- [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
- [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)

---

## Data Rules

- `bizId` values must be trimmed and stored in normalized form for uniqueness
- `name` must be required and reject empty strings
- `name` is not unique
- client input must not set system-managed fields, including:
  - `tenantId`
  - `createdAt`
  - `updatedAt`
  - `deletedAt`
  - `createdByRootAdminUserId`
  - any future version or internal audit fields
- requests that supply unexpected or system-managed fields should be rejected
  explicitly with the repo-standard invalid-request error contract
- normal reads and lists must exclude deleted rows by default
- deleted rows must be exposed only through explicit deleted routes
- successful update, delete, and reactivate operations must refresh `updatedAt`
- soft delete must set `deletedAt`
- soft delete must force exposed `status` to `inactive`
- reactivation must restore the pre-delete status
- uniqueness is enforced on normalized active `bizId`
- exact route params remain required UUIDs
- representative invalid-request, not-found, authz, and duplicate-`bizId`
  errors must return stable `code`, `message`, and relevant `details`

---

## Cross-Feature Rules

`tenants` may depend on the authenticated root session only through the shared
request and session seam.

`tenants` must enforce authorization through the shared root-capability seam,
not through ad hoc local role checks.

Future tenant-bound features should consume tenant existence and lifecycle only
through narrow `tenants` public seams rather than importing
`tenants/persistence/*` directly.

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the backend supports the documented protected `/v1/tenants` routes
2. `bizId` is normalized consistently in validation, service logic, and
   persistence
3. active uniqueness is enforced on normalized `bizId`
4. `name` is required but not treated as unique
5. create defaults `status` to `draft` when omitted
6. exact reads include `createdByRootAdminUserId`
7. list responses support the approved filters without exposing deleted rows by
   default
8. soft delete and remove are behaviorally distinct
9. soft delete forces `inactive` while preserving pre-delete status
10. reactivation restores the pre-delete status and rechecks active `bizId`
    uniqueness
11. remove requires explicit confirmation and reason
12. shared root-session auth, capability gates, and authenticated-general
    throttling protect the feature routes

---

## Risks And Open Questions

- whether status changes should remain part of `updateTenant` long-term or
  later split into an explicit lifecycle or status transition capability
- how exactly `preDeleteStatus` should be stored in persistence so
  `reactivateTenant` can restore status deterministically
- `removeTenant` is safe only while tenants remain isolated durable records;
  the first tenant-owned durable entity feature must revisit remove semantics,
  dependency guards, and purge or retention policy
- the capability matrix CSV currently has structural drift in some rows, so the
  matrix notes and this PRD should be treated as the higher-confidence source
  of truth until the CSV is normalized
