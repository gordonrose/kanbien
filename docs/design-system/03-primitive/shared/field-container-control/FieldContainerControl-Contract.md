# Field Container Control Primitive Contract

## Purpose

`field-container-control` is the governed primitive for rendering the outer container around one complete governed field or field pattern.

It owns the container frame and child boundary. It does not own labels, helper text, native input behavior, selector behavior, toggle behavior, radio behavior, validation, form submission, or product data.

## Upstream Gates

- Behavior rule: `docs/design-system/01-behavior-rule/shared/form-field/FormField-Behaviour.md`
- Token: `field-container-frame`

## Behavior Contract

The primitive renders one container with one child slot.

The child slot may be empty in proof routes, but real consumers must provide governed child content from an accepted primitive or pattern.

The primitive must not inspect, rewrite, or add behavior to the child field.

## Accessibility Contract

The primitive does not claim native input, group, region, validation, or form semantics by default.

Accessible names, descriptions, focus behavior, and native roles belong to the hosted child primitive or pattern.

The container frame must not clip focus rings, labels, helper text, error text, or tooltip disclosure from the hosted child.

## Consumer Boundary

Consumers must not recreate this container with local form-field cards, copied CSS, route-local wrappers, or app-local layout helpers.

Consumers must not override field-container surface, padding, border, radius, or sizing with local CSS values.

## Readiness Evidence

The default proof must show provided and empty slot posture, constrained width, RTL, token-backed frame values, and the child-behavior boundary.

Rendered proof route: `/design-system/default/primitives/field-container-control`
