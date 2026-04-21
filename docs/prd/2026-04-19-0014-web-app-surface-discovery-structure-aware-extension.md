# Web App Surface Discovery Structure-Aware Extension Specification

## Implementation Status

- Status:
  planned backend extension slice as of 2026-04-19
- Implemented already in the foundation slice:
  - durable discovery-run persistence
  - durable discovered-surface persistence
  - durable discovered-surface observation history
  - root-triggered discovery run route
  - current discovered-surface reads
  - discovery-run history reads
  - first chained sync from discovery into curated hierarchy for a limited
    importable subset
- Not yet implemented in this extension:
  - durable discovered structure-node persistence
  - durable discovered structure observation history
  - structure-aware provider output normalization
  - current discovered structure-tree reads
  - exact discovered structure-node reads
  - structure-aware reconcile preview or apply flows in
    `webAppHierarchyBuilder`

## Purpose

Define the next backend extension slice for `webAppSurfaceDiscovery` so the
platform can persist discovered app structure, not only flat discovered leaf
surfaces.

The current foundation can answer:

- what discovered surface exists
- what locator shape it has
- whether it is user-facing, support-only, or review-required
- when it was first seen, last seen, or became stale

That foundation cannot yet answer:

- what explicit discovered grouping or container nodes exist between the root
  family and a leaf surface
- how multi-segment route families should be represented as a discovered tree
- how later reconcile work should consume real discovered structure instead of
  inferring it from path strings

This extension introduces a structure-aware discovery model so the platform can
persist discovered tree truth for route families such as:

- `/design-system/components/top-nav`
- `/design-system/patterns/hierarchy-tree/render`

without inventing curated hierarchy nodes prematurely.

It provides the backend capabilities required for:

- durable storage of current discovered structure nodes
- durable storage of discovered structure observation history
- root-triggered structure-aware discovery refresh
- current discovered structure-tree reads
- exact discovered structure-node reads
- a clean upstream discovered-tree seam for later structure-aware reconcile
  work in `webAppHierarchyBuilder`

It also establishes:

- separation between discovered surface truth and discovered structure truth
- explicit root, group, and leaf-node kinds
- safe stale reasoning for discovered structure
- compatibility with the existing discovered-surface foundation rather than a
  replacement of it

---

## Scope

This phase includes:

- an additive extension to `src/features/webAppSurfaceDiscovery/`
- durable storage for:
  - discovered web-app structure nodes
  - discovered web-app structure observations
- structure-aware provider output normalization
- root-only protected structure-tree reads under
  `/v1/web-app-surface-discovery`
- additive structure-aware counts or summaries during discovery runs
- exported public discovery structure reads for later hierarchy reconcile
  consumers

This phase does **not** include:

- frontend discovery review UI
- direct mutation of curated hierarchy truth from the discovery feature
- automatic import of discovered group nodes into curated hierarchy
- event or topic-driven refresh
- automatic remapping of multi-segment discovered paths into curated hierarchy
  without a later approved reconcile loop
- arbitrary DOM scraping or heuristic crawling

Those later concerns should build on this durable discovered-tree seam rather
than being collapsed into the extension.

---

## Core Concepts

### Discovered web-app surface

The existing `discoveredWebAppSurface` remains the durable current-state
lineage for one concrete implemented app surface.

Examples:

- `/design-system/components/top-nav`
- `/root-admin#users`
- `/root-admin/helper/download/root-auth-signer-helper.mjs`

It remains the canonical leaf truth for locator, classification, and
provider-relevant metadata.

### Discovered web-app structure node

A `discoveredWebAppStructureNode` is the durable current-state lineage for one
node in the discovered app structure tree.

Unlike a discovered surface, it may represent:

- a discovered root node
- a discovered grouping node
- a discovered leaf node linked to a concrete discovered surface

Examples:

For `/design-system/components/top-nav`:

- root node:
  `design-system`
- group node:
  `components`
- page leaf node:
  `top-nav`

For `/root-admin#users`:

- root node:
  `root-admin`
- shell-state leaf node:
  `users`

### Discovered structure observation history

A `discoveredWebAppStructureObservation` is the per-run observation record for
one discovered structure node.

It preserves structure history without forcing the current structure-node
lineage to also act as the full run history log.

### Structure node kind

The extension must support explicit node kinds so grouping nodes are not
misrepresented as pages.

Approved first-pass node kinds:

- `root`
- `group`
- `page-surface`
- `shell-state-surface`
- `support-surface`
- `review-required-surface`

### Linked leaf truth

Leaf structure nodes may link to a concrete discovered surface.

That means:

- discovered surface truth remains canonical for locator shape and leaf
  metadata
- discovered structure truth remains canonical for parent-child shape and node
  kind

### Structure-aware provider seam

Approved route-family providers should evolve from flat surface output to
structure-aware output.

That output should let discovery persist:

- discovered surfaces
- discovered structure nodes
- the intended parent-child relationships

without forcing discovery to infer grouping from raw strings later.

### Structure stale posture

Discovered structure must follow the same safe stale rules as discovered
surfaces:

- structure nodes become stale only after absence from a newer successful run
  for the same scope
- failed runs must not mark structure stale by themselves
- current stale structure remains queryable for operator review

### Reconcile boundary

This extension still does not move structure-aware reconcile into
`webAppSurfaceDiscovery`.

Why:

- discovery owns discovered truth
- `webAppHierarchyBuilder` owns curated hierarchy truth
- later reconcile must decide how discovered groups map, if at all, into
  curated modules or pages

This extension’s responsibility is to expose an honest discovered tree for
that later work.

---

## Recommended Feature Boundary

Keep the same feature owner:

`src/features/webAppSurfaceDiscovery/`

This extension should own:

- durable discovered structure-node records
- durable discovered structure observation rows
- structure-aware provider orchestration and normalization
- structure-tree reads
- exact structure-node reads
- exported structure-aware discovery seams for later reconcile consumers

This extension should not own:

- curated hierarchy modules or pages
- structure-aware import or reconcile writes into
  `webAppHierarchyBuilder`
- frontend authoring or review UI
- automatic mapping of discovered groups into curated hierarchy containers

Related feature boundary:

- `src/features/webAppHierarchyBuilder/`
  remains the owner of curated hierarchy truth
- a later structure-aware reconcile subdomain inside
  `webAppHierarchyBuilder`
  should own preview or apply behavior using structure reads from
  `webAppSurfaceDiscovery`

---

## Proposed Durable Entities

### Discovered Web App Structure Node

Expected minimum fields:

- `discoveredWebAppStructureNodeId`
- `rootFamilyId`
- `discoveryStructureKey`
- `parentDiscoveredWebAppStructureNodeId`
- `nodeKind`
- `segmentKey`
- `displayLabel`
- `depth`
- `sortOrderHint`
- `linkedDiscoveredWebAppSurfaceId`
- `providerKey`
- `implementationSourcePath`
- `firstDiscoveredRunId`
- `lastDiscoveredRunId`
- `firstDiscoveredAt`
- `lastDiscoveredAt`
- `staleAt`
- `createdAt`
- `updatedAt`

Rules:

- root nodes must have null parent and depth `0`
- non-root nodes must have a valid parent and depth greater than `0`
- grouping nodes must not require a linked discovered surface
- leaf nodes should link to a discovered surface when one exists
- structure identity must be durable and unique

### Discovered Web App Structure Observation

Expected minimum fields:

- `discoveredWebAppStructureObservationId`
- `webAppDiscoveryRunId`
- `discoveredWebAppStructureNodeId`
- `rootFamilyId`
- `parentDiscoveredWebAppStructureNodeId`
- `nodeKind`
- `segmentKey`
- `displayLabel`
- `depth`
- `linkedDiscoveredWebAppSurfaceId`
- `providerKey`
- `implementationSourcePath`
- `observedAt`
- `createdAt`

Rules:

- observation rows are append-only
- one run may produce many structure observations
- structure observations must remain linked to the current structure lineage
  and the run that observed it

### Existing entities retained

The extension must keep and reuse:

- `webAppDiscoveryRun`
- `discoveredWebAppSurface`
- `discoveredWebAppSurfaceObservation`

The extension is additive, not a replacement.

---

## Structure-Aware Provider Output

The provider contract should evolve to support output equivalent to:

- discovered surface candidates
- discovered structure-node candidates
- explicit parent-child relationships

Example for `/design-system/components/top-nav`:

- discovered surface:
  canonical locator `/design-system/components/top-nav`
- structure nodes:
  - `design-system` as `root`
  - `components` as `group`
  - `top-nav` as `page-surface`
- leaf structure node linked to the discovered surface

Example for `/root-admin#users`:

- discovered surface:
  canonical locator `/root-admin#users`
- structure nodes:
  - `root-admin` as `root`
  - `users` as `shell-state-surface`

Example for a support route:

- discovered surface:
  support route canonical locator
- structure nodes:
  root and any grouping nodes plus a leaf node of kind `support-surface`

The backend feature must validate:

- no duplicate structure identity keys in one run
- no malformed parent-child graphs
- no impossible node-kind or surface-link combinations

---

## API Surface

This extension should add or extend protected root-only routes under
`/v1/web-app-surface-discovery`.

Expected new or extended routes:

- extend `POST /v1/web-app-surface-discovery/runs`
  so the run persists both surface and structure truth
- `GET /v1/web-app-surface-discovery/structure-tree`
- `GET /v1/web-app-surface-discovery/structure-nodes/:discoveredWebAppStructureNodeId`

The route family should remain root-only and continue to use shared root auth
and capability enforcement.

---

## Request And Response Expectations

### Structure-aware discovery run

Request posture:

- same explicit scope model as the current discovery foundation
- no invented structure payloads accepted from clients

Response posture:

- retain the current discovery-run summary
- extend it with structure-aware counts or summary fields needed to review:
  - created structure nodes
  - refreshed structure nodes
  - unchanged structure nodes
  - stale structure nodes

### Structure-tree read

Request posture:

- explicit root-family selection
- explicit stale and node-kind posture filters only where needed

Response posture:

- stable structure-node ids
- parent-child relationships
- node kind
- display label
- depth
- linked discovered surface id when present
- provider source posture
- stale posture

### Exact structure-node read

Request posture:

- exact structure-node id only

Response posture:

- one stable structure-node projection with linked discovered surface metadata
  where applicable

---

## Authorization

The structure-aware extension remains root-only.

Expected capability posture:

- existing `web-app-surface-discovery.run`
  may remain the governing capability for discovery runs if the repo keeps run
  and structure persistence in one operator action
- add a new read capability such as:
  `web-app-surface-discovery.read-structure`
  for discovered structure-tree and exact-node reads

This should be finalized in implementation planning, but the extension must not
reuse broad read capability names if that would blur the contract between flat
surface reads and structure-tree reads.

---

## Persistence And Index Expectations

Migration requirements:

- add new durable structure-node table
- add new durable structure observation table
- seed any new structure-read capability key and default root-role grant
- update Postgres test harness registration when needed

Expected indexes and constraints:

- primary key on structure nodes
- primary key on structure observations
- unique index on `discoveryStructureKey`
- self-referencing parent index for tree traversal
- index on `(rootFamilyId, parentDiscoveredWebAppStructureNodeId, nodeKind)`
- index on `(rootFamilyId, staleAt, lastDiscoveredAt)`
- optional foreign key index on `linkedDiscoveredWebAppSurfaceId`

Expected compatibility posture:

- do not remove or reinterpret existing discovered-surface rows
- do not force grouping nodes into the discovered-surface table
- do not hard-delete stale structure rows during normal refresh

---

## Expected Downstream Impact

This extension is a prerequisite for later honest reconcile improvements.

It should let the platform move from:

- blocking many multi-segment discovered paths as unsupported

toward:

- comparing curated hierarchy against an explicit discovered tree
- deciding how discovered grouping nodes should map into curated modules or
  pages through a later approved reconcile loop

This extension should not itself decide those mappings.

---

## Verification Expectations

Required verification layers for the next implementation loop:

- unit:
  - structure-node normalization
  - parent-child graph validation
  - node-kind validation
  - stale-marking rules for structure
- integration:
  - root-triggered structure-aware discovery run
  - current structure-tree reads
  - exact structure-node reads
  - repeated-run stale posture behavior
- security:
  - root-only enforcement
  - deny unauthenticated callers
  - deny callers lacking structure-read capability
  - reject client control over system-managed fields
- audit:
  - denied structure-read visibility
  - successful structure-aware discovery run visibility if required by current
    platform audit posture
- edge:
  - malformed provider graph output
  - duplicate sibling structure keys
  - empty approved family such as current `login`
  - mixed support and user-facing leaves under one group
- persistence-backed:
  - uniqueness
  - self-referencing parent integrity
  - leaf-to-surface link integrity
  - stale marking without delete

---

## Documentation Expectations

When this extension is implemented, update:

- feature docs for `webAppSurfaceDiscovery`
- source-independent API contract docs for the new structure-tree reads
- OpenAPI
- Postman collections if maintained for this route family
- data dictionary entries for:
  - discovered-web-app-structure-node
  - discovered-web-app-structure-observation

---

## Recommended Next Artifact Sequence

1. PRD-derived test-case doc for this extension
2. implementation blueprint
3. implementation
4. structure-aware reconcile follow-on loop in `webAppHierarchyBuilder`
