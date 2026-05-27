# Index Nav List Gap Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/index-nav-list-gap/IndexNavListGap-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-list-gap/systems/default.mjs#indexNavListGapTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavListGap.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/index-nav-list-gap` |

## Implementation Decision

The default system uses `0.5rem` between rectangular index items. This keeps the
list scannable without turning each item into an isolated card stack.
