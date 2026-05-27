# Button Frame Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/button-frame/ButtonFrame-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/button-frame/systems/default.mjs#buttonFrameTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/buttonFrame.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/button-frame` |

## Implementation Decision

The default system derives subtle action-button frames from the signed
`primary-color-source`, `background-color`, and `primary-tinted-foreground`
tokens. The theme surface is the fallback host surface, and consuming
primitives or patterns may only vary the host surface through a governed
surface seam. Icon-only frames and text-action frames share color derivation,
while padding remains role-specific so icon-button primitives can preserve
square minimum target geometry and text buttons can preserve readable labels.

Rendered proof text uses the signed `label-text-style` token so the frame
proof does not invent typography while reviewing button-like samples.
