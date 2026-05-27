# List Detail Split Layout Canonical Ready Before Fit

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into generated
> list-detail-split-layout render readiness checks, visual tests, verification
> checklist, and active design-system loop expectations. Keep future authority
> in those active design-system artifacts.

## Summary

While hardening the generated `ListDetailSplitLayout` canonical render family,
the dedicated generated render surface exposed a readiness and route-chain gap.

Affected generated routes included:

- `/design-system/canonical-renderings/list-detail-split-layout/LDSL-002`
- `/design-system/canonical-renderings/list-detail-split-layout/LDSL-004`
- `/design-system/canonical-renderings/list-detail-split-layout/LDSL-005`
- `/design-system/canonical-renderings/list-detail-split-layout/LDSL-010`

## Root Cause

The renderer published `data-render-status="ready"` immediately after applying
state, then scheduled overflow-tooltip and canonical fit-frame work in a later
animation frame. Reviewers and tests could therefore observe a ready canonical
before the scaled split/overlay geometry had settled.

The dedicated render page also still contained legacy `/design-system/canonicals`
launcher links in its breadcrumb, context nav, and intro copy, even though the
generated family is now governed through `/design-system/canonical-renderings`.

## Why The Loop Missed It

The existing visual suite covered open, closed, mobile, RTL, magnification,
theme, and several previous layout regressions. It did not require ready-state
to mean settled browser geometry, and it used local route checks instead of the
shared route-surface truth helper.

The mobile and squashed fallback overlay checks also asserted local state and
z-index values but did not use the shared canonical overlay containment helper
that now protects generated render pages from panel escape outside the review
frame.

Classification: shared-seam readiness blind spot plus local-only containment
coverage for a generated canonical family with higher split/overlay risk.

## Reconciliation Changes

- `src/frontend/designSystem/assets/listDetailSplitLayoutCanonical.mjs` now
  resets to `settling` during state application and publishes ready only after
  settled frame boundaries and the fit-frame calculation have run.
- `src/frontend/designSystem/components/list-detail-split-layout.html` now
  points dedicated render-page chrome back to the generated canonical launcher.
- `tests/visual/designSystem/canonicals/data-display/listDetailSplitLayout.spec.ts`
  now uses `expectRouteSurfaceTruth(...)` for generated render routes.
- The same focused suite now asserts launcher cards route to generated render
  pages, proves the normalized top-nav contract on the dedicated render page,
  and uses `expectCanonicalOverlayContainedInRenderSurface(...)` for mobile and
  squashed fallback overlays.

## Coverage Lesson

Generated canonical readiness must mean the browser has reached reviewable
geometry, not just that canonical state was applied. Split and overlay families
should use the shared route-surface and containment helpers so route, shell,
ready-state, frame, and overlay truth move together.

## Follow-Up Watch Items

- Keep future generated canonical split/overlay families on the shared
  route-surface and containment helpers by default.
- Treat any canonical render family that performs deferred measurement,
  scaling, owner reserve, focus recovery, or compaction as not ready until the
  deferred geometry pass has finished.
