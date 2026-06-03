# Accordion Section Control Default Proof

Status: `review-ready`

Layer: `03-primitive`

Design system: `default`

Route: `/design-system/default/primitives/accordion-section-control`

Runtime seam:
`src/frontend/designSystem/layers/03-primitive/accordion-section-control/index.mjs#accordionSectionControlPrimitive`

## Proof Scope

The default proof renders one accordion section using signed `accordion-frame`,
`label-text-style`, `supporting-text-style`, `focus-ring`,
`minimum-target-size`, `truncating-label`, and the default glyph registry.

The proof exposes expanded/collapsed, disabled, theme, tone, title length,
supporting-text presence/pressure, content pressure, and direction controls.

## Evidence

Focused checks:

- `tests/unit/designSystem/accordionSectionControlPrimitive.test.ts`
- `tests/visual/designSystem/primitives/accordionSectionControlPrimitiveRoute.spec.ts`
