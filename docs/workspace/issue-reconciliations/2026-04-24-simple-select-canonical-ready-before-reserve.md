# Simple Select Canonical Ready Before Reserve

## Summary

While applying the shared canonical overlay containment guard to the
`simple-select` and `drawer-select` generated render pages, the Simple Select
renderer exposed the same readiness sequencing gap previously found in the
date-picker and time-picker renderers.

Affected generated routes included:

- `/design-system/canonical-renderings/simple-select/SSR-002`
- `/design-system/canonical-renderings/simple-select/SSR-005`
- `/design-system/canonical-renderings/simple-select/SSR-006`

## Root Cause

The Simple Select canonical renderer marked the shell
`data-render-status="ready"` immediately after applying state, then scheduled
the owner-reserve calculation in a later animation frame. Open anchored
listboxes therefore could be observed as ready before the field reserve had
been synchronized.

## Why The Loop Missed It

The existing visual suite did check that open listboxes reserve field space and
stay inside the review frame, but the renderer's ready marker was not itself
coupled to reserve completion. The older containment check also lived as a
local low-level assertion rather than the shared canonical overlay contract.

Classification: shared-seam readiness blind spot with local-only containment
coverage.

## Reconciliation Changes

- `src/frontend/designSystem/assets/simpleSelectCanonical.mjs` now publishes
  ready only after layout has settled and `syncCanonicalOwnerReserve(...)` has
  completed.
- `tests/visual/designSystem/canonicals/forms/simpleSelectCanonical.spec.ts`
  now uses `expectCanonicalOverlayContainedInRenderSurface(...)` for open
  listbox containment against the host surface and render frame.
- `tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts`
  now uses the same helper across representative desktop, RTL, dark/magnified,
  and mobile drawer overlays.

## Coverage Lesson

Generated canonical render readiness must mean the reviewable overlay geometry
is settled, not merely that the shell is visible. Form-control overlay families
should share the same containment helper so new generated render pages inherit
the render-local overlay rule instead of re-creating one-off checks.

## Follow-Up Watch Items

- Keep future overlay families on the shared canonical overlay helper by
  default.
- If Drawer Select later gains owner-reserve logic, it should follow the same
  settle, reserve, ready sequence used by Simple Select, Date Picker, and Time
  Picker.
