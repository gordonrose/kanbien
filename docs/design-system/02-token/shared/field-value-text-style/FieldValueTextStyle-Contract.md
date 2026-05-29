# Field Value Text Style Token Contract

## Purpose

`field-value-text-style` governs typography for user-entered or user-visible values inside form controls.

It is separate from `label-text-style` because labels and entered values have different reading roles.

## Shared Contract

Every design system implementation must expose a default field-value text style before text fields or text areas may render value text.

The token must provide the font family fallback stack, font size, font weight, line height, letter spacing, text transform, overflow readiness, and zoom behavior.

## Consumer Rules

Consumers must use the runtime token seam instead of local input font literals.

This token does not define label text, helper text, validation color, input frame geometry, placeholder behavior, parsing, persistence, or submission.
