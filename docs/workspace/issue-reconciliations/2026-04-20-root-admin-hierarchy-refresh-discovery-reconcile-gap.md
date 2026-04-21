# Root Admin Hierarchy Refresh Discovery Reconcile Gap

## Summary

The operator route `/root-admin#web-app-hierarchy` existed in root-admin shell
discovery but did not appear in the hierarchy drawer after opening the web-app
hierarchy page.

## Root Cause

The Refresh control on the web-app hierarchy page originally only re-read the
curated tree through `GET /v1/web-app-hierarchy/tree`. An initial repair then
switched it to `POST /v1/web-app-hierarchy/discovery-sync/apply`, but that
endpoint only applies already-stored discovery truth. It does not start a fresh
discovery run. Newly implemented shell-state routes could still be absent when
stored discovery rows were stale.

## Why The Loop Missed It

- backend unit and integration coverage already proved that structure-aware
  reconcile can import hash-state shell pages, but those tests exercised
  generic examples such as `#users`
- the browser-level hierarchy page spec stubbed the curated tree directly and
  only asserted that Refresh reloaded that stubbed tree
- no browser regression guard asserted the user-visible expectation that
  pressing Refresh updates curated truth from discovery before the tree redraws

## Reconciliation Changes Added

- changed the web-app hierarchy Refresh control to call
  `POST /v1/web-app-hierarchy/sync-discovery`, the compatibility wrapper that
  runs discovery first and then applies the structure-aware reconcile
- reused the returned tree payload immediately so the drawer redraws from the
  newly updated curated truth
- added a visual app regression test that starts with a stale curated tree,
  clicks Refresh, and verifies that the newly reconciled `Web App Hierarchy`
  page appears in the drawer

## Coverage Lesson

When the operator UI promises a refresh of governed hierarchy truth, the
browser-level regression needs to verify the refresh contract end to end:
discovery reconcile plus updated curated tree rendering, not only a repeated
GetTree read.

## Follow-Up Watch Items

- if the product later needs a non-destructive preview-first refresh flow, add
  a distinct control rather than silently overloading the current Refresh
  affordance again
