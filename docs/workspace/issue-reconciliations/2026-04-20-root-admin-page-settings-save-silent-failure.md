# Root Admin Page Settings Save Silent Failure

## Summary

The `Save page settings` action on `/root-admin#web-app-hierarchy` could appear
to do nothing for real users.

## Root Cause

Two gaps combined:

1. The frontend `savePageSettings()` flow in
   `src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs` did not catch
   failed `PUT /v1/web-app-page-settings/pages/:webAppPageId` requests, so
   backend validation errors surfaced only as an unhandled promise rejection
   instead of a visible shell message.
2. The backend page-settings icon approval catalog still only treated legacy
   `page-*` keys as valid even though the governed page-settings form now uses
   design-system icon keys such as `grid`, `workspace`, and `hierarchy`.

That meant a page with an already-stored governed icon key could fail on any
later save, even if the user was only changing context-nav targets.

## Why The Loop Missed It

- The browser coverage proved the happy-path save flow with mocked successful
  responses, but it did not cover a page that already had a governed icon key
  in storage.
- The backend tests covered legacy icon keys like `page-home`, not the modern
  governed keys the actual picker can preserve and send back.
- The frontend save handler had no explicit error reporting assertion, so a
  rejected save looked like a dead button instead of a surfaced failure.

## Reconciliation Changes

- Added explicit error handling to the page-settings save flow so failed saves
  now show a danger shell message instead of silently disappearing.
- Closed open form surfaces before saving so the page-settings action runs from
  a stable interaction state.
- Expanded the backend approved icon catalog to include governed design-system
  icon keys in addition to legacy `page-*` compatibility keys.
- Added a unit regression for governed icon-key acceptance.
- Added an integration regression for governed icon-key acceptance through the
  HTTP seam.
- Added a browser regression for saving page settings while the context-nav
  selector is open and the current icon key is already a governed key.

## Coverage Lesson

When a governed frontend control preserves stored values across saves, backend
validation must be tested against the same persisted value vocabulary the UI
can actually emit or preserve. Happy-path UI saves alone were too optimistic.

## Watch Items

- The `web-app-page-settings/options` icon catalog should remain aligned with
  the governed picker vocabulary so the API contract and UI contract do not
  drift again.
- Similar save handlers in governed root-admin surfaces should keep explicit
  `try/catch` shell messaging so rejected writes never read as a dead control.
