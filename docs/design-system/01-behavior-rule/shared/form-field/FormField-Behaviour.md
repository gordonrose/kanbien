# Form Field Behavior

## Purpose

Govern the shared structure that lets a future form control present a label, optional description, optional error/status copy, and a stable control slot without inventing the control itself.

This rule exists because entity body panels will need text fields, text areas, radios, selectors, toggles, accordions, and builders. Those controls must not each invent their own label, helper text, error wiring, spacing, or state posture.

## Behavior Contract

A form field must expose one field label and one control slot.

The label must remain associated with the hosted control by IDs or by a later governed control adapter. The field row may prepare the relationship, but it must not fake native input behavior.

Helper, status, and error copy are optional. When present, the field row must expose stable description IDs so the hosted control can reference them.

The field row may expose visual and semantic state hooks for `default`, `required`, `read-only`, `disabled`, and `error`, but it must not decide product validation, submitted values, input parsing, or persistence behavior.

## Accessibility Contract

The field label must be programmatically referenceable by the hosted control.

Description and error text must be programmatically referenceable by the hosted control without relying on color alone.

Disabled and read-only states must not be represented only by visual styling. A later hosted-control primitive owns the native `disabled`, `readonly`, keyboard, and focus behavior for the actual control.

Field rows must preserve readable order in LTR and RTL layouts.

The shared accessibility default remains `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

## Layer Classification

Layer 2 token work is needed for reusable field-row spacing, control-slot minimum size, label-to-control gap, and message spacing.

Layer 3 primitive work is needed for a `field-row-control` primitive that renders the label, helper/error IDs, state hooks, and child slot.

Layer 4 pattern work is needed later for grouped form sections, accordions, form preview/loading shapes, and entity-body form composition.

Text input, text area, radio, toggle, dropdown, drawer select, card select, and workflow builder behavior are separate downstream families. They are blocked until their own behavior rules, tokens, and primitives exist.

## Forbidden Moves

Do not build a native input, textarea, selector, radio group, toggle, accordion, workflow builder, or product form inside the field-row rule.

Do not style labels, helper text, spacing, borders, target sizes, or error treatment locally in later primitives or patterns when a signed token seam exists.

Do not copy form markup from an entity page, template route, screenshot, or older design-system token page into a governed primitive.

Do not treat proof-only slot content as a governed form control.

## Readiness Gate

This behavior rule is ready for Layer 2 only when the next token explicitly governs the field-row frame without defining any hosted control behavior.
