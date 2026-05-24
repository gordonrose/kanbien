# ButtonCard Behavior Lock

## Scope

`ButtonCard` is the reusable compact card seam for launcher choices, card
groups, and supporting actions that need a visual icon plus a short label.

## Behavior Contract

- `BC-001`: The canonical route is `/design-system/tokens/button-card`.
- `BC-002`: The reusable source seam is
  `src/frontend/designSystem/assets/buttonCard.mjs`.
- `BC-003`: The card renders as a single button so the full bordered surface is
  the activation target.
- `BC-004`: The visual surface composes the signed-off container and
  container-section primitives through `token-container-sample` and
  `token-container-section-sample`.
- `BC-005`: The icon is centered inside a circular icon well.
- `BC-006`: The label is centered underneath the icon circle.
- `BC-007`: The label uses the signed-off paragraph label token.
- `BC-008`: Hover, active, selected, disabled, warning, and error states must
  preserve the base card geometry and centered icon/label stack.
- `BC-009`: Selected cards expose `aria-pressed="true"`.
- `BC-010`: Disabled cards use the native `disabled` attribute and
  `aria-disabled="true"`.
- `BC-011`: Warning and error states use semantic state primitives without
  replacing the card with an alert or status component.
- `BC-012`: Overflowing label text ellipsizes and exposes the full value
  through the shared tooltip layer.
- `BC-013`: RTL, mobile, and magnified examples preserve the same centered
  icon/label contract.
- `BC-014`: ButtonCard is a sibling to IndexCard; it must not use IndexCard's
  count copy lane or require count text.

## Adoption Rule

Any governed surface that needs a compact card-style button with an icon and
label must consume the ButtonCard seam or request a new card-specific
design-system decision. Consumers must not copy token-route markup, recreate
the CSS locally, or consume IndexCard as a substitute for icon/label cards.
