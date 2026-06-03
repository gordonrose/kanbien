# Surface Frame Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/surface-frame/SurfaceFrame-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/surface-frame/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/surfaceFrame.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/surface-frame` |

## System Values

- Panel: `#fffdf8`, `rgba(40, 56, 71, 0.16)`, radius `0.5rem`
- Elevated panel: panel values plus `0 1.25rem 3rem rgba(23, 38, 47, 0.12)`
- Navigation: `rgba(255, 253, 248, 0.88)`, square radius
- Subnav: `rgba(255, 253, 248, 0.74)`, square radius
- Showcase: editorial gradient over warm panel surface

## Consumer Rule

Consumers must import the brochure runtime seam rather than hard-coding surface
background, border, radius, or shadow values.
