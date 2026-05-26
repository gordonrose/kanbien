# Tooltip Text Style Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `tooltip-text-style` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/tooltip-text-style/TooltipTextStyle-Contract.md` |
| Proposed design-system URL | `/design-system/default/tokens/tooltip-text-style` |
| System implementation path | `docs/design-system/02-token/systems/default/tooltip-text-style/TooltipTextStyle-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Truncated text must expose readable full text through governed disclosure behavior. |
| Token category | `text-style` |
| Token job | Govern font family, fallback stack, size, weight, line height, letter spacing, and transform for tooltip disclosure text. |
| Non-goals | This TokenDefinitionArtifact does not define tooltip surface color, trigger behavior, positioning, hover behavior, focus behavior, touch behavior, dismissal, ARIA, copy behavior, primitive behavior, app wrappers, or app adoption. |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "tooltip-text-style",
  "tokenType": "text-style",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/tooltip-text-style/TooltipTextStyle-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/tooltip-text-style/TooltipTextStyle-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/tooltip-text-style",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/tooltip-text-style/index.html",
    "title": "Tooltip Text Style Tokens"
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/layers/02-token/tooltip-text-style/contract.mjs",
    "contractExport": "tooltipTextStyleTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/tooltipTextStyle.tokens.mjs",
    "systemTokenExport": "tooltipTextStyleTokenSpec"
  },
  "dependencies": [],
  "diagnostic": {
    "kind": "none",
    "rule": "No upstream token dependency exists for this standalone tooltip text typography style."
  },
  "variants": [
    {
      "id": "tooltip-text-style-default",
      "tokenName": "--tooltip-text-style-default",
      "value": {
        "fontFamilyValue": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        "fontFallbackRule": "Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.",
        "fontSizeValue": "0.8125rem",
        "fontWeightValue": "600",
        "lineHeightValue": "1.35",
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
| Final rendered value | `0.8125rem / 1.35 at weight 600` |
| What changes when upstream changes | Not applicable. |
| What must not change | Complete font fallback stack, readable wrapped disclosure text, and later primitive ownership of trigger, placement, dismissal, and semantics. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required role | `tooltip disclosure text` |
| system implementation | font family | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif` |
| system implementation | fallback rule | `Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.` |
| system implementation | font size | `0.8125rem` |
| system implementation | font weight | `600` |
| system implementation | line height | `1.35` |
| system implementation | letter spacing | `0` |
| system implementation | transform | `none` |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/tooltip-text-style` |
| Token contract module | `src/frontend/designSystem/layers/02-token/tooltip-text-style/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/tooltipTextStyle.tokens.mjs` |
| Token spec export | `tooltipTextStyleTokenSpec` |
| Rendered view | `/design-system/default/tokens/tooltip-text-style` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/tooltip-text-style` |
| Rendered view status | `available` |
| Dependency chain visible | `not-applicable` |
| Diagnostic override | `not-applicable` |
| Diagnostic override scope | `not-applicable` |
| If unavailable | Do not consume this token in primitives or later layers. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| typography | Render the tooltip disclosure style as actual text on a tooltip-like background. |
| fallback | Expose the font fallback stack as part of the governed value. |
| direction | Prove RTL rendering keeps disclosure text readable. |
| magnification | Prove the text sample remains readable and non-overlapping. |
| accessibility | Record that trigger semantics, placement, dismissal, and accessible behavior remain primitive work. |
| dependency rendering | Not applicable; this is a standalone typography style. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for tooltip/disclosure primitives after tooltip-surface pairing` |
| Reason | Tooltip disclosure typography and surface visuals are signed, while full tooltip/disclosure behavior still requires primitive governance. |
