# Resize Handle Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Primitive | `resize-handle-control` |
| Harness layer | `03-primitive` |
| Status | `review-ready` |
| Shared contract path | `docs/design-system/03-primitive/shared/resize-handle-control/ResizeHandleControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/resize-handle-control/ResizeHandleControl-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/resize-handle-control/index.mjs#resizeHandleControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/resize-handle-control` |

## Responsibility

`resize-handle-control` owns one focusable inline resize separator. It exposes
keyboard and pointer resizing, clamps width to the supplied min and max inline
sizes, updates ARIA value attributes, and emits `resize-handle-control:resize`.

It does not own panel min or max width tokens, product layout, persistence,
route state, or app adoption.

## Token Dependencies

| Token | Runtime seam |
| --- | --- |
| `resize-handle` | `src/frontend/designSystem/layers/02-token/resize-handle/systems/default.mjs#resizeHandleTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |

## Behavior And Accessibility Contract

The primitive renders a focusable `role="separator"` with
`aria-orientation="vertical"`, `aria-valuemin`, `aria-valuemax`, and
`aria-valuenow`.

Pointer drag, ArrowLeft, ArrowRight, Home, and End update the controlled inline
size. The primitive must clamp every value to the supplied min and max inline
sizes before applying it or emitting an event.

## Consumer Restrictions

Consumers must not recreate resize handle markup, ARIA behavior, pointer
behavior, keyboard behavior, focus behavior, or clamping locally.

Consumers must provide min and max inline-size values from a signed token or
containing pattern contract.
