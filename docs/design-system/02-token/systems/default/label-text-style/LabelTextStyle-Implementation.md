# Label Text Style Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `label-text-style` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md` |
| Proposed design-system URL | `/design-system/default/tokens/label-text-style` |
| System implementation path | `docs/design-system/02-token/systems/default/label-text-style/LabelTextStyle-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Text-based primitives need signed typography before truncation and disclosure behavior can be governed. |
| Token category | `text-style` |
| Token job | Govern font family, size, weight, line height, letter spacing, and transform as one short-label typography style. |
| Non-goals | This TokenDefinitionArtifact does not define foreground color, truncation behavior, tooltip behavior, selected state, status text, body text, link text, primitive behavior, app wrappers, or app adoption. |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "label-text-style",
  "tokenType": "text-style",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/label-text-style/LabelTextStyle-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/label-text-style",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/label-text-style/index.html",
    "title": "Label Text Style Tokens"
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/layers/02-token/label-text-style/contract.mjs",
    "contractExport": "labelTextStyleTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/labelTextStyle.tokens.mjs",
    "systemTokenExport": "labelTextStyleTokenSpec"
  },
  "dependencies": [],
  "diagnostic": {
    "kind": "none",
    "rule": "No upstream token dependency exists for this standalone typography style."
  },
  "variants": [
    {
      "id": "label-text-style-short-default",
      "tokenName": "--label-text-style-short-default",
      "value": {
        "fontSizeValue": "0.8125rem",
        "fontWeightValue": "700",
        "lineHeightValue": "1.25",
        "letterSpacingValue": "0",
        "textTransform": "none"
      }
    }
  ]
}
```

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `none` |
| Upstream variant or token | `none` |
| Upstream value | `none` |
| Formula or mapping | `none` |
| Final rendered value | `0.8125rem / 1.25 at weight 700` |
| What changes when upstream changes | Not applicable. |
| What must not change | Signed typography values and text-overflow-disclosure behavior. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required role | `short label text` |
| system implementation | font family | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif` |
| system implementation | font size | `0.8125rem` |
| system implementation | font weight | `700` |
| system implementation | line height | `1.25` |
| system implementation | letter spacing | `0` |
| system implementation | transform | `none` |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/label-text-style` |
| Token contract module | `src/frontend/designSystem/layers/02-token/label-text-style/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/labelTextStyle.tokens.mjs` |
| Token spec export | `labelTextStyleTokenSpec` |
| Rendered view | `/design-system/default/tokens/label-text-style` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/label-text-style` |
| Rendered view status | `available` |
| Dependency chain visible | `not-applicable` |
| Diagnostic override | `not-applicable` |
| Diagnostic override scope | `not-applicable` |
| If unavailable | Not applicable. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| typography | Render the label style as actual text with the signed family, size, weight, line height, and letter spacing. |
| direction | Prove RTL rendering keeps the text sample readable. |
| magnification | Prove the text sample remains readable and non-overlapping. |
| accessibility | Record that truncation and tooltip disclosure remain behavior and primitive/pattern work, not this token. |
| dependency rendering | Not applicable; this is a standalone typography style. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for narrow text/label primitives that do not need tooltip disclosure yet` |
| Reason | Short-label typography is signed, while full truncation disclosure still requires tooltip/disclosure token and primitive work. |
