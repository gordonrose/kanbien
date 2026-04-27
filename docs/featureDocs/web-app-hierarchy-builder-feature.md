# Web App Hierarchy Builder Feature Reference

## Purpose

The `webAppHierarchyBuilder` feature owns durable curated hierarchy truth for
the web app.

Today it ships the backend foundation for:

- root-managed module and page creation
- module landing-page selection for direct child pages
- page metadata updates and safe moves
- resolved tree reads, planner-node reads, and orphan review
- explicit-input bootstrap from observed page trees
- structure-aware discovery reconcile preview and apply
- durable page-locator and discovery-link truth
- chained discovery-backed sync that can run discovery, apply the
  structure-aware reconcile rules, and return the updated curated tree
- canonical-rendering registry sync that materializes live design-system
  canonical rendering families and refs into durable hierarchy pages
- proposed `design-system` page and subpage creation through governed topology
- deterministic `design-system` preview/apply materialization with applied-only
  tree reads
- a first browser-wired root-admin operator surface that consumes the signed-off
  `hierarchy-tree` family for the governed `design-system` create/preview/apply
  flow

This feature still does not ship automated event-driven reconcile.

## Where It Lives

- `src/features/webAppHierarchyBuilder/contract`
- `src/features/webAppHierarchyBuilder/domain`
- `src/features/webAppHierarchyBuilder/persistence`
- `src/features/webAppHierarchyBuilder/transport`
- `src/features/webAppHierarchyBuilder/integration.ts`
- `src/features/webAppHierarchyBuilder/index.ts`

## Current Boundaries

- curated hierarchy truth remains separate from discovered app truth
- `GET /tree` reads curated hierarchy only; it does not run discovery on read
- `POST /discovery-sync/preview` is the no-mutation operator seam for trying
  structure-aware reconcile before changing curated truth
- `POST /discovery-sync/apply` mutates curated truth from the current
  discovered structure truth
- `POST /design-system/materialization/preview` is the no-mutation operator
  seam for the new design-system materialization flow
- `POST /design-system/materialization/apply` marks selected proposed
  design-system pages applied, writes the generated page scaffold, and returns
  the refreshed applied design-system tree
- `POST /sync-discovery` remains as a compatibility wrapper that runs
  discovery and then applies the structure-aware reconcile rules
- `POST /design-system/canonical-renderings/sync` reads live canonical
  rendering families through the `designSystemCanonicals` public seam and
  upserts the durable `Canonical Renderings` hierarchy branch
- the current root-admin hierarchy browser workflow performs that same refresh
  chain through `POST /v1/web-app-surface-discovery/runs` followed by
  `POST /v1/web-app-hierarchy/discovery-sync/apply`, then syncs canonical
  rendering registry pages through
  `POST /v1/web-app-hierarchy/design-system/canonical-renderings/sync`
- `webAppPageLocator` owns curated locator truth for path and hash-state pages
- `webAppDiscoveryLink` owns durable discovered-to-curated match and drift
  posture
- module landing-page truth remains topology-owned even though the broader
  operator workspace now has a sibling `Page Settings` capability family

## Current API Surface

Base path:

- `/v1/web-app-hierarchy`

Routes:

- `POST /modules`
- `PATCH /modules/:webAppModuleId`
- `PATCH /modules/:webAppModuleId/landing-page`
- `POST /pages`
- `POST /design-system/pages`
- `POST /design-system/subpages`
- `PATCH /pages/:webAppPageId`
- `POST /pages/:webAppPageId/move`
- `GET /tree`
- `GET /design-system/applied-tree`
- `GET /planner-nodes`
- `GET /orphaned-pages`
- `POST /bootstrap`
- `POST /design-system/materialization/preview`
- `POST /design-system/materialization/apply`
- `POST /design-system/canonical-renderings/sync`
- `POST /discovery-sync/preview`
- `POST /discovery-sync/apply`
- `GET /discovery-links`
- `POST /sync-discovery`

## Discovery Sync Notes

- the preview and apply flows consume the exported structure-aware
  `webAppSurfaceDiscovery` seam
- discovered `group` nodes map to curated modules by default
- deeper discovered groups under the first module group become child pages in
  the curated tree
- path-backed discovered root-admin suite routes such as `/root-admin/users`
  can now become real curated pages through `path` active locators
- legacy root-admin hash URLs remain compatibility aliases during the current
  migration window rather than canonical route truth
- support-only and review-required discovered leaves remain blocked from
  silent import
- metadata drift is surfaced through discovery-link status rather than being
  silently overwritten by default
- sync never makes `GetTree` depend on live discovery and does not silently
  delete curated hierarchy rows
- the first materialization slice is intentionally narrow:
  - `templateKey` must be `static-html-page`
  - folder creation is allowed
  - folder moves remain out of scope
  - generated output is `index.html` plus the design-system governance stub

## Verification Status

Current executable evidence includes:

- `tests/unit/webAppHierarchyBuilder/service.test.ts`
- `tests/integration/webAppHierarchyBuilder/flow.test.ts`
- `tests/security/webAppHierarchyBuilder/security.test.ts`
- `tests/audit/webAppHierarchyBuilder/audit.test.ts`
- `tests/integration/webAppHierarchyBuilder/persistence.test.ts`
