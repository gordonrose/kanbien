# Context Navigation Item Control Default Proof

Layer: 03-primitive  
System: default  
Family: context-navigation  
Status: review-ready

## Route

`/design-system/default/primitives/context-navigation-item-control`

## Proven Behavior

- Enabled destination item renders as an anchor with `href`.
- Current destination item exposes `aria-current="page"`.
- Utility item renders as a native button and emits `context-navigation-item-control:activate`.
- Disabled item renders as a native disabled button and does not emit activation.
- Focus styling and minimum target size are supplied by signed token dependencies.
- Hover and keyboard focus disclose the item label through the governed tooltip
  surface and text-style tokens.

## Token Evidence

The proof renders dependency metadata from:

- `context-navigation-frame`
- `context-navigation-item-affordance`
- `minimum-target-size`
- `focus-ring`
- `label-text-style`
- `icon-size`
- `tooltip-surface`
- `tooltip-text-style`
- `default` glyph registry

## Known Boundary

The default proof consumes `context-navigation-item-affordance` for current-state visual treatment, tooltip tokens for item-label disclosure, and the default glyph registry for decorative item icons. It intentionally does not compose `icon-button-control` because this primitive must also render destination links and visible labels. It does not own More-menu overflow, drawer behavior, or long-label truncation.

## Verification

Unit coverage:

- `tests/unit/designSystem/contextNavigationItemControlPrimitive.test.ts`

Visual coverage:

- `tests/visual/designSystem/primitives/contextNavigationItemControlPrimitiveRoute.spec.ts`
