# Issue Reconciliation - 2026-04-17 - List Detail Panel Magnified Header Compaction Gap

## Symptom

The `LDP-008` magnified half-page canonical kept the detail header fully
expanded even after the body became the active reading lane, leaving too little
 space for long-form content and making the magnified review state feel
 vertically wasteful.

Affected surface:

- `/design-system/components/list-detail-panel?ref=LDP-008&width=520&state=long&theme=normal&dir=ltr&zoom=100`

## Root Cause

The child seam preserved wrapped title and subtitle content under magnification,
but it had no rule for giving space back to the body once the header became
disproportionately tall and the user had clearly moved into the body scroll
lane.

That left the component stuck in a fully expanded header posture even in the
highest-pressure reading state.

## Why The Existing Loop Missed It

- The original `LDP-008` proof verified magnification scoping only, not how the
  internal zones should rebalance once scrolling begins.
- The child behavior lock and reference pack did not yet make header
  compaction an explicit governed option under magnified pressure.
- Existing tests asserted the presence of long-content overflow, but not the
  adaptive response once the header consumed too much height.

## Prevention Added

- The child seam now detects oversized headers relative to panel height.
- Once body scrolling begins in an oversized-header state, the panel condenses
  secondary header chrome automatically by:
  - hiding the subtitle
  - tightening header and copy spacing
  - reducing title scale slightly
- The full header remains visible again near the top because compaction is tied
  to body scroll position rather than being permanent.
- `tests/visual/designSystem/listDetailPanel.spec.ts` now includes a dedicated
  regression check for `LDP-008` that proves:
  - the header is recognized as oversized before scrolling
  - the panel enters a condensed state after body scrolling begins
  - the header becomes shorter and the subtitle is hidden in that state

## Follow-Up

- If this same compaction behavior proves right in signed-off review, carry it
  forward when the child seam is extracted into the parent `List Page`
  implementation rather than treating it as canonical-only polish.
