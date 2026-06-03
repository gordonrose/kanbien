# Default Panel Stack Placement Token Implementation

## Metadata

| Field | Value |
| --- | --- |
| Token type | `panel-stack-placement` |
| System key | `default` |
| Status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/panel-stack-placement/PanelStackPlacement-Contract.md` |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/panel-stack-placement/systems/default.mjs#panelStackPlacementTokenSpec` |
| Rendered view | `/design-system/default/tokens/panel-stack-placement` |

## Signed Variant

| Variant | Role | Signed values |
| --- | --- | --- |
| `panel-stack-placement-default` | panel stack placement | `0px` desktop adjacency gap; `0px` overlay inset; left and right origins; layer base `30`; layer step `1`; mobile breakpoint inherited from `panel-frame` |

## Dependency

This implementation depends on `panel-frame` for the signed mobile breakpoint.
It does not redefine panel width, surface, padding, radius, or scroll sizing.

## Consumer Restrictions

Consumers must not use route-local `z-index`, panel-stack gap, overlay inset, or
mobile breakpoint literals. Panel surface values still belong to `panel-frame`.
Panel behavior and focus handling still belong to later primitives and patterns.

## Required Evidence

- The token route shows source dependency identity and final signed values.
- Later primitive proof must verify active-panel and covered-panel focus behavior.
- Later pattern proof must verify left/right origins, desktop flush stacking,
  and mobile overlay order.
