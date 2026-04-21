# Web App Surface Discovery Structure-Aware Entity Model First Draft

## Status

- Draft status:
  first draft
- Intended future owning feature:
  `webAppSurfaceDiscovery`
- Purpose:
  extend the discovery model so it can persist discovered page structure, not
  only flat discovered leaf surfaces

## Why This Loop Exists

The current `webAppSurfaceDiscovery` foundation persists discovered leaf truth
well:

- discovery runs
- current discovered surfaces
- per-run discovered-surface observations

That is enough for:

- stale detection
- support-only classification
- simple chained sync for single-segment path routes

It is not enough for honest structure-aware reconcile when the real app
implements multi-segment route families such as:

- `/design-system/components/top-nav`
- `/design-system/patterns/hierarchy-tree/render`

Those paths imply discovered container structure such as:

- `design-system`
- `components`
- `top-nav`

The current flat discovered-surface model stores only the leaf route, not the
durable discovered parent-child shape between those segments.

## Goal

Extend `webAppSurfaceDiscovery` so it can durably store:

- discovered structure nodes
- discovered parent-child structure
- the link between structure leaves and discovered surface truth
- run-aware stale and observation history for discovered structure

This should let later hierarchy reconcile work consume an honest discovered
tree instead of inferring grouping from raw path strings.

## Consolidated Decisions

- discovered surface truth and discovered structure truth should both be owned
  by `webAppSurfaceDiscovery`
- structure truth should not replace discovered surface truth
- structure nodes and discovered surfaces must remain linked but distinct
- durable explicit structure is preferred over rebuilding structure from path
  strings on every read
- the model must support:
  - path-backed page routes
  - hash-backed shell states
  - support-only discovered routes
  - discovered grouping or container nodes that are not themselves pages
- structure nodes must not be silently promoted into curated hierarchy nodes
- stale posture for structure truth should follow the same safe principles as
  discovered surfaces:
  stale after absence from a newer successful run, not because of one failed
  run

## Truth-Layer Refinement

### Discovered Surface Truth

Discovered surface truth still answers:

- what concrete implemented route or shell state exists
- its locator shape
- its user-facing posture
- its provider source
- when it was first and last seen

Examples:

- `/design-system/components/top-nav`
- `/root-admin#users`
- `/root-admin/helper/download/root-auth-signer-helper.mjs`

### Discovered Structure Truth

Discovered structure truth answers:

- where a discovered surface sits in the discovered tree
- which container or grouping nodes exist between the root family and the leaf
- whether a node is a root, group, page leaf, shell-state leaf, or support
  leaf
- which discovered structure nodes were first seen, last seen, or became stale

Examples for `/design-system/components/top-nav`:

- root node:
  `design-system`
- group node:
  `components`
- leaf node:
  `top-nav`

### Curated Hierarchy Truth

Curated hierarchy truth remains owned by `webAppHierarchyBuilder`.

It should consume discovered structure truth later, but it must not become the
store for discovery-owned structure.

## Recommended Durable Entities

### 1. Discovered Web App Structure Node

- Description:
  durable current-state lineage for one discovered node in the implemented app
  structure tree
- Why it exists:
  preserves explicit discovered tree shape without forcing every grouping node
  to masquerade as a page surface

Recommended durable fields:

- `discoveredWebAppStructureNodeId`
  Type / Shape: `UUID`
- `rootFamilyId`
  Type / Shape: `'root-admin' | 'login' | 'design-system'`
- `discoveryStructureKey`
  Type / Shape: `TEXT`
  Description: stable normalized structure identity key
- `parentDiscoveredWebAppStructureNodeId`
  Type / Shape: `UUID | NULL`
  Description: nullable only for root-family-level discovered root nodes
- `nodeKind`
  Type / Shape:
  `'root' | 'group' | 'page-surface' | 'shell-state-surface' | 'support-surface' | 'review-required-surface'`
- `segmentKey`
  Type / Shape: `TEXT`
  Description: normalized segment or node key local to its parent
- `displayLabel`
  Type / Shape: `TEXT | NULL`
- `depth`
  Type / Shape: `INTEGER`
- `sortOrderHint`
  Type / Shape: `INTEGER | NULL`
  Description: optional provider-supplied relative ordering hint when one
  exists; not required for every provider
- `linkedDiscoveredWebAppSurfaceId`
  Type / Shape: `UUID | NULL`
  Description: required for leaf nodes that correspond to a concrete discovered
  surface; null for pure grouping nodes
- `providerKey`
  Type / Shape: `TEXT`
- `implementationSourcePath`
  Type / Shape: `TEXT | NULL`
- `firstDiscoveredRunId`
  Type / Shape: `UUID`
- `lastDiscoveredRunId`
  Type / Shape: `UUID`
- `firstDiscoveredAt`
  Type / Shape: `TIMESTAMPTZ`
- `lastDiscoveredAt`
  Type / Shape: `TIMESTAMPTZ`
- `staleAt`
  Type / Shape: `TIMESTAMPTZ | NULL`
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

Important constraints:

- unique `discoveryStructureKey`
- self-referencing foreign key on
  `parentDiscoveredWebAppStructureNodeId`
- optional foreign key to `discovered_web_app_surfaces`
- root nodes must have null parent and `depth = 0`
- non-root nodes must have non-null parent and `depth > 0`
- group nodes must not require a linked discovered surface
- surface leaf nodes should require a linked discovered surface

### 2. Discovered Web App Structure Observation

- Description:
  append-only per-run observation snapshot for one discovered structure node
- Why it exists:
  preserves structure-history review separately from the current node lineage

Recommended durable fields:

- `discoveredWebAppStructureObservationId`
  Type / Shape: `UUID`
- `webAppDiscoveryRunId`
  Type / Shape: `UUID`
- `discoveredWebAppStructureNodeId`
  Type / Shape: `UUID`
- `rootFamilyId`
  Type / Shape: `TEXT`
- `parentDiscoveredWebAppStructureNodeId`
  Type / Shape: `UUID | NULL`
- `nodeKind`
  Type / Shape: same approved node-kind enum
- `segmentKey`
  Type / Shape: `TEXT`
- `displayLabel`
  Type / Shape: `TEXT | NULL`
- `depth`
  Type / Shape: `INTEGER`
- `linkedDiscoveredWebAppSurfaceId`
  Type / Shape: `UUID | NULL`
- `providerKey`
  Type / Shape: `TEXT`
- `implementationSourcePath`
  Type / Shape: `TEXT | NULL`
- `observedAt`
  Type / Shape: `TIMESTAMPTZ`
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`

### 3. Discovered Surface To Structure Leaf Link

This does not need to be its own table if one leaf structure node maps to one
current discovered surface row.

Recommended posture:

- keep the canonical discovered surface record in
  `discovered_web_app_surfaces`
- let `discovered_web_app_structure_nodes.linkedDiscoveredWebAppSurfaceId`
  reference that leaf

If future providers need one discovered surface to appear in more than one
discovered structure branch, then a separate junction table would be needed.
The current repo does not yet justify that extra complexity.

## Structure Node Kinds

Recommended first-pass node kinds:

- `root`
  the discovered root-family node such as `design-system`
- `group`
  a structural grouping node such as `components` or `patterns`
- `page-surface`
  a path-backed discovered page leaf
- `shell-state-surface`
  a hash-backed discovered shell-state leaf
- `support-surface`
  a non-importable support-only discovered leaf
- `review-required-surface`
  a discovered leaf whose posture should not be inferred automatically

This keeps:

- grouping nodes
- importable leaves
- blocked or non-importable leaves

explicitly separate.

## Provider Output Refinement

The current provider seam emits flat discovered surfaces.

For this loop, providers should evolve to emit a normalized structure-aware
result such as:

- discovered surfaces
- discovered structure nodes
- the intended parent-child relationships

Example for `/design-system/components/top-nav`:

- discovered surface:
  `/design-system/components/top-nav`
- structure root node:
  `design-system`
- structure group node under root:
  `components`
- structure leaf node under `components`:
  `top-nav`
  linked to the discovered surface row

Example for `/root-admin#users`:

- discovered surface:
  `/root-admin#users`
- structure root node:
  `root-admin`
- structure leaf node under root:
  `users`
  with node kind `shell-state-surface`

Example for `/root-admin/helper/download/root-auth-signer-helper.mjs`:

- discovered surface:
  support route row
- structure root node:
  `root-admin`
- group nodes:
  `helper`, `download`
- leaf node:
  `root-auth-signer-helper.mjs`
  with node kind `support-surface`

## Read Capabilities The Model Enables

Once implemented, the structure-aware model should support:

- current discovered tree reads by root family
- exact discovered structure-node reads
- current leaf-to-surface reads
- stale discovered structure review
- future hierarchy reconcile against a discovered tree, not just against flat
  route leaves

## Reconcile Impact

This loop should unblock a later hierarchy reconcile improvement:

- current chained sync blocks multi-segment paths because importing them would
  invent intermediate pages
- structure-aware discovery would let reconcile reason about explicit
  discovered groups and explicit discovered leaves
- hierarchy import could later decide whether discovered groups map to modules,
  pages, or another curated container concept without pretending they do not
  exist

## Recommended Artifact Sequence After This Draft

1. capability matrix update for structure-aware discovery
2. PRD refinement for structure-aware discovery
3. PRD-derived test-case doc
4. implementation blueprint
5. implementation of:
   - new structure entities
   - provider contract changes
   - structure-tree reads
   - updated hierarchy sync or reconcile consumers
