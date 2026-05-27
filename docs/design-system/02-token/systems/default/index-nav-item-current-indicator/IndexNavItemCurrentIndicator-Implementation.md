# Index Nav Item Current Indicator Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/index-nav-item-current-indicator/IndexNavItemCurrentIndicator-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-current-indicator/systems/default.mjs#indexNavItemCurrentIndicatorTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemCurrentIndicator.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/index-nav-item-current-indicator` |

## Implementation Decision

The default system uses a compact logical inline-start bar. The bar is a visual
indicator only; current semantics still belong to the primitive through
`aria-current`.

## Evidence

Focused unit, route, and visual tests for the token proof route are required
before primitives may render this indicator.
