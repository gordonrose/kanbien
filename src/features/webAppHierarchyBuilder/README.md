# webAppHierarchyBuilder

Owns durable platform truth for the root-family, module, and page hierarchy used
by root-admin planning and later downstream generation seams.

## Current capabilities

- create and update curated modules
- create, update, and move curated pages
- read the resolved curated hierarchy tree, planner nodes, and orphaned pages
- bootstrap curated hierarchy from explicit input
- preview and apply structure-aware discovery reconcile
- list durable discovery-link and drift status
- run a compatibility `sync-discovery` action that wraps the structure-aware
  reconcile flow
- create proposed `design-system` pages and subpages through governed topology
- preview and apply deterministic `design-system` materialization
- read the applied-only `design-system` tree separately from the broader
  curated tree
- support the first browser-wired root-admin operator flow for the governed
  `design-system` create/preview/apply slice

## Current modeling posture

- curated hierarchy truth remains separate from discovered truth
- proposed and applied page truth can now diverge for the governed
  `design-system` materialization slice
- active page locator truth is stored explicitly so curated pages can represent
  both path-backed and hash-state-backed pages honestly
- durable discovery links track which discovered nodes and surfaces map to
  curated modules and pages over time

## Important boundaries

- `GET /tree` remains a pure curated read; it does not run discovery on demand
- `GET /design-system/applied-tree` reads applied-only `design-system` truth
  for the new preview/apply workflow
- `webAppSurfaceDiscovery` owns discovery persistence and exposes a public read
  seam consumed by reconcile flows
- support-only discovered routes remain non-importable even though they are
  persisted on the discovery side
