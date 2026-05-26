# Primary Color Source Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `primary-color-source` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md` |
| Existing design-system URL | `none` |
| Proposed design-system URL | `/design-system/default/tokens/primary-color-source` |
| System implementation path | `docs/design-system/02-token/systems/default/primary-color-source/PrimaryColorSource-Implementation.md` |
| Files affected now | `docs/design-system/02-token/systems/default/primary-color-source/PrimaryColorSource-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The entity-body placement rule exposes controls, labels, focus states, selected states, and nested surfaces that need related color decisions without local literals. |
| Token category | `primary-color-source` using the `color-palette` token-type template |
| Token job | Govern the default design system's root primary accent source before downstream color tokens derive text, focus, selected, or subtle-background values from it. |
| Non-goals | This TokenDefinitionArtifact does not define readable text colors, focus behavior, selected states, semantic status colors, primitives, pattern anatomy, component APIs, demo routes, canonical files, app wrappers, or app adoption. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, product workflow behavior, or
derived semantic color roles.

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "primary-color-source",
  "tokenType": "primary-color-source",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/primary-color-source/PrimaryColorSource-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/primary-color-source",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/primary-color-source/index.html",
    "title": "Primary Color Source Tokens",
    "description": "Review governed primary source-color variants before downstream color tokens derive visual roles from them."
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/contracts/tokens/primaryColorSource.contract.mjs",
    "contractExport": "primaryColorSourceTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/primary-color-source/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/primaryColorSource.tokens.mjs",
    "systemTokenExport": "primaryColorSourceTokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["02-token", "03-primitive", "04-pattern-contract"]
  },
  "diagnostic": {
    "kind": "primary-color-source-override",
    "defaultHex": "#635bff",
    "rule": "Temporary preview override may update rendered source, subtle-background, label, and focus-ring previews, but must not mutate tokenDefinitionV1.variants or signed system values."
  },
  "variants": [
    {
      "id": "primary-color-source-original",
      "tokenName": "--primary-color-source-original",
      "value": {
        "paletteRole": "primary color source",
        "scaleStep": "source",
        "colorValue": "#635bff",
        "colorSpace": "srgb",
        "themeMapping": "original",
        "allowedDerivations": "May be referenced by governed text, focus, selected, and subtle-background tokens after those tokens prove their own accessibility requirements."
      },
      "preview": {
        "kind": "color-swatch",
        "background": "#635bff",
        "foreground": "#ffffff"
      },
      "metadata": {
        "paletteRole": "primary color source",
        "theme": "original",
        "state": "source",
        "accessibility": "This source value alone does not prove readable text or state meaning."
      },
      "useCaseInstructions": [
        "Use as the default design system's original-theme primary source for downstream governed color derivations.",
        "Do not use directly as body text, selected state, validation, warning, error, or success meaning.",
        "Do not copy this literal into app CSS or route-local styling."
      ]
    },
    {
      "id": "primary-color-source-dark",
      "tokenName": "--primary-color-source-dark",
      "value": {
        "paletteRole": "primary color source",
        "scaleStep": "source",
        "colorValue": "#8b87ff",
        "colorSpace": "srgb",
        "themeMapping": "dark",
        "allowedDerivations": "May be referenced by governed dark-theme text, focus, selected, and subtle-background tokens after those tokens prove their own accessibility requirements."
      },
      "preview": {
        "kind": "color-swatch",
        "background": "#8b87ff",
        "foreground": "#111827"
      },
      "metadata": {
        "paletteRole": "primary color source",
        "theme": "dark",
        "state": "source",
        "accessibility": "Dark theme derivations must be reviewed separately from original theme derivations."
      },
      "useCaseInstructions": [
        "Use as the default design system's dark-theme primary source for downstream governed color derivations.",
        "Do not alias dark-theme contrast evidence to original-theme evidence.",
        "Do not copy this literal into app CSS or route-local styling."
      ]
    },
    {
      "id": "primary-color-source-desert",
      "tokenName": "--primary-color-source-desert",
      "value": {
        "paletteRole": "primary color source",
        "scaleStep": "source",
        "colorValue": "#9f5f24",
        "colorSpace": "srgb",
        "themeMapping": "desert",
        "allowedDerivations": "May be referenced by governed desert-theme text, focus, selected, and subtle-background tokens after those tokens prove their own accessibility requirements."
      },
      "preview": {
        "kind": "color-swatch",
        "background": "#9f5f24",
        "foreground": "#fffaf0"
      },
      "metadata": {
        "paletteRole": "primary color source",
        "theme": "desert",
        "state": "source",
        "accessibility": "Desert theme derivations must be reviewed separately from original and dark theme derivations."
      },
      "useCaseInstructions": [
        "Use as the default design system's desert-theme primary source for downstream governed color derivations.",
        "Do not alias desert-theme contrast evidence to original or dark theme evidence.",
        "Do not copy this literal into app CSS or route-local styling."
      ]
    }
  ]
}
```

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Required behavior preserved | Full-page and embedded entity bodies keep stable behavior while design-system appearance may vary. |
| Required review dimensions | right-to-left, zoomed in 150%, zoomed out 75%, dark theme, desert theme, dark theme with error, desert theme with error |
| Token blocker from behavior rule | Related color decisions need a governed source before text, focus, selected, and subtle-background tokens can derive from a single switchable primary family. |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `docs/design-system/02-token/token-readiness-index.md`; `docs/design-system/02-token/shared`; `docs/design-system/02-token/systems/default`; `src/frontend/designSystem/layers/02-token`; `src/frontend/designSystem/contracts/tokens` |
| Existing token covers need | `no` |
| Reuse decision | Use the existing `color-palette` token-type template to define a smaller signed `primary-color-source` token family. |
| Duplication risk | Without this source token, future text, focus, selected, and subtle-background tokens can drift into unrelated primary values. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | `token-type-templates/color-palette.md` |
| Drift or product failure prevented | Prevents future color tokens and primitives from inventing unrelated primary/accent literals. |
| Reference basis | Existing color-palette template plus the design-system switchability requirement that visual skins may vary while contracts stay stable. |
| Behavior-changing fields | `paletteRole`, `scaleStep`, `colorValue`, `colorSpace`, `themeMapping`, `allowedDerivations` |
| Evidence-only fields | `preview`, `metadata.accessibility`, and use-case instruction text help review the token but do not prove contrast or primitive behavior. |
| Over-structure avoided | No full color scale, no semantic status roles, no text contrast token, no selected-state token, and no primitive states are defined here. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required source role | `primary color source` |
| shared contract | Required themes | `original`, `dark`, `desert` |
| shared contract | Required value fields | `paletteRole`, `scaleStep`, `colorValue`, `colorSpace`, `themeMapping`, `allowedDerivations` |
| system implementation | `default` original source | `#635bff` |
| system implementation | `default` dark source | `#8b87ff` |
| system implementation | `default` desert source | `#9f5f24` |
| system implementation | derivation rule | Downstream color tokens may reference this source, but must prove their own accessibility and consumer contracts. |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/contracts/tokens/primaryColorSource.contract.mjs` |
| Required roles or fields | Role: `primary color source`; fields: `paletteRole`, `scaleStep`, `colorValue`, `colorSpace`, `themeMapping`, `allowedDerivations` |
| Cross-system consumer rule | Every design system must preserve an approved primary source role before downstream derived color tokens consume it. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/primary-color-source/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/primaryColorSource.tokens.mjs` |
| System token export | `primaryColorSourceTokenSpec` |
| System page route | `/design-system/default/tokens/primary-color-source` |
| System proof status | `review-ready` |
| Diagnostic control | Temporary HEX override for rendered source and derived previews only. It must not mutate signed token values. |

## Token Variants

Every variant from `tokenDefinitionV1.variants` must be represented here for
human review.

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `primary-color-source-original` | source swatch `#635bff` | original theme, source state | Use as original-theme source; do not use directly as state meaning or app CSS literal. |
| `primary-color-source-dark` | source swatch `#8b87ff` | dark theme, source state | Use as dark-theme source; do not alias contrast evidence to original theme. |
| `primary-color-source-desert` | source swatch `#9f5f24` | desert theme, source state | Use as desert-theme source; do not alias contrast evidence to other themes. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/primary-color-source` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/primary-color-source/index.html` |
| Token contract module | `src/frontend/designSystem/contracts/tokens/primaryColorSource.contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/primary-color-source/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/primaryColorSource.tokens.mjs` |
| Token spec export | `primaryColorSourceTokenSpec` |
| Token variant section description | Review source color variants before downstream color tokens derive text, focus, selected, or subtle-background roles. |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | Token pages consume the proof module; derived tokens, primitives, and later layers consume the governed runtime module after the readiness index marks this token consumable. |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `02-token` proof route | Allowed through `src/frontend/designSystem/systems/default/tokens/proofs/primaryColorSource.tokens.mjs`. |
| derived `02-token` families | Allowed when those tokens name their own contract, accessibility evidence, and derivation rule. |
| `03-primitive` | Allowed only as a source dependency for primitive-required derived tokens; this token alone does not prove contrast or state meaning. |
| `04-pattern-contract` and later | Allowed only through consuming primitives or pattern contracts that name governed token seams. |
| App-local CSS | Denied. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| themes | Render original, dark, and desert source variants separately. |
| direction | Prove source-token proof cards remain readable and operable in LTR and RTL. |
| magnification | Prove source-token proof cards remain readable at 150% zoom and non-overlapping at 75% zoom. |
| accessibility | Record that this token does not prove readable text, focus visibility, or color-only state meaning by itself. |
| diagnostic override | Prove changing the temporary HEX updates rendered diagnostic previews without changing signed token values. |

## Consumer Restrictions

Consumers must not hard-code values that this TokenDefinitionArtifact governs.

Consumers must not recreate this token decision with route-local CSS.

Consumers must not treat source-color proof as contrast proof for text, focus,
selected, validation, warning, error, or success meaning.

Consumers must not bypass allowed-consumer rules by copying demo styles,
screenshots, or generated markup.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared contract at | `docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md` |
| Store system implementation at | `docs/design-system/02-token/systems/default/primary-color-source/PrimaryColorSource-Implementation.md` |
| Shared contract lookup key | `shared/primary-color-source/02-token-contract` |
| System implementation lookup key | `default/primary-color-source/02-token-implementation` |
| How later layers consume it | Later layers read this TokenDefinitionArtifact by path or stable lookup keys before making primitive, pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve the shared token contract, implementation system, deterministic token spec, approved token decisions, variants, page route, code seam, allowed consumers, required evidence, and consumer restrictions unless a token revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance TokenDefinitionArtifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `02-token` | Treat this TokenDefinitionArtifact as the current primary-color-source Layer 2 proof after focused registry and route checks pass. | none |
| 2 | `02-token` | Define derived `text-color`, selected-state, subtle-background, or focus-ring revisions from this source where needed. | Derived tokens must prove accessibility independently. |
| 3 | `03-primitive` | Define interactive primitives after their required derived color, focus, and target-size tokens are consumable. | This source token alone is not enough for primitive visual or accessibility readiness. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `derive downstream color tokens before primitive color consumption` |
| Reason | `primary-color-source` has a shared contract, a review-ready `default` implementation seam, and proof-route evidence once the listed checks pass, but it is intentionally only the root color source. |
