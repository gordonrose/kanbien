# Default Top Navigation Brand Control Primitive Proof

Rendered route:

- `/design-system/default/primitives/top-navigation-brand-control`

Runtime seam:

- `src/frontend/designSystem/layers/03-primitive/top-navigation-brand-control/index.mjs`

The default proof renders a short brand label and a long brand-label pressure
case. Both are native anchors and use `truncating-label` without adding a second
focus target.

Verification:

- `tests/unit/designSystem/topNavigationBrandControlPrimitive.test.ts`
- `tests/visual/designSystem/primitives/topNavigationBrandControlPrimitiveRoute.spec.ts`
