# motion-duration Token Template

Use this template when tokenDefinitionV1.tokenType is motion-duration.

This file defines how this token type is validated, how its variants render on the default token page, and which reusable code seam must expose it to later design-system layers. The shared base variant contract lives in README.md.

```json
{
  "schema": "kanbien.designSystem.tokenTypeTemplate.v1",
  "tokenType": "motion-duration",
  "outputGeneration": {
    "tokenDefinitionSchema": "kanbien.designSystem.tokenDefinition.v1",
    "pageRoutePattern": "/design-system/{designSystem}/tokens/{pageKey}",
    "pageHtmlPathPattern": "src/frontend/designSystem/systems/{designSystem}/tokens/{pageKey}/index.html",
    "systemTokenModulePathPattern": "src/frontend/designSystem/systems/{designSystem}/tokens/definitions/{camelPageKey}.tokens.mjs",
    "systemTokenExportPattern": "{camelPageKey}TokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage"
  },
  "reusableCodeSeam": {
    "systemTokenModuleMustExport": [
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
    "previewRendererKind": "motion-duration-sample"
  },
  "variantSchema": {
    "valueFields": [
      "durationRole",
      "durationValue",
      "interactionContext",
      "reducedMotionMapping",
      "stateMapping",
      "allowedConsumers"
    ],
    "previewKind": "motion-duration-sample",
    "metadataFields": [
      "durationRole",
      "interactionContext",
      "state",
      "reducedMotionMapping",
      "accessibility"
    ],
    "useCaseInstructionFields": [
      "allowedUse",
      "forbiddenUse",
      "reducedMotionRule"
    ]
  },
  "exampleOutput": {
    "pageKey": "motion-duration",
    "pageRoute": "/design-system/default/tokens/motion-duration",
    "pageHtmlPath": "src/frontend/designSystem/systems/default/tokens/motion-duration/index.html",
    "systemTokenModule": "src/frontend/designSystem/systems/default/tokens/definitions/motionDuration.tokens.mjs",
    "systemTokenExport": "motionDurationTokenSpec"
  }
}
```
