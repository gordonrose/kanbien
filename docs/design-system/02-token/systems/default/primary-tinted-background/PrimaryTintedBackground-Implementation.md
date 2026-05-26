# Primary Tinted Background Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `primary-tinted-background` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/primary-tinted-background/PrimaryTintedBackground-Contract.md` |
| Existing design-system URL | `none` |
| Proposed design-system URL | `/design-system/default/tokens/primary-tinted-background` |
| System implementation path | `docs/design-system/02-token/systems/default/primary-tinted-background/PrimaryTintedBackground-Implementation.md` |
| Files affected now | `docs/design-system/02-token/systems/default/primary-tinted-background/PrimaryTintedBackground-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Entity body descendants need low-emphasis primary context without using raw primary colors or redefining background tints locally. |
| Token category | `primary-tinted-background` |
| Token job | Govern primary-tinted background variants derived from `primary-color-source` before primitives or patterns consume primary-tinted surfaces. |
| Non-goals | This TokenDefinitionArtifact does not define selected state, active state, warning, error, success, validation, text-color tokens, primitive behavior, pattern structure, component APIs, app wrappers, or app adoption. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, product workflow behavior, or
semantic state meaning.

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "primary-tinted-background",
  "tokenType": "primary-tinted-background",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/primary-tinted-background/PrimaryTintedBackground-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/primary-tinted-background/PrimaryTintedBackground-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/primary-tinted-background",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/primary-tinted-background/index.html",
    "title": "Primary Tinted Background Tokens"
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/layers/02-token/primary-tinted-background/contract.mjs",
    "contractExport": "primaryTintedBackgroundTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/primary-tinted-background/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/primaryTintedBackground.tokens.mjs",
    "systemTokenExport": "primaryTintedBackgroundTokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["02-token", "03-primitive", "04-pattern-contract"]
  },
  "diagnostic": {
    "kind": "dependency-hex-override",
    "dependency": "tokens.primary-color-source",
    "defaultHex": "#635bff",
    "rule": "Temporary preview override may update rendered dependency and tint previews, but must not mutate tokenDefinitionV1.variants or signed system values."
  },
  "sourceToken": "tokens.primary-color-source",
  "variants": [
    {
      "id": "primary-tinted-background-original",
      "tokenName": "--primary-tinted-background-original",
      "sourceTokenName": "--primary-color-source-original",
      "sourceColorValue": "#635bff",
      "backgroundValue": "color-mix(in srgb, #635bff 12%, white)",
      "foregroundPairing": "text-primary",
      "themeMapping": "original"
    },
    {
      "id": "primary-tinted-background-dark",
      "tokenName": "--primary-tinted-background-dark",
      "sourceTokenName": "--primary-color-source-dark",
      "sourceColorValue": "#8b87ff",
      "backgroundValue": "color-mix(in srgb, #8b87ff 16%, #171b22)",
      "foregroundPairing": "text-inverse",
      "themeMapping": "dark"
    },
    {
      "id": "primary-tinted-background-desert",
      "tokenName": "--primary-tinted-background-desert",
      "sourceTokenName": "--primary-color-source-desert",
      "sourceColorValue": "#9f5f24",
      "backgroundValue": "color-mix(in srgb, #9f5f24 12%, #fffaf0)",
      "foregroundPairing": "text-primary",
      "themeMapping": "desert"
    }
  ]
}
```

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `docs/design-system/02-token/token-readiness-index.md`; `primary-color-source`; `background-color`; `focus-ring` |
| Existing token covers need | `no` |
| Reuse decision | Define `primary-tinted-background` as a derived background token rather than changing neutral `background-color` foundations. |
| Duplication risk | Without this token, later primitives can copy primary tint formulas locally or use raw primary colors as backgrounds. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required source dependency | `tokens.primary-color-source` |
| shared contract | Required role | `primary tinted subtle background` |
| system implementation | original tint | `color-mix(in srgb, #635bff 12%, white)` |
| system implementation | dark tint | `color-mix(in srgb, #8b87ff 16%, #171b22)` |
| system implementation | desert tint | `color-mix(in srgb, #9f5f24 12%, #fffaf0)` |
| system implementation | state meaning | `none`; this token is not selected, active, status, or validation meaning. |

Every theme variant denies selected, active, warning, error, success, and
validation meaning. Theme-specific evidence must not be aliased across themes.

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/primary-tinted-background` |
| Token contract module | `src/frontend/designSystem/layers/02-token/primary-tinted-background/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/primary-tinted-background/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/primaryTintedBackground.tokens.mjs` |
| Source token module | `src/frontend/designSystem/systems/default/tokens/proofs/primaryColorSource.tokens.mjs` |
| Token spec export | `primaryTintedBackgroundTokenSpec` |
| Diagnostic control | Temporary upstream primary HEX override for rendered dependency and tint previews only. It must not mutate signed token values. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| derivation | Prove each tint declares and consumes the matching `primary-color-source` variant. |
| dependency override | Prove changing the temporary upstream HEX updates rendered dependency and tint previews without changing signed token values. |
| themes | Render original, dark, and desert tints separately. |
| direction | Prove LTR and RTL rendering preserve tint meaning and card readability. |
| magnification | Prove tint details remain readable and non-overlapping at tested viewports. |
| accessibility | Record that text-bearing use still requires an approved foreground token pairing. |

## Consumer Restrictions

Consumers must not hard-code values that this TokenDefinitionArtifact governs.

Consumers must not use this token as selected, active, warning, error, success,
or validation meaning.

Consumers must not place text on this tint without an approved foreground token
pairing in the consuming primitive or pattern.

Consumers must not recreate this token decision with route-local CSS.

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` or `03-primitive` |
| Next layer status | `allowed for background-tint consumption, blocked for text-bearing proof until foreground/text tokens exist` |
| Reason | This token governs a derived background, but not the readable text color or semantic state behavior that may sit on top of it. |
