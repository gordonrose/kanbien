# Default Panel Stack Pattern Proof

## Metadata

| Field | Value |
| --- | --- |
| Pattern | `panel-stack` |
| System key | `default` |
| Status | `review-ready` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/panel-stack/PanelStack-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/panel-stack/index.mjs#panelStackPattern` |
| Rendered view | `/design-system/default/patterns/panel-stack` |

## Proof Scope

The proof shows left and right origins, desktop flush stacking, mobile overlay
posture, active panel selection, and covered-panel primitive state.

The proof does not approve drawer select, search, filter grouping, display
settings, component seams, or app adoption.

## Signed Dependencies

| Dependency | Runtime seam | Purpose |
| --- | --- | --- |
| `panel-stack-placement` | `src/frontend/designSystem/layers/02-token/panel-stack-placement/systems/default.mjs#panelStackPlacementTokenSpec` | Supplies adjacency, overlay inset, breakpoint, and layer order values. |
| `panel-surface-control` | `src/frontend/designSystem/layers/03-primitive/panel-surface-control/index.mjs#panelSurfaceControlPrimitive` | Supplies panel shell semantics and token-backed frame values. |

## Required Evidence

- Unit proof verifies desktop and mobile panel states.
- Rendered proof exposes origin, viewport, active panel, and panel count
  controls.
- Later drawer-select proof must add open/close focus handoff, search, grouped
  selected/not-selected content, and selection card behavior.
