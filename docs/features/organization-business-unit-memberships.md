# Organization Business Unit Memberships Feature

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationBusinessUnitMemberships` |
| Implementation status | `partial-foundation` |
| First implemented story | `S-009` |
| Source owner | `src/features/organizationBusinessUnitMemberships` |
| Runtime table | `organization_business_unit_membership` |
| Audit table | `organization_business_unit_membership_audit_event` |

## Implemented Foundation

The S-009 slice introduces durable Organization business-unit membership records:

- memberships scoped to one tenant, Organization, and owning business unit
- fixed v1 participation roles: `owner`, `manager`, `member`, and `viewer`
- real business-unit member targets validated through the
  `organizationBusinessUnits` public service seam
- archive, restore, and soft-delete lifecycle behavior
- audit rows for membership mutations
- root routes governed by read/manage capabilities and tenant-admin routes
  governed by active tenant session context

## Explicit Deferral

Individual member targets are intentionally blocked with
`ORGANIZATION_BUSINESS_UNIT_MEMBERSHIP_INDIVIDUAL_TARGET_DEFERRED` until an
approved individual/person record feature exposes a public lookup seam. This
prevents placeholder people and avoids treating tenant admins as general staff
members by accident.

## Deferred From S-009

Frontend screens, individual/person target support, Organization export
integration, privacy review for person-linked memberships, and richer
tenant-admin grant checks remain later slices.

## Evidence

| Evidence | Location |
| --- | --- |
| Story | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-009-business-unit-memberships/story.md` |
| Data dictionary | `docs/data-dictionary/organization-business-unit-membership.md` |
| Root API contract | `docs/api-contracts/organization-root-admin.md` |
| Tenant API contract | `docs/api-contracts/organization-tenant-admin.md` |
| Feature manifest | `src/features/organizationBusinessUnitMemberships/feature.manifest.json` |
| Focused tests | `tests/integration/organizationBusinessUnits/persistence.test.ts` |
