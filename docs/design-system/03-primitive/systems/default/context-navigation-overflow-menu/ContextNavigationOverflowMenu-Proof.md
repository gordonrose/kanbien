# Context Navigation Overflow Menu Default Proof

Layer: 03-primitive  
System: default  
Family: context-navigation  
Status: review-ready

## Route

`/design-system/default/primitives/context-navigation-overflow-menu`

## Proven Behavior

- More trigger toggles the menu.
- Escape closes the menu and restores focus.
- Outside click closes the menu.
- Item activation closes the menu and bubbles the item event.
- Menu frame values come from `context-navigation-overflow-menu-frame`.

## Verification

Unit coverage:

- `tests/unit/designSystem/contextNavigationOverflowMenuPrimitive.test.ts`

Visual coverage:

- `tests/visual/designSystem/primitives/contextNavigationOverflowMenuPrimitiveRoute.spec.ts`
