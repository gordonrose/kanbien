# 2026-04-18 Simple Select RTL Logical Alignment Gap

## Summary

The dedicated `Simple Select` RTL canonical state correctly flipped the local
surface to `dir="rtl"`, but the trigger label and option list still aligned as
LTR. The result was an RTL state whose text remained pinned to the left instead
of honoring the mirrored reading direction.

## Root Cause

The canonical controller in
`src/frontend/designSystem/assets/simpleSelectCanonical.mjs` already applied
`dir="rtl"` to the local preview shell. The failure was lower in the shared
form-select styling: `src/frontend/designSystem/assets/styles.css` hard-coded
`text-align: left` for the select trigger and option surfaces.

Because those rules were physical rather than logical, the browser preserved
left alignment even when the component subtree was in RTL.

## Why The Loop Missed It

The existing `SSR-005` executable proof checked that the local canonical surface
received the RTL direction scope, but it did not verify that direction-sensitive
presentation inside the seam actually mirrored.

So the suite proved:

- the canonical URL set `dir=rtl`
- the preview shell carried `dir="rtl"`

but it did not prove:

- the trigger and option text switched to logical start alignment under RTL

## Reconciliation Changes Added

- replaced physical `text-align: left` with logical `text-align: start` on the
  shared `form-select` trigger and option styles
- applied the same logical alignment correction to the related
  `form-drawer-select` trigger, selected-chip, and option surfaces so the same
  RTL bias does not remain in the adjacent heavier seam
- extended `tests/visual/designSystem/canonicals/forms/simpleSelectCanonical.spec.ts` so
  `SSR-005` now asserts the computed text alignment for the trigger and first
  option under RTL

## Coverage Lesson

Direction-scope checks are not enough on their own. When a governed RTL state is
part of the canonical set, at least one executable proof needs to assert a
mirrored presentation detail inside the seam, not only that the container got a
`dir` attribute.

## Follow-Up Watch Items

- other form-template child seams that inherit shared field styling should be
  reviewed for remaining physical left/right CSS where logical start/end is the
  actual contract
