# Kanban Column Reference Pack

## Purpose

Freeze the signed-off `KanbanColumn` pattern baseline so future canonicals and
app consumers can be reviewed against named reference targets instead of memory
of the live demo.

## Scope

- Family:
  `kanban-column`
- Status:
  signed-off pattern reference baseline
- Current source surface:
  `/design-system/patterns/kanban-column`
- Shared source seam:
  `src/frontend/designSystem/assets/kanbanColumnSeam.mjs`
- Dedicated canonical launcher:
  `/design-system/canonical-renderings/kanban-column`
- Dedicated canonical render surface:
  `/design-system/canonical-renderings/kanban-column/:ref`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/kanban-column-behavior-lock.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/kanban-column-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/kanban-column-component.md`
- Existing executable verification:
  `tests/visual/designSystem/patterns/kanbanColumn.spec.ts`

## Signed-Off Rule Source

This pack inherits the approved rules from:

- `KCBL-001` through `KCBL-014` in
  `docs/workspace/design-system/behavior-locks/kanban-column-behavior-lock.md`

## Current Surface Truth

- the board renders visible columns as a horizontal lane set on desktop and
  mobile, with mobile using horizontal board scrolling
- visible-column selection reuses the drawer-select seam
- create-column mode exposes explicit insertion rails between visible columns
- insertion rails use centered SVG plus glyphs, not text plus characters
- adding a column creates an inline draft column and focuses the name input
- every visible column includes a subtle bottom add-card affordance
- adding a card creates an inline draft card and focuses the title input
- removing a column archives it and keeps its cards restorable
- archived columns appear in a separated drawer section below the active
  available-column catalog
- drag-and-drop cards show source state, a following drag image, and a landing
  marker
- card movement also remains available through non-drag move controls
- dark theme count badges remain high contrast
- drawer-only visibility management, hidden-column preservation, archive
  education, restore outcomes, non-drag move outcomes, RTL, magnification, and
  accent/long-copy strain each have dedicated canonical states

## Required Reference States

| Ref ID | Current route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `KCR-001` | `/design-system/canonical-renderings/kanban-column/KCR-001` | Desktop baseline | Preserves default board, visible columns, cards, and drawer-select reuse | canonical-created | Current live review anchor |
| `KCR-002` | `/design-system/canonical-renderings/kanban-column/KCR-002` | Column create mode | Preserves insertion lines and centered plus glyphs between columns | canonical-created | Dedicated plus-centering proof |
| `KCR-003` | `/design-system/canonical-renderings/kanban-column/KCR-003` | Draft column inline naming | Preserves spatial insert plus focused column name field | canonical-created | Verifies focus and placement |
| `KCR-004` | `/design-system/canonical-renderings/kanban-column/KCR-004` | Add-card draft | Preserves bottom add-card affordance, centered plus glyph, focused title field, and count update | canonical-created | Escaped plus-centering defect has regression coverage |
| `KCR-005` | `/design-system/canonical-renderings/kanban-column/KCR-005` | Archived column drawer section | Preserves restore list below the active catalog without overlap | canonical-created | Escaped archived-layout defect has regression coverage |
| `KCR-006` | `/design-system/canonical-renderings/kanban-column/KCR-006` | Desktop drag/drop | Preserves visible drag source and landing marker | canonical-created | Includes non-drag fallback in same route |
| `KCR-007` | `/design-system/canonical-renderings/kanban-column/KCR-007` | Dark theme strain | Preserves count-badge contrast in dark mode | canonical-created | Theme scope stays local to specimen |
| `KCR-008` | `/design-system/canonical-renderings/kanban-column/KCR-008` | Dense and long-copy strain | Preserves card/column fit under cramped content pressure | canonical-created | Dense and long-copy strain proof |
| `KCR-009` | `/design-system/canonical-renderings/kanban-column/KCR-009` | Mobile horizontal scroll | Preserves side-by-side lanes with horizontal scrolling and non-drag movement controls | canonical-created | Drag is not the mobile dependency |
| `KCR-010` | `/design-system/canonical-renderings/kanban-column/KCR-010` | Drawer visible-column manager | Preserves selected/available column grouping without archive content | canonical-created | Dedicated drawer-select reuse proof |
| `KCR-011` | `/design-system/canonical-renderings/kanban-column/KCR-011` | Hidden column card preservation | Preserves the rule that hidden columns leave the board without deleting their cards | canonical-created | Available hidden column remains visible in drawer |
| `KCR-012` | `/design-system/canonical-renderings/kanban-column/KCR-012` | Archive education callout | Preserves the first-archive explanatory callout and dismissal affordance | canonical-created | Points users back to the drawer banner area |
| `KCR-013` | `/design-system/canonical-renderings/kanban-column/KCR-013` | Restored archived column | Preserves restored-column return with card content and count intact | canonical-created | Recovery outcome proof |
| `KCR-014` | `/design-system/canonical-renderings/kanban-column/KCR-014` | Non-drag moved card result | Preserves button-based movement as a real movement path, not only button visibility | canonical-created | Non-drag fallback result proof |
| `KCR-015` | `/design-system/canonical-renderings/kanban-column/KCR-015` | RTL board review | Preserves specimen-scoped RTL without mutating the document direction | canonical-created | Direction strain proof |
| `KCR-016` | `/design-system/canonical-renderings/kanban-column/KCR-016` | Magnified board review | Preserves readable controls under visible specimen zoom and narrower-width overflow pressure | canonical-created | Magnification strain proof |
| `KCR-017` | `/design-system/canonical-renderings/kanban-column/KCR-017` | Accent and long-copy strain | Preserves non-default accent plus long-copy bounded layout | canonical-created | Accent strain proof |

## High-Risk Review Batch

The highest-risk future canonical states are:

- `KCR-002` insertion-line create mode
- `KCR-004` add-card draft control
- `KCR-005` archived drawer recovery section
- `KCR-006` drag/drop landing marker
- `KCR-007` dark count-badge contrast
- `KCR-009` mobile horizontal scrolling movement
- `KCR-010` drawer selected/available grouping
- `KCR-012` first-archive education callout
- `KCR-014` non-drag movement result
- `KCR-015` RTL scoped direction
- `KCR-016` magnified control fit

These carry the biggest drift risk because they came directly from iterative
visual feedback or protect non-pointer fallback behavior.

## Parity Rule

A future implementation or app consumer matches this pack only when:

- it satisfies the locked `KCBL-*` behaviors
- it preserves the required `KCR-*` states or approved equivalents
- it consumes `src/frontend/designSystem/assets/kanbanColumnSeam.mjs` and the
  design-system-owned style seam rather than copying markup and interaction
  behavior into app-local code
- any deviation from the signed-off pattern route is recorded explicitly

## Exit Condition

This reference pack is operational with dedicated generated canonical routes.

Before first real app adoption, the family still needs:

- an app adoption contract naming the first consumer and shared seam API
  consumption plan
