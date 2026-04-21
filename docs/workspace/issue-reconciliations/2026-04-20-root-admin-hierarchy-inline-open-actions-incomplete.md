## Summary

The root-admin `web-app-hierarchy` page still showed a blank inline "open"
action on localhost even after the earlier icon reconciliation. The button was
mounting, but the actual eye glyph could still disappear in the live browser,
which made the surface look unfinished and kept sending the loop back around.

## Root Cause

Two separate gaps were involved, and the second one was the live-escape cause:

- The shared tree seam already exposed the eye action across the root-admin
  consumer through `onOpenNode`, but the root-admin adapter originally missed a
  durable external-link target for root-family rows. That created an honest
  coverage gap across row types.
- After that broader action wiring was corrected, the live localhost page still
  had a CSS sizing bug: `.hierarchy-tree-inline-action-icon` could collapse to
  zero inline width inside the action button. The SVG stayed in the DOM and the
  button stayed clickable, but the eye glyph rendered at effectively no width,
  which looked like an empty square.

## Why The Loop Missed It

- The earlier root-admin visual regression asserted only one page row.
- That coverage was realistic for one page state, but too narrow for the full
  row taxonomy visible in the POC.
- The icon-focused assertions were also checking SVG style semantics
  (fill/stroke) instead of rendered geometry. That meant the suite could still
  pass when the SVG existed in the button but its width collapsed to `0px` on
  the actual root-admin surface.

## Reconciliation Changes

- Added explicit `inline-size`, `block-size`, `width`, `height`, and fixed
  flex-basis on `.hierarchy-tree-inline-action-icon` so the SVG cannot collapse
  inside the inline action button on the real root-admin page.
- Kept the broader root-family/module/page row coverage in the root-admin
  hierarchy Playwright suite.
- Replaced the style-only eye assertions in both the design-system and
  root-admin visual suites with rendered-geometry checks that require the eye
  SVG to have non-zero width and height.

## Coverage Lesson

When a governed hierarchy mixes multiple row types, validating a single page
row is not enough. And when the user-visible failure is "the icon looks
missing," existence checks are not enough either. The prevention layer needs to
sample each meaningful row class and assert rendered icon geometry, not only
DOM presence.

## Watch Items

- Module rows still do not expose a second durable external-link action because
  there is no approved module route contract yet.
- User confirmation is still needed that the live localhost surface now matches
  expectations in the browser after the icon sizing fix.
