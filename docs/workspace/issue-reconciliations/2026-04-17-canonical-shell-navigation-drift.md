# 2026-04-17 Canonical Shell Navigation Drift

## Summary

- User-visible symptom:
  canonical launcher and render pages were not using a consistent design-system
  shell path. Some still marked `Components` as the active top-nav section,
  some still used the stale `Templates` label instead of the live `Pages`
  label, and some breadcrumbs did not lead back through
  `Home / Patterns / Canonicals`.
- Affected surface:
  shared `/design-system` canonical launcher and canonical render pages.

## Root Cause

- Canonical shell pages were added over time from different source templates.
- Older canonical pages inherited a `Components`-oriented shell posture, while
  newer canonical pages were already moving toward a `Patterns`-oriented
  review posture.
- Breadcrumbs on several family launchers also reused an older structure that
  linked `Patterns` twice instead of stepping back through `Canonicals`.
- A second seam remained after the first fix:
  some canonical render pages were still carrying stale embedded preview nav
  content, and the shared breadcrumb runtime could still collapse or iconize
  breadcrumb segments on review surfaces that were supposed to show the full
  visible path.

## Why The Loop Missed It

- Escape classification:
  missing shared-template regression.
- Existing tests focused on:
  - family-specific render truth
  - canonical state behavior
  - local theme, rtl, and magnification scoping
- The suite did not include a shared canonical-shell navigation assertion that
  compared multiple launcher and render pages against the same expected
  top-nav and breadcrumb path.

## Reconciliation Changes

- Normalized canonical shell top-nav state so canonical launcher and render
  pages now keep `Patterns` active instead of drifting back to `Components`.
- Normalized the shell nav label to the current design-system wording:
  `Pages` at `/design-system/templates`.
- Normalized breadcrumbs so canonical pages lead back through
  `Home / Patterns / Canonicals`, with family pages keeping the current family
  as the terminal crumb.
- Updated embedded preview nav and breadcrumb content on the affected render
  pages so the preview surface also reflects the current design-system path.
- Added a canonical-specific runtime carve-out for the `BCR-001` full-trail
  sub-nav render so the breadcrumb no longer collapses or converts `Home` into
  icon-only posture during canonical review.
- Moved canonical shell ownership into shared runtime in
  `src/frontend/designSystem/assets/app.mjs` so canonical launcher and render
  pages now normalize the outer shell path through one central pre-binding
  seam instead of relying on page-by-page shell forks.
- Added a shared Playwright regression in
  `tests/visual/designSystem/canonicalShell.spec.ts` that checks both launcher
  and render routes against the expected canonical-shell navigation path,
  including current `Pages` labeling and full preview breadcrumb trails on the
  affected render surfaces.

## Coverage Lesson

- Family-specific canonical tests are not enough to protect shared launcher and
  render shell truth.
- Canonical-template navigation needs at least one cross-family regression that
  treats both the outer shell and any embedded render-shell examples as
  governed surfaces.
- When shell truth is corrected centrally, downstream family screenshots may
  start failing honestly because they were baselined against stale shell chrome.
  That evidence should be refreshed deliberately rather than treated as a
  reason to reintroduce local shell drift.

## Follow-Up Watch Items

- Watch for future canonical families being created from stale shell files that
  reintroduce `Components`-oriented top-nav posture.
- If more canonical-shell drift appears, consider extracting the launcher and
  render shell wrappers into shared partials or runtime-driven generators.
