# Design System Top Nav Preview Magnification Threshold Regression

## Supersession Note

Archived on 2026-05-27 after the magnification remeasurement lesson was
promoted into the active top-nav verification checklist, top-nav `TRP-*`
canonical visual suite, source audits, and root-admin shell parity evidence.

Use the active top-nav design-system artifacts as current authority. Keep the
component-inventory adoption/parity and shared-seam extraction caveats visible
there rather than in this historical issue record.

## Summary

- Date found: `2026-04-15`
- User-visible symptom:
  on `/design-system/components/top-nav`, selecting the long-label fixture and
  then increasing magnification to `+100%` did not cause the top-nav to hide
  buttons soon enough. The shell stayed in the wrong desktop state until some
  other control forced a re-measure.
- Affected surface:
  isolated top-nav preview route used for sign-off and future reference-pack
  capture

## Root Cause

The preview route updated UI scale through `applyMagnification(...)`, but the
top-nav overflow logic was not re-run afterward.

That meant the signed-off shell rules were recalculated when:

- width controls changed
- fixture controls changed
- window resize happened

but not when magnification changed directly.

Because magnification changes affect rendered text and control size, the
top-nav fit state became stale until another event happened to call
`updatePrimaryNavOverflow()`.

## Why The Loop Missed It

This escaped because of:

- **missing coverage**
- **wrong-layer coverage**

We had:

- source-level audits for the overflow logic
- source-level audits for magnification controls existing
- an isolated preview route for visual inspection

But we did not have an executable check asserting that magnification changes
must trigger the same re-measure path as width and fixture changes.

## Reconciliation Changes Added

- updated the magnification button handler in
  `src/frontend/designSystem/assets/app.mjs`
- after applying magnification, the preview now schedules:
  - `updatePrimaryNavOverflow()`
  - `applyTopNavPreviewOpenState(activeTopNavPreviewOpenState)`

This keeps the preview route honest when magnification changes alter rendered
fit.

## Coverage Lesson

For geometry-sensitive preview routes, every control that changes rendered
dimensions must trigger the same recomputation path.

It is not enough for a control to update global tokens or scale variables if
the governed shell depends on measured layout truth.

## Follow-up Watch Items

- when adding future preview controls that affect rendered geometry, route them
  through the same top-nav re-measure path
- during Playwright sign-off coverage, include a long-label plus magnification
  state so stale-fit regressions are caught automatically
