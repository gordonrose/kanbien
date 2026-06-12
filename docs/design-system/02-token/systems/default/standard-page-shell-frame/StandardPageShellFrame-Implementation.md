# Standard Page Shell Frame Tokens

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `standard-page-shell` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/standard-page-shell/StandardPageShell-Behaviour.md` |
| Existing design-system URL | `/design-system` shell chrome and existing 40-system shell CSS |
| Proposed design-system URL | `/design-system/default/tokens/standard-page-shell-frame` |
| Shared token contract path | `docs/design-system/02-token/shared/standard-page-shell-frame/StandardPageShellFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/standard-page-shell-frame/StandardPageShellFrame-Implementation.md` |
| Files affected now | Shared contract, default implementation, runtime seam, proof module, proof route, registry and manifest wiring, readiness index, focused tests. |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Standard page shells need governed frame values for top chrome, sub chrome, context rail, context drawers, mobile bottom rail, and page-bottom safe-area insets. |
| Token category | `layout` |
| Token job | Provide a reusable shell-frame token that downstream primitives and patterns consume before owning page-shell markup or placement. |
| Non-goals | Child navigation item visuals, tools-nav action semantics, page-specific workflows, bottom interaction bars, app route adoption, and component APIs. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Token Action |
| --- | --- | --- | --- | --- |
| Shell chrome z-indexes, rail sizing, drawer offsets, mobile bottom inset, and safe-area values are currently literals in the 40-system shell CSS. | `02-token` | None for this shell family. | Later shell primitives would otherwise copy page-shell literals locally. | Create `standard-page-shell-frame` token. |
| Tools navigation exists as a behavior-rule family but lacks signed concrete sizing reference values in the current shell token inventory. | `02-token` later child token | None. | Parent token cannot invent tools-nav sizing without reference truth. | Defer concrete tools-nav values to a later tools-navigation token. |
| Mobile context navigation can visually drift during document scroll if fixed-bottom behavior is left as route CSS rather than a governed child-frame invariant. | `02-token` child token | `context-navigation-frame` created in this slice. | Browser proof remains blocked locally until a supported Playwright browser exists. | Parent records invariant; child token owns concrete scroll-boundary values and proof. |

## Deterministic Token Spec

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "standard-page-shell",
  "tokenType": "standard-page-shell-frame",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/standard-page-shell/StandardPageShell-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/standard-page-shell-frame/StandardPageShellFrame-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/standard-page-shell-frame/StandardPageShellFrame-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/standard-page-shell-frame",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/standard-page-shell-frame/index.html",
    "title": "Standard Page Shell Frame Token",
    "description": "Review governed shell frame values before shell primitives, patterns, or components consume them."
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/layers/02-token/standard-page-shell-frame/contract.mjs",
    "contractExport": "standardPageShellFrameTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/standardPageShellFrame.tokens.mjs",
    "systemTokenExport": "standardPageShellFrameTokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["03-primitive", "04-pattern-contract", "05-component-seam"]
  },
  "dependencies": [],
  "diagnostic": {
    "kind": "none",
    "rule": "No diagnostic override is approved; proof route must render signed shell-frame values only."
  },
  "variants": [
    {
      "id": "standard-page-shell-frame-default",
      "tokenName": "--standard-page-shell-frame",
      "value": {
        "frameRole": "standard page shell frame",
        "topNavLayer": "6",
        "subNavLayer": "4",
        "contextNavLayer": "2147481000",
        "contextNavDrawerLayer": "2147481001",
        "contextNavMenuLayer": "2147481002",
        "tooltipLayer": "2147483000",
        "topNavPaddingBlockValue": "0.5rem",
        "topNavPaddingInlineValue": "1rem",
        "topNavGapValue": "1rem",
        "subNavPaddingBlockValue": "0.75rem",
        "subNavPaddingInlineValue": "1rem",
        "subNavGapValue": "1rem",
        "subNavSearchMaxInlineSize": "40rem",
        "mobileBreakpoint": "44rem",
        "contextRailInlineSize": "4.25rem",
        "contextRailItemSize": "2.75rem",
        "contextRailGapValue": "0.55rem",
        "contextRailPaddingBlockValue": "0.75rem",
        "contextRailPaddingInlineValue": "0.5rem",
        "mobileContextBarOffset": "calc(4.125rem + env(safe-area-inset-bottom, 0))",
        "mobileShellPagePaddingBottom": "5.75rem",
        "sidePanelInlineSize": "min(22rem, calc(100vw - 4.25rem))",
        "secondarySidePanelInlineStart": "calc(4.25rem + min(22rem, calc(100vw - 4.25rem)))",
        "mobileContextBarColumns": "repeat(5, minmax(0, 1fr))",
        "mobileContextBarPinning": "context-navigation child frame must remain fixed to the visual viewport bottom and must not participate in document scroll",
        "surfaceTopNav": "var(--surface-3)",
        "surfaceSubNav": "var(--surface-1)",
        "surfaceContextNav": "var(--surface-2)",
        "borderValue": "0.0625rem solid var(--line)"
      },
      "derivation": {
        "sourceTokenName": "40-system shell CSS",
        "sourceValue": "src/frontend/designSystem/assets/styles.css",
        "formulaOrMapping": "Values are lifted from the existing signed shell CSS selectors and root shell layer variables; no child tools-nav sizing value is invented in this parent token.",
        "renderedValue": "top nav layer 6 / sub nav layer 4 / context rail 4.25rem / context item 2.75rem / drawer width min(22rem, calc(100vw - 4.25rem)) / mobile bottom inset 5.75rem"
      },
      "preview": {
        "kind": "standard-page-shell-frame-sample",
        "sample": "Standard page shell frame",
        "background": "var(--surface-3)",
        "foreground": "var(--text)",
        "border": "0.0625rem solid var(--line)",
        "radius": "0"
      },
      "metadata": {
        "frameRole": "standard page shell frame",
        "responsiveBehavior": "desktop preserves top/sub chrome plus fixed context rail and drawer offsets; mobile preserves bottom context bar offset and page-bottom inset above safe-area",
        "layering": "top nav, sub nav, context rail, context drawers, context menus, and tooltips use signed layer values instead of local z-index literals",
        "accessibility": "Shell frame values must keep navigation, drawers, tooltips, and page content reachable at reduced width, zoom, mobile safe-area, and RTL."
      },
      "useCaseInstructions": [
        "Use for shell primitives and patterns that place top nav, sub nav, context rail, context drawers, and shell content in the standard page frame.",
        "Do not use for child navigation item anatomy, page-specific workflow controls, tools-nav action semantics, bottom interaction bars, component props, or app-local CSS.",
        "Tools navigation concrete sizing and placement must be governed by a later tools-navigation token before downstream consumers may rely on those values."
      ]
    }
  ]
}
```

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Required behavior preserved | Standard page shell chrome must remain stable across top nav, sub nav, context nav, tools nav, desktop, mobile, RTL, and overlay states. |
| Required review dimensions | Responsive layout, layer ordering, mobile safe-area, reduced-width reachability, RTL mirroring, and child-family boundaries. |
| Token blocker from behavior rule | None for the parent frame. Concrete tools-navigation sizing remains a child-token blocker. |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `src/frontend/designSystem/assets/styles.css`, `docs/design-system/02-token/token-readiness-index.md`, and existing Layer 2 token seams. |
| Existing token covers need | `no` |
| Reuse decision | Define new `standard-page-shell-frame` token. |
| Duplication risk | This prevents downstream shell primitives from copying z-indexes, context rail dimensions, drawer offsets, and mobile bottom insets from route CSS. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | Layout and z-index token fields derived from existing frame-token precedent. |
| Drift or product failure prevented | Shell children can otherwise overlap, hide content under mobile bottom chrome, or invent conflicting layer values. |
| Reference basis | Existing 40-system shell CSS and repo Layer 2 token precedent. |
| Behavior-changing fields | All z-index, padding, gap, breakpoint, rail, drawer, mobile inset, surface, and border values. |
| Evidence-only fields | Summary text, preview sample label, and usage labels. |
| Over-structure avoided | No tools-nav sizing values, page-interaction-bar values, child item state matrix, route topology, or component slot schema are included. |

## Render Model

| Field | Value |
| --- | --- |
| Token governs | `structural layout` |
| Preview must render as | A desktop and mobile shell-frame diagram that labels the shell regions by name, with signed values shown in the token fields below the diagram. |
| Preview must not render as | A component shell implementation, route wrapper, app page, generic surface card, or metadata-only table. |
| Downstream behavior this proof unlocks | Layer 3 shell primitives may consume stable shell-frame values before owning markup. |
| Proof renderer seam | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs#renderTokenSpecPage` |
| Mobile or constrained proof requirement | Route evidence must check mobile width without horizontal overflow and must show the mobile bottom inset values. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required parent-shell fields | Frame role, layer order, chrome spacing, search max width, mobile breakpoint, context rail sizing, drawer offsets, mobile bottom inset, surfaces, and border. |
| system implementation | Default shell layer order | `6`, `4`, `2147481000`, `2147481001`, `2147481002`, `2147483000` |
| system implementation | Default top/sub chrome spacing | Top `0.5rem 1rem`; sub `0.75rem 1rem`; gaps `1rem`; search max `40rem`. |
| system implementation | Default context rail and panel frame | Rail `4.25rem`; item `2.75rem`; gap `0.55rem`; drawer width `min(22rem, calc(100vw - 4.25rem))`. |
| system implementation | Default mobile shell frame | Breakpoint `44rem`; mobile context-bar offset `calc(4.125rem + env(safe-area-inset-bottom, 0))`; page bottom inset `5.75rem`; columns `repeat(5, minmax(0, 1fr))`. |
| system implementation | Mobile context bar invariant | Context-navigation child frame must remain fixed to the visual viewport bottom and must not participate in document scroll. |

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `none` |
| Upstream variant or token | `none` |
| Upstream value | `none` |
| Formula or mapping | Values are lifted from existing 40-system shell CSS rather than derived from another token. |
| Final rendered value | See `standard-page-shell-frame-default`. |
| What changes when upstream changes | Not applicable until the shell CSS is replaced by this governed token seam. |
| What must not change | Consumers must not mutate signed shell-frame values through proof controls or page-local CSS. |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/standard-page-shell-frame/contract.mjs` |
| Required roles or fields | See shared contract artifact. |
| Cross-system consumer rule | Every system implementation must preserve the shell-frame role, layer ordering, rail/panel boundary, mobile inset, and consumer restrictions before downstream shell layers can consume it. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/standardPageShellFrame.tokens.mjs` |
| System token export | `standardPageShellFrameTokenSpec` |
| System page route | `/design-system/default/tokens/standard-page-shell-frame` |
| System proof status | `review-ready` |

## Token Variants

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `standard-page-shell-frame-default` | `standard-page-shell-frame-sample`, sample `Standard page shell frame` | Standard page shell frame; desktop plus mobile safe-area behavior; signed layer values. | Use for standard shell primitives and patterns; do not use for child item anatomy or app-local CSS; govern tools-nav concrete values later. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/standard-page-shell-frame` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/standard-page-shell-frame/index.html` |
| Token contract module | `src/frontend/designSystem/layers/02-token/standard-page-shell-frame/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/standardPageShellFrame.tokens.mjs` |
| Token spec export | `standardPageShellFrameTokenSpec` |
| Token variant section description | `This variant governs parent standard page shell frame values.` |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | Token proof page, Layer 3 shell primitives, Layer 4 shell patterns, and Layer 5 shell component seams after their gates pass. |

## Rendered View

The rendered route must show a desktop and mobile shell-frame diagram with
area names only, the signed shell-frame values in the token fields, the source
mapping to existing shell CSS, the no-dependency posture, and the
tools-navigation child-token blocker.

## Required Evidence

- Focused unit coverage must assert the runtime seam exports the signed shell-frame values.
- Focused browser coverage must assert the proof route renders desktop and mobile evidence without horizontal overflow.
- Registry guard coverage must import the manifest contract and proof module successfully.
