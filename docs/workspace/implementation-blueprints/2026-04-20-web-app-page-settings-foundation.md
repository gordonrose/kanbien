# Web App Page Settings Foundation Blueprint

## Summary

- Feature:
  `webAppPageSettings` plus a narrow `webAppHierarchyBuilder` topology
  extension
- Capability:
  durable selected-page settings management inside the governed hierarchy
  workspace
- Scope:
  first page-settings foundation slice for root operators
- Phase:
  pre-implementation blueprint from settled architecture decisions, capability
  matrix, PRD, test-case doc, and journey inventory

## Inputs

- Capability matrix reference:
  [2026-04-20-web-app-page-settings-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-20-web-app-page-settings-foundation-capability-matrix-first-draft.csv)
- PRD:
  [2026-04-20-0017-web-app-page-settings-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-20-0017-web-app-page-settings-foundation.md)
- ADR(s):
  - [0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md](/home/gordon/kanbien/docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md)
  - [0025-adopt-a-security-first-page-state-replay-model.md](/home/gordon/kanbien/docs/architecture/adr/0025-adopt-a-security-first-page-state-replay-model.md)
  - [0026-separate-durable-page-settings-from-curated-frontend-topology.md](/home/gordon/kanbien/docs/architecture/adr/0026-separate-durable-page-settings-from-curated-frontend-topology.md)
- PRD test-case doc:
  [2026-04-20-0017-web-app-page-settings-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-20-0017-web-app-page-settings-foundation-test-cases.md)
- Journey inventory:
  [2026-04-20-0017-web-app-page-settings-foundation-journey-inventory.md](/home/gordon/kanbien/docs/prd/journey_inventories/2026-04-20-0017-web-app-page-settings-foundation-journey-inventory.md)
- QA coverage matrix classification:
  privileged backend capability extension plus governed real-app operator
  workflow
- QA release-gate expectation:
  truthful selected-page settings reads and saves, truthful module landing-page
  validation, no shell drift, and explicit verification for denied and invalid
  paths

## Frontend Plan

- Route / surface:
  keep the existing `/root-admin/web-app-hierarchy` route and add:
  - selected-page `Page Settings` section
  - selected-module landing-page control inside `Hierarchy`
- UI states:
  - no selected node
  - selected page with settings loading
  - selected page with options loading
  - selected page with default fallback values
  - selected page with stored explicit values
  - dirty form
  - save success
  - validation error
  - denied state
  - selected module with landing-page control
  - invalid landing-page target rejected
- Permission visibility behavior:
  hide or disable settings and landing-page controls when the actor lacks the
  corresponding capability, but keep backend enforcement authoritative
- Session / expiry behavior:
  inherit the existing root-admin browser session and expiry posture
- Browser security considerations:
  stay inside the same-origin protected root-admin shell; no new third-party
  asset or browser-permission requirement should be introduced in v1

### Root-Admin File Layout Plan

Expected frontend files to change:

- `src/frontend/rootAdminShell/index.html`
  - add the new workspace section headers and form shell
- `src/frontend/rootAdminShell/assets/app.mjs`
  - add panel switching, options/settings fetch lifecycle, and permission-aware
    visibility
- `src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs`
  - extend selected-node detail handling into selected-page settings and
    selected-module landing-page controls

Do not add app-page CSS for this slice.
The route must consume the existing governed design-system shared seams
instead of extending `src/frontend/rootAdminShell/assets/styles.css`.

### Design-System Constraint

Implementation must consume already governed form/drawer patterns where
possible.

If a new icon-grid selector is required and not yet signed off:

- stop and complete the design-system signoff loop first, or
- use an already approved selector family in v1 and defer icon-grid adoption

## Backend Plan

- Route(s):
  add a new mounted feature under `/v1/web-app-page-settings` with:
  - `GET /v1/web-app-page-settings/pages/:webAppPageId`
  - `PUT /v1/web-app-page-settings/pages/:webAppPageId`
  - `GET /v1/web-app-page-settings/options`
  extend `webAppHierarchyBuilder` with:
  - `PATCH /v1/web-app-hierarchy/modules/:webAppModuleId/landing-page`
- Request/response/error contract:
  - exact selected-page scope only for settings reads and writes
  - exact selected-module scope only for landing-page writes
  - settings update accepts only approved fields:
    `iconKey`, `showInTopNav`, `topNavOrder`, `pageTemplateKey`,
    `contextNavTargetPageIds`
  - read responses should project effective fallback values honestly
  - invalid catalog values, invalid target pages, duplicate targets, and
    invalid landing-page targets need feature-owned validation errors
  - icon options should come from the signed-off design-system icon-catalog
    source when available; selectable page targets should come from a narrow
    `webAppHierarchyBuilder` reader derived from curated tree truth
- Feature-local files expected:
  new feature:
  - `src/features/webAppPageSettings/contract/*`
  - `src/features/webAppPageSettings/domain/*`
  - `src/features/webAppPageSettings/persistence/*`
  - `src/features/webAppPageSettings/transport/router.ts`
  - `src/features/webAppPageSettings/integration.ts`
  - `src/features/webAppPageSettings/index.ts`
  likely capability files:
  - `getWebAppPageSettings.ts`
  - `upsertWebAppPageSettings.ts`
  - `getWebAppPageSettingsOptions.ts`
  additive hierarchy files:
  - `src/features/webAppHierarchyBuilder/domain/updateModuleLandingPage.ts`
  - related contract and persistence updates
- Cross-feature seams:
  - `webAppPageSettings` should consume a narrow public page-reader seam from
    `webAppHierarchyBuilder`
  - do not import `webAppHierarchyBuilder` private persistence files directly
  - do not consume `webAppSurfaceDiscovery` as settings authority
- Authorization enforcement point:
  root-authenticated, root-capability-gated backend routes with deterministic
  validation and no client-side-only approval logic

### Exact Capability Keys And Seed Posture

Additive capability seeds:

- `web-app-page-settings.read`
- `web-app-page-settings.update`
- `web-app-page-settings.read-options`
- `web-app-hierarchy.update-module-landing-page`

All four should be granted to `RootUserAdmin` with migration-backed protected
posture.

## Persistence Plan

- Entities / rows affected:
  add:
  - `web_app_page_settings`
  - `web_app_page_context_nav_items`
  extend:
  - curated module truth with nullable landing-page reference or an equivalent
    module-owned child seam
- Migration changes:
  one additive migration for the new page-settings tables and one additive
  migration or compatible change for module landing-page truth if not combined
- Index or uniqueness changes:
  - unique settings row per `webAppPageId`
  - unique context-nav membership per owner/target pair
  - ordering index on owner page plus `sortOrder`
  - integrity check that module landing-page targets are direct children
- Search/filter implications:
  no broad fuzzy search in v1; reads stay exact and workflow-scoped
- Compatibility notes:
  - backwards compatibility is required by default
  - settings-owned `pageTemplateKey` must coexist honestly with the current
    topology-owned `templateKey` posture in `design-system`
  - settings mutation must not mutate topology-owned `displayLabel`,
    placement, locator, or module ownership fields

## Verification Plan

- Journey tier / workflow scope:
  `Tier 0` selected-page settings save and module landing-page update; `Tier 1`
  denied and invalid paths
- Unit:
  `tests/unit/webAppPageSettings/service.test.ts`
  plus additive hierarchy unit cases for module landing page
- Integration:
  `tests/integration/webAppPageSettings/flow.test.ts`
  plus additive hierarchy integration cases
- Security:
  `tests/security/webAppPageSettings/security.test.ts`
  plus additive hierarchy security cases
- Audit:
  `tests/audit/webAppPageSettings/audit.test.ts`
  plus additive hierarchy audit cases
- Edge:
  fallback semantics, deterministic membership replacement, and landing-page
  integrity on later moves
- Frontend:
  additive browser/visual coverage in
  `tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`
- Persistence-backed:
  `tests/integration/webAppPageSettings/persistence.test.ts`
- End-to-end:
  focused root-admin workspace journeys under `tests/e2e/rootAdmin/`
- Concurrency / idempotency:
  focused check for repeated settings save replacing the same target set
  deterministically
- Performance:
  not required by default for this first slice unless the options selector
  implementation becomes noticeably heavy
- Resilience / failure-injection:
  not required beyond honest save/read failure-path coverage in v1
- Compatibility / contract:
  explicit coverage for coexistence with current topology-owned template
  posture
- Accessibility:
  keyboard and focus behavior for the selected-page form and selected-module
  landing-page selector should be reviewed as part of the governed root-admin
  workflow
- Structured exploratory QA:
  recommended because this is a privileged operator workflow with multi-panel
  behavior
- QA checklist:
  recommended before treating the slice as complete
- Curated test-run summary:
  recommended if this becomes a blocking release-gate workflow
- Waiver / quarantine expectation:
  none expected; if a new selector pattern is not yet signed off, record a
  blocker rather than waiving the design-system rule

## Documentation Plan

- PRD updates:
  create and maintain the 0017 PRD
- PRD test-case updates:
  create and maintain the 0017 test-case doc
- Feature docs:
  add `docs/featureDocs/web-app-page-settings-feature.md`
  and refresh `web-app-hierarchy-builder-feature.md`
- API contract docs:
  add source-independent route docs if that seam is maintained for the new
  feature
- OpenAPI:
  update if the repo maintains these routes in `docs/swagger/openapi.yaml`
- Postman:
  add or refresh maintained collection artifacts for the new feature
- Data dictionary:
  add implemented dictionary entries once persistence lands
- Architecture map:
  review frontend/operator-tooling and feature-bundle layer docs if their
  current-state wording changes
- Standards platform-status snapshots:
  review
  - [QA-RELEASE-STATUS.md](/home/gordon/kanbien/docs/standards/platform-status/QA-RELEASE-STATUS.md)
  - [OWASP-ASVS-STATUS.md](/home/gordon/kanbien/docs/standards/platform-status/OWASP-ASVS-STATUS.md)
  for current wording drift once implementation and evidence exist
- Reconstruction questionnaire:
  likely no update unless the slice introduces new interchangeable helper or
  tool assumptions
- Bootstrap and helper docs:
  no change expected unless new local helper behavior is introduced
- Maintained-artifacts sweep:
  review and refresh:
  - `docs/architecture/frontend-overview.md`
    if the current workspace description changes materially
  - `docs/featureDocs/web-app-hierarchy-builder-feature.md`
  - `docs/workspace/entity-definitions/web-app-page-settings-entity-model-first-draft.md`
    after implementation lands
  - relevant design-system adoption docs if the real-app page-settings surface
    adopts a new signed-off selector family
- Runbook:
  not expected in v1
- Privacy note:
  not expected in v1
- Standards review:
  required because the slice is privileged and user-facing
- Repo health review:
  recommended after implementation because this slice adds a new cross-feature
  seam

## Completion Guardrails

- Blocking QA outcomes:
  denied-path failures, topology/settings boundary violations, and any shell
  drift from the governed workspace posture
- Explicitly deferred verification layers and rationale:
  dedicated performance and resilience suites are deferred unless
  implementation specifics justify them
- Expected release-gate residual risk statement:
  the main residual risk after implementation is not core logic ambiguity but
  UI/pattern drift if the icon selector or multi-select workflow deviates from
  governed design-system families
