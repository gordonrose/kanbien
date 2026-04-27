# Web App Hierarchy Builder API Contract

## Scope

- Contract name: `web-app-hierarchy-builder`
- Feature: `webAppHierarchyBuilder`
- Route family or capability group:
  protected root-only hierarchy-management backend routes
- In-scope routes:
  - `POST /v1/web-app-hierarchy/modules`
  - `PATCH /v1/web-app-hierarchy/modules/{webAppModuleId}`
  - `PATCH /v1/web-app-hierarchy/modules/{webAppModuleId}/landing-page`
  - `POST /v1/web-app-hierarchy/pages`
  - `POST /v1/web-app-hierarchy/design-system/pages`
  - `POST /v1/web-app-hierarchy/design-system/subpages`
  - `PATCH /v1/web-app-hierarchy/pages/{webAppPageId}`
  - `POST /v1/web-app-hierarchy/pages/{webAppPageId}/move`
  - `GET /v1/web-app-hierarchy/tree`
  - `GET /v1/web-app-hierarchy/design-system/applied-tree`
  - `GET /v1/web-app-hierarchy/planner-nodes`
  - `GET /v1/web-app-hierarchy/orphaned-pages`
  - `POST /v1/web-app-hierarchy/bootstrap`
  - `POST /v1/web-app-hierarchy/design-system/materialization/preview`
  - `POST /v1/web-app-hierarchy/design-system/materialization/apply`
  - `POST /v1/web-app-hierarchy/design-system/canonical-renderings/sync`
  - `POST /v1/web-app-hierarchy/discovery-sync/preview`
  - `POST /v1/web-app-hierarchy/discovery-sync/apply`
  - `GET /v1/web-app-hierarchy/discovery-links`
  - `POST /v1/web-app-hierarchy/sync-discovery`

## Capability

- Feature: `webAppHierarchyBuilder`
- Capability:
  manage durable root-family-aware module and page hierarchy truth for the web
  app through root-only backend routes

## Authentication

- Required auth state:
  authenticated root-user session is required for every route in this family
- Session transport(s):
  - `Authorization: Bearer <sessionId>`
  - same-origin root-admin browser session cookie through shared root-session
    middleware

## Authorization

- Allowed roles:
  `RootUserAdmin` in the current implemented slice
- Enforcement point:
  shared `requireRootSession` middleware at `/v1` plus
  `createRequireRootCapability(...)` checks using `web-app-hierarchy.*`
  capability keys

## Middleware And Platform Effects

- Route protection middleware:
  shared root-session middleware rejects missing accepted session transport
  with `401 UNAUTHORIZED` and invalid/expired sessions with `401 INVALID_SESSION`
- Rate limiting / abuse controls:
  shared authenticated-general rate limiting applies to the mounted
  `web-app-hierarchy` route family and may return `429 RATE_LIMITED`

## Request Contract

- Params:
  - `webAppModuleId` and `webAppPageId` are required where present and must be
    exact UUIDs
- Query:
  - `GET /tree` supports:
    `includeInactive`, `includeOrphaned`
  - `GET /planner-nodes` supports:
    `includeInactive`
  - `GET /orphaned-pages` supports:
    `includeInactive`, `rootFamilyId`
  - `GET /discovery-links` supports:
    `rootFamilyId`, `linkStatus`, `driftStatus`, `curatedTargetType`,
    `page`, `pageSize`
- Body:
  - create module:
    `{ rootFamilyId, moduleKey, displayLabel, status?, sortOrder? }`
  - update module:
    at least one of `{ displayLabel?, status?, sortOrder? }`
  - update module landing page:
    `{ landingPageWebAppPageId }` where the value is an exact UUID or `null`
  - create page:
    `{ rootFamilyId, webAppModuleId, parentPageId?, placementType?, pageKey, displayLabel, routeSegment, status?, sortOrder? }`
  - create proposed design-system page:
    `{ webAppModuleId, displayLabel, routeSegment, templateKey }`
  - create proposed design-system subpage:
    `{ parentPageId, displayLabel, routeSegment, templateKey }`
  - update page:
    at least one of `{ displayLabel?, routeSegment?, status?, sortOrder? }`
  - move page:
    `{ rootFamilyId, webAppModuleId, targetParentPageId?, placementType, sortOrder? }`
  - bootstrap:
    `{ observedRootFamilies: [{ rootFamilyId, modules: [{ moduleKey, displayLabel, status?, sortOrder?, pages: [...] }] }] }`
  - preview structure-aware discovery sync:
    `{ rootFamilyIds?, selectedDiscoveredWebAppStructureNodeIds?, includeBlocked?, includeStaleDiscovered?, includeMetadataDrift? }`
  - preview design-system materialization:
    `{ proposalPageIds }`
  - apply design-system materialization:
    `{ proposalPageIds, previewHash }`
  - sync design-system canonical renderings:
    `{}`
  - apply structure-aware discovery sync:
    `{ rootFamilyIds?, selectedDiscoveredWebAppStructureNodeIds?, includeBlocked?, includeStaleDiscovered?, includeMetadataDrift?, includeInactive?, includeOrphaned? }`
  - sync discovery:
    `{ includeInactive?, includeOrphaned? }`
- Validation rules:
  - request bodies and query objects are strict; unexpected fields are rejected
  - `rootFamilyId` must be one of:
    `root-admin`, `login`, `design-system`
  - `status` must be one of:
    `draft`, `review`, `live`, `inactive`
  - `placementType` must be one of:
    `module-root`, `child-page`, `orphaned`
  - `templateKey` for the v1 design-system materialization slice must be:
    `static-html-page`
  - `landingPageWebAppPageId` must be `null` or an exact UUID for a direct
    child page of the selected module
  - `moduleKey`, `pageKey`, and `routeSegment` are trimmed and normalized to
    lowercase before persistence and uniqueness checks
  - clients must not supply system-managed fields such as ids, timestamps,
    `resolvedFullRoutePath`, or `createdByRootAdminUserId`

## Response Contract

- Success payload:
  - module mutations return:
    `{ webAppModuleId, rootFamilyId, moduleKey, displayLabel, landingPageWebAppPageId, status, sortOrder, createdAt, updatedAt }`
  - page mutations return:
    `{ webAppPageId, rootFamilyId, webAppModuleId, parentPageId, placementType, pageKey, displayLabel, routeSegment, resolvedFullRoutePath, status, sortOrder, createdByRootAdminUserId, bootstrapSource, topologyState, templateKey, materializedAt, createdAt, updatedAt, activeLocator }`
  - proposed design-system page/subpage create returns:
    `{ proposalPage, proposalStatus }`
  - `/tree` returns:
    `{ rootFamilies: [{ rootFamilyId, displayLabel, routePrefix, sortOrder, createdAt, updatedAt, modules: [...] }] }`
  - `/design-system/applied-tree` returns:
    the applied-only `design-system` hierarchy tree
  - `/planner-nodes` returns a flat array of module/page planner projections
  - `/orphaned-pages` returns a flat array of orphaned page summaries
  - `/design-system/materialization/preview` returns:
    `{ classification, previewHash, proposalCount, items }`
  - `/design-system/materialization/apply` returns:
    `{ classification, previewHash, appliedPageCount, items, tree }`
  - `/design-system/canonical-renderings/sync` returns:
    `{ syncSummary, tree }`
  - `/discovery-sync/preview` returns:
    `{ previewSummary, items }`
  - `/discovery-sync/apply` returns:
    `{ previewSummary, applySummary, items, tree }`
  - `/discovery-links` returns:
    `{ items, page, pageSize, totalPages, totalMatchingRecords }`
  - `/sync-discovery` returns:
    `{ discoveryRun, syncSummary, blockedSurfaces, tree }`
- Status code:
  - `201` for create success
  - `200` for reads, updates, moves, bootstrap, and sync-discovery

## Error Contract

- Error codes:
  - feature-local:
    - `INVALID_REQUEST`
    - `WEB_APP_ROOT_FAMILY_NOT_FOUND`
    - `WEB_APP_MODULE_NOT_FOUND`
    - `WEB_APP_PAGE_NOT_FOUND`
    - `WEB_APP_MODULE_KEY_ALREADY_EXISTS`
    - `WEB_APP_PAGE_KEY_ALREADY_EXISTS`
    - `WEB_APP_ROUTE_SEGMENT_ALREADY_EXISTS`
    - `WEB_APP_INVALID_PLACEMENT`
    - `WEB_APP_HIERARCHY_CYCLE`
    - `WEB_APP_LIVE_ROUTE_CHANGE_BLOCKED`
    - `WEB_APP_UNSUPPORTED_DESIGN_SYSTEM_TEMPLATE`
    - `WEB_APP_DESIGN_SYSTEM_PREVIEW_MISMATCH`
    - `WEB_APP_DESIGN_SYSTEM_MATERIALIZATION_BLOCKED`
    - `WEB_APP_DISCOVERY_SYNC_CONFLICT`
    - `WEB_APP_PAGE_LOCATOR_CONFLICT`
    - `WEB_APP_DISCOVERY_LINK_CONFLICT`
    - `WEB_APP_INVALID_MODULE_LANDING_PAGE`
  - shared middleware:
    - `UNAUTHORIZED`
    - `INVALID_SESSION`
    - `FORBIDDEN`
    - `RATE_LIMITED`

## Persistence / Side Effects

- Durable writes:
  - migration seeds `web_app_root_families` with `root-admin`, `login`, and
    `design-system`
  - module create/update mutates `web_app_modules`
  - module landing-page updates mutate
    `web_app_modules.landing_page_web_app_page_id`
  - page create/update/move/bootstrap mutate `web_app_pages`
  - proposed design-system page/subpage create also mutates `web_app_pages`,
    but with `topology_state = proposed`
  - design-system materialization apply writes generated page files and the
    design-system governance stub, marks selected proposal pages applied, and
    upserts active path locators
  - design-system canonical-renderings sync reads live families and references
    through the `designSystemCanonicals` public seam, upserts the
    `canonical-renderings` module, creates or refreshes launcher and
    canonical-rendering pages, and upserts active path locators
  - structure-aware apply and sync-discovery may mutate `web_app_modules`,
    `web_app_pages`, `web_app_page_locators`, and `web_app_discovery_links`
    after reading current discovered truth through the public
    `webAppSurfaceDiscovery` seam
  - route-affecting page mutations refresh derived `resolved_full_route_path`
    values for affected branches
- Audit effects:
  - denied capability-gated requests create shared platform security audit
    events through the central authz middleware
  - successful mutations are currently operator-visible through authenticated
    backend responses; no feature-local durable success-audit table exists yet

## Compatibility / Lifecycle Notes

- `routeSegment` remains the page-tree segment field, but active locator truth
  now lives in `webAppPageLocator`
- `topologyState` now distinguishes broader curated proposal rows from applied
  rows for the governed `design-system` materialization slice
- `resolvedFullRoutePath` is still server-managed; for migrated root-admin
  suite pages it now resolves to the active canonical path such as
  `/root-admin/users`, while intentional hash-state pages still resolve to
  their active canonical locator form
- `GET /tree` remains the broader curated read, while
  `GET /design-system/applied-tree` is the workflow-specific applied-only read
- route-affecting changes for live branches are blocked in the current slice
  because redirect/alias compatibility support is not implemented yet
- bootstrap is honest but narrow: the route accepts explicitly supplied
  observed navigable pages and persists them; it does not yet auto-discover
  browser routes from the running app
- preview and apply are now the primary structure-aware reconcile capabilities
- sync-discovery is the explicit root-driven compatibility chain that runs
  discovery and then applies the same structure-aware reconcile rules
- sync-discovery does not make `GET /tree` merge live discovery on read
- the current root-admin hierarchy browser workflow now performs that chain as
  explicit calls:
  `POST /v1/web-app-surface-discovery/runs` followed by
  `POST /v1/web-app-hierarchy/discovery-sync/apply`, then
  `POST /v1/web-app-hierarchy/design-system/canonical-renderings/sync`
- canonical-rendering registry sync does not discover browser routes. It
  materializes the design-system canonical registry into the durable hierarchy
  tree so canonical rendering pages appear alongside other curated pages.
- multi-segment discovered paths are now mapped through modules plus child
  pages rather than being blocked by default
- discovered pages are represented through their honest active locator model;
  migrated root-admin suites now use canonical `path` locators while
  intentional hash-state pages remain explicit where that posture is still
  approved
- planner reads exclude orphaned pages by default and exclude inactive pages
  unless explicitly requested
