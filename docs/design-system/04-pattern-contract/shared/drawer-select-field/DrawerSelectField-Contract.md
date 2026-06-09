# Drawer Select Field Pattern Contract

| Field | Value |
| --- | --- |
| Layer | `04-pattern-contract` |
| Pattern | `drawer-select-field` |
| Status | `review-ready` |
| Rendered view | `/design-system/default/patterns/drawer-select-field` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/drawer-select-field/index.mjs#drawerSelectFieldPattern` |

## Purpose

`drawer-select-field` composes a governed field row with the governed
`drawer-select` pattern.

It is the reusable form-field pattern for searchable single-select or
multi-select values that need drawer review, pending changes, and apply/cancel
behavior.

## Dependencies

- `field-row-control`
- `drawer-select`

## Contract

- The field row owns visible label, helper text, error text, required/disabled
  grouping, and field-level state.
- `drawer-select` owns trigger summary, open/close, pending versus committed
  selection, search, selected/available grouping, apply/cancel, keyboard
  option selection, and mobile viewport overlay.
- Disabled field state must disable the drawer trigger.
- Error field state must render through the field row; it must not invent a
  drawer-select validation model.
- Consumers must not recreate field-row label wiring or drawer-select
  composition locally.

## Non-Goals

This pattern does not define product validation, async option loading, backend
search, persistence, route query state, component APIs, app adoption, or
drawer-select internals.
