# ListPageStructure Component

## Purpose

`ListPageStructure` is the shared design-system structure seam for future
list-style pages. It turns the signed-off token exploration at
`/design-system/tokens/list-page-structure` into a reusable baseline instead of
letting each page invent its own shell, header, carousel, split, or resize
rules.

## Source Of Truth

- Behavior controller: `src/frontend/designSystem/assets/listPageStructure.mjs`
- Structural selectors: `data-list-page-structure-*`
- Styling family: `token-list-page-structure-*`
- Environmental dependency: `PageBackground`
- Review route: `/design-system/tokens/list-page-structure`
- Behavior lock:
  `docs/workspace/design-system/behavior-locks/list-page-structure-behavior-lock.md`

## Public Controller

`createListPageStructureController(root)` mounts the shared interactions for a
page that contains the governed `data-list-page-structure-*` structure.

The controller owns:

- layout switching between `full` and `split`
- second-header column count switching
- first-header and second-header visibility
- desktop split resizing by pointer, mouse, and keyboard
- default initialization

The controller does not own theme or background token calculation. That belongs
to `src/frontend/designSystem/assets/pageBackground.mjs`.

## Adoption Rule

Future governed pages must consume this design-system seam for the outer list
page foundation. They must not reconstruct the same header, secondary-header
carousel, split relationship, resize behavior, or responsive rules with
page-local CSS or page-local controller code.

## Current Status

The component is signed off for the foundation behavior demonstrated on the
token route. First real app adoption still needs a page-specific adoption note
and parity proof against this source of truth.
