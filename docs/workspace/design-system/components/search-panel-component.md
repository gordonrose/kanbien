# SearchPanel Component

## Scope

- Component name: `SearchPanel`
- Status: active
- Owner: design-system
- Source pattern artifact:
  `docs/workspace/design-system/patterns/token-foundation-seams-pattern.md`
- Consuming surfaces: future collection and list search overlays

## Purpose

Provide the reusable structural foundation for search panels before real search
inputs, result cards, fields, option lists, or domain data are placed inside the
panel.

## Public API

- Review route: `/design-system/tokens/search-panel`
- Renderer: `renderSearchPanelStructure`
- Hydrator: `hydratePanelStructures`
- Controller: `createFilterPanelStructureController`
- Source module: `src/frontend/designSystem/assets/filterPanelStructure.mjs`
- Route mount selector:
  - `data-search-panel-structure-mount`
- Structural selectors:
  - `data-search-panel`
  - `data-filter-panel-structure-title-section`
  - `data-search-panel-query-section`
  - `data-search-panel-query-slot`
  - `data-filter-panel-structure-scroll-stack`
  - `data-filter-panel-structure-card-slot`
- Supported result/card counts: `0`, `5`, `20`.

## Behavior

The title section and search row are pinned. The result/card stack scrolls. The
search row sits between the title section and scrolling stack and does not move
when the stack scrolls. Result/card sections keep fixed height and stack from
top to bottom. Mobile uses full page width.

## Adoption

First consumers must use `renderSearchPanelStructure` or
`data-search-panel-structure-mount`, prove rendered parity against
`/design-system/tokens/search-panel`, and must not copy the token route HTML
into app pages.
