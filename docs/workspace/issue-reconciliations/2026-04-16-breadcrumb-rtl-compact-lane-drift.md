# Breadcrumb RTL Compact Lane Drift

## Symptom

The compact RTL breadcrumb state allowed the search shell to overlap the
signpost trigger, even though the LTR compact state correctly preserved a
protected signpost lane.

## Root Cause

The compact row layout used a shared two-column grid that was correct for LTR
but not mirrored for RTL. In RTL compact mode, the row still treated the
breadcrumb lane as the left auto column and the search shell as the right
flexible column, so the signpost did not keep its own protected lane.

## Why The Loop Missed It

The existing compact-layout audit asserted the LTR compact grid and several RTL
ordering rules, but it did not explicitly assert the compact RTL grid-column
assignment. That left a blind spot where the breadcrumb could be mirrored
correctly in full and reduced states while still using the wrong compact row
geometry.

## Prevention Added

- Added RTL-specific compact grid rules so the search shell uses the flexible
  left lane and the breadcrumb signpost keeps a protected right lane.
- Tightened `tests/audit/designSystem/breadcrumbOverflow.test.ts` to assert the
  RTL compact row grid and column assignment directly.
