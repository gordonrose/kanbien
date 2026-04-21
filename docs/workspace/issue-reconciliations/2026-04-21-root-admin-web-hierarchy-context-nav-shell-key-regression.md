# Root Admin Web Hierarchy Context-Nav Shell-Key Regression

## Summary

The root-admin context-nav could render a `Web App Hierarchy` item with the
overview icon and clicking it kept the shell on overview instead of opening the
hierarchy workspace.

## Root Cause

`webAppPageSettings.getWebAppPageContextNavProjection` derived
`shellPageKey` only from `resolvedFullRoutePath`. For root-admin hash-backed
states, the integration seam can expose `/root-admin` while the page's durable
`pageKey` still identifies `root-admin-web-app-hierarchy`. When the projection
collapsed that target to `overview`, the frontend decoded the default icon as
`home` and the click handler navigated back to overview.

## Why It Escaped

The existing browser checks proved that explicit context-nav items could appear
and that legacy default icons resolved correctly when the mocked route already
included `#web-app-hierarchy`. They did not cover the degraded but realistic
backend seam where the stored route falls back to `/root-admin` for a
hash-backed page, so the projection-layer regression stayed invisible.

## Reconciliation Changes Added

- updated the page-settings context-nav projection to fall back to the durable
  root-admin `pageKey` when the stored route alone is not specific enough
- added a unit regression that proves `root-admin-web-app-hierarchy` still
  projects `shellPageKey: web-app-hierarchy` when its stored route is
  `/root-admin`
- added a browser regression that verifies the context-nav item shows the
  hierarchy icon and opens the hierarchy workspace from overview under that same
  degraded route shape

## Coverage Lesson

For root-admin shell states, route-derived navigation keys are not sufficient on
their own. Regression coverage needs one case that reflects hash-state truth
being recovered from durable page metadata instead of only from the resolved
route string.

## Watch Items

- if the hierarchy integration seam later exposes active locator data directly,
  this projection helper can be simplified to prefer the canonical locator
- future root-admin shell states should reuse the same page-key normalization
  rule so icon and click behavior do not drift by state
