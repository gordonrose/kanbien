# EntityPageStructure Component

## Purpose

`EntityPageStructure` is the shared design-system foundation for entity record
pages. It gives future entity pages a consistent page background, top header,
navigation-index region, and record-panel region.

## Source Of Truth

- Shared header behavior: `src/frontend/designSystem/assets/foundationStructure.mjs`
- Environmental dependency: `PageBackground`
- Structural selectors: `data-entity-page-structure-*`
- Review route: `/design-system/tokens/entity-page-structure`
- Behavior lock:
  `docs/workspace/design-system/behavior-locks/entity-page-structure-behavior-lock.md`

## Region Contract

- Header: 24-column shared foundation header.
- Body index: 2 columns.
- Body record panel: 10 columns.
- Resize: index may expand up to 4 columns.
- Record panel header: 20 columns.
- Record panel body: nested 2-column index and 8-column content split by
  default, with the nested index resizable up to 4 columns.
- Mobile: index region takes precedence over the panel relationship.

## Adoption Rule

Future governed entity pages must consume this foundation instead of
reconstructing the same header, body split, mobile precedence, or background
layering locally.
