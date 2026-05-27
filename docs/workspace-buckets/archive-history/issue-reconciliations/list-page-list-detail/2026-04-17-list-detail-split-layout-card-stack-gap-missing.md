# Issue Reconciliation - 2026-04-17 - List Detail Split Layout Card Stack Gap Missing

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into the list-detail split
> layout and list-page behavior locks, reference packs, verification
> checklists, signed-off canonical tests, and component inventory. Keep future
> authority in those active design-system artifacts.

## Symptom

The `ListDetailSplitLayout` canonical preview rendered the list cards flush
against each other, making the list lane look broken and undermining the
preview's lane-spacing contract.

Affected surface:

- `/design-system/components/list-detail-split-layout?ref=LDSL-002&width=1080&state=open&theme=normal&dir=ltr&zoom=0`

## Root Cause

The preview list used the card markup inside a plain container, but that
container never received a stack layout or gap rule. The list lane itself was a
grid, yet the card stack wrapper inside it was just a normal block container,
so adjacent cards visually collapsed together.

## Why The Existing Loop Missed It

- The first split-layout verification pass focused on lane relationship,
  overlay posture, RTL mirroring, magnification, and scroll ownership.
- The executable coverage proved shell geometry, but it did not yet assert the
  vertical spacing contract inside the preview list stack.
- Because the preview reused existing card styling, the missing gap hid in the
  wrapper layer rather than in the card component itself.

## Prevention Added

- The preview item wrapper now has an explicit grid stack with a governed gap.
- `tests/visual/designSystem/canonicals/data-display/listDetailSplitLayout.spec.ts` now includes a
  regression that measures the vertical gap between the first two list cards
  and fails if the spacing collapses.

## Follow-Up

- Keep adding wrapper-level geometry assertions for child-seam previews when
  previously signed-off inner seams are composed inside a newly extracted shell
  relationship.
