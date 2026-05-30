# Record List Item Behavior Rule

Layer: `01-behavior-rule`
Status: `review-ready`
UI family: `record-list-item`

## Purpose

A record list item lets a user work from a dense ordered list, select one item,
open its detail surface, and reorder eligible items without losing the list
context.

This rule is extracted from the
`/design-system/templates/record_management_list_centric` demo and from the
existing chat-workspace row drawer choreography. It governs the reusable row
behavior only; full list layout, entity drawer content, kanban columns, board
lanes, and app adoption remain later-layer work.

## Source Decision Ledger

| Observed decision | Owning layer | Existing governed seam | Missing seam | Allowed action |
| --- | --- | --- | --- | --- |
| Rows can be clicked to open detail. | `03-primitive` | chat-workspace row drawer helper is demo-local. | Record list item primitive. | Create primitive that emits an open event. |
| The selected row remains visibly and programmatically selected. | `02-token`, `03-primitive` | none for generic record rows. | Row frame and state token; primitive selected semantics. | Create token and primitive. |
| Desktop rows can be dragged and dropped with visible source and drop-marker affordances. | `02-token`, `03-primitive` | `dragDropAffordance` helper exists but is asset-level. | Governed drag/drop affordance values and event contract. | Promote generic affordance into token-backed primitive behavior. |
| Keyboard users need a non-drag movement path. | `03-primitive` | kanban demo has controller-local move logic. | Primitive move request event. | Primitive emits move requests from keyboard shortcuts. |
| Opening detail eventually uses a drawer or panel. | `04-pattern-contract` | entity panel and chat drawer are separate seams. | List-plus-detail pattern. | Primitive emits intent; pattern owns drawer composition later. |
| Kanban and board cards need similar drag/drop affordances. | `02-token`, `03-primitive` | kanban demo consumes asset helper. | Reusable item affordance token and primitive event shape. | Keep names item-oriented, not entity-only. |

## Behavior Contract

Each item exposes one stable item id, one programmatic name, and optional
supporting metadata.

Clicking or tapping an enabled item requests opening that item. The primitive
does not render or own the opened drawer; it emits a stable open event.

One item may be selected. Selection must be exposed programmatically and must
not render a leading vertical strip inside the row.

Eligible items may be draggable on pointer devices. Dragging an item exposes a
drag-source state, a drag preview, and a drop-marker target position.

Keyboard users must have a non-drag movement path. The primitive may emit move
requests for before, after, first, or last positions instead of moving persisted
data directly.

The primitive must support disabled items. Disabled items cannot be opened,
dragged, selected by pointer activation, or moved by keyboard shortcuts.

## Required Interactions

| Interaction | Observable behavior |
| --- | --- |
| click enabled item | Emits `record-list-item:open` with the item id. |
| enter or space on focused enabled item | Emits the same open event as click. |
| dragstart on draggable enabled item | Marks the item as dragging and sets drag data to the item id. |
| dragover an eligible list position | Shows one drop marker at the candidate position. |
| drop on eligible position | Emits `record-list-item:move` with source id, target id, and position. |
| escape during drag | Clears source and drop-marker state. |
| keyboard move command | Emits `record-list-item:move` without requiring pointer drag. |

## Responsive Contract

Desktop may expose direct drag/drop.

Touch and narrow layouts may suppress native drag/drop while preserving open
and keyboard/menu movement intents.

The primitive must not force a desktop ratio, drawer width, board column
layout, or mobile drill-in model. Those are pattern responsibilities.

## Accessibility Contract

The item control must preserve a programmatic name, visible focus, selected
state, disabled state, and keyboard activation.

Reorder behavior must announce a meaningful move request through an event and
must not make pointer drag the only available move path.

Drop-marker and drag-preview affordances are decorative unless a later pattern
adds live-region announcements for concrete product copy.

## Consumer Restrictions

Consumers must not recreate item open, selected, disabled, dragging, drop
marker, drag preview, or keyboard move behavior with app-local controller code
when this primitive is available.

Consumers must not copy chat-workspace row drawer selectors, kanban controller
logic, template route markup, or screenshot-derived CSS as governed adoption.

Consumers must compose the eventual drawer or detail panel through a later
pattern seam instead of putting drawer behavior into this primitive.
