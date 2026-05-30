# Drag Drop Affordance Frame Token Contract

Layer: `02-token`
Status: `review-ready`
Token type: `drag-drop-affordance-frame`
Behavior rule:
`docs/design-system/01-behavior-rule/shared/record-list-item/RecordListItem-Behaviour.md`

## Purpose

`drag-drop-affordance-frame` defines reusable drag source, drag preview, and
drop-marker visual values for governed list, board, kanban, and reorderable
item patterns.

It is intentionally not list-specific. A record list, kanban column, tree, or
future board pattern may consume this token when a primitive or pattern exposes
the matching drag/drop semantics.

## Required Variant Roles

- `drag source`
- `drag preview`
- `drop marker`

## Required Value Fields

- `frameRole`
- `backgroundValue`
- `foregroundValue`
- `supportingForegroundValue`
- `borderValue`
- `accentValue`
- `radiusValue`
- `paddingBlockValue`
- `paddingInlineValue`
- `minBlockSize`
- `previewElevationValue`
- `markerMinBlockSize`
- `markerLabelValue`
- `motionValue`

## Consumer Rules

Consumers must use the governed runtime seam instead of local drag source,
preview elevation, drop-marker surface, label typography, or marker geometry
literals.

This token does not define drag event handling, data transfer payloads,
keyboard fallback behavior, live-region copy, persistence, board columns, or
drawer composition.
