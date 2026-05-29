# Panel Header Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `panel` |
| Primitive name | `panel-header-control` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/panel-header-control/index.mjs#panelHeaderControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/panel-header-control` |

## Purpose

`panel-header-control` owns stable reusable panel-header behavior: fixed block
size, matching min/max block size, optional sticky top placement, title
truncation disclosure, and governed icon-action alignment.

It does not own the list, form body, body scroll region, embedded navigation,
route selection, backend data loading, app adoption, or product workflow.

## Token Dependencies

| Token | Required Variant |
| --- | --- |
| `panel-header-frame` | `panel-header-frame-default` |
| `label-text-style` | short label text |

## Primitive Dependencies

| Primitive | Reason |
| --- | --- |
| `icon-button-control` | Provides the optional icon-only action without recreating button semantics. |
| `truncating-label` | Provides governed title clipping, full-text tooltip disclosure, and keyboard access when the title does not fit. |

## Behavior And Accessibility Contract

The primitive renders a semantic `header` containing one title and, when
enabled, one governed icon button.

The header remains fixed height regardless of body, list, or action presence.
When the consuming pattern selects sticky placement, the primitive applies the
signed sticky inset from `panel-frame`.

Title text truncates within the available inline space through
`truncating-label`. The full-title tooltip appears only when rendered text is
actually clipped. The optional action keeps the accessible label and activation
behavior of `icon-button-control`.

## Consumer Restrictions

Consumers must not recreate header height, sticky placement, separator, title
truncation, tooltip disclosure, or action alignment locally.

Consumers must not use this primitive as proof that a panel body, panel
pattern, drawer, dialog, or app route is governed.
