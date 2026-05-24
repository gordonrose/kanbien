# FilterPanelStructure Behavior Lock

## Scope

`FilterPanelStructure` is the reusable foundation for collection filter
overlays. It owns the panel container, title section, scroll stack, card
structure slots, mobile behavior, and display-setting demo states.

## Behavior Contract

- `FPS-001`: The filter panel behaves as an overlay whose width stays stable
  while the page behind it resizes.
- `FPS-002`: Desktop width is bounded for zoom and readability, not tied to the
  live page column fraction.
- `FPS-003`: Mobile layout makes the filter panel full page width.
- `FPS-004`: The title section remains pinned at the top while count card
  structures scroll below it.
- `FPS-005`: The title section splits into a `3:1` relationship, with the
  larger left zone reserved for title content and the smaller right zone
  reserved for auxiliary action content.
- `FPS-005A`: The title section uses the same rendered height as the shared
  page header row. It does not inherit the taller count-card row height.
- `FPS-006`: Count card structure sections stack from top to bottom and do not
  stretch to fill available vertical height.
- `FPS-007`: Each count card structure contains a centered internal card slot
  that is wider than the first draft and tall enough to represent the future
  count card.
- `FPS-008`: Display settings support exactly three card-structure count
  states: none, five, and twenty.
- `FPS-009`: Switching the card-structure count updates pressed state honestly
  and resets the scroll stack to the top.
- `FPS-010`: The twenty-card state proves scroll behavior without moving the
  title section.
- `FPS-011`: The structure is content-neutral; it does not define actual filter
  fields, count cards, option lists, or domain copy.
- `FPS-012`: Direction, theme, and magnification inherit from the shared
  design-system shell without creating overlapping panel content.

## Adoption Rule

Collection filter UIs must consume this seam or a documented adapter before
adding real count card content. App-local copies of the token route structure
are drift.
