# ListCard Component

## Scope

- Component name: `ListCard`
- Status: system-ready
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/list-card-behavior-lock.md`
- Consuming surfaces: full-row list previews, record-management list entries,
  and repeated scan-friendly row cards with a status.

## Purpose

Provide a full-width clickable row card with title, subtitle, and trailing
status, built from signed-off colour, container, header, paragraph, tooltip,
and semantic state primitives.

## Public API

- Review route: `/design-system/tokens/list-card`
- Token surface: `data-token-layer-surface="list-card"`
- Render seam: `renderListCard(options)`
- Hydration seam: `hydrateListCards(root)`
- Mount attribute: `data-token-list-card-mount`
- Core data attributes:
  - `data-token-list-card-title`
  - `data-token-list-card-subtitle`
  - `data-token-list-card-status`
  - `data-token-list-card-state`
  - `data-token-list-card-aria-label`
  - `data-token-list-card-title-tooltip`
  - `data-token-list-card-subtitle-tooltip`
  - `data-token-list-card-status-tooltip`
  - `data-token-list-card-rtl`
  - `data-token-list-card-mobile`

## States

- `hover`
- `selected`
- `disabled`
- `warning`
- `error`

## Relationship To IndexCard

`IndexCard` remains the compact label/count card seam. `ListCard` is the
full-row title/subtitle/status seam. New consumers should choose the seam by
shape and content model rather than by old route history.

## Adoption

Consumers must call the shared render or hydration seam and preserve the
signed-off CSS classes emitted by `listCard.mjs`. App-local CSS copies,
page-specific restyling, duplicated markup, or local colour derivations are
drift unless a new design-system decision explicitly approves the variation.
