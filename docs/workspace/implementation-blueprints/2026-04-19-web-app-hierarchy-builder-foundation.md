# Web App Hierarchy Builder Foundation Implementation Blueprint

## Summary

- Feature:
  `webAppHierarchyBuilder`
- Capability:
  durable web app hierarchy foundation with root-operated module/page
  management, strict-tree page placement, planner-facing hierarchy reads, and
  bootstrap from current browser-navigable app pages
- Scope:
  backend feature slice only
- Phase:
  implemented foundation blueprint with close-out refresh

## Implementation Status

- Implemented in code:
  - `src/features/webAppHierarchyBuilder/`
  - route mounting in `src/routes/v1/index.ts`
  - root capability catalog updates in `rootRoles`
  - migration `0013_create_web_app_hierarchy.sql`
  - focused unit, security, audit, and Postgres-gated persistence test files
- Honest current limits:
  - bootstrap persists explicitly supplied observed navigable pages; it does
    not auto-discover app routes yet
  - downstream planner adoption is still a follow-on loop
  - live Postgres execution is still pending in the latest test summary

## Inputs

- Capability matrix reference:
  [2026-04-19-web-app-hierarchy-builder-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-hierarchy-builder-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-19-web-app-hierarchy-builder-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-hierarchy-builder-capability-matrix-first-draft-notes.md)
- PRD:
  [2026-04-19-0011-web-app-hierarchy-builder-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0011-web-app-hierarchy-builder-foundation.md)
- PRD test-case doc:
  [2026-04-19-0011-web-app-hierarchy-builder-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-19-0011-web-app-hierarchy-builder-foundation-test-cases.md)
- Source-independent entity definitions:
  - [web-app-root-family.md](/home/gordon/kanbien/docs/data-dictionary/web-app-root-family.md)
  - [web-app-module.md](/home/gordon/kanbien/docs/data-dictionary/web-app-module.md)
  - [web-app-page.md](/home/gordon/kanbien/docs/data-dictionary/web-app-page.md)
- ADR(s):
  no feature-specific ADR exists yet; implementation should review whether the
  new root-family distinction requires an ADR or whether a PRD/data-dictionary
  refresh is sufficient because the seam remains feature-local
- Journey inventory:
  none yet; acceptable for this backend-only foundation slice because the user-
  facing hierarchy editor is deferred

## Scope Confirmation

This blueprint is for one coherent backend slice:

- add a new `webAppHierarchyBuilder` feature under
  `src/features/webAppHierarchyBuilder/`
- introduce durable storage for hierarchy root families, business modules, and
  page nodes
- enforce root-only administration through existing root session and root
  capability middleware
- implement module create/update
- implement page create/update
- implement page movement between module-root, child-page, and orphaned states
- implement resolved hierarchy-tree reads
- implement planner-selectable hierarchy reads
- implement orphan-review reads
- implement bootstrap from real current browser-navigable app pages
  through an explicit observed-input contract
- export narrow hierarchy read seams for downstream consumers such as
  `pageShellPlanning`

This blueprint does **not** include:

- hierarchy-editing frontend UI
- route-generation implementation
- frontend page-structure generation
- tenant-facing hierarchy editing
- tenant-scoped builder-role workflow
- redirects or aliases for compatibility handling
- page destroy semantics
- page-shell planning implementation changes beyond consuming the new read seam

## Important Scope Refinement

The earlier entity and PRD drafts simplified top-level hierarchy shape into
modules and pages only.

After those drafts, scope was clarified:

- the current app has three top-level root families:
  - `root-admin` at `/root-admin`
  - `login` at `/login`
  - `design-system` at `/design-system`
- these behave like top-level root directories rather than ordinary business
  modules

Implementation should therefore not flatten these root families into ordinary
modules.

Implemented posture:

- durable root-family layer added in persistence and domain shape
- PRD and data-dictionary docs refreshed after implementation

The rest of this blueprint now acts as a build record plus follow-on guidance
rather than a pre-implementation plan.

## QA Coverage Classification

- Coverage matrix guide:
  [qa-coverage-matrix-guide.md](/home/gordon/kanbien/docs/architecture/guides/qa-coverage-matrix-guide.md)
- QA release gate:
  [QA-RELEASE-GATE.md](/home/gordon/kanbien/docs/standards/QA-RELEASE-GATE.md)
- Change-class classification:
  - privileged backend capability
  - persistence schema and durable workflow change
  - planner-source-of-truth seam
  - migration/bootstrap change
  - compatibility-sensitive route-truth change
- Required layers from the matrix and PRD test-case doc:
  - unit
  - integration
  - security
  - audit
  - edge
  - persistence-backed verification
- Additional required checks:
  - migration safety review
  - bootstrap honesty review
  - compatibility review for live-route-affecting edits
- Current non-functional posture for this slice:
  - performance:
    include basic indexing and deterministic branch-update behavior now; no
    separate load test gate yet
  - resilience/failure-injection:
    not a primary gate in this backend foundation slice
  - concurrency/idempotency:
    review required for move and bootstrap replay behavior
  - compatibility/contract:
    high importance because planners and later route generation will consume
    this seam as durable truth

## QA Release-Gate Expectations

For this slice, the default blocking posture should be:

- zero open `critical`
- zero open `high`
- zero flaky blocking-suite tests
- full pass of required unit, integration, security, audit, edge, and
  persistence-backed suites before production by default

Required curated summary once this slice is implemented and gated:

- one source-controlled test summary under
  `docs/workspace/test-run-summaries/`
  for the blocking feature loop or release gate

Required focused QA note once this slice is implemented:

- a short note covering:
  - bootstrap honesty
  - route-refresh honesty after move
  - orphan-review correctness
  - blocked compatibility behavior for `live` branches

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states to support later:
  - create module
  - create page
  - move page
  - orphan review
  - compatibility-blocked move
  - bootstrap review
- Permission visibility behavior:
  later root-admin UI should expose hierarchy administration only to authorized
  root operators; later tenant-facing hierarchy editing is a separate feature
  for tenant admins and builder roles
- Session / expiry behavior:
  rely on existing root authenticated session from `rootAuth`
- Browser security considerations:
  keep contracts compatible with later browser-based admin UI, but do not
  invent UI behavior or design-system usage in this backend-only slice

## Backend Plan

- Route(s):
  - `POST /v1/web-app-hierarchy/modules`
  - `PATCH /v1/web-app-hierarchy/modules/:webAppModuleId`
  - `POST /v1/web-app-hierarchy/pages`
  - `PATCH /v1/web-app-hierarchy/pages/:webAppPageId`
  - `POST /v1/web-app-hierarchy/pages/:webAppPageId/move`
  - `GET /v1/web-app-hierarchy/tree`
  - `GET /v1/web-app-hierarchy/planner-nodes`
  - `GET /v1/web-app-hierarchy/orphaned-pages`
  - `POST /v1/web-app-hierarchy/bootstrap`
- Request/response/error contract:
  - create module accepts stable module fields only
  - update module accepts editable metadata lifecycle and ordering only
  - create page accepts stable page fields plus placement data
  - update page accepts metadata lifecycle route segment and ordering only
  - move page accepts target root family, module, parent, placement type, and
    target ordering as needed by the final contract
  - tree read returns deterministic ordered root-family/module/page hierarchy
    with derived route values
  - planner-node read returns planner-oriented projections from the same durable
    hierarchy truth
  - orphan read returns orphaned pages explicitly
  - bootstrap accepts explicit scope controls only, not raw replacement payloads
  - use repo-standard invalid/authz/not-found/conflict error shape with
    feature-owned codes such as:
    - `WEB_APP_ROOT_FAMILY_NOT_FOUND`
    - `WEB_APP_MODULE_NOT_FOUND`
    - `WEB_APP_PAGE_NOT_FOUND`
    - `WEB_APP_PAGE_CYCLE_NOT_ALLOWED`
    - `WEB_APP_PAGE_MOVE_BREAKS_COMPATIBILITY`
    - `WEB_APP_PAGE_PLACEMENT_INVALID`
    - `WEB_APP_HIERARCHY_BOOTSTRAP_SCOPE_INVALID`
- Feature-local files expected:
  - `src/features/webAppHierarchyBuilder/index.ts`
  - `src/features/webAppHierarchyBuilder/integration.ts`
  - `src/features/webAppHierarchyBuilder/README.md`
  - `src/features/webAppHierarchyBuilder/contract/errors.ts`
  - `src/features/webAppHierarchyBuilder/contract/schemas.ts`
  - `src/features/webAppHierarchyBuilder/contract/types.ts`
  - capability-focused domain files, likely:
    - `createWebAppModule.ts`
    - `updateWebAppModule.ts`
    - `createWebAppPage.ts`
    - `updateWebAppPage.ts`
    - `moveWebAppPage.ts`
    - `getResolvedWebAppHierarchyTree.ts`
    - `listPlannerSelectableHierarchyNodes.ts`
    - `listOrphanedWebAppPages.ts`
    - `bootstrapWebAppHierarchy.ts`
  - `src/features/webAppHierarchyBuilder/domain/presenters.ts`
  - `src/features/webAppHierarchyBuilder/domain/types.ts`
  - `src/features/webAppHierarchyBuilder/domain/service.ts`
  - `src/features/webAppHierarchyBuilder/persistence/types.ts`
  - `src/features/webAppHierarchyBuilder/persistence/repository.ts`
  - `src/features/webAppHierarchyBuilder/persistence/postgresRepository.ts`
  - `src/features/webAppHierarchyBuilder/persistence/migrations/0013_create_web_app_hierarchy.sql`
  - additive corrective migration files later if needed
  - `src/features/webAppHierarchyBuilder/transport/router.ts`
- Cross-feature seams:
  - existing `requireRootSession` seam for authenticated root identity
  - existing root capability checker seam via `createRequireRootCapability`
  - root capability catalog in `rootRoles` must gain the new
    `web-app-hierarchy.*` capability keys
  - `pageShellPlanning` should later consume exported planner-selectable and
    resolved-tree reads from this feature instead of maintaining separate
    hierarchy catalogs
  - avoid direct imports from another feature's `persistence/*`
- Authorization enforcement point:
  central route and service-boundary enforcement through
  `createRequireRootCapability` plus feature-local compatibility and tree
  validation

## Repo File Layout Plan

- add a new mounted feature under `src/features/webAppHierarchyBuilder/`
- follow the existing feature shape used by `tenants`, `tenantAuth`, and
  `notificationDelivery`
- mount the feature in [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts)
  behind:
  - `requireRootSession`
  - authenticated route protection consistent with other privileged backend
    features
- wire through `integration.ts`, not directly inside transport
- export only narrow public seams from
  `src/features/webAppHierarchyBuilder/index.ts`, likely:
  - `createWebAppHierarchyReader`
  - `createPlannerSelectableHierarchyReader`

## Integration Wiring Plan

- extend [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts) to mount
  `createWebAppHierarchyBuilderFeature(...)` at `/web-app-hierarchy`
- extend the root authz capability catalog in the `rootRoles` feature with:
  - `web-app-hierarchy.create-module`
  - `web-app-hierarchy.update-module`
  - `web-app-hierarchy.create-page`
  - `web-app-hierarchy.update-page`
  - `web-app-hierarchy.move-page`
  - `web-app-hierarchy.read-tree`
  - `web-app-hierarchy.read-planner-options`
  - `web-app-hierarchy.list-orphans`
  - `web-app-hierarchy.bootstrap`
- treat `RootUserAdmin` as the only initial granting role
- keep hierarchy capability enforcement aligned with the existing root-role gate
  model rather than introducing feature-local role shortcuts

## Persistence Plan

- Entities / rows affected:
  - new durable `web_app_root_families` table or equivalent protected catalog
  - new durable `web_app_modules` table
  - new durable `web_app_pages` table
- Durable root-family fields expected:
  - `web_app_root_family_id` or stable key such as `root-admin`, `login`,
    `design-system`
  - `display_name`
  - `base_path`
  - `sort_order`
  - `status`
  - lifecycle timestamps if modeled as full durable rows
- Durable module fields expected:
  - `web_app_module_id`
  - `web_app_root_family_id`
  - `display_name`
  - `normalized_display_name`
  - optional `business_owner_key`
  - optional `description`
  - `status`
  - `sort_order`
  - `bootstrap_source`
  - `created_at`
  - `updated_at`
- Durable page fields expected:
  - `web_app_page_id`
  - `web_app_root_family_id`
  - `web_app_module_id`
  - optional `parent_web_app_page_id`
  - `placement_type`
  - `display_name`
  - `normalized_display_name`
  - `route_segment`
  - derived `resolved_full_route_path`
  - `status`
  - `sort_order`
  - `browser_navigable`
  - `bootstrap_source`
  - `created_at`
  - `updated_at`
- Migration changes:
  - create the root-family catalog/table and seed:
    - `root-admin` -> `/root-admin`
    - `login` -> `/login`
    - `design-system` -> `/design-system`
  - create `web_app_modules`
  - create `web_app_pages`
  - enforce allowed lifecycle states
  - enforce allowed placement states
  - enforce foreign-key relationships for root family, module, and parent page
- Index or uniqueness changes:
  - primary keys on root-family, module, and page ids
  - uniqueness on root-family base path
  - recommended unique active normalized module-name rule within one root family
  - unique active sibling `route_segment` within one effective parent placement
  - deterministic ordering indexes for root-family/module/page siblings
  - indexes on root family, module, parent id, placement type, status, and
    resolved route path
- Search/filter implications:
  - tree read supports explicit include-orphaned and include-inactive behavior
  - planner read excludes inactive nodes by default unless explicitly requested
  - orphan review supports root-family/module/status filters
  - no broad free-text search is needed in the first slice
- Compatibility notes:
  - `route_segment` remains canonical
  - `resolved_full_route_path` is derived and refreshed automatically
  - live-route-affecting changes are blocked by default until a later approved
    compatibility path exists
  - bootstrap ambiguities land in `review`
  - bootstrap must not invent pages outside the approved real browser-navigable
    input set
  - do not rename applied migrations later; use additive corrective migrations

## Root-Family Modeling Plan

This is the main refinement beyond the earlier source-independent draft.

Recommended approach:

- treat root families as a small durable catalog rather than as ordinary modules
- keep business modules scoped under one root family
- keep pages scoped under both root family and module
- derive full route path from:
  - root-family base path
  - module path segment if present in the final model
  - page ancestry route segments

Why this shape is safer:

- it matches the approved top-level URL families honestly
- it prevents `/login` or `/design-system` from being modeled as ordinary
  business modules
- it gives later tenant-facing hierarchy work a clearer place to attach a
  tenant-specific experience root without breaking current semantics

## Bootstrap Plan

- implement bootstrap as a service-owned import path, not as ad hoc migration
  logic hidden inside route handlers
- allow explicit operator-triggered bootstrap through the protected route
- support a deterministic bootstrap reader that inspects current app truth only
  from real browser-navigable surfaces
- seed root families first, then modules, then pages
- when bootstrap cannot confidently determine placement or module grouping:
  - create the record in `review`
  - do not silently invent a confident final placement
- bootstrap must be additive:
  - create missing rows
  - preserve existing durable rows
  - report collisions and skipped records explicitly

## Authorization And Safety Plan

- implement the governing authz capability checks listed in the PRD
- seed the new capability keys through the existing `rootRoles` catalog path
- grant those capabilities to `RootUserAdmin` through migration-backed default
  grants
- enforce these safety rules in service/persistence logic, not only route
  validation:
  - client cannot supply system-managed or derived fields
  - move paths must prevent cycles
  - move and update paths must reject sibling route collisions
  - move and route-affecting update paths must enforce compatibility blocks for
    `live` branches
  - bootstrap accepts only approved scope controls
  - bootstrap cannot destroy rows or replace the whole hierarchy blindly

## Verification Plan

- Journey tier / workflow scope:
  backend-only privileged workflow; no separate journey inventory required yet
- Unit:
  - schema validation for module/page/move/bootstrap contracts
  - root-family/module/page normalization and consistency rules
  - route derivation and descendant refresh behavior
  - cycle-prevention logic
  - placement-type consistency
  - planner-read projection logic
- Integration:
  - end-to-end route coverage for all hierarchy routes
  - route mounting and middleware protection in `/v1`
  - planner-read anti-drift behavior against durable hierarchy truth
  - bootstrap import behavior for approved current app families
- Security:
  - unauthenticated denial
  - authenticated but wrong-capability denial
  - system-managed field rejection
  - bootstrap misuse rejection
  - cycle-prevention and placement validation under malicious input
- Audit:
  - successful create/update/move/bootstrap evidence
  - denied privileged attempts where the final implementation treats them as
    audit-visible
  - before/after context for move and bootstrap summaries
- Edge:
  - inactive visibility defaults
  - orphan durability
  - deterministic ordering after repeated edits
  - duplicate or replayed move behavior
  - root-family separation among `root-admin`, `login`, and `design-system`
- Frontend:
  none in this slice
- Persistence-backed:
  required for uniqueness, descendant route refresh, bootstrap creation,
  collision handling, and durable audit evidence
- End-to-end:
  not required until a real hierarchy-management UI or broader user journey
  exists
- Concurrency / idempotency:
  add targeted persistence-backed tests for duplicate move submission and
  bootstrap replay behavior
- Performance:
  validate deterministic tree reads and branch updates at representative size;
  no separate load suite required yet
- Resilience / failure-injection:
  not a primary gate in this slice
- Compatibility / contract:
  add coverage for blocked `live` route-affecting moves and route-segment edits
- Accessibility:
  none in this slice because no frontend UI is being delivered
- Structured exploratory QA:
  short operator-focused note after implementation covering bootstrap honesty
  and route-refresh truthfulness
- QA checklist:
  not required yet beyond normal backend release-gate evidence
- Curated test-run summary:
  required once the slice is implemented and gated
- Waiver / quarantine expectation:
  none expected; blockers should be fixed rather than waived for this
  foundation seam

## Documentation Plan

- PRD updates:
  refresh the PRD to reflect the approved root-family distinction before or in
  the same change as implementation
- PRD test-case updates:
  refresh the test-case doc so root-family terminology and executable
  traceability stay aligned
- Feature docs:
  add `src/features/webAppHierarchyBuilder/README.md`
- API contract docs:
  create a source-independent contract doc if the repo is maintaining API
  contracts for new route families at this stage
- OpenAPI:
  update `docs/swagger/openapi.yaml` for the new route family
- Postman:
  update maintained Postman or equivalent API collections if present
- Data dictionary:
  refresh `web-app-module.md` and `web-app-page.md`, and likely add a
  `web-app-root-family.md` page once the root-family refinement is accepted
- Architecture map:
  review `docs/workspace/architecture-map/` layers touching frontend
  implementation architecture, feature bundles, and source-independent
  persistence-contract documentation if their current wording changes
- Standards platform-status snapshots:
  review whether any files under `docs/standards/platform-status/` mention the
  absence of durable planner hierarchy truth or route-generation foundations
- Reconstruction questionnaire:
  likely no update unless bootstrap tooling introduces new operator-local
  choices
- Bootstrap and helper docs:
  update if new helper scripts or bootstrap readers are introduced
- Maintained-artifacts sweep:
  review and refresh:
  - the current PRD and test-case docs for root-family alignment
  - page-shell-planning docs that currently assume hierarchy catalogs exist
    elsewhere
  - data-dictionary index entries after implementation lands
  - any workspace notes that describe the hierarchy as module/page only
- Runbook:
  add only if bootstrap or hierarchy repair introduces operator procedures
- Privacy note:
  likely not required; the slice stores information-architecture metadata, not
  end-user personal data
- Standards review:
  required because this is a privileged persistence-backed backend seam
- Repo health review:
  required because this becomes a durable downstream source of truth for other
  planning and generation work

## Completion Guardrails

- Blocking QA outcomes:
  no open critical or high defects in hierarchy truth, compatibility blocking,
  bootstrap honesty, authz, or audit evidence
- Explicitly deferred verification layers and rationale:
  - frontend verification:
    deferred because no frontend surface is in scope
  - journey inventory:
    deferred because no user-facing hierarchy-management workflow is delivered
    yet
  - dedicated load/performance suite:
    deferred until real scale or hot-path evidence justifies it
- Expected release-gate residual risk statement:
  the main residual risk after this slice lands is that later tenant-facing
  editing, route-alias handling, and richer planner adoption will still need
  follow-on loops; however, durable hierarchy truth, compatibility blocking,
  planner anti-drift reads, and honest bootstrap should already be in place
  before those later consumers build on top.
