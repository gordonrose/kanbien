# Default Status Color Token Implementation

Layer: `02-token`

System key: `default`

Status: `review-ready`

Rendered view: `/design-system/default/tokens/status-color`

| Artifact | Path |
| --- | --- |
| Shared contract | `docs/design-system/02-token/shared/status-color/StatusColor-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/status-color/systems/default.mjs#statusColorTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/statusColor.tokens.mjs` |
| Proof route | `src/frontend/designSystem/systems/default/tokens/status-color/index.html` |
| Focused tests | `tests/unit/designSystem/statusColorToken.test.ts`; `tests/visual/designSystem/tokens/statusColorTokenRoute.spec.ts` |

## Implementation Notes

The default system signs warning colour pairings across original, dark, and desert themes.

Each variant derives its surface relationship from the signed background surface token for that theme. The warning source colour is a status-colour decision and may be reused by later warning-aware primitives and patterns.

The rendered proof includes a proof-only dependency diagnostic for changing the warning source HEX and host surface. The diagnostic verifies derivation behavior without changing signed token values.
