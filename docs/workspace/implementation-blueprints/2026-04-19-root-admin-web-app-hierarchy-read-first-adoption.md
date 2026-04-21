# Root Admin Web App Hierarchy Read-First Adoption Blueprint

## Status Note

- This blueprint is now partially superseded by the implemented
  `design-system` browser-wired preview/apply operator flow and by
  [2026-04-20-design-system-topology-materialization-v1.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-20-design-system-topology-materialization-v1.md).
- Keep it as historical planning context for the first signed-off family
  adoption and shared seam extraction, but do not treat its read-first-only UI
  scope as current truth for the `#web-app-hierarchy` route.

## Summary

- Feature:
  `rootAdminShell` consuming the signed-off `hierarchy-tree` family with data
  from `webAppHierarchyBuilder`
- Capability:
  read-first hierarchy administration page that renders `GetTree` inside the
  governed hierarchy-tree posture without introducing app-local tree drift
- Scope:
  first-consumer frontend adoption slice plus the shared frontend seam
  extraction required to keep design-system and app consumers on one source of
  truth
- Phase:
  pre-implementation blueprint for the first real `root-admin` consumer

## Inputs

- Capability matrix reference:
  [2026-04-19-web-app-hierarchy-builder-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-hierarchy-builder-capability-matrix-first-draft.csv)
- PRD:
  [2026-04-19-0011-web-app-hierarchy-builder-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0011-web-app-hierarchy-builder-foundation.md)
- ADR(s):
  no new ADR required yet if the shared tree seam remains frontend-local and
  does not change the platform architecture beyond governed adoption
- PRD test-case doc:
  [2026-04-19-0011-web-app-hierarchy-builder-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-19-0011-web-app-hierarchy-builder-foundation-test-cases.md)
- Journey inventory:
  none exists yet; this slice should create one if the new root-admin page is
  treated as a meaningful operator workflow rather than a thin placeholder
- QA coverage matrix classification:
  material privileged frontend slice backed by an existing privileged backend
  feature and a signed-off governed design-system family
- QA release-gate expectation:
  visual parity against the signed-off hierarchy-tree family, honest loading
  and denied states, and executable consumer coverage for the read-first
  surface before treating adoption as complete
- Related design-system artifacts:
  - [root-admin-web-app-hierarchy-tree-adoption-contract.md](/home/gordon/kanbien/docs/workspace/design-system/adoption/root-admin-web-app-hierarchy-tree-adoption-contract.md)
  - [hierarchy-tree-behavior-lock.md](/home/gordon/kanbien/docs/workspace/design-system/behavior-locks/hierarchy-tree-behavior-lock.md)
  - [hierarchy-tree-reference-pack.md](/home/gordon/kanbien/docs/workspace/design-system/reference-packs/hierarchy-tree-reference-pack.md)
  - [hierarchy-tree-verification-checklist.md](/home/gordon/kanbien/docs/workspace/design-system/verification/hierarchy-tree-verification-checklist.md)
- Related backend feature docs:
  - [web-app-hierarchy-builder-feature.md](/home/gordon/kanbien/docs/featureDocs/web-app-hierarchy-builder-feature.md)
  - [web-app-page.md](/home/gordon/kanbien/docs/data-dictionary/web-app-page.md)
  - [web-app-root-family.md](/home/gordon/kanbien/docs/data-dictionary/web-app-root-family.md)

## Scope Confirmation

This blueprint is for one coherent first-consumer slice:

- extract the signed-off `hierarchy-tree` family into a shared frontend seam
- keep the design-system pattern and canonical routes consuming that shared
  seam
- add a new `root-admin` route state, expected slug:
  `#web-app-hierarchy`
- fetch and render `GET /v1/web-app-hierarchy/tree`
- map root families, modules, and pages into the signed-off hierarchy-tree
  view model
- render a read-first details panel for the selected node
- preserve current-versus-selected behavior, desktop resize, mobile full-screen
  drawer posture, RTL, long-title tooltip reveal, and dark-theme readability
- prove app parity without yet enabling rename, create, move, orphan restore,
  bootstrap mutation, or sync mutation UI

This blueprint does **not** include:

- inline rename in the real app
- create child or sibling flows
- drag-and-drop or menu move mutation in the real app
- orphan remediation workflow beyond a read-only entry point or placeholder
- bootstrap execution UI
- sync-discovery execution UI
- discovery reconcile preview/apply UI
- tenant-facing hierarchy viewing or editing

## Frontend Plan

- Route / surface:
  add a new `root-admin` page state under the existing protected shell,
  expected hash route `#web-app-hierarchy`
- UI states:
  - default loaded tree from `GetTree`
  - loading tree state
  - empty tree state
  - fetch error state
  - denied or unavailable state when hierarchy-read permission is missing
  - selected root family state
  - selected module state
  - selected page state
  - current-versus-selected divergence state
  - mobile full-screen drawer state
  - RTL mirrored layout state
  - long-title truncation with tooltip reveal
- Permission visibility behavior:
  this page must only appear to authenticated root operators who can access the
  hierarchy read surface; app navigation and page actions must remain truthful
  to `web-app-hierarchy.read-tree` and any adjacent read capabilities actually
  granted
- Session / expiry behavior:
  inherit the existing `rootAdminShell` browser-auth and expiry posture; do not
  create a page-local session model
- Browser security considerations:
  preserve the root-admin protected-shell boundary, continue using same-origin
  authenticated requests, and do not expose mutation affordances that the
  read-first slice cannot honestly complete

### Frontend Consumer Mapping

- `GET /v1/web-app-hierarchy/tree` is the primary data source for the tree
  surface
- root families from the response map to protected top-level roots
- modules map to structural rows under each root family
- pages map to normal tree rows
- orphaned pages do **not** render inside the active tree in this slice; orphan
  review remains an explicit adjacent capability
- selected-node detail panel should show at minimum:
  - display label
  - node type
  - root family
  - module
  - placement
  - resolved route path
  - lifecycle status
  - timestamps

### Shared Frontend Seam Extraction

Before the root-admin page consumes the family, implementation should split the
current design-system-only runtime into:

- a shared hierarchy-tree family source under a new shared frontend seam such
  as `src/frontend/shared/hierarchyTree/`
- design-system harness code that remains under
  `src/frontend/designSystem/assets/`

Expected separation:

- shared family source owns:
  - tree rendering
  - row anatomy
  - selection model
  - current-versus-selected behavior
  - expansion model
  - desktop resize behavior
  - mobile full-screen drawer behavior
  - RTL mirroring
  - long-title tooltip hookup
  - shared event wiring needed by both design-system and app consumers
- design-system harness remains responsible for:
  - canonical-state switching
  - review-only fixture data
  - preview-only controls
  - canonical launcher or render metadata

This extraction is mandatory for adoption honesty. The app must consume the
same family source as the signed-off design-system routes rather than
re-implementing the tree locally.

### Root Admin File Layout Plan

Expected frontend files to change or be created:

- `src/frontend/rootAdminShell/index.html`
  - add the new page section and route link
- `src/frontend/rootAdminShell/assets/app.mjs`
  - add route handling, fetch lifecycle, page activation, selection/detail
    wiring, and permission-aware visibility for the new page
- `src/frontend/rootAdminShell/assets/styles.css`
  - add page-level framing only; do not fork hierarchy-tree family styling
- new shared family files, likely:
  - `src/frontend/shared/hierarchyTree/index.mjs`
  - `src/frontend/shared/hierarchyTree/styles.css`
  - optionally a small adapter or types file if the family source benefits from
    an explicit view-model seam
- existing design-system consumers should be updated to use the shared family
  source:
  - `src/frontend/designSystem/assets/hierarchyTree.mjs`
  - `src/frontend/designSystem/assets/hierarchyTree.css`
  - `src/frontend/designSystem/patterns/hierarchy-tree/index.html`
  - `src/frontend/designSystem/patterns/hierarchy-tree/render/index.html`

### Root Admin Routing And Shell Integration

Implementation should:

- add a new context-nav destination for `web-app-hierarchy`
- add matching page metadata in `src/frontend/rootAdminShell/assets/app.mjs`
- keep breadcrumb, search-shell, context-nav, and display-settings behavior
  inherited from the already adopted shell families
- avoid turning the hierarchy page into a page-local shell fork

## Backend Plan

- Route(s):
  no new backend routes in this slice; consume existing:
  - `GET /v1/web-app-hierarchy/tree`
  - optionally `GET /v1/web-app-hierarchy/orphaned-pages` for a read-only
    orphan entry point if included in the first page scope
- Request/response/error contract:
  - use existing `GetTree` response shape from
    `src/features/webAppHierarchyBuilder/contract/types.ts`
  - preserve root-family/module/page distinctions in the adapter layer
  - treat `status`, `placementType`, `resolvedFullRoutePath`, and timestamps as
    detail-panel fields rather than primary row clutter
  - denied responses and session expiry should reuse existing root-admin error
    handling rather than page-local auth inventions
- Feature-local files expected:
  no new backend feature files should be required for the read-first slice
- Cross-feature seams:
  - root-admin frontend should call the protected backend API
  - do not bypass `webAppHierarchyBuilder` by reading persistence directly
  - do not make the frontend depend on discovery truth for tree rendering
- Authorization enforcement point:
  backend remains the source of truth through existing root capability
  middleware; frontend may hide the page or action entry points based on known
  permission state, but must not replace backend enforcement

## Persistence Plan

- Entities / rows affected:
  none for the read-first adoption slice
- Migration changes:
  none expected
- Index or uniqueness changes:
  none expected
- Search/filter implications:
  shell search may expose the new page route, but the hierarchy page itself
  should not invent a new fuzzy tree-search contract in the first slice
- Compatibility notes:
  because no mutation UI is enabled yet, this slice should not change hierarchy
  durability semantics, route refresh behavior, or live-route compatibility
  rules already enforced by the backend

## Verification Plan

- Journey tier / workflow scope:
  privileged operator read-only hierarchy administration journey inside the
  governed root-admin shell
- Unit:
  add focused unit coverage for any new root-admin adapter utilities that map
  `ResolvedWebAppHierarchyTree` into the shared tree view model
- Integration:
  extend root-admin integration coverage only if page routing or authenticated
  fetch wiring needs explicit browser-auth verification beyond current shell
  tests
- Security:
  ensure the consumer remains hidden or denied appropriately when hierarchy
  read capability is absent; backend security tests remain the authoritative
  seam
- Audit:
  no new audit expectation unless the app slice adds a new privileged surface
  whose visibility or action logging needs explicit documentation
- Edge:
  cover empty tree, deeply nested tree, long titles, missing route path, and
  nodes with no children
- Frontend:
  add `tests/visual/app/rootAdminShell/` coverage for:
  - desktop read-first page baseline
  - mobile full-screen drawer
  - RTL parity
  - long-title tooltip parity
  - current-versus-selected divergence
  - denied or unavailable page posture if the shell models permission-aware
    hiding
- Persistence-backed:
  reuse backend `webAppHierarchyBuilder` persistence-backed coverage as the
  data-truth seam; no new persistence test should be needed for the frontend
  slice itself
- End-to-end:
  not required in the first read-first slice unless the route becomes a
  release-critical admin workflow immediately
- Concurrency / idempotency:
  not a primary gate in the read-first slice
- Performance:
  review tree rendering with representative depth and long-title stress; avoid
  obvious jank or expensive repeated overflow measurement loops
- Resilience / failure-injection:
  verify graceful fetch failure and session-expiry recovery using existing
  root-admin shell behavior
- Compatibility / contract:
  validate that the consumer uses the signed-off family source directly and
  does not fork the tree posture or row grammar
- Accessibility:
  prove keyboard reachability, tooltip access, focus visibility, mobile drawer
  behavior, RTL parity, and sufficient contrast in the real app consumer
- Structured exploratory QA:
  recommended for the first consumer because this is a privileged admin surface
  adopting a newly signed-off family
- QA checklist:
  add a focused note covering read-tree honesty, empty-state honesty, long-
  title parity, and shell attachment parity
- Curated test-run summary:
  required if this page becomes part of a blocking frontend gate for the
  release slice
- Waiver / quarantine expectation:
  none expected; if parity gaps remain, do not treat adoption as complete

## Documentation Plan

- PRD updates:
  update the hierarchy-builder PRD only if the read-first page changes the
  previously deferred frontend posture materially
- PRD test-case updates:
  add or refresh frontend-facing test cases if the current backend-only
  test-case doc no longer reflects the delivered surface
- Feature docs:
  create or update a frontend-facing note for the new root-admin hierarchy page
  and refresh `docs/featureDocs/web-app-hierarchy-builder-feature.md` so it no
  longer states that no frontend hierarchy-builder UI exists once the page is
  implemented
- API contract docs:
  no new API contract expected if the consumer only uses the existing backend
  read routes, but review whether hierarchy-read routes need a more explicit
  source-independent contract once the page ships
- OpenAPI:
  no expected change unless existing hierarchy routes are not yet represented
  accurately
- Postman:
  no expected change unless a maintained collection already covers the
  hierarchy read seam and needs route examples refreshed
- Data dictionary:
  likely no entity changes, but review `web-app-page`, `web-app-module`, and
  `web-app-root-family` for any newly relevant consumer-facing notes
- Architecture map:
  review whether the new root-admin page changes
  `docs/workspace/architecture-map/` truth about frontend adoption status
- Standards platform-status snapshots:
  review whether the new governed frontend slice changes wording or evidence in
  `docs/standards/platform-status/AI-ASSISTED-DEVELOPMENT-STATUS.md` and any
  frontend-quality or standards snapshots touched by real-app parity work
- Reconstruction questionnaire:
  no expected change unless the shared frontend seam extraction alters helper or
  runtime assumptions
- Bootstrap and helper docs:
  no expected change unless the root-admin hierarchy page introduces a new
  helper or local setup dependency
- Maintained-artifacts sweep:
  review and refresh at least:
  - `docs/workspace/design-system/verification/hierarchy-tree-verification-checklist.md`
  - `docs/workspace/design-system/adoption/root-admin-web-app-hierarchy-tree-adoption-contract.md`
  - `docs/featureDocs/web-app-hierarchy-builder-feature.md`
  - any root-admin shell planning notes that still imply no real hierarchy page
  - any stale “no frontend hierarchy-builder UI exists” wording in older
    implementation blueprints or planning docs
- Runbook:
  not expected for the read-first slice
- Privacy note:
  not expected; the page surfaces privileged structure metadata rather than new
  personal data classes
- Standards review:
  review frontend parity, privileged-surface visibility, and governed
  design-system adoption compliance
- Repo health review:
  recommended after seam extraction because the design-system/app shared-source
  split is a drift-sensitive change

## Completion Guardrails

- Blocking QA outcomes:
  - signed-off family parity must remain intact in the real root-admin consumer
  - no app-local hierarchy-tree fork is allowed
  - desktop, mobile, RTL, and long-title states must be visually honest
  - denied, loading, empty, and fetch-error states must be truthful
- Explicitly deferred verification layers and rationale:
  mutation flows such as rename, create, move, orphan restore, bootstrap
  execution, and sync execution are intentionally deferred to the second
  implementation pass so the first consumer can prove the read-first adoption
  cleanly
- Expected release-gate residual risk statement:
  the main risk in this slice is parity drift during seam extraction or app
  embedding, not backend data correctness. Treat any local reinterpretation of
  the signed-off family as a blocker rather than a polish issue.
