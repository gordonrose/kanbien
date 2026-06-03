# Default Toggle Control Primitive Proof

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `toggle-control` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Shared primitive contract | `docs/design-system/03-primitive/shared/toggle-control/ToggleControl-Contract.md` |
| Rendered view | `/design-system/default/primitives/toggle-control` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/toggle-control/index.mjs#toggleControlPrimitive` |

## Implementation Summary

The default proof renders one native checkbox input with `role="switch"`,
token-backed track/thumb visuals, native focus, state controls, RTL evidence,
and an emitted-event log.

The proof consumes only signed Layer 2 seams for visual values:
`toggle-frame`, `focus-ring`, and `minimum-target-size`.

## Boundary

The proof does not render field-row label/helper/error composition. That work
belongs to a later `toggle-field` pattern that composes this primitive with
`field-row-control`.
