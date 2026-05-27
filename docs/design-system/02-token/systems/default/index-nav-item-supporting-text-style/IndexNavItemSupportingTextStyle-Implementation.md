# Index Nav Item Supporting Text Style Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/index-nav-item-supporting-text-style/IndexNavItemSupportingTextStyle-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-supporting-text-style/systems/default.mjs#indexNavItemSupportingTextStyleTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemSupportingTextStyle.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/index-nav-item-supporting-text-style` |

## Implementation Decision

The default system uses compact, high-emphasis secondary text for dense index
items. It deliberately avoids opacity so contrast does not depend on an
untracked alpha value. Foreground colour is inherited from the consuming
index-item surface state rather than owned by this typography token.
