# Form Field Section Pattern Contract

## Purpose

`form-field-section` arranges governed field primitives and field patterns into
one reusable form section.

It owns section title/supporting text, field-container placement, two-column
desktop layout, `span-1` and `span-2` field spans, and single-column collapse
for narrow or mobile review.

It does not own field internals, validation lifecycle, submission, persistence,
accordion behavior, workflow builders, drawer internals, or app adoption.

## Upstream Gates

- Behavior rule: `docs/design-system/01-behavior-rule/shared/form-field/FormField-Behaviour.md`
- Primitive: `field-container-control`
- Hosted primitives/patterns must already be governed before occupying a field
  container.

## Composition Contract

Every field is rendered inside `field-container-control`.

Each field declares one span:

- `span-1`: one column in the desktop grid
- `span-2`: both columns in the desktop grid

Narrow and mobile review collapses every field to one column.

The pattern may host governed field primitives or governed field patterns. It
must not alter child semantics, focus behavior, keyboard behavior, tooltip
behavior, selection behavior, drawer overlay behavior, or state handling.

## Accessibility Contract

The section may expose a heading and supporting text.

Hosted fields own their own accessible names, descriptions, required state,
invalid state, disabled state, focus behavior, and native roles.

The section must not clip child focus rings, truncation tooltips, keyboard
selection hints, drawer overlays, or mobile disclosure paths.

## Consumer Boundary

Consumers must use this pattern for reusable form-field section layout instead
of creating local form grids or local field cards.

Consumers must not add local CSS values for field-container surfaces, padding,
border, radius, or sizing.

Consumers must not place an ungoverned field, selector, card, drawer, workflow
builder, or app-local control inside the section.

## Required Proof

The default proof must show:

- two `span-1` text fields sharing one desktop row
- one `span-2` textarea
- one `span-2` radio simple select field
- one `span-1` simple dropdown field
- one `span-1` toggle field
- one `span-2` drawer-select field
- one `span-2` priority card-list select field
- narrow/mobile collapse to one column
- drawer-select mobile overlay still covers the viewport
- truncated text disclosure works on hover or focus

Rendered proof route: `/design-system/default/patterns/form-field-section`
