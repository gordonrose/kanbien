# Default Context Navigation Bottom Bar Primitive Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Primitive | `context-navigation-bottom-bar` |
| System | `default` |
| Primitive status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/context-navigation-bottom-bar/index.mjs#contextNavigationBottomBarPrimitive` |
| Rendered route | `/design-system/default/primitives/context-navigation-bottom-bar` |

## Token Evidence

The proof consumes `context-navigation-frame` from
`src/frontend/designSystem/layers/02-token/context-navigation-frame/systems/default.mjs#contextNavigationFrameTokenSpec`.

The proof route shows the resolved token name, page reserve, drawer offset,
viewport pinning invariant, and scroll-boundary invariant.

## Rendered Evidence

- Unit: `tests/unit/designSystem/contextNavigationBottomBarPrimitive.test.ts`
- Browser: `tests/visual/designSystem/primitives/contextNavigationBottomBarPrimitiveRoute.spec.ts`
- Browser execution is currently blocked in this local environment because no supported Playwright Chromium binary is available.

## Boundary Evidence

The rendered proof uses proof-only slot text. It does not govern destination
item controls, current state, More-menu behavior, drawer-launch behavior, app
routes, or app adoption.
