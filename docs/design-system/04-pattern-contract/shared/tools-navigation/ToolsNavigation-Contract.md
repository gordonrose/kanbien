# Tools Navigation Pattern Contract

Layer: 04-pattern-contract  
Family: tools-navigation  
Status: review-ready

## Purpose

`tools-navigation` composes governed tool item controls into the current
desktop right-side tools rail.

Mobile tools-navigation is intentionally hidden in this pattern version.

## Dependencies

Tokens:

- `tools-navigation-frame`

Primitives:

- `tools-navigation-item-control`

## Composition

- The pattern renders a named tools-navigation rail.
- The rail is fixed to the desktop right edge in default mode.
- The rail may be rendered as contained proof geometry in proof mode.
- Below the mobile breakpoint, the rail is hidden.

## Consumer Boundary

Allowed:

- Use for desktop tools-navigation rail composition.

Denied:

- Do not use for context navigation, mobile tool drawers, mobile overflow,
  bottom bars, floating launchers, payload panels, component props, app routing,
  or app-local CSS.

## Proof

Default proof route:

- `/design-system/default/patterns/tools-navigation`

Runtime seam:

- `src/frontend/designSystem/layers/04-pattern-contract/tools-navigation/index.mjs`
