# Context Navigation Default Proof

Layer: 04-pattern-contract  
System: default  
Family: context-navigation  
Status: review-ready

## Route

`/design-system/default/patterns/context-navigation`

## Proven Composition

- Desktop rail renders primary and utility item zones.
- Utility zone remains separate from primary item zone.
- Mobile bottom bar is composed through `context-navigation-bottom-bar`.
- Mobile overflow is composed through `context-navigation-overflow-menu`.
- Excess primary and utility items remain reachable through More.
- Every rendered item is composed through `context-navigation-item-control`.
- Current destination item exposes programmatic current semantics through the item primitive.
- Utility activation events bubble for proof-only logging or current-state simulation.

## Direct Token Evidence

- `context-navigation-frame`

## Primitive Evidence

- `context-navigation-item-control`
- `context-navigation-bottom-bar`
- `context-navigation-overflow-menu`

## Boundary

The proof does not own drawer payloads, tooltip disclosure, component props,
canonical scenarios, routed app navigation, or app adoption.

## Verification

Unit coverage:

- `tests/unit/designSystem/contextNavigationPattern.test.ts`

Visual coverage:

- `tests/visual/designSystem/patterns/contextNavigationPatternRoute.spec.ts`
