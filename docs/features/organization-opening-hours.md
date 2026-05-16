# Organization Opening Hours Feature

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationOpeningHours` |
| Implementation status | `implemented-foundation` |
| First implemented story | `S-007` |
| Source owner | `src/features/organizationOpeningHours` |
| Runtime tables | `organization_location_weekly_opening_hours`; `organization_opening_hours_exception` |
| Audit table | `organization_opening_hours_audit_event` |

## Implemented Foundation

The S-007 slice introduces durable Organization opening-hours records scoped to
an Organization Location:

- weekly slots with weekday, slot order, and local open/close times
- multiple same-day slots per location and weekday
- same-day-only time ranges for v1; overnight slots are rejected
- duplicate slot order and overlapping active slots are rejected
- date-specific exceptions for `closed_day`, `replacement_day_schedule`,
  `closed_time_slot`, and `special_opening_slot`
- deterministic effective-hours precedence: closed day, replacement schedule,
  closed time ranges, then special opening slots
- soft-delete lifecycle for weekly slots and exceptions
- root routes governed by read/manage capabilities and tenant-admin routes
  governed by active tenant session context
- same-tenant Organization Location ownership proof through the
  `organizationLocations` public seam

## Current Route Families

| Actor world | Canonical route family | Compatibility route family | Notes |
| --- | --- | --- | --- |
| root admin | `/v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations/:locationId/weekly-opening-hours` | `/v1/tenants/:tenantId/organizations/:organizationId/locations/:locationId/weekly-opening-hours` | Root routes require `organization.weekly-hours-slot.read` or `organization.weekly-hours-slot.manage`. |
| root admin | `/v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations/:locationId/opening-hours-exceptions` | `/v1/tenants/:tenantId/organizations/:organizationId/locations/:locationId/opening-hours-exceptions` | Root routes require `organization.opening-hours-exception.read` or `organization.opening-hours-exception.manage`. |
| root admin | `/v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations/:locationId/effective-opening-hours` | `/v1/tenants/:tenantId/organizations/:organizationId/locations/:locationId/effective-opening-hours` | Computes the effective schedule for one `localDate`. |
| tenant admin | `/v1/tenant-admin/organizations/:organizationId/locations/:locationId/...` | `/v1/tenant/organizations/:organizationId/locations/:locationId/...` | Tenant routes require an active tenant-admin session/current tenant context. |

## Deferred From S-007

UI screens, public rendered schedule consumption, Organization export
integration, recurring holiday calendars, seasonal schedules, external holiday
feeds, and richer tenant-admin grant checks remain later slices.

## Evidence

| Evidence | Location |
| --- | --- |
| Story | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-007-opening-hour-slots-and-exceptions/story.md` |
| Task breakdown | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-007-opening-hour-slots-and-exceptions/task-breakdown.md` |
| Data dictionary | `docs/data-dictionary/organization-weekly-opening-hours.md`; `docs/data-dictionary/organization-opening-hours-exception.md` |
| Root API contract | `docs/api-contracts/organization-root-admin.md` |
| Tenant API contract | `docs/api-contracts/organization-tenant-admin.md` |
| Feature manifest | `src/features/organizationOpeningHours/feature.manifest.json` |
| Focused tests | `tests/unit/organizationOpeningHours/service.test.ts`; `tests/security/organizationOpeningHours/security.test.ts`; `tests/integration/organizationOpeningHours/persistence.test.ts` |
