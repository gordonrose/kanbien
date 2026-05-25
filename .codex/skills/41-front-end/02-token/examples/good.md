# Good TokenDefinitionArtifact Example

This example is intentionally small. A real artifact may include more variants,
but every variant must use the same deterministic structure.

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `colours` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md` |
| Existing design-system URL | `/design-system/tokens/colours` |
| Proposed design-system URL | `/design-system/default/tokens/colours` |
| Shared token contract path | `docs/design-system/02-token/shared/colours/Colours-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/colours/Colours-Implementation.md` |
| Files affected now | `docs/design-system/02-token/shared/colours/Colours-Contract.md`; `docs/design-system/02-token/systems/default/colours/Colours-Implementation.md` |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "colours",
  "tokenType": "color-palette",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/colours/Colours-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/colours/Colours-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/colours",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/colours/index.html",
    "title": "Colours Tokens",
    "description": "Review governed color palette tokens before semantic mapping or downstream consumption."
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/contracts/tokens/colours.contract.mjs",
    "contractExport": "coloursTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/colours/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/colours.tokens.mjs",
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
        "theme": "original",
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
| Source behavior need | The colours family must separate palette foundations from semantic meaning across original, dark, and desert themes. |
| Token category | `color-palette` |
| Token job | Govern color palette variants before semantic color mapping. |
| Non-goals | This artifact does not define swatch layout, component APIs, demo routes, or app adoption. |

## Token Variants

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `colour-primary-500` | color swatch `#635bff` | original theme, no state, primary accent midpoint | Allowed for semantic mapping and token review; forbidden for direct app-local styling. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/colours` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/colours/index.html` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/colours/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/colours.tokens.mjs` |
| Token spec export | `coloursTokenSpec` |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | token pages, primitives, and patterns |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/contracts/tokens/colours.contract.mjs` |
| Required roles or fields | Variant id, token name, preview, metadata, and use-case instructions. |
| Cross-system consumer rule | Every design system must preserve token identity and usage constraints before downstream layers consume palette tokens. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/colours/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/colours.tokens.mjs` |
| System token export | `coloursTokenSpec` |
| System page route | `/design-system/default/tokens/colours` |
| System proof status | `review-ready` |

## Why This Passes

This example records the upstream behavior need, separates the shared contract
from the `default` implementation, uses a predefined `color-palette` structure,
includes a parseable spec block, defines a `default` system token page route,
names the reusable code seam, and gives each variant preview, metadata, and
use-case instructions.
