# Web App Surface Discovery Structure-Aware Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-04-19-web-app-surface-discovery-structure-aware-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-surface-discovery-structure-aware-capability-matrix-first-draft.csv)

## Upstream Truth For This Matrix

This matrix starts from the structure-aware discovery entity-definition layer
rather than from the current flat discovery implementation.

Source artifacts:

- [web-app-surface-discovery-core-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/web-app-surface-discovery-core-entity-model-first-draft.md)
- [web-app-surface-discovery-structure-aware-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/web-app-surface-discovery-structure-aware-entity-model-first-draft.md)
- existing hierarchy-builder and discovery foundation artifacts under
  `docs/prd/`, `docs/prd/test_cases/`, and
  `docs/workspace/implementation-blueprints/`

## Consolidated Assumptions

- `webAppSurfaceDiscovery` should keep owning discovered truth
- discovered surface truth and discovered structure truth should remain
  separate but linked
- the structure-aware loop should not collapse container or grouping nodes into
  fake page rows
- structure nodes must support:
  - root nodes
  - grouping nodes
  - page leaves
  - shell-state leaves
  - support leaves
  - review-required leaves
- stale posture for structure truth should follow successful repeated runs, not
  boot-time inference
- the existing root-triggered sync posture still holds operationally in this
  loop
- later hierarchy reconcile should consume discovered structure reads instead
  of inferring group structure from raw path strings

## Capability Direction

The structure-aware loop should extend discovery with:

- structure-aware run persistence
- current discovered structure-tree reads
- exact discovered structure-node reads

The later hierarchy loop should extend reconcile with:

- structure-aware preview
- structure-aware apply or sync

## Boundary Recommendation

- Separate feature for structure truth:
  yes, still `webAppSurfaceDiscovery`
- Subdomain for curated mutation:
  yes, still `webAppHierarchyBuilder`

## Main Benefit

This loop should let the platform answer not only:

- what surfaces exist

but also:

- how the discovered app groups and nests those surfaces

That is the missing seam for honest import of multi-segment route families such
as `/design-system/components/top-nav`.
