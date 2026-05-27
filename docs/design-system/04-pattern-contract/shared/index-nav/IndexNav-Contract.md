# Index Nav Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `index-nav` |
| Pattern name | `index-nav` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/index-nav/IndexNav-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/index-nav/IndexNav-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/index-nav/index.mjs#indexNavPattern` |
| Rendered proof | `/design-system/default/patterns/index-nav` |

## Purpose

`index-nav` composes a primary index-nav panel and an optional secondary panel.
It governs whether the navigation is single or double width and whether panels
render with header chrome, as list-only panels, or with resize handles. It
delegates panel container, add action, scroll, resize, empty state, and list
behavior to `index-nav-panel`.

It does not own the full entity page, routed selection state, backend data
loading, component seam, canonical scenario, or app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Pattern dependency | `index-nav-panel` is `review-ready` for `default` |
| Direct token dependency | `index-nav-panel-frame` supplies the gap between composed panels |
| Inventory | Legacy/template index navigation exists in entity-page routes, but is not the source of truth. |

## Composition Contract

The pattern renders one primary panel and may render one secondary panel. When
secondary is present, double width is enabled by panel composition. When
secondary is absent, the primary panel may be configured as standard or double
width. Mobile stacking uses the signed breakpoint from `index-nav-panel-frame`,
not a pattern-local media-query value. Panels may be rendered with header chrome
or as list-only panels by passing `showHeader: false` and `showAddAction:
false` through the governed panel options.
Panels may be made resizable by passing `resizable: true`; min and max width
still come from `index-nav-panel-frame`.

## Accessibility Contract

The pattern preserves each panel's labelled region, add action, list semantics,
keyboard focus order, empty state, and scroll posture. It must not introduce
additional focus traps or route-local keyboard behavior.

## Direct Token Dependencies

| Token | Runtime seam | Pattern decision supported |
| --- | --- | --- |
| `index-nav-panel-frame` | `src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec` | Gap between primary and secondary panels; mobile stacking breakpoint. |

## Data Or Event Contract

Primary and secondary panels each receive their own item arrays and current
values. Add and item activation events bubble from the composed primitives. The
pattern remains controlled and does not mutate route or product data.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/index-nav` |
| Rendered view status | `available` |

## Rendered Proof Controls

| Control | Source Of Truth | Downstream Consumable? | Browser Evidence | Why It Matters | Status |
| --- | --- | --- | --- | --- | --- |
| `secondary panel` | pattern contract | `yes` | `tests/visual/designSystem/patterns/indexNavPatternRoute.spec.ts` | Proves single-panel and two-panel composition. | `available` |
| `single-panel width` | `index-nav-panel-frame` via `index-nav-panel` | `yes` | `tests/visual/designSystem/patterns/indexNavPatternRoute.spec.ts` | Proves standard versus double primary width when no secondary panel is present. | `available` |
| `primary items` | pattern data contract | `no proof-only fixture` | `tests/visual/designSystem/patterns/indexNavPatternRoute.spec.ts` | Proves empty, short, and scrollable primary list states. | `available` |
| `panel chrome` | pattern contract | `yes` | `tests/visual/designSystem/patterns/indexNavPatternRoute.spec.ts` | Proves header/add and list-only variants. | `available` |
| `resize handle` | `index-nav-panel` pattern | `yes` | `tests/visual/designSystem/patterns/indexNavPanelPatternRoute.spec.ts` | Proves resizable panels consume the governed resize primitive and panel min/max width. | `available` |
| `activation handling` | proof-only consumer simulation | `no proof-only` | `tests/visual/designSystem/patterns/indexNavPatternRoute.spec.ts` | Proves bubbled events can be consumed without pattern-local routing. | `available` |
| `mobile behavior` | `index-nav-panel-frame` plus panel contract | `yes` | `tests/visual/designSystem/patterns/indexNavPatternRoute.spec.ts` | Proves mobile page-scroll posture from the signed breakpoint. | `available` |
| `direction` | accessibility pressure | `no proof-only` | `tests/visual/designSystem/patterns/indexNavPatternRoute.spec.ts` | Proves RTL containment for the composed pattern. | `available` |

## Scroll Ownership

On desktop, child panels may own internal list scrolling for long lists.

On mobile page-scroll placement, child lists expand to content height and the
page or rendered proof container owns scrolling.

## Consumer Restrictions

Consumers must not recreate panel layout, add actions, list behavior, panel gap, width
logic, scroll behavior, or route-local current updates.
