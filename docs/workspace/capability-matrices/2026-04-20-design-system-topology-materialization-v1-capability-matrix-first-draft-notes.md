# Design System Topology Materialization V1 Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-04-20-design-system-topology-materialization-v1-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-20-design-system-topology-materialization-v1-capability-matrix-first-draft.csv)

## Upstream Truth For This Matrix

This matrix starts from the newly settled frontend-topology governance posture
rather than from the older assumption that route changes should be implemented
primarily through direct repo edits.

Source artifacts:

- [0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md](/home/gordon/kanbien/docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md)
- [0025-adopt-a-security-first-page-state-replay-model.md](/home/gordon/kanbien/docs/architecture/adr/0025-adopt-a-security-first-page-state-replay-model.md)
- [2026-04-20-0016-design-system-topology-materialization-v1.md](/home/gordon/kanbien/docs/prd/2026-04-20-0016-design-system-topology-materialization-v1.md)
- [2026-04-20-0016-design-system-topology-materialization-v1-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-20-0016-design-system-topology-materialization-v1-test-cases.md)
- [2026-04-20-design-system-topology-materialization-v1.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-20-design-system-topology-materialization-v1.md)
- current implemented `webAppHierarchyBuilder` and `webAppSurfaceDiscovery`
  foundations under `src/features/`
- current `design-system` file-routed frontend family under
  `src/frontend/designSystem/`

## Consolidated Assumptions

- curated topology is the authoritative source of truth for durable
  `design-system` pages
- `design-system` is the first governed materialization family because its
  route-entry model is already file-routed and path-backed
- proposed topology and applied topology should remain separate
- preview and apply should be distinct first-class capabilities
- deterministic backend code, not LLM judgment, should classify proposed
  changes as additive, compatibility-sensitive, blocked, or invalid
- the first slice should support:
  - create proposed page
  - create proposed subpage
  - preview materialization
  - apply materialization
  - immediate read of applied tree truth from
    `GET /v1/web-app-hierarchy/design-system/applied-tree`
- route-segment rename is compatibility-sensitive
- folder creation is allowed in v1
- folder moves and folder renames are blocked in v1
- page retire/delete semantics are blocked in v1
- page-local stylesheet generation is not allowed by default; new pages should
  rely on shared system CSS unless an explicit exception is approved
- the approved v1 page template key is `static-html-page`
- the first slice should not create a behavior module stub by default for that
  template
- lightweight docs/governance stubs should be created at
  `docs/workspace/design-system/generated-pages/<page-slug>.md`
  so the slice does not rely on implementation files as the only record of
  intent
- the page tree should refresh from applied truth immediately after successful
  apply rather than from client-side optimistic state or hidden background
  reconciliation

## Capability Direction

The first slice should extend `webAppHierarchyBuilder` with:

- proposed design-system page create
- proposed design-system subpage create
- preview-first materialization for exact proposal scope
- apply-first materialization for exact approved preview scope
- read of applied tree truth suitable for immediate page-tree refresh

Exact new write capability keys should be:

- `web-app-hierarchy.create-design-system-page`
- `web-app-hierarchy.create-design-system-subpage`
- `web-app-hierarchy.preview-design-system-materialization`
- `web-app-hierarchy.apply-design-system-materialization`

All four should be introduced through an additive migration and granted to
`RootUserAdmin` with mandatory/protected posture. The applied-tree read should
reuse the existing `web-app-hierarchy.read-tree` capability rather than invent
a second read grant.

This loop should not yet extend into:

- `root-admin` topology materialization
- folder/tree realignment refactors
- delete/retire semantics
- automatic redirect or alias handling
- promotion of journey-state into durable topology
- rich replay/snapshot behavior

## Boundary Recommendation

- Separate feature for curated topology and materialization workflow:
  yes, still `webAppHierarchyBuilder`
- Separate feature for discovered route truth:
  yes, still `webAppSurfaceDiscovery`
- Route-entry ownership for `design-system`:
  primarily the file/folder structure plus `index.html`
- Repo materialization ownership in v1:
  page folder creation, `index.html`, no behavior module stub by default for
  `static-html-page`, and lightweight docs/governance stub at
  `docs/workspace/design-system/generated-pages/<page-slug>.md`
- Human-owned behavior after scaffold creation:
  yes, page functionality remains hand-authored rather than generated by
  default

## Main Benefit

This loop should let the platform answer not only:

- what pages should exist in `design-system`

but also:

- which pages are still proposed versus actually applied
- what repo changes would occur before any apply happens
- which topology changes are safe additive creates versus compatibility-
  sensitive or blocked actions
- how to create new pages and subpages through one governed workflow without
  forcing immediate folder mirroring on every later tree reorganization

That is the missing seam required to make the hierarchy tree a trustworthy
operator surface for `design-system` page creation before the platform revisits
how `root-admin` pages should be surfaced.
