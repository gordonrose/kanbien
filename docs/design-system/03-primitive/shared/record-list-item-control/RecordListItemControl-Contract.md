# Record List Item Control Primitive Contract

Layer: `03-primitive`
Status: `review-ready`
Behavior rule:
`docs/design-system/01-behavior-rule/shared/record-list-item/RecordListItem-Behaviour.md`

## Purpose

`record-list-item-control` is a governed primitive for one interactive item in
a record list or similar item collection.

It owns item activation, selected state, disabled state, draggable state, drag
source/drop-marker state, and the event contract for opening or moving an item.
It does not own the detail drawer that opens after selection.

## Token Dependencies

- `record-list-item-frame`
- `drag-drop-affordance-frame`
- `label-text-style`
- `supporting-text-style`
- `focus-ring`
- `minimum-target-size`

## Primitive Dependencies

- `focus-instruction-disclosure`

Keyboard reorder instruction copy must be rendered through the shared
focus-instruction-disclosure primitive. `record-list-item-control` owns open,
move, drag, and drop events; it must not recreate a local keyboard hint
surface.

## Behavior Contract

The primitive must render an enabled item as a button-like control with one
stable item id and accessible name.

Click, Enter, and Space emit `record-list-item:open`.

Pointer drag emits `record-list-item:move` only after a valid drop target is
chosen. Keyboard movement emits the same event shape without requiring pointer
drag. Keyboard movement uses `Alt+ArrowUp` to request moving before the
previous item and `Alt+ArrowDown` to request moving after the next item.

Selected, disabled, dragging, and drop-target states are programmatic and must
use token-backed visual affordances. Selected rows must not render a leading
vertical strip. Drag and drop-marker affordances must come from
`drag-drop-affordance-frame`, not the row-frame token.

## Event Contract

`record-list-item:open` detail:

- `itemId`

`record-list-item:move` detail:

- `itemId`
- `targetItemId`
- `position`: `before` or `after`
- `input`: `drag` or `keyboard`

## Accessibility Contract

The item must expose visible focus, selected state when selected, disabled
state when disabled, and a usable keyboard path for open and move intents.

Native drag/drop must not be the only way to request movement.

When a draggable item has visible focus, the primitive must expose visible
instructional text for the keyboard reorder shortcut through
`focus-instruction-disclosure`. The same instruction must be referenced through
`aria-describedby` so the behavior is discoverable for screen-reader users
without making every row permanently noisy.

## Consumer Restrictions

Consumers must not copy chat-workspace row drawer selectors, kanban drag
handlers, template markup, or app-local CSS to recreate this behavior.

Later list, board, kanban, and drawer patterns must consume this primitive
rather than reconstructing row interaction locally.
