# Context Navigation Item Affordance Token Contract

Layer: 02-token  
Family: context-navigation  
Status: review-ready

## Purpose

`context-navigation-item-affordance` governs the reusable visual state values for one context-navigation item.

It exists so item primitives and later rail or bottom-bar patterns do not invent resting, hover, current, disabled, desktop sizing, or mobile padding values locally.

## Required Variant Role

- `context navigation item affordance`

## Required Fields

- `itemRole`
- `desktopInlineSize`
- `desktopBlockSize`
- `mobilePaddingBlockValue`
- `mobilePaddingInlineValue`
- `radiusValue`
- `restingBorderValue`
- `restingBackgroundValue`
- `restingForegroundValue`
- `hoverBorderValue`
- `hoverBackgroundValue`
- `hoverForegroundValue`
- `currentBorderValue`
- `currentBackgroundValue`
- `currentForegroundValue`
- `disabledOpacityValue`

## Consumer Rules

Allowed:

- Use for context-navigation item controls and later context-navigation rail, bottom-bar, drawer, or overflow patterns.
- Pair current visual affordance with programmatic current semantics such as `aria-current`.

Denied:

- Do not use for context-navigation rail placement, bottom-bar pinning, drawer behavior, tooltip disclosure, icon artwork, or More-menu overflow behavior.
- Do not use as a generic button, tab, card, index-nav item, or app-local CSS source.
- Do not treat visual current styling as sufficient current semantics without the consuming primitive exposing current state programmatically.

## Accessibility

Current-state visual treatment must not be the only current-state signal. Consumers must expose programmatic current semantics and must preserve focus-ring and minimum-target-size token dependencies separately.

## Proof

Default implementation proof:

- `/design-system/default/tokens/context-navigation-item-affordance`
- `src/frontend/designSystem/systems/default/tokens/proofs/contextNavigationItemAffordance.tokens.mjs`

Runtime seam:

- `src/frontend/designSystem/layers/02-token/context-navigation-item-affordance/systems/default.mjs`
