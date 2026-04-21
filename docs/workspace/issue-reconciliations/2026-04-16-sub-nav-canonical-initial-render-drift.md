# Sub-Nav Canonical Initial Render Drift

## Symptom

Opening a deterministic sub-nav canonical URL could render a reduced breadcrumb
trail even when the URL requested the approved `full` state. Manually changing a
preview control and switching back caused the full breadcrumb to appear, which
made the route unreliable as a future Playwright evidence surface.

## Root Cause

The preview boot sequence applied responsive breadcrumb reduction immediately
inside `applySubNavPreviewState()`, before the preview frame had fully settled
to the URL-driven width and post-theme/post-magnification layout. That meant the
first width measurement could under-report available space and incorrectly force
the breadcrumb down its reduction path.

## Why The Loop Missed It

- Existing checks verified that the canonical route, launcher links, and
  responsive reduction logic existed, but they did not validate that the
  initial URL load and the post-interaction state matched.
- Manual iteration focused on visual fit after interacting with the controls,
  which masked the boot-sequence timing defect.

## Prevention Added

- The sub-nav preview now performs its responsive breadcrumb decision in a
  deferred post-layout render pass, so canonical URL loads measure the settled
  preview frame instead of the pre-settle geometry.
- Focused audit coverage was refreshed so the sub-nav canonical surface remains
  tied to the governed preview implementation while this render path is
  stabilized.

