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

The default system uses compact, high-emphasis supporting text for dense
controls. The default supporting row keeps natural case, while the control
eyebrow variant uses the same compact scale with uppercase transform for
field-like labels such as `Layer`.

It deliberately avoids opacity so contrast does not depend on an untracked
alpha value. Foreground colour is inherited from the consuming surface or
frame state rather than owned by this typography token.
