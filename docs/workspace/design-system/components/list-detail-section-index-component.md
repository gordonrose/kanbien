# List Detail Section Index Component

## Summary

`ListDetailSectionIndex` is the reusable child seam for sectioned list-detail
drawers.

It is rendered by:

- `renderListDetailSectionIndex(...)` in
  `src/frontend/designSystem/assets/listDrawerShell.mjs`

## Contract

The renderer accepts:

- `panelId`: stable drawer panel id used for row and panel ids
- `ariaLabel`: accessible label for the section index
- `sections`: ordered section definitions with:
  - `key`
  - `label`
  - `content`
  - optional `active`

The renderer owns:

- index row anatomy
- tab/panel ids and relationships
- active and hidden initial panel state
- shared CSS class names

The consumer owns:

- section labels
- section content
- feature-specific data binding
- deciding which section is initially active

## Adoption Rule

App consumers must import the shared renderer through a design-system-owned
workspace or component seam. They must not copy the section index rows into
app page modules.

## First Consumer

Root-users adopts this seam through
`src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs` with:

- `Profile`
- `Session information`
