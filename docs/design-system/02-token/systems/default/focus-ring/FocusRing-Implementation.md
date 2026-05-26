# Focus Ring Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `focus-ring` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` |
| Existing design-system URL | `none` |
| Proposed design-system URL | `/design-system/default/tokens/focus-ring` |
| System implementation path | `docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md` |
| Files affected now | `docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The entity-body placement rule requires focusable controls and regions to remain understandable across full-page, embedded, constrained, RTL, and mobile placements. |
| Token category | `focus-ring` |
| Token job | Govern the default design system's reusable visible-focus ring before interactive primitives consume focus styling. |
| Non-goals | This TokenDefinitionArtifact does not define keyboard behavior, focus movement, primitive states, pattern anatomy, component APIs, demo routes, canonical files, app wrappers, or app adoption. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "focus-ring",
  "tokenType": "focus-ring",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/focus-ring",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/focus-ring/index.html",
    "title": "Focus Ring Tokens",
    "description": "Review governed visible-focus ring variants, metadata, and use-case rules."
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/contracts/tokens/focusRing.contract.mjs",
    "contractExport": "focusRingTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/focusRing.tokens.mjs",
    "systemTokenExport": "focusRingTokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["02-token", "03-primitive", "04-pattern-contract"]
  },
  "variants": [
    {
      "id": "focus-ring-visible-original",
      "tokenName": "--focus-ring-visible-original",
      "value": {
        "focusRole": "visible focus ring",
        "sourceTokenId": "primary-color-source-original",
        "sourceTokenName": "--primary-color-source-original",
        "sourceColorValue": "#635bff",
        "ringValue": "0.125rem solid color-mix(in srgb, #635bff 58%, white)",
        "offsetValue": "0.125rem",
        "contrastRequirement": "Must remain visibly distinguishable against approved original page, surface, and subtle background foundations.",
        "themeMapping": "original",
        "layoutImpact": "Uses outline outside the element box and must not shift layout."
      },
      "preview": {
        "kind": "focus-ring-sample",
        "sample": "Focusable control",
        "background": "#ffffff",
        "foreground": "#0f1115"
      },
      "metadata": {
        "focusRole": "visible focus ring",
        "theme": "original",
        "state": "focus-visible",
        "layoutImpact": "no layout shift",
        "accessibility": "Keyboard focus must remain visible without relying on color as the only state carrier."
      },
      "useCaseInstructions": [
        "Use for keyboard-visible focus on governed interactive primitives in original theme.",
        "Do not use as selected, active, warning, error, or validation meaning.",
        "Do not remove browser or primitive focus behavior without a governed replacement."
      ]
    },
    {
      "id": "focus-ring-visible-dark",
      "tokenName": "--focus-ring-visible-dark",
      "value": {
        "focusRole": "visible focus ring",
        "sourceTokenId": "primary-color-source-dark",
        "sourceTokenName": "--primary-color-source-dark",
        "sourceColorValue": "#8b87ff",
        "ringValue": "0.125rem solid color-mix(in srgb, #8b87ff 58%, white)",
        "offsetValue": "0.125rem",
        "contrastRequirement": "Must remain visibly distinguishable against approved dark page and surface foundations.",
        "themeMapping": "dark",
        "layoutImpact": "Uses outline outside the element box and must not shift layout."
      },
      "preview": {
        "kind": "focus-ring-sample",
        "sample": "Focusable control",
        "background": "#171b22",
        "foreground": "#f4f7fb"
      },
      "metadata": {
        "focusRole": "visible focus ring",
        "theme": "dark",
        "state": "focus-visible",
        "layoutImpact": "no layout shift",
        "accessibility": "Dark theme focus visibility must be reviewed separately from original theme visibility."
      },
      "useCaseInstructions": [
        "Use for keyboard-visible focus on governed interactive primitives in dark theme.",
        "Do not alias focus visibility to original-theme evidence.",
        "Do not use as selected, active, warning, error, or validation meaning."
      ]
    },
    {
      "id": "focus-ring-visible-desert",
      "tokenName": "--focus-ring-visible-desert",
      "value": {
        "focusRole": "visible focus ring",
        "sourceTokenId": "primary-color-source-desert",
        "sourceTokenName": "--primary-color-source-desert",
        "sourceColorValue": "#9f5f24",
        "ringValue": "0.125rem solid color-mix(in srgb, #9f5f24 58%, white)",
        "offsetValue": "0.125rem",
        "contrastRequirement": "Must remain visibly distinguishable against approved desert page and surface foundations.",
        "themeMapping": "desert",
        "layoutImpact": "Uses outline outside the element box and must not shift layout."
      },
      "preview": {
        "kind": "focus-ring-sample",
        "sample": "Focusable control",
        "background": "#fffaf0",
        "foreground": "#493327"
      },
      "metadata": {
        "focusRole": "visible focus ring",
        "theme": "desert",
        "state": "focus-visible",
        "layoutImpact": "no layout shift",
        "accessibility": "Desert theme focus visibility must be reviewed separately from original and dark theme visibility."
      },
      "useCaseInstructions": [
        "Use for keyboard-visible focus on governed interactive primitives in desert theme.",
        "Do not alias focus visibility to original or dark theme evidence.",
        "Do not use as selected, active, warning, error, or validation meaning."
      ]
    }
  ]
}
```

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Required behavior preserved | Focusable controls and regions stay understandable across full-page, embedded, constrained, RTL, and mobile placements. |
| Required review dimensions | right-to-left, zoomed in 150%, zoomed out 75%, dark theme, desert theme, dark theme with error, desert theme with error |
| Token blocker from behavior rule | Focus-ring values are named as missing Layer 2 token seams before interactive primitives can be reviewed safely. |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `docs/design-system/02-token/token-readiness-index.md`; `docs/design-system/02-token/shared`; `docs/design-system/02-token/systems/default`; `src/frontend/designSystem/layers/02-token`; `src/frontend/designSystem/contracts/tokens`; `src/frontend/designSystem/assets/styles.css` focus selectors |
| Existing token covers need | `no` |
| Reuse decision | Define a new `focus-ring` token contract and draft `default` implementation. |
| Duplication risk | Existing route-local focus styles remain evidence only; later layers must consume a governed runtime seam once it exists instead of copying local outline values. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | `token-type-templates/focus-ring.md` |
| Drift or product failure prevented | Without a focus-ring token, every primitive can invent a different focus outline, offset, theme treatment, or layout-shifting focus style. |
| Reference basis | WCAG 2.2 AA visible focus expectations, the shared Layer 2 token template, and existing route-local focus-visible evidence in `src/frontend/designSystem/assets/styles.css`. |
| Behavior-changing fields | `focusRole`, `ringValue`, `offsetValue`, `contrastRequirement`, `themeMapping`, `layoutImpact` |
| Evidence-only fields | `preview`, `metadata.accessibility`, and use-case instruction text help review the token but do not define primitive keyboard behavior. |
| Over-structure avoided | No component-specific focus tokens, no selected-state token, no hover token, no keyboard-navigation behavior, and no primitive states are defined here. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required focus role | `visible focus ring` |
| shared contract | Required themes | `original`, `dark`, `desert` |
| shared contract | Required value fields | `focusRole`, `ringValue`, `offsetValue`, `contrastRequirement`, `themeMapping`, `layoutImpact` |
| system implementation | `default` visible focus ring width | `0.125rem` |
| system implementation | `default` primary source dependency | `primary-color-source` variants by theme |
| system implementation | `default` visible focus ring color expression | `color-mix(in srgb, <primary-color-source> 58%, white)` |
| system implementation | `default` visible focus ring offset | `0.125rem` |
| system implementation | `default` layout impact | Outline must not shift layout. |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/contracts/tokens/focusRing.contract.mjs` |
| Required roles or fields | Role: `visible focus ring`; fields: `focusRole`, `sourceTokenId`, `sourceTokenName`, `sourceColorValue`, `ringValue`, `offsetValue`, `contrastRequirement`, `themeMapping`, `layoutImpact` |
| Cross-system consumer rule | Every design system must preserve visible focus, theme-specific proof, and layout-stable rendering before primitives consume focus-ring tokens. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/focusRing.tokens.mjs` |
| System token export | `focusRingTokenSpec` |
| System page route | `/design-system/default/tokens/focus-ring` |
| System proof status | `review-ready` |

## Token Variants

Every variant from `tokenDefinitionV1.variants` must be represented here for
human review.

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `focus-ring-visible-original` | focus-ring sample on `#ffffff` with `#0f1115` text, derived from `--primary-color-source-original` | original theme, focus-visible state, no layout shift | Use for keyboard-visible focus in original theme; do not use as selected, active, warning, error, or validation meaning. |
| `focus-ring-visible-dark` | focus-ring sample on `#171b22` with `#f4f7fb` text, derived from `--primary-color-source-dark` | dark theme, focus-visible state, no layout shift | Use for keyboard-visible focus in dark theme; do not alias evidence to original theme. |
| `focus-ring-visible-desert` | focus-ring sample on `#fffaf0` with `#493327` text, derived from `--primary-color-source-desert` | desert theme, focus-visible state, no layout shift | Use for keyboard-visible focus in desert theme; do not alias evidence to original or dark theme. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/focus-ring` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/focus-ring/index.html` |
| Token contract module | `src/frontend/designSystem/contracts/tokens/focusRing.contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/focusRing.tokens.mjs` |
| Token spec export | `focusRingTokenSpec` |
| Source token module | `src/frontend/designSystem/systems/default/tokens/proofs/primaryColorSource.tokens.mjs` |
| Token variant section description | Review visible-focus ring variants before interactive primitives consume focus styling. |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | Token pages consume the proof module; primitives and later layers consume the governed runtime module after the readiness index marks this token consumable. |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `02-token` proof route | Allowed through `src/frontend/designSystem/systems/default/tokens/proofs/focusRing.tokens.mjs`. |
| `03-primitive` | Allowed after the readiness index marks `focus-ring` consumable for `default`. |
| `04-pattern-contract` and later | Allowed only through consuming primitives or pattern contracts that name the governed runtime seam. |
| App-local CSS | Denied. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| themes | Render original, dark, and desert focus-ring variants separately. |
| derivation | Prove each focus-ring value declares and consumes the matching `primary-color-source` variant for its theme. |
| direction | Prove focus remains visible and understandable in LTR and RTL; direction must not reverse focus meaning. |
| magnification | Prove focus visibility at 150% zoom and recognizability at 75% zoom. |
| density or constrained layout | Prove the outline does not shift layout and remains visible inside embedded or constrained host containers. |
| accessibility | Prove keyboard-visible focus is visible, not color-only state meaning, and not silently removed by primitive or pattern styling. |

## Consumer Restrictions

Consumers must not hard-code values that this TokenDefinitionArtifact governs.

Consumers must not recreate this token decision with route-local CSS.

Consumers must not bypass allowed-consumer rules by copying demo styles,
screenshots, or generated markup.

Consumers must not weaken the accessibility requirements recorded here.

Consumers must not use this token as selected, active, warning, error, or
validation meaning.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared contract at | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` |
| Store system implementation at | `docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md` |
| Shared contract lookup key | `shared/focus-ring/02-token-contract` |
| System implementation lookup key | `default/focus-ring/02-token-implementation` |
| How later layers consume it | Later layers read this TokenDefinitionArtifact by path or stable lookup keys before making primitive, pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve the shared token contract, implementation system, deterministic token spec, approved token decisions, variants, page route, code seam, allowed consumers, required evidence, and consumer restrictions unless a token revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance TokenDefinitionArtifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `02-token` | Treat this TokenDefinitionArtifact as the current focus-ring Layer 2 proof after focused registry and route checks pass. | none |
| 2 | `03-primitive` | Define the first interactive primitive that consumes `focus-ring` through the governed runtime seam. | Primitive work must still pass the primitive harness and any other required token dependencies. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for systems with review-ready implementations` |
| Reason | `focus-ring` has a shared contract, a review-ready `default` implementation seam, and focused proof-route evidence once the listed checks pass. |
