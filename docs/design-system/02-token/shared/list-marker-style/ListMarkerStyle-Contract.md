# List Marker Style Token Contract

## Purpose

This shared token contract governs reusable marker styling for governed lists
and proof tags.

It does not define list semantics, item spacing, text style, or status meaning.

## Required Roles

- `bullet marker`
- `process marker`
- `tag marker`

## Required Fields

- `markerRole`
- `inlineSizeValue`
- `blockSizeValue`
- `radiusValue`
- `backgroundValue`
- `borderValue`
- `layoutContext`

## Allowed Consumers

Layer 3 primitives and Layer 4 pattern contracts may consume this token through
the governed runtime seam for the selected design system.

Markers must not be the only carrier of status, validation, selected, or
interactive meaning.
