# Simple Dropdown Field Pattern Contract

| Field | Value |
| --- | --- |
| Layer | `04-pattern-contract` |
| Pattern | `simple-dropdown-field` |
| Status | `review-ready` |
| Rendered view | `/design-system/default/patterns/simple-dropdown-field` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/simple-dropdown-field/index.mjs#simpleDropdownFieldPattern` |

## Purpose

`simple-dropdown-field` composes a governed field row with the simple dropdown primitive.

It is the reusable form-field pattern for a compact single-select value when search, multi-select, drawer selection, and autocomplete are out of scope.

## Dependencies

- `field-row-control`
- `simple-dropdown-control`

## Contract

- The field row owns visible label, helper text, error text, and state grouping.
- The dropdown primitive owns trigger/listbox semantics, keyboard behavior, value emission, and overflow-gated disclosure.
- Error state must be represented in both the row and dropdown primitive.
- Consumers must not recreate label wiring, trigger/listbox markup, or dropdown keyboard behavior locally.

## Non-Goals

This pattern does not define product validation, async options, search, persistence, drawer select, card-list select, or app adoption.
