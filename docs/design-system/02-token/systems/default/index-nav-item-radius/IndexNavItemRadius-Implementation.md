# Index Nav Item Radius Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/index-nav-item-radius/IndexNavItemRadius-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-radius/systems/default.mjs#indexNavItemRadiusTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemRadius.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/index-nav-item-radius` |

## Implementation Decision

The default system uses `0.375rem` so the item reads as a compact rectangular
control rather than a large card. Later design systems may change the value, but
must preserve a governed radius seam instead of moving the value into pattern or
app CSS.

## Evidence

Focused unit, route, and visual tests for the token proof route are required
before later layers may treat this implementation as consumable.
