# text-style Token Template

Use this template when tokenDefinitionV1.tokenType is text-style.

Use `text-style` when a downstream primitive needs font family, size, weight,
line height, and letter spacing as one governed style. Do not use it to define
component anatomy, truncation behavior, or tooltip behavior.

Every `text-style` token that declares a preferred web font must also declare
a fallback font stack. The fallback stack is part of the governed token value,
not an app-local CSS detail.

```json
{
  "schema": "kanbien.designSystem.tokenTypeTemplate.v1",
  "tokenType": "text-style",
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
    "systemProofModuleMustExport": ["tokenDefinitionV1", "tokenTypeTemplate", "variants"],
    "rendererConsumes": [
      "tokenDefinitionV1.page",
      "tokenDefinitionV1.codeSeam",
      "tokenDefinitionV1.variants",
      "tokenTypeTemplate.previewKind"
    ],
    "allowedRuntimeConsumers": ["token page renderer", "later governed primitives", "later governed patterns"],
    "forbiddenRuntimeConsumers": ["app-local CSS", "route-local duplicate token maps", "copied demo markup"]
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
    "variantCardFields": ["preview", "tokenName", "value", "metadata", "useCaseInstructions"],
    "previewRendererKind": "text-style-sample"
  },
  "variantSchema": {
    "valueFields": [
      "textStyleRole",
      "fontFamilyValue",
      "fontFallbackRule",
      "fontSizeValue",
      "fontWeightValue",
      "lineHeightValue",
      "letterSpacingValue",
      "textTransform",
      "overflowReadiness",
      "zoomBehavior"
    ],
    "previewKind": "text-style-sample",
    "metadataFields": ["textStyleRole", "theme", "state", "accessibility"],
    "useCaseInstructionFields": ["allowedUse", "forbiddenUse", "overflowRule"]
  },
  "exampleOutput": {
    "pageKey": "label-text-style",
    "pageRoute": "/design-system/default/tokens/label-text-style",
    "pageHtmlPath": "src/frontend/designSystem/systems/default/tokens/label-text-style/index.html",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/labelTextStyle.tokens.mjs",
    "systemTokenExport": "labelTextStyleTokenSpec"
  }
}
```
