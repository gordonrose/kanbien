# Issue Reconciliation - 2026-04-17 - List Detail Panel Half-Page Scroll Flicker

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into the list-detail-panel
> behavior lock, reference pack, verification checklist, signed-off canonical
> tests, and component inventory. Keep future authority in those active
> design-system artifacts.

## Symptom

The `LDP-005` half-page long-content canonical flickered while scrolling the
detail body, making the header feel unstable instead of behaving like a calm
reading frame.

Affected surface:

- `/design-system/components/list-detail-panel?ref=LDP-005&width=520&state=long&theme=normal&dir=ltr&zoom=0`

## Root Cause

The header-compaction logic measured the live header height on every scroll
sync. Once the panel entered the condensed state, that live measurement became
smaller, which could immediately drop below the oversize threshold and flip the
panel back to expanded. On the next scroll frame the expanded header measured
tall again, so the panel condensed again.

That created an oscillating state machine driven by its own condensed geometry
instead of by a stable expanded-header measurement.

## Why The Existing Loop Missed It

- The earlier regression proof checked that `LDP-008` could enter a condensed
  state after scrolling, but it did not verify stability across a sequence of
  scroll positions.
- The automated coverage asserted a single endpoint state rather than counting
  state transitions during real scrolling.
- The visual contract had gained adaptive compaction behavior, but the
  prevention layer had not yet added hysteresis or a stable measurement source
  for that behavior.

## Prevention Added

- The compaction controller now caches the expanded header height before
  condensing, so oversize detection no longer flips based on the smaller
  condensed header.
- The scroll trigger now uses hysteresis:
  - it enters the condensed state after a deeper scroll threshold
  - it exits only when the user returns much closer to the top
- `tests/visual/designSystem/canonicals/data-display/listDetailPanel.spec.ts` now includes a dedicated
  regression that scrolls `LDP-005` through multiple positions and asserts the
  header compaction state does not bounce back and forth.

## Follow-Up

- Keep using transition-sequence checks, not only final-state checks, for any
  future adaptive header, drawer, or shell behavior that can react to scroll
  position and its own changing geometry.
