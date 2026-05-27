> Archived on 2026-05-27 during the form-control canonical cleanup. The
> prevention lesson is now promoted into date-picker owner-reserve behavior,
> canonical overlay-containment guards, verification artifacts, and visual
> tests.

## Issue Summary

`date-picker` canonical renderings with anchored desktop panels were cutting off or distorting the specimen because the canonical host did not reserve vertical space for absolutely positioned open panels.

Affected visible examples included:

- `DTPR-002`
- `DTPR-010`

## Root Cause

The date-picker specimen uses anchored absolute panels for desktop open states. The canonical render lane was sizing from normal-flow content only, so the open panel was not contributing to the owning field height.

An attempted generic frame-accommodation helper then overcorrected at the wrong layer by resizing the whole canonical frame from escaping panel geometry. That distorted closed and mobile states and created large empty regions or shrunken specimens.

The right owning seam is the `date-picker` canonical family itself:

- keep the anchored desktop panel anchored to its trigger
- reserve additional block space on the owning `.form-field`
- leave mobile overlay states on their existing contained overlay contract

## Why The Loop Missed It

The existing tests proved route truth, launcher truth, theme scope, and overlay containment, but they did not assert the desktop anchored-panel geometry contract.

That let two different failures escape:

- the open panel could be clipped because the field reserved no space
- a later frame-level accommodation could "fix" clipping while still pulling the panel far away from its trigger

## Prevention Added

- `datePickerCanonical.mjs` now computes a desktop-only `--canonical-field-reserve` on the owning `.form-field` for visible anchored date/time panels
- the reserve is explicitly cleared for mobile overlay and closed states
- `datePickerCanonical.spec.ts` now checks:
  - `DTPR-002` and `DTPR-010` keep the anchored panel directly below the trigger
  - those desktop states do reserve vertical space on the owning field
  - `DTPR-008` and `DTPR-009` do not inherit the desktop reserve contract

## Architectural-First Decision

`shared-contract fix required`

This bug class belongs to the `date-picker` canonical family contract, not to a repo-wide generic frame-accommodation helper. The sustainable fix is a family-owned host reserve rule for anchored desktop panels, with family-owned browser checks that distinguish desktop anchored states from mobile overlay states.
