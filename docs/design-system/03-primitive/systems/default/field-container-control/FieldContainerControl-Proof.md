# Default Field Container Control Primitive Proof

## Status

`review-ready`

## Runtime Seam

- Runtime primitive seam: `src/frontend/designSystem/layers/03-primitive/field-container-control/index.mjs`
- Rendered proof: `/design-system/default/primitives/field-container-control`

## Token Consumption

The default proof consumes `field-container-frame-default` from `field-container-frame`.

## Evidence

The rendered route proves:

- token-backed container surface, padding, border, radius, and sizing
- provided versus empty child-slot posture
- constrained-width rendering
- RTL rendering
- child behavior remains outside this primitive

The proof-only child is not a governed input or selector.
