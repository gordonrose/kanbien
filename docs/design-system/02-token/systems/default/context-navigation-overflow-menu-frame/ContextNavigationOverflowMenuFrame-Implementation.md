# Context Navigation Overflow Menu Frame Default Implementation

Layer: 02-token  
System: default  
Family: context-navigation  
Status: review-ready

## Route

`/design-system/default/tokens/context-navigation-overflow-menu-frame`

## Values

- Min inline size: `12rem`
- Padding: `0.35rem`
- Border: `0.0625rem solid var(--line)`
- Radius: `var(--radius)`
- Background: `var(--surface-1)`
- Shadow: `var(--shadow)`
- Layer: `var(--context-nav-menu-layer)`
- Desktop bottom offset: `calc(100% + 0.65rem)`
- Mobile bottom offset: `calc(100% + 0.45rem)`
- Mobile inline inset: `0.25rem`

## Runtime

- Contract: `src/frontend/designSystem/layers/02-token/context-navigation-overflow-menu-frame/contract.mjs`
- System seam: `src/frontend/designSystem/layers/02-token/context-navigation-overflow-menu-frame/systems/default.mjs`
- Proof module: `src/frontend/designSystem/systems/default/tokens/proofs/contextNavigationOverflowMenuFrame.tokens.mjs`
