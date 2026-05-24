# EntityPageStructure Behavior Lock

## Scope

`EntityPageStructure` is the design-system foundation for entity record pages.
It owns structural regions only, before navigation index items, record panels,
forms, evidence, or domain components are placed into the page.

`EntityPageStructure` consumes the shared `PageBackground` environmental layer
and the shared foundation header behavior.

## Desktop Contract

- `EPS-001`: The top header region is a shared 24-column foundation header.
- `EPS-001A`: The shared foundation header collapses from its own rendered
  width, not the viewport: constrained widths remove one header column at a
  time while reducing the grid track count so the remaining visible columns
  continue to fill the full inline width.
- `EPS-002`: There is no secondary header region.
- `EPS-003`: The body is a 12-column structural grid.
- `EPS-004`: The split occurs after the second body column.
- `EPS-005`: The two-column region is the navigation index foundation.
- `EPS-006`: The ten-column region is the record panel foundation.
- `EPS-007`: A thin resize line can expand the navigation index up to the fourth body
  column, leaving the remaining columns for the record panel.
- `EPS-008`: The record panel includes a 20-column header row over its 10-column body, so
  each body column maps to two header columns.
- `EPS-009`: Under the record panel header, a second index area starts at two columns and
  can expand up to four columns, leaving the remaining body columns for panel
  content.
- `EPS-010`: The body regions are transparent layers over one page-level background.

## Mobile Contract

- `EPS-011`: At the narrow mobile fallback, the top header follows the same
  behavior as `ListPageStructure`: one visible header column only.
- `EPS-012`: The navigation index takes precedence on mobile.
- `EPS-013`: The navigation index overlays the record panel relationship instead of
  stacking above or below it.
- `EPS-014`: Display settings may preview either the top mobile index layer or the hidden
  bottom record-panel layer so the hidden region can be reviewed directly.
- `EPS-015`: In bottom-layer mobile preview, the secondary panel index moves into the
  panel header row, occupies the middle 60%, and is flanked by two header
  columns on each side.
- `EPS-016`: In bottom-layer mobile preview, panel content condenses to one row of two
  visible columns.
- `EPS-017`: The record panel does not create a separate visible mobile background layer.
- `EPS-018`: Resize is disabled on mobile.

## Display Drawer Controls

- Display settings may show or hide the top header.
- Display settings may control theme, magnification, primary colour, and
  direction.

## Non-Goals

- `EntityPageStructure` does not define index items, record fields, tabs,
  drawers, form layout, evidence panels, or entity-specific content.
