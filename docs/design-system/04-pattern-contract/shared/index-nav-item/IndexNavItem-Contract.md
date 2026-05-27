# Index Nav Item Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `entity-body-placement` |
| Pattern name | `index-nav-item` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/index-nav-item/IndexNavItem-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/index-nav-item/IndexNavItem-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-item/index.mjs#indexNavItemPattern` |
| Rendered proof | `/design-system/default/patterns/index-nav-item` |

## Purpose

`index-nav-item` is the rectangular item/card that can populate a primary or
secondary index navigation list.

It composes the governed `index-nav-item-control` primitive. It does not own
the full index list, page routing, tablist semantics, entity-page template,
component seam, backend data loading, or app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Behavior rule | `review-ready`; `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Primitive | `index-nav-item-control` is `review-ready` for `default` |
| Token dependencies | Consumed through `index-nav-item-control`; frame, surface, focus, target-size, label, and tooltip tokens are `review-ready` for `default` |
| Inventory | Legacy/template item markup exists in entity-page and filter-panel routes, but is not the source of truth. |

## Composition Contract

The pattern renders one `index-nav-item-control` primitive.

The pattern may place that primitive in a constrained slot and may pass label,
supporting text, value, theme, and item state to the primitive. It must not
rebuild button markup, truncation behavior, tooltip behavior, current state, or
disabled behavior locally.

The pattern exposes a single item/card only. A later Layer 4 index-list pattern
must own list-level roving, ordering, grouping, or section-selection rules if
those become necessary.

## Accessibility Contract

The composed item has exactly one focus target because the primitive renders a
native button.

Current state is exposed by the primitive through `aria-current="true"` and a
visible non-color marker. Disabled state is exposed through the native disabled
attribute and denies activation.

The visible label may truncate, but the full label remains the button's
accessible name and tooltip disclosure value.

## Allowed States

| State | Required Behavior |
| --- | --- |
| `resting` | Enabled item that can emit activation. |
| `hover` | Enabled item using the signed hover surface; hover must not imply current state. |
| `current` | Enabled item with programmatic current state and non-color visual marker. |
| `disabled` | Native disabled item that does not emit activation. |

## Data Or Event Contract

The pattern accepts one externally meaningful `label`, optional
`supportingText`, and `value` passed through to the primitive. Optional
supporting text must not change the item height because the primitive reserves
the supporting-text row geometry.

Activation is emitted by the primitive as
`index-nav-item-control:activate`. This pattern does not route, fetch, persist,
or mutate product data.

## Visual-Skin Boundary

Visual values arrive through the primitive and signed token seams. Design-system
implementations may vary appearance through those seams, but must preserve the
behavior, accessibility semantics, state meanings, and event contract.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Pattern module | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-item/index.mjs` |
| Pattern export | `indexNavItemPattern` |
| Render export | `renderIndexNavItemPattern` |
| Controller export | `attachIndexNavItemPatternController` |
| Allowed next consumers | Later Layer 4 list patterns, Layer 5 component seams, templates, canonical scenarios, and app adoption after their own gates pass. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Proof route verifies one focus target, activation, disabled denial, and no nested interactive controls. |
| accessibility | Proof route verifies role/name/state, visible focus, current marker, disabled behavior, tooltip disclosure, RTL-safe logical layout, and mobile/zoom containment. |
| primitive consumption | Runtime seam composes `index-nav-item-control`; it does not recreate the primitive. |
| rendered verification | `/design-system/default/patterns/index-nav-item` must render desktop and mobile without horizontal overflow. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/index-nav-item` |
| Rendered view status | `available` |

## Rendered Proof Controls

| Control | Source Of Truth | Why It Matters |
| --- | --- | --- |
| `theme` | signed primitive token dependencies | Proves the item skin can switch without behavior changes. |
| `item state` | primitive state model and signed surface tokens | Proves current, hover, resting, and disabled states. |
| `supporting text` | optional primitive data contract | Proves hidden supporting text preserves stable item height without fake accessible content. |
| `direction` | accessibility and logical-layout pressure | Proves RTL rendering preserves semantics, truncation, tooltip placement, and containment. |
| `review scale` | browser magnification pressure | Proves enlarged review rendering remains contained without changing behavior. |
| `slot width` | pattern proof constraint | Proves truncation and tooltip behavior in constrained item slots. |

## Consumer Restrictions

Consumers must not recreate primitive behavior, markup, ARIA, state handling, or
token values locally.

Consumers must not use legacy top-level `/design-system/patterns` route markup,
screenshots, chat history, or app-page CSS as the pattern source of truth.

Consumers must not treat this pattern as a component seam, template, canonical,
or app adoption seam.
