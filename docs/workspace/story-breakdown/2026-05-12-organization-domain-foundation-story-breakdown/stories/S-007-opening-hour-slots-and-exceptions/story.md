# Story Breakdown Story: Manage Opening-Hour Slots And Exceptions

## Story Detail

- Story ID:
  `S-007`
- Title:
  Manage opening-hour slots and exceptions
- Context:
  This is needed because normal weekly hours and exceptional closures need deterministic rules.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need to manage weekly slots and exceptions that supersede normal hours.
- Actor / System Perspective:
  admin
- Outcome:
  Weekly slots and exceptions validate correctly and produce predictable effective opening rules.
- Non-goals:
  No recurring holiday calendar, seasonal schedule, or external holiday feed.

## Story Narrative

**Situation**
Normal opening hours repeat weekly, but exceptional closures or special hours
must be able to override the normal slots.

**Goal**
Admins can manage weekday slots and date-specific exceptions while the system
calculates which rule wins.

**Decisions Needed**
No new product choice is expected. Task planning must carry slot order,
weekday, local open and close times, no-overlap behavior, no overnight v1, and
exception precedence.

**Work That Follows**
Source work can create slot and exception records, validation, search fields,
and export projection.

**Evidence Of Success**
Reviewers can prove closed days override everything, replacement day schedules
override normal slots, closed time slots suppress normal openings, and special
opening slots apply only when not overridden.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Weekly slots data dictionary | actual | `docs/data-dictionary/organization-weekly-opening-hours.md` | Defines weekday slots, ordering, non-overlap, and deletion behavior. |
| Exceptions data dictionary | actual | `docs/data-dictionary/organization-opening-hours-exception.md` | Defines date-specific exceptions and precedence. |
| API contracts | actual | `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` | Define planned root and tenant route posture for opening-hour records. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines object and tenant/account authority. |
| API/data alignment review | actual | `docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md` | Confirms S-004 through S-010 docs align before Task Breakdown. |
| Feature source | actual | `src/features/organizationOpeningHours` | Implements weekly slots, exceptions, effective-hours reads, routes, persistence, and manifest. |
| Migration | actual | `src/features/organizationOpeningHours/persistence/migrations/0054_create_location_opening_hours.sql` | Creates weekly slot, exception, audit tables, indexes, and root capability seeds. |
| Feature doc | actual | `docs/features/organization-opening-hours.md` | Captures current implementation status, routes, deferrals, and proof links. |
| Unit proof | actual | `tests/unit/organizationOpeningHours/service.test.ts` | Covers validation and deterministic effective-hours precedence. |
| Security proof | actual | `tests/security/organizationOpeningHours/security.test.ts` | Covers root auth/capability enforcement and system-managed field denial. |
| Persistence proof | actual | `tests/integration/organizationOpeningHours/persistence.test.ts` | Covers real Postgres rows, JSON replacement slots, effective reads, and audit rows. |
