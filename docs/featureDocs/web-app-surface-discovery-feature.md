# Web App Surface Discovery Feature Reference

## Purpose

The `webAppSurfaceDiscovery` feature owns durable discovered truth about the
web app's currently implemented route and page surfaces.

Today it ships the backend foundation for:

- root-triggered discovery runs over approved provider seams
- durable storage of current discovered surfaces
- durable storage of current discovered structure nodes
- durable run history for later stale review and drift reasoning
- explicit differentiation between:
  - path-backed page routes
  - hash-backed shell states
  - support-only technical routes
- explicit discovered tree truth for:
  - root nodes
  - grouping nodes
  - linked leaf nodes

This feature does not yet ship automated scheduled refresh, topic-driven
refresh, or any frontend operator UI.

## Where It Lives

- `src/features/webAppSurfaceDiscovery/contract`
- `src/features/webAppSurfaceDiscovery/domain`
- `src/features/webAppSurfaceDiscovery/persistence`
- `src/features/webAppSurfaceDiscovery/transport`
- `src/features/webAppSurfaceDiscovery/integration.ts`
- `src/features/webAppSurfaceDiscovery/index.ts`

## Platform Integration

Feature export:

- `createWebAppSurfaceDiscoveryFeature`

Current mount point:

- `src/routes/v1/index.ts`
- base route: `/v1/web-app-surface-discovery`

Protected routes are mounted behind:

- shared root-session authentication
- shared authenticated-general rate limiting
- shared root capability enforcement
- shared platform-security audit visibility for denied capability checks

## Runtime Contracts

### Feature factory

The feature entry point expects:

- raw `pg` `Pool`
- a `RootCapabilityChecker`
- shared platform-security repository for denial audit visibility

`integration.ts` owns repository and provider wiring.
`transport/router.ts` owns request parsing and authz composition.
The domain layer owns provider normalization, stale handling, and durable run
summaries.

### Cross-feature seams

`webAppSurfaceDiscovery` currently depends on:

- shared root-session authentication
- shared root capability middleware
- shared platform-security audit repository
- approved frontend discovery provider seams under:
  - `src/frontend/designSystem/discovery.ts`
  - `src/frontend/rootAdminShell/discovery.ts`
  - `src/frontend/login/discovery.ts`

This feature now exports a public discovery seam used by
`webAppHierarchyBuilder` for structure-aware reconcile preview, apply, and the
compatibility sync chain.

## Relationship To Root Roles

`webAppSurfaceDiscovery` does not own authorization policy.
It depends on these capability keys in the root capability catalog:

- `web-app-surface-discovery.run`
- `web-app-surface-discovery.read`
- `web-app-surface-discovery.read-runs`
- `web-app-surface-discovery.read-structure`

## API Surface

Base path:

- `/v1/web-app-surface-discovery`

Routes:

- `POST /v1/web-app-surface-discovery/runs`
- `GET /v1/web-app-surface-discovery/surfaces`
- `GET /v1/web-app-surface-discovery/surfaces/:discoveredWebAppSurfaceId`
- `GET /v1/web-app-surface-discovery/structure`
- `GET /v1/web-app-surface-discovery/structure/:discoveredWebAppStructureNodeId`
- `GET /v1/web-app-surface-discovery/runs`
- `GET /v1/web-app-surface-discovery/runs/:webAppDiscoveryRunId`

## Request Semantics

### Discovery run

`POST /v1/web-app-surface-discovery/runs`

Rules:

- accepts only the approved scope
  `current-approved-root-families`
- accepts only the explicit v1 trigger kind
  `manual`
- clients may not supply system-managed ids, timestamps, or counts
- the route persists discovered truth but does not mutate curated hierarchy

### Discovery reads

Rules:

- exact read requires a durable discovered-surface id or run id
- exact structure read requires a durable discovered-structure-node id
- list routes follow repo pagination defaults
- surface filters are explicit:
  - `rootFamilyId`
  - `surfaceKind`
  - `userFacingDisposition`
  - `providerKey`
  - `staleStatus`
- structure-tree filters are explicit:
  - `rootFamilyId`
  - `staleStatus`
- run-history filters are explicit:
  - `status`
  - `triggerKind`

## Discovery And Stale Semantics

- supported root families in the current slice are:
  `root-admin`, `login`, and `design-system`
- support-only routes are persisted as discovered truth and must not be
  flattened into importable page truth
- hash-backed shell states remain hash-backed discovered truth; the feature
  does not reinterpret them as path-backed pages
- multi-segment route families can now be persisted as discovered tree truth
  without inventing curated hierarchy nodes
- successful runs mark previously discovered but newly unseen surfaces stale
- successful runs also mark previously discovered but newly unseen structure
  nodes stale
- failed runs preserve run history without rewriting stale posture from that
  failed attempt

## Persistence Model

The feature owns these durable tables:

- `web_app_discovery_runs`
- `discovered_web_app_surfaces`
- `discovered_web_app_surface_observations`
- `discovered_web_app_structure_nodes`
- `discovered_web_app_structure_observations`

The foundation keeps:

- explicit discovery-run history
- stable discovered-surface identity
- stable discovered-structure-node identity
- durable first-seen and last-seen timestamps
- current stale posture without hard delete during normal refresh
- per-run observation snapshots for auditability and future reconcile support

## Verification Status

Current executable evidence for this feature includes:

- unit service coverage:
  `tests/unit/webAppSurfaceDiscovery/service.test.ts`
- protected route integration coverage:
  `tests/integration/webAppSurfaceDiscovery/flow.test.ts`
- root-only security coverage:
  `tests/security/webAppSurfaceDiscovery/security.test.ts`
- audit visibility coverage:
  `tests/audit/webAppSurfaceDiscovery/audit.test.ts`
- Postgres-backed repository coverage:
  `tests/integration/webAppSurfaceDiscovery/persistence.test.ts`

## Notes

- v1 uses root-triggered sync only; startup, scheduled, and topic-driven sync
  remain deferred
- `/login` remains an approved root family even though its current provider
  reports zero implemented discovered surfaces
- later hierarchy import and drift review should consume exported discovery
  reads instead of rescanning frontend implementation directly
- the exported public seam now covers both discovered surfaces and discovered
  structure nodes so later hierarchy reconcile work can depend on discovered
  tree truth without importing private discovery persistence
