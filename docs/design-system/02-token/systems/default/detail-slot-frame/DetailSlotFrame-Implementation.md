# Default Detail Slot Frame Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `detail-slot` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Shared token contract path | `docs/design-system/02-token/shared/detail-slot-frame/DetailSlotFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/detail-slot-frame/DetailSlotFrame-Implementation.md` |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "detail-slot",
  "tokenType": "detail-slot-frame",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/record-list-item/RecordListItem-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/detail-slot-frame/DetailSlotFrame-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/detail-slot-frame/DetailSlotFrame-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/detail-slot-frame",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/detail-slot-frame/index.html",
    "title": "Detail Slot Frame Token",
    "description": "Review governed detail-slot surface, theme, sizing, and scroll values before drawer-like primitives consume them."
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/layers/02-token/detail-slot-frame/contract.mjs",
    "contractExport": "detailSlotFrameTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/detail-slot-frame/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/detailSlotFrame.tokens.mjs",
    "systemTokenExport": "detailSlotFrameTokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["03-primitive", "04-pattern-contract"]
  },
  "variants": [
    {
      "id": "detail-slot-frame-original",
      "tokenName": "--detail-slot-frame-original",
      "value": "original themed detail-slot frame"
    },
    {
      "id": "detail-slot-frame-dark",
      "tokenName": "--detail-slot-frame-dark",
      "value": "dark themed detail-slot frame"
    },
    {
      "id": "detail-slot-frame-desert",
      "tokenName": "--detail-slot-frame-desert",
      "value": "desert themed detail-slot frame"
    }
  ]
}
```

The executable source of truth for exact values is
`src/frontend/designSystem/systems/default/tokens/proofs/detailSlotFrame.tokens.mjs`.

## Rendered View

`/design-system/default/tokens/detail-slot-frame`

## Evidence

Focused unit coverage:

- `tests/unit/designSystem/detailSlotFrameToken.test.ts`
