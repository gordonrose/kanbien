# Root Roles API Contract

## Scope

- Contract name: `root-roles`
- Feature: `rootRoles`
- Route family or capability group:
  Protected system root-role lifecycle, grant-management, assignment, and
  effective-permission backend routes
- In-scope routes:
  - `POST /v1/root-roles`
  - `GET /v1/root-roles`
  - `GET /v1/root-roles/{rootRoleId}`
  - `PATCH /v1/root-roles/{rootRoleId}`
  - `POST /v1/root-roles/{rootRoleId}/deactivate`
  - `POST /v1/root-roles/{rootRoleId}/reactivate`
  - `GET /v1/root-roles/{rootRoleId}/eligible-authz-capabilities`
  - `GET /v1/root-roles/{rootRoleId}/capability-assignments`
  - `PUT /v1/root-roles/{rootRoleId}/capability-assignments`
  - `POST /v1/root-users/{rootUserId}/root-role-assignments`
  - `POST /v1/root-users/{rootUserId}/root-role-assignments/{rootRoleAssignmentId}/unassign`
  - `GET /v1/root-users/{rootUserId}/root-roles`
  - `POST /v1/root-users/{rootUserId}/root-role-assignments/replace`
  - `GET /v1/root-users/{rootUserId}/effective-permissions`
- Out-of-scope but closely related routes:
  - `/v1/root-auth/*` routes that establish the protected root session required
    here
  - `/v1/root-users/*` routes whose lifecycle state is read through an approved
    seam during assignment and effective-permission flows

## Capability

- Feature: `rootRoles`
- Capability:
  Manage durable system root-role definitions, root-role capability grants,
  root-user role assignments, and effective root permissions

## Authentication

- Required auth state:
  Authenticated root-user session is required for every route in this family
- Session transport(s):
  - `Authorization: Bearer <sessionId>` for API/manual callers
  - same-origin root-admin browser session cookie for the current browser
    operator console

## Authorization

- Allowed roles:
  `RootUserAdmin` only in the initial approved slice
- Denied roles:
  unauthenticated callers, invalid root sessions, and any future narrower root
  role that lacks the governing capability for the route
- Enforcement point:
  shared `requireRootSession` middleware at `/v1` plus central or
  central-shaped authorization evaluation using the mapped `root-role.*`
  capability keys

## Middleware And Platform Effects

- Route protection middleware:
  shared root-session middleware rejects missing accepted session transport
  with `401 UNAUTHORIZED` and invalid/expired sessions with `401 INVALID_SESSION`
- Rate limiting / abuse controls:
  shared authenticated-general rate limiting should apply to the mounted
  `rootRoles` routes and may return `429 RATE_LIMITED`
- Browser-specific behavior:
  there is still no route-local cookie logic inside `rootRoles`, but the
  mounted shared root-session middleware now accepts the same root-admin
  browser-session cookie used by the current browser operator console
- Other shared platform behavior:
  app-level JSON error middleware handles unexpected failures outside the
  feature-local error mapping

## Route

- Method:
  mixed
- Path:
  `/v1/root-roles*` and the `root-role-assignment` subroutes nested under
  `/v1/root-users/{rootUserId}`

## Request Contract

- Params:
  - `rootRoleId` is required where present and should be an exact stable role
    identifier
  - `rootUserId` is required on assignment and effective-permission routes and
    should be an exact root-user identifier
  - `rootRoleAssignmentId` is required on explicit unassign routes and should
    be an exact assignment identifier
- Query:
  - `GET /v1/root-roles` uses standard list defaults:
    `page=1`, `pageSize=25`, `orderDirection=desc`
  - normal role lists exclude deactivated roles by default
  - capability-catalog and assignment-list reads may later use standard
    pagination/filtering when the catalog grows
  - `GET /v1/root-users/{rootUserId}/root-roles` lists active assignments by
    default
- Body:
  - create role:
    `{ roleKey, displayName, description }`
  - update role:
    at least one of `{ displayName?, description? }`
  - deactivate/reactivate:
    no required body; optional operator reason/comment may be supported
  - replace role grants:
    `{ capabilityKeys, reason? }`
  - assign role:
    `{ rootRoleId, reason? }`
  - unassign role:
    optional `{ reason? }`
  - replace assignment:
    `{ sourceRootRoleAssignmentId? | sourceRootRoleId?, targetRootRoleId, reason? }`
- Validation rules:
  - all request bodies and query objects are strict; unexpected fields are
    rejected
  - `roleKey` is trimmed, normalized, and stable after creation
  - editable text fields must reject empty strings
  - clients must not supply system-managed fields or lifecycle fields
  - bulk grant updates must validate every requested capability key against the
    eligible root capability catalog
  - assignment and replacement requests must reject inactive target roles

## Response Contract

- Success payload:
  - role lifecycle routes return a root-role summary with:
    `{ rootRoleId, roleKey, displayName, description, protected, assignable, createdAt, updatedAt, deactivatedAt }`
  - role list routes return a paginated list shape:
    `{ items, page, pageSize, totalPages, totalSearchableRecords, totalMatchingRecords }`
  - capability-catalog and role-grant reads return capability/grant summaries
    with protected and mandatory indicators
  - assignment routes return assignment summaries with target role metadata
  - effective-permission route returns:
    `{ rootUserId, roles, permissions }`
    where each effective capability includes source-role attribution
- Status code:
  - `201` for create-role and assign-role success
  - `200` for reads, updates, deactivate/reactivate, unassign, replace, and
    effective-permission reads
- Response headers or cookies:
  - no route-family-specific headers or cookies

## Error Contract

- Error codes:
  - feature-local target contract should include stable codes for:
    - invalid request
    - role not found
    - duplicate active role key
    - protected-role safety violation
    - protected/mandatory grant violation
    - root user not found
    - role assignment not found
    - inactive role assignment target
    - last-role safety violation
    - last-`RootUserAdmin` safety violation
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `RATE_LIMITED`
- Representative messages:
  - invalid request:
    "Your request could not be accepted because one or more fields are missing or invalid."
  - duplicate role key:
    "That root role key is already in use by another active system root role."
  - protected-role safety violation:
    "That change would violate a protected root-role safety rule."
  - inactive assignment target:
    "That root role is inactive and cannot be newly assigned."
- `details` shape:
  - when present:
    `{ field?: string, reason?: string }`
  - safety violations should include a machine-readable `reason`
    such as `last_root_user_role`, `last_root_user_admin_assignment`, or
    `protected_grant_removal`
- Shared middleware errors:
  - `401 UNAUTHORIZED` when no accepted session transport is present
  - `401 INVALID_SESSION` when session is invalid or expired
  - `429 RATE_LIMITED` from authenticated-general platform throttling

## Persistence / Side Effects

- Durable writes:
  - create inserts a durable system root-role row
  - update changes editable role metadata and refreshes `updatedAt`
  - deactivate sets lifecycle fields that make the role non-assignable without
    destroying history
  - reactivate clears lifecycle fields and restores assignable status
  - grant updates upsert/deactivate role-grant rows while preserving required
    grants
  - assign creates a durable root-user-role-assignment row
  - unassign deactivates the assignment row rather than erasing it
  - replace atomically deactivates one assignment and creates another
- Audit effects:
  - role, grant, assignment, unassignment, and replacement mutations must be
    audit-visible with actor, target, before/after, timestamp, and optional
    reason/comment
- Cross-feature reads:
  - assignment and effective-permission routes read root-user existence and
    lifecycle state through an approved `rootUsers` seam rather than direct
    persistence imports
- Other side effects:
  - deactivated roles are preserved historically but cannot be newly assigned
  - effective permission reads flatten positive grants across active
    assignments and include source-role explanation

## Compatibility / Lifecycle Notes

- Notes:
  - This contract now reflects implemented backend runtime behavior for the
    initial `rootRoles` slice.
  - The contract intentionally separates:
    - role definition lifecycle
    - role grant lifecycle
    - root-user role-assignment lifecycle
  - Deactivation retires a role from future assignment without forcing existing
    assignments to disappear first.
  - Role replacement is first-class so operators do not need fragile manual
    unassign/reassign sequences.
  - Read-style `root-role.*` capabilities are intentionally protected but not
    all mandatory for `RootUserAdmin`, leaving room for future read-only root
    roles without redefining the route family.

## Traceability

- PRD / design docs:
  - [2026-03-30-0004-system-root-role-crud.md](/home/gordon/kanbien/docs/prd/2026-03-30-0004-system-root-role-crud.md)
  - [2026-03-30-root-roles-backend-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-03-30-root-roles-backend-foundation.md)
  - [0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md](/home/gordon/kanbien/docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md)
- OpenAPI:
  - [openapi.yaml](/home/gordon/kanbien/docs/swagger/openapi.yaml)
- Tests required or existing:
  - [2026-03-30-0004-system-root-role-crud-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-03-30-0004-system-root-role-crud-test-cases.md)

## Tests Required

- Unit:
  - role-key normalization and duplicate active-key rejection
  - immutable `roleKey` enforcement
  - deactivate/reactivate lifecycle behavior
  - protected/mandatory grant preservation
  - assignment safety invariants
  - effective permission union and source attribution
- Integration:
  - protected-route enforcement for the new route family
  - cross-feature seam behavior with `rootUsers`
  - role deactivation blocking future assignment while preserving historical
    explainability
  - atomic replacement behavior
  - updates to pre-existing protected `rootUsers` / protected `rootAuth`
    integration suites so they prove capability-gated success
- Security:
  - missing/invalid session rejection
  - role/capability allow and deny coverage
  - inactive-role assignment rejection
  - protected-role/protected-grant tampering attempts
  - authenticated-general rate limiting on representative routes
  - updates to pre-existing protected `rootUsers` / protected `rootAuth`
    security suites so they prove gated denial where relevant
- Audit:
  - durable audit visibility for role, grant, and assignment mutations
  - denied privileged-action visibility where required
  - follow-on coverage for newly gated denials on pre-existing protected
    feature routes
- Edge:
  - repeated deactivate/reactivate behavior
  - duplicate assignment rejection
  - last-role and last-`RootUserAdmin` safety rejection
  - replacement with invalid source/target combinations
