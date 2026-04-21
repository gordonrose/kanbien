# Web App Surface Discovery Structure-Aware Extension Implementation Blueprint

## Summary

- Feature:
  `webAppSurfaceDiscovery`
- Capability:
  durable structure-aware discovery of real implemented web-app structure with
  current discovered-tree reads and exact discovered structure-node reads
- Scope:
  backend feature extension plus downstream public seam refinement
- Phase:
  planned additive extension on top of the implemented discovery foundation

## Inputs

- Capability matrix reference:
  [2026-04-19-web-app-surface-discovery-structure-aware-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-surface-discovery-structure-aware-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-19-web-app-surface-discovery-structure-aware-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-surface-discovery-structure-aware-capability-matrix-first-draft-notes.md)
- Entity-definition reference:
  [web-app-surface-discovery-structure-aware-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/web-app-surface-discovery-structure-aware-entity-model-first-draft.md)
- PRD:
  [2026-04-19-0014-web-app-surface-discovery-structure-aware-extension.md](/home/gordon/kanbien/docs/prd/2026-04-19-0014-web-app-surface-discovery-structure-aware-extension.md)
- ADR(s):
  [0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md](/home/gordon/kanbien/docs/architecture/adr/0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md)
- PRD test-case doc:
  [2026-04-19-0014-web-app-surface-discovery-structure-aware-extension-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-19-0014-web-app-surface-discovery-structure-aware-extension-test-cases.md)
- Journey inventory:
  none yet; still acceptable because this loop remains backend-only and does
  not add operator UI
- QA coverage matrix classification:
  - privileged backend capability extension
  - additive durable persistence workflow
  - compatibility-sensitive discovered-tree seam for later hierarchy reconcile
- QA release-gate expectation:
  - unit, integration, security, audit, edge, compatibility, and
    persistence-backed verification should pass before the extension is treated
    as complete

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states:
  later operator-facing review UI may need:
  - discovered structure-tree inspection
  - stale structure-node review
  - discovered leaf-to-surface linkage inspection
  - handoff into structure-aware reconcile preview
- Permission visibility behavior:
  later root-admin UI should expose discovered-tree reads only to authorized
  root operators
- Session / expiry behavior:
  rely on existing root authenticated session from `rootAuth`
- Browser security considerations:
  keep contracts same-origin admin ready, but do not invent frontend behavior
  before a signed-off operator surface exists

## Backend Plan

- Route(s):
  - existing `POST /v1/web-app-surface-discovery/runs` should become
    structure-aware while remaining backwards compatible for existing callers
  - `GET /v1/web-app-surface-discovery/structure`
  - `GET /v1/web-app-surface-discovery/structure/:discoveredWebAppStructureNodeId`
- Request/response/error contract:
  - discovery run still accepts only explicit root-triggered scope controls,
    not client-supplied discovered payloads
  - the run response should add structure-aware summary fields without
    removing existing discovered-surface summary fields
  - structure-tree list should accept explicit scalar filters only:
    - `rootFamilyId`
    - `nodeKind`
    - `staleStatus`
    - `parentNodeId`
    - `depth`
    - `page`
    - `pageSize`
  - exact structure-node reads require an exact id
  - structure reads should expose:
    - stable node id
    - parent node id
    - root family id
    - node key
    - display label
    - node kind
    - depth
    - linked discovered surface id when present
    - stale metadata
    - first and last discovered run ids
  - use repo-standard invalid/authz/not-found/conflict error shapes with
    feature-owned codes such as:
    - `DISCOVERED_WEB_APP_STRUCTURE_NODE_NOT_FOUND`
    - `DISCOVERED_WEB_APP_STRUCTURE_GRAPH_INVALID`
    - `DISCOVERED_WEB_APP_STRUCTURE_NODE_LINK_INVALID`
    - `WEB_APP_DISCOVERY_STRUCTURE_PROVIDER_OUTPUT_INVALID`
    - `WEB_APP_DISCOVERY_STRUCTURE_SCOPE_INVALID`
- Feature-local files expected:
  - existing foundation files remain in place
  - contract additions:
    - `src/features/webAppSurfaceDiscovery/contract/errors.ts`
    - `src/features/webAppSurfaceDiscovery/contract/schemas.ts`
    - `src/features/webAppSurfaceDiscovery/contract/types.ts`
  - domain additions or refinements, likely:
    - `runWebAppSurfaceDiscovery.ts`
    - `listDiscoveredWebAppStructureTree.ts`
    - `getDiscoveredWebAppStructureNode.ts`
    - `normalization.ts`
    - `structureGraph.ts`
    - `staleMarking.ts`
    - `presenters.ts`
  - persistence additions or refinements:
    - `src/features/webAppSurfaceDiscovery/persistence/types.ts`
    - `src/features/webAppSurfaceDiscovery/persistence/repository.ts`
    - `src/features/webAppSurfaceDiscovery/persistence/postgresRepository.ts`
    - new feature migrations under
      `src/features/webAppSurfaceDiscovery/persistence/migrations/`
  - integration and public seam refinements:
    - `src/features/webAppSurfaceDiscovery/integration.ts`
    - `src/features/webAppSurfaceDiscovery/index.ts`
  - transport refinement:
    - `src/features/webAppSurfaceDiscovery/transport/router.ts`
- Cross-feature seams:
  - keep using `requireRootSession` and root capability seams
  - `webAppSurfaceDiscovery` should keep owning provider normalization and
    persistence
  - provider helpers under `src/frontend/designSystem/`,
    `src/frontend/rootAdminShell/`, and `src/frontend/login/` should evolve to
    emit structure-aware output rather than forcing discovery to infer tree
    shape from raw strings alone
  - `webAppHierarchyBuilder` must continue consuming only the exported public
    seam from `webAppSurfaceDiscovery`
  - do not let hierarchy code import discovery persistence or provider files
  - the public seam should grow structure-aware readers such as:
    - `listDiscoveredWebAppStructureTree`
    - `getDiscoveredWebAppStructureNode`
    while keeping the existing discovered-surface readers stable
- Authorization enforcement point:
  central route and service-boundary enforcement through
  `createRequireRootCapability`, with structure-tree reads using explicit
  structure-read capability gates

## Persistence Plan

- Entities / rows affected:
  - existing:
    - `web_app_discovery_runs`
    - `discovered_web_app_surfaces`
    - `discovered_web_app_surface_observations`
  - new:
    - `discovered_web_app_structure_nodes`
    - `discovered_web_app_structure_observations`
- Migration changes:
  - add one migration to create structure-node and structure-observation tables
  - add one migration to seed any new root capability keys and default grants
    for `RootUserAdmin`
  - update `tests/harness/postgres/migrations.ts` for the new feature
    migrations
- Index or uniqueness changes:
  - primary key on structure nodes
  - primary key on structure observations
  - unique index on a stable structure identity key, scoped so one current node
    represents one discovered node lineage
  - unique sibling index such as `(rootFamilyId, parentNodeId, nodeKey)` for
    current non-stale posture if the entity definition keeps sibling keys
    explicit
  - index on `(rootFamilyId, nodeKind, staleAt, lastDiscoveredAt)`
  - index on `(linkedDiscoveredWebAppSurfaceId)` for leaf lookups
  - foreign keys:
    - structure nodes to discovery runs
    - structure observations to discovery runs
    - leaf-capable structure nodes to discovered surfaces where linked
- Search/filter implications:
  - structure reads should use explicit scalar filters, not path-string
    contains search
  - keep child ordering deterministic so consumers can render a stable tree
    without inventing sort rules
- Compatibility notes:
  - additive only; do not break existing discovered-surface tables or routes
  - do not collapse discovered group nodes into fake page rows
  - do not represent hash-backed shell states as path nodes
  - missing structure nodes become stale rather than deleted
  - structure-aware runs must keep existing surface-only consumers working

## Repo File Layout

- Discovery feature:
  - extend `src/features/webAppSurfaceDiscovery/contract/*`
  - extend `src/features/webAppSurfaceDiscovery/domain/*`
  - extend `src/features/webAppSurfaceDiscovery/persistence/*`
  - extend `src/features/webAppSurfaceDiscovery/transport/router.ts`
  - extend `src/features/webAppSurfaceDiscovery/integration.ts`
  - extend `src/features/webAppSurfaceDiscovery/index.ts`
- Frontend-family discovery providers:
  - `src/frontend/designSystem/discovery.ts`
  - `src/frontend/rootAdminShell/discovery.ts`
  - `src/frontend/login/discovery.ts`
- Root capability catalog:
  - `src/features/rootRoles/domain/capabilityCatalog.ts`
  - related root-role grant migrations if a new structure-read capability key
    is introduced
- Router wiring:
  - no new feature mount expected; existing
    `src/routes/v1/index.ts` mount should remain stable unless route-path
    registration changes
- Test surfaces:
  - `tests/unit/webAppSurfaceDiscovery/`
  - `tests/integration/webAppSurfaceDiscovery/`
  - `tests/security/webAppSurfaceDiscovery/`
  - `tests/audit/webAppSurfaceDiscovery/`
  - `tests/harness/postgres/migrations.ts`
  - possibly additive seam-focused cases in
    `tests/integration/webAppHierarchyBuilder/` if the public reader contract
    changes materially in the same loop

## Integration Sequencing

1. Extend provider contracts to emit structure-aware candidates and links while
   preserving current discovered-surface output.
2. Add persistence tables and repository support for current structure nodes and
   structure observations.
3. Refine discovery-run orchestration so one run writes:
   - run metadata
   - current discovered surfaces
   - current discovered structure nodes
   - observation history for both layers
   - stale posture for both layers
4. Add protected structure-tree and exact-node reads.
5. Export the structure-aware public seam from
   `webAppSurfaceDiscovery/index.ts`.
6. Verify existing hierarchy sync remains compatible even before the later
   structure-aware reconcile loop is built.

## Verification Plan

- Journey tier / workflow scope:
  no end-to-end journey tier is required yet because the slice remains
  backend-only and API-driven
- Unit:
  - structure-node normalization
  - parent/child graph validation
  - duplicate sibling rejection
  - leaf-to-surface link validation
  - stale-marking rules for structure nodes
  - deterministic tree ordering
- Integration:
  - root-triggered structure-aware run
  - current discovered structure-tree reads
  - exact discovered structure-node read
  - repeated successful runs updating stale posture
  - multi-segment route-family structure preservation
  - hash-state leaf preservation without fake path conversion
- Security:
  - root-only enforcement
  - deny unauthenticated callers
  - deny authenticated callers lacking structure-read capability
  - reject client control over system-managed fields
- Audit:
  - denied read visibility
  - successful structure-aware run visibility if required by current audit
    posture
- Edge:
  - malformed provider graph
  - invalid parent reference
  - duplicate sibling node keys
  - empty approved family such as current `login`
  - mixed support-only and user-facing leaves in one tree
- Frontend:
  - none in this slice
- Persistence-backed:
  - foreign keys and uniqueness
  - self-referencing parent integrity
  - stale marking without delete
  - leaf-to-surface linkage integrity
- End-to-end:
  - none in this slice
- Concurrency / idempotency:
  - light coverage only
  - repeated unchanged runs should not create duplicate current structure-node
    lineages
- Performance:
  - no dedicated performance suite gate yet
  - review tree-read indexes and deterministic ordering as the current minimum
- Resilience / failure-injection:
  - no dedicated suite required in this loop
  - provider-output failure handling should remain covered through integration
    tests
- Compatibility / contract:
  - existing discovered-surface endpoints remain stable
  - exported seam remains usable by current hierarchy sync consumers
  - new structure-tree contract is explicit enough for later reconcile work
- Accessibility:
  - not applicable in this backend-only slice
- Structured exploratory QA:
  - optional short focused QA note recommended for multi-segment tree honesty
    and stale-node behavior
- QA checklist:
  - recommended if this extension becomes release-gating for hierarchy-sync
    accuracy
- Curated test-run summary:
  - required under `docs/workspace/test-run-summaries/` once implementation
    lands
- Waiver / quarantine expectation:
  - none expected by default; any skipped persistence-backed coverage needs an
    explicit blocker note

## Documentation Plan

- PRD updates:
  - refresh
    `docs/prd/2026-04-19-0014-web-app-surface-discovery-structure-aware-extension.md`
    if implementation tightens entity or provider semantics
- PRD test-case updates:
  - refresh
    `docs/prd/test_cases/2026-04-19-0014-web-app-surface-discovery-structure-aware-extension-test-cases.md`
    after executable coverage lands
- Feature docs:
  - update `docs/featureDocs/web-app-surface-discovery-feature.md`
  - review `docs/featureDocs/web-app-hierarchy-builder-feature.md` because the
    exported discovery seam and future sync posture depend on this extension
- API contract docs:
  - refresh `docs/api-contracts/web-app-surface-discovery.md`
  - review `docs/api-contracts/web-app-hierarchy-builder.md` only if current
    hierarchy-sync responses start surfacing structure-aware summaries in the
    same change
- OpenAPI:
  - update `docs/swagger/openapi.yaml`
- Postman:
  - refresh
    `docs/postman/collections/webAppSurfaceDiscovery.postman_collection.json`
- Data dictionary:
  - add or refresh:
    - `docs/data-dictionary/discovered-web-app-structure-node.md`
    - `docs/data-dictionary/discovered-web-app-structure-observation.md`
  - refresh existing discovery entity pages if cross-links or run summaries
    change
- Architecture map:
  - review whether `docs/workspace/architecture-map/` needs a platform-layer
    update once structure-aware discovery exists as a durable seam
- Standards platform-status snapshots:
  list which files under `docs/standards/platform-status/` must be reviewed
  because the slice changes their current wording or evidence story, even if
  the headline status level may stay the same
  - review API-doc, QA-evidence, and rebuild-readiness related snapshots if
    they mention current discovery limits as part of the repo’s platform story
- Reconstruction questionnaire:
  - review
    `docs/architecture/build-from-spec-reconstruction-questionnaire.md` only if
    the extension changes the documented feature/dependency reconstruction story
- Bootstrap and helper docs:
  - review
    `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md`
    only if helper or migration sequencing assumptions change
- Maintained-artifacts sweep:
  list older PRD/test-case/blueprint docs, README files, index files, and
  registry surfaces that may need refresh because implementation will change
  their truth value
  - `docs/workspace/implementation-blueprints/2026-04-19-web-app-surface-discovery-foundation.md`
  - `docs/prd/2026-04-19-0013-web-app-surface-discovery-foundation.md`
  - `docs/prd/test_cases/2026-04-19-0013-web-app-surface-discovery-foundation-test-cases.md`
  - `docs/workspace/entity-definitions/README.md`
  - `docs/workspace/capability-matrices/2026-04-19-web-app-surface-discovery-capability-matrix-first-draft-notes.md`
  - any stale “multi-segment routes are blocked because discovery is flat”
    wording in feature docs and contracts once the extension lands
- Runbook:
  - no dedicated runbook required yet; feature docs plus API contract should be
    sufficient unless operators gain scheduled or event-driven refresh later
- Privacy note:
  - none expected; no new personal data class is introduced
- Standards review:
  - review against `docs/standards/change-artifact-requirements.md`
  - review QA expectations in `docs/architecture/guides/qa-coverage-matrix-guide.md`,
    `docs/architecture/guides/end-to-end-journey-testing-guide.md`, and
    `docs/standards/QA-RELEASE-GATE.md`
- Repo health review:
  - optional targeted follow-up once implementation lands, focused on whether
    discovery truth, structure truth, and curated hierarchy truth stayed
    separate

## Completion Guardrails

- Blocking QA outcomes:
  - structure-aware runs must preserve existing discovered-surface behavior
  - structure reads must reflect real provider structure without invented nodes
  - stale structure logic must depend on successful repeated runs only
  - exported public seams must be sufficient for later hierarchy reconcile
    without private persistence imports
- Explicitly deferred verification layers and rationale:
  - frontend, accessibility, and end-to-end journey coverage remain out of
    scope because this loop does not add operator UI
  - dedicated performance and resilience suites remain deferred because the
    current scale and route posture do not yet justify them as blocking gates
- Expected release-gate residual risk statement:
  - after this extension lands, the main residual risk should be mapping
    discovered structure truth into curated hierarchy truth, which belongs to
    the next structure-aware reconcile loop rather than to discovery itself
