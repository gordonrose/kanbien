# FilterPanelStructure Component

## Scope

- Component name: `FilterPanelStructure`
- Status: active
- Owner: design-system
- Source pattern artifact:
  `docs/workspace/design-system/patterns/token-foundation-seams-pattern.md`
- Consuming surfaces: future collection and list filter overlays

## Purpose

Provide the reusable structural foundation for filter panels before real filter
cards, fields, option lists, or domain data are placed inside the panel.

## Public API

- Review route: `/design-system/tokens/filter-panel-structure`
- Controller: `src/frontend/designSystem/assets/filterPanelStructure.mjs`
- Structural selectors:
  - `data-filter-panel-structure-panel`
  - `data-filter-panel-structure-title-section`
  - `data-filter-panel-structure-scroll-stack`
  - `data-filter-panel-structure-card-slot`
- Supported card counts: `0`, `5`, `20`.

## Behavior

The title section is pinned and matches the shared page-header row height. The
card stack scrolls. Card sections keep their fixed card-row height and stack
from top to bottom. Mobile uses full page width.

## Adoption

First consumers must prove rendered parity against
`/design-system/tokens/filter-panel-structure` and must not copy the token route
HTML into app pages.
