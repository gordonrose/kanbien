# Good TokenDefinitionArtifact Example

This example is intentionally small. A real artifact may include more variants,
but every variant must use the same deterministic structure.

## Token Metadata

| Field | Value |
| --- | --- |
| Design system | `default` |
| UI family | `colours` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/02-token/colours/behaviour-rules/Colours-Behaviour.md` |
| Existing design-system URL | `/design-system/tokens/colours` |
| Proposed design-system URL | `/design-system/default/tokens/colours` |
| TokenDefinitionArtifact path | `docs/design-system/02-token/colours/tokens/Colours-Tokens.md` |
| Files affected now | `docs/design-system/02-token/colours/tokens/Colours-Tokens.md` |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "designSystem": "default",
  "uiFamily": "colours",
  "tokenType": "color-palette",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/02-token/colours/behaviour-rules/Colours-Behaviour.md",
  "tokenDefinitionPath": "docs/design-system/02-token/colours/tokens/Colours-Tokens.md",
  "page": {
    "route": "/design-system/default/tokens/colours",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/colours/index.html",
    "title": "Colours Tokens",
    "description": "Review governed color palette tokens before semantic mapping or downstream consumption."
  },
  "codeSeam": {
    "systemTokenModule": "src/frontend/designSystem/systems/default/tokens/definitions/colours.tokens.mjs",
    "systemTokenExport": "coloursTokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["02-token", "03-primitive", "04-pattern-contract"]
  },
  "variants": [
    {
      "id": "colour-primary-500",
      "tokenName": "--colour-primary-500",
      "value": "#635bff",
      "preview": {
        "kind": "color-swatch",
        "sample": "#635bff",
        "background": "surface-default",
        "foreground": "text-primary"
      },
      "metadata": {
        "role": "primary accent midpoint",
        "theme": "default",
        "state": "none",
        "accessibility": "Must not be the only carrier of selected or active meaning."
      },
      "useCaseInstructions": [
        "Allowed: semantic color mapping and token review surfaces.",
        "Forbidden: direct app-local styling without semantic mapping."
      ]
    }
  ]
}
```

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The colours family must separate palette foundations from semantic meaning across default, dark, and desert themes. |
| Token category | `color-palette` |
| Token job | Govern color palette variants before semantic color mapping. |
| Non-goals | This artifact does not define swatch layout, component APIs, demo routes, or app adoption. |

## Token Variants

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `colour-primary-500` | color swatch `#635bff` | default theme, no state, primary accent midpoint | Allowed for semantic mapping and token review; forbidden for direct app-local styling. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/colours` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/colours/index.html` |
| System token module | `src/frontend/designSystem/systems/default/tokens/definitions/colours.tokens.mjs` |
| Token spec export | `coloursTokenSpec` |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | token pages, primitives, and patterns |

## Why This Passes

This example records the upstream behavior need, uses a predefined
`color-palette` structure, includes a parseable spec block, defines a default
token page route, names the reusable code seam, and gives each variant preview,
metadata, and use-case instructions.
