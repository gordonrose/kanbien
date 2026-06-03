# Accordion Frame Default Implementation

Status: `review-ready`

Layer: `02-token`

Design system: `default`

Route: `/design-system/default/tokens/accordion-frame`

Runtime seam:
`src/frontend/designSystem/layers/02-token/accordion-frame/systems/default.mjs#accordionFrameTokenSpec`

Proof module:
`src/frontend/designSystem/systems/default/tokens/proofs/accordionFrame.tokens.mjs`

## Implementation

The default system exposes neutral and tinted variants for `original`, `dark`,
and `desert`.

Header and content surfaces derive from the signed `background-color` surface
variant for each theme. Border and separator values are calculated by mixing
theme foreground over the same signed surface.

Tinted header variants derive a quieter accordion-specific tint from the
signed primary source carried by `primary-tinted-background`, mixed at low
strength over the signed surface. Header foreground comes from
`primary-tinted-foreground`; content remains on the signed neutral surface.

Header minimum height derives from `minimum-target-size`. Indicator dimensions
derive from `icon-size`. Radius derives from `panel-corner-radius`.

## Consumer Boundary

The token may be consumed by future accordion primitives and patterns.

It may not be consumed as a generic card, dropdown, panel shell, field row,
workflow step, or app-local collapse styling token.

## Evidence

Rendered view:

- `/design-system/default/tokens/accordion-frame`

Focused checks:

- `tests/unit/designSystem/accordionFrameToken.test.ts`
- `tests/visual/designSystem/tokens/accordionFrameTokenRoute.spec.ts`
