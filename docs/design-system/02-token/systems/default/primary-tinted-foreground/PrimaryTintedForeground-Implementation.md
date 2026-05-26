# Primary Tinted Foreground Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `primary-tinted-foreground` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/primary-tinted-foreground/PrimaryTintedForeground-Contract.md` |
| Proposed design-system URL | `/design-system/default/tokens/primary-tinted-foreground` |
| System implementation path | `docs/design-system/02-token/systems/default/primary-tinted-foreground/PrimaryTintedForeground-Implementation.md` |
| Files affected now | `docs/design-system/02-token/systems/default/primary-tinted-foreground/PrimaryTintedForeground-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Primary-tinted surfaces need approved readable foreground text before primitives can place labels on them. |
| Token category | `primary-tinted-foreground` using the `text-color` token-type template |
| Token job | Govern short-label foreground values paired with `primary-tinted-background`. |
| Non-goals | This TokenDefinitionArtifact does not define general body text, links, selected state, status colors, primitive behavior, component APIs, app wrappers, or app adoption. |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "primary-tinted-foreground",
  "tokenType": "primary-tinted-foreground",
  "status": "review-ready",
  "tokenContractPath": "docs/design-system/02-token/shared/primary-tinted-foreground/PrimaryTintedForeground-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/primary-tinted-foreground/PrimaryTintedForeground-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/primary-tinted-foreground",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/primary-tinted-foreground/index.html",
    "title": "Primary Tinted Foreground Tokens"
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/contracts/tokens/primaryTintedForeground.contract.mjs",
    "contractExport": "primaryTintedForegroundTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/primary-tinted-foreground/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/primaryTintedForeground.tokens.mjs",
    "systemTokenExport": "primaryTintedForegroundTokenSpec"
  },
  "sourceToken": "tokens.primary-tinted-background",
  "variants": [
    {
      "id": "primary-tinted-foreground-original",
      "tokenName": "--primary-tinted-foreground-original",
      "backgroundTokenName": "--primary-tinted-background-original",
      "sourceTokenName": "--primary-color-source-original",
      "sourceColorValue": "#635bff",
      "backgroundFormula": "color-mix(in srgb, <primary-color-source> 12%, white)",
      "colorValueOrMapping": "color-mix(in srgb, #635bff 48%, #111827)",
      "foregroundFormula": "color-mix(in srgb, <--primary-color-source-original> 48%, #111827)",
      "themeMapping": "original"
    },
    {
      "id": "primary-tinted-foreground-dark",
      "tokenName": "--primary-tinted-foreground-dark",
      "backgroundTokenName": "--primary-tinted-background-dark",
      "sourceTokenName": "--primary-color-source-dark",
      "sourceColorValue": "#8b87ff",
      "backgroundFormula": "color-mix(in srgb, <primary-color-source> 16%, #171b22)",
      "colorValueOrMapping": "color-mix(in srgb, #8b87ff 22%, #f4f7fb)",
      "foregroundFormula": "color-mix(in srgb, <--primary-color-source-dark> 22%, #f4f7fb)",
      "themeMapping": "dark"
    },
    {
      "id": "primary-tinted-foreground-desert",
      "tokenName": "--primary-tinted-foreground-desert",
      "backgroundTokenName": "--primary-tinted-background-desert",
      "sourceTokenName": "--primary-color-source-desert",
      "sourceColorValue": "#9f5f24",
      "backgroundFormula": "color-mix(in srgb, <primary-color-source> 12%, #fffaf0)",
      "colorValueOrMapping": "color-mix(in srgb, #9f5f24 38%, #493327)",
      "foregroundFormula": "color-mix(in srgb, <--primary-color-source-desert> 38%, #493327)",
      "themeMapping": "desert"
    }
  ]
}
```

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `docs/design-system/02-token/token-readiness-index.md`; `primary-color-source`; `primary-tinted-background`; `text-color` template |
| Existing token covers need | `no` |
| Reuse decision | Define `primary-tinted-foreground` as a narrow derived text token instead of promoting general `text-color`. |
| Duplication risk | Without this token, later primitives can choose local text colors on primary-tinted surfaces. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required background dependency | `tokens.primary-tinted-background` |
| shared contract | Required role | `primary foreground on primary tint` |
| system implementation | original foreground | `color-mix(in srgb, #635bff 48%, #111827)` on `--primary-tinted-background-original` |
| system implementation | dark foreground | `color-mix(in srgb, #8b87ff 22%, #f4f7fb)` on `--primary-tinted-background-dark` |
| system implementation | desert foreground | `color-mix(in srgb, #9f5f24 38%, #493327)` on `--primary-tinted-background-desert` |
| system implementation | state meaning | `none`; this token is not selected, active, status, validation, or link meaning. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/primary-tinted-foreground` |
| Token contract module | `src/frontend/designSystem/contracts/tokens/primaryTintedForeground.contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/primary-tinted-foreground/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/primaryTintedForeground.tokens.mjs` |
| Source token module | `src/frontend/designSystem/systems/default/tokens/proofs/primaryTintedBackground.tokens.mjs` |
| Token spec export | `primaryTintedForegroundTokenSpec` |
| Rendered view | `/design-system/default/tokens/primary-tinted-foreground` |
| Diagnostic control | Temporary upstream primary HEX override for rendered source, tint, and foreground previews only. It must not mutate signed token formulas. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| pairing | Prove each foreground declares and renders on the matching `primary-tinted-background` variant. |
| source derivation | Prove each foreground records its primary source token, source value, background formula, and foreground formula. |
| dependency override | Prove changing the temporary upstream HEX updates rendered source, tint, and foreground previews without changing signed token formulas. |
| themes | Render original, dark, and desert foreground samples separately. |
| direction | Prove LTR and RTL rendering preserve readable text samples and card labels. |
| magnification | Prove foreground details remain readable and non-overlapping at tested viewports. |
| accessibility | Record that this token is not selected, status, validation, or link meaning. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for primitives that need short primary labels on primary-tinted backgrounds` |
| Reason | The foreground/background pairing is now governed for the `default` system. |
