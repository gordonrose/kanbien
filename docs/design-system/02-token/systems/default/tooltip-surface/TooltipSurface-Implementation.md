# Tooltip Surface Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `tooltip-surface` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/tooltip-surface/TooltipSurface-Contract.md` |
| Proposed design-system URL | `/design-system/default/tokens/tooltip-surface` |
| System implementation path | `docs/design-system/02-token/systems/default/tooltip-surface/TooltipSurface-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Truncated text must expose the full text through governed disclosure behavior. |
| Token category | `tooltip-surface` |
| Token job | Govern tooltip/disclosure surface, foreground, border, shadow, radius, padding, max width, layer, and motion values. |
| Non-goals | This TokenDefinitionArtifact does not define trigger markup, positioning, hover behavior, focus behavior, touch behavior, dismissal, ARIA, copy behavior, primitive behavior, app wrappers, or app adoption. |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "tooltip-surface",
  "tokenType": "tooltip-surface",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/tooltip-surface/TooltipSurface-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/tooltip-surface/TooltipSurface-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/tooltip-surface",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/tooltip-surface/index.html",
    "title": "Tooltip Surface Tokens"
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/contracts/tokens/tooltipSurface.contract.mjs",
    "contractExport": "tooltipSurfaceTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/tooltipSurface.tokens.mjs",
    "systemTokenExport": "tooltipSurfaceTokenSpec"
  },
  "dependencies": [],
  "diagnostic": {
    "kind": "none",
    "rule": "No upstream token dependency exists for this standalone tooltip surface visual token."
  },
  "variants": [
    {
      "id": "tooltip-surface-original",
      "tokenName": "--tooltip-surface-original",
      "value": {
        "backgroundValue": "#111827",
        "foregroundValue": "#ffffff",
        "borderValue": "rgba(255, 255, 255, 0.14)",
        "shadowValue": "0 0.75rem 1.6rem rgba(15, 23, 42, 0.22)",
        "radiusValue": "0.375rem",
        "paddingBlockValue": "0.45rem",
        "paddingInlineValue": "0.6rem",
        "maxInlineSizeValue": "18rem",
        "zIndexValue": "1300",
        "motionDurationValue": "120ms",
        "motionEasingValue": "ease-out"
      }
    }
  ]
}
```

The runtime proof module contains the full original, dark, and desert variant
set.

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `none` |
| Upstream variant or token | `none` |
| Upstream value | `none` |
| Formula or mapping | `none` |
| Final rendered value | Theme-specific tooltip surface recipe. |
| What changes when upstream changes | Not applicable. |
| What must not change | Text-overflow-disclosure behavior and later primitive ownership of trigger, placement, dismissal, and semantics. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required role | `text overflow disclosure surface` |
| system implementation | themes | `original`, `dark`, `desert` |
| system implementation | max inline size | `18rem` |
| system implementation | layer | `1300` |
| system implementation | motion duration | `120ms` |
| system implementation | motion easing | `ease-out` |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/tooltip-surface` |
| Token contract module | `src/frontend/designSystem/contracts/tokens/tooltipSurface.contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/tooltipSurface.tokens.mjs` |
| Token spec export | `tooltipSurfaceTokenSpec` |
| Rendered view | `/design-system/default/tokens/tooltip-surface` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/tooltip-surface` |
| Rendered view status | `available` |
| Dependency chain visible | `not-applicable` |
| Diagnostic override | `not-applicable` |
| Diagnostic override scope | `not-applicable` |
| If unavailable | Do not consume this token in primitives or later layers. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| readability | Render the disclosure surface as actual readable text. |
| containment | Prove the surface stays inside the preview container on desktop and mobile. |
| direction | Prove RTL rendering keeps full text readable and padding stable. |
| accessibility | Record that trigger semantics, placement, dismissal, and accessible behavior remain primitive work. |
| dependency rendering | Not applicable; this is a standalone visual token. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for tooltip/disclosure primitive visual consumption after this proof passes` |
| Reason | Tooltip surface visuals are signed, while full tooltip/disclosure behavior still requires primitive governance. |
