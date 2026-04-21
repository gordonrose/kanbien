# List Page Detail Drawer CSP Regression

## Summary

The design-system `List Page` route at `/design-system/templates/list-page`
rendered the split detail drawer markup, but clicking a list item did not open
the drawer in the browser.

## Root Cause

The list drawer behavior was implemented with an inline `<script type="module">`
block inside `src/frontend/designSystem/templates/list-page/index.html`.

The frontend shell is served under a Content Security Policy that enforces
`script-src 'self'`, so the browser blocked the inline module completely. That
meant no click handlers were ever attached to the list items or the close
button, leaving the drawer permanently hidden at runtime.

## Why The Loop Missed It

- The first fix was evaluated from source shape rather than rendered browser
  truth.
- There was no existing visual regression test for the Pages templates route or
  for the interactive list-page drawer path.
- The issue specifically depended on CSP-enforced runtime behavior, which a
  source-only review could not catch honestly.

## Reconciliation Changes Added

- Moved the list-page drawer behavior into
  `src/frontend/designSystem/assets/listPage.mjs` so it loads through an
  external same-origin asset allowed by the active CSP.
- Updated `src/frontend/designSystem/templates/list-page/index.html` to load the
  new external module instead of relying on inline script execution.
- Added `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts` to verify:
  - the drawer starts closed
  - clicking a list item opens the split drawer
  - clicking the drawer close button hides it again

## Coverage Lesson

Interactive `/design-system` page-template routes need at least one rendered
browser check for their real open/close path when the behavior depends on
runtime JavaScript. Markup presence alone is not enough evidence when CSP can
prevent inline handlers from ever running.

## Follow-Up Watch Items

- The new list-page spec protects the open/close interaction, but the broader
  Pages template family still has limited governed visual coverage compared to
  the top-nav, sub-nav, and context-nav families.
