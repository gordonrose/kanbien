# 2026-04-22 Time Picker Canonical Surface Scope Gap

## Summary

The dedicated `Time Picker` canonical renderer let `TPR-009` apply RTL and
magnification to the whole page chrome instead of only to the rendered specimen
area.

## User-Visible Symptom

- the top navigation, breadcrumb row, search shell, and surrounding page chrome
  were magnified during `TPR-009`
- the route looked like the whole page had entered the specimen state
  instead of just the time-picker render surface
- RTL also leaked onto the page-level shell instead of staying local to the
  dedicated review area

## Root Cause

The canonical renderer still wrote specimen state to `document.documentElement`
for generated routes:

- `dir`
- `data-theme`
- `--ui-scale`

That made the dedicated canonical route treat the full page as the specimen.
Other newer canonical renderers already scope those stress states to the local
render surface instead.

## Why The Existing Loop Missed It

The suite checked the wrong thing:

- it asserted `html[dir]` for the RTL routes
- it did not assert that page chrome remained unscaled
- it did not distinguish between document-wide stress state and
  surface-local stress state

So the executable proof accidentally blessed the leak.

## Classification

- stale expectation in executable coverage
- wrong-scope canonical renderer state application
- missing same-surface stress-state proof

## Reconciliation Changes

- scoped generated-route RTL, theme, and magnification to the dedicated
  time-picker render surface instead of the full document
- updated the canonical test to assert that:
  - `document.documentElement` stays unscaled
  - the preview shell carries the zoom
  - the preview shell carries the RTL direction
  - page chrome such as the search input keeps its normal font size

## Prevention Lesson

For dedicated canonical renderers, stress states like direction, theme, and
magnification must be classified explicitly as either:

- page-level review state
- surface-local specimen state

If the intent is "just the rendered area," executable proof must assert that
the surrounding shell remains unchanged.

## Verification

- pending local browser verification after implementation

## Resolution Status

- candidate fix awaiting user confirmation
