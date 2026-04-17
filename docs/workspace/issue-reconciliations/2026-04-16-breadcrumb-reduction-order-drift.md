# Breadcrumb Reduction Order Drift

## Symptom

Wide sub-nav canonical states, especially RTL ones, dropped the collapsed
middle breadcrumb before removing `Page -1`. This made the row feel wrong under
pressure and caused misleading follow-on debugging, including the brief home
icon flicker seen while the renderer settled into the wrong reduction state.

## Root Cause

The approved breadcrumb contract said the reduction order should be:

1. shorten `Page -1` to its compact label when needed
2. hide `Page -1`
3. hide the collapsed middle segment
4. fall back to compact signpost mode

But the live `applyResponsiveBreadcrumbPriority()` implementation hid the
collapsed middle segment first and only removed `Page -1` afterward.

## Why The Loop Missed It

- The behavior lock and reference pack had the correct intended order, but the
  executable audit only checked that both hide calls existed, not that they
  occurred in the approved sequence.
- Canonical debugging focused first on width and render timing because those
  were also real issues, which masked the fact that the reduction policy itself
  had drifted away from the approved contract.

## Prevention Added

- The breadcrumb overflow logic now removes `Page -1` before hiding the
  collapsed middle segment, matching the approved breadcrumb behavior lock.
- The breadcrumb audit now checks the relative ordering of those hide calls so
  this exact drift is less likely to recur silently.

