# Index Nav Item Gap Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/index-nav-item-gap/IndexNavItemGap-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-gap/systems/default.mjs#indexNavItemGapTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemGap.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/index-nav-item-gap` |

## Implementation Decision

The default system uses `0.25rem` so label and support text remain grouped while
still visibly distinct in a dense index list.

## Evidence

Focused unit, route, and visual tests for the token proof route are required
before later layers may treat this implementation as consumable.
