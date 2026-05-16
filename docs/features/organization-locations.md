# Organization Locations Feature

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationLocations` |
| Implementation status | `implemented-foundation` |
| First implemented story | `S-006` |
| Source owner | `src/features/organizationLocations` |
| Runtime table | `organization_location` |
| Audit table | `organization_location_audit_event` |

## Implemented Foundation

The S-006 slice introduces durable Organization location records with:

- many locations per Organization
- descriptive head-office and registered-office flags without hidden uniqueness
- required location name plus optional address summary and optional
  latitude/longitude pair
- coordinate range validation
- archive, restore, and soft-delete lifecycle behavior
- normal reads that exclude archived and deleted rows unless explicitly asked
  for retained records
- export projection support for later Organization export slices
- same-tenant Organization ownership proof through the `organizationCore`
  public seam

## Current Route Families

| Actor world | Canonical route family | Compatibility route family | Notes |
| --- | --- | --- | --- |
| root admin | `/v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations` | `/v1/tenants/:tenantId/organizations/:organizationId/locations` | Root routes require `organization.location.read` or `organization.location.manage`. |
| tenant admin | `/v1/tenant-admin/organizations/:organizationId/locations` | `/v1/tenant/organizations/:organizationId/locations` | Tenant routes require an active tenant-admin session/current tenant context. |

## Deferred From S-006

Opening-hour slots, opening-hour exceptions, UI screens, grouped search
integration, export job integration, and richer tenant-admin grant checks
remain later slices.

## Evidence

| Evidence | Location |
| --- | --- |
| Story | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-006-locations/story.md` |
| Task breakdown | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-006-locations/task-breakdown.md` |
| Data dictionary | `docs/data-dictionary/organization-location.md` |
| Root API contract | `docs/api-contracts/organization-root-admin.md` |
| Tenant API contract | `docs/api-contracts/organization-tenant-admin.md` |
| Feature manifest | `src/features/organizationLocations/feature.manifest.json` |
| Focused tests | `tests/unit/organizationLocations/service.test.ts`; `tests/security/organizationLocations/security.test.ts`; `tests/integration/organizationLocations/persistence.test.ts` |
