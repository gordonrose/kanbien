# Design System Canonicals Foundation Blueprint

## Summary

- Feature:
  new `designSystemCanonicals` feature plus narrow extensions in
  `webAppHierarchyBuilder` and `webAppPageSettings`
- Capability:
  durable canonical governance with additive public generated launcher and
  canonical-rendering routes
- Scope:
  first persistence-backed canonical-governance foundation slice for the
  `design-system` family
- Phase:
  pre-implementation blueprint from accepted capability matrix, PRD, and
  PRD-derived test cases

## Inputs

- Capability matrix reference:
  [2026-04-21-design-system-canonicals-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-21-design-system-canonicals-foundation-capability-matrix-first-draft.csv)
- PRD:
  [2026-04-21-0018-design-system-canonicals-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-21-0018-design-system-canonicals-foundation.md)
- ADR(s):
  - [0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md](/home/gordon/kanbien/docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md)
  - [0025-adopt-a-security-first-page-state-replay-model.md](/home/gordon/kanbien/docs/architecture/adr/0025-adopt-a-security-first-page-state-replay-model.md)
  - [0026-separate-durable-page-settings-from-curated-frontend-topology.md](/home/gordon/kanbien/docs/architecture/adr/0026-separate-durable-page-settings-from-curated-frontend-topology.md)
  - new ADR required for persistence-backed canonical governance and additive
    generated canonical route-family rollout
- PRD test-case doc:
  [2026-04-21-0018-design-system-canonicals-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-21-0018-design-system-canonicals-foundation-test-cases.md)
- Journey inventory:
  none yet; optional for the first slice unless the implementation introduces a
  multi-step privileged governance UI instead of staying backend-plus-public
  route focused
- QA coverage matrix classification:
  privileged backend capability extension plus public route-family addition,
  topology integration, and compatibility-sensitive signoff-surface rollout
- QA release-gate expectation:
  deterministic family/ref governance, truthful public generated routes, no
  mutable query-param authority on generated render paths, truthful page-tree
  sync, precise `canonical-rendering` template intent, and family-by-family
  parity evidence against legacy canonical surfaces

## Frontend Plan

- Route / surface:
  add a new additive public route family under `src/frontend/designSystem/`:
  - `/design-system/canonical-renderings/:familyKey`
  - `/design-system/canonical-renderings/:familyKey/:referenceId`
  preserve existing legacy route families:
  - `/design-system/canonicals/*`
  - current component/template canonical render routes
- UI states:
  launcher route:
  - loading family projection
  - rendered launcher with ordered refs
  - family not found or inactive
  - empty live set
  render route:
  - loading deterministic projection
  - rendered ref-specific canonical state
  - family/ref not found or inactive
  - payload-version or projection mismatch fallback
  parity route posture:
  - generated family public and reviewable
  - legacy family still present for comparison
- Permission visibility behavior:
  public generated routes are public from day one, but governance metadata must
  be lifecycle-gated so only live/public families and refs render. Protected
  governance and sync routes remain root-only.
- Session / expiry behavior:
  no authenticated browser session is required for the generated public route
  family; root-admin session posture remains unchanged for later governance or
  page-tree sync tooling
- Browser security considerations:
  stay inside the current same-origin public `design-system` CSP posture; do
  not introduce third-party runtime dependencies or route-local dynamic script
  composition for the generated route family

### Route-Family Frontend File Plan

Expected new or changed frontend files:

- new generated launcher route entrypoints under
  `src/frontend/designSystem/canonical-renderings/`
  - family launcher `index.html` pattern
  - family/ref render `index.html` pattern or equivalent folder routing shape
- new generated route consumers in `src/frontend/designSystem/assets/`
  likely:
  - `canonicalRenderingLauncher.mjs`
  - `canonicalRenderingPage.mjs`
  - shared projection helpers that keep launcher and render paths deterministic
- additive updates to shared `design-system` shell assets if route discovery,
  nav parity, or shell posture must recognize the new family
- no new exploration controls on generated render routes

### Template Boundary

- generated canonical launcher pages must consume the shared `launcher`
  template shape
- generated render pages must consume the distinct
  `canonical-rendering` template shape
- do not introduce a `canonical-launcher` template key
- do not broaden generated render routes into exploration surfaces

### Legacy/Test Reuse Plan

Build the generated route family so existing canonical route and visual
assertions can be parameterized to target:

- legacy route family
- generated route family

This likely requires:

- reusable route fixtures or manifest input helpers
- test harness changes that make route under test injectable

Do this as an explicit test refactor, not hidden cleanup.

## Backend Plan

- Route(s):
  add a new mounted feature under `/v1/design-system-canonicals` with:
  - `POST /v1/design-system-canonicals/families`
  - `PUT /v1/design-system-canonicals/families/:canonicalFamilyId`
  - `GET /v1/design-system-canonicals/families/:canonicalFamilyId`
  - `POST /v1/design-system-canonicals/families/:canonicalFamilyId/references`
  - `PUT /v1/design-system-canonicals/references/:canonicalReferenceId`
  - `GET /v1/design-system-canonicals/references/:canonicalReferenceId`
  - `GET /v1/design-system-canonicals/public/families/:familyKey/launcher`
  - `GET /v1/design-system-canonicals/public/families/:familyKey/references/:referenceId`
  extend `webAppHierarchyBuilder` with:
  - `POST /v1/web-app-hierarchy/design-system/canonical-renderings/sync`
  extend `webAppPageSettings` by broadening the existing options/update seams
  to validate `canonical-rendering`
- Request/response/error contract:
  - protected family governance contracts accept only approved family fields:
    key, label, launcher metadata, route posture, ordering, lifecycle, parity
    rollout metadata
  - protected ref governance contracts accept only approved ref fields: stable
    ref id, label, circumstance, generated render path, deterministic scalar
    settings, bounded payload, ordering, lifecycle
  - public launcher projection returns template key `launcher`, family
    metadata, ordered live refs, and generated links
  - public render projection returns template key `canonical-rendering`,
    exact deterministic settings, bounded payload, and allowed descriptive
    notes
  - protected and public routes must distinguish:
    - not found
    - inactive or non-public
    - duplicate path
    - invalid payload
    - unsupported lifecycle transition
  - generated render routes must not accept mutable query params as canonical
    state authority
- Feature-local files expected:
  new feature:
  - `src/features/designSystemCanonicals/contract/types.ts`
  - `src/features/designSystemCanonicals/contract/schemas.ts`
  - `src/features/designSystemCanonicals/contract/errors.ts`
  - `src/features/designSystemCanonicals/domain/types.ts`
  - `src/features/designSystemCanonicals/domain/manageCanonicalFamily.ts`
  - `src/features/designSystemCanonicals/domain/manageCanonicalReference.ts`
  - `src/features/designSystemCanonicals/domain/getPublicCanonicalLauncher.ts`
  - `src/features/designSystemCanonicals/domain/getPublicCanonicalRendering.ts`
  - `src/features/designSystemCanonicals/domain/service.ts`
  - `src/features/designSystemCanonicals/persistence/types.ts`
  - `src/features/designSystemCanonicals/persistence/repository.ts`
  - `src/features/designSystemCanonicals/persistence/postgresRepository.ts`
  - `src/features/designSystemCanonicals/persistence/migrations/*`
  - `src/features/designSystemCanonicals/transport/router.ts`
  - `src/features/designSystemCanonicals/integration.ts`
  - `src/features/designSystemCanonicals/index.ts`
  additive hierarchy files:
  - `src/features/webAppHierarchyBuilder/domain/syncDesignSystemCanonicalRenderings.ts`
  - related contract, persistence, and transport updates
  additive page-settings files:
  - `src/features/webAppPageSettings/domain/getWebAppPageSettingsOptions.ts`
  - `src/features/webAppPageSettings/domain/updateWebAppPageSettings.ts`
  - related schema/catalog updates for `canonical-rendering`
  platform wiring:
  - `src/routes/v1/index.ts`
- Cross-feature seams:
  - `designSystemCanonicals` must be the authority for family/ref truth
  - `webAppHierarchyBuilder` should consume a narrow public seam from
    `designSystemCanonicals` for generated route registration
  - `webAppPageSettings` may consume narrow ownership hints or route-template
    metadata through approved public seams, not private persistence imports
  - do not make `webAppHierarchyBuilder` scrape frontend files as canonical
    truth
  - do not make `webAppSurfaceDiscovery` the authority for canonical-governance
    truth
- Authorization enforcement point:
  - protected governance and sync routes:
    root-authenticated and root-capability-gated
  - public projection routes:
    unauthenticated public reads with lifecycle gating and exact path
    validation

### Exact Capability Keys And Seed Posture

Additive capability seeds:

- `design-system-canonicals.family.manage`
- `design-system-canonicals.reference.manage`
- `web-app-hierarchy.sync-design-system-canonical-renderings`

Reused protected keys:

- `web-app-page-settings.read-options`
- `web-app-page-settings.update`

Grant posture:

- all new protected keys should be granted to `RootUserAdmin`
- mandatory/protected posture is recommended for the new protected keys

## Persistence Plan

- Entities / rows affected:
  add new canonical-governance persistence owned by `designSystemCanonicals`,
  likely:
  - `design_system_canonical_families`
  - `design_system_canonical_references`
  - `design_system_canonical_reference_payloads`
  - optional helper rows for rollout/lifecycle or route-alias posture if the
    normalized schema needs them
  extend existing topology/settings features only where required:
  - page-tree nodes or related mapping/state in `webAppHierarchyBuilder`
    sufficient to register generated launcher/render routes as durable places
  - template catalog validation in `webAppPageSettings`
- Migration changes:
  - one additive migration for canonical-governance tables and protected
    capability seeds
  - one additive migration if `webAppHierarchyBuilder` needs explicit
    persistence support for generated canonical-route ownership or sync state
  - one additive migration if `webAppPageSettings` stores or seeds template
    catalog data that must include `canonical-rendering`
- Index or uniqueness changes:
  - unique normalized family key
  - unique generated launcher path
  - unique normalized ref id within a family
  - unique generated render path
  - ordered family-scoped listing indexes for launcher projection
  - exact path/family/ref resolution indexes for public render projection
  - page-tree integrity rules remain required when generated routes are synced
  - existing one-row-per-page settings uniqueness remains unchanged
- Search/filter implications:
  - no fuzzy public search in v1
  - protected family/ref reads stay exact or ordered-list only
  - public routes resolve exact family key or exact family/ref pair only
- Compatibility notes:
  - additive by default
  - seed from current executable canonical behavior, with source-independent
    docs as the main tie-breaker when drift is detected
  - keep legacy `/design-system/canonicals/*` and current legacy canonical
    render routes during the first slice
  - do not silently redirect or repoint legacy routes
  - generated render routes must be deterministic path-based routes rather than
    query-composed canonical state

### Recommended Seeding Approach

Seed initial canonical-governance truth from current executable sources:

- legacy launcher pages
- current family-specific render scripts
- existing canonical manifests
- existing route tests and visual route fixtures

Use source-independent docs such as reference packs to reconcile drift, but do
not silently overwrite executable truth without surfacing the mismatch.

## Verification Plan

- Journey tier / workflow scope:
  public generated launcher/render parity plus privileged governance and
  page-tree sync; no dedicated multi-step operator journey inventory required
  unless a governance UI is introduced in this slice
- Unit:
  - `tests/unit/designSystemCanonicals/`
  - additive `tests/unit/webAppHierarchyBuilder/`
  - additive `tests/unit/webAppPageSettings/`
- Integration:
  - `tests/integration/designSystemCanonicals/`
  - additive `tests/integration/designSystem/`
  - additive `tests/integration/webAppHierarchyBuilder/`
  - additive `tests/integration/webAppPageSettings/`
- Security:
  - `tests/security/designSystemCanonicals/`
  - additive `tests/security/designSystem/`
  - additive `tests/security/webAppHierarchyBuilder/`
- Audit:
  - `tests/audit/designSystemCanonicals/`
  - additive `tests/audit/webAppHierarchyBuilder/`
- Edge:
  - lifecycle gating
  - deterministic no-query-override route behavior
  - additive coexistence with legacy routes
  - repeated sync without duplicate page-tree nodes
- Frontend:
  - additive route/visual coverage in `tests/visual/designSystem/`
  - reusable route-input harness so legacy assertions can run against generated
    routes where practical
- Persistence-backed:
  - integration tests that seed family/ref truth and assert public projections
    and page-tree sync from stored records
- End-to-end:
  - not required beyond focused public-route and protected-route integration in
    this first slice unless a governance UI is introduced
- Concurrency / idempotency:
  - focused repeated-write and repeated-sync checks
- Performance:
  - not required by default unless projection latency becomes noticeable or the
    generated route family introduces large family/ref fanout
- Resilience / failure-injection:
  - not required beyond focused projection and sync error-path verification in
    v1
- Compatibility / contract:
  - explicit parity checks between legacy and generated routes family-by-family
  - explicit coverage that legacy routes remain available during rollout
  - explicit contract that generated render routes are path-defined, not
    query-defined
- Accessibility:
  - generated launcher and render routes should preserve current shell and
    template accessibility posture; visual/browser checks should cover any
    route-family-specific regressions
- Structured exploratory QA:
  - recommended because this slice mixes privileged governance, public route
    rollout, and family-by-family signoff movement
- QA checklist:
  - recommended before a family is treated as migrated to the generated route
    family
- Curated test-run summary:
  - recommended if a first family is promoted to generated-route signoff during
    the same delivery loop
- Waiver / quarantine expectation:
  - none expected; if legacy-vs-generated parity cannot be proven for a family,
    keep that family on legacy signoff posture instead of waiving parity

## Documentation Plan

- PRD updates:
  maintain the 0018 PRD and refresh it if route or template posture changes
- PRD test-case updates:
  maintain the 0018 test-case doc as executable planning becomes more concrete
- Feature docs:
  add `docs/featureDocs/design-system-canonicals-feature.md`
  and refresh docs for:
  - `web-app-hierarchy-builder`
  - `web-app-page-settings`
  if their source-independent wording changes
- API contract docs:
  add a source-independent API contract doc for the new feature if maintained
  route docs exist for comparable seams
- OpenAPI:
  update `docs/swagger/openapi.yaml` if these protected/public routes are in
  maintained OpenAPI scope
- Postman:
  add or refresh maintained Postman artifacts if this repo currently maintains
  operator/public route examples for similar features
- Data dictionary:
  add entries for implemented canonical-governance tables and any new
  topology-owning persistence rows
- Architecture map:
  review workspace architecture-map layers that describe:
  - frontend route-family posture
  - build-from-spec ordering
  - feature ownership of design-system public route truth
- Standards platform-status snapshots:
  review:
  - [QA-RELEASE-STATUS.md](/home/gordon/kanbien/docs/standards/platform-status/QA-RELEASE-STATUS.md)
  - [OWASP-ASVS-STATUS.md](/home/gordon/kanbien/docs/standards/platform-status/OWASP-ASVS-STATUS.md)
  - any platform-status snapshots that currently describe canonical verification
    or route-governance posture in a way this slice changes
- Reconstruction questionnaire:
  likely no update unless this slice introduces new runtime helper or operator
  tooling assumptions
- Bootstrap and helper docs:
  likely no update unless parity tooling or canonical-governance seeding
  introduces required local helpers
- Maintained-artifacts sweep:
  review and refresh:
  - existing reference packs whose wording would become stale once persistence
    becomes the runtime source of truth
  - any launcher/render docs that still describe hardcoded route files as the
    only truth source
  - older planning docs around design-system route governance if they imply
    immediate legacy-route replacement or no page-tree integration
  - route and manifest docs under `tests/visual/designSystem/` if the parity
    harness changes how route inputs are provided
- Runbook:
  no separate runbook expected for the first slice unless governance seeding or
  family promotion introduces an operator maintenance procedure
- Privacy note:
  not expected; this slice does not introduce end-user personal data handling
- Standards review:
  required because this slice adds protected capabilities, a new public route
  family, and topology/template integration
- Repo health review:
  recommended because the slice introduces a new durable truth source that
  interacts with existing frontend route families, topology, and verification
  assets

## Completion Guardrails

- Blocking QA outcomes:
  - generated launcher routes fail shared launcher-template expectations
  - generated render routes accept mutable query-state authority
  - legacy-vs-generated parity cannot be shown for the first rollout family
  - page-tree sync invents or duplicates durable routes
  - `canonical-rendering` template intent cannot be represented precisely
- Explicitly deferred verification layers and rationale:
  - no dedicated performance or soak suite unless the implementation shows
    route-fanout or latency risk
  - no dedicated end-to-end journey inventory unless a privileged governance UI
    is introduced in the same slice
- Expected release-gate residual risk statement:
  the main residual risk after this slice is parity drift between legacy and
  generated route families for families not yet promoted; keep legacy routes as
  the comparison seam until family-specific generated parity is explicitly
  proven and signed off
