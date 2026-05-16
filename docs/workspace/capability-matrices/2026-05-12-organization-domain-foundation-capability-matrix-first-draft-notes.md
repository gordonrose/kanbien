# Organization Domain Foundation Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv](2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv)

## Current Posture

This is the refreshed S-000 capability/behavior matrix for the Organization
domain foundation, updated after the Layer 3 entity-readiness pass.

The matrix is a planning checklist. It is not approval to implement source,
migrations, route paths, permission keys, database tables, or app screens.

The refresh intentionally replaces the older story model that treated
integrations as active v1 work and blended several entity concerns together.
The current matrix now follows the refreshed Story Breakdown packet and its
Entity Readiness Snapshot.

## Refresh Inputs

The current matrix uses:

- `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/epic.md`
- `docs/prd/2026-05-12-0025-organization-domain-foundation.md`
- `docs/api-contracts/organization-root-admin.md`
- `docs/api-contracts/organization-tenant-admin.md`
- `docs/data-dictionary/index.md`
- `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md`
- `docs/workspace/implementation-blueprints/2026-05-15-organization-domain-foundation-planning-blueprint.md`
- `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`
- `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md`
- `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`
- `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`

## Story Coverage

Rows are mapped to the refreshed Story Breakdown:

| Story | Matrix row intent | Readiness |
| --- | --- | --- |
| S-000 | Refresh capability matrix. | ready-for-task-breakdown |
| S-001 | Refresh PRD-derived proof plan. | ready-for-task-breakdown |
| S-002 | Create Organization permission mapping. | ready-for-task-breakdown |
| S-003 | Record Organization as a feature family. | ready-for-task-breakdown |
| S-004 | Manage core organizations and hierarchy. | ready-for-task-breakdown |
| S-005 | Manage legal profiles. | ready-for-task-breakdown |
| S-006 | Manage locations. | ready-for-task-breakdown |
| S-007 | Manage opening-hour slots and exceptions. | ready-for-task-breakdown |
| S-008 | Manage business units. | ready-for-task-breakdown |
| S-009 | Manage business-unit memberships. | ready-for-task-breakdown |
| S-010 | Manage reference values. | ready-for-task-breakdown |
| S-011 | Complete public logo technical signoff. | ready-for-task-breakdown |
| S-012 | Manage public logo relationships. | blocked-before-implementation |
| S-013 | Search Organization records by type. | ready-for-task-breakdown |
| S-014 | Lock secure generated export behavior. | ready-for-task-breakdown |
| S-015 | Manage private export bundles. | blocked-before-implementation |
| S-016 | Define shared admin screen behavior. | blocked |
| S-017 | Keep integration records deferred. | ready-for-task-breakdown |
| S-018 | Keep Organization artifacts aligned as slices land. | ready-for-task-breakdown |

## Entity Readiness Summary

Active v1 entity-backed rows:

- Organization
- Organization Legal Profile
- Organization Location
- Weekly Opening-Hour Slot
- Opening-Hour Exception
- Business Unit
- Business Unit Membership
- Organization Reference Value
- Organization Search read model

Blocked-before-implementation rows:

- Organization Logo Relationship, blocked on public logo technical signoff
- Organization Export, blocked on secure generated export technical steering

Deferred rows:

- Organization Integration Record, deferred from v1 route, persistence, UI,
  search, and export work
- Public Organization Summary, deferred until a first real consumer exists

## Important Scope Corrections From Earlier Drafts

- Integration records are not active v1 implementation scope.
- Business-unit memberships support real individual users or real business
  units, not placeholder people or placeholder units.
- Participation labels are `owner`, `manager`, `member`, and `viewer`; they are
  not platform authorization grants.
- Weekly opening hours are weekday-specific slots, and opening-hour exceptions
  are separate records with deterministic precedence.
- Location geocoordinates are optional.
- Organization legal profile includes optional tax/VAT number and optional
  registered address.
- Public logo behavior is product-approved for planning but blocked before
  implementation until technical signoff is complete.
- Private exports are requester-bound PIN/password protected ZIP bundles with
  JSON data and selected actual files; CSV, request-time snapshots, generated
  placeholder images, public links, and integration export are out of v1.

## Downstream Required Artifacts

Before source implementation:

- refreshed PRD-derived test cases
- Organization permission mapping
- task breakdown for selected ready stories
- API contract review for any route task
- data dictionary review for any persistence task
- feature docs and feature manifests when source features are created
- generated dependency graph refresh after feature manifest changes
- runbooks for public logo delivery, asset cleanup, export jobs, export cleanup,
  and failure recording where those slices are implemented
- public logo technical signoff before logo source work
- secure generated export technical steering before export source work
- shared screen behavior references before real app UI

## Reading Guidance

The CSV is intentionally wide because it follows the capability-matrix
template. For human review, start with:

- `Feature`
- `Capability`
- `Status`
- `Business goal`
- `Source artifact`
- `Harness gate notes`
- `Traceability status`
- `Acceptance notes`

Treat route, field, migration, permission-key, and UI details as planned
posture only unless the downstream source artifact explicitly approves them.
