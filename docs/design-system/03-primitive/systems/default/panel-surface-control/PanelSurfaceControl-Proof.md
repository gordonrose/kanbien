# Default Panel Surface Control Primitive Proof

## Metadata

| Field | Value |
| --- | --- |
| Primitive | `panel-surface-control` |
| System key | `default` |
| Status | `review-ready` |
| Shared contract | `docs/design-system/03-primitive/shared/panel-surface-control/PanelSurfaceControl-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/panel-surface-control/index.mjs#panelSurfaceControlPrimitive` |
| Rendered view | `/design-system/default/primitives/panel-surface-control` |

## Proof Scope

The default proof renders the primitive from the signed `panel-frame` token and
shows active, covered, and hidden state posture.

The proof does not approve panel-stack composition, drawer select, search,
selection cards, route state, or app adoption.

## Signed Dependencies

| Dependency | Runtime seam | Purpose |
| --- | --- | --- |
| `panel-frame` | `src/frontend/designSystem/layers/02-token/panel-frame/systems/default.mjs#panelFrameTokenSpec` | Supplies surface, border, radius, padding, gap, width rails, and block-size rail values. |

## Required Evidence

- Unit proof verifies token dependency identity and allowed states.
- Rendered proof exposes active, covered, hidden, and width pressure variants.
- Later `panel-stack` proof must verify focus handoff and overlay order; this
  primitive only exposes shell posture.
