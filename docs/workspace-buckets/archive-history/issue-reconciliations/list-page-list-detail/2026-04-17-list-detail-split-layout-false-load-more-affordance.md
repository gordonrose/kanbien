# Issue Reconciliation - 2026-04-17 - List Detail Split Layout False Load-More Affordance

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into the list-detail split
> layout and list-page behavior locks, reference packs, verification
> checklists, signed-off canonical tests, and component inventory. Keep future
> authority in those active design-system artifacts.

## Symptom

The `ListDetailSplitLayout` canonical preview showed a `Scroll to load more
placeholder items.` control even though the preview did not actually implement
list growth.

Affected surface:

- `/design-system/components/list-detail-split-layout?ref=LDSL-002&width=1080&state=open&theme=normal&dir=ltr&zoom=0`

## Root Cause

The split-layout preview reused the parent list-region status markup, but the
preview controller never implemented append loading or any real load-more path.
That left a visible affordance whose behavior contract was false.

## Why The Existing Loop Missed It

- The initial split-layout work focused on lane geometry, overlay posture,
  RTL mirroring, magnification, and scroll ownership.
- The preview reused a familiar list-region affordance from the parent route,
  which made the false control feel plausible during source review.
- No automated check yet asserted that preview controls must either work or be
  absent.

## Prevention Added

- The split-layout preview now hides the load-more status action unless a
  future canonical explicitly models real additional list growth.
- `tests/visual/designSystem/canonicals/data-display/listDetailSplitLayout.spec.ts` now includes a
  regression that fails if the baseline split preview advertises load-more
  behavior without implementing it.

## Follow-Up

- Keep treating inherited preview chrome as suspect until the new seam proves
  that the inherited affordance is either behaviorally real or intentionally
  omitted.
