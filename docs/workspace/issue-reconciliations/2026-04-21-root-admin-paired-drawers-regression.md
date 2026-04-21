## Summary

Opening display settings while the root-admin hierarchy drawer was open closed the hierarchy drawer instead of preserving the signed-off side-by-side drawer posture from the design system.

## Root Cause

`rootAdminShell` still had a local document-click rule that closed display settings whenever the click target was outside the display-settings launcher or drawer. Hierarchy-drawer interactions were not treated as legitimate keep-open regions, so trying to open the second drawer caused the first governed drawer to be treated like an outside click victim.

## Why The Loop Missed It

The hierarchy suite covered the hierarchy drawer and the display-settings drawer separately, but it did not include a paired-drawer regression that proved the real signed-off contract: both drawers can remain open side by side on desktop.

## Reconciliation Changes Added

- extended the shared page-shell chrome controller with an explicit keep-open region seam for display-settings coexistence
- wired root-admin hierarchy drawer elements into that shared keep-open seam
- added a browser regression that requires the hierarchy drawer and display-settings drawer to stay open together and dock side by side

## Coverage Lesson

When a signed-off shell pattern explicitly allows coexisting surfaces, the app harness must assert coexistence directly rather than only testing each surface in isolation.

## Follow-Up Watch Items

- if additional governed side panels are introduced, route their coexistence rules through the same shared keep-open seam instead of adding more app-local click exceptions
