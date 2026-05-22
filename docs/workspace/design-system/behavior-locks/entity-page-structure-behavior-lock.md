# EntityPageStructure Behavior Lock

## Scope

`EntityPageStructure` is the design-system foundation for entity record pages.
It owns structural regions only, before navigation index items, record panels,
forms, evidence, or domain components are placed into the page.

`EntityPageStructure` consumes the shared `PageBackground` environmental layer
and the shared foundation header behavior.

## Desktop Contract

- The top header region is a shared 24-column foundation header.
- There is no secondary header region.
- The body is a 12-column structural grid.
- The split occurs after the second body column.
- The two-column region is the navigation index foundation.
- The ten-column region is the record panel foundation.
- A thin resize line can expand the navigation index up to the fourth body
  column, leaving the remaining columns for the record panel.
- The record panel includes a 20-column header row over its 10-column body, so
  each body column maps to two header columns.
- Under the record panel header, a second index area starts at two columns and
  can expand up to four columns, leaving the remaining body columns for panel
  content.
- The body regions are transparent layers over one page-level background.

## Mobile Contract

- The top header follows the same mobile behavior as `ListPageStructure`: one
  visible header column only.
- The navigation index takes precedence on mobile.
- The navigation index overlays the record panel relationship instead of
  stacking above or below it.
- Display settings may preview either the top mobile index layer or the hidden
  bottom record-panel layer so the hidden region can be reviewed directly.
- In bottom-layer mobile preview, the secondary panel index moves into the
  panel header row, occupies the middle 60%, and is flanked by two header
  columns on each side.
- In bottom-layer mobile preview, panel content condenses to one row of two
  visible columns.
- The record panel does not create a separate visible mobile background layer.
- Resize is disabled on mobile.

## Display Drawer Controls

- Display settings may show or hide the top header.
- Display settings may control theme, magnification, primary colour, and
  direction.

## Non-Goals

- `EntityPageStructure` does not define index items, record fields, tabs,
  drawers, form layout, evidence panels, or entity-specific content.
