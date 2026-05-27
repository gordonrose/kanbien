# Design System Top Nav Layering Regression

## Supersession Note

Archived on 2026-05-27 after the top-nav layering lesson was promoted into the
active top-nav verification checklist, top-nav `TRP-*` canonical visual suite,
`tests/audit/designSystem/layering.test.ts`, and root-admin shell parity
evidence.

Use the active top-nav design-system artifacts as current authority. Keep the
component-inventory adoption/parity and shared-seam extraction caveats visible
there rather than in this historical issue record.

## Summary

- Date found: `2026-04-15`
- User-visible symptom:
  the desktop profile dropdown opened underneath the breadcrumb/search row
  instead of above the page content below the top nav
- Affected surface:
  public `/design-system` top navigation layering

## Root Cause

The dropdown itself had a high `z-index`, but its parent `.top-nav` stacking
context sat below `.sub-nav`.

Because stacking contexts are bounded by their parents, the profile menu could
not rise above the secondary row even with a larger local `z-index`.

## Why The Feature Loop Missed It

- the previous layering audit only asserted that both sections had a `z-index`
  and that the menu selectors existed
- it did not assert the actual ordering contract between `.top-nav` and
  `.sub-nav`

This escaped because of:

- **missing coverage**
- **wrong-layer coverage**

## Reconciliation Changes Added

- raised `.top-nav` above `.sub-nav` so top-nav overlays can appear above the
  row beneath them:
  [src/frontend/designSystem/assets/styles.css](/home/gordon/kanbien/src/frontend/designSystem/assets/styles.css:1)
- tightened the layering audit to assert the intended stacking order:
  [tests/audit/designSystem/layering.test.ts](/home/gordon/kanbien/tests/audit/designSystem/layering.test.ts:1)

## Coverage Lesson

For overlay regressions, assert the parent stacking-context order, not only the
dropdown’s own `z-index`.
