# Canonical Renderings Missing From Hierarchy Tree

## Summary

The root-admin web-app hierarchy tree showed only the canonical-rendering pages
that had already been materialized into `web_app_hierarchy` rows. Newer live
canonical rendering families and references existed in the
`designSystemCanonicals` registry, but they did not appear in
`/root-admin/web-app-hierarchy`.

## Root Cause

`GET /v1/web-app-hierarchy/tree` correctly reads durable curated hierarchy
truth only. The planned
`POST /v1/web-app-hierarchy/design-system/canonical-renderings/sync` seam was
seeded as a capability and described by docs, but the route and domain sync
implementation did not exist. The root-admin refresh workflow also stopped
after discovery sync, so it never materialized live canonical registry entries
into durable hierarchy pages.

## Why The Feature Loop Missed It

The existing coverage proved structure-aware discovery sync and manual
design-system materialization, but it did not test the cross-feature contract
between `designSystemCanonicals` and `webAppHierarchyBuilder`. Browser mocks
also treated hierarchy refresh as discovery-only, so the missing canonical
registry sync was invisible to visual tests.

Classification: cross-feature seam blind spot plus missing integration coverage.

## Reconciliation Changes

- Added a web-app hierarchy domain sync that reads live canonical hierarchy
  nodes through the `designSystemCanonicals` public seam and upserts the
  durable `Canonical Renderings` module, launcher pages, reference pages, and
  active path locators.
- Added the protected
  `POST /v1/web-app-hierarchy/design-system/canonical-renderings/sync` route.
- Updated the root-admin hierarchy refresh flow to run canonical-renderings
  sync after discovery sync.
- Added unit coverage for uppercase canonical reference segments, active
  locators, idempotent reruns, and template keys.
- Added integration coverage proving the new route updates `GET /tree`.
- Updated root-admin visual mocks so refresh tests exercise the new sync call.

## Coverage Lesson

When a governed registry becomes tree-visible through a separate durable
hierarchy feature, the tree needs an explicit sync or projection test at the
owning API seam. Discovery refresh tests are not sufficient for registry-backed
pages that do not originate in surface discovery.

## Follow-Up Watch Items

- Keep canonical-renderings sync separate from route discovery; one reads
  registry truth and the other reads discovered app surfaces.
- If more registry-backed design-system branches are added, give each branch a
  comparable tree-sync or projection contract rather than relying on incidental
  discovery.
