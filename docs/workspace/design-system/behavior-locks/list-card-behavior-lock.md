# ListCard Behavior Lock

## Scope

`ListCard` is the reusable full-row card seam for list-centric record previews
that need a title, subtitle, and trailing status.

## Behavior Contract

- `LC-001`: The canonical route is `/design-system/tokens/list-card`.
- `LC-002`: The reusable source seam is
  `src/frontend/designSystem/assets/listCard.mjs`.
- `LC-003`: The card renders as a single button so the full row is the
  activation target.
- `LC-004`: The row uses the approved colour, container, typography, tooltip,
  and semantic state primitives; it must not invent local colours.
- `LC-005`: Title and subtitle remain stacked in the start lane.
- `LC-006`: Status remains in the inline-end lane.
- `LC-007`: Title uses the signed-off header 6 token.
- `LC-008`: Subtitle and status use the signed-off paragraph main-minor token.
- `LC-009`: Normal, dark, and desert theme specimens are required.
- `LC-010`: Hover, selected, disabled, warning, and error states preserve the
  same row geometry.
- `LC-011`: Neutral hover and selected states inherit theme/container
  primitives and must not force success green.
- `LC-012`: Warning and error states use the warning/error colour primitives.
- `LC-013`: Selected cards expose `aria-pressed="true"`.
- `LC-014`: Disabled cards use the native `disabled` attribute and
  `aria-disabled="true"`.
- `LC-015`: Overflowing title, subtitle, and status text ellipsize and expose
  full values through the shared tooltip layer.
- `LC-016`: RTL and mobile specimens preserve the title/subtitle/status lane
  relationship.
- `LC-017`: `index-card` remains the compact count-card seam; `list-card` owns
  the full-row list-card seam.

## Adoption Rule

Any governed surface that needs a full-row clickable list card must consume the
ListCard seam or request a new design-system decision. Consumers must not copy
token-route markup, recreate the CSS locally, or treat `index-card` as a
substitute for this full-row row pattern.
