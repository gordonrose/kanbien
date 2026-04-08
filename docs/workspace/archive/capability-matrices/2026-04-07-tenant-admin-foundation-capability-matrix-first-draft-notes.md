# Tenant Admin Foundation Capability Matrix First Draft Notes

## Generated Artifact

- Matrix:
  [2026-04-07-tenant-admin-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-07-tenant-admin-foundation-capability-matrix-first-draft.csv)

## Direction Captured In This Draft

- `tenantAdmins` is intentionally a very small foundation slice.
- The first implementation is root-managed only.
- The governing operator boundary is `RootUserAdmin`.
- The current rows should be treated as:
  - capability boundary: `root`
  - tenant context rule:
    root-operated tenant-admin lifecycle capability over target `tenantId`;
    no tenant-admin session or current-tenant actor context in v1
- The first draft covers:
  - create
  - exact visible read
  - visible list
  - update
  - explicit deleted exact read
  - explicit deleted list
  - soft delete
  - reactivate

## Tenant Admin Identity Model In This Draft

- `tenantAdminId` is a system-generated UUID.
- Every `tenantAdmin` belongs to exactly one `tenantId` in v1.
- `email` is required, trimmed, stored lowercase, and treated as a durable
  tenant-scoped identity hint.
- `firstName` and `lastName` are optional mutable profile metadata.
- `status` starts as:
  - `active`
  - `inactive`
- `createdByRootAdminUserId` is stamped durably from the authenticated root
  session.
- Standard system-managed lifecycle fields are present.

## Compatibility Decisions Applied

- This slice intentionally does **not** yet introduce:
  - shared `principal` records
  - tenant memberships
  - tenant roles
  - tenant login
  - auth principals
  - passwords
  - SSH keys
- The model is designed to stay compatible with the future shared
  principal-plus-membership architecture by keeping the v1 entity narrow and
  by not coupling it to login mechanics.
- The same normalized email may exist in different tenants.
- Active uniqueness should apply only within one tenant:
  - unique active `(tenantId, normalizedEmail)`
- `tenantAdmin` ownership must stay tenant-scoped:
  - no global list
  - no cross-tenant lookup
  - every route carries `tenantId`

## Lifecycle Decisions Applied

- Normal reads, lists, and updates exclude soft-deleted rows by default.
- Deleted rows are visible only through explicit deleted-read and deleted-list
  capabilities.
- Soft delete sets `deletedAt`, refreshes `updatedAt`, and forces exposed
  `status` to `inactive`.
- Reactivation clears `deletedAt`, refreshes `updatedAt`, and restores the row
  to active visibility.
- This first draft does **not** include permanent remove.

## Why Remove Is Excluded Here

This is the safer small-slice choice because `tenantAdmin` is likely to become
entangled with future:

- tenant memberships
- tenant roles
- tenant users
- tenant-scoped auth principals
- audit trails

That means hard delete would create retention and referential-integrity
questions almost immediately. Soft delete plus reactivation is the safer
foundation.

## Future Role Relationship

In this draft, every `tenantAdmin` row is effectively an admin-eligible actor
placeholder for later tenant-scoped authorization work.

That does **not** mean the row alone grants future runtime permission.

Later slices should still define:

- how a `tenantAdmin` becomes or links to a shared `principal`
- how tenant membership is created
- how tenant-admin role assignment is represented
- how exactly one current tenant context is resolved at request time

## Main Questions To Review Before Implementation

- Whether `status` should remain editable directly in `updateTenantAdmin` or be
  split later into a dedicated lifecycle capability.
- Whether the first slice should permit an `inactive` visible row that is not
  deleted, or whether v1 should treat inactivity mostly as a future-proofing
  field.
- Whether the future shared-principal migration should preserve
  `tenantAdminId` as a durable legacy reference field for audit correlation.

## Recommended v1 Reading

The safest framing is:

- `tenantAdmins` is the first durable tenant-scoped actor record
- it is **not** yet the full tenant-user or membership architecture
- it prepares the repo for that architecture by creating a tenant-owned admin
  identity record with clean lifecycle and audit behavior
