# IndexCard Component

## Scope

- Component name: `IndexCard`
- Status: system-ready
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/index-card-behavior-lock.md`
- Consuming surfaces: card indexes, tab-summary cards, nested object indexes,
  and supporting card groups that need a count.

## Purpose

Provide a compact clickable card with a label and count, built from signed-off
container, container-section, header, paragraph, tooltip, and semantic state
tokens.

## Public API

- Review route: `/design-system/tokens/index-card`
- Token surface: `data-token-layer-surface="index-card"`
- Render seam: `renderIndexCard(options)`
- Hydration seam: `hydrateIndexCards(root)`
- Mount attribute: `data-token-index-card-mount`
- Core data attributes:
  - `data-token-index-card-label`
  - `data-token-index-card-count`
  - `data-token-index-card-state`
  - `data-token-index-card-aria-label`
  - `data-token-index-card-label-tooltip`
  - `data-token-index-card-count-tooltip`
  - `data-token-index-card-rtl`
  - `data-token-index-card-mobile`

## States

- `hover`
- `active`
- `selected`
- `disabled`
- `warning`
- `error`

## Compatibility

The legacy `secondaryListCard.mjs` file is a compatibility shim. Legacy
secondary-list-card route aliases must render the IndexCard route. `ListCard`
is a separate full-row title/subtitle/status seam.

## Adoption

Consumers must call the shared render or hydration seam and preserve the
signed-off CSS classes emitted by `indexCard.mjs`. App-local CSS copies,
page-specific restyling, or duplicated markup are drift unless a new
design-system decision explicitly approves the variation.
