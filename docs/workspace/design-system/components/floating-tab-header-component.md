# Floating Tab Header Component

## Scope

- Component name:
  `FloatingTabHeader`
- Status:
  signed-off with canonical renderings
- Owner:
  Design system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/floating-tab-header-behavior-lock.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/floating-tab-header-reference-pack.md`
- Shared render seam:
  `src/frontend/designSystem/assets/floatingTabHeader.mjs`
- Shared controller seam:
  `src/frontend/designSystem/assets/floatingTabHeader.mjs`
- Shared style seam:
  `src/frontend/designSystem/assets/styles.css`

## Purpose

Render a floating secondary navigation header for one list, board, or project
where each tab carries a count and optional attention state. The component
keeps overflow, subtabs, category switching, and content collapse behavior
inside a design-system-owned seam. This artifact is not app-consumable yet
because no first-consumer adoption contract or real-app parity proof exists
yet.

## Public API

- `renderFloatingTabHeader(options)` returns the governed HTML structure.
- `mountFloatingTabHeader(options)` wires the governed interaction behavior.
- Supported inputs:
  category data, row data, subtab data, active category, active tab index,
  scoped instance ID, category metadata, accessible labels, tablist labels,
  subtab labels, and panel kicker copy.
- Supported route/demo state:
  `tabs`, `layout`, `rowPacking`, `subTabs`, `attention`, `expandable`,
  `collapsed`, `categorySwitch`, `category`, `window`, `windowStart`,
  `drawer`, `categoryOpen`, `theme`, `dir`, `zoom`, and `focus`.
- Required consumer posture:
  blocked until a first-consumer adoption contract and real-app parity proof
  exist. Consumers must pass approved list/project data into the seam and
  compose host page copy around it;
  they must not copy `floating-tab-*` markup, ARIA attributes, overflow
  counters, category drawer structure, or controller logic into app pages.

## Behavior Contract

- Tab cards expose title, meta, count, selected state, and optional attention.
- Horizontal tab cards use roomy full-card treatment when their rendered title,
  meta, count, and attention content fit inside the available rail.
- When roomy cards do not fit, the controller switches to the compact card
  treatment for that rendered space before it hides additional cards.
- When compact cards still do not fit, overflow is paged through the same
  hidden-count summaries and arrow controls used for over-limit tab sets.
- Ten tabs can fit one single-row rail when the measured rail has enough room;
  double-row mode uses five tabs per row and at most two rows.
- Overflow is navigated by paging arrows and side-aware hidden-count summaries,
  not by a visible native scrollbar.
- Optional subtabs render below the main rail without competing with the
  right-hand control column.
- Optional collapse hides only the content panel and never hides the tab rail.
- Optional category switch opens a single-select drawer in the control column.
- Vertical mode keeps the tab list scrollable while category and collapse
  controls remain grouped.
- Truncated labels use the shared tooltip layer rather than native `title`.

## Accessibility Contract

- The main rail is a `tablist`; tab cards use `role="tab"` and synchronize
  `aria-selected`.
- The content area is a `tabpanel` labelled by the active tab.
- Category selection is a radio group with one active category.
- Collapse state synchronizes `aria-expanded` and panel `aria-hidden`.
- Hidden-count summaries and collapsed-content summaries use polite live
  announcements.
- Keyboard and focus-visible states must remain unclipped in horizontal,
  vertical, overflow, RTL, and magnified states.

## Token Dependencies

- Uses existing design-system tokens in `styles.css`, including `--ink`,
  `--ink-soft`, `--surface-*`, `--line`, `--line-strong`, `--accent`,
  `--accent-soft`, `--error-*`, `--radius`, `--radius-sm`, and shared tooltip
  variables.
- Consumers must not override the component with app-page CSS. New visual
  variants require a design-system loop and reference-pack update.

## Adoption Boundary

- Family-owned:
  tab header markup, counter-card anatomy, overflow summaries, paging arrows,
  category drawer, subtab rendering, collapsed panel summary, ARIA/state
  semantics, and controller behavior.
- Host-owned:
  surrounding page title, primary page action, list/project data source, and
  actual route/data persistence.
- First app consumer:
  blocked. Before real app adoption, create a consumer-specific adoption
  contract naming the source reference states, host boundaries, and parity
  evidence.

## Verification

- Structural gate:
  `tests/audit/designSystem/artifactQualityGate.test.ts`
- Component wiring gate:
  `tests/audit/designSystem/floatingTabHeaderArtifacts.test.ts`
- Route gate:
  `tests/integration/designSystem/route.test.ts`
- Reference matrix:
  `FTH-R-001` through `FTH-R-024`
- Browser smoke:
  dense RTL, dark theme, zoomed, drawer-open, middle-overflow route verified on
  `/design-system/canonical-renderings/floating-tab-header/:ref`.
- Canonical rendering gate:
  satisfied by `/design-system/canonical-renderings/floating-tab-header`,
  `/design-system/canonical-renderings/floating-tab-header/:ref`,
  `src/frontend/designSystem/assets/floatingTabHeaderCanonical.mjs`, and
  `tests/visual/designSystem/canonicals/navigation/floatingTabHeaderCanonical.spec.ts`.

## Traceability

- Workspace artifact:
  `docs/workspace/design-system/components/floating-tab-header-component.md`
- Design-system route:
  `/design-system/components/floating-tab-header`
- Canonical launcher:
  `/design-system/canonical-renderings/floating-tab-header`
- Canonical render route pattern:
  `/design-system/canonical-renderings/floating-tab-header/:ref`
- Exploration route:
  `/design-system/exploration/floating-tab-header`
