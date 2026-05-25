# loading-state Token Template

Use this template when tokenDefinitionV1.tokenType is loading-state.

This file defines how this token type is validated, how its variants render on the default token page, and which reusable code seam must expose it to later design-system layers. The shared base variant contract lives in README.md.

```json
{
  "schema": "kanbien.designSystem.tokenTypeTemplate.v1",
  "tokenType": "loading-state",
  "outputGeneration": {
    "tokenDefinitionSchema": "kanbien.designSystem.tokenDefinition.v1",
    "pageRoutePattern": "/design-system/{designSystem}/tokens/{pageKey}",
    "pageHtmlPathPattern": "src/frontend/designSystem/systems/{designSystem}/tokens/{pageKey}/index.html",
    "systemProofModulePathPattern": "src/frontend/designSystem/systems/{designSystem}/tokens/proofs/{camelPageKey}.tokens.mjs",
    "systemTokenExportPattern": "{camelPageKey}TokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage"
  },
  "reusableCodeSeam": {
    "systemProofModuleMustExport": [
      "tokenDefinitionV1",
      "tokenTypeTemplate",
      "variants"
    ],
    "rendererConsumes": [
      "tokenDefinitionV1.page",
      "tokenDefinitionV1.codeSeam",
      "tokenDefinitionV1.variants",
      "tokenTypeTemplate.previewKind"
    ],
    "allowedRuntimeConsumers": [
      "token page renderer",
      "later governed primitives",
      "later governed patterns"
    ],
    "forbiddenRuntimeConsumers": [
      "app-local CSS",
      "route-local duplicate token maps",
      "copied demo markup"
    ]
  },
  "pageStructure": {
    "requiredSections": [
      "title and description",
      "variant preview grid",
      "variant metadata table",
      "use-case instructions",
      "consumer restrictions",
      "evidence summary"
    ],
    "variantCardFields": [
      "preview",
      "tokenName",
      "value",
      "metadata",
      "useCaseInstructions"
    ],
    "previewRendererKind": "state-sample"
  },
  "variantSchema": {
    "valueFields": [
      "stateRole",
      "surfaceMapping",
      "textMapping",
      "motionMapping",
      "statusCue",
      "reducedMotionMapping"
    ],
    "previewKind": "state-sample",
    "metadataFields": [
      "stateRole",
      "theme",
      "state",
      "statusCue",
      "accessibility"
    ],
    "useCaseInstructionFields": [
      "allowedUse",
      "forbiddenUse",
      "statusCommunicationRule"
    ]
  },
  "exampleOutput": {
    "pageKey": "loading-state",
    "pageRoute": "/design-system/default/tokens/loading-state",
    "pageHtmlPath": "src/frontend/designSystem/systems/default/tokens/loading-state/index.html",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/loadingState.tokens.mjs",
    "systemTokenExport": "loadingStateTokenSpec"
  }
}
```
