# Default Field Container Frame Token Implementation

## Status

`review-ready`

## Runtime Seam

- Contract: `src/frontend/designSystem/layers/02-token/field-container-frame/contract.mjs`
- Runtime token seam: `src/frontend/designSystem/layers/02-token/field-container-frame/systems/default.mjs`
- System proof module: `src/frontend/designSystem/systems/default/tokens/proofs/fieldContainerFrame.tokens.mjs`
- Rendered proof: `/design-system/default/tokens/field-container-frame`

## Default Variant

`field-container-frame-default` derives surface, foreground, and border from `body-region-frame`.

The default implementation owns:

- `1rem` block padding
- `1rem` inline padding
- `0.375rem` radius
- `8.5rem` minimum block size
- `min(100%, 16rem)` minimum inline size
- `100%` maximum inline size

## Review Notes

The rendered proof shows the dependency identity, inherited surface values, owned padding, and owned minimum height.

The token does not approve native control behavior, field labels, helper/error semantics, product validation, form submission, or app adoption.
