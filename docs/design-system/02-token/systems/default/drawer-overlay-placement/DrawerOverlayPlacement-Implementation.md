# Default Drawer Overlay Placement Token Implementation

## Status

`review-ready`

## Rendered View

`/design-system/default/tokens/drawer-overlay-placement`

## Runtime Seam

`src/frontend/designSystem/layers/02-token/drawer-overlay-placement/systems/default.mjs#drawerOverlayPlacementTokenSpec`

## Signed Variant

- `drawer-overlay-placement-page-shell`

The variant signs fixed page-shell placement, shell-preserving inset, content
region inline and block sizing, and a drawer overlay layer above the signed
panel-stack layer range.

Default signed fallback values:

- Position: `fixed`
- Inset: `var(--drawer-overlay-page-shell-inset, 4rem 0 0 4.25rem)`
- Inline size:
  `calc(100vw - var(--drawer-overlay-page-shell-inline-offset, 4.25rem))`
- Block size:
  `calc(100dvh - var(--drawer-overlay-page-shell-block-start, 4rem))`
- Layer: `60`

## Dependency

This implementation depends on `panel-stack-placement` for stack-layer context.

The drawer overlay layer does not replace panel-stack ordering. It sits above
the surrounding page/proof content underlay while preserving shell chrome, and
the panel stack continues to own panel order inside the drawer.
