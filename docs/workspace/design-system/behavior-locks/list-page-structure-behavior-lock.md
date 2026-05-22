# ListPageStructure Behavior Lock

## Scope

`ListPageStructure` is the design-system foundation for list-style pages before
records, filters, tabs, drawers, or domain components are placed into the page.
It owns structural regions only.

`ListPageStructure` consumes the shared `PageBackground` environmental layer.
It must not compute page background tokens locally.

## Desktop Contract

- The first header region is a 24-column structural grid.
- The second header region is a navigation/subheader grid controlled by display
  settings at 6, 12, 18, or 24 columns.
- When the second header is greater than 12 columns, the outer edge rails remain
  static and half-column width; horizontal scrolling happens only between them.
- The lower foundation area supports `full` and `1:4 split` modes.
- In `full` mode, the lower area presents one full-width primary region.
- In `1:4 split` mode, the lower area presents a side region and a primary
  region with a thin resizable foundation grid line between them.
- Desktop resize is bounded to the foundation relationship, not to eventual
  child component sizing.

## Mobile Contract

- There is no separate mobile landscape layout.
- The first header exposes one visible column only.
- The second header remains visible and horizontally scrollable, showing one
  column at roughly 80% width so adjacent columns remain hinted.
- In `full` mode, the lower area exposes one primary column only.
- In `1:4 split` mode, the primary four-column region is displayed over the
  side one-column region; the side region is hidden behind the primary region,
  not stacked below it.
- Display settings may preview either the top mobile layer or the hidden bottom
  mobile layer so the hidden region can be reviewed directly.
- Resize is disabled on mobile.

## Display Drawer Controls

- Display settings may switch between `full` and `1:4 split`.
- Display settings may show or hide the first and second headers independently.
- Display settings may change the second header column count.
- Display settings must update pressed state honestly for every active option.

## Accessibility

- The resize control is keyboard reachable on desktop.
- Arrow keys adjust the desktop split in quarter-step increments.
- The resize control exposes the current side/main relationship through ARIA
  value attributes.
- Hidden structural regions must be visually removed without becoming a second
  suggested content model.

## Non-Goals

- `ListPageStructure` does not define record cards, filters, bulk actions,
  tab systems, field layouts, drawer payloads, or entity-specific content.
- It must stay visually quiet so downstream page components can be placed into
  the foundation without inheriting false content semantics.
