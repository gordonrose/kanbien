# ButtonCard Adoption Contract

## Scope

This contract governs first-consumer adoption of the `ButtonCard` seam after
promotion from `/design-system/tokens/button-card`.

## Required Consumption Path

- Import from `src/frontend/designSystem/assets/buttonCard.mjs`.
- Prefer `renderButtonCard(options)` or `hydrateButtonCards(root)`.
- Preserve emitted classes, ARIA attributes, data attributes, and token
  composition.
- Treat `buttonCard.mjs` as the design-system-owned render, behavior,
  accessibility, and style seam for compact icon/label button cards.

## Allowed Consumer Inputs

- label
- icon key
- state
- accessible label
- tooltip values
- consumer wrapper class only when the class does not redefine the signed-off
  card surface, layout, typography, icon circle, or state treatment
- RTL or mobile flags when the parent surface needs explicit specimens

## Prohibited Consumer Behavior

- Do not copy token-route HTML into an app page.
- Do not add app-page CSS for ButtonCard layout, spacing, border, typography,
  icon treatment, colour, state, tooltip, or responsive behavior.
- Do not consume the `index-card` seam as a substitute for compact icon/label
  button cards.
- Do not override the container, container-section, paragraph, tooltip, or
  semantic state primitives locally.
- Do not rebuild the icon circle, label typography, selected/disabled
  semantics, or tooltip wiring outside the shared seam.

## First-Consumer Parity Evidence

Before claiming app adoption, the consuming surface must verify:

- default, selected, disabled, warning, and error states in the real wrapper
- long label overflow with tooltip data
- keyboard focus visibility and native button behavior
- normal and dark theme contrast
- RTL centering when the parent route supports RTL
- largest app-supported magnification without text overlap or card resizing
- mobile/narrow layout if the surface appears on mobile
