# Field Row Frame Token Contract

## Purpose

`field-row-frame` governs reusable spacing and sizing values for a field row that hosts one label, one future control slot, and optional helper or error text.

It prevents each future form-control primitive from inventing its own label gap, message gap, hosted-control minimum slot size, or visual grouping density.

## Shared Contract

Every design system implementation must expose one default field-row frame variant before `field-row-control` or later form-control primitives may consume field-row layout values.

The token must provide:

- field role
- row gap
- label-to-control gap
- control-to-message gap
- control slot minimum block size
- control slot boundary value
- minimum inline size
- maximum inline size
- readable-order guidance

## Consumer Rules

Consumers must use the runtime token seam instead of local field-row spacing, control-slot minimum size, or width literals.

This token does not approve native input styling, textarea sizing, selector behavior, radio state, toggle behavior, validation semantics, product copy, form submission, or app adoption.

If a downstream control needs border, background, radius, error color, focus behavior, or typography not already signed, it must return to Layer 2 before implementation.

## Required Proof

The default design-system proof route must show the upstream token dependencies, final spacing and size values, and at least one rendering of the actual label, hosted-control slot, and helper/error-message relationship. A generic surface card is not enough evidence for this token because it cannot show the governed gaps.
