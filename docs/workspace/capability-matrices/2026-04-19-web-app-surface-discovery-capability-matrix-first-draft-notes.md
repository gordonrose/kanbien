# Web App Surface Discovery Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-04-19-web-app-surface-discovery-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-surface-discovery-capability-matrix-first-draft.csv)

## Upstream Truth For This Matrix

This matrix intentionally starts from the source-independent discovery
entity-definition layer rather than from implementation guesses.

Source artifacts:

- [web-app-surface-discovery-core-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/web-app-surface-discovery-core-entity-model-first-draft.md)
- existing `webAppHierarchyBuilder` foundation artifacts under
  `docs/prd/`, `docs/prd/test_cases/`, and
  `docs/workspace/implementation-blueprints/`

## Consolidated Model Assumptions

- discovered truth should be owned by a separate `webAppSurfaceDiscovery`
  feature
- curated hierarchy truth stays in `webAppHierarchyBuilder`
- import and reconcile capabilities mutate curated truth and therefore belong
  in a dedicated `webAppHierarchyBuilder` subdomain even though they consume
  discovery truth
- current approved root families remain:
  - `root-admin`
  - `login`
  - `design-system`
- discovery must support both file-backed path pages and hash-backed shell
  states
- non-user-facing routes should be classifiable without being promoted into
  curated page truth
- support-only routes should still persist in discovery as non-importable
  truth
- stale and unmatched posture should be derived from repeated persisted runs
  and explicit link records rather than inferred from one-off comparisons
- v1 operational sync posture is explicit root-triggered manual discovery only
- later automation should evolve through an approved event or topic-driven
  trigger seam rather than hidden startup mutation

## Recommended Feature Boundary

The first discovery loop should be backend and persistence focused.

It should own:

- durable discovery runs
- durable discovered-surface current truth
- durable per-run observation history
- filtered reads for current, stale, unmatched, and support-only surfaces
- an exported discovery seam for later hierarchy import and reconcile

Operational posture in v1:

- explicit root-triggered sync only

Deferred but intentionally compatible:

- scheduled sync
- event or topic-driven sync once the platform has an approved event layer

It should not yet own:

- hierarchy mutation
- redirect strategy
- frontend editing UI
- unguided crawling of arbitrary app internals

## Boundary Recommendation

- Separate feature from `webAppHierarchyBuilder`:
  yes for discovery truth itself
- Subdomain inside `webAppHierarchyBuilder`:
  yes for import and reconcile because those capabilities must write curated
  hierarchy truth and explicit bridge records

## ADR Recommendation

An ADR is recommended before implementation because this loop introduces:

- a new enduring backend feature for discovery truth
- a new explicit provider seam between frontend route families and backend
  discovery orchestration
- a new bridge pattern between discovered truth and curated hierarchy truth
