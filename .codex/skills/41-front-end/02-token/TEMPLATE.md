# <UI Family Name> Tokens

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `<system-key>` |
| UI family | `<ui-family-name>` |
| Harness layer | `02-token` |
| Token status | `<draft | review-ready | accepted | blocked>` |
| Behavior rule path | `<path-to-layer-1-behavior-rule>` |
| Existing design-system URL | `<url-or-none>` |
| Proposed design-system URL | `<url-or-none>` |
| Shared token contract path | `docs/design-system/02-token/shared/<token-type-or-family>/<TokenType>-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/<system-key>/<token-type-or-family>/<TokenType>-Implementation.md` |
| Files affected now | `<contract-path-and-or-system-implementation-path>` |

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

System implementation artifacts that define concrete token values, proof-route
data, or governed runtime seams must include exactly one `tokenDefinitionV1`
JSON block.

The block is the source that can be translated into the token page, system
proof module, and reusable runtime seam without LLM interpretation.

Shared token contracts do not need this block unless they are intentionally
combined with a system implementation, which should be avoided by default.

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "<implementation-system-key>",
  "uiFamily": "<ui-family-name>",
  "tokenType": "<token-type-key>",
  "status": "<draft | review-ready | accepted | blocked>",
  "behaviorRulePath": "<path-to-layer-1-behavior-rule>",
  "tokenContractPath": "docs/design-system/02-token/shared/<token-type-or-family>/<TokenType>-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/<system-key>/<token-type-or-family>/<TokenType>-Implementation.md",
  "page": {
    "route": "/design-system/<system-key>/tokens/<token-type-or-family>",
    "htmlPath": "src/frontend/designSystem/systems/<system-key>/tokens/<token-type-or-family>/index.html",
    "title": "<page-title>",
    "description": "<one-sentence-review-purpose>"
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/layers/02-token/<token-type-or-family>/contract.mjs",
    "contractExport": "<camelCaseTokenContractExport>",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/<token-type-or-family>/systems/<system-key>.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/<system-key>/tokens/proofs/<token-type-or-family>.tokens.mjs",
    "systemTokenExport": "<camelCaseTokenSpecExport>",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["02-token", "03-primitive", "04-pattern-contract"]
  },
  "dependencies": [
    {
      "contractId": "<upstream-contract-id-or-none>",
      "variantId": "<upstream-variant-id-or-none>",
      "tokenName": "<upstream-token-name-or-none>",
      "value": "<upstream-value-or-none>",
      "relationship": "<derived-from | paired-with | aliases | none>"
    }
  ],
  "diagnostic": {
    "kind": "<dependency-hex-override | none>",
    "rule": "<what the temporary rendered override may change and what it must not mutate>"
  },
  "variants": [
    {
      "id": "<stable-variant-id>",
      "tokenName": "<token-name>",
      "value": "<token-value-or-mapping>",
      "derivation": {
        "sourceTokenName": "<upstream-token-name-or-none>",
        "sourceValue": "<upstream-value-or-none>",
        "formulaOrMapping": "<formula-mapping-or-none>",
        "renderedValue": "<final-value-shown-in-proof>"
      },
      "preview": {
        "kind": "<token-type-preview-kind>",
        "sample": "<sample-value-or-text>",
        "background": "<background-token-or-none>",
        "foreground": "<foreground-token-or-none>"
      },
      "metadata": {
        "role": "<variant-role>",
        "theme": "<original | dark | desert | all>",
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

Use only the rows and columns needed for the token category. Classify each
decision as shared contract or system implementation.

| Scope | Token Decision | Value |
| --- | --- | --- |
| `<shared contract | system implementation>` | `<token name, role, mapping, value, or rule>` | `<approved value or rule>` |

## Dependency Chain

Complete this section for derived, paired, aliased, or source-dependent tokens.
If the token is standalone, state `none` and why.

| Field | Value |
| --- | --- |
| Upstream contract | `<contract-id-or-none>` |
| Upstream variant or token | `<variant-id-or-token-name-or-none>` |
| Upstream value | `<source-value-or-none>` |
| Formula or mapping | `<formula-or-mapping-or-none>` |
| Final rendered value | `<computed-or-signed-rendered-value>` |
| What changes when upstream changes | `<rendered output or not-applicable reason>` |
| What must not change | `<signed token values, behavior contract, accessibility contract, or not-applicable>` |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/<token-type-or-family>/contract.mjs` |
| Required roles or fields | `<roles, fields, or not-applicable reason>` |
| Cross-system consumer rule | `<what every design-system implementation and downstream consumer must preserve>` |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `<system-key>` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/<token-type-or-family>/systems/<system-key>.mjs` |
| System proof module | `src/frontend/designSystem/systems/<system-key>/tokens/proofs/<token-type-or-family>.tokens.mjs` |
| System token export | `<camelCaseTokenSpecExport>` |
| System page route | `/design-system/<system-key>/tokens/<token-type-or-family>` |
| System proof status | `<draft | review-ready | accepted | blocked>` |

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
| Token contract module | `src/frontend/designSystem/layers/02-token/<token-type-or-family>/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/<token-type-or-family>/systems/<system-key>.mjs` |
| System proof module | `src/frontend/designSystem/systems/<system-key>/tokens/proofs/<token-type-or-family>.tokens.mjs` |
| Token spec export | `<camelCaseTokenSpecExport>` |
| Token variant section description | `<token-specific sentence used by the shared renderer above the variant list>` |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | `<token pages through proof modules; primitives and later layers through governed runtime modules; or blocked>` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `<exact /design-system/<system-key>/tokens/<token-type-or-family> route, or none>` |
| Rendered view status | `<available | blocked | not-created-for-docs-only>` |
| Dependency chain visible | `<yes | no | not-applicable>` |
| Diagnostic override | `<available | not-applicable | blocked>` |
| Diagnostic override scope | `<what temporary rendered proof values may change, or not-applicable>` |
| If unavailable | `<blocker or not-applicable reason>` |

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
| dependency rendering | `<source chain, formula or mapping, diagnostic override, or not-applicable reason>` |

## Consumer Restrictions

Consumers must not hard-code values that this TokenDefinitionArtifact governs.

Consumers must not recreate this token decision with route-local CSS.

Consumers must not bypass allowed-consumer rules by copying demo styles,
screenshots, or generated markup.

Consumers must not weaken the accessibility requirements recorded here.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared contract at | `docs/design-system/02-token/shared/<token-type-or-family>/<TokenType>-Contract.md` |
| Store system implementation at | `docs/design-system/02-token/systems/<system-key>/<token-type-or-family>/<TokenType>-Implementation.md` |
| Shared contract lookup key | `shared/<ui-family-name>/02-token-contract` |
| System implementation lookup key | `<system-key>/<ui-family-name>/02-token-implementation` |
| How later layers consume it | Later layers read this TokenDefinitionArtifact by path or stable lookup keys before making primitive, pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve the shared token contract, implementation system, deterministic token spec, approved token decisions, variants, page route, code seam, allowed consumers, required evidence, and consumer restrictions unless a token revision is approved. |
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
