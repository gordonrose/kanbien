# Web App Hierarchy Structure-Aware Reconcile Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-04-19-web-app-hierarchy-structure-aware-reconcile-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-hierarchy-structure-aware-reconcile-capability-matrix-first-draft.csv)

## Upstream Truth For This Matrix

This matrix starts from the new structure-aware hierarchy reconcile
entity-definition layer rather than from the current single-segment discovery
sync implementation.

Source artifacts:

- [web-app-hierarchy-structure-aware-reconcile-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/web-app-hierarchy-structure-aware-reconcile-entity-model-first-draft.md)
- [web-app-surface-discovery-structure-aware-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/web-app-surface-discovery-structure-aware-entity-model-first-draft.md)
- [2026-04-19-0011-web-app-hierarchy-builder-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0011-web-app-hierarchy-builder-foundation.md)
- current implemented `webAppHierarchyBuilder` and `webAppSurfaceDiscovery`
  foundations under `src/features/`

## Consolidated Assumptions

- `webAppSurfaceDiscovery` continues owning discovered truth
- `webAppHierarchyBuilder` continues owning curated hierarchy truth
- the next loop must add a durable bridge between discovered truth and curated
  truth rather than re-inferring matches on every sync
- discovered `group` nodes should map to curated `modules` by default
- discovered leaf nodes should map to curated `pages`
- hash-state discovered leaves such as `/root-admin#users` should be treated as
  real curated pages
- curated page locator truth should move into a separate locator seam rather
  than remaining only on the page row
- preview and apply should be distinct first-class capabilities
- `GetTree` should remain a pure curated read; it should become accurate
  because reconcile updates curated truth, not because tree reads do live
  discovery

## Capability Direction

The reconcile loop should extend `webAppHierarchyBuilder` with:

- structure-aware preview against discovered structure truth
- structure-aware apply that writes curated modules, curated pages, page
  locators, and discovery-link rows
- explicit read of current discovery-link and drift posture

The loop should also refine the existing root-driven sync posture so a later
convenience action can chain:

- discovery run
- structure-aware preview
- structure-aware apply
- then return the updated curated tree

but that convenience should sit on top of preview/apply rather than replacing
them.

## Boundary Recommendation

- Separate feature for discovered truth:
  yes, still `webAppSurfaceDiscovery`
- Separate feature for curated truth and reconcile mutation:
  yes, still `webAppHierarchyBuilder`
- New enduring seam inside hierarchy:
  yes, `webAppPageLocator` and `webAppDiscoveryLink`

## Main Benefit

This loop should let the platform answer not only:

- what the app implements

but also:

- how that discovered structure maps into curated hierarchy
- which discovered nodes have become curated modules or pages
- which hash-state pages are represented honestly through a locator seam
- what is blocked, unmatched, stale, or drifted

That is the missing seam required to make `GET /v1/web-app-hierarchy/tree`
accurate after sync for route families like:

- `/design-system/components/top-nav`
- `/design-system/patterns/hierarchy-tree/render`
- `/root-admin#users`
