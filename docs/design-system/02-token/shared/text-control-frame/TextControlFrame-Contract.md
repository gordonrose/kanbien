# Text Control Frame Token Contract

## Purpose

`text-control-frame` governs the reusable surface, foreground, border, radius, padding, and minimum block size for text-entry controls.

It prevents text fields and text areas from inventing local input frame values.

## Shared Contract

Every design system implementation must expose default, required, read-only, disabled, and error text-control frames for each supported theme before text-entry primitives consume control geometry and visual state.

Each variant must provide state, theme, background, foreground, border, radius, block padding, inline padding, minimum block size, and maximum inline size.

## Consumer Rules

Consumers must use the runtime token seam instead of local text-control surface, foreground, border, padding, radius, or minimum-height literals.

This token does not define value typography, focus ring behavior, field labels, helper text, textarea auto-growth, parsing, persistence, or form submission.
