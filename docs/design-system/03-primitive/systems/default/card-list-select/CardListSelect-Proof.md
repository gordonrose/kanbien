# Card List Select Primitive Proof

Layer: `03-primitive`
System key: `default`
Status: `review-ready`
Shared contract: `docs/design-system/03-primitive/shared/card-list-select/CardListSelect-Contract.md`
Rendered view: `/design-system/default/primitives/card-list-select`

## Proof Scope

The default proof renders the shared `card-list-select` primitive using signed Layer 2 token seams for choice frames, choice layout, state affordances, typography, focus, target size, and tooltip disclosure.

The proof covers visibility and priority variants, option subtext on/off, group subtext on/off, 1-4 requested columns, RTL, theme variants, and constrained-width truncation.

## Evidence

- Runtime seam: `src/frontend/designSystem/layers/03-primitive/card-list-select/index.mjs`
- Proof route: `src/frontend/designSystem/systems/default/primitives/card-list-select/index.html`
- Unit test: `tests/unit/designSystem/cardListSelectPrimitive.test.ts`
- Browser test: `tests/visual/designSystem/primitives/cardListSelectPrimitiveRoute.spec.ts`
