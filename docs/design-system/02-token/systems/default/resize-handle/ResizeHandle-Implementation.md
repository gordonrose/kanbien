# Resize Handle Token Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token type | `resize-handle` |
| System key | `default` |
| Status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/resize-handle/systems/default.mjs#resizeHandleTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/resizeHandle.tokens.mjs` |
| Rendered proof | `/design-system/default/tokens/resize-handle` |

## Implementation Notes

The default system exposes one inline resize handle affordance. It intentionally
does not include panel min or max width values; those are inherited from the
consuming panel frame token.

The visible rail radius is `999px` and is signed as part of the resize-handle
affordance token, not as local primitive CSS.
