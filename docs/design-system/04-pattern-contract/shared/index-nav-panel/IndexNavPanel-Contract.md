# Index Nav Panel Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `index-nav` |
| Pattern name | `index-nav-panel` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/index-nav-panel/IndexNavPanel-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/index-nav-panel/IndexNavPanel-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-panel/index.mjs#indexNavPanelPattern` |
| Rendered proof | `/design-system/default/patterns/index-nav-panel` |

## Purpose

`index-nav-panel` composes a governed panel header, governed add action, scroll region,
empty state, and one governed `index-nav-list`.

It does not own the full entity page, primary/secondary coordination, route
selection state, backend data loading, component seam, canonical scenario, or
app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Behavior rule | `review-ready`; `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Pattern dependency | `index-nav-list` is `review-ready` for `default` |
| Primitive dependency | `index-nav-panel-header-control` and `index-nav-icon-button-control` are `review-ready` for `default` |
| Direct token dependencies | `index-nav-panel-frame` and `label-text-style` are `review-ready` for `default` |
| Inventory | Legacy/template index panel structures exist in entity-page and filter-panel routes, but are not the source of truth. |

## Composition Contract

The pattern renders one labelled panel with a governed header, optional add action,
scroll region, and either an `index-nav-list` or an empty state.

The pattern may choose standard or double width using the signed panel-frame
token. The signed panel-frame token also supplies the mobile breakpoint. On
mobile, page-scroll mode makes the panel full inline size and lets it scroll
with the document instead of trapping scroll inside the panel.

## Accessibility Contract

The header is the `index-nav-panel-header-control` primitive. The add action is
a native icon-button primitive inside that header. The list keeps its `nav`,
`ul`, and `li` semantics. Empty state text is visible plain text and is not a
fake list item.

Keyboard focus must enter the add action and list items in DOM order. Desktop
internal scrolling must not hide focused items from normal keyboard navigation.

## Data Or Event Contract

Input items contain `label`, optional `supportingText`, `value`, and optional
`disabled`.

Add activation bubbles as `index-nav-icon-button-control:activate`. Item
activation bubbles as `index-nav-item-control:activate`. The panel does not
route, fetch, persist, or mutate product data.

## Visual-Skin Boundary

Panel frame, width, mobile width, mobile breakpoint, scroll height, padding,
surface, border, radius, gap, header height, sticky header inset, title text
style, and add action frame values come from signed tokens. Item visuals come
from the list, item, and primitive dependencies.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/index-nav-panel` |
| Rendered view status | `available` |

## Rendered Proof Controls

| Control | Source Of Truth | Downstream Consumable? | Browser Evidence | Why It Matters | Status |
| --- | --- | --- | --- | --- | --- |
| `width mode` | `index-nav-panel-frame` | `yes` | `tests/visual/designSystem/patterns/indexNavPanelPatternRoute.spec.ts` | Proves standard and double width. | `available` |
| `mobile behavior` | pattern contract plus `index-nav-panel-frame` | `yes` | `tests/visual/designSystem/patterns/indexNavPanelPatternRoute.spec.ts` | Proves mobile page-scroll posture. | `available` |
| `item count` | pattern data contract | `no proof-only fixture` | `tests/visual/designSystem/patterns/indexNavPanelPatternRoute.spec.ts` | Proves empty, short, and scrollable lists. | `available` |
| `activation handling` | proof-only consumer simulation | `no proof-only` | `tests/visual/designSystem/patterns/indexNavPanelPatternRoute.spec.ts` | Proves events can either log only or update current in a simulated consumer. | `available` |
| `direction` | accessibility pressure | `no proof-only` | `tests/visual/designSystem/patterns/indexNavPanelPatternRoute.spec.ts` | Proves RTL containment and focusable controls. | `available` |

## Consumer Restrictions

Consumers must not copy route-local proof markup, recreate panel width or
scroll CSS, rebuild header behavior, rebuild add action behavior, or rebuild
list behavior locally.

Consumers must not treat this pattern as an entity-page component, route,
template, canonical scenario, or app adoption seam.

## Scroll Ownership

On desktop, the panel scroll region may own internal scrolling for long lists.

On mobile page-scroll placement, the list expands to its content height and the
page or rendered proof container owns scrolling.

Scrollbar appearance is browser-native for this pattern. Custom scrollbar
styling requires a future signed scrollbar token and primitive before it may be
used here.
