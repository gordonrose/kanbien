# <UI Family Name> Tokens

## Token Metadata

| Field | Value |
| --- | --- |
| Design system | `<system-key>` |
| UI family | `<ui-family-name>` |
| Harness layer | `02-token` |
| Token status | `<draft | review-ready | accepted | blocked>` |
| Behavior rule path | `<path-to-layer-1-behavior-rule>` |
| Existing design-system URL | `<url-or-none>` |
| Proposed design-system URL | `<url-or-none>` |
| TokenDefinitionArtifact path | `<path>` |
| Files affected now | `<token-definition-artifact-path-only>` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | `<behavior-rule need this token satisfies>` |
| Token category | `<color | typography | spacing | focus | surface | sizing | motion | layout | other>` |
| Token job | `<what reusable value decision this TokenDefinitionArtifact governs>` |
| Non-goals | `<later-layer or out-of-scope decisions>` |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Deterministic Token Spec

The TokenDefinitionArtifact must include exactly one `tokenDefinitionV1` JSON block.

The block is the source that can be translated into the token page and reusable
code seam without LLM interpretation.

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "designSystem": "<system-key>",
  "uiFamily": "<ui-family-name>",
  "tokenType": "<token-type-key>",
  "status": "<draft | review-ready | accepted | blocked>",
  "behaviorRulePath": "<path-to-layer-1-behavior-rule>",
  "tokenDefinitionPath": "<path>",
  "page": {
    "route": "/design-system/<system-key>/tokens/<token-type-or-family>",
    "htmlPath": "src/frontend/designSystem/systems/<system-key>/tokens/<token-type-or-family>/index.html",
    "title": "<page-title>",
    "description": "<one-sentence-review-purpose>"
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/contracts/tokens/<token-type-or-family>.contract.mjs",
    "contractExport": "<camelCaseTokenContractExport>",
    "systemTokenModule": "src/frontend/designSystem/systems/<system-key>/tokens/definitions/<token-type-or-family>.tokens.mjs",
    "systemTokenExport": "<camelCaseTokenSpecExport>",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["02-token", "03-primitive", "04-pattern-contract"]
  },
  "variants": [
    {
      "id": "<stable-variant-id>",
      "tokenName": "<token-name>",
      "value": "<token-value-or-mapping>",
      "preview": {
        "kind": "<token-type-preview-kind>",
        "sample": "<sample-value-or-text>",
        "background": "<background-token-or-none>",
        "foreground": "<foreground-token-or-none>"
      },
      "metadata": {
        "role": "<variant-role>",
        "theme": "<default | dark | desert | all>",
        "state": "<state-or-none>",
        "accessibility": "<required-accessibility-note>"
      },
      "useCaseInstructions": [
        "<allowed-use>",
        "<forbidden-or-cautionary-use>"
      ]
    }
  ]
}
```

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `<accepted | review-ready | blocked>` |
| Required behavior preserved | `<plain-language behavior this token supports>` |
| Required review dimensions | `<dimensions carried forward from behavior rule>` |
| Token blocker from behavior rule | `<blocker-or-none>` |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `<source files, docs, route, or missing>` |
| Existing token covers need | `<yes | no | partial | unknown>` |
| Reuse decision | `<reuse existing token, define new token, revise existing token, or blocked>` |
| Duplication risk | `<how this avoids duplicate or renamed token drift>` |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | `<token-type-templates/<token-type>.md>` |
| Drift or product failure prevented | `<what can go wrong if this token type is underspecified>` |
| Reference basis | `<WCAG, DTCG, mature design systems, repo precedent, or none yet>` |
| Behavior-changing fields | `<fields downstream consumers may rely on>` |
| Evidence-only fields | `<fields used for review proof but not as runtime contract>` |
| Over-structure avoided | `<fields, states, tables, or schemas deliberately not added>` |

## Approved Token Decisions

Use only the rows and columns needed for the token category.

| Token Decision | Value |
| --- | --- |
| `<token name, role, mapping, or rule>` | `<approved value or rule>` |

## Token Variants

Every variant from `tokenDefinitionV1.variants` must be represented here for
human review.

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `<stable-variant-id>` | `<preview kind and sample>` | `<role, theme, state, accessibility>` | `<allowed and forbidden use>` |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/<system-key>/tokens/<token-type-or-family>` |
| Required page file | `src/frontend/designSystem/systems/<system-key>/tokens/<token-type-or-family>/index.html` |
| Token contract module | `src/frontend/designSystem/contracts/tokens/<token-type-or-family>.contract.mjs` |
| System token module | `src/frontend/designSystem/systems/<system-key>/tokens/definitions/<token-type-or-family>.tokens.mjs` |
| Token spec export | `<camelCaseTokenSpecExport>` |
| Token variant section description | `<token-specific sentence used by the shared renderer above the variant list>` |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | `<token pages, primitives, patterns, or blocked>` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `<consumer layer or seam>` | `<allowed, denied, or conditional usage rule>` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| themes | `<required theme proof>` |
| direction | `<required RTL/LTR proof or not applicable reason>` |
| magnification | `<required zoom proof>` |
| density or constrained layout | `<required proof or not applicable reason>` |
| accessibility | `<contrast, focus, target-size, motion, text, or color-independent proof>` |

## Consumer Restrictions

Consumers must not hard-code values that this TokenDefinitionArtifact governs.

Consumers must not recreate this token decision with route-local CSS.

Consumers must not bypass allowed-consumer rules by copying demo styles,
screenshots, or generated markup.

Consumers must not weaken the accessibility requirements recorded here.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this TokenDefinitionArtifact at | `<path>` |
| Stable lookup key | `<system-key>/<ui-family-name>/02-token` |
| How later layers consume it | Later layers read this TokenDefinitionArtifact by path or stable lookup key before making primitive, pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve the deterministic token spec, approved token decisions, variants, page route, code seam, allowed consumers, required evidence, and consumer restrictions unless a token revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance TokenDefinitionArtifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `02-token` | `<accept, revise, or block this TokenDefinitionArtifact>` | `<reason-or-none>` |
| 2 | `<next-layer>` | `<next foundation action>` | `<reason-or-none>` |
| 3 | `<later-layer-or-none>` | `<later action that must wait>` | `<reason-or-none>` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `<layer-name>` |
| Next layer status | `<allowed | blocked | scaffold-only>` |
| Reason | `<why this is the next step>` |
