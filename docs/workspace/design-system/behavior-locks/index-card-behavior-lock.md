# IndexCard Behavior Lock

## Scope

`IndexCard` is the reusable compact card seam for count-backed index entries
inside card groups, tab summaries, nested indexes, or supporting list surfaces.

## Behavior Contract

- `IC-001`: The canonical route is `/design-system/tokens/index-card`.
- `IC-002`: The reusable source seam is
  `src/frontend/designSystem/assets/indexCard.mjs`.
- `IC-003`: The card renders as a single button so the full bordered surface is
  the activation target.
- `IC-004`: The visual surface composes the signed-off container and
  container-section primitives through `token-container-sample` and
  `token-container-section-sample`.
- `IC-005`: The label and count remain stacked in one copy lane.
- `IC-006`: The label uses the signed-off header 6 token.
- `IC-007`: The count uses the signed-off paragraph main-minor token.
- `IC-008`: Hover, active, selected, disabled, warning, and error states must
  preserve the base card geometry.
- `IC-009`: Selected cards expose `aria-pressed="true"`.
- `IC-010`: Disabled cards use the native `disabled` attribute and
  `aria-disabled="true"`.
- `IC-011`: Warning and error states use semantic state primitives without
  replacing the card with an alert or status component.
- `IC-012`: Overflowing label and count text ellipsize and expose full values
  through the shared tooltip layer.
- `IC-013`: RTL, mobile, and magnified examples preserve the same stacked copy
  contract.
- `IC-014`: Legacy secondary-list-card routes are compatibility aliases only;
  they must render the IndexCard token surface.
- `IC-015`: Legacy `secondaryListCard.mjs` imports are compatibility shims
  that forward to `indexCard.mjs`.
- `IC-016`: `list-card` is not an IndexCard compatibility alias; it is the
  full-row ListCard seam.

## Adoption Rule

Any governed surface that needs a compact card with a count must consume the
IndexCard seam or request a new card-specific design-system decision. Consumers
must not copy token-route markup, recreate the CSS locally, or consume the
full-row ListCard seam as a substitute for compact label/count cards.
