# Visual Proof Ornament Token Contract

## Purpose

This shared token contract governs reusable visual materials for abstract proof
and diagram surfaces.

It does not define illustration layout, chip count, artifact content, product
workflow, animation, component DOM, or semantic state.

## Required Roles

- `grid lines`
- `visual chip`
- `connector line`
- `accent bar`
- `overlay wash`
- `visual marker`

## Required Fields

- `ornamentRole`
- `backgroundValue`
- `foregroundValue`
- `gridColorValue`
- `gridSizeValue`
- `chipBackgroundValue`
- `chipBorderValue`
- `chipRadiusValue`
- `chipOpacityValue`
- `lineColorValue`
- `lineSizeValue`
- `accentBarValue`
- `overlayValue`
- `markerSizeValue`
- `markerBackgroundValue`
- `markerRadiusValue`
- `layoutContext`

## Allowed Consumers

Layer 3 primitives and Layer 4 pattern contracts may consume this token through
the governed runtime seam for the selected design system.

Visual ornaments must not be the only carrier of status, validation, selected,
or proof outcome meaning.
