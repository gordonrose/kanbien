# Default Count Card Frame Token Implementation

Layer: `02-token`

System key: `default`

Status: `review-ready`

Rendered view: `/design-system/default/tokens/count-card-frame`

| Artifact | Path |
| --- | --- |
| Shared contract | `docs/design-system/02-token/shared/count-card-frame/CountCardFrame-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/count-card-frame/systems/default.mjs#countCardFrameTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/countCardFrame.tokens.mjs` |
| Proof route | `src/frontend/designSystem/systems/default/tokens/count-card-frame/index.html` |
| Focused test | `tests/unit/designSystem/countCardFrameToken.test.ts` |

## Implementation Notes

The default system derives selected count-card values from signed primary tint tokens and derives error foreground from `error-text-style`.

Warning values consume `status-color-warning-*`. Count-card frame no longer owns warning colour literals.

The proof route includes a proof-only primary HEX and host-surface diagnostic for selected-state derivations. This diagnostic does not mutate signed token data.
