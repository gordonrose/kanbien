# Index Nav Item Surface Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `index-nav-item` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Existing design-system URL | `none governed` |
| Proposed design-system URL | `/design-system/default/tokens/index-nav-item-surface` |
| Shared token contract path | `docs/design-system/02-token/shared/index-nav-item-surface/IndexNavItemSurface-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/index-nav-item-surface/IndexNavItemSurface-Implementation.md` |
| Files affected now | `docs/design-system/02-token/shared/index-nav-item-surface/IndexNavItemSurface-Contract.md`; `docs/design-system/02-token/systems/default/index-nav-item-surface/IndexNavItemSurface-Implementation.md`; `src/frontend/designSystem/layers/02-token/index-nav-item-surface/`; `src/frontend/designSystem/systems/default/tokens/index-nav-item-surface/`; `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemSurface.tokens.mjs` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Future rectangular index-navigation items need reusable surface states without app-local colors or borders. |
| Token category | `surface` |
| Token job | Govern resting, hover, current, and disabled surface/background/border values for index-navigation items. |
| Non-goals | This token does not define activation behavior, roles, keyboard operation, selected semantics, radius, padding, gap, item layout, component props, or app adoption. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Required behavior preserved | Index navigation state meaning must be reviewable without relying on route-local CSS or color-only meaning. |
| Required review dimensions | Original/dark/desert themes, RTL, zoom, mobile, focus/state readability, and color-independent meaning. |
| Token blocker from behavior rule | Missing surface, border, selected-state, disabled-state, spacing, and sizing decisions block later pattern readiness. |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `docs/design-system/02-token/token-readiness-index.md`; `docs/design-system/04-pattern-contract/shared/index-nav-item/IndexNavItem-Contract.md`; existing `entity_management_page` and `filter-panel-structure` route inventory |
| Existing token covers need | `partial` |
| Reuse decision | Reuse signed `background-color`, `primary-tinted-background`, `primary-tinted-foreground`, and `primary-color-source` variants; define new `index-nav-item-surface` state surface token. |
| Duplication risk | Prevents future patterns from copying rectangular item surface and border values out of legacy template CSS. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | `token-type-templates/surface.md` |
| Drift or product failure prevented | Rectangular index items would otherwise invent resting, hover, current, and disabled colors locally. |
| Reference basis | Existing Layer 2 surface/background token precedent and WCAG color-independent meaning requirements. |
| Behavior-changing fields | `surfaceRole`, `backgroundValue`, `borderValue`, `themeMapping`, `state` |
| Evidence-only fields | `sourceTokenName`, `sourceValue`, `formulaOrMapping`, preview labels |
| Over-structure avoided | No component states, event names, routing model, tablist semantics, radius, padding, or gap are defined here. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required roles | Resting, hover, current, and disabled index-nav-item surface states. |
| `shared contract` | Required themes | `original`, `dark`, `desert` |
| `shared contract` | Color-only rule | Current and disabled visuals must be paired with programmatic state semantics in later primitives or patterns. |
| `system implementation` | Default proof route | `/design-system/default/tokens/index-nav-item-surface` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-surface/systems/default.mjs#indexNavItemSurfaceTokenSpec` |

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `tokens.background-color`; `tokens.primary-tinted-background`; `tokens.primary-tinted-foreground`; `tokens.primary-color-source` |
| Upstream variant or token | Theme-specific page/surface, primary tint, primary foreground, and primary source variants. |
| Upstream value | Listed per variant on the rendered proof route. |
| Formula or mapping | Resting maps to signed surface backgrounds; hover derives a subtle primary mix; current maps to signed primary tint and foreground; disabled derives a low-emphasis surface mix. |
| Final rendered value | Listed per token variant. |
| What changes when upstream changes | Rendered surface background, border, or foreground preview changes in the token proof. |
| What must not change | State roles, theme coverage, and the requirement that state meaning is not color-only. |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/index-nav-item-surface/contract.mjs` |
| Required roles or fields | Surface role, background value, border value, elevation value, nesting rule, theme, state, accessibility note, and use-case instructions. |
| Cross-system consumer rule | Every implementation may change concrete values, but must preserve item state roles, theme coverage, and color-independent meaning constraints. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/index-nav-item-surface/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemSurface.tokens.mjs` |
| System token export | `indexNavItemSurfaceTokenSpec` |
| System page route | `/design-system/default/tokens/index-nav-item-surface` |
| System proof status | `review-ready` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/index-nav-item-surface` |
| Rendered view status | `available` |
| Dependency chain visible | `yes` |
| Diagnostic override | `not-applicable` |
| Diagnostic override scope | Upstream source/color derivation remains on primary source and primary tint token proof pages. |
| If unavailable | Do not consume this token in later layers. |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for future button/selectable-item surface states after primitive gates pass. |
| `04-pattern-contract` | May consume this token for future `index-nav-item` only after missing radius/spacing and interactive primitive gates pass. |
| `app pages` | Denied; app pages must not copy these values or consume token proof markup directly. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| themes | Original, dark, and desert surface states render distinctly. |
| direction | RTL must not alter the meaning of state surface tokens. |
| magnification | 150% zoom and mobile widths keep token values and labels readable. |
| density or constrained layout | Future item pattern must prove constrained label and metadata layout separately. |
| accessibility | Current and disabled meaning must not rely on color alone. |
| dependency rendering | Source token names, formula/mapping, and final rendered values must be visible on the proof route. |

## Consumer Restrictions

Consumers must not hard-code values that this TokenDefinitionArtifact governs.

Consumers must not recreate this token decision with route-local CSS.

Consumers must not bypass allowed-consumer rules by copying demo styles,
screenshots, or generated markup.

Consumers must not weaken the accessibility requirements recorded here.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared contract at | `docs/design-system/02-token/shared/index-nav-item-surface/IndexNavItemSurface-Contract.md` |
| Store system implementation at | `docs/design-system/02-token/systems/default/index-nav-item-surface/IndexNavItemSurface-Implementation.md` |
| Shared contract lookup key | `shared/index-nav-item/02-token-contract/index-nav-item-surface` |
| System implementation lookup key | `default/index-nav-item/02-token-implementation/index-nav-item-surface` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key, then import the governed runtime seam for values. |
| What later layers must preserve | Later layers preserve roles, states, theme coverage, dependency chain, allowed consumers, and color-independent restrictions. |
| What must not consume it | Runtime UI modules must not import this governance TokenDefinitionArtifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `02-token` | Review and verify `index-nav-item-surface`. | No known blocker remains for surface state values. |
| 2 | `02-token` | Define the remaining rectangular item frame tokens for radius and spacing. | `index-nav-item` remains blocked without radius, padding, and gap decisions. |
| 3 | `03-primitive` | Define the button/selectable-item primitive after frame tokens exist. | Interactive behavior cannot be composed at Layer 4 until a primitive owns it. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | More token foundations are still required before the interactive item primitive can be created. |
