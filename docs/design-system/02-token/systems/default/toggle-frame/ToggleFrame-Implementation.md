# Default Toggle Frame Token Implementation

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `toggle-control` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/toggle-control/ToggleControl-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/toggle-frame/ToggleFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/toggle-frame/ToggleFrame-Implementation.md` |
| Rendered view | `/design-system/default/tokens/toggle-frame` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/toggle-frame/systems/default.mjs#toggleFrameTokenSpec` |

## Implementation Summary

The default implementation defines `off`, `on`, `read-only`, `disabled`, and `error` variants for the `original`, `dark`, and `desert` themes.

Each variant signs the track size, thumb size, track padding, track radius, thumb radius, thumb shadow, state offset, and transition timing so downstream primitives do not invent those values.

On-state values derive from `primary-color-source`, `primary-tinted-background`, `primary-tinted-foreground`, and the signed host surface. Error values pair with `error-text-style`. Hit target evidence pairs with `minimum-target-size`.

Dark-theme resting and active thumb values use stronger foreground-over-surface
mixes than their adjacent tracks so the non-text thumb affordance remains
distinguishable in both unchecked and checked states.

The rendered proof includes a proof-only primary HEX and host-surface override so reviewers can see the on-state derivation change without mutating signed token data.

## Deterministic Source

The deterministic token source is:

`src/frontend/designSystem/systems/default/tokens/proofs/toggleFrame.tokens.mjs#tokenDefinitionV1`
