# Record List Form Dark Theme Reconciliation

## Summary

The `/design-system/default/patterns/record-list-form` proof appeared dark at
the page and detail-slot shell level, but the hosted `entity-panel` and
embedded primary/secondary `index-nav-panel` frames stayed white in dark mode.

## Root Cause

The first repair only propagated theme attributes and page-level theme state.
It did not verify the computed colors of large hosted panel surfaces. The
`entity-panel` seam always consumed `panel-frame-default` even though
`panel-frame` already had dark/desert variants. The `index-nav-panel-frame`
token exposed only original light panel/header/action frame values, so
`index-nav-panel` and its header primitive could not render dark frames through
the governed token seam.

## Why The Loop Missed It

The regression coverage asserted `data-theme` and child `data-*theme`
attributes but did not assert human-visible computed backgrounds for the hosted
panel frames. That let a visually incorrect route look verified because the
theme labels were present.

## Architectural Decision

Shared contract first. The fix belongs in the Layer 2 token and shared pattern
seams, not in record-list-form route CSS. `entity-panel` now reuses the
existing same-theme `panel-frame` variant. `index-nav-panel-frame` now exposes
same-theme panel, header, and action variants, and consumers select the matching
variant by theme.

## Reconciliation Changes

- Added same-theme `index-nav-panel-frame` token variants.
- Updated `index-nav-panel` and `index-nav-panel-header-control` to select
  same-theme frame tokens.
- Updated `entity-panel` to select the same-theme `panel-frame`.
- Added unit coverage for dark token selection.
- Added a rendered Playwright regression that checks computed dark backgrounds
  for hosted entity-panel and index-nav-panel surfaces.

## Follow-Up Watch Items

- Attribute-only theme assertions are insufficient for governed visual defects.
  Future dark-theme regressions need at least one computed-style or screenshot
  assertion for the visible surface that failed.
