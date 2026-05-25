# elevation-shadow Token Template

Use this template when tokenDefinitionV1.tokenType is elevation-shadow.

This file defines how this token type is validated, how its variants render on the default token page, and which reusable code seam must expose it to later design-system layers. The shared base variant contract lives in README.md.

```json
{
  "schema": "kanbien.designSystem.tokenTypeTemplate.v1",
  "tokenType": "elevation-shadow",
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
    "previewRendererKind": "elevation-sample"
  },
  "variantSchema": {
    "valueFields": [
      "elevationLevel",
      "shadowValue",
      "usageContext",
      "themeMapping",
      "stackingRelationship",
      "motionRelationship"
    ],
    "previewKind": "elevation-sample",
    "metadataFields": [
      "elevationLevel",
      "usageContext",
      "theme",
      "state",
      "accessibility"
    ],
    "useCaseInstructionFields": [
      "allowedUse",
      "forbiddenUse",
      "motionConstraint"
    ]
  },
  "exampleOutput": {
    "pageKey": "elevation-shadow",
    "pageRoute": "/design-system/default/tokens/elevation-shadow",
    "pageHtmlPath": "src/frontend/designSystem/systems/default/tokens/elevation-shadow/index.html",
    "systemTokenModule": "src/frontend/designSystem/systems/default/tokens/definitions/elevationShadow.tokens.mjs",
    "systemTokenExport": "elevationShadowTokenSpec"
  }
}
```
