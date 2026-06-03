# Spacing Scale Token Contract

## Purpose

This shared token contract governs reusable spacing values for page gutters,
section padding, content gaps, and compact gaps.

It does not define component anatomy, item count, or product workflow spacing.

## Required Roles

- `page gutter`
- `section padding`
- `content gap`
- `compact gap`

## Required Fields

- `spacingRole`
- `lengthValue`
- `layoutContext`
- `responsiveMapping`
- `densityMapping`

## Allowed Consumers

Layer 3 primitives and Layer 4 pattern contracts may consume this token through
the governed runtime seam for the selected design system.

Spacing must not be used to solve overflow, reading order, or target-size
requirements.
