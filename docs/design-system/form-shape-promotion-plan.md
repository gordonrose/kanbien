# Form Shape Promotion Plan

This note keeps the entity body form work aligned with the Layer 1-4 harness.

The entity body panel may not render real form controls until each control family has its own governed chain. Proof-only placeholders must not be treated as governed controls.

## Promoted In This Slice

| Form shape | Current status | Governed chain |
| --- | --- | --- |
| Field row foundation | Review-ready | `form-field` behavior rule; `field-row-frame` token; `field-row-control` primitive |
| Single-line text field | Review-ready | `text-entry-control` behavior rule; `field-value-text-style` and `text-control-frame` tokens; `text-field-control` primitive |
| Textarea | Review-ready | `text-entry-control` behavior rule; `textarea-growth` token; `textarea-control` primitive |
| Entity body panel | Review-ready Layer 4 pattern | `entity-body-panel` pattern composes `body-region-control` and hosts already-governed child seams while blocking missing families |
| Accordion | Review-ready Layer 4 pattern | `accordion` behavior rule; `accordion-frame` token; `accordion-section-control` primitive; `accordion-group` pattern |
| Radio button simple select | Accepted Layer 4 field pattern | `radio-simple-select-field` composes `field-row-control` and `radio-simple-select` |
| Toggle on/off element | Review-ready Layer 4 field pattern | `toggle-field` composes `field-row-control` and `toggle-control` |
| Simple dropdown | Review-ready Layer 4 field pattern | `simple-dropdown-field` composes `field-row-control` and `simple-dropdown-control` |
| Card list prioritization/view-hide select | Review-ready Layer 4 field pattern | `card-list-select-field` composes `field-row-control` and `card-list-select` |

## Remaining Control Families

| Form shape | Earliest missing layer | Why it is not ready yet |
| --- | --- | --- |
| Drawer select | Layer 1 reusable foundations | Blocked by `panel-stack` and `searchable-selection-panel` behavior foundations before drawer-select-specific behavior can be honest. See `docs/design-system/drawer-select-panel-stack-implementation-plan.md`. |
| Workflow builder | Layer 1 behavior rule | Needs domain-shaped interaction model before tokens or primitives can be honest. |

## Recommended Next Order

1. Panel stack.
2. Searchable selection panel.
3. Drawer select.
4. Workflow builder.
5. Later component seam work for composing governed field patterns into higher-level entity form flows.

This order promotes reusable panel placement and searchable selection semantics
before drawer select consumes them. Drawer select must not invent side-panel
placement, stacked-panel overlay behavior, search behavior, selected/not-selected
grouping, selectable-card roots, or selected-summary cards locally.

## Rendered Views Added

- `/design-system/default/patterns/entity-body-panel`
- `/design-system/default/tokens/field-row-frame`
- `/design-system/default/primitives/field-row-control`
- `/design-system/default/tokens/field-value-text-style`
- `/design-system/default/tokens/text-control-frame`
- `/design-system/default/primitives/text-field-control`
- `/design-system/default/tokens/textarea-growth`
- `/design-system/default/primitives/textarea-control`
- `/design-system/default/tokens/accordion-frame`
- `/design-system/default/primitives/accordion-section-control`
- `/design-system/default/patterns/accordion-group`
- `/design-system/default/patterns/radio-simple-select-field`
- `/design-system/default/patterns/toggle-field`
- `/design-system/default/patterns/simple-dropdown-field`
- `/design-system/default/patterns/card-list-select-field`
