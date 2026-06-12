# Default Top Navigation Trigger Control Primitive Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Design system | `default` |
| UI family | `top-navigation` |
| Harness layer | `03-primitive` |
| Proof status | `review-ready` |
| Rendered route | `/design-system/default/primitives/top-navigation-trigger-control` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/top-navigation-trigger-control/index.mjs` |
| Shared contract | `docs/design-system/03-primitive/shared/top-navigation-trigger-control/TopNavigationTriggerControl-Contract.md` |

## Rendered Coverage

- Closed overflow trigger with `aria-expanded="false"`.
- Open overflow trigger with `aria-expanded="true"`.
- Profile trigger.
- Mobile navigation trigger.
- Long profile label pressure using the governed `truncating-label` primitive
  in non-focusable mode.

## Token And Primitive Dependencies

| Dependency | Runtime seam |
| --- | --- |
| `top-navigation-frame` | `src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs#topNavigationFrameTokenSpec` |
| `label-text-style` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |
| `truncating-label` | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#truncatingLabelPrimitive` |

## Boundary Audit

- The proof does not create menu panel placement, outside-click dismissal,
  Escape focus return, overflow measurement, mobile surface layout, component
  seams, or app adoption.
- Existing text and icon button primitives were not reused because the signed
  behavior needs top-navigation-specific trigger kind and expanded semantics.
- Existing dropdown and menu-simple-select primitives were not reused because
  this is not a select/listbox trigger.

## Verification

- Unit seam: `tests/unit/designSystem/topNavigationTriggerControlPrimitive.test.ts`
- Browser proof: `tests/visual/designSystem/primitives/topNavigationTriggerControlPrimitiveRoute.spec.ts`
