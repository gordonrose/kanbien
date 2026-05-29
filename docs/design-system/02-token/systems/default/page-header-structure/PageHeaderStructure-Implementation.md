# PageHeaderStructure Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | shared across design systems |
| Implementation system | default |
| UI family | entity-page-header |
| Harness layer | 02-token |
| Token status | review-ready |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md` |
| Existing design-system URL | `/design-system/tokens/page-header` |
| Proposed design-system URL | `/design-system/default/tokens/page-header-structure` |
| Shared token contract path | `docs/design-system/02-token/shared/page-header-structure/PageHeaderStructure-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/page-header-structure/PageHeaderStructure-Implementation.md` |
| Files affected now | system implementation and matching runtime/proof seams |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "entity-page-header",
  "tokenType": "page-header-structure",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/page-header-structure/PageHeaderStructure-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/page-header-structure/PageHeaderStructure-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/page-header-structure",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/page-header-structure/index.html",
    "title": "Page Header Structure Token",
    "description": "Review the governed 24-column page-header region map before populated header patterns consume it."
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/layers/02-token/page-header-structure/contract.mjs",
    "contractExport": "pageHeaderStructureTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/page-header-structure/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/pageHeaderStructure.tokens.mjs",
    "systemTokenExport": "pageHeaderStructureTokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["02-token", "03-primitive", "04-pattern-contract"]
  },
  "dependencies": [
    {
      "contractId": "behavior.entity-page-structure",
      "variantId": "foundation-header-24-column",
      "tokenName": "shared foundation header",
      "value": "24 columns",
      "relationship": "derived-from"
    }
  ],
  "diagnostic": {
    "kind": "none",
    "rule": "The region map is signed data; proof controls must not mutate the region ids or column spans."
  },
  "variants": [
    {
      "id": "page-header-structure-default",
      "tokenName": "--page-header-structure",
      "value": {
        "layoutRole": "page header structure",
        "visibleColumnCount": 24,
        "gapValue": "0.5rem",
        "collapseBehavior": "collapse from rendered header width by removing unavailable trailing columns while remaining visible tracks fill the inline width",
        "regions": [
          { "id": "leading-control", "label": "1", "startColumn": 1, "endColumn": 2, "purpose": "single leading control region" },
          { "id": "secondary-control", "label": "2", "startColumn": 2, "endColumn": 3, "purpose": "single secondary control region" },
          { "id": "primary-filter", "label": "3-5", "startColumn": 3, "endColumn": 6, "purpose": "three-column grouped control region" },
          { "id": "secondary-filter", "label": "6-8", "startColumn": 6, "endColumn": 9, "purpose": "three-column grouped control region" },
          { "id": "context-title", "label": "9-19", "startColumn": 9, "endColumn": 20, "purpose": "primary page context region" },
          { "id": "action-1", "label": "20", "startColumn": 20, "endColumn": 21, "purpose": "single action region" },
          { "id": "action-2", "label": "21", "startColumn": 21, "endColumn": 22, "purpose": "single action region" },
          { "id": "action-3", "label": "22", "startColumn": 22, "endColumn": 23, "purpose": "single action region" },
          { "id": "action-4", "label": "23", "startColumn": 23, "endColumn": 24, "purpose": "single action region" },
          { "id": "action-5", "label": "24", "startColumn": 24, "endColumn": 25, "purpose": "single action region" }
        ]
      },
      "derivation": {
        "sourceTokenName": "shared foundation header",
        "sourceValue": "24 columns",
        "formulaOrMapping": "Region start and end columns map to the existing page-header proof route over the 24-column foundation header.",
        "renderedValue": "1, 2, 3-5, 6-8, 9-19, 20, 21, 22, 23, 24"
      },
      "preview": {
        "kind": "page-header-structure-map",
        "sample": "region map",
        "background": "#ffffff",
        "foreground": "#111827",
        "border": "#dbe4f0",
        "radius": "0",
        "label": "Page header structure",
        "gap": "0.5rem",
        "visibleColumnCount": 24,
        "regions": "same as value.regions"
      },
      "metadata": {
        "role": "page header structure",
        "theme": "all",
        "state": "none",
        "accessibility": "The token has no interactive behavior; later primitive and pattern layers must preserve keyboard, focus, names, status, and color-independent meaning."
      },
      "useCaseInstructions": [
        "Use as the structural source for populated page header patterns.",
        "Do not copy the legacy /design-system/tokens/page-header route CSS into consumers.",
        "Do not use for panel headers, drawer headers, card headers, or app-local toolbar rows."
      ]
    }
  ]
}
```

## Implementation Notes

The default implementation preserves the existing page-header route's region
map while moving the reusable fact into a governed runtime seam.

The default proof renders those governed regions through the existing
`token-page-header-map` and `data-page-header-span` route classes. The token
does not create a second track template; the existing page-header map remains
the rendered proof source for column placement and collapse behavior.

The proof grid sits inside a named `token-foundation-header` container host so
the existing responsive container queries can collapse visible columns and make
the single mobile column fill the available width.

The token does not approve populated copy, badges, actions, keyboard behavior,
or status semantics. Those remain blocked until primitive and pattern layers
consume this seam.
