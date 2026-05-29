# Form Shape Promotion Plan

This note keeps the entity body form work aligned with the Layer 1-4 harness.

The entity body panel may not render real form controls until each control family has its own governed chain. Proof-only placeholders must not be treated as governed controls.

## Promoted In This Slice

| Form shape | Current status | Governed chain |
| --- | --- | --- |
| Field row foundation | Review-ready | `form-field` behavior rule; `field-row-frame` token; `field-row-control` primitive |
| Single-line text field | Review-ready | `text-entry-control` behavior rule; `field-value-text-style` and `text-control-frame` tokens; `text-field-control` primitive |
| Textarea | Review-ready | `text-entry-control` behavior rule; `textarea-growth` token; `textarea-control` primitive |
| Entity body panel | Review-ready Layer 4 pattern | `entity-body-panel` pattern composes `body-region-control` and hosts future governed controls |

## Remaining Control Families

| Form shape | Earliest missing layer | Why it is not ready yet |
| --- | --- | --- |
| Radio button simple select | Layer 1 behavior rule | Needs selection behavior, group naming, keyboard behavior, selected state, disabled state, and option data contract. |
| Card list prioritization select | Layer 1 behavior rule | Needs ordering behavior, selected priority semantics, card/item state, keyboard behavior, and no-color-only state rules. |
| Card list view/hide select | Layer 1 behavior rule | Needs selected versus hidden semantics, state naming, keyboard behavior, and list-item contract. |
| Toggle on/off element | Layer 1 behavior rule | Needs switch semantics, pressed/checked state, disabled/read-only posture, and target/focus token dependencies. |
| Simple dropdown | Layer 1 behavior rule | Needs trigger/listbox/menu decision, keyboard behavior, popover positioning, selected value contract, and empty option behavior. |
| Drawer select | Layer 1 behavior rule | Needs drawer layering, single versus multiple selection behavior, search/filter posture, close behavior, and mobile rules. |
| Accordion | Layer 1 behavior rule | Needs disclosure semantics, heading/button relationship, multi-open policy, keyboard behavior, and nested field relationship. |
| Workflow builder | Layer 1 behavior rule | Needs domain-shaped interaction model before tokens or primitives can be honest. |

## Recommended Next Order

1. Radio button simple select.
2. Toggle on/off element.
3. Simple dropdown.
4. Accordion.
5. Card list select foundation, then prioritization and view/hide variants.
6. Drawer select.
7. Workflow builder.

This order promotes the smallest reusable control semantics first, then builds toward the more composite form-builder surfaces.

## Rendered Views Added

- `/design-system/default/patterns/entity-body-panel`
- `/design-system/default/tokens/field-row-frame`
- `/design-system/default/primitives/field-row-control`
- `/design-system/default/tokens/field-value-text-style`
- `/design-system/default/tokens/text-control-frame`
- `/design-system/default/primitives/text-field-control`
- `/design-system/default/tokens/textarea-growth`
- `/design-system/default/primitives/textarea-control`
