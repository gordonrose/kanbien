# Root Admin Context-Nav Icons And Links Reconciliation

## Summary

On 2026-04-28, browser review showed root-admin context-nav buttons rendering
the wrong repeated icon and failing to navigate when clicked. A follow-up
browser review also showed a nested page displayed under `Overview` in the
hierarchy tree while the structure panel still said `No parent page`, and the
context-nav rail stayed empty.

## Root Cause

The context-nav projection and root-admin shell click handling both assumed
that every root-admin context-nav target was one of the fixed shell sections.
Dynamic or topology-derived root-admin target pages could collapse to
`overview` as their `shellPageKey`, especially when their stored route looked
root-admin-scoped but was not a known shell section. The root-admin document
click handler also intercepted every element with `data-page-link`, so
non-shell context-nav anchors never followed their rendered `href`.

## Why The Feature Loop Missed It

Existing focused browser coverage proved that parent-owned context-nav items
rendered and that the web-app-hierarchy fallback icon worked. It did not cover:

- multiple target pages with distinct configured icons
- a context-nav target whose page key is not a fixed root-admin shell section
- click behavior for a non-shell context-nav target

This was a cross-feature seam blind spot between `webAppPageSettings`
projection data, hierarchy-derived route identity, and the root-admin shell's
local navigation interception.

The parent-display follow-up escaped because the hierarchy workspace trusted
the raw page payload's `parentPageId` even when the resolved tree shape already
showed the page nested under a parent. Context-nav content must still come only
from the resolved owner's explicit context-nav settings.

## Reconciliation Changes

- Preserved target page keys in `getWebAppPageContextNavProjection` when a
  root-admin target is not a known fixed shell section.
- Changed root-admin context-nav href rendering to use canonical shell paths
  only for known shell pages, while preserving rendered target routes for
  non-shell pages.
- Changed the root-admin click handler to intercept only known shell page
  links, allowing non-shell anchors to navigate normally.
- Changed hierarchy workspace normalization and refresh behavior so nested
  pages can infer their parent from the displayed tree when a raw page payload
  omits `parentPageId`.
- Added `TC-WEB-PAGE-SET-EDGE-007` service coverage for dynamic target key and
  icon preservation.
- Added `TC-WEB-PAGE-SET-EDGE-008` service coverage for fixed root-admin target
  aliases stored under nested `/root-admin/overview/...` route paths.
- Added `TC-WEB-PAGE-SET-INT-013` browser coverage for distinct target icons,
  canonical fixed-shell links, and non-shell link navigation.
- Added `TC-WEB-PAGE-SET-INT-014` browser coverage for the nested overview
  editor route, explicit owner context-nav rendering, and root Overview URL
  normalization.

## Coverage Lesson

Navigation projection tests need at least one mixed-target scenario: a normal
fixed shell page plus a topology-derived non-shell page. Rendering-only checks
are insufficient when the shell has delegated click interception.

Hierarchy UI tests also need one stale/raw-payload scenario where the resolved
tree shape and the raw page field disagree, because the tree is what operators
can see and reason from.

## Follow-Up Watch Items

- Keep `WEB-PAGE-SET` traceability scoped green after adding the regression
  cases.
- User confirmation is still required against the original browser surface
  because local automated evidence proves the candidate fix, not the user's
  exact live data state.
