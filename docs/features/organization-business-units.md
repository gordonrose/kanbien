# Organization Business Units Feature

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationBusinessUnits` |
| Implementation status | `implemented-foundation` |
| First implemented story | `S-008` |
| Source owner | `src/features/organizationBusinessUnits` |
| Runtime table | `organization_business_unit` |
| Audit table | `organization_business_unit_audit_event` |

## Implemented Foundation

The S-008 slice introduces durable Organization business-unit hierarchy records:

- business units scoped to one tenant and Organization
- optional parent business unit in the same Organization
- derived `childBusinessUnitIds` from parent links
- max hierarchy depth of 10
- cycle denial for moves
- branch archive or child reassignment during parent archive
- active, archived, and soft-deleted lifecycle behavior
- root routes governed by read/manage capabilities and tenant-admin routes
  governed by active tenant session context
- same-tenant Organization proof through the `organizationCore` public seam

## Deferred From S-008

Frontend screens, grouped Organization search, Organization export integration,
and richer tenant-admin grant checks remain later slices.

## Evidence

| Evidence | Location |
| --- | --- |
| Story | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-008-business-units/story.md` |
| Data dictionary | `docs/data-dictionary/organization-business-unit.md` |
| Root API contract | `docs/api-contracts/organization-root-admin.md` |
| Tenant API contract | `docs/api-contracts/organization-tenant-admin.md` |
| Feature manifest | `src/features/organizationBusinessUnits/feature.manifest.json` |
| Focused tests | `tests/integration/organizationBusinessUnits/persistence.test.ts` |
