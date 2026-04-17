# 2026-04-17 Display-Settings Selection Close Drift

## Symptom

Inside the governed `display settings` payload, clicking a setting option such
as theme, direction, or magnification closed the drawer immediately.

That violated the signed-off drawer contract. The drawer should close only
when:

- `Escape` is pressed
- the user clicks outside the drawer
- the user clicks the close button

## Root Cause

The display-settings controls re-used the shared `applyContextNavPreviewState()`
path after each setting change.

That function always reset transient surfaces first:

- `setContextNavMoreOpen(false)`
- `setFilterPanelOpen(false)`
- `setFilterOptionsPanelOpen(false)`
- `setAccessibilityDrawerOpen(false)`

It only reopened the drawer later if the derived preview state still said
`open=accessibility`.

The bug was that `getCurrentContextNavPreviewState()` derived `open` from the
preview control buttons rather than from the live runtime surface state. So a
click on a real in-drawer control could replay the preview state as
`open=closed`, which made a normal settings selection look like a drawer-close
action.

## Why The Loop Missed It

The existing executable checks covered:

- launcher open
- `Escape` close
- outside-click close
- payload canonical rendering
- active-state proof for the payload controls

But they did not yet cover the specific runtime interaction:

- click a real settings control while the drawer is open
- assert that the drawer remains open afterward

So the suite had coverage for entry, exit, and appearance, but not for the
middle-of-session interaction where the payload mutates the live preview state.

## What Changed

- `getCurrentContextNavPreviewState()` now prefers the live open surface state
  before falling back to preview-control button state
- this keeps in-drawer setting changes from accidentally replaying a stale
  `open=closed` value
- a new browser regression test now clicks real payload controls and proves
  the drawer stays open

## Added Prevention

- `tests/visual/designSystem/contextNavCanonicalFrame.spec.ts`
  now includes:
  `context-nav display-settings controls do not close the drawer when a setting is selected`

## Verification

- `npx playwright test tests/visual/designSystem/contextNavCanonicalFrame.spec.ts -g "display-settings controls do not close the drawer|keyboard open|outside-click" --workers=1`

## Residual Risk

This closes the escaped path for in-drawer display-settings controls, but the
same class of issue could recur for future sibling drawer payloads if they
reuse preview-state syncing without proving that live transient-surface state
beats stale control-panel state.
