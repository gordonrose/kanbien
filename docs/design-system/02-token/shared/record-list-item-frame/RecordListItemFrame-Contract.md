# Record List Item Frame Token Contract

Layer: `02-token`
Status: `review-ready`
Token type: `record-list-item-frame`
Behavior rule:
`docs/design-system/01-behavior-rule/shared/record-list-item/RecordListItem-Behaviour.md`

## Purpose

`record-list-item-frame` defines the reusable row, selected row, and disabled
row visual values used by governed item-list primitives.

It does not define list layout, entity drawer content, kanban lanes, item data,
ARIA behavior, or persistence.

## Required Variant Roles

- `item row`
- `selected item row`
- `disabled item row`

## Required Value Fields

- `frameRole`
- `backgroundValue`
- `foregroundValue`
- `supportingForegroundValue`
- `borderValue`
- `radiusValue`
- `paddingBlockValue`
- `paddingInlineValue`
- `gapValue`
- `minBlockSize`
- `motionValue`

## Consumer Rules

Every design system must expose these roles before a record-list-item primitive
or a later list pattern owns row state visuals.

Consumers must use the governed runtime seam instead of hard-coding row
padding, row surfaces, border, radius, or motion values. Selected rows must not
add a leading vertical strip; selection is communicated by the selected surface,
border, and primitive-owned programmatic state.

This token does not define click behavior, keyboard behavior, drag/drop
affordances, drawer composition, board columns, or app adoption.
