# Surface Frame Token Contract

## Purpose

This shared token contract governs reusable surface frame values: background,
foreground, border, radius, and elevation.

It does not define component anatomy, layout grid, padding, interaction
behavior, or state semantics.

## Required Roles

- `panel surface`
- `elevated panel`
- `navigation surface`
- `showcase surface`

## Required Fields

- `surfaceRole`
- `backgroundValue`
- `foregroundValue`
- `borderValue`
- `borderWidthValue`
- `radiusValue`
- `shadowValue`
- `layoutContext`

## Allowed Consumers

Layer 3 primitives and Layer 4 pattern contracts may consume this token through
the governed runtime seam for the selected design system.

Surface treatment must not be the only indication of state, selection, or
interactivity.
