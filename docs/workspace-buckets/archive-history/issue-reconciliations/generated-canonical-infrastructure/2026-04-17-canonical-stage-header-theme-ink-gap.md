# 2026-04-17 Canonical Stage Header Theme Ink Gap

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/generated-canonical-infrastructure/`
after the canonical stage heading ink lesson was found in active shared
canonical-template and theme audit coverage.

## Summary

- User-visible symptom:
  on the new `ListRecordCard` dark-theme canonical, the `Canonical Surface`
  stage heading did not switch to the correct dark-theme ink color.
- Affected surface:
  shared canonical page template styling under `/design-system/components/*`
  render routes.

## Root Cause

- The shared heading selector for canonical render sections applied spacing and
  letter-spacing only:
  `.top-nav-preview-intro h1`, `.top-nav-preview-controls h2`,
  `.top-nav-preview-stage-section h2`, `.top-nav-preview-body-card h3`
- That rule never assigned `color: var(--ink)`, so headings could fall back to
  a non-themed default instead of the local canonical surface ink token.

## Why The Loop Missed It

- Escape classification:
  missing regression scenario.
- Existing child canonical coverage proved:
  - route rendering
  - width-class behavior
  - rtl scoping
  - magnification scoping
  - theme scoping ownership
- The suite did not explicitly assert that a shared canonical heading actually
  consumed the local theme ink token.

## Reconciliation Changes

- Added `color: var(--ink)` to the shared canonical heading selector in
  `src/frontend/designSystem/assets/styles.css`.
- Added a focused Playwright regression in
  `tests/visual/designSystem/canonicals/data-display/listRecordCard.spec.ts` that checks the dark-theme
  stage heading resolves to the local canonical layout `--ink` token.

## Coverage Lesson

- Theme scoping checks are not enough by themselves.
- Shared canonical-template tests also need one or two concrete assertions that
  important text surfaces actually consume themed tokens after scoping is
  applied.

## Follow-Up Watch Items

- Watch other shared canonical headings and labels for similar “scoped theme is
  present, but the node still uses fallback color” failures.
- If more shared canonical-template theme issues appear, promote this from a
  route-local regression into a dedicated shared canonical-template verification
  file.
