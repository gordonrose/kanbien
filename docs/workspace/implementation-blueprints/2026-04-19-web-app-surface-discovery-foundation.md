# Web App Surface Discovery Foundation Implementation Blueprint

## Summary

- Feature:
  `webAppSurfaceDiscovery`
- Capability:
  durable discovery of real implemented web-app surfaces with explicit
  root-triggered sync, current discovered-surface reads, and run-history reads
- Scope:
  backend feature slice only
- Phase:
  planned foundation blueprint

## Inputs

- Capability matrix reference:
  [2026-04-19-web-app-surface-discovery-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-surface-discovery-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-19-web-app-surface-discovery-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-surface-discovery-capability-matrix-first-draft-notes.md)
- PRD:
  [2026-04-19-0013-web-app-surface-discovery-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0013-web-app-surface-discovery-foundation.md)
- ADR(s):
  [0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md](/home/gordon/kanbien/docs/architecture/adr/0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md)
- PRD test-case doc:
  [2026-04-19-0013-web-app-surface-discovery-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-19-0013-web-app-surface-discovery-foundation-test-cases.md)
- Journey inventory:
  none yet; acceptable for this backend-only foundation slice because no
  frontend discovery UI or multi-step operator UI workflow is in scope
- QA coverage matrix classification:
  - privileged backend capability
  - persistence schema and durable workflow change
  - compatibility-sensitive consumer read seam
- QA release-gate expectation:
  - unit, integration, security, audit, edge, compatibility, and
    persistence-backed verification should pass before the slice is treated as
    complete

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states:
  later operator-facing discovery review UI may need:
  - trigger sync
  - view discovered surfaces
  - filter support-only vs user-facing
  - inspect stale posture
  - hand off into reconcile preview
- Permission visibility behavior:
  later root-admin UI should expose discovery controls only to authorized root
  operators with the approved discovery capabilities
- Session / expiry behavior:
  rely on existing root authenticated session from `rootAuth`
- Browser security considerations:
  keep contracts compatible with later same-origin admin UI, but do not invent
  UI behavior or design-system usage in this backend-only slice

## Backend Plan

- Route(s):
  - `POST /v1/web-app-surface-discovery/runs`
  - `GET /v1/web-app-surface-discovery/surfaces`
  - `GET /v1/web-app-surface-discovery/surfaces/:discoveredWebAppSurfaceId`
  - `GET /v1/web-app-surface-discovery/runs`
  - `GET /v1/web-app-surface-discovery/runs/:webAppDiscoveryRunId`
- Request/response/error contract:
  - discovery run accepts explicit scope controls only
  - discovery run does not accept invented discovered-surface replacement
    payloads
  - discovered-surface list accepts explicit filter fields only:
    - `rootFamilyId`
    - `surfaceKind`
    - `userFacingDisposition`
    - `providerKey`
    - `staleStatus`
    - `page`
    - `pageSize`
  - exact reads require exact ids
  - run-history reads return run status, scope, trigger kind, timestamps,
    provider version, and failure summaries
  - use repo-standard invalid/authz/not-found/conflict error shape with
    feature-owned codes such as:
    - `WEB_APP_DISCOVERY_SCOPE_INVALID`
    - `WEB_APP_DISCOVERY_RUN_NOT_FOUND`
    - `DISCOVERED_WEB_APP_SURFACE_NOT_FOUND`
    - `DISCOVERED_WEB_APP_SURFACE_LOCATOR_INVALID`
    - `WEB_APP_DISCOVERY_PROVIDER_OUTPUT_INVALID`
    - `WEB_APP_DISCOVERY_RUN_CONFLICT`
- Feature-local files expected:
  - `src/features/webAppSurfaceDiscovery/index.ts`
  - `src/features/webAppSurfaceDiscovery/integration.ts`
  - `src/features/webAppSurfaceDiscovery/README.md`
  - `src/features/webAppSurfaceDiscovery/contract/errors.ts`
  - `src/features/webAppSurfaceDiscovery/contract/schemas.ts`
  - `src/features/webAppSurfaceDiscovery/contract/types.ts`
  - capability-focused domain files, likely:
    - `runWebAppSurfaceDiscovery.ts`
    - `listDiscoveredWebAppSurfaces.ts`
    - `getDiscoveredWebAppSurface.ts`
    - `listWebAppDiscoveryRuns.ts`
    - `getWebAppDiscoveryRun.ts`
  - supporting domain helpers, likely:
    - `providers.ts`
    - `normalization.ts`
    - `staleMarking.ts`
    - `presenters.ts`
  - `src/features/webAppSurfaceDiscovery/domain/types.ts`
  - `src/features/webAppSurfaceDiscovery/domain/service.ts`
  - `src/features/webAppSurfaceDiscovery/persistence/types.ts`
  - `src/features/webAppSurfaceDiscovery/persistence/repository.ts`
  - `src/features/webAppSurfaceDiscovery/persistence/postgresRepository.ts`
  - `src/features/webAppSurfaceDiscovery/persistence/migrations/0014_create_web_app_surface_discovery.sql`
  - additive corrective migration files later if needed
  - `src/features/webAppSurfaceDiscovery/transport/router.ts`
- Cross-feature seams:
  - existing `requireRootSession` seam for authenticated root identity
  - existing root capability checker seam via `createRequireRootCapability`
  - root capability catalog in `rootRoles` must gain the new
    `web-app-surface-discovery.*` capability keys
  - discovery feature should consume explicit provider seams from:
    - `src/frontend/designSystem/router.ts` and file-tree-backed helpers
    - `src/frontend/rootAdminShell` runtime metadata or explicit exported
      provider helper
    - explicit empty-provider or future provider seam for `login`
  - later `webAppHierarchyBuilder` reconcile work must consume exported
    discovery reads from this feature instead of importing provider internals
    or discovery persistence directly
  - avoid direct imports from another feature's `persistence/*`
- Authorization enforcement point:
  central route and service-boundary enforcement through
  `createRequireRootCapability` plus feature-local provider and locator
  validation

## Persistence Plan

- Entities / rows affected:
  - new durable `web_app_discovery_runs` table
  - new durable `discovered_web_app_surfaces` table
  - new durable `discovered_web_app_surface_observations` table
- Migration changes:
  - add feature-scoped SQL migration under
    `src/features/webAppSurfaceDiscovery/persistence/migrations/`
  - seed new root capability catalog rows and default grants for
    `RootUserAdmin`
  - update Postgres test harness registration for the new feature group
- Index or uniqueness changes:
  - primary key on discovery runs
  - primary key on discovered surfaces
  - primary key on observation rows
  - unique index on `discoveryKey`
  - unique index on `canonicalLocator`
  - index on `(rootFamilyId, userFacingDisposition, staleAt, lastDiscoveredAt)`
  - index on `(providerKey, surfaceKind, lastDiscoveredAt)`
  - index on run status and completion ordering
  - foreign keys from discovered surfaces and observations into discovery runs
- Search/filter implications:
  - list reads should use explicit scalar fields, not a vague search blob
  - filter posture should remain honest for stale, support-only, and
    review-required surfaces
- Compatibility notes:
  - do not flatten hash-backed shell states into path rows
  - do not hard-delete rows during normal refresh
  - allow approved root families such as `login` to have zero current
    discovered user-facing surfaces
  - keep trigger model compatible with later event or topic-driven refresh, but
    do not implement it in this slice

## Verification Plan

- Journey tier / workflow scope:
  no end-to-end journey tier is required yet because the slice is backend only
  and the operator workflow is API-driven
- Unit:
  - provider normalization
  - locator-shape validation
  - stale-marking rules
  - support-only classification
  - exact filter validation
- Integration:
  - root-triggered sync
  - current discovered-surface reads
  - run-history reads
  - repeated-run stale posture behavior
  - failed-run behavior
- Security:
  - root-only enforcement
  - deny unauthenticated callers
  - deny authenticated callers lacking capability
  - reject client control over system-managed fields
- Audit:
  - denied access visibility
  - successful run visibility if required by current platform audit posture
- Edge:
  - malformed provider output
  - duplicate discovered locator in one run
  - empty family discovery such as current `login`
  - support-only route persistence
- Frontend:
  - none in this slice
- Persistence-backed:
  - uniqueness
  - foreign keys
  - stale marking without delete
  - root-family scoping
- End-to-end:
  - none in this slice
- Concurrency / idempotency:
  - light coverage only
  - repeated sync over unchanged provider results should behave idempotently and
    not create duplicate lineages
- Performance:
  - no separate performance suite gate yet
  - review indexes and deterministic ordering as the current minimum
- Resilience / failure-injection:
  - not a blocking dedicated suite in this first slice
  - failed-provider behavior is covered in integration tests
- Compatibility / contract:
  - provider seam contract honesty across path, hash, and empty-family outputs
  - exported read contract stability for later reconcile consumers
- Accessibility:
  - not applicable in this backend-only slice
- Structured exploratory QA:
  - optional short focused QA note recommended for stale-marking and locator
    honesty
- QA checklist:
  - recommended once implementation is ready for release gating
- Curated test-run summary:
  - required under `docs/workspace/test-run-summaries/` once implementation
    lands
- Waiver / quarantine expectation:
  - none expected by default; any skipped persistence-backed run needs an
    explicit blocker note

## Documentation Plan

- PRD updates:
  - refresh `2026-04-19-0013-web-app-surface-discovery-foundation.md` if
    implementation tightens provider or entity semantics
- PRD test-case updates:
  - refresh
    `2026-04-19-0013-web-app-surface-discovery-foundation-test-cases.md`
    after executable coverage lands
- Feature docs:
  - add `docs/featureDocs/web-app-surface-discovery-feature.md`
- API contract docs:
  - add or refresh a source-independent API contract doc if the repo pattern
    for planner-like backend seams expects one
- OpenAPI:
  - update `docs/swagger/openapi.yaml`
- Postman:
  - add or refresh a maintained collection under `docs/postman/collections/`
    for `/v1/web-app-surface-discovery`
- Data dictionary:
  - once implemented, add current-state entity pages for:
    - `web-app-discovery-run`
    - `discovered-web-app-surface`
    - `discovered-web-app-surface-observation`
- Architecture map:
  - review whether `docs/workspace/architecture-map/` needs a layer refresh
    because the platform gains a new discovery seam between frontend families
    and hierarchy reconciliation
- Standards platform-status snapshots:
  - review:
    - `docs/standards/platform-status/QA-RELEASE-STATUS.md`
    - `docs/standards/platform-status/OWASP-ASVS-STATUS.md`
  because the slice changes privileged backend surface and verification
  evidence
- Reconstruction questionnaire:
  - review only if implementation adds new runtime or helper assumptions
- Bootstrap and helper docs:
  - review shared bootstrap docs only if implementation introduces new local
    discovery helpers or scripts
- Maintained-artifacts sweep:
  - review:
    - [2026-04-19-0011-web-app-hierarchy-builder-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0011-web-app-hierarchy-builder-foundation.md)
    - [2026-04-19-web-app-hierarchy-builder-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-19-web-app-hierarchy-builder-foundation.md)
    - [docs/workspace/entity-definitions/README.md](/home/gordon/kanbien/docs/workspace/entity-definitions/README.md)
    - [docs/architecture/adr/README.md](/home/gordon/kanbien/docs/architecture/adr/README.md)
  for wording that changes once discovery implementation exists
- Runbook:
  - not required yet unless later scheduled or event-driven sync adds
    operational ownership
- Privacy note:
  - likely not required because the slice stores structure metadata rather than
    end-user personal data
- Standards review:
  - required
- Repo health review:
  - recommended because this introduces a new enduring cross-boundary seam

## Repo File Layout Plan

- add a new mounted feature under `src/features/webAppSurfaceDiscovery/`
- follow the existing feature shape used by `webAppHierarchyBuilder`,
  `entityBuilder`, and other backend-first features
- mount the feature in [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts)
  behind:
  - `requireRootSession`
  - authenticated route protection consistent with other privileged backend
    features
- keep feature-local provider adapters in this feature or in explicit frontend
  route-family seam modules, not in random shared utilities
- export only narrow public seams from
  `src/features/webAppSurfaceDiscovery/index.ts`, likely:
  - `createWebAppSurfaceDiscoveryReader`
  - `createWebAppDiscoveryRunReader`

## Integration Wiring Plan

- extend [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts) to mount
  `createWebAppSurfaceDiscoveryFeature(...)` at `/web-app-surface-discovery`
- extend the root authz capability catalog with:
  - `web-app-surface-discovery.run`
  - `web-app-surface-discovery.read`
  - `web-app-surface-discovery.read-runs`
- treat `RootUserAdmin` as the only initial granting role
- keep discovery capability enforcement aligned with the existing root-role
  gate model rather than introducing feature-local role shortcuts
- keep frontend provider seams explicit:
  - add a design-system discovery provider helper that reflects the current
    file-backed route family truth
  - add a root-admin discovery provider helper that reflects the current
    hash-backed shell-state truth from approved runtime metadata
  - add an explicit login provider seam that can currently return zero
    user-facing results honestly

## Migration Sequencing Plan

- create the discovery tables and indexes in one new feature-scoped migration
- seed capability catalog rows and default grants in the same migration if the
  repo’s current feature pattern keeps authz seed changes close to the owning
  feature migration
- if authz seed ownership instead belongs to an existing shared authz
  migration family, use an additive corrective migration rather than silently
  splitting ownership inconsistently
- update `tests/harness/postgres/migrations.ts` and related Postgres test
  helpers in the same loop

## Completion Guardrails

- Blocking QA outcomes:
  - required unit, integration, security, audit, edge, compatibility, and
    persistence-backed suites pass
  - no open `critical`
  - no open `high`
  - no blocking flaky tests
- Explicitly deferred verification layers and rationale:
  - frontend and accessibility are deferred because no UI ships in this slice
  - end-to-end journeys are deferred because no multi-step operator UI flow is
    implemented yet
  - scheduled or event-driven refresh testing is deferred because trigger
    automation is intentionally out of scope for v1
- Expected release-gate residual risk statement:
  - residual risk should be limited to later reconcile behavior and later
    event-driven refresh, not to the honesty of current discovered truth,
    locator posture, or root-only sync enforcement in the foundation slice
