# Drawer Form Canonical Stepper Missing

## Summary

The generated drawer-form canonical render page showed the drawer-form
specimen but did not expose the expected canonical navigation controls for
moving between `DF-*` reference states.

## Root Cause

The drawer-form component render page reused the canonical intro metadata
shape but omitted the `canonical-stepper` block used by adjacent generated
canonical render surfaces. The drawer-form controller also had no matching
stepper update logic.

## Why It Escaped

The first drawer-form coverage verified that individual generated states
rendered and that launcher links pointed at generated render routes. It did
not assert the shared generated render-page navigation contract: current ref,
previous link, and next link.

Gap classification:

- missing regression scenario
- shared generated-canonical render-page seam blind spot

## Reconciliation Changes

- Added the drawer-form canonical stepper markup to the render page.
- Added controller logic to resolve current, previous, and next `DF-*` routes
  for generated canonical-rendering URLs and component URL fallbacks.
- Extended the drawer-form visual test to assert the visible current state and
  the first next-link route on `DF-001`.

## Coverage Lesson

Generated canonical render pages need checks for their review navigation chrome
as well as their specimen state. A state can render correctly while still being
awkward to review if the canonical stepper is missing.

## Follow-Up Watch Items

- Keep drawer-form aligned with the same stepper contract used by other
  generated component render surfaces.
- If a shared helper for canonical steppers is extracted later, migrate
  drawer-form into that helper instead of keeping family-local logic.
