# ButtonCard Component

## Scope

- Component name: `ButtonCard`
- Status: system-ready
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/button-card-behavior-lock.md`
- Consuming surfaces: card launchers, compact action groups, and supporting
  choice grids that need an icon plus label.

## Purpose

Provide a compact clickable card with a centered icon circle and label, built
from signed-off container, container-section, paragraph, tooltip, and semantic
state tokens.

## Public API

- Review route: `/design-system/tokens/button-card`
- Token surface: `data-token-layer-surface="button-card"`
- Render seam: `renderButtonCard(options)`
- Hydration seam: `hydrateButtonCards(root)`
- Mount attribute: `data-token-button-card-mount`
- Core data attributes:
  - `data-token-button-card-label`
  - `data-token-button-card-icon`
  - `data-token-button-card-state`
  - `data-token-button-card-aria-label`
  - `data-token-button-card-label-tooltip`
  - `data-token-button-card-rtl`
  - `data-token-button-card-mobile`

## States

- `hover`
- `active`
- `selected`
- `disabled`
- `warning`
- `error`

## Adoption

Consumers must call the shared render or hydration seam and preserve the
signed-off CSS classes emitted by `buttonCard.mjs`. App-local CSS copies,
page-specific restyling, or duplicated markup are drift unless a new
design-system decision explicitly approves the variation.

## Reusable Seam

`buttonCard.mjs` owns the reusable render structure, icon-circle markup,
button semantics, selected/disabled attributes, label typography, tooltip
attributes, and state classes for this family. Downstream app pages may pass
approved data into the seam, but must not reconstruct those decisions locally.
