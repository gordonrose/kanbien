# Visual Proof Ornament Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/visual-proof-ornament/VisualProofOrnament-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/visual-proof-ornament/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/visualProofOrnament.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/visual-proof-ornament` |

## System Values

This implementation captures the reusable material language from the public
brochure proof diagrams: faint grid lines, translucent chips, connector lines,
teal-to-warm accent bars, soft overlays, and small marker sizing.

## Consumer Rule

Consumers must import the brochure runtime seam rather than hard-coding diagram
materials in primitives, patterns, or app CSS.
