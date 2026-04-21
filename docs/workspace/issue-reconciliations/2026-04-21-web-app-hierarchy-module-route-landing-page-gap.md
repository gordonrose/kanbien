# Web-App Hierarchy Module-Route Landing-Page Gap

## Summary

The root-admin Web App Hierarchy editor could not offer
`/design-system/canonicals` as the landing page for the `Canonicals` module,
even though that route exists and should be selectable as a direct module page.

## Root Cause

The structure-aware hierarchy sync only created module-root pages from:

- synthetic hash-state pages
- explicit page nodes derived below the first group node

When discovery found both `/design-system/canonicals` and
`/design-system/canonicals/top-nav`, the first segment `canonicals` correctly
became the module group, but the sync never created a companion curated page
for the module's own route. A later de-duplication step also keyed only by
discovered structure node id, which would have collapsed a module record and a
same-node module-root page record together.

## Why The Loop Missed It

- Existing discovery-sync tests proved leaf routes and hash-state pages, but
  they did not cover a module route that is both navigable itself and the
  prefix for child routes.
- The root-admin hierarchy browser test only exercised landing-page saving for
  a module whose top-level page list already came from fixture data, so it did
  not verify how discovery-generated modules populate that list.
- The escaped bug sat at the seam between discovered route classification and
  curated hierarchy materialization, not in the select control itself.

## Reconciliation Changes Added

- taught structure-aware sync to create a module-root page when discovered
  user-facing surfaces include the module's own canonical route
- fixed planned-item de-duplication so a module item and a module-root page item
  can coexist when they originate from the same discovered structure node
- aligned discovery test helpers with the real provider's group classification
  for parent routes that also own deeper child routes
- added unit and integration regressions covering discovery/apply behavior for
  `/design-system/canonicals` plus `/design-system/canonicals/top-nav`

## Coverage Lesson

For governed route families, we need explicit sync coverage for "module route
plus child routes" rather than assuming leaf-route coverage is enough. A module
can be both structural and directly navigable.

## Watch Items

- if other governed families rely on module-owned index routes, add browser
  coverage that verifies those routes appear in the landing-page selector after
  discovery/apply
- if module-route discovery grows more complex, consider a first-class sync
  helper for module-owned canonical routes instead of keeping that inference
  inline in the structure-aware reconcile path
