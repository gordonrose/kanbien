# Context Navigation Item Affordance Default Implementation

Layer: 02-token  
System: default  
Family: context-navigation  
Status: review-ready

## Route

`/design-system/default/tokens/context-navigation-item-affordance`

## Source

The default implementation lifts existing context-navigation item values from the 40-system CSS and pairs them with the signed `context-navigation-frame` token.

## Values

- Desktop item size: `2.75rem` by `2.75rem`
- Mobile item padding: `0.55rem` block and `0.35rem` inline
- Resting: `var(--surface-1)`, `var(--ink-soft)`, `var(--line)`
- Hover: `var(--surface-1)`, `var(--ink)`, `var(--line-strong)`
- Current: `var(--accent-soft)`, `var(--accent-text)`, `rgba(99, 91, 255, 0.22)`
- Disabled opacity: `0.58`

## Proof Requirement

The token proof must show resting, hover, current, and disabled states together. Downstream primitive proof must also show programmatic current semantics.

## Runtime

- Contract: `src/frontend/designSystem/layers/02-token/context-navigation-item-affordance/contract.mjs`
- System seam: `src/frontend/designSystem/layers/02-token/context-navigation-item-affordance/systems/default.mjs`
- Proof module: `src/frontend/designSystem/systems/default/tokens/proofs/contextNavigationItemAffordance.tokens.mjs`
