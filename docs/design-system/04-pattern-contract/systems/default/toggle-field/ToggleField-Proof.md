# Default Toggle Field Pattern Proof

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `toggle-control` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Shared pattern contract | `docs/design-system/04-pattern-contract/shared/toggle-field/ToggleField-Contract.md` |
| Rendered view | `/design-system/default/patterns/toggle-field` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/toggle-field/index.mjs#toggleFieldPattern` |

## Implementation Summary

The default proof composes `field-row-control` and `toggle-control`. It shows
field state, checked value, theme, direction, width pressure, long label
pressure, helper/error wiring, read-only blocking, disabled blocking, and
forwarded toggle change events.

## Boundary

The proof does not define product validation, persistence, saving, backend
normalization, or form-section layout.
