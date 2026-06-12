# Top Navigation 41 Token Inventory Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `top-navigation` |
| Harness layer | `02-token` |
| Token status | `blocked` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/top-navigation-base-tokens` |
| Shared token contract path | `docs/design-system/02-token/shared/top-navigation-base-tokens/TopNavigationBaseTokens-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/top-navigation-base-tokens/TopNavigationBaseTokens-Implementation.md` |

## Deterministic Token Spec

The deterministic source is implemented in
`src/frontend/designSystem/systems/default/tokens/proofs/topNavigationBaseTokens.tokens.mjs#tokenDefinitionV1`.

The status is `blocked`. `codeSeam.allowedConsumers` is empty because this is
an inventory route, not a consumable visual token seam.

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `docs/design-system/02-token/token-readiness-index.md`; `docs/workspace/design-system/token-reviews/top-nav-token-candidacy-review.md`; `docs/workspace/design-system/reference-packs/top-nav-reference-pack.md`; current 41 token runtime seams. |
| Existing token covers need | `partial` |
| Reuse decision | Map only to concrete 41 seams where they exist; block top-navigation token readiness where seams are missing. |
| Duplication risk | Prevents old 40 CSS variable groups from being promoted as 41 construction tokens. |

## 41 Token Mapping

| Top-navigation need | Current 41 status |
| --- | --- |
| page/surface foundations | candidate: `background-color` |
| primary source/tint | candidate: `primary-color-source`; `primary-tinted-background`; `primary-tinted-foreground` |
| focus | candidate: `focus-ring` |
| child button/icon-button frame values | partial candidate: `button-frame` |
| floating/panel menu shell values | partial candidate: `panel-frame` |
| flush panel radius | partial candidate: `panel-corner-radius` |
| neutral foreground/text | missing |
| border/separator | missing |
| active/current navigation state | missing |
| floating menu elevation | missing |
| non-flush control/menu radius | missing |

## Render Model

| Field | Value |
| --- | --- |
| Token governs | Blocked top-navigation 41 token inventory. |
| Preview must render as | A top-navigation inventory proof showing mapped 41 seams, missing 41 seams, retired 40 groups, and blocked status. |
| Preview must not render as | A consumable top-navigation visual token, a fake base-token contract, or a direct old-CSS-variable map. |
| Downstream behavior this proof unlocks | None. It blocks primitive and pattern work until token gaps are resolved. |
| Proof renderer seam | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs#renderTokenSpecPage` |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/top-navigation-base-tokens` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/top-navigation-base-tokens/index.html` |
| Token contract module | `src/frontend/designSystem/layers/02-token/top-navigation-base-tokens/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/top-navigation-base-tokens/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/topNavigationBaseTokens.tokens.mjs` |
| Token spec export | `topNavigationBaseTokensSpec` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| unit | Assert mapped 41 candidates, missing 41 seams, and retired 40 groups. |
| visual | Assert rendered proof shows blocked inventory rather than approved base-variable reuse. |
| registry | `npm run check:design-system-registry` must include this route without making it consumable. |
