# Index Nav List Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `entity-body-placement` |
| Pattern name | `index-nav-list` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/index-nav-list/IndexNavList-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/index-nav-list/IndexNavList-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-list/index.mjs#indexNavListPattern` |
| Rendered proof | `/design-system/default/patterns/index-nav-list` |

## Purpose

`index-nav-list` composes multiple governed `index-nav-item` patterns into one
vertical index navigation list.

It does not own page layout, panel layout, scrolling containers, route changes,
data fetching, entity-page templates, component seams, canonical scenarios, or
app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Behavior rule | `review-ready`; `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Pattern dependency | `index-nav-item` is `review-ready` for `default` |
| Direct token dependency | `index-nav-list-gap` and `focus-ring` are `review-ready` for `default` |
| Inventory | Legacy/template index lists exist in entity-page and filter-panel routes, but are not the source of truth. |

## Composition Contract

The pattern renders one `nav` with a visible accessible name, containing a
semantic list of `index-nav-item` entries.

Each item is rendered through `renderIndexNavItemPattern`. The list pattern may
choose which item is current, which items are disabled, and which values are
emitted upward, but it must not rebuild item markup or primitive behavior.

Exactly one item may be current when a `currentValue` is provided.

## Accessibility Contract

The list uses native `nav`, `ul`, and `li` semantics. Button role/name/state
behavior remains owned by the `index-nav-item-control` primitive inside each
item.

The list must preserve visible focus, current state, disabled state, tooltip
disclosure, and keyboard activation by composing the item pattern unchanged.

Because the governed focus ring draws outside each item box, the list must
reserve the signed focus-ring containment inset around the item stack. Scroll
or panel hosts must not clip item focus shells.

## Data Or Event Contract

Input items contain `label`, optional `supportingText`, `value`, and optional
`disabled`.

Items with and without supporting text must keep stable item height because the
composed `index-nav-item` pattern preserves the primitive's reserved
supporting-text row geometry.

Activation bubbles from the underlying primitive as
`index-nav-item-control:activate`. The list does not route or mutate data.

## Visual-Skin Boundary

Spacing between items comes from `index-nav-list-gap`. Focus containment around
the item stack comes from `focus-ring`. Item surfaces, typography, current
indicator, tooltip, focus rendering, and target-size values come from the item
pattern and primitive dependencies.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/index-nav-list` |
| Rendered view status | `available` |

## Rendered Proof Controls

| Control | Source Of Truth | Why It Matters |
| --- | --- | --- |
| `theme` | signed item-pattern and primitive token dependencies | Proves list composition survives skin changes. |
| `current item` | list data contract | Proves exactly one current item can be selected by value. |
| `disabled item` | item primitive disabled state | Proves disabled state is delegated to the item without local behavior. |
| `item count` | list composition contract | Proves multiple item counts preserve list semantics and spacing. |
| `supporting text` | optional item data contract | Proves hidden supporting text preserves stable item height through composition. |
| `direction` | accessibility and logical-layout pressure | Proves RTL rendering preserves list semantics, item behavior, tooltip placement, and containment. |
| `review scale` | browser magnification pressure | Proves enlarged review rendering remains contained without changing behavior. |
| `slot width` | pattern proof constraint | Proves constrained-width list rendering stays contained. |

## Consumer Restrictions

Consumers must not copy route-local proof markup, recreate list spacing, or
rebuild item behavior locally.

Consumers must not remove the focus containment inset or replace it with a
local padding value.

Consumers must not treat this pattern as an entity-page component, route,
template, canonical scenario, or app adoption seam.
