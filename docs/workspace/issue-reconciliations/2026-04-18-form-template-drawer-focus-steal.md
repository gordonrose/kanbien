# 2026-04-18 Form-Template Drawer Focus Steal

## Symptom

On `/design-system/templates/form`, clicking into a text or search field while
the `Display Settings` drawer was open immediately pulled focus back out of the
field.

The field click did close the drawer, but the user could not continue typing
because focus was restored to the drawer launcher instead of staying on the
clicked control.

## Root Cause

The shared `setAccessibilityDrawerOpen(false)` path always restored focus to
the drawer launcher when the drawer closed.

That behavior is correct for:

- explicit close-button dismissal
- `Escape` dismissal
- inert outside clicks on non-focusable page chrome

But it is wrong when the outside click target is itself a focusable control.
On the form template, clicking a text input counted as an outside click, so the
global click-close handler closed the drawer and then immediately focused the
launcher, overriding the browser's natural focus placement on the clicked
field.

## Why The Loop Missed It

The existing prevention layer covered the shared drawer interaction mostly from
the launcher's perspective:

- keyboard open moves focus into the drawer
- `Escape` close returns focus to the launcher
- outside-click close on inert preview content returns focus to the launcher

What it did not cover was the more specific runtime case:

- click a focusable control outside the drawer while the drawer is open
- assert that the drawer closes without stealing focus from that control

So the suite proved correct entry and standard dismissal, but not dismissal
that hands focus to another interactive target.

## What Changed

- added `isFocusableOutsideTarget()` so the outside-click dismissal path can
  distinguish editable/focusable targets from inert page chrome
- updated `setAccessibilityDrawerOpen()` to accept a `restoreFocus` option
- the global outside-click handler now preserves the clicked target's focus
  when that target is an interactive control, while still returning focus to
  the launcher for inert outside clicks

## Added Prevention

- added `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
- new regression:
  `clicking a form field while display settings is open preserves focus on that field`

## Verification

- intended focused check:
  `npx playwright test tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts --workers=1`

## Residual Risk

Other future drawer consumers could still reintroduce this class of bug if
they add close-on-outside-click behavior without distinguishing inert clicks
from clicks on real interactive controls. The shared helper reduces that risk,
but the most honest protection remains route-level browser coverage on drawer
consumers that have editable content behind the drawer.
