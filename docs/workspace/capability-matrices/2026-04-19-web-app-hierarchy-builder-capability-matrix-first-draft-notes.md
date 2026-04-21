# Web App Hierarchy Builder Capability Matrix Notes

## Purpose

Capture the first-pass assumptions behind the initial
`webAppHierarchyBuilder` capability matrix before PRD drafting.

## Current Implementation Note

The backend foundation slice has now landed in
`src/features/webAppHierarchyBuilder/`.

This notes file remains useful as the planning rationale, but current runtime
truth should now be read from:

- the implemented feature code
- the refreshed PRD and test-case docs
- the implementation blueprint close-out refresh
- the source-independent data-dictionary and API-contract docs

## Planning Decisions Locked In

- capability boundary is `root` in the first slice
- refined entity model uses separate durable `webAppRootFamily`,
  `webAppModule`, and `webAppPage` entities
- current approved root families are:
  - `root-admin`
  - `login`
  - `design-system`
- pages form a strict general tree through a nullable parent-page reference
- page placement is modeled separately from lifecycle state
- page lifecycle statuses are `draft`, `review`, `live`, and `inactive`
- page placement types are `module-root`, `child-page`, and `orphaned`
- canonical route truth is `routeSegment`
- derived full route path is refreshed automatically from ancestry
- bootstrap should create rows only for real current browser-navigable pages
- bootstrap scope includes the current approved root families:
  - `root-admin`
  - `login`
  - `design-system`
- business modules are user-facing modules under one root family, not backend
  feature folders

## Recommended First Feature Boundary

The feature should own durable hierarchy truth, placement rules, lifecycle
rules, root-family distinctions, and resolved tree read models.

It should not absorb page-shell planning, route-rendering implementation,
frontend UI design, or broad permissions management in the same first slice.

Recommended downstream consumers:

- `pageShellPlanning` reads planner-selectable hierarchy values through this
  feature's exported seams
- future route-generation and frontend-structure generation read resolved tree
  projections through this feature's exported seams

## Open Follow-On Questions For PRD Refinement

- whether live-route compatibility blockers differ for root admin, tenant-side,
  public auth, and design-system surfaces
- whether route aliases or redirects are needed before some live-page moves are
  allowed
- whether future tenant-facing editors can propose hierarchy changes without
  publishing them directly
- whether module ownership metadata needs a stronger durable contract than the
  current optional first-pass business-owner field
