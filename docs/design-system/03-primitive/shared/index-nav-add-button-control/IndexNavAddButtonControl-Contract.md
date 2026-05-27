# Index Nav Add Button Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Primitive | `index-nav-add-button-control` |
| Harness layer | `03-primitive` |
| Status | `review-ready` |
| Shared contract path | `docs/design-system/03-primitive/shared/index-nav-add-button-control/IndexNavAddButtonControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/index-nav-add-button-control/IndexNavAddButtonControl-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/index-nav-add-button-control/index.mjs#indexNavAddButtonControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/index-nav-add-button-control` |

## Responsibility

`index-nav-add-button-control` owns one native button used by later index-nav
panel patterns to expose an add action.

It owns button semantics, keyboard activation, focus visibility, target size,
label text styling, visual frame token consumption, and activation event
emission.

It does not own where the add action appears, route creation, backend mutation,
list state, panel layout, or app adoption.

## Token Dependencies

| Token | Runtime seam |
| --- | --- |
| `index-nav-panel-frame` | `src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec` |
| `label-text-style` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |

## Behavior Contract

The primitive renders a native `button type="button"` and emits
`index-nav-add-button-control:activate` when activated.

The visible label and accessible name are the same text by default.

## Accessibility Contract

The primitive has one focusable element, uses native button keyboard behavior,
uses the signed focus-ring token, and preserves the signed minimum interactive
target size.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/index-nav-add-button-control` |
| Rendered view status | `available` |

## Consumer Restrictions

Consumers must not recreate add-action button markup, target sizing, focus
behavior, or token values locally.
