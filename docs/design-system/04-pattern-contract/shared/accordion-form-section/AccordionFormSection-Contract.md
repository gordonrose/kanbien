# Accordion Form Section Pattern Contract

Status: `review-ready`

Layer: `04-pattern-contract`

## Boundary

`accordion-form-section` composes governed `accordion-group` sections whose
expanded panels contain governed `form-field-section` layouts.

It prevents later entity body, template, or component surfaces from manually
wiring accordion sections and form-field sections together.

It does not own individual fields, validation lifecycle, submission,
persistence, workflow-builder behavior, drawer internals, component seams,
demos, canonicals, or app adoption.

## Upstream Gates

| Gate | Source |
| --- | --- |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/accordion/Accordion-Behaviour.md`; `docs/design-system/01-behavior-rule/shared/form-field/FormField-Behaviour.md` |
| Child patterns | `accordion-group`; `form-field-section` |
| Hosted controls | Each field's `contentHtml` must come from governed primitives or governed field patterns. |

## Composition Contract

The pattern must render the outer group through `accordion-group`.

Each accordion section's content must be a `form-field-section`; the pattern
must not create route-local form grids, field boxes, accordion headers, section
buttons, ARIA wiring, focus behavior, tooltip behavior, drawer behavior, or
token values.

Each field declares one span:

- `span-1`: one column in the desktop form-field section grid
- `span-2`: both columns in the desktop form-field section grid

Narrow or mobile viewport posture is forwarded to the child
`form-field-section`. The accordion-form-section pattern does not calculate its
own breakpoints.

## Accessibility Contract

The accordion group preserves single-open behavior, disabled blocking, heading
structure, focus behavior, and title/supporting-text disclosure.

Each hosted form-field section preserves its section heading, supporting text,
field-container layout, and child field semantics.

Hosted controls own their own accessible names, descriptions, validation state,
keyboard behavior, focus retention, drawer overlays, and text disclosure.

## Public Consumer Boundary

Consumers may provide group label, section values, section titles, optional
section supporting text, initial expanded state, disabled/error flags, child
form-section title/supporting text, section viewport posture, and governed
field entries.

Consumers must not locally reconstruct accordion-group or form-field-section
markup, controller behavior, or CSS values.

Consumers must not place ungoverned controls inside section fields.

## Required Evidence

Before later layers consume this pattern, proof must show:

- single-open accordion behavior survives hosted form sections
- desktop `span-1` fields share a row
- `span-2` fields fill the row
- narrow/mobile posture collapses fields to one column
- drawer-select fields preserve page-shell overlay behavior when hosted inside
  an accordion form section
- child field keyboard behavior remains owned by the child field pattern
- RTL and theme controls change rendered proof without horizontal overflow

Rendered proof route: `/design-system/default/patterns/accordion-form-section`
