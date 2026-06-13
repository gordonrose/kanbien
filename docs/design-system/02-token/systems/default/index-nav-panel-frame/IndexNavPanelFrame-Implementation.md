# Index Nav Panel Frame Default Implementation

| Field | Value |
| --- | --- |
| Token | `index-nav-panel-frame` |
| System | `default` |
| Status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/index-nav-panel-frame/IndexNavPanelFrame-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavPanelFrame.tokens.mjs` |
| Rendered proof | `/design-system/default/tokens/index-nav-panel-frame` |

The deterministic implementation lives in
`src/frontend/designSystem/systems/default/tokens/proofs/indexNavPanelFrame.tokens.mjs#tokenDefinitionV1`.

The implementation exposes `original`, `dark`, and `desert` variants for the
panel frame, panel header, and panel action roles. Consumers must select by
theme instead of reusing the original light frame values under a themed
attribute.

The panel frame radius derives from
`src/frontend/designSystem/layers/02-token/panel-corner-radius/systems/default.mjs#panelCornerRadiusTokenSpec`
variant `panel-corner-radius-flush`, currently `0`.
