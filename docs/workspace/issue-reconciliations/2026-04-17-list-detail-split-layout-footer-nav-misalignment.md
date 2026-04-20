# Issue Reconciliation - 2026-04-17 - List Detail Split Layout Footer Nav Misalignment

## Symptom

The `Previous` and `Next` footer buttons in the `ListDetailSplitLayout`
baseline split preview did not sit on the same vertical line.

Affected surface:

- `/design-system/components/list-detail-split-layout?ref=LDSL-002&width=1080&state=open&theme=normal&dir=ltr&zoom=0`

## Root Cause

The split-layout preview rendered `Next` as a plain sibling button while the
shared detail-panel footer structure expects it inside the
`.list-page-detail-nav-anchor` wrapper. That structural mismatch changed the
inline alignment context and left the two buttons slightly offset.

## Why The Existing Loop Missed It

- The earlier split-layout passes focused on lane relationship, card spacing,
  false affordance cleanup, and header alignment.
- The visual suite had not yet asserted footer-button top and bottom alignment
  directly.
- Because the buttons still looked functionally related, the structural drift
  was easy to miss during broader shell review.

## Prevention Added

- The split-layout preview footer now matches the shared detail-panel footer
  structure by restoring the nav-anchor wrapper around `Next`.
- `tests/visual/designSystem/listDetailSplitLayout.spec.ts` now includes a
  geometry regression that compares the `Previous` and `Next` button edges and
  fails if they drift out of vertical alignment.

## Follow-Up

- Keep footer and action-row preview markup structurally aligned with the
  signed-off inner seam whenever a new child shell reuses those controls.
