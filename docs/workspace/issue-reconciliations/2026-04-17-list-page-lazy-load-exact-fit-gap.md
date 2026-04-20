# 2026-04-17 List Page Lazy-Load Exact-Fit Gap

## Summary

- User-visible symptom:
  on `/design-system/templates/list-page`, certain zoom and geometry
  combinations could leave the list with exactly four visible cards and no
  scrollbar, which made the scroll-triggered lazy-load path unreachable.
- Affected surface:
  governed frontend `List Page` parent template.

## Root Cause

- The parent pattern relied on scroll-triggered lazy loading plus an initial
  `seedListUntilScrollable()` pass.
- That seeding pass only covered the geometry that existed when the route
  initialized.
- If later layout pressure changed the list into an exact-fit state with no
  usable scroll affordance, the lazy-load contract had no secondary trigger.

## Why The Loop Missed It

- Escape classification:
  missing regression scenario.
- Existing Playwright coverage proved:
  - initial seeding and normal scroll-triggered append
  - drawer-boundary append from `Next`
  - append failure and retry
- The suite did not include a no-scroll geometry state where more items still
  remained available.
- That left a blind spot between “scroll exists” and “all items are loaded.”

## Reconciliation Changes

- Replaced the separate fallback block with a lower-profile design:
  the existing lazy-load status line now acts as the clickable load-more
  affordance while more items remain available.
- This keeps the exact-fit recovery inside already-approved chrome instead of
  adding a second list-region control that can feel visually bolted on.
- The same inline status link now works in both:
  - the closed-list exact-fit state
  - the desktop split view while the side drawer is open
- Simplified the runtime by removing the geometry-sensitive extra fallback
  surface entirely, which eliminated the flicker-prone visibility seam.
- Updated Playwright coverage so it now forces a no-scroll geometry state and
  verifies the status line remains a usable load-more action in both the
  closed-list and drawer-open compositions.
- Synced the `List Page` behavior lock, reference pack, and template note.

## Coverage Lesson

- Scroll-triggered lazy loading is not sufficiently proven by “append on
  scroll” alone.
- Governed lazy-load families also need a no-scroll or exact-fit regression
  state whenever geometry can change after first render.
- When a recovery affordance already has a natural home in existing chrome,
  prefer upgrading that surface over adding a new control that must also be
  proven across every composition mode.

## Follow-Up Watch Items

- Watch whether real consumers eventually need different status-link copy once
  lists become data-backed rather than placeholder-backed.
- If future filtering or sorting can dramatically shrink the visible set after
  load, keep verifying that the status link only remains actionable when more
  items really exist and not when the catalog is actually complete.
