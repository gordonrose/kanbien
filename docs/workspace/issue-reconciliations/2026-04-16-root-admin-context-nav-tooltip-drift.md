# Root Admin Context-Nav Tooltip Drift

## Symptom

The adopted `context-nav` in `/root-admin` showed no visible desktop hover
tooltips even though the rail items carried `data-tooltip` labels.

## Root Cause

The first consumer copied the older rail-local pseudo-element tooltip styling
instead of the signed-off design-system shared floating tooltip layer.

That caused two problems:

- the tooltip lived inside the rail scroller rather than in a top-level layer
- the rail scroller clipped horizontal overflow, so the tooltip looked absent

## Why The Loop Missed It

The first root-admin consumer checks proved routing, breadcrumb truth, mobile
conversion, and RTL placement, but they did not include a real hover runtime
assertion for the adopted rail.

So the shell looked structurally correct while one interactive state had
quietly drifted away from the governed design-system implementation.

## What Changed

- replaced the root-admin pseudo-tooltip treatment with the shared floating
  tooltip layer appended to `document.body`
- added hover positioning logic in the root-admin shell app so desktop
  `context-nav` items now use the same tooltip seam as the design-system
  family
- added a Playwright regression that hovers a real rail item and proves the
  shared tooltip becomes visible beside it

## Prevention Layer

- `tests/visual/rootAdminShell/rootAdminShellSubNav.spec.ts` now includes a
  desktop hover tooltip assertion for the adopted `context-nav`
- future first-consumer parity work should treat hover/runtime states as
  required evidence, not as optional follow-up polish
