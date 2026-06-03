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

It exposes section count, expanded fixture, disabled section, long-title,
supporting-text, theme, tone, and direction controls.

## Evidence

Focused checks:

- `tests/unit/designSystem/accordionGroupPattern.test.ts`
- `tests/visual/designSystem/patterns/accordionGroupPatternRoute.spec.ts`
