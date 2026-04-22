# 2026-04-22 Canonical Mobile Overlay Containment Contract Gap

## Symptom

Mobile open-state canonicals such as:

- `/design-system/canonical-renderings/date-picker/DTPR-007`
- `/design-system/canonical-renderings/date-picker/DTPR-008`

could still expand to full-screen viewport posture instead of staying inside
the dedicated canonical render area.

## Root Cause

The shared form picker mobile rules still used viewport-owned overlay behavior:

- `position: fixed`
- `top/right/bottom/left: 0`
- `height: 100vh`

Those rules were correct for app-level full-screen mobile posture, but not for
dedicated canonical render pages where the specimen must remain bounded by the
review frame.

## Why The Loop Missed It

Earlier fixes were family-specific and did not harden the shared canonical
overlay contract. Coverage also leaned on route truth and a few mobile-family
assertions without a shared source-level audit proving canonical mobile overlays
anchor to the preview frame instead of the viewport.

## Prevention Added

- Shared canonical-frame CSS overrides now pin mobile date/time picker overlays
  to the dedicated preview shell.
- Added `tests/integration/frontend/designSystemCanonicalOverlayContainmentAudit.test.ts`
  to audit the shared containment contract in `styles.css`.
- Upgraded family specs to assert overlay containment against the canonical
  review frame instead of using only visibility or width heuristics.

## Follow-Up Rule

For dedicated canonical render pages, mobile overlays must be local review
artifacts, not full-viewport app overlays. Shared canonical CSS must own that
constraint before any new rendering family is treated as complete.
