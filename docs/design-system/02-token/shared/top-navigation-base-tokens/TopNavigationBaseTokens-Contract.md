# Top Navigation 41 Token Inventory Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `top-navigation` |
| Harness layer | `02-token` |
| Token status | `blocked` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md` |
| Existing design-system URL | `/design-system/canonical-renderings/top-nav`; `/design-system/components/top-nav` |
| Proposed design-system URL | `/design-system/default/tokens/top-navigation-base-tokens` |
| Shared token contract path | `docs/design-system/02-token/shared/top-navigation-base-tokens/TopNavigationBaseTokens-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/top-navigation-base-tokens/TopNavigationBaseTokens-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Top navigation needs governed 41 token dependencies before primitive and pattern extraction. |
| Token category | `inventory`; `blocked dependency map` |
| Token job | Record which top-navigation visual decisions map to existing 41 tokens and which token seams are still missing. |
| Non-goals | This contract does not create a consumable top-navigation visual token, define brand-mark size, define overflow measurement, define breakpoint thresholds, define grid/flex structure, or approve old design-system CSS variables as construction APIs. |

## Correction

The older top-nav candidacy review approved old design-system base CSS variable
reuse as source evidence. In the 41 harness those variables are not the target
token system. This artifact is therefore blocked as a review inventory. The
missing 41 seams named below are resolved for downstream work by
`top-navigation-frame`; later layers must consume that concrete seam instead
of this inventory.

## 41 Token Inventory

| Decision group | 41 status | Rule |
| --- | --- | --- |
| Page and surface foundations | mapped candidate: `background-color` | Later layers may consume only the concrete `background-color` seam, not `--surface-*`. |
| Primary source and low-emphasis primary tint | mapped candidate: `primary-color-source`; `primary-tinted-background`; `primary-tinted-foreground` | Later layers must prove state meaning separately; these tokens are not automatically current/active navigation state. |
| Visible focus | mapped candidate: `focus-ring` | Focus behavior still belongs to primitive layers. |
| Button or icon-button frame values | partial candidate: `button-frame` | Child controls may use button-frame only through their own primitive contracts. |
| Generic floating/panel shell | partial candidate: `panel-frame` | Menus may prove compatibility later, but this does not approve top-navigation menu anatomy. |
| Flush panel radius | partial candidate: `panel-corner-radius` | This is not a general top-navigation control/menu radius. |
| Neutral foreground/text role | resolved by `top-navigation-frame` | Do not reuse `--ink` or `--ink-soft` as 41 construction tokens. |
| Border/separator role | resolved by `top-navigation-frame` | Do not reuse `--line` or `--line-strong` as 41 construction tokens. |
| Active/current navigation state role | resolved by `top-navigation-frame` | Do not reuse old `--accent*` variables as current-route semantics. |
| Floating menu elevation role | resolved by `top-navigation-frame` | Do not reuse `--shadow*` as a 41 menu-elevation token. |
| Non-flush control/menu radius role | resolved by `top-navigation-frame` | Do not reuse `--radius*` as a 41 radius token. |

## Retired 40 Variable Groups

The following old design-system variables may remain source evidence but are not
approved 41 token dependencies for top navigation:

- `--surface-*`
- `--ink*`
- `--line*`
- `--accent*`
- `--shadow*`
- `--radius*`

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/top-navigation-base-tokens/contract.mjs` |
| Required roles or fields | `mapped41TokenSeams`; `missing41TokenSeams`; `retired40VariableGroups`; `localOnlyDecisions` |
| Cross-system consumer rule | This blocked inventory is review evidence only. Later layers must not consume it as a visual token seam. |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `02-token` | May use this inventory to understand why `top-navigation-frame` exists. |
| `03-primitive` | Blocked from using this inventory. Must consume `top-navigation-frame` for frame/state values. |
| `04-pattern-contract` | Blocked from using this inventory. Must consume accepted primitives and `top-navigation-frame` where direct token access is approved. |
| app pages | Denied. Apps must wait for later signed component/adoption seams. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| rendered proof | The token route must show blocked status, mapped 41 candidates, missing 41 seams, and retired 40 variable groups. |
| source alignment | Unit tests must assert that old 40 CSS variables are not consumable dependencies. |
| later-layer gate | Primitive and pattern work may proceed only by consuming `top-navigation-frame`, not this blocked inventory. |
