# 2026-04-22 Time Picker Mobile Canonical Frame Overlay Gap

## Summary

The dedicated `Time Picker` canonical renderer let the `TPR-006` mobile
standalone overlay escape the review frame and cover the whole canonical page
instead of staying inside the rendered specimen area.

## User-Visible Symptom

- on `TPR-006`, the open mobile time-picker panel covered the full page
- the canonical intro, surrounding framing, and review chrome stopped being
  readable
- the seam looked anchored to the browser viewport rather than to the dedicated
  canonical render area

## Root Cause

The canonical renderer inherited the shared mobile picker posture too
literally:

- `.form-time-menu:not(.hidden)` switches to `position: fixed` with `inset: 0`
  in mobile mode
- that is appropriate for a real full-page mobile flow
- but on the dedicated canonical render surface it made the panel escape the
  review frame and attach to the viewport instead

## Why The Existing Loop Missed It

The existing proof asserted the same CSS posture that caused the problem:

- the suite checked that the mobile panel was `position: fixed`
- it checked `top: 0`
- it did not check whether the panel stayed contained within
  `#time-picker-preview-frame`

So the test encoded the escaped bug as success instead of guarding against it.

## Classification

- missing regression scenario
- canonical renderer geometry gap
- stale expectation in executable coverage

## Reconciliation Changes

- constrained the mobile time-picker overlay to the dedicated canonical review
  frame only, without changing the broader component mobile contract
- added a geometry regression that asserts the visible mobile panel stays
  inside `#time-picker-preview-frame` for `TPR-006` and `TPR-007`
- replaced the misleading fixed-position assertion with a real frame
  containment proof

## Prevention Lesson

For dedicated canonical renderers, mobile overlays should be tested as
human-visible geometry, not only as CSS posture. A test that only checks
`position: fixed` can accidentally bless an overlay that escapes the review
surface.

## Verification

- pending local browser verification after implementation

## Resolution Status

- candidate fix awaiting user confirmation
