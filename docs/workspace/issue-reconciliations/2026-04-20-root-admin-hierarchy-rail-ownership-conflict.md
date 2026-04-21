# Root Admin Hierarchy Rail Ownership Conflict

## Summary

On `/root-admin#web-app-hierarchy`, saving explicit context-nav targets for the `Web App Hierarchy` page could succeed while the left rail still appeared to show no configured page options after reload.

## Root Cause

The `web-app-hierarchy` consumer mounted the hierarchy tree drawer open by default. That drawer occupied the same left-rail experience that page-settings-driven context navigation is supposed to own. The saved context-nav projection could therefore be correct while the user-visible rail still showed the hierarchy drawer instead of the configured menu options.

## Why The Feature Loop Missed It

The browser regression that was intended to prove context-nav refresh behavior only asserted the saved nav item after first clicking `#hierarchy-tree-drawer-close`. That meant the suite verified persistence and refresh behavior only in an artificial posture where the competing drawer had already been dismissed.

This was a wrong-layer and unrealistic-harness miss:

- wrong-layer because the save path was tested without asserting the real initial rail ownership the user sees on reload
- unrealistic-harness because the test manually removed the obstructing drawer before checking visibility

## Reconciliation Changes

- Added an `initialDrawerOpen` option to the shared hierarchy-tree consumer so a page can choose whether the drawer is open by default.
- Updated the root-admin `web-app-hierarchy` page to mount the hierarchy drawer closed on initial load, leaving the page-settings-driven context nav as the visible left-rail authority.
- Repaired the existing browser regression so it no longer closes the drawer before asserting saved context-nav items.
- Added a new browser regression that reloads `/root-admin#web-app-hierarchy` with five saved explicit targets and verifies those five options are visible immediately.

## Coverage Lesson

When a page has both a launcher utility and a governed rail, the browser test must assert the default post-load posture, not only the state after dismissing one of the surfaces.

## Follow-Up Watch Items

- Keep the hierarchy launcher in the bottom utility stack rather than letting the page-specific editor surface reclaim the rail by default.
- If we ever need a page-specific default-open drawer again, it should require an explicit product decision because it competes directly with durable navigation truth.
