# Design System Canonicals Feature Reference

## Purpose

The `designSystemCanonicals` feature owns durable registry truth for generated
design-system canonical-rendering families and reference states.

Today it ships the backend foundation for:

- protected canonical family governance
- protected canonical reference governance
- public live-family listing
- public generated launcher projections
- public deterministic render projections
- a public integration seam consumed by `webAppHierarchyBuilder` for durable
  hierarchy materialization

## Where It Lives

- `src/features/designSystemCanonicals/contract`
- `src/features/designSystemCanonicals/domain`
- `src/features/designSystemCanonicals/persistence`
- `src/features/designSystemCanonicals/transport`
- `src/features/designSystemCanonicals/integration.ts`
- `src/features/designSystemCanonicals/index.ts`

## Current Boundaries

- `designSystemCanonicals` owns family keys, reference ids, generated launcher
  route paths, generated render route paths, lifecycle status, ordering, and
  deterministic render payload metadata.
- `webAppHierarchyBuilder` owns durable page-tree truth. It reads canonical
  hierarchy nodes through the `designSystemCanonicals` public seam and then
  materializes launcher and render pages into its own hierarchy records.
- `webAppPageSettings` owns durable page-template intent. It allows the
  `canonical-rendering` template key but does not own canonical registry truth.
- `src/frontend/designSystem` owns browser rendering for public generated
  launcher and render routes.
- Legacy `/design-system/canonicals/*` routes remain compatibility and parity
  review surfaces during migration.

## Current API Surface

Base path:

- `/v1/design-system-canonicals`

Protected root-capability routes:

- `POST /families`
- `GET /families/:canonicalFamilyId`
- `PUT /families/:canonicalFamilyId`
- `POST /families/:canonicalFamilyId/references`
- `GET /references/:canonicalReferenceId`
- `PUT /references/:canonicalReferenceId`

Public routes:

- `GET /public/families`
- `GET /public/families/:familyKey/launcher`
- `GET /public/families/:familyKey/references/:referenceId`

## Current Persistence Model

- `design_system_canonical_families` stores one durable family row for a
  generated canonical launcher family.
- `design_system_canonical_references` stores durable reference states under
  one family.
- Family and reference public projections expose only `live` rows.
- Family keys are normalized lowercase for lookup and uniqueness.
- Reference ids are normalized lowercase for family-scoped uniqueness while
  preserving display/reference casing in responses and route paths.
- Template intent is fixed in the feature seam:
  - family launcher pages use `launcher`
  - reference render pages use `canonical-rendering`

## Current Seeded Route Posture

Seed migrations currently populate generated canonical families such as:

- `page-shell-banner`
- `top-nav`
- `time-picker`
- `simple-select`
- `choice-group`
- `date-picker`
- `drawer-select`
- `list-record-card`
- `list-detail-panel`
- `list-detail-split-layout`
- `form-template`
- `icon-grid`
- `upload-file`
- `async-activity-drawer`
- `hierarchy-tree`

The public browser route family is:

- `/design-system/canonical-renderings`
- `/design-system/canonical-renderings/:familyKey`
- `/design-system/canonical-renderings/:familyKey/:referenceId`

## Verification Status

Current executable evidence includes:

- `tests/integration/frontend/designSystemCanonicalRouting.test.ts`
- `tests/integration/frontend/designSystemCanonicalLauncherLinkAudit.test.ts`
- `tests/integration/frontend/designSystemCanonicalOverlayContainmentAudit.test.ts`
- `tests/integration/frontend/designSystemCanonicalResponsiveWidthAudit.test.ts`
- `tests/integration/frontend/designSystemCanonicalThemeScopeAudit.test.ts`
- `tests/unit/webAppHierarchyBuilder/service.test.ts`
- `tests/integration/webAppHierarchyBuilder/flow.test.ts`
- family-specific visual specs under `tests/visual/designSystem/canonicals/`

## Residual Governance Work

- PRD-derived test-case traceability is now implemented by source and test
  evidence, but many executable test names predate the `TC-DESIGN-SYS-CANON-*`
  identifiers and should not be treated as one-to-one ID coverage.
- Family promotion remains family-specific. Several generated families are
  still `exploratory` or `signed-off` rather than `system-ready`.
- The current canonical render host is the hardened same-document model. A
  stronger isolated-document render boundary remains an explicit future
  architecture decision, not current implementation truth.
