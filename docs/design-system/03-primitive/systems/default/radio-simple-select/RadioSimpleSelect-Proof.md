# Radio Simple Select Default Proof

Status: `accepted`

Layer: `03-primitive`

Shared contract:
`docs/design-system/03-primitive/shared/radio-simple-select/RadioSimpleSelect-Contract.md`

Rendered route:
`/design-system/default/primitives/radio-simple-select`

## Proof Scope

The default design system proves the shared radio-simple-select primitive using
signed default-system Layer 2 tokens. The proof does not create a product form,
validation model, or persistence contract.

## Consumed Tokens

| Token | Runtime seam |
| --- | --- |
| `choice-option-frame` | `src/frontend/designSystem/layers/02-token/choice-option-frame/systems/default.mjs#choiceOptionFrameTokenSpec` |
| `choice-group-layout` | `src/frontend/designSystem/layers/02-token/choice-group-layout/systems/default.mjs#choiceGroupLayoutTokenSpec` |
| `label-text-style` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` |
| `supporting-text-style` | `src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs#supportingTextStyleTokenSpec` |
| `error-text-style` | `src/frontend/designSystem/layers/02-token/error-text-style/systems/default.mjs#errorTextStyleTokenSpec` |
| `tooltip-surface` | `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs#tooltipSurfaceTokenSpec` |
| `tooltip-text-style` | `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs#tooltipTextStyleTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |

## Evidence

- Unit: `tests/unit/designSystem/radioSimpleSelectPrimitive.test.ts`
- Browser: `tests/visual/designSystem/primitives/radioSimpleSelectPrimitiveRoute.spec.ts`

## Review Notes

The primitive owns a radio-safe text disclosure controller instead of nesting
`truncating-label` inside a radio label. This preserves native radio selection
while keeping the repo-wide rule that truncated text must disclose full text and
fitting text must not show a tooltip.
