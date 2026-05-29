# Default Field Row Frame Token Implementation

## Status

Review-ready for the `default` design system.

## Runtime Seam

`src/frontend/designSystem/layers/02-token/field-row-frame/systems/default.mjs#fieldRowFrameTokenSpec`

## Rendered Proof

View the proof route at `/design-system/default/tokens/field-row-frame`.

## Implementation Notes

The default implementation derives the hosted-control minimum block size from `minimum-target-size` and aligns the field-row spacing with the existing `body-region-frame` content gap.

The implementation deliberately does not define input borders, input backgrounds, validation colors, or native control behavior.
