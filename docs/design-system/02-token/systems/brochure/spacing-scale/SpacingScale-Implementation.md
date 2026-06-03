# Spacing Scale Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/spacing-scale/SpacingScale-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/spacing-scale/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/spacingScale.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/spacing-scale` |

## System Values

- Page gutter: `clamp(2rem, 8vw, 8rem)`
- Section padding: `clamp(1rem, 2vw, 1.5rem)`
- Content gap: `0.85rem`
- Compact gap: `0.55rem`
- Micro gap: `0.35rem`

## Consumer Rule

Consumers must import the brochure runtime seam rather than hard-coding spacing
values in app or pattern CSS.
