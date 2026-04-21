# Issue Reconciliation - 2026-04-17 - List Detail Panel Mobile Header Growth Gap

## Symptom

The `ListDetailPanel` mobile canonical preview showed excessive vertical
whitespace in the header before the action row, making the mobile state look
broken and wasting most of the available panel height.

Affected surface:

- `/design-system/components/list-detail-panel?ref=LDP-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0`

## Root Cause

The mobile preview-specific CSS changed `.list-page-detail-header` to a column
layout, but the reused `.list-page-detail-copy` block still had
`flex: 1 1 18rem` from the desktop header rules.

In a column flex container that allowed the copy block to grow vertically,
which pushed the controls downward and created a large dead zone between the
subtitle and the action row.

## Why The Existing Loop Missed It

- The initial `ListDetailPanel` canonical work proved mobile stacking at a
  coarse level, but the automated checks did not assert compact header spacing.
- The test suite checked that the header became a column and that the controls
  widened appropriately, but it did not verify the absence of a large vertical
  gap between copy and controls.
- Because the preview reused desktop card/detail primitives, the regression hid
  inside inherited flex behavior rather than in an obviously mobile-only block.

## Prevention Added

- Mobile preview CSS now resets the header copy block to `flex: 0 0 auto`,
  `min-width: 0`, and `width: 100%` inside the `ListDetailPanel` mobile
  canonical preview.
- The mobile preview header gap is tightened directly through a smaller
  explicit header gap and a reset `margin-inline-start` on the controls block.
- `tests/visual/designSystem/canonicals/data-display/listDetailPanel.spec.ts` now includes a dedicated
  regression check that asserts:
  - the mobile preview copy block no longer grows vertically
  - the gap between the subtitle and the controls row stays compact

## Follow-Up

- Keep using child-seam-specific spacing assertions for mobile canonical
  previews whenever desktop flex rules are reused inside a stacked mobile
  layout.
