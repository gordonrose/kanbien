# ListCard Adoption Contract

## Scope

This contract governs first-consumer adoption of the `ListCard` seam after
promotion from `/design-system/tokens/list-card`.

## Required Consumption Path

- Import from `src/frontend/designSystem/assets/listCard.mjs`.
- Prefer `renderListCard(options)` or `hydrateListCards(root)`.
- Preserve emitted classes, ARIA attributes, data attributes, and token
  composition.
- Keep `index-card` for compact label/count cards; do not use it as the
  full-row list-card seam.

## Allowed Consumer Inputs

- title
- subtitle
- status
- state
- accessible label
- tooltip values
- consumer wrapper class only when the class does not redefine the signed-off
  row surface, layout, typography, colour, or state treatment
- RTL or mobile flags when the parent surface needs explicit specimens

## Prohibited Consumer Behavior

- Do not copy token-route HTML into an app page.
- Do not add app-page CSS for ListCard layout, spacing, border, typography,
  colour, state, tooltip, or responsive behavior.
- Do not derive local colours for neutral, warning, error, or disabled states.
- Do not override the colour, container, header, paragraph, tooltip, or
  semantic state primitives locally.
- Do not treat IndexCard as a compatibility alias for ListCard.

## First-Consumer Parity Evidence

Before claiming app adoption, the consuming surface must verify:

- default, selected, disabled, warning, and error states in the real wrapper
- long title, subtitle, and status overflow with tooltip data
- keyboard focus visibility and native button behavior
- normal and dark theme contrast
- desert theme contrast when the parent route supports desert theme
- RTL alignment when the parent route supports RTL
- largest app-supported magnification without text overlap or row resizing
- mobile/narrow layout if the surface appears on mobile

## Compatibility Notes

There is no `list-container` compatibility route. `/design-system/tokens/list-card`
and `/design-system/token/list-card` are the canonical review routes for the
full-row ListCard seam.
