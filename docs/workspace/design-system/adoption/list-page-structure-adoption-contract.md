# ListPageStructure Adoption Contract

## Adoption Gate

A real app page may adopt `ListPageStructure` only by consuming the
design-system-owned structure and controller seam. Copying the token route
markup, duplicating the controller, or adding app-page CSS for the foundation is
not governed adoption.

## Required Consumer Evidence

The first consumer must record:

- which page is adopting the structure
- whether it uses `full`, `1:4 split`, or both modes
- which child components are placed into each structural region
- whether the display drawer controls remain available or are constrained by
  product policy
- desktop and mobile parity proof against `/design-system/tokens/list-page-structure`
- confirmation that no app-local CSS recreates the page foundation

## Consumer Responsibilities

The consuming page owns domain content and data behavior. `ListPageStructure`
owns only the page foundation:

- first header region
- secondary header/navigation region
- full lower primary region
- split lower side/primary relationship
- responsive foundation behavior
- desktop resize behavior

## Explicit Non-Adoption

A page that merely imports shared CSS, but rebuilds the structure or interaction
logic locally, is not considered adopted.
