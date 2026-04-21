# Design System Canonicals Foundation Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-04-21-design-system-canonicals-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-21-design-system-canonicals-foundation-capability-matrix-first-draft.csv)

## Upstream Truth For This Matrix

This matrix starts from the settled decision that persistence-backed canonical
governance should launch under a new additive public route family instead of
replacing the current `/design-system/canonicals/*` surfaces on day one.

Source artifacts and repo truth:

- `AGENTS.md`
- [change-artifact-requirements.md](/home/gordon/kanbien/docs/standards/change-artifact-requirements.md)
- [system-overview.md](/home/gordon/kanbien/docs/architecture/system-overview.md)
- [priniciples.md](/home/gordon/kanbien/docs/architecture/priniciples.md)
- current implemented `design-system` frontend routes under
  `src/frontend/designSystem/`
- current canonical route tests under
  [tests/integration/designSystem/route.test.ts](/home/gordon/kanbien/tests/integration/designSystem/route.test.ts:1)
- current launcher and canonical reference truth in route files, scripts, and
  manifests under `src/frontend/designSystem/` and `tests/visual/designSystem/`
- existing reference packs such as
  [launcher-template-reference-pack.md](/home/gordon/kanbien/docs/workspace/design-system/reference-packs/launcher-template-reference-pack.md)
  and
  [page-shell-banner-reference-pack.md](/home/gordon/kanbien/docs/workspace/design-system/reference-packs/page-shell-banner-reference-pack.md)
- current `webAppHierarchyBuilder` and `webAppPageSettings` foundations under
  `src/features/`

## Consolidated Assumptions

- a new feature named `designSystemCanonicals` should own durable canonical
  governance truth rather than extending `webAppHierarchyBuilder` or leaving
  canonical truth spread across static HTML and frontend scripts
- the new public route family is:
  `/design-system/canonical-renderings/*`
- the new route family is public from day one
- rollout is iterative and family-by-family rather than a single all-family
  cutover
- the new public generated family may become the human signoff surface once a
  family or group has passed parity review
- the existing `/design-system/canonicals/*` family remains available during
  parity and migration work
- generated canonical render routes should be ref-specific deterministic paths,
  not mutable query-param compositions
- exploration remains on the relevant page template or exploration surface; if
  a new deterministic state is needed, it should become a new signed-off
  canonical reference instead of an ad hoc query-param variant
- canonical launcher pages intentionally reuse the existing shared `launcher`
  template
- canonical render pages require a distinct `canonical-rendering` template key
- `webAppPageSettings` should eventually carry the precise
  `canonical-rendering` template intent for generated render pages while
  leaving canonical launcher pages on `launcher`
- the design-system page tree should be updated in the same overall loop so the
  new public route family becomes durable topology rather than a hidden
  side-effect
- current executable route behavior is the main seed source of truth; source-
  independent docs such as reference packs act as the primary tie-breaker when
  route truth and docs drift

## Recommended First Feature Boundary

The first foundation slice should add:

- a new `designSystemCanonicals` feature for:
  - canonical-family governance
  - canonical-reference governance
  - public launcher projection
  - public deterministic render projection
- a narrow `webAppHierarchyBuilder` extension to sync live generated
  canonical-launcher and canonical-rendering routes into the durable
  `design-system` page tree
- an additive `webAppPageSettings` extension so canonical render pages can be
  represented precisely as `canonical-rendering`

The first slice should not absorb:

- replacement or retirement of the legacy `/canonicals` route family
- a broad new root-admin governance UI before the backend seams exist
- exploration-state storage on canonical-rendering routes
- frontend-only truth for family ordering or ref ordering
- hidden topology mutation by scanning frontend files directly

## Capability Direction

The first slice should cover these capabilities:

- govern canonical families durably
- govern canonical references durably
- serve generated public canonical launchers from persistence
- serve generated public canonical renderings from persistence
- sync the design-system page tree from live canonical-governance truth
- support `canonical-rendering` in durable page-template settings

Exact new protected capability keys recommended in this matrix:

- `design-system-canonicals.family.manage`
- `design-system-canonicals.reference.manage`
- `web-app-hierarchy.sync-design-system-canonical-renderings`

Existing protected capability keys reused or extended:

- `web-app-page-settings.read-options`
- `web-app-page-settings.update`

Public route posture:

- generated public launcher and rendering reads are public route capabilities,
  not root-granted capabilities
- public reads must still be lifecycle-gated so only approved live families and
  refs are visible

## Parity And Verification Posture

The first slice should assume:

- the existing Playwright route and visual expectations should be reusable
  against the new generated route family where practical
- parity evidence should be able to show that old canonical checks still pass
  when pointed at the new generated surfaces
- signoff may move to the new generated route family family-by-family rather
  than waiting for all legacy routes to be replaced

## Main Benefit

This loop should let the platform answer not only:

- which canonical launcher or canonical render exists today

but also:

- which family and ref definitions are the durable source of truth
- which generated public routes are live and signoff-eligible
- which canonical routes now belong in the design-system page tree
- which page-template intent applies to generated canonical render pages
- how to prove parity against the legacy route family without forcing an
  immediate destructive route replacement
