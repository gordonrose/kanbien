# Choice Card State Affordance Token Implementation

Layer: `02-token`
System key: `default`
Status: `review-ready`
Shared contract: `docs/design-system/02-token/shared/choice-card-state-affordance/ChoiceCardStateAffordance-Contract.md`
Behavior rule: `docs/design-system/01-behavior-rule/shared/card-list-select/CardListSelect-Behaviour.md`
Rendered view: `/design-system/default/tokens/choice-card-state-affordance`

## Implementation Scope

The default design system implements the shared state-affordance contract for visible/hidden and priority card-list select variants.

The implementation derives active state color from the signed selected choice-option frame and inactive state color from the signed default choice-option frame. It uses the signed supporting-text style for trailing state text. Glyph artwork remains semantic and may be replaced by a future governed glyph system without changing the token contract.

## Downstream Boundary

This token does not create a card-list select primitive. It only gives that primitive a governed state-affordance layout and color source so the primitive cannot invent slot sizes or state text styling.

## Evidence

- Runtime seam: `src/frontend/designSystem/layers/02-token/choice-card-state-affordance/systems/default.mjs`
- Proof module: `src/frontend/designSystem/systems/default/tokens/proofs/choiceCardStateAffordance.tokens.mjs`
- Rendered proof: `/design-system/default/tokens/choice-card-state-affordance`
- Visual route test: `tests/visual/designSystem/tokens/choiceCardStateAffordanceTokenRoute.spec.ts`
