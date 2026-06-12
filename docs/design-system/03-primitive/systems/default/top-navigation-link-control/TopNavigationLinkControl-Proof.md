# Default Top Navigation Link Control Primitive Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Design system | `default` |
| UI family | `top-navigation` |
| Harness layer | `03-primitive` |
| Proof status | `review-ready` |
| Rendered route | `/design-system/default/primitives/top-navigation-link-control` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/top-navigation-link-control/index.mjs` |
| Shared contract | `docs/design-system/03-primitive/shared/top-navigation-link-control/TopNavigationLinkControl-Contract.md` |

## Rendered Coverage

- Resting destination link.
- Current destination link with `aria-current="page"`.
- Menu-link row for later top-navigation menus.
- Long destination label pressure using the governed `truncating-label`
  primitive in non-focusable mode.

## Token And Primitive Dependencies

| Dependency | Runtime seam |
| --- | --- |
| `top-navigation-frame` | `src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs#topNavigationFrameTokenSpec` |
| `label-text-style` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |
| `truncating-label` | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#truncatingLabelPrimitive` |

## Boundary Audit

- The proof does not create chrome layout, brand markup, menu-trigger behavior,
  overflow measurement, mobile collapse, component seams, or app adoption.
- Existing button primitives were not reused because this primitive must render
  native anchors for navigation.
- Existing dropdown and index-navigation primitives were not reused because
  they govern different UI families and behavior locks.
- The proof route uses only a route-local strip wrapper to place primitive
  examples side by side; that wrapper is not a consumable primitive.

## Verification

- Unit seam: `tests/unit/designSystem/topNavigationLinkControlPrimitive.test.ts`
- Browser proof: `tests/visual/designSystem/primitives/topNavigationLinkControlPrimitiveRoute.spec.ts`
