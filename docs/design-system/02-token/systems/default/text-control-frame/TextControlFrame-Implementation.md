# Default Text Control Frame Implementation

## Status

Review-ready for the `default` design system.

## Runtime Seam

`src/frontend/designSystem/layers/02-token/text-control-frame/systems/default.mjs#textControlFrameTokenSpec`

## Rendered Proof

View the proof route at `/design-system/default/tokens/text-control-frame`.

## State And Theme Variants

The default system exposes `default`, `required`, `read-only`, `disabled`, and
`error` text-control frame variants for `original`, `dark`, and `desert`
themes.

`required` intentionally shares the default visual frame; the primitive owns
required semantics and marker evidence. `read-only`, `disabled`, and `error`
provide distinct theme-derived background, foreground, and border values so
text-entry primitives do not invent visual state locally.
