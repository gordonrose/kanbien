# Frontend Seam Classification Audit

## Purpose

Classify the current frontend surfaces before the root-admin page count grows.
This audit separates:

- visual source-of-truth surfaces
- app-consumable design-system seams
- root-admin route glue
- transitional local implementation
- stale or superseded planning

The governing rule is ADR 0028: governed app adoption is not complete when an
app only imports shared CSS. App consumers must consume design-system-owned
styling, render structure, controller behavior, and accessibility/state
semantics. ADR 0029 adds that governed app shells must eventually consume a
design-system-owned shell render/controller seam rather than a local shell host.

## Classification Keys

- `visual-truth`: Review, canonical, pattern, template, or fixture surface that
  proves intended UI truth but should not be copied into app pages.
- `app-consumable-seam`: Importable design-system-owned CSS, render, or
  controller source that real app consumers may consume.
- `app-route-glue`: Root-admin routing, API wiring, shell state, adapters, or
  page-specific data mapping that should not become governed UI ownership.
- `transitional-local-implementation`: Working app-local structure or behavior
  that remains intentional debt or an exception until a DS seam exists.
- `stale-or-superseded-planning`: Historical artifact that records useful
  reasoning but should not drive current implementation without refresh.

## Findings

### Must Fix Soon

No immediate blocking seam split is required before the next cleanup slice.

Current guards already fail on the highest-risk regressions:

- app-local root-admin shell CSS reintroduction
- copied conversation-panel or floating-tab-header markup in root-admin HTML
- missing required DS imports for current governed consumers
- changed locked root-admin shell files without guard refresh

### Should Fix Soon

#### Route Modules Need To Continue, But They Are Not Shared UI

- Status: `app-route-glue`
- Evidence:
  - `src/frontend/rootAdminShell/routes/registry.mjs`
  - `src/frontend/rootAdminShell/routes/build/backlog/route.mjs`
  - `src/frontend/rootAdminShell/routes/build/backlog/page.mjs`
  - `docs/architecture/adr/0040-use-root-admin-route-modules-for-durable-frontend-pages.md`
  - `docs/workspace/design-system/adoption/root-admin-route-module-boundary-contract.md`
- Risk:
  extracting routes is useful, but route modules should not become a hidden
  component library. Governed UI behavior must keep moving upstream into
  `src/frontend/designSystem/assets/`.
- Next action:
  continue route extraction only for durable pages and keep each route module
  limited to mounting, app data wiring, and allowed DS seam inputs.

#### Historical `src/frontend/shared` Proposal Should Stay Superseded For Now

- Status: `stale-or-superseded-planning`
- Evidence:
  - `docs/workspace/implementation-blueprints/2026-04-19-root-admin-web-app-hierarchy-read-first-adoption.md`
- Risk:
  reviving `src/frontend/shared/` casually would create a second shared UI
  authority beside `src/frontend/designSystem/assets/`, increasing ambiguity
  instead of reducing it.
- Next action:
  do not create generic `src/frontend/shared/` in the current refactor. If the
  repo later wants a framework-neutral shared frontend library, record a new
  ADR that explicitly moves selected app-consumable seams out of
  `designSystem/assets`.

### Watchlist / Conscious Debt

#### `/root-admin` Overview Body Remains Local

- Status: `transitional-local-implementation`
- Evidence:
  - `src/frontend/rootAdminShell/index.html`
  - `docs/workspace/design-system/adoption/root-admin-governed-page-implementation-audit.md`
- Current classification:
  the overview/session page body is local placeholder content inside a
  governed shell host. The live conversation panel on that surface consumes the
  DS-owned `conversationPanel` seam.
- Next action:
  before adding real overview/dashboard behavior, decide whether it becomes a
  DS-backed summary family or an explicit local exception.

#### `/root-admin/roles` Remains Local Placeholder Content

- Status: `transitional-local-implementation`
- Evidence:
  - `src/frontend/rootAdminShell/index.html`
  - `docs/workspace/design-system/adoption/root-admin-governed-page-implementation-audit.md`
- Current classification:
  roles has a durable route but no adopted page-family seam yet.
- Next action:
  wait for a roles workspace design-system seam or record an explicit exception
  before building real roles UI.

#### Build Backlog Is A Proof Consumer, Not Durable Product UI Yet

- Status: `app-route-glue` plus `app-consumable-seam`
- Evidence:
  - `src/frontend/rootAdminShell/routes/build/backlog/page.mjs`
  - `src/frontend/designSystem/assets/floatingTabHeader.mjs`
  - `docs/workspace/design-system/adoption/root-admin-build-backlog-floating-tab-header-adoption-contract.md`
- Current classification:
  the route module supplies representative Build backlog copy and tab data; the
  floating-tab render and behavior are DS-owned.
- Next action:
  connect real backlog data only after product/API planning exists. Do not turn
  the proof route into a local backlog component library.

### Still Aligned

#### App Shell Seam

- Status: `app-consumable-seam`
- Evidence:
  - `src/frontend/designSystem/assets/appShell.mjs`
  - `src/frontend/rootAdminShell/index.html`
  - `src/frontend/rootAdminShell/assets/app.mjs`
  - `docs/architecture/adr/0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`
  - `docs/workspace/design-system/adoption/app-shell-render-seam-contract.md`
- Current classification:
  root-admin is the first governed consumer of the reusable DS-owned
  `appShell.mjs` render/controller seam. `index.html` now exposes an empty
  shell mount; root-admin passes route/session/page inputs from `app.mjs`.
- Next action:
  add broader shell parity coverage and keep future tenant-admin or tenant-user
  adoption generic rather than adding root-admin assumptions to the seam.

#### Visual Truth Surfaces

- Status: `visual-truth`
- Evidence:
  - `src/frontend/designSystem/canonicals/**`
  - `src/frontend/designSystem/canonical-renderings/**`
  - `src/frontend/designSystem/patterns/**`
  - `src/frontend/designSystem/templates/**`
  - `docs/workspace/design-system/behavior-locks/**`
  - `docs/workspace/design-system/reference-packs/**`
  - `docs/workspace/design-system/verification/**`
- Current classification:
  these routes and artifacts are signoff and review truth. They may consume
  shared seams, but app routes should not copy their markup or controller code.

#### App-Consumable Design-System Seams

- Status: `app-consumable-seam`
- Evidence:
  - `src/frontend/designSystem/assets/pageShellController.mjs`
  - `src/frontend/designSystem/assets/contextNav.mjs`
  - `src/frontend/designSystem/assets/loginTemplate.mjs`
  - `src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs`
  - `src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs`
  - `src/frontend/designSystem/assets/hierarchyTree.mjs`
  - `src/frontend/designSystem/assets/formControls.mjs`
  - `src/frontend/designSystem/assets/conversationPanel.mjs`
  - `src/frontend/designSystem/assets/floatingTabHeader.mjs`
  - `src/frontend/designSystem/assets/kanbanColumnSeam.mjs`
  - `src/frontend/designSystem/assets/list-page-shared.css`
  - `src/frontend/designSystem/assets/hierarchy-tree-shared.css`
  - `src/frontend/designSystem/assets/form-template-shared.css`
  - `src/frontend/designSystem/assets/conversationPanel.css`
- Current classification:
  these are the current app-consumable seam layer. Some are broad workspace
  seams; some are component/family seams; some are CSS entrypoints that must be
  paired with render/controller seams for honest adoption.

#### Root-Admin Directory Pages

- Status: `app-consumable-seam` consumed through `app-route-glue`
- Evidence:
  - `src/frontend/rootAdminShell/routes/users/page.mjs`
  - `src/frontend/rootAdminShell/routes/tenants/page.mjs`
  - `src/frontend/rootAdminShell/routes/tenant-admins/page.mjs`
  - `src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs`
  - `src/frontend/rootAdminShell/assets/app.mjs`
  - `docs/workspace/design-system/adoption/root-admin-governed-page-implementation-audit.md`
- Current classification:
  `/root-admin/users`, `/root-admin/tenants`, and
  `/root-admin/tenant-admins` consume the DS-owned directory workspace seam.
  All three directory pages now mount through route modules; root-admin owns
  API wiring and selected tenant context, not list-page or drawer-form UI
  reconstruction.

#### Web-App Hierarchy Page

- Status: `app-consumable-seam` consumed through a thin adapter
- Evidence:
  - `src/frontend/rootAdminShell/routes/web-app-hierarchy/page.mjs`
  - `src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs`
  - `src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs`
  - `src/frontend/designSystem/assets/hierarchyTree.mjs`
  - `src/frontend/designSystem/assets/formControls.mjs`
- Current classification:
  the route module owns durable route mounting, while the thin
  `webAppHierarchyPage.mjs` adapter owns backend calls and page integration.
  The workspace shell, hierarchy tree, icon-grid, drawer-select, and related
  controller behavior are DS-owned.

#### Login Surface

- Status: `app-consumable-seam`
- Evidence:
  - `src/frontend/designSystem/assets/loginTemplate.mjs`
  - `src/frontend/rootAdminShell/assets/app.mjs`
  - `docs/workspace/design-system/adoption/login-template-app-adoption-contract.md`
- Current classification:
  DS owns login render/controller structure. Root-admin owns root-auth API
  calls, signer-helper invocation, and session state.

#### Conversation Panel

- Status: `app-consumable-seam`
- Evidence:
  - `src/frontend/designSystem/assets/conversationPanel.mjs`
  - `src/frontend/designSystem/assets/conversationPanel.css`
  - `src/frontend/rootAdminShell/assets/app.mjs`
  - `docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md`
- Current classification:
  root-admin owns harness-chat API orchestration and product-specific data.
  DS owns panel render structure, panel controller behavior, and styling.

## Current Decision

Do not create `src/frontend/shared/` as part of the current root-admin cleanup.

Current rule:

- visual truth remains in `/design-system` canonical, pattern, template, and
  verification surfaces
- app-consumable governed UI seams remain in
  `src/frontend/designSystem/assets/`
- the authenticated reusable app shell target is governed by
  `app-shell-render-seam-contract.md`; root-admin is the first consumer, not
  the owner of the shared shell primitive
- root-admin durable page routing moves to
  `src/frontend/rootAdminShell/routes/**`
- root-admin-only non-governed helpers may move to
  `src/frontend/rootAdminShell/shared/**` only after at least two route modules
  need the same helper

If a future change wants generic shared frontend seams outside the design
system, open an ADR first and classify which existing seams move.

## Verification Hooks

Existing checks that support this classification:

- `npm run check:governed-ui-adoption`
- `npm run check:governed-root-admin-ui`
- `npm run check:frontend-architecture`
- `npx vitest run tests/audit/designSystem`
- focused root-admin browser and visual tests for adopted pages

## Next Recommended Actions

1. Keep route extraction moving page by page, but treat route modules as app
   glue only.
2. Add broader shell parity coverage around the new `appShell.mjs` first
   consumer before using it for tenant-admin or tenant-user surfaces.
3. Keep `/root-admin/roles` and `/root-admin` overview as conscious local
   placeholders until a DS-backed family or explicit exception is approved.
4. Refresh this audit whenever a new app-consumable DS seam is introduced or a
   root-admin route moves out of `app.mjs`.
