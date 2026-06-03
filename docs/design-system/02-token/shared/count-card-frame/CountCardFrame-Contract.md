# Count Card Frame Token Contract

Layer: `02-token`

Token type: `count-card-frame`

Status: `review-ready`

Owning behavior rule: `docs/design-system/01-behavior-rule/shared/count-card/CountCard-Behaviour.md`

## Scope

`count-card-frame` governs reusable frame values for compact count cards: background, foreground, border, radius, spacing, minimum height, and the count slot.

It does not govern count calculations, search behavior, filter behavior, grouping, selected records, button/link semantics, focus behavior, or text disclosure.

## Required States

- `default`
- `selected`
- `disabled`
- `warning`
- `error`

Warning is a count-card frame state, but its colour values must come from the signed `status-color` warning token.

## Required Themes

- `original`
- `dark`
- `desert`

## Required Fields

- `backgroundValue`
- `foregroundValue`
- `borderValue`
- `radiusValue`
- `paddingBlockValue`
- `paddingInlineValue`
- `contentGapValue`
- `minBlockSize`
- `countSlotMinInlineSize`
- `countBackgroundValue`
- `countForegroundValue`
- `countBorderValue`

## Consumer Rules

Consumers must import the governed Layer 2 runtime seam before rendering count-card frames in primitives or patterns.

Consumers must not reconstruct values from the legacy count-card route, screenshots, route-local CSS, or app-local CSS.

Any primitive that truncates count-card labels must use governed text-disclosure behavior.

Warning consumers must use `status-color` for warning colour values before using this token downstream.

Rendered view: `/design-system/default/tokens/count-card-frame`
