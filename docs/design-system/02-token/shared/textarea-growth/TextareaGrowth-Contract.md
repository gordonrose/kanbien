# Textarea Growth Token Contract

## Purpose

`textarea-growth` governs row presets and maximum viewport-height caps for governed textarea primitives.

It prevents multi-line text controls from inventing local row counts, growth caps, or resize posture.

## Shared Contract

Every design system implementation must expose variants for:

- one-line default textarea posture
- five-line multi-line textarea posture
- fifteen-line paragraph textarea posture

Each variant must define initial row count, maximum viewport-height ratio, resize behavior, and growth behavior.

## Consumer Rules

Consumers must use the runtime token seam instead of local textarea row counts, max-height percentages, or resize behavior.

This token does not define value typography, input frame styling, label/helper structure, validation, persistence, or form submission.
