# 2026-04-18 Drawer Select Canonical Frame Overlay Gap

## Supersession Note

Archived on 2026-05-27 after the QA and issue-reconciliation freshness pass.
The canonical-frame containment lesson is now represented by current
drawer-select verification artifacts and visual tests. Treat this record as
historical escaped defect evidence, not current operating authority.

## Summary

The dedicated `Drawer Select` canonical renderer let the open desktop drawer
escape the preview frame and overlay the surrounding canonical page header.

## User-Visible Symptom

- on the dedicated child render surface, the open drawer could sit over the
  canonical page chrome instead of staying inside the preview surface
- the seam looked anchored to the browser viewport rather than to the child
  review frame
- the parent framing around the seam stopped being readable once the drawer
  opened

## Root Cause

The renderer was still inheriting the global drawer-select panel posture:

- `.form-drawer-select-panel` uses `position: fixed` in the shared component
  styles
- the dedicated canonical surface had not overridden that for desktop review
- mobile preview mode already constrained the panel locally, but desktop did
  not

That meant the canonical renderer was honest about the shared component style,
but dishonest about the intended review surface because the child seam escaped
its own preview frame.

## Why The Existing Loop Missed It

The current executable coverage verified state, theme, magnification, mobile
overlay posture, and launcher truth, but it did not verify desktop drawer
geometry against the canonical preview frame.

So the suite proved that the drawer opened, but not that it stayed contained
inside the renderer it was supposed to be demonstrating.

## Classification

- missing regression scenario
- canonical renderer geometry gap
- wrong-seam containment proof

## Reconciliation Changes

- constrained desktop drawer panels to the dedicated preview shell in
  `src/frontend/designSystem/assets/styles.css`
- preserved the existing mobile-specific overlay posture while making the
  desktop canonical drawer local to the preview frame
- added a geometry regression test to
  `tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts` that asserts the
  open desktop drawer stays inside `#drawer-select-preview-frame`

## Prevention Lesson

For dedicated canonical renderers, it is not enough to verify that an overlay
opens. The suite should also verify that the overlay stays inside the intended
review surface when that renderer is supposed to preserve surrounding parent
framing.

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts`

## Resolution Status

- candidate fix awaiting user confirmation
