# Supporting Text Style Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/supporting-text-style/SupportingTextStyle-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs#supportingTextStyleTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/supportingTextStyle.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/supporting-text-style` |

## Implementation Decision

The default system uses compact, high-emphasis secondary text for dense
controls. It deliberately avoids opacity so contrast does not depend on an
untracked alpha value. Foreground colour is inherited from the consuming
surface state rather than owned by this typography token.
