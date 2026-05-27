# Text Action Button Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Primitive | `text-action-button-control` |
| Harness layer | `03-primitive` |
| Status | `review-ready` |
| Shared contract path | `docs/design-system/03-primitive/shared/text-action-button-control/TextActionButtonControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/text-action-button-control/TextActionButtonControl-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/text-action-button-control/index.mjs#textActionButtonControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/text-action-button-control` |

## Responsibility

`text-action-button-control` owns one native short-label action button with
signed button frame, signed label text style, visible focus behavior, minimum
target sizing, and a stable activation event.

It does not create records, navigate routes, choose placement, define product
workflow, or own app adoption.

## Token Dependencies

| Token | Runtime seam |
| --- | --- |
| `button-frame` | `src/frontend/designSystem/layers/02-token/button-frame/systems/default.mjs#buttonFrameTokenSpec` |
| `label-text-style` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |

## Behavior And Accessibility Contract

The primitive renders a native `button` with `type="button"`.

The button has one visible short label and the same value as its accessible
name unless a later component seam explicitly wraps it with additional naming
context.

Activation dispatches `text-action-button-control:activate` with the
configured value and id. The primitive does not define product mutation.

## Consumer Restrictions

Consumers must not recreate text-action button markup, typography, focus
behavior, target sizing, button-frame values, or activation events locally.
