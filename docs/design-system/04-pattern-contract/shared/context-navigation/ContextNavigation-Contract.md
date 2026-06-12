# Context Navigation Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `context-navigation` |
| Pattern name | `context-navigation` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/context-navigation/ContextNavigation-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/context-navigation/ContextNavigation-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/context-navigation/index.mjs#contextNavigationPattern` |
| Rendered proof | `/design-system/default/patterns/context-navigation` |

## Purpose

`context-navigation` composes the desktop context rail, primary item zone,
bottom-anchored utility zone, and mobile bottom bar.

It delegates item semantics to `context-navigation-item-control` and mobile
bottom-bar frame behavior to `context-navigation-bottom-bar`.

It does not own the full page shell, drawer payloads, tooltip disclosure,
routed app navigation, component props, canonical
scenarios, or app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Behavior rule | `context-navigation` is `review-ready` |
| Primitive dependency | `context-navigation-item-control` is `review-ready` for `default` |
| Primitive dependency | `context-navigation-bottom-bar` is `review-ready` for `default` |
| Primitive dependency | `context-navigation-overflow-menu` is `review-ready` for `default` |
| Direct token dependency | `context-navigation-frame` is `review-ready` for `default` |
| Inventory | Legacy 40-system context-navigation routes exist and are source inventory only, not contract truth. |

## Composition Contract

The pattern renders a composition wrapper with labelled navigation regions:

- desktop rail region
- primary item zone
- utility item zone anchored after the primary zone
- mobile bottom-bar region

Desktop rail sizing, spacing, surface, primary scroll posture, and utility
anchoring come from `context-navigation-frame`.

Every item must be rendered through `context-navigation-item-control`. The
pattern must not recreate item focus, target size, current semantics, disabled
behavior, or activation events.

Mobile bottom-bar placement and page-bottom reserve are delegated to
`context-navigation-bottom-bar`. The pattern supplies item controls as slot
content. When more than five mobile items are present, the first four render as
direct slots and all remaining primary or utility items remain reachable
through `context-navigation-overflow-menu`. Items must not be silently dropped.

## Accessibility Contract

- The desktop rail and mobile bottom bar expose labelled `nav` landmarks for their active viewport posture.
- Destination current state remains owned by `context-navigation-item-control`.
- Utility activation events bubble from child item primitives.
- The pattern does not introduce focus traps or route-local keyboard behavior.
- Mobile overflow must preserve item order and accessible names inside More.

## Direct Token Dependencies

| Token | Runtime seam | Pattern decision supported |
| --- | --- | --- |
| `context-navigation-frame` | `src/frontend/designSystem/layers/02-token/context-navigation-frame/systems/default.mjs#contextNavigationFrameTokenSpec` | Desktop rail size, rail padding, primary scroll behavior, utility anchoring, mobile breakpoint handoff. |

## Data Or Event Contract

The pattern accepts primary, utility, and mobile item arrays. Items are
controlled inputs and the pattern does not mutate them.

`context-navigation-item-control:activate` bubbles from utility item controls.
Proof-only routes may simulate current-state updates, but the pattern remains
controlled.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/context-navigation` |
| Rendered view status | `available` |

## Rendered Proof Controls

| Control | Source Of Truth | Downstream Consumable? | Browser Evidence | Why It Matters | Status |
| --- | --- | --- | --- | --- | --- |
| `viewport mode` | proof-only pressure over signed breakpoint behavior | `no proof-only` | `tests/visual/designSystem/patterns/contextNavigationPatternRoute.spec.ts` | Proves desktop rail and mobile bottom-bar composition. | `available` |
| `utility items` | pattern data contract | `no proof-only fixture` | `tests/visual/designSystem/patterns/contextNavigationPatternRoute.spec.ts` | Proves utility zone anchoring and mobile slot composition. | `available` |
| `activation handling` | proof-only consumer simulation | `no proof-only` | `tests/visual/designSystem/patterns/contextNavigationPatternRoute.spec.ts` | Proves bubbled utility item events can be consumed without pattern-local routing. | `available` |
| `direction` | accessibility pressure | `no proof-only` | `tests/visual/designSystem/patterns/contextNavigationPatternRoute.spec.ts` | Proves RTL containment for rail and bottom-bar composition. | `available` |

## Consumer Restrictions

Consumers must not recreate rail sizing, primary scroll zone, utility
anchoring, item semantics, mobile bottom-bar composition, overflow handling, or
current state semantics locally.

Consumers must not treat this pattern as a complete page shell, app route,
component seam, or drawer implementation.
