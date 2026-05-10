# Governed App Component Adoption Contract

## Scope

- Artifact:
  governed design-system-to-app adoption contract
- Status:
  active architecture and migration guidance
- Governing ADR:
  `docs/architecture/adr/0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`
- Related prerequisite ADR:
  `docs/architecture/adr/0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md`

## Purpose

Define the honest adoption rule for governed frontend families in real app
routes.

Shared CSS is still required, but it is only one layer of the contract.
Governed adoption is not complete until the real app consumes the
design-system-owned seams for styling, render structure, and behavior.

## Enforcement Rule

For governed frontend families, shared CSS imports alone do not count as
design-system adoption.

Governed app adoption must consume the design-system-owned source of truth for:

- visual styling
- render structure and markup
- interaction behavior
- accessibility and state semantics

Duplicating governed component markup in an app page is drift unless an
explicit exception is approved.

Duplicating governed interaction logic in an app page is drift unless an
explicit exception is approved.

If a governed family does not yet expose a consumable shared render or
behavior seam, stop and raise the gap for human decision.

Do not satisfy governed adoption by copying HTML structure, ARIA or state
behavior, or page-local controller logic into the app.

## Current Audit

### Current Shared CSS Entrypoints

- `list-page`
  `/design-system/assets/list-page-shared.css`
- `hierarchy-tree`
  `/design-system/assets/hierarchy-tree-shared.css`
- `form-template`
  `/design-system/assets/form-template-shared.css`

### Current Design-System-Owned JS Or Interaction Seams

- `context-nav`
  `/design-system/assets/contextNav.mjs`
  exports `partitionContextNavItems(...)`,
  `renderContextNavItems(...)`,
  `renderContextNavMenuItems(...)`, and
  `renderRootAdminContextNavShell(...)`
- `hierarchy-tree`
  `/design-system/assets/hierarchyTree.mjs`
  exports `mountRootAdminHierarchyTree(...)`
- `web-app-hierarchy workspace`
  `/design-system/assets/webAppHierarchyWorkspace.mjs`
  exports `renderWebAppHierarchyWorkspaceShell(...)` and
  `createWebAppHierarchyWorkspaceController(...)`
- `root-admin directory workspace`
  `/design-system/assets/rootAdminDirectoryWorkspace.mjs`
  exports `renderRootAdminDirectoryWorkspaceShell(...)` and
  `createRootAdminDirectoryWorkspaceController(...)` for root users,
  tenants, and tenant admins
- `icon-grid`
  `/design-system/assets/formControls.mjs`
  exports `renderFormIconGrid(...)`, plus initialization and refresh helpers
- `drawer-select`
  `/design-system/assets/formControls.mjs`
  exports `renderFormDrawerSelect(...)`, plus initialization and refresh
  helpers such as `initializeFormDrawerSelects(...)` and
  `refreshFormDrawerSelect(...)`
- `form-image-card`
  `/design-system/assets/formControls.mjs`
  exports `renderFormImageCard(...)`; consuming features own any modal,
  upload, alt-text, authorization, persistence, and asset lifecycle behavior
  behind the image-scoped edit action
- `login-template`
  `/design-system/assets/loginTemplate.mjs`
  exports `renderLoginTemplate()`, `renderRootAdminLoginTemplate()`, and
  `createLoginTemplateController(...)`
- `app-shell`
  `/design-system/assets/appShell.mjs`
  exports `renderAppShell(...)` and `createAppShellController(...)`; root-admin
  is the first governed consumer, but the seam is reusable app-frame
  infrastructure rather than a root-admin-only primitive
- `kanban-column`
  `/design-system/assets/kanbanColumnSeam.mjs`
  exports board/card/drawer render helpers and
  `createKanbanColumnController(...)`; no real app consumer is approved yet
- `floating-tab-header`
  `/design-system/assets/floatingTabHeader.mjs`
  exports `renderFloatingTabHeader(...)` and `mountFloatingTabHeader(...)`
  with reusable app adoption rules in
  `docs/workspace/design-system/adoption/floating-tab-header-adoption-contract.md`

### Current Duplication In App Consumers

- `rootAdminShell` `Users`, `Tenants`, and `Tenant Admins`
  - imports shared list-page CSS
  - now consumes the DS-owned root-admin directory workspace render/controller
    seam from `rootAdminDirectoryWorkspace.mjs`
  - `Users`, `Tenants`, and `Tenant Admins` now mount that seam through
    `src/frontend/rootAdminShell/routes/users/page.mjs`,
    `src/frontend/rootAdminShell/routes/tenants/page.mjs`, and
    `src/frontend/rootAdminShell/routes/tenant-admins/page.mjs`
  - no longer duplicates list-page shell markup in `rootAdminShell/index.html`
  - no longer owns route-local list-page or drawer-form controller behavior
    inside `rootAdminShell`
- `rootAdminShell` `context-nav`
  - now consumes the shared DS-owned host render, mobile overflow partition,
    destination-link render, and menu-render behavior from `contextNav.mjs`
  - keeps route-specific page-settings fetch and current-page wiring in
    `rootAdminShell/assets/app.mjs`
- `rootAdminShell` page shell
  - imports the DS-owned app-shell render/controller seam from
    `/design-system/assets/appShell.mjs`
  - renders authenticated shell structure through `renderAppShell(...)`
  - uses `createAppShellController(...)`, which composes shared breadcrumb,
    chrome, language, and tooltip controllers instead of requiring root-admin
    to wire those interaction grammars locally
- `rootAdminShell` `web-app-hierarchy`
  - imports shared hierarchy-tree and form-template CSS
  - mounts through
    `src/frontend/rootAdminShell/routes/web-app-hierarchy/page.mjs`, which
    delegates to the thin root-admin page adapter
  - imports the DS-owned workspace render/controller seam from
    `webAppHierarchyWorkspace.mjs`
  - now mounts `icon-grid` through the DS-owned `renderFormIconGrid(...)`
    seam instead of hardcoding the field and modal markup locally
  - now mounts `drawer-select` through the DS-owned
    `renderFormDrawerSelect(...)` seam instead of hardcoding the trigger and
    drawer shell markup locally
  - no longer duplicates the workspace form host or hierarchy drawer host in
    `rootAdminShell/index.html`
  - still depends on the broader root-admin shell for the context-nav launcher
    and surrounding shell host composition
- `rootAdminShell` unauthenticated login
  - imports the DS-owned login-template render/controller seam from
    `loginTemplate.mjs`
  - renders registered SSH key choice rows through
    `renderRootAdminSshKeyChoiceRows(...)` and
    `createLoginTemplateController(...).renderSshKeyChoices(...)`
  - uses design-system-owned styles from `/design-system/assets/styles.css`
  - no longer loads `src/frontend/rootAdminShell/assets/login.css`
  - keeps root-auth API calls, signer-helper invocation, and session behavior
    in `rootAdminShell/assets/app.mjs`

## Target Seam Shape

Each governed family intended for app adoption should publish:

- shared CSS seam
- shared render or markup seam
- shared interaction or controller seam
- explicit allowed consumer inputs

### Allowed Consumer Inputs

Allowed inputs should be narrow and explicit, for example:

- label or copy overrides explicitly approved for that consumer
- initial value or selected values
- option records, tree data, or item collections
- action enablement or permission flags
- business callbacks such as `onSelect`, `onOpen`, `onRename`, or `onSubmit`

### Consumer Boundary

The app may own:

- route data fetching
- API request and response wiring
- capability-driven visibility and action enablement
- composition of multiple approved families on one route

The app must not own:

- family HTML copied from `/design-system`
- family-owned ARIA structure or state attributes
- family-owned open, close, focus, search, selection, or other interaction
  grammar
- local controller code that exists only because the design system did not yet
  expose a reusable seam

## First Migration Candidates

### 1. `icon-grid`

- Why first:
  smallest contained family in the current gap set
- Current posture:
  migrated first consumer to shared DS-owned render plus shared behavior
- Needed seam:
  maintain `renderFormIconGrid(...)` as the shared hosted render seam and grow
  tests or docs if the consumer-input contract changes

### 2. `drawer-select`

- Why second:
  closely related to `icon-grid` and already shares the same
  `formControls.mjs` behavior module
- Current posture:
  migrated real consumer to shared DS-owned render plus shared behavior
- Needed seam:
  maintain `renderFormDrawerSelect(...)` as the shared hosted render seam and
  keep the allowed consumer-input contract narrow

### 3. `web-app-hierarchy workspace host`

- Why third:
  the hierarchy route was the highest-risk governed adopter because the app was
  still carrying the host render structure even after child controls and
  controller behavior moved upstream
- Current posture:
  migrated to DS-owned workspace render and controller seams through
  `webAppHierarchyWorkspace.mjs`
- Needed seam:
  keep the workspace render/controller contract narrow and explicit as route
  business callbacks evolve

### 4. `form-image-card`

- Why next:
  compact reusable form child seam with no transport or persistence behavior
- Current posture:
  promoted to a design-system-owned render seam with dedicated component and
  canonical render surfaces
- Needed seam:
  maintain `renderFormImageCard(...)` as the shared hosted render seam; app
  consumers may pass only variant, image URL/alt label, display identity text,
  and edit-label copy while owning all asset and modal behavior outside the
  design-system component

## Recommended Implementation Order

1. Extend DS-owned render/controller seams for the next governed app family
   instead of repeating app-local route host markup.
2. Re-evaluate whether `users` should publish a DS-owned list-page render seam
   rather than remaining a shared-CSS plus app-local markup consumer.

## Trade-Offs To Surface Before Migration

- the next meaningful migration is now the `users` list-page family, because
  `web-app-hierarchy` now consumes a DS-owned workspace render/controller seam
- list-page migration remains medium-to-high risk because it combines render
  structure, detail behavior, and responsive overlay posture

Do not silently migrate all four in one pass.
Pick one family at a time and confirm the ownership boundary before code moves.
