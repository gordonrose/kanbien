# IndexCard Adoption Contract

## Scope

This contract governs first-consumer adoption of the `IndexCard` seam after
promotion from `/design-system/tokens/index-card`.

## Required Consumption Path

- Import from `src/frontend/designSystem/assets/indexCard.mjs`.
- Prefer `renderIndexCard(options)` or `hydrateIndexCards(root)`.
- Preserve emitted classes, ARIA attributes, data attributes, and token
  composition.
- Keep legacy `secondaryListCard.mjs` imports only as migration compatibility;
  new consumers must use `indexCard.mjs`.

## Allowed Consumer Inputs

- label
- count
- state
- accessible label
- tooltip values
- consumer wrapper class only when the class does not redefine the signed-off
  card surface, layout, typography, or state treatment
- RTL or mobile flags when the parent surface needs explicit specimens

## Prohibited Consumer Behavior

- Do not copy token-route HTML into an app page.
- Do not add app-page CSS for IndexCard layout, spacing, border, typography,
  colour, state, tooltip, or responsive behavior.
- Do not consume the full-row `list-card` seam as a substitute for compact
  label/count cards.
- Do not override the container, container-section, header, paragraph, tooltip,
  or semantic state primitives locally.

## First-Consumer Parity Evidence

Before claiming app adoption, the consuming surface must verify:

- default, selected, disabled, warning, and error states in the real wrapper
- long label and count overflow with tooltip data
- keyboard focus visibility and native button behavior
- normal and dark theme contrast
- RTL alignment when the parent route supports RTL
- largest app-supported magnification without text overlap or card resizing
- mobile/narrow layout if the surface appears on mobile

## Compatibility Notes

Legacy secondary-list-card route aliases should remain temporary review
compatibility aliases. They must continue to render the IndexCard token page
until the compatibility window is intentionally removed. `/design-system/tokens/list-card`
is the separate full-row ListCard seam.
