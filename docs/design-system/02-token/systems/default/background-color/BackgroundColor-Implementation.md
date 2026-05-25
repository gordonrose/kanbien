# Background Color Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `background-color` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md` |
| Existing design-system URL | `/design-system/tokens/background` |
| Proposed design-system URL | `/design-system/default/tokens/background-color` |
| System implementation path | `docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md` |
| Files affected now | `docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The colours behavior rule requires original, dark, and desert colour decisions to remain visibly and conceptually separate. |
| Token category | `background-color` |
| Token job | Govern page and surface background colour variants before later primitives or patterns consume them. |
| Non-goals | This TokenDefinitionArtifact does not define primitive behavior, pattern structure, component APIs, demo routes, canonical files, app wrappers, or app adoption. |

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
  "uiFamily": "background-color",
  "tokenType": "background-color",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/background-color",
    "htmlPath": "src/frontend/designSystem/systems/default/tokens/background-color/index.html",
    "title": "Background Color Tokens",
    "description": "Review governed background color variants, metadata, and use-case rules."
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/contracts/tokens/backgroundColor.contract.mjs",
    "contractExport": "backgroundColorTokenContract",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/backgroundColor.tokens.mjs",
    "systemTokenExport": "backgroundColorTokenSpec",
    "rendererModule": "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    "rendererExport": "renderTokenSpecPage",
    "allowedConsumers": ["02-token", "03-primitive", "04-pattern-contract"]
  },
  "variants": [
    {
      "id": "background-page-original",
      "tokenName": "--background-page-original",
      "value": {
        "backgroundRole": "page foundation",
        "surfaceRelationship": "supports original surfaces and page chrome",
        "mappedPaletteToken": "palette.neutral.0",
        "themeMapping": "original",
        "contrastPairings": "text-primary, border-subtle",
        "stateMapping": "none"
      },
      "preview": {
        "kind": "surface-swatch",
        "sample": "#ffffff",
        "background": "#ffffff",
        "foreground": "#0f1115"
      },
      "metadata": {
        "backgroundRole": "page foundation",
        "surfaceRelationship": "supports original surfaces and page chrome",
        "theme": "original",
        "state": "none",
        "accessibility": "Approved foreground pairings must maintain text contrast."
      },
      "useCaseInstructions": [
        "Use for original full-page background behind governed surfaces.",
        "Do not use as a status, selected, warning, or error background.",
        "Use text-primary and border-subtle until semantic mappings expand."
      ]
    },
    {
      "id": "background-surface-original",
      "tokenName": "--background-surface-original",
      "value": {
        "backgroundRole": "surface foundation",
        "surfaceRelationship": "sits above original page foundation",
        "mappedPaletteToken": "palette.neutral.0",
        "themeMapping": "original",
        "contrastPairings": "text-primary, border-subtle",
        "stateMapping": "none"
      },
      "preview": {
        "kind": "surface-swatch",
        "sample": "#ffffff",
        "background": "#ffffff",
        "foreground": "#0f1115"
      },
      "metadata": {
        "backgroundRole": "surface foundation",
        "surfaceRelationship": "sits above original page foundation",
        "theme": "original",
        "state": "none",
        "accessibility": "Must remain distinguishable from page foundation using border or elevation when adjacent."
      },
      "useCaseInstructions": [
        "Use for primary content regions on the original page foundation.",
        "Do not use as a nested card-within-card background without a signed surface rule.",
        "Use text-primary and border-subtle."
      ]
    },
    {
      "id": "background-subtle-original",
      "tokenName": "--background-subtle-original",
      "value": {
        "backgroundRole": "subtle foundation",
        "surfaceRelationship": "supports low-emphasis bands and inactive regions",
        "mappedPaletteToken": "palette.neutral.50",
        "themeMapping": "original",
        "contrastPairings": "text-primary, border-subtle",
        "stateMapping": "none"
      },
      "preview": {
        "kind": "surface-swatch",
        "sample": "#f7f8fb",
        "background": "#f7f8fb",
        "foreground": "#20242c"
      },
      "metadata": {
        "backgroundRole": "subtle foundation",
        "surfaceRelationship": "supports low-emphasis bands and inactive regions",
        "theme": "original",
        "state": "none",
        "accessibility": "Must not reduce text contrast below the approved foreground pairing."
      },
      "useCaseInstructions": [
        "Use for low-emphasis page bands and empty-region backgrounds.",
        "Do not use to communicate disabled, loading, warning, or error state by itself.",
        "Use text-primary and border-subtle."
      ]
    },
    {
      "id": "background-page-dark",
      "tokenName": "--background-page-dark",
      "value": {
        "backgroundRole": "page foundation",
        "surfaceRelationship": "supports dark theme surfaces and page chrome",
        "mappedPaletteToken": "palette.neutral.950",
        "themeMapping": "dark",
        "contrastPairings": "text-inverse, border-inverse-subtle",
        "stateMapping": "none"
      },
      "preview": {
        "kind": "surface-swatch",
        "sample": "#101318",
        "background": "#101318",
        "foreground": "#f4f7fb"
      },
      "metadata": {
        "backgroundRole": "page foundation",
        "surfaceRelationship": "supports dark theme surfaces and page chrome",
        "theme": "dark",
        "state": "none",
        "accessibility": "Dark theme pairings must be tested separately from original theme pairings."
      },
      "useCaseInstructions": [
        "Use for dark theme page foundation only.",
        "Do not alias this to the original theme background.",
        "Use text-inverse and border-inverse-subtle until semantic mappings expand."
      ]
    },
    {
      "id": "background-surface-dark",
      "tokenName": "--background-surface-dark",
      "value": {
        "backgroundRole": "surface foundation",
        "surfaceRelationship": "sits above dark page foundation",
        "mappedPaletteToken": "palette.neutral.900",
        "themeMapping": "dark",
        "contrastPairings": "text-inverse, border-inverse-subtle",
        "stateMapping": "none"
      },
      "preview": {
        "kind": "surface-swatch",
        "sample": "#171b22",
        "background": "#171b22",
        "foreground": "#f4f7fb"
      },
      "metadata": {
        "backgroundRole": "surface foundation",
        "surfaceRelationship": "sits above dark page foundation",
        "theme": "dark",
        "state": "none",
        "accessibility": "Must be reviewed separately from original theme surface contrast."
      },
      "useCaseInstructions": [
        "Use for dark theme primary content regions.",
        "Do not alias to default surfaces or reuse as a modal scrim.",
        "Use text-inverse and border-inverse-subtle."
      ]
    },
    {
      "id": "background-page-desert",
      "tokenName": "--background-page-desert",
      "value": {
        "backgroundRole": "page foundation",
        "surfaceRelationship": "supports desert theme surfaces and page chrome",
        "mappedPaletteToken": "palette.sand.0",
        "themeMapping": "desert",
        "contrastPairings": "text-primary, border-warm-subtle",
        "stateMapping": "none"
      },
      "preview": {
        "kind": "surface-swatch",
        "sample": "#fffdf7",
        "background": "#fffdf7",
        "foreground": "#493327"
      },
      "metadata": {
        "backgroundRole": "page foundation",
        "surfaceRelationship": "supports desert theme surfaces and page chrome",
        "theme": "desert",
        "state": "none",
        "accessibility": "Desert theme pairings must be tested separately from original and dark themes."
      },
      "useCaseInstructions": [
        "Use for desert theme page foundation only.",
        "Do not use as a decorative warm card fill.",
        "Use text-primary and border-warm-subtle until semantic mappings expand."
      ]
    },
    {
      "id": "background-surface-desert",
      "tokenName": "--background-surface-desert",
      "value": {
        "backgroundRole": "surface foundation",
        "surfaceRelationship": "sits above desert page foundation",
        "mappedPaletteToken": "palette.sand.25",
        "themeMapping": "desert",
        "contrastPairings": "text-primary, border-warm-subtle",
        "stateMapping": "none"
      },
      "preview": {
        "kind": "surface-swatch",
        "sample": "#fffaf0",
        "background": "#fffaf0",
        "foreground": "#493327"
      },
      "metadata": {
        "backgroundRole": "surface foundation",
        "surfaceRelationship": "sits above desert page foundation",
        "theme": "desert",
        "state": "none",
        "accessibility": "Must preserve readable text without becoming a decorative palette wash."
      },
      "useCaseInstructions": [
        "Use for desert theme primary content regions.",
        "Do not use as a brand accent or decorative marketing panel.",
        "Use text-primary and border-warm-subtle."
      ]
    }
  ]
}
```

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Required behavior preserved | Original, dark, and desert background decisions remain visibly and conceptually separate. |
| Required review dimensions | right-to-left, zoomed in 150%, zoomed out 75%, dark theme, desert theme, dark theme with error, desert theme with error |
| Token blocker from behavior rule | none |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | Existing `/design-system/tokens/background` route, `src/frontend/designSystem/assets/tokenBackground.mjs`, ADR 0048 contract/system folders, and current `backgroundColor.contract.mjs`. |
| Existing token covers need | partial |
| Reuse decision | Define the switchable-system `background-color` token seam while preserving the legacy `/design-system/tokens/background` route as compatibility truth. |
| Duplication risk | The new seam uses system-scoped route and module paths; consumers must use the shared contract and `default` system module instead of copying legacy route literals. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | `token-type-templates/background-color.md` |
| Drift or product failure prevented | Background colors can become local one-off CSS, decorative theme washes, or accidental status colors that no longer preserve contrast, surface hierarchy, or theme separation. |
| Reference basis | WCAG contrast and color-independent meaning requirements, DTCG-style token type/value separation, mature design-system practice for semantic color roles, and this repo's app-page CSS prohibition. |
| Behavior-changing fields | Consumers may rely on the token's role, surface relationship, mapped palette value, theme, approved foreground/border pairings, state meaning, token name, and allowed/forbidden use. |
| Evidence-only fields | Preview swatches and accessibility review notes are for human inspection; they must not become runtime app contracts. |
| Over-structure avoided | No full palette matrix, no component anatomy, no workflow state machine, no per-page theme exceptions, and no app adoption mapping at the token layer. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Token type | `background-color` |
| shared contract | Required themes | `original`, `dark`, `desert` |
| shared contract | Required roles | page foundation, surface foundation, subtle foundation |
| shared contract | Preview kind | surface swatch |
| shared contract | Contract seam | `backgroundColorTokenContract` |
| system implementation | Implementation system | `default` |
| system implementation | System export | `backgroundColorTokenSpec` |
| system implementation | Runtime aliases | none |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/contracts/tokens/backgroundColor.contract.mjs` |
| Required roles or fields | Page foundation, surface foundation, subtle foundation; original, dark, and desert themes; variant id, token name, value, preview, metadata, and use-case instructions. |
| Cross-system consumer rule | Every design-system implementation must preserve background roles, theme names, variant identity, usage constraints, and approved metadata before downstream primitives or patterns consume background-color tokens. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/backgroundColor.tokens.mjs` |
| System token export | `backgroundColorTokenSpec` |
| System page route | `/design-system/default/tokens/background-color` |
| System proof status | `review-ready` |

## Token Variants

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `background-page-original` | surface swatch `#ffffff` | original theme, page foundation, no state, foreground pairings must maintain contrast | Use for original full-page background; do not use for status, selected, warning, or error backgrounds. |
| `background-surface-original` | surface swatch `#ffffff` | original theme, surface foundation, no state, must remain distinguishable from page background by border or elevation | Use for primary content regions; do not use as a nested card-within-card background without a signed surface rule. |
| `background-subtle-original` | surface swatch `#f7f8fb` | original theme, subtle foundation, no state, must not reduce text contrast | Use for low-emphasis bands; do not use to communicate disabled, loading, warning, or error state by itself. |
| `background-page-dark` | surface swatch `#101318` | dark theme, page foundation, no state, dark pairings need separate proof | Use for dark theme page foundation; do not alias to the original theme background. |
| `background-surface-dark` | surface swatch `#171b22` | dark theme, surface foundation, no state, dark surface contrast needs separate proof | Use for dark theme primary content regions; do not reuse as a modal scrim. |
| `background-page-desert` | surface swatch `#fffdf7` | desert theme, page foundation, no state, desert pairings need separate proof | Use for desert theme page foundation; do not use as decorative warm card fill. |
| `background-surface-desert` | surface swatch `#fffaf0` | desert theme, surface foundation, no state, must preserve readable text | Use for desert theme primary content regions; do not use as a brand accent or decorative marketing panel. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/background-color` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/background-color/index.html` |
| Token contract module | `src/frontend/designSystem/contracts/tokens/backgroundColor.contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/backgroundColor.tokens.mjs` |
| Token spec export | `backgroundColorTokenSpec` |
| Token variant section description | Each row is a reusable background decision with preview, metadata, and usage constraints. |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | Token pages now; later primitives and patterns only after their harness gates pass. |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `02-token` page renderer | May consume `backgroundColorTokenSpec` directly to render the default token page. |
| `03-primitive` | May consume exported variants only after the primitive layer is active and the primitive artifact names the consumed token. |
| `04-pattern-contract` | May consume exported variants only after the pattern layer is active and the pattern artifact names the consumed token. |
| App pages | Must not consume raw values or recreate these decisions with app-local CSS. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| themes | Original, dark, and desert variants must remain distinct. |
| direction | Direction does not change background colour meaning. |
| magnification | 150% zoom must keep variant labels, values, metadata, and use-case instructions readable. |
| density or constrained layout | Variant cards must not lose token identity or use-case instructions in constrained layouts. |
| accessibility | Approved foreground pairings must maintain contrast; colour must not be the only carrier of state or meaning. |

## Verification Evidence

| Evidence Item | Result |
| --- | --- |
| Route checked | `/design-system/default/tokens/background-color` returned `200` from the live dev server on port `3000`. |
| Desktop viewport | `1440x1000`; 7 token cards rendered, no horizontal overflow, no detected text clipping, and context nav no longer overlapped token content. |
| Mobile viewport | `390x844`; 7 token cards rendered, no horizontal overflow, and no detected text clipping. |
| Mobile navigation | Mobile nav opened and reported `aria-expanded="true"`. |
| Local screenshots | `/tmp/background-color-desktop-after-main-offset.png`, `/tmp/background-color-mobile-after-main-offset.png`, `/tmp/background-color-mobile-nav-open-after-main-offset.png`. |
| Committed visual smoke coverage | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/visual/designSystem/tokens/backgroundColorTokenRoute.spec.ts --config=playwright.config.ts` passed with 2 tests after the `tokens/proofs/` folder split. |
| Remaining limitation | This is geometry and interaction smoke coverage, not committed screenshot baseline coverage. |

## Consumer Restrictions

Consumers must not hard-code values that this TokenDefinitionArtifact governs.

Consumers must not recreate this token decision with route-local CSS.

Consumers must not bypass allowed-consumer rules by copying demo styles,
screenshots, or generated markup.

Consumers must not weaken the accessibility requirements recorded here.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this system implementation at | `docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md` |
| Shared contract lookup key | `shared/background-color/02-token-contract` |
| System implementation lookup key | `default/background-color/02-token-implementation` |
| How later layers consume it | Later layers read this TokenDefinitionArtifact by path or stable lookup keys before making primitive, pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve the shared token contract, implementation system, deterministic token spec, approved token decisions, variants, page route, code seam, allowed consumers, required evidence, and consumer restrictions unless a token revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance TokenDefinitionArtifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `02-token` | Treat this TokenDefinitionArtifact as the current background-color Layer 2 proof after focused registry and route checks pass. | none |
| 2 | `03-primitive` | Define a primitive only when it can consume this signed token seam without inventing missing visual, behavior, or accessibility decisions. | No primitive blocker remains for `background-color` itself; other token needs must still route back to Layer 2. |
| 3 | later app adoption | Do not consume these values directly from app pages. | App adoption must wait for signed-off downstream seams. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed` |
| Reason | Background colour token variants now have a deterministic TokenDefinitionArtifact, shared contract, `default` system export, executable page, reusable seam, and an active primitive harness; primitive work remains limited to consumers that need only signed token seams. |
