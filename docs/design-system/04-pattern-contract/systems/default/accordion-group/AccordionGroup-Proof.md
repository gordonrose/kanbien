# Accordion Group Default Proof

Status: `review-ready`

Layer: `04-pattern-contract`

Design system: `default`

Route: `/design-system/default/patterns/accordion-group`

Runtime seam:
`src/frontend/designSystem/layers/04-pattern-contract/accordion-group/index.mjs#accordionGroupPattern`

## Proof Scope

The proof renders a single-open accordion group using accepted
`accordion-section-control` primitives.

It exposes section count, expanded fixture, disabled section, content fixture,
hosted content width, long-title, supporting-text, theme, tone, and direction
controls.

The content fixture can render simple proof content or governed
`form-field-section` content inside every accordion panel. The sections host
representative governed field examples: identity text fields and textarea,
workflow radio/dropdown/toggle fields, display drawer/card-list fields, and a
compliance textarea. This proves hosted child patterns remain governed by
their own seams while `accordion-group` preserves single-open behavior.
Hosted content width is proof-only diagnostic pressure: it verifies that child
pattern responsive behavior remains owned by the child pattern instead of
being inferred from accordion direction, title pressure, or section count.

## Evidence

Focused checks:

- `tests/unit/designSystem/accordionGroupPattern.test.ts`
- `tests/visual/designSystem/patterns/accordionGroupPatternRoute.spec.ts`
