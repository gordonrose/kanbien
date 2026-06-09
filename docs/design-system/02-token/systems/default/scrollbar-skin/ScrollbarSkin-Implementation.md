# Scrollbar Skin Default Implementation

| Field | Value |
| --- | --- |
| Token type | `scrollbar-skin` |
| System | `default` |
| Status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/scrollbar-skin/ScrollbarSkin-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/scrollbar-skin/systems/default.mjs#scrollbarSkinTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/scrollbarSkin.tokens.mjs` |
| Rendered proof | `/design-system/default/tokens/scrollbar-skin` |

The default implementation derives a styled internal scrollbar from the primary
color source and a quiet tinted track. It also signs the `0.75rem` WebKit
scrollbar gutter used for focus and layout clearance. It exists so patterns do
not invent custom scrollbar values locally.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/scrollbar-skin` |
| Rendered view status | `available` |

## Evidence

The rendered proof shows the token source, final thumb and track values, and a
scrollable preview that uses the signed values.
