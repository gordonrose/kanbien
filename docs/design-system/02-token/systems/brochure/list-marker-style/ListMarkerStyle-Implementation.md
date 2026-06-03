# List Marker Style Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/list-marker-style/ListMarkerStyle-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/list-marker-style/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/listMarkerStyle.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/list-marker-style` |

## System Values

- Bullet marker: `0.42rem` circle, `#1f6f78`
- Process marker: `0.42rem` circle, `rgba(31, 111, 120, 0.5)`
- Tag marker: pill marker, `rgba(31, 111, 120, 0.14)`

## Consumer Rule

Consumers must import the brochure runtime seam rather than hard-coding marker
size, radius, or colour values.
