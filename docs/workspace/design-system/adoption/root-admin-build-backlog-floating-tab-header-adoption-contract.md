# Root Admin Build Backlog Floating Tab Header Adoption Contract

## Scope

- Component family:
  `floating-tab-header`
- First consumer surface:
  `/root-admin/build/backlog`
- Root-admin module:
  Build
- Root-admin page:
  Backlog
- Shell page key:
  `build-backlog`
- Status:
  first-consumer contract and UI proof surface

## Source Of Truth

- Behavior lock:
  `docs/workspace/design-system/behavior-locks/floating-tab-header-behavior-lock.md`
- Reference pack:
  `docs/workspace/design-system/reference-packs/floating-tab-header-reference-pack.md`
- Component docs:
  `docs/workspace/design-system/components/floating-tab-header-component.md`
- Verification checklist:
  `docs/workspace/design-system/verification/floating-tab-header-verification-checklist.md`
- Reusable adoption contract:
  `docs/workspace/design-system/adoption/floating-tab-header-adoption-contract.md`
- Shared render and controller seam:
  `/design-system/assets/floatingTabHeader.mjs`

## Adoption Rule

Root-admin must consume the design-system-owned `floatingTabHeader` seam for
markup, interaction behavior, ARIA/state semantics, overflow handling,
attention states, sub tabs, category switching, and collapsible content.

The app may own only:

- the durable route and page key
- the Build/Backlog page copy
- the tab/category/row data supplied to the seam
- route-level search keywords and breadcrumb labels

The app must not own:

- copied `.floating-tab-*` component structure in `index.html`
- app-local floating tab CSS
- app-local scroll, overflow, category drawer, attention, sub-tab, or collapse
  controller logic

## Canonical Reference Coverage

The first consumer is pinned to the signed-off canonical family:

- baseline horizontal state: `FTH-R-001`
- expandable content states: `FTH-R-006`, `FTH-R-007`
- sub-tab and attention states: `FTH-R-008` through `FTH-R-011`
- crowded and overflow states: `FTH-R-014` through `FTH-R-018`
- vertical and long-list states: `FTH-R-012`, `FTH-R-013`
- truncation and tooltip states: `FTH-R-019`, `FTH-R-020`
- accessibility, theme, RTL, and magnification states: `FTH-R-021` through
  `FTH-R-024`

## Consumer Proof Requirements

- `/root-admin/build/backlog` must resolve as a path-backed durable root-admin
  route, not a hash alias.
- Surface discovery must report `/root-admin/build/backlog`, not
  `/root-admin/build-backlog`.
- Root-admin `index.html` may include only a mount section for the page.
- The page adapter must import `renderFloatingTabHeader(...)` and
  `mountFloatingTabHeader(...)` from `/design-system/assets/floatingTabHeader.mjs`.
- Browser proof must load the authenticated root-admin page and assert the
  rendered tab header exposes the signed-off data attributes for category
  switching, expandable content, sub-tabs, attention, ten-tab crowding, and
  overflow readiness.
- Browser proof must assert visible, unclipped labels do not expose
  `data-tooltip`, clipped labels do expose the shared tooltip, and native
  `title` attributes remain absent.
- Runtime proof must show the served first-consumer module chain reaches the
  current floating tab controller version when behavior changes.

## Explicit Deferrals

- The Build backlog is not yet connected to durable backlog persistence.
- Counts, labels, and row records are representative contract data only.
- Backlog mutation, assignment, sorting, and permissions remain future product
  work and must not be inferred from this UI proof.
