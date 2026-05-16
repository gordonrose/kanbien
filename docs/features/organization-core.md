# Organization Core Feature

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationCore` |
| Implementation status | `implemented-foundation` |
| First implemented story | `S-004` |
| Source owner | `src/features/organizationCore` |
| Runtime table | `organization` |
| Audit table | `organization_audit_event` |

## Implemented Foundation

The S-004 slice introduces durable tenant-owned Organization records with:

- root-admin and tenant-admin route families for create, read, list, update,
  move, archive, restore, and soft delete
- active name uniqueness within a tenant/account using normalized names
- parent/child hierarchy with same-tenant parent validation, cycle denial, and
  max depth 10
- archive branch or move-children behavior
- normal reads that exclude archived and deleted rows
- feature-local audit events for successful source lifecycle mutations
- root capability seeding for Organization record operations

## Current Route Families

| Actor world | Canonical route family | Compatibility route family | Notes |
| --- | --- | --- | --- |
| root admin | `/v1/root-admin/tenants/:tenantId/organizations` | `/v1/tenants/:tenantId/organizations` | Both use root session and root capability checks. |
| tenant admin | `/v1/tenant-admin/organizations` | `/v1/tenant/organizations` | Both use active tenant session context. |

## Deferred From S-004

Legal profiles, locations, opening-hour slots and exceptions, business units,
business-unit memberships, reference values, logos, grouped search, exports,
and admin UI are intentionally separate stories. Those slices should consume
Organization identity and lifecycle through public seams rather than importing
private persistence files.

## Evidence

| Evidence | Location |
| --- | --- |
| Story | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-004-core-organizations-and-hierarchy/story.md` |
| Task breakdown | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-004-core-organizations-and-hierarchy/task-breakdown.md` |
| Data dictionary | `docs/data-dictionary/organization.md` |
| Root API contract | `docs/api-contracts/organization-root-admin.md` |
| Tenant API contract | `docs/api-contracts/organization-tenant-admin.md` |
| Feature manifest | `src/features/organizationCore/feature.manifest.json` |
