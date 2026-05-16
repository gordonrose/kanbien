# Story Breakdown Story: Manage Locations

## Story Detail

- Story ID:
  `S-006`
- Title:
  Manage locations
- Context:
  This is needed because admins need many locations without hidden head-office uniqueness.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need to manage organization locations with optional coordinates and descriptive flags.
- Actor / System Perspective:
  admin
- Outcome:
  Locations can be saved, searched, archived, and exported under the correct organization.
- Non-goals:
  No opening-hour behavior in this story.

## Story Narrative

**Situation**
An organization can have many locations. Head-office flags describe a location
but do not make it the only head office.

**Goal**
Admins can record locations with optional coordinates and lifecycle behavior
without creating hidden uniqueness rules.

**Decisions Needed**
No new product choice is expected. Task planning must carry address fields,
coordinate validation, descriptive flags, search fields, and export projection.

**Work That Follows**
Source work can create location records and the checks that keep them attached
to the correct organization.

**Evidence Of Success**
Reviewers can prove many locations are allowed, many head-office flags are
allowed, coordinates are validated, and cross-boundary location writes are
denied.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Data dictionary | actual | `docs/data-dictionary/organization-location.md` | Defines location fields, coordinates, flags, lifecycle, and search/export posture. |
| Root API contract | actual | `docs/api-contracts/organization-root-admin.md` | Defines planned root child-route posture. |
| Tenant API contract | actual | `docs/api-contracts/organization-tenant-admin.md` | Defines planned tenant child-route posture. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines object and tenant/account authority. |
| API/data alignment review | actual | `docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md` | Confirms S-004 through S-010 docs align before Task Breakdown. |
| Task breakdown | actual | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-006-locations/task-breakdown.md` | Carries S-006 delivery tasks and closeout obligations. |
| Feature source | actual | `src/features/organizationLocations` | Implements location domain, persistence, transport, integration, and manifest. |
| Feature document | actual | `docs/features/organization-locations.md` | Summarizes implemented route families, source owner, and deferred scope. |
| Migration | actual | `src/features/organizationLocations/persistence/migrations/0053_create_organization_locations.sql` | Creates location source and audit tables, indexes, and root capabilities. |
| Focused tests | actual | `tests/unit/organizationLocations/service.test.ts`; `tests/security/organizationLocations/security.test.ts`; `tests/integration/organizationLocations/persistence.test.ts` | Proves many locations, coordinate validation, descriptive flags, tenant boundary, lifecycle visibility, and retained export projection. |
