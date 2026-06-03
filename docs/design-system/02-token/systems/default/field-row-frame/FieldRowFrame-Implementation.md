# Default Field Row Frame Token Implementation

## Status

Review-ready for the `default` design system.

## Runtime Seam

`src/frontend/designSystem/layers/02-token/field-row-frame/systems/default.mjs#fieldRowFrameTokenSpec`

## Rendered Proof

View the proof route at `/design-system/default/tokens/field-row-frame`.

## Implementation Notes

The default implementation derives the hosted-control minimum block size from `minimum-target-size`, keeps the outer row rhythm aligned with the existing `body-region-frame` content gap, and uses a shared `0.5rem` label-to-control gap plus a shared `0.375rem` control-to-message gap so text fields, text areas, selectors, radios, toggles, and card-list fields keep one consistent field rhythm.

The implementation deliberately does not define input borders, input backgrounds, validation colors, or native control behavior.
