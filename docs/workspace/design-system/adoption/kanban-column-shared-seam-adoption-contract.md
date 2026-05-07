# Kanban Column Shared Seam Adoption Contract

## Scope

- Family:
  `kanban-column`
- Status:
  shared design-system seam exists; no real app consumer approved yet
- Shared source seam:
  `src/frontend/designSystem/assets/kanbanColumnSeam.mjs`
- Style seam:
  `src/frontend/designSystem/assets/kanbanColumn.css`
- Governed review routes:
  `/design-system/patterns/kanban-column`
  `/design-system/canonical-renderings/kanban-column`
  `/design-system/canonical-renderings/kanban-column/:ref`

## Adoption Rule

A real app page may not copy the kanban board markup, drawer/archive
structure, drag/drop behavior, draft forms, or movement-control semantics.

The first consumer must import and consume the design-system-owned seam for:

- board, column, card, add-card, add-column, archive, restore, and movement
  render structure
- drawer-selected, available, and archived column presentation
- drag/drop source, target, and landing-marker behavior
- non-drag movement controls and draft focus behavior
- signed-off mobile horizontal scrolling behavior

## Allowed Consumer Ownership

A consuming app surface may own:

- product data loading and persistence
- workflow-specific column and card records
- business validation for allowed column/card changes
- permission and capability checks
- API callbacks for create, archive, restore, and move operations
- route-level empty, loading, denied, and error composition around the board

The consuming app must not own:

- copied kanban column/card HTML
- copied drawer-selected/archive row HTML
- copied drag/drop or draft-form controller behavior
- page-local CSS that changes the governed layout, spacing, columns, archive
  drawer, or mobile scroll contract

## First Consumer Gate

Before a real app adoption is approved, create a consumer-specific adoption
record that names:

- the route and feature consuming the seam
- the exact column/card data shape
- persistence and optimistic-update behavior
- archive and restore lifecycle semantics
- permission rules for create, archive, restore, and move
- loading, denied, empty, error, and save-failure states
- test coverage proving the app consumes `kanbanColumnSeam.mjs`

## Current Decision

No real app adoption is approved yet. The current work only extracts the
shared render/controller seam and keeps the design-system pattern and canonical
routes consuming that seam as the governed source of truth.
