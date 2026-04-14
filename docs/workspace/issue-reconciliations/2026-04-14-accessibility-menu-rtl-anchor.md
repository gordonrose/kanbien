# Accessibility Menu RTL Anchor Regression

## Summary

- Date found: `2026-04-14`
- User-visible symptom:
  the accessibility/preferences menu on the governed page reference surface
  opened on the wrong side of the navigation rail in RTL mode
- Affected surface:
  design-system table page governed frontend preview

## Root Cause

RTL-specific CSS overrides for `.accessibility-menu` mirrored the popover
anchor to the opposite side of the accessibility trigger.

That generic RTL mirroring rule was treated as incorrect at the time, but the
broader governed RTL audit on `2026-04-14` confirmed the preferred contract is
direction-aware anchoring for rail-attached overlays as well.

## Why The Feature Loop Missed It

- the visual gate had an accessibility-open scenario only for LTR
- existing RTL scenarios covered the default shell and open filter state, but
  not the accessibility menu in its open state
- the visual spec asserted menu visibility, viewport fit, and screenshot
  baselines, but did not include an explicit geometry check that the menu opens
  outward from the rail

## Reconciliation Changes Added

- CSS fix:
  [src/frontend/rootAdminShell/assets/styles.css](/home/gordon/kanbien/src/frontend/rootAdminShell/assets/styles.css:645)
  removed the RTL-specific menu-anchor reversal so the popover keeps its
  outward rail anchor
- governed frontend manifest coverage:
  [design-system-table-page.json](/home/gordon/kanbien/docs/standards/frontend-gates/design-system-table-page.json:66)
  now includes a `large-rtl-desert-100-accessibility-open` scenario
- explicit visual assertion:
  [tests/visual/rootAdminShell/rootAdminShell.visual.spec.ts](/home/gordon/kanbien/tests/visual/rootAdminShell/rootAdminShell.visual.spec.ts:98)
  now checks that the opened accessibility menu anchors to the correct side for
  the active direction instead of only asserting visibility

## Coverage Lesson

Directionality coverage for governed frontend states needs both:

- state-matrix inclusion for the affected interactive state
- an assertion that checks the intended spatial relationship when the bug class
  is geometric, not just a screenshot or visibility assertion

RTL default-state coverage was not enough to protect an RTL interactive popover
anchor, and the anchor contract itself needed to be asserted directly rather
than inferred from an earlier design assumption.

## Follow-Up Watch Items

- if more rail-attached overlays or drawers are added, each should be reviewed
  for whether RTL should mirror content only or also mirror the anchor edge
- future governed frontend manifests should bias toward including open-state RTL
  scenarios for directional popovers, drawers, and other attached overlays
