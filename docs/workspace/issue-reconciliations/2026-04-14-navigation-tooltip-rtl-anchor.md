# Navigation Tooltip RTL Anchor Regression

## Summary

- Date found: `2026-04-14`
- User-visible symptom:
  navigation-rail tooltips in the root admin shell opened on the wrong side in
  RTL mode
- Affected surface:
  shared navigation-rail tooltip primitive used by the root admin shell and the
  primitive preview harness

## Root Cause

The tooltip anchor was implemented as a CSS pseudo-element with logical
positioning and an additional RTL-specific override.

That override double-mirrored the tooltip anchor in RTL, so the tooltip stayed
on the LTR side instead of following the direction-aware attachment edge.

## Why The Feature Loop Missed It

- the governed primitive and page-template manifests included RTL screenshots,
  but not a tooltip-open interaction state
- the tooltip existed only as a pseudo-element, which made geometry assertions
  harder and encouraged reliance on screenshots alone
- no explicit visual assertion checked the tooltip anchor side for RTL

## Reconciliation Changes Added

- tooltip primitive hardening:
  moved the navigation tooltip into an explicit `.reference-nav-tooltip`
  element so the visual harness can inspect and assert real geometry
- CSS fix:
  removed the redundant RTL-specific tooltip override and kept a single
  direction-aware logical anchor rule
- governed frontend manifest coverage:
  added a governed design-system RTL tooltip-open scenario and upgraded the
  navigation-rail primitive RTL scenario to exercise tooltip-open state
- explicit visual assertion:
  the Playwright visual spec now hovers the governed nav item and asserts that
  the tooltip sits on the correct side for the current direction

## Coverage Lesson

Interactive directional UI should not rely on static RTL screenshots alone.

When a primitive is geometric and direction-sensitive, the governed harness
needs:

- an open or hovered state in the manifest matrix
- a direct spatial assertion in the visual spec
- DOM-visible geometry when a pseudo-element would hide the failure mode

## Follow-Up Watch Items

- if more tooltip-like affordances are added as CSS-only pseudo-elements,
  prefer a real DOM primitive when geometry must be verified in automation
- keep reviewing rail-attached overlays individually because not every anchored
  surface should mirror the same way in RTL
