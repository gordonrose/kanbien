# Top Navigation Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `top-navigation` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md` |
| Reference pack | `docs/workspace/design-system/reference-packs/top-nav-reference-pack.md` |
| Shared token contract path | `docs/design-system/02-token/shared/top-navigation-frame/TopNavigationFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/top-navigation-frame/TopNavigationFrame-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Top navigation needs 41-governed chrome, neutral foreground, separator, current-state, radius, and menu frame values before primitives or patterns extract the signed `TRP-*` behavior. |
| Token category | `surface`; `state frame`; `spacing`; `sizing`; `elevation` |
| Token job | Govern the reusable visual frame values for top-navigation chrome, destinations, current destinations, triggers, open triggers, minimum readable control width, and lightweight top-navigation menu panels. |
| Non-goals | Brand markup, destination semantics, profile behavior, overflow measurement, mobile collapse, keyboard behavior, menu item anatomy, component APIs, app adoption, and standard-page-shell composition. |

## Inventory Check

| Field | Value |
| --- | --- |
| Existing token reuse | Reuses `background-color`, `primary-tinted-background`, `primary-tinted-foreground`, `button-frame`, `focus-ring`, `label-text-style`, and `minimum-target-size`. |
| Existing token denied | Does not reuse `index-nav-*`, `dropdown-*`, or `menu-simple-select-frame` because those contracts govern different navigation/select/listbox families. |
| Old design-system variables | `--surface-*`, `--ink*`, `--line*`, `--accent*`, `--shadow*`, and `--radius*` remain source evidence only, not construction tokens. |
| Result | Create `top-navigation-frame` as the smallest top-navigation-specific token seam that resolves the missing 41 frame/state roles. |

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Token Action |
| --- | --- | --- | --- | --- |
| Top chrome needs neutral surface, foreground, separator, padding, and gap. | `02-token` | Partial: `background-color`; `standard-page-shell-frame` owns parent placement. | Top-navigation-specific neutral frame role missing. | Create chrome frame role. |
| Destinations need rest and current frame values. | `02-token` | Partial: `primary-tinted-*`; `minimum-target-size`. | Current top-navigation state frame role missing. | Create destination and current-destination roles. |
| Overflow, profile, and mobile triggers need rest and open frame values. | `02-token` | Partial: `primary-tinted-*`; `minimum-target-size`. | Top-navigation trigger and open-trigger frame roles missing. | Create trigger and open-trigger roles. |
| Lightweight overflow/profile menus need surface, radius, border, elevation, and layer relationship. | `02-token` | Partial: `background-color`; `focus-ring` for later focus pairing. | Top-navigation menu frame role missing. | Create menu panel role. |
| Current state, menu open state, focus recovery, and overflow measurement are behavioral/interactive. | `03-primitive` and `04-pattern-contract` | `TopNavigation-Behaviour.md` | Primitive and pattern seams missing. | Record as downstream dependency, not token behavior. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required roles | `top navigation chrome`; `top navigation destination`; `top navigation current destination`; `top navigation trigger`; `top navigation open trigger`; `top navigation menu panel` |
| `shared contract` | Required themes | `original`; `dark`; `desert` |
| `shared contract` | Current state rule | Current frame values must be paired with programmatic current semantics in later layers. |
| `shared contract` | Open state rule | Open trigger frame values must be paired with programmatic expanded semantics in later layers. |
| `shared contract` | Minimum readable width rule | Destination and trigger frame values must include a minimum inline size so pattern overflow can move items into `More` before controls become unreadable. |
| `shared contract` | Old variable rule | Later layers must not consume old 40 CSS variables as construction tokens. |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs#topNavigationFrameTokenSpec` |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/top-navigation-frame/contract.mjs` |
| Required roles or fields | `frameRole`, `backgroundValue`, `foregroundValue`, `supportingForegroundValue`, `borderValue`, `radiusValue`, `paddingBlockValue`, `paddingInlineValue`, `gapValue`, `minInlineSize`, `minBlockSize`, `shadowValue`, `zIndexValue`, `themeMapping`, `stateMapping` |
| Cross-system consumer rule | Every implementation may change concrete values, but must preserve top-navigation frame roles, required theme coverage, old-variable denial, and non-color current-state requirements. |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for top-navigation brand/destination/trigger/menu primitives after primitive gates pass. |
| `04-pattern-contract` | May consume this token only through accepted primitives unless the pattern owns a direct frame decision. |
| `standard-page-shell` | May consume the later accepted top-navigation pattern; it must not consume this token as a substitute for the child pattern. |
| app pages | Denied until component/adoption seams pass. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| rendered proof | Route shows chrome, rest destination, current destination, trigger, open trigger, and menu panel roles across original, dark, and desert themes. |
| accessibility | Current state is not treated as color-only; focus and target-size pairing are required in primitives. |
| reference pack | Pattern proof must verify `TRP-001` through `TRP-015B` without copying 40 route markup. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed after token verification` |
| Reason | The missing 41 top-navigation frame/state token seam now exists; primitives must own semantics, focus, truncation, and activation. |
