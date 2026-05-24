# Count Card Route Alias Fallback

## Summary

The live `/design-system/tokens/count-card` page showed the design-system route
family overview instead of the Count Card token review page.

## Root Cause

The Count Card rename introduced `/design-system/tokens/count-card` as the
preferred route while the physical render page still lives at
`src/frontend/designSystem/tokens/filter-card/index.html` for compatibility.
The route resolver needed an explicit plural-route alias from `count-card` to
the existing render page. The active dev server was also started before the
route change, so the browser kept serving the older route table.

## Why The Loop Missed It

Integration coverage verified the app factory after source changes, and the
visual test used a freshly started preview server. The live user-facing process
on port `3000` was not restarted and checked before the route was shown back to
the user.

## Architectural Decision

Shared contract first. Count Card is the preferred semantic name, while the
existing `filter-card` file, CSS classes, data hooks, and renderer aliases stay
as compatibility surfaces until a broader migration is approved.

## Reconciliation Changes

- Moved the `/design-system/tokens/count-card` resolver alias ahead of generic
  static route lookup.
- Restarted the live dev server on port `3000`.
- Verified the live browser route renders `Count Card Token`, hydrates count
  cards, and no longer shows the route-family overview fallback.

## Follow-Up Watch Item

When renaming governed token families whose physical paths remain compatibility
paths, always verify the live route process after restart, not only the app
factory and preview-server test harness.
