# Accordion Form Section Default Proof

Status: `review-ready`

Layer: `04-pattern-contract`

Design system: `default`

Route: `/design-system/default/patterns/accordion-form-section`

Runtime seam:
`src/frontend/designSystem/layers/04-pattern-contract/accordion-form-section/index.mjs#accordionFormSectionPattern`

## Proof Scope

The proof renders `accordion-form-section` by composing the accepted
`accordion-group` and `form-field-section` pattern seams.

It exposes expanded section, section width, viewport posture, theme, direction,
and drawer-open controls. The field fixtures include governed text fields,
textarea, radio simple select, simple dropdown, toggle, drawer select, and
card-list select examples.

The proof demonstrates that this pattern owns only the composition of accordion
sections plus form-field sections. Hosted controls keep their own behavior,
tokens, accessibility semantics, and overlays.

## Evidence

Focused checks:

- `tests/unit/designSystem/accordionFormSectionPattern.test.ts`
- `tests/visual/designSystem/patterns/accordionFormSectionPatternRoute.spec.ts`
