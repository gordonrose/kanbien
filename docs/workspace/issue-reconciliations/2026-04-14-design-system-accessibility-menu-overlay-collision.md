# Design System Accessibility Menu Overlay Collision

## Summary

- Date found: `2026-04-14`
- User-visible symptom:
  the `/design-system` accessibility menu opened on top of the filter bar and
  primary page content, making the route look visibly broken despite a green
  frontend gate
- Affected surface:
  governed `/design-system/*` page routes

## Root Cause

The design-system route reused the root-admin accessibility-menu pattern as a
side-anchored floating overlay.

That pattern is acceptable for compact preview primitives, but it was the wrong
interaction model for a public route with a permanent sidebar and dense page
content. The menu opened successfully, stayed within the viewport, and anchored
consistently, but it still occupied the same visual space as primary page
controls.

In short:

- the implementation optimized for anchored popover behavior
- the route actually needed an in-flow utility panel that stayed within the
  sidebar column

## Why The Feature Loop Missed It

- the current governed checks proved viewport fit, screenshot stability, RTL
  behavior, keyboard reachability, and accessibility semantics
- the previous accessibility-menu assertion only checked directional anchoring
  of the open state, not whether the open state collided with primary content
- the bad layout was then accepted into updated baselines, which meant the
  suite protected a visually wrong contract

This was a mix of:

- **wrong-layer coverage**
- **missing regression scenario**
- **stale expectation**

The suite asked "did the menu open in a mechanically consistent place?" instead
of "does the chosen open state preserve a usable page layout?"

## Reconciliation Changes Added

- changed the `/design-system` accessibility menu from a side-floating overlay
  to an in-flow sidebar utility panel:
  [src/frontend/designSystem/assets/styles.css](/home/gordon/kanbien/src/frontend/designSystem/assets/styles.css:1)
- widened the design-system sidebar columns so the utility controls can live in
  the sidebar without colliding with the main page:
  [src/frontend/designSystem/assets/styles.css](/home/gordon/kanbien/src/frontend/designSystem/assets/styles.css:1)
- replaced the old anchor-only assertion with a layout-safety assertion that
  checks the open accessibility menu does not intersect primary content on the
  design-system surface:
  [tests/visual/rootAdminShell/rootAdminShell.visual.spec.ts](/home/gordon/kanbien/tests/visual/rootAdminShell/rootAdminShell.visual.spec.ts:1)
- added an explicit regression test for the design-system accessibility menu
  open state in the sidebar utility column:
  [tests/visual/rootAdminShell/rootAdminShell.visual.spec.ts](/home/gordon/kanbien/tests/visual/rootAdminShell/rootAdminShell.visual.spec.ts:1)

## Coverage Lesson

Utility overlays on governed public routes need more than:

- visible open state
- viewport fit
- directionally consistent anchoring

They also need explicit proof that:

- the open state does not collide with primary content
- the route uses the right interaction model for the shell, not just a reusable
  one from another surface

## Follow-Up Watch Items

- add similar non-interference checks for other future governed overlays such as
  drawers, command menus, and route-level utility panels
- treat screenshot-baseline updates for overlay-open states as a manual review
  checkpoint, not only a routine snapshot refresh
