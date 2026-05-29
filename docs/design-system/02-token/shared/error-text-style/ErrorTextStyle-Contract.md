# Error Text Style Token Contract

## Purpose

`error-text-style` governs field-row error message typography and foreground.

It prevents field rows, text fields, text areas, and later form patterns from
borrowing helper/supporting text styles or inventing local error text color.

## Shared Contract

Every design-system implementation must expose a field error text variant
before field-row primitives render error messages.

The token must provide font family, fallback rule, font size, font weight, line
height, letter spacing, transform, foreground, overflow readiness, and zoom
behavior.

## Consumer Rules

Consumers must use the runtime token seam instead of local error text
typography or color literals.

This token does not define validation copy, invalid semantics, input frame
color, focus behavior, or form submission.
