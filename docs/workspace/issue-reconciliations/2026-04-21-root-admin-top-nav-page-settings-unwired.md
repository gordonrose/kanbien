# Root Admin Top-Nav Page-Settings Unwired

## Summary

Saving `Show in top nav` for a curated root-admin page had no visible effect on
the root-admin header, and refreshing the page still left the top-nav buttons
unchanged.

## Root Cause

The page-settings feature correctly persisted `showInTopNav`, but the real
root-admin shell never consumed that stored truth. The shell header was still
rendering from hard-coded nav markup plus the static `pageMetadata` map, while
only context-nav had been wired to reload from the page-settings backend.

## Why The Loop Missed It

- Existing page-settings coverage proved that the setting could be saved and
  read back through the backend seam, but it did not verify that the real
  root-admin top nav re-rendered from that stored setting.
- Browser coverage around the hierarchy workspace focused on save success,
  context-nav refresh, and nearby shell behavior, not on the top-nav buttons
  themselves.
- The escaped bug lived at the cross-feature seam between
  `webAppPageSettings` and the root-admin shell runtime, so backend confidence
  alone overstated the user-visible outcome.

## Reconciliation Changes Added

- wired the root-admin shell to rebuild its primary and mobile top-nav links
  from the saved page-settings state after session bootstrap
- refreshed the top-nav projection immediately after saving page settings in the
  hierarchy workspace so the visible shell state updates without requiring a
  manual reload
- added a browser regression that toggles `Show in top nav`, saves, verifies
  the new button appears, refreshes the page, and verifies the button still
  appears

## Coverage Lesson

When a setting claims to drive governed shell chrome, we need one browser test
that asserts the shell chrome actually changes. Backend persistence proof and
form-save proof were both necessary, but not sufficient, for this contract.

## Watch Items

- if top-nav visibility expands beyond the current root-admin shell pages, the
  shell should eventually consume a dedicated projection seam instead of
  rebuilding from a hierarchy-tree read plus per-page settings reads
- any future governed shell controls that save durable page settings should add
  at least one browser assertion against the rendered shell surface they claim
  to control
