# 2026-04-17 Display-Settings Scrollbar Style Drift

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/display-settings/`
after the scrollbar-styling lesson was found in active display-settings and
context-nav drawer design-system authority plus visual coverage.

## Symptom

The `display settings` drawer used browser-default scrollbars instead of the
signed-off scrollbar treatment already used by `context-nav`.

That made the payload feel visually out of family even though it sits inside
the governed `context-nav drawer` chassis.

## Root Cause

`context-nav` had explicit scrollbar styling on `.context-nav-main`, but the
drawer surface itself used `.side-panel` with only generic `overflow: auto`.

So once the payload grew tall enough to scroll, the drawer fell back to the
browser scrollbar rather than inheriting the signed-off design-system chrome.

## Why The Loop Missed It

The existing coverage focused on:

- geometry
- attachment
- focus return
- payload content states
- keyboard interaction

It did not yet assert scrollbar styling as part of the drawer-family visual
contract, so the drift could survive even with otherwise-correct layout.

## What Changed

- `.side-panel` now uses the same scrollbar treatment as `context-nav`
- a browser test now asserts that the drawer exposes the styled scrollbar
  contract instead of default scrollbar behavior

## Added Prevention

- `tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts`
  now includes:
  `context-nav display-settings drawer uses the signed-off context-nav scrollbar styling`

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts -g "scrollbar styling|display-settings controls do not close the drawer" --workers=1`
