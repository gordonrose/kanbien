# Panel Corner Radius Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Design system | `default` |
| Shared contract | `docs/design-system/02-token/shared/panel-corner-radius/PanelCornerRadius-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/panel-corner-radius/systems/default.mjs#panelCornerRadiusTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/panelCornerRadius.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/panel-corner-radius` |

## Signed Variant

| Variant | Value | Purpose |
| --- | --- | --- |
| `panel-corner-radius-flush` | `0` | Lets panels sit flush against adjacent containers without curved gaps. |

## Review Evidence

The rendered proof shows the actual panel radius value on desktop and mobile.
The `index-nav-panel-frame` token derives its panel frame radius from this
token so panel patterns do not invent or locally override the corner shape.
