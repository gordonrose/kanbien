# Status Color Token Contract

Layer: `02-token`

Token type: `status-color`

Status: `review-ready`

Owning behavior rule: `docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md`

## Scope

`status-color` governs reusable colour pairings for status meaning.

The current review-ready variant is `warning` across original, dark, and desert themes.

This token does not define validation behavior, status copy, icons, live regions, selected state, disabled state, or component state transitions.

## Required Current Status

- `warning`

Success, info, destructive, and broader error status colours remain unapproved until added explicitly.

## Consumer Rules

Consumers must import the governed Layer 2 runtime seam before using warning colour in primitives or patterns.

Consumers must not invent local warning colours from screenshots, route-local CSS, app CSS, or chat history.

Status colour must never be the only cue for status meaning.

Rendered view: `/design-system/default/tokens/status-color`
