# Typography Scale Token Contract

## Purpose

This shared token contract governs reusable editorial typography values.

It does not define form labels, status text, tooltip text, compact control text,
component anatomy, or text-overflow disclosure behavior.

## Required Roles

- `eyebrow text`
- `page title`
- `body copy`
- `section heading`

## Required Fields

- `textStyleRole`
- `fontFamilyValue`
- `fontSizeValue`
- `fontWeightValue`
- `lineHeightValue`
- `letterSpacingValue`
- `textTransform`
- `layoutContext`
- `zoomBehavior`

## Allowed Consumers

Layer 3 primitives and Layer 4 pattern contracts may consume this token through
the governed runtime seam for the selected design system.

Normal editorial text should wrap naturally. Truncation requires a later
overflow-disclosure decision.
