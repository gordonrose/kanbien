# Root Admin Hierarchy Current-Page Selection Drift

## Summary

The `/root-admin#web-app-hierarchy` editor could open with the page-settings
form bound to the first page in the curated tree rather than the current shell
page.

In real usage that made saves look valid while mutating the wrong page, such as
`Catalog Home`, even though the operator reasonably believed they were editing
`Web App Hierarchy`.

## Root Cause

`mountHierarchyResponse()` in
`src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs` initialized both
`currentId` and `selectedId` from the first page in the adapted hierarchy tree
when no explicit ids were provided.

The initial hierarchy load did not translate the current shell route
(`getCurrentPage()`, for example `web-app-hierarchy`) into the matching
hierarchy node id before mounting the tree.

## Why The Loop Missed It

- The existing browser coverage booted the hierarchy page mostly with trees
  whose first page was also the only meaningful page under test, so the drift
  was hidden.
- We had no regression that asserted the initial selected page in a mixed
  root-admin tree where `Catalog Home` appears before `Web App Hierarchy`.
- The save-path tests only checked that a save completed, not that the form was
  initially bound to the current route’s matching page.

## Reconciliation Changes

- Added current-route-to-node resolution during initial hierarchy mount.
- The hierarchy editor now prefers the page whose `pageKey`, `routeHash`, or
  resolved hash locator matches the current shell route.
- Added a browser regression proving that `/root-admin#web-app-hierarchy`
  initializes the page-settings form on `Web App Hierarchy` even when
  `Catalog Home` appears first in the curated tree.

## Coverage Lesson

For governed topology editors, initial selected-node state is part of the user
contract. Route-level browser tests must assert which page is actually bound to
the editor, not just that the page shell loads.

## Watch Items

- Any future route aliasing or locator-model migration should keep the
  current-page-to-node matching logic in sync with the resolved locator truth.
