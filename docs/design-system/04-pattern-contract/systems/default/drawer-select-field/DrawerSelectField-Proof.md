# Drawer Select Field Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Pattern | `drawer-select-field` |
| Design system | `default` |
| Status | `review-ready` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/drawer-select-field/DrawerSelectField-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/drawer-select-field/index.mjs#drawerSelectFieldPattern` |
| Rendered proof | `/design-system/default/patterns/drawer-select-field` |

## System Proof

The default proof composes `field-row-control` and `drawer-select`.

The proof route lets reviewers change field state, selection mode, open state,
viewport posture, placement side, label length, fixture pressure, direction,
theme, and action-bar presence.

## Evidence Expectations

Rendered review must show:

- field label/helper/error text comes from `field-row-control`
- drawer trigger, search, options, apply/cancel, and close behavior come from
  `drawer-select`
- disabled field state prevents opening/changing the drawer
- error state is visible through the field row without inventing drawer
  validation behavior
- single and multi select modes preserve drawer-select pending/committed
  behavior
- mobile viewport overlay still comes from `drawer-select`
- no horizontal overflow at constrained width
