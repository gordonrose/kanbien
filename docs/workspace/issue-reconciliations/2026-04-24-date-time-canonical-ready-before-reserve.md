# Date And Time Canonical Ready Before Reserve

## Summary

While extending the shared canonical overlay containment guard from `icon-grid`
to the next overlay-heavy families, the date-picker and time-picker canonical
render surfaces exposed a readiness race.

Affected generated routes included:

- `/design-system/canonical-renderings/date-picker/DTPR-002`
- `/design-system/canonical-renderings/date-picker/DTPR-004`
- `/design-system/canonical-renderings/date-picker/DTPR-010`
- `/design-system/canonical-renderings/time-picker/TPR-009`

## Root Cause

The canonical renderers published `data-render-status="ready"` before the
shared owner-reserve pass had completed. The reserve calculation runs after
layout settles so open anchored panels can reserve enough owner field space.

Date Picker set the ready status before its final animation-frame wait and
reserve sync. Time Picker scheduled reserve sync in nested animation frames
while exposing the shell as ready immediately.

## Why The Loop Missed It

The existing visual specs checked that open panels were present and that some
owner fields eventually had reserve values, but Time Picker did not wait for
the explicit ready status and the ready contract itself was not tied to
reserve completion.

Classification: shared-seam readiness blind spot. The rendered state was
usually correct after settling, but the canonical harness allowed reviewers and
tests to observe a premature ready state.

## Reconciliation Changes

- `src/frontend/designSystem/assets/datePickerCanonical.mjs` now publishes
  `data-render-status="ready"` only after the owner-reserve pass has completed.
- `src/frontend/designSystem/assets/timePickerCanonical.mjs` now uses the same
  settle-then-reserve-then-ready sequence.
- `tests/visual/designSystem/canonicals/forms/timePickerCanonical.spec.ts` now
  waits for `#time-picker-preview-shell[data-render-status="ready"]` before
  asserting render truth.
- `tests/visual/designSystem/canonicals/forms/datePickerCanonical.spec.ts` and
  `tests/visual/designSystem/canonicals/forms/timePickerCanonical.spec.ts` now
  use the shared
  `expectCanonicalOverlayContainedInRenderSurface(...)` helper for overlay and
  panel containment assertions.

## Coverage Lesson

Canonical render readiness must mean the reviewable geometry is settled, not
only that the shell exists and the panel is visible. Overlay families that rely
on owner-reserve calculations should publish ready only after the shared
reserve sync has run.

Future overlay-heavy render pages should use the shared overlay containment
guard and wait for the family shell's `data-render-status="ready"` marker.

## Follow-Up Watch Items

- Apply the same helper pattern to `simple-select` and `drawer-select` if their
  generated render pages expose child overlays or panels.
- Keep readiness checks aligned with any future shared render-page template so
  new generated families inherit the settled-geometry contract by default.
