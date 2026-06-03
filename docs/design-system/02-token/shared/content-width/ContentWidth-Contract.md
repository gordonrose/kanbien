# Content Width Token Contract

## Purpose

This shared token contract governs reusable content measures that can be varied
by design system without changing layout behavior.

It does not define grid anatomy, breakpoint behavior, component APIs, or app
routes.

## Required Roles

- `content measure`
- `text measure`
- `media minimum`

## Required Fields

- `widthRole`
- `inlineSizeValue`
- `layoutContext`
- `responsiveMapping`
- `overflowRule`

## Allowed Consumers

Layer 3 primitives and Layer 4 pattern contracts may consume this token through
the governed runtime seam for the selected design system.

App pages must not recreate these widths with local CSS.
