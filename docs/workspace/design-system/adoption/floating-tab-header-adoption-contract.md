# Floating Tab Header Adoption Contract

## Scope

- Component family:
  `floating-tab-header`
- Shared render/controller seam:
  `/design-system/assets/floatingTabHeader.mjs`
- Status:
  reusable governed app adoption contract

## Approved App Consumption

App pages that consume the floating tab header must import the shared
design-system seam and render through:

- `renderFloatingTabHeader(...)`
- `mountFloatingTabHeader(...)`

The app may pass route-owned data and copy into the seam:

- tab category records
- tab labels, supporting metadata, counters, and attention flags
- row/list records for the selected view
- sub-tab records
- route-level labels such as `ariaLabel`, `tablistLabel`, `subTabLabel`, and
  `panelKicker`
- initial URL/query-derived display state when approved for that route

## Ownership Boundary

The design system owns:

- `.floating-tab-*` markup structure
- tab, sub-tab, overflow, category-switch, collapse, and scroll behavior
- attention-state rendering
- truncated-label tooltip attachment
- ARIA roles, labels, selected state, and live readout behavior
- layout, spacing, clipping, and responsive behavior

The consuming app owns:

- durable route identity
- page shell composition around the component
- data selection and API/persistence wiring
- business-specific copy and record payloads supplied as seam inputs

The consuming app must not own:

- copied `.floating-tab-card` or `.floating-tab-sub-tab` markup
- app-local `.floating-tab-*` CSS
- app-local click, scroll, category drawer, collapse, sub-tab, attention, or
  tooltip controller logic
- native `title` fallback behavior for clipped labels

## Runtime Import Rule

First-consumer app pages must keep the import chain honest when behavior
changes. If a runtime behavior fix changes the shared floating tab controller,
the consuming app route must load a fresh module graph through versioned import
specifiers or an equivalent governed asset-versioning seam.

For the root-admin Build Backlog first consumer, the required chain is:

- `/root-admin/assets/app.mjs?v=2026-05-08-floating-tab-tooltip-contract`
- `./buildBacklogPage.mjs?v=2026-05-08-floating-tab-tooltip-contract`
- `/design-system/assets/floatingTabHeader.mjs?v=2026-05-08-overflow-tooltip-contract`

## Browser Proof Requirements

Every first consumer must include a browser proof that checks:

- the app page imports the shared renderer and controller instead of copying
  component markup
- visible labels that are not clipped do not expose `data-tooltip`
- genuinely clipped labels expose the shared tooltip
- native `title` attributes are absent
- context-nav rails, drawers, and menus remain above the floating tab header
- the content-collapse control hides only the content panel, not the tab
  header itself

## Current Consumer

- `/root-admin/build/backlog`
  first consumer and proof surface
- First-consumer contract:
  `docs/workspace/design-system/adoption/root-admin-build-backlog-floating-tab-header-adoption-contract.md`
- Browser proof:
  `tests/visual/app/rootAdminShell/rootAdminBuildBacklog.spec.ts`
