# Index Nav Item Padding Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/index-nav-item-padding/IndexNavItemPadding-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-padding/systems/default.mjs#indexNavItemPaddingTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemPadding.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/index-nav-item-padding` |

## Implementation Decision

The default system uses compact logical padding that can support a dense index
list while leaving hit-area enforcement to the `minimum-target-size` token.

## Evidence

Focused unit, route, and visual tests for the token proof route are required
before later layers may treat this implementation as consumable.
