# Card List Select Field Pattern Contract

| Field | Value |
| --- | --- |
| Layer | `04-pattern-contract` |
| Pattern | `card-list-select-field` |
| Status | `review-ready` |
| Rendered view | `/design-system/default/patterns/card-list-select-field` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/card-list-select-field/index.mjs#cardListSelectFieldPattern` |

## Purpose

`card-list-select-field` composes a governed field row with the card-list select primitive.

It is the reusable form-field pattern for multi-select card choices such as visibility selection and priority ordering.

## Dependencies

- `field-row-control`
- `card-list-select`

## Contract

- The field row owns visible label, helper text, error text, and field state grouping.
- The card-list primitive owns native checkbox semantics, visible/hidden and priority variants, priority compaction, option glyphs, responsive columns, and text-disclosure behavior.
- The card-list legend must remain semantic but visually hidden when the field row supplies the visible label.
- Error state must be represented in both the field row and card-list primitive using signed lower-layer values.
- Field helper and error message IDs must be passed into the card-list primitive so native checkboxes are described by the visible field message.
- Consumers must not recreate label wiring, checkbox behavior, priority ranking, option card styling, or truncation disclosure locally.

## Non-Goals

This pattern does not define product validation, persistence, async options, drawer selection, workflow builders, navigation, or app adoption.
