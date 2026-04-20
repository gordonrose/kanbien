# Issue Reconciliation - 2026-04-17 - List Detail Split Layout Header Action Wrap Too Early

## Symptom

The `ListDetailSplitLayout` baseline split preview pushed the `Edit`, `Share`,
and close controls onto a lower row even though the header copy was short
enough to support same-row alignment.

Affected surface:

- `/design-system/components/list-detail-split-layout?ref=LDSL-002&width=1080&state=open&theme=normal&dir=ltr&zoom=0`

## Root Cause

The split-layout preview inherited the detail panel's conservative
`min-width: 18rem` copy block and wrapping action row. That made the header
wrap prematurely inside the split shell even when the actual title and subtitle
were short and the baseline state should have stayed on one row.

## Why The Existing Loop Missed It

- The first split-layout pass focused on lane relationship, overlay behavior,
  RTL mirroring, spacing between cards, and false affordance cleanup.
- The executable checks proved the shell geometry, but they did not yet assert
  that the baseline split header keeps the action row aligned when the content
  is short.
- The shared detail-panel rules were valid in general, but the split preview
  needed a narrower override for the short baseline state.

## Prevention Added

- The split preview now relaxes the copy block width and keeps the action row
  unwrapped only in the baseline split state where the short copy should stay
  aligned.
- The override is scoped to that specific split preview state so the long-content
  scroll-pressure canonical still preserves its own honest geometry.
- `tests/visual/designSystem/listDetailSplitLayout.spec.ts` now includes a
  regression that measures the header geometry and fails if the controls drop
  to a lower row in the short baseline split state.

## Follow-Up

- Keep scoping preview-specific layout overrides to the exact canonical states
  that need them so fixes for calm baseline geometry do not accidentally erase
  the pressure conditions required by longer-content states.
