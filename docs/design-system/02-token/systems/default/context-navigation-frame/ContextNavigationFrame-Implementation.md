# Context Navigation Frame Tokens

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `context-navigation` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md` |
| Existing design-system URL | `/design-system/components/context-nav`; `/design-system/canonicals/context-nav`; `/design-system/exploration/context-nav`; `/design-system/patterns/context-nav` |
| Proposed design-system URL | `/design-system/default/tokens/context-navigation-frame` |
| Shared token contract path | `docs/design-system/02-token/shared/context-navigation-frame/ContextNavigationFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/context-navigation-frame/ContextNavigationFrame-Implementation.md` |
| Files affected now | Shared contract, default implementation, runtime seam, proof module, proof route, registry and manifest wiring, readiness index, focused tests. |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Context navigation needs governed frame values for desktop rail placement, primary-zone scroll containment, bottom utility anchoring, mobile bottom-bar placement, drawer bottom offsets, and page-bottom reserve. |
| Token category | `layout` |
| Token job | Provide the reusable frame token that downstream context-navigation primitives and patterns consume before owning markup or fixed/mobile placement. |
| Non-goals | Item anatomy, active/current treatment, icons, More-menu composition, tooltip behavior, drawer payloads, app route adoption, and component APIs. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Token Action |
| --- | --- | --- | --- | --- |
| Mobile bottom context navigation can visually drift during document scroll or page-end overscroll if the fixed bar behavior is treated as route CSS rather than a governed shell invariant. | `02-token` | None for context-navigation frame. | Later primitives and patterns need a consumable frame token before fixing scroll ownership. | Create `context-navigation-frame` token with explicit viewport-pinning and scroll-boundary fields. |
| Desktop rail has separate primary scroll zone and anchored utility zone. | `02-token` | 40 CSS and context-nav reference pack. | Later layers would otherwise copy flex and overflow values locally. | Tokenize rail sizing, scroll behavior, and utility-zone anchor behavior. |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "context-navigation",
  "tokenType": "context-navigation-frame",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/context-navigation-frame/ContextNavigationFrame-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/context-navigation-frame/ContextNavigationFrame-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/context-navigation-frame",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/context-navigation-frame/index.html",
    "title": "Context Navigation Frame Token",
    "description": "Review governed context-navigation frame values before rail, bottom-bar, drawer, or shell-navigation patterns consume them."
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/layers/02-token/context-navigation-frame/contract.mjs",
    "contractExport": "contextNavigationFrameTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/context-navigation-frame/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/contextNavigationFrame.tokens.mjs",
    "systemTokenExport": "contextNavigationFrameTokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["03-primitive", "04-pattern-contract", "05-component-seam"]
  },
  "dependencies": [
    {
      "contractId": "tokens.standard-page-shell-frame",
      "variantId": "standard-page-shell-frame-default",
      "tokenName": "--standard-page-shell-frame",
      "value": "context rail 4.25rem / mobile bottom inset 5.75rem",
      "relationship": "paired-with"
    }
  ],
  "diagnostic": {
    "kind": "none",
    "rule": "No diagnostic override is approved; browser proof must verify pinned mobile behavior with signed values."
  },
  "variants": [
    {
      "id": "context-navigation-frame-default",
      "tokenName": "--context-navigation-frame",
      "value": {
        "frameRole": "context navigation frame",
        "desktopPositioningModel": "fixed rail from combined shell chrome bottom to viewport bottom",
        "mobilePositioningModel": "fixed bottom bar pinned to visual viewport bottom",
        "desktopRailInlineSize": "4.25rem",
        "desktopRailTopOffset": "var(--context-nav-top, 8rem)",
        "desktopRailBottomOffset": "0",
        "desktopRailGapValue": "0.55rem",
        "desktopRailPaddingBlockValue": "0.75rem",
        "desktopRailPaddingInlineValue": "0.5rem",
        "desktopPrimaryScrollBehavior": "primary zone flexes and scrolls with overscroll-behavior: contain",
        "utilityZoneAnchorBehavior": "bottom utility zone remains anchored with margin-top: auto",
        "mobileBreakpoint": "44rem",
        "mobileBarBlockOffset": "0",
        "mobileBarInsetInlineStart": "0",
        "mobileBarInsetInlineEnd": "0",
        "mobileBarColumns": "repeat(5, minmax(0, 1fr))",
        "mobileBarPaddingBlockStart": "0.55rem",
        "mobileBarPaddingInline": "0.5rem",
        "mobileBarPaddingBlockEnd": "calc(0.55rem + env(safe-area-inset-bottom, 0))",
        "mobilePageBottomReserve": "5.75rem",
        "mobileDrawerBottomOffset": "calc(4.125rem + env(safe-area-inset-bottom, 0))",
        "mobileViewportPinningBehavior": "bottom bar remains fixed to the visual viewport bottom during document scroll and page-end pressure",
        "mobileScrollBoundaryBehavior": "document scroll must not move the bottom bar; any page-end overscroll must not expose content below the bar",
        "surfaceValue": "var(--surface-2)",
        "borderValue": "0.0625rem solid var(--line)",
        "shadowValue": "0 -0.75rem 1.875rem rgba(38, 48, 86, 0.08)"
      },
      "derivation": {
        "sourceTokenName": "40-system context-nav CSS + standard page shell frame",
        "sourceValue": "src/frontend/designSystem/assets/styles.css",
        "formulaOrMapping": "Rail size, bottom bar columns, padding, page reserve, and drawer offset are lifted from existing context-nav CSS; viewport pinning is promoted from observed defect into a token invariant.",
        "renderedValue": "desktop fixed rail 4.25rem / mobile fixed bottom bar / mobile page reserve 5.75rem / mobile drawer offset calc(4.125rem + env(safe-area-inset-bottom, 0))"
      },
      "preview": {
        "kind": "context-navigation-frame-sample",
        "sample": "Context navigation frame",
        "background": "var(--surface-2)",
        "foreground": "var(--text)",
        "border": "0.0625rem solid var(--line)",
        "radius": "0"
      },
      "metadata": {
        "frameRole": "context navigation frame",
        "responsiveBehavior": "desktop uses fixed side rail; mobile uses fixed bottom bar with reserved page-bottom space and drawer offset above the bar",
        "scrollBehavior": "desktop primary zone owns internal overflow; mobile bar remains viewport-pinned and does not scroll with page content",
        "accessibility": "Context navigation must remain reachable and visible at page top, page middle, page bottom, zoom, mobile safe-area, and RTL."
      },
      "useCaseInstructions": [
        "Use for context-navigation primitives and patterns that place the desktop rail, primary scroll zone, utility zone, mobile bottom bar, and mobile drawer offset.",
        "Do not use for destination item anatomy, active-state treatment, More-menu behavior, tooltip behavior, drawer payloads, component props, or app-local CSS.",
        "Browser proof must verify the mobile bottom bar stays pinned at scroll top, middle, and bottom before downstream adoption."
      ]
    }
  ]
}
```

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Required behavior preserved | Context navigation remains shell-attached, scroll-safe, responsive, and recoverable across desktop, mobile, RTL, tooltip, drawer, long-label, theme, and magnified states. |
| Required review dimensions | Mobile scroll pinning, desktop rail pressure, utility-zone anchoring, drawer offset, page-bottom reserve, RTL, zoom, and theme. |
| Token blocker from behavior rule | None for frame values. Item, More-menu, tooltip, and drawer-payload values remain later token or primitive decisions. |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `src/frontend/designSystem/assets/styles.css`, context-navigation behavior rule, and `standard-page-shell-frame` token seam. |
| Existing token covers need | `partial` |
| Reuse decision | Pair with `standard-page-shell-frame`, but define a new context-navigation-specific frame token. |
| Duplication risk | This prevents downstream context-navigation primitives from copying fixed-bottom, page reserve, drawer offset, primary-scroll, and utility-anchor literals from route CSS. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | Layout, z-index-adjacent frame, and scroll-boundary token fields derived from existing frame-token precedent. |
| Drift or product failure prevented | Mobile bottom nav can drift with document scroll or leave scrollable space below the bar; desktop utility actions can be displaced by primary-zone overflow. |
| Reference basis | Existing 40-system context-nav CSS, context-navigation behavior rule, and standard page shell frame token. |
| Behavior-changing fields | Positioning models, rail size, scroll behavior, utility anchor, mobile bar offsets, mobile reserve, drawer offset, surface, border, and shadow. |
| Evidence-only fields | Summary text, preview sample label, and usage labels. |
| Over-structure avoided | No destination list schema, item state matrix, icon contract, drawer payload model, or component API is included. |

## Render Model

| Field | Value |
| --- | --- |
| Token governs | `structural layout and scroll boundary` |
| Preview must render as | Desktop rail and mobile bottom-bar diagrams that label frame regions by name, with signed values shown in token fields below the diagram. |
| Preview must not render as | A component shell implementation, route wrapper, app page, generic surface card, or metadata-only table. |
| Downstream behavior this proof unlocks | Layer 3 context-navigation primitives may consume frame values before owning rail or bottom-bar markup. |
| Proof renderer seam | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs#renderTokenSpecPage` |
| Mobile or constrained proof requirement | Browser proof must assert the bottom bar remains pinned during scroll top, middle, and bottom when a supported browser is available. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required context-navigation frame fields | Positioning models, rail sizing, scroll behavior, utility anchor, mobile bar placement, page reserve, drawer offset, surface, border, and shadow. |
| system implementation | Desktop rail frame | Fixed rail, top `var(--context-nav-top, 8rem)`, bottom `0`, width `4.25rem`, padding `0.75rem 0.5rem`, gap `0.55rem`. |
| system implementation | Desktop scroll model | Primary zone scrolls internally with `overscroll-behavior: contain`; bottom utility zone remains anchored with `margin-top: auto`. |
| system implementation | Mobile bottom bar frame | Fixed bottom bar, inline start/end `0`, columns `repeat(5, minmax(0, 1fr))`, padding `0.55rem 0.5rem calc(0.55rem + env(safe-area-inset-bottom, 0))`. |
| system implementation | Mobile page and drawer reserve | Page bottom reserve `5.75rem`; drawer bottom offset `calc(4.125rem + env(safe-area-inset-bottom, 0))`. |
| system implementation | Mobile scroll invariant | Bottom bar remains fixed to the visual viewport bottom and does not participate in document scroll or page-end overscroll. |

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `tokens.standard-page-shell-frame` |
| Upstream variant or token | `standard-page-shell-frame-default` |
| Upstream value | Context rail `4.25rem`; mobile bottom inset `5.75rem`. |
| Formula or mapping | Context-navigation frame uses the parent shell frame values and specializes scroll ownership, utility anchoring, and mobile fixed-bottom behavior. |
| Final rendered value | See `context-navigation-frame-default`. |
| What changes when upstream changes | Context-navigation frame must be reconciled if parent shell rail width, mobile breakpoint, drawer offset, or bottom reserve changes. |
| What must not change | The mobile bar must remain viewport-pinned and must not become a document-scroll participant. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/context-navigation-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/contextNavigationFrame.tokens.mjs` |
| System token export | `contextNavigationFrameTokenSpec` |
| System page route | `/design-system/default/tokens/context-navigation-frame` |
| System proof status | `review-ready` |

## Token Variants

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `context-navigation-frame-default` | `context-navigation-frame-sample`, sample `Context navigation frame` | Context navigation frame; desktop internal scroll plus anchored utilities; mobile viewport-pinned bottom bar. | Use for context-navigation frame primitives and patterns; do not use for item anatomy or app-local CSS; browser proof must verify scroll pinning. |

## Required Evidence

- Focused unit coverage must assert the runtime seam exports signed context-navigation frame values.
- Registry guard coverage must import the manifest contract and proof module successfully.
- Focused browser coverage must assert mobile bottom bar pinning when the local environment has a supported browser.
