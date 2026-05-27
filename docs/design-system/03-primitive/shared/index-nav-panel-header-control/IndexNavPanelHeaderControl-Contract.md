# Index Nav Panel Header Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `index-nav` |
| Primitive name | `index-nav-panel-header-control` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/index-nav-panel-header-control/index.mjs#indexNavPanelHeaderControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/index-nav-panel-header-control` |

## Purpose

`index-nav-panel-header-control` owns the stable panel-header behavior for
index navigation: fixed block size, matching min/max block size, sticky top
placement, title truncation, and governed add-action alignment.

It does not own the list, list scrolling, route selection, entity-page
structure, backend data loading, or app adoption.

## Token Dependencies

| Token | Required Variant |
| --- | --- |
| `index-nav-panel-frame` | `index-nav-panel-header-default` |
| `label-text-style` | short label text |

## Primitive Dependencies

| Primitive | Reason |
| --- | --- |
| `index-nav-icon-button-control` | Provides the optional icon-only add action without recreating button semantics. |

## Behavior And Accessibility Contract

The primitive renders a semantic `header` containing one title and, when
enabled, one governed icon button.

The header remains fixed height regardless of list length or add-action
presence. The header sticks to the top of its containing scroll context using
the signed sticky inset from `index-nav-panel-frame`.

Title text truncates within the available inline space. The add action keeps
the accessible label and activation behavior of `index-nav-icon-button-control`.

## Consumer Restrictions

Consumers must not recreate header height, sticky placement, title truncation,
or add-action alignment locally.

Consumers must not add custom scrollbar styling here. Scrollbar appearance is
browser-native unless a future signed scrollbar token and primitive approve a
custom skin.
