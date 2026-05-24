# IconButton Behavior Lock

## Scope

`IconButton` is the reusable icon-only control seam for compact command
surfaces.

## Behavior Contract

- `ICB-001`: The icon button is square and centers inside its host structure
  cell.
- `ICB-002`: The fluid button size clamps from 75% to 150% of the base control
  size.
- `ICB-003`: Minimum, base, and maximum host-cell examples are represented.
- `ICB-004`: Normal, dark, and desert theme previews are represented.
- `ICB-005`: Icon-only buttons require accessible names.
- `ICB-006`: Tooltip text may mirror the accessible name but must not replace
  it.
- `ICB-007`: Hover/focus state must use the approved icon-button background,
  border, and ink relationships.
- `ICB-008`: The seam defines the icon-button frame and state treatment only;
  command meaning belongs to the consumer.

## Adoption Rule

App icon-only controls must preserve accessible names, target sizing, focus
visibility, and tooltip relationship when consuming this seam.
