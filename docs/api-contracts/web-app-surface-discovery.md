# Web App Surface Discovery API Contract

## Scope

- Contract name: `web-app-surface-discovery`
- Feature: `webAppSurfaceDiscovery`
- Route family or capability group:
  protected root-only discovery backend routes
- In-scope routes:
  - `POST /v1/web-app-surface-discovery/runs`
  - `GET /v1/web-app-surface-discovery/surfaces`
  - `GET /v1/web-app-surface-discovery/surfaces/{discoveredWebAppSurfaceId}`
  - `GET /v1/web-app-surface-discovery/structure`
  - `GET /v1/web-app-surface-discovery/structure/{discoveredWebAppStructureNodeId}`
  - `GET /v1/web-app-surface-discovery/runs`
  - `GET /v1/web-app-surface-discovery/runs/{webAppDiscoveryRunId}`

## Capability

- Feature: `webAppSurfaceDiscovery`
- Capability:
  discover and expose durable truth about implemented web-app route and page
  surfaces without mutating curated hierarchy truth

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
  `createRequireRootCapability(...)` checks using
  `web-app-surface-discovery.*` capability keys

## Middleware And Platform Effects

- Route protection middleware:
  shared root-session middleware rejects missing accepted session transport
  with `401 UNAUTHORIZED` and invalid or expired sessions with
  `401 INVALID_SESSION`
- Rate limiting / abuse controls:
  shared authenticated-general rate limiting applies to the mounted
  `web-app-surface-discovery` route family and may return `429 RATE_LIMITED`

## Request Contract

- Params:
  - `discoveredWebAppSurfaceId` and `webAppDiscoveryRunId` are required where
    present and must be exact UUIDs
  - `discoveredWebAppStructureNodeId` is required where present and must be an
    exact UUID
- Query:
  - `GET /surfaces` supports:
    `page`, `pageSize`, `rootFamilyId`, `surfaceKind`,
    `userFacingDisposition`, `providerKey`, `staleStatus`
  - `GET /structure` supports:
    `rootFamilyId`, `staleStatus`
  - `GET /runs` supports:
    `page`, `pageSize`, `status`, `triggerKind`
- Body:
  - discovery run:
    `{ scopeKey, triggerKind }`
- Validation rules:
  - request bodies and query objects are strict; unexpected fields are rejected
  - `scopeKey` must currently equal:
    `current-approved-root-families`
  - `triggerKind` must currently equal:
    `manual`
  - `rootFamilyId` must be one of:
    `root-admin`, `login`, `design-system`
  - `surfaceKind` must be one of:
    `page-route`, `shell-state`, `support-route`, `review-required`
  - `userFacingDisposition` must be one of:
    `user-facing`, `support-only`, `review-required`
  - `staleStatus` must be one of:
    `current`, `stale`, `all`
  - clients must not supply system-managed fields such as run ids, surface ids,
    timestamps, counts, or actor attribution

## Response Contract

- Success payload:
  - discovery-run create and exact read return:
    `{ webAppDiscoveryRunId, scopeKey, status, triggerKind, providerVersion, createdByRootAdminUserId, startedAt, completedAt, failureSummary, createdCount, refreshedCount, unchangedCount, staleCount, supportOnlyCount, reviewRequiredCount, structureCreatedCount, structureRefreshedCount, structureUnchangedCount, structureStaleCount, createdAt, updatedAt }`
  - discovered-surface exact read returns:
    `{ discoveredWebAppSurfaceId, rootFamilyId, discoveryKey, surfaceKind, locatorType, routePath, routeHash, canonicalLocator, displayLabel, userFacingDisposition, providerKey, implementationSourcePath, firstDiscoveredRunId, lastDiscoveredRunId, firstDiscoveredAt, lastDiscoveredAt, staleAt, createdAt, updatedAt }`
  - discovered-structure exact read returns:
    `{ discoveredWebAppStructureNodeId, rootFamilyId, structureKey, parentStructureKey, parentDiscoveredWebAppStructureNodeId, nodeKey, nodeKind, displayLabel, depth, linkedDiscoveredWebAppSurfaceId, providerKey, implementationSourcePath, firstDiscoveredRunId, lastDiscoveredRunId, firstDiscoveredAt, lastDiscoveredAt, staleAt, createdAt, updatedAt }`
  - discovered-structure tree read returns:
    `{ items, totalMatchingRecords }`
    where each item is a nested discovered-structure node with `children`
  - list routes return paginated payloads:
    `{ items, page, pageSize, totalPages, totalMatchingRecords }`
- Status code:
  - `200` for all current routes in this family

## Error Contract

- Error codes:
  - feature-local:
    - `INVALID_REQUEST`
    - `DISCOVERY_SCOPE_INVALID`
    - `DISCOVERY_RUN_NOT_FOUND`
    - `DISCOVERED_WEB_APP_SURFACE_NOT_FOUND`
    - `DISCOVERED_WEB_APP_STRUCTURE_NODE_NOT_FOUND`
    - `DISCOVERED_WEB_APP_SURFACE_LOCATOR_INVALID`
    - `DISCOVERED_WEB_APP_STRUCTURE_GRAPH_INVALID`
    - `DISCOVERED_WEB_APP_STRUCTURE_NODE_LINK_INVALID`
    - `DISCOVERY_PROVIDER_OUTPUT_INVALID`
  - shared middleware:
    - `UNAUTHORIZED`
    - `INVALID_SESSION`
    - `FORBIDDEN`
    - `RATE_LIMITED`

## Persistence / Side Effects

- Durable writes:
  - discovery runs mutate `web_app_discovery_runs`
  - current discovered truth mutates `discovered_web_app_surfaces`
  - current discovered structure mutates `discovered_web_app_structure_nodes`
  - per-run observation snapshots mutate
    `discovered_web_app_surface_observations`
    and `discovered_web_app_structure_observations`
- Audit effects:
  - denied capability-gated requests create shared platform-security audit
    events through the central authz middleware
  - successful runs are operator-visible through deterministic run responses;
    no separate feature-local success-audit table exists in v1

## Approved Provider And Boundary Notes

- approved current providers are:
  - `design-system-file-routes`
  - `root-admin-shell`
  - `login-empty-provider`
- provider discovery must read real implemented surfaces from approved seams;
  clients cannot post invented discovered pages directly
- discovery truth is separate from curated hierarchy truth
- discovered surface truth is separate from discovered structure truth, but
  leaf structure nodes may link to discovered surface rows
- support-only routes are persisted but remain explicitly non-importable
- failed runs preserve run history but do not silently rewrite curated
  hierarchy or reclassify hash-backed shell states as page routes

## Compatibility / Lifecycle Notes

- v1 supports explicit root-triggered sync only
- stale posture is durable and set only after a later successful run no longer
  observes a previously discovered surface or structure node
- `/login` remains an approved root family even though the current provider
  returns no discovered surfaces
- later `webAppHierarchyBuilder` reconcile capabilities should consume this
  feature's exported read seam rather than its private persistence tables
