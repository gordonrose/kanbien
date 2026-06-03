# Record List Pattern Contract

Layer: `04-pattern-contract`

Pattern: `record-list`

Status: `review-ready`

## Responsibility

`record-list` composes governed record list item rows and a governed detail
slot into a reusable list-detail structure. It owns selected/open item
coordination across rows, DOM reorder application from primitive move events,
empty-list posture, and the placeholder detail body that later component seams
may replace with an entity panel.

The pattern also owns list-to-detail ratio variants for two-pane review:
`1:5`, `1:4`, and `1:2`. These variants define the starting column balance
only. Manual resizing is delegated to `resize-handle-control`.

## Non-Goals

This pattern does not define row visuals, drag marker visuals, row keyboard
behavior, row ARIA, persisted sorting, backend updates, entity panel body
content, canonical scenarios, demo pages, or app adoption.

## Upstream Dependencies

| Dependency | Owning layer | Status | Use |
| --- | --- | --- | --- |
| `record-list-item-control` | `03-primitive` | `review-ready` | Renders each row and owns row open/move event semantics. |
| `detail-slot-control` | `03-primitive` | `review-ready` | Renders the detail slot shell, theme surface, accessible label, and close event. |
| `resize-handle-control` | `03-primitive` | `review-ready` | Renders the separator and owns pointer, keyboard, ARIA, focus, and clamping behavior for manual detail-slot resizing. |

## Inventory Result

The legacy `/design-system/templates/record_management_list_centric` route is
source-material inventory. It is not a governed Layer 4 pattern and must not be
copied into downstream consumers.

No governed `record-list` pattern existed before this contract.

## Composition Contract

- The pattern must render a list region with one governed
  `record-list-item-control` per provided item.
- The pattern must render an empty state when there are no items.
- The pattern must compose `detail-slot-control` whose open item is derived from the
  selected item or a row open event.
- The detail body may show proof placeholder content, but later components
  must supply governed panel/body content through a downstream seam.
- The pattern must support `1:5`, `1:4`, and `1:2` list-to-detail ratio
  variants for initial desktop column balance.
- The pattern may compose `resize-handle-control` between the list and detail
  slot; manual resizing updates pattern placement values only after the resize
  primitive emits a resize event.
- The pattern's manual resize max must not be narrower than the widest
  supported ratio in the default wide proof; switching from ratio sizing to
  manual resizing must not snap the detail slot down to a competing ceiling.
- The pattern may apply DOM reorder in proof/runtime review when receiving
  `record-list-item:move`; persistence belongs to later consumers.
- After a successful move, the pattern must keep focus on the moved item and
  update a polite atomic live region with item label, numeric position, total
  count, and nearest-neighbor context when available.

## Data Contract

Each item accepts:

- `itemId`: stable non-empty item identifier
- `title`: visible row title
- `subtitle`: optional supporting row text
- `meta`: optional trailing row text
- `disabled`: optional disabled row state

`selectedItemId` and `openItemId` identify at most one known item each.

## Events

The pattern consumes:

- `record-list-item:open`
- `record-list-item:move`
- `detail-slot-control:close`
- `resize-handle-control:resize`

The pattern emits:

- `record-list:open`
- `record-list:close`
- `record-list:reorder`
- `record-list:resize-detail`

## Accessibility Contract

- Row semantics, focus, disabled state, keyboard open, keyboard move, drag
  source, and drop marker behavior remain owned by `record-list-item-control`.
- The list region must be named by the pattern consumer.
- The detail slot label, close action, theme surface, and keyboard reach are
  owned by `detail-slot-control`.
- Resize separator role, keyboard behavior, pointer behavior, ARIA value
  updates, focus, and clamping are owned by `resize-handle-control`.
- Closing the detail slot must return state to the closed posture without
  removing or mutating the list items.
- Empty state must be visible text and must not masquerade as a disabled row.
- Reorder feedback must be available to assistive technology through a live
  region. The announcement must include position context and should include
  `after <previous item>` and/or `before <next item>` where those neighbors
  exist.

## Visual-Skin Boundary

The list item, drag/drop, and detail-slot visuals are consumed through child
primitives and tokens. Pattern proof containers, fixture count, constrained
widths, and review mode controls are proof-only diagnostic pressure unless a
lower layer later signs them as reusable values.

## Consumer Restrictions

- Consumers must use this pattern for governed reorderable record lists with a
  detail slot.
- Consumers must not locally recreate row markup, drag handlers, keyboard move
  behavior, item disabled semantics, detail-slot aside markup, or close-button
  behavior.
- Consumers must not locally recreate resize handle markup, pointer behavior,
  keyboard behavior, ARIA separator behavior, or width clamping.
- Consumers must not treat this pattern as an app adoption seam, component
  prop API, canonical scenario, backend persistence contract, or entity panel
  implementation.

## Required Evidence

- Unit tests prove the pattern composes `record-list-item-control` and
  `detail-slot-control`, composes `resize-handle-control`, and exposes the
  supported ratio variants.
- Browser proof verifies open, close, reorder, empty state, constrained width,
  desktop, and mobile detail-slot behavior.
- The pattern readiness index lists the runtime seam and upstream dependencies.
