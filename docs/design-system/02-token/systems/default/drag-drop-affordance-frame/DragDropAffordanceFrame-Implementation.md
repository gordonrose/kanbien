# Default Drag Drop Affordance Frame Token Implementation

Layer: `02-token`
Status: `review-ready`
System key: `default`

## Governed Route

`/design-system/default/tokens/drag-drop-affordance-frame`

## Runtime Seam

`src/frontend/designSystem/layers/02-token/drag-drop-affordance-frame/systems/default.mjs#dragDropAffordanceFrameTokenSpec`

## Evidence

The proof route renders drag source, drag preview, and drop-marker affordances
across original, dark, and desert themes. The `record-list-item-control`
primitive consumes this token for drag/drop affordance behavior.

## Restrictions

This token may be consumed by reorderable item primitives and later list, board,
tree, and kanban patterns. It must not be used as a generic selected-row,
menu-option, panel, or drawer token.
