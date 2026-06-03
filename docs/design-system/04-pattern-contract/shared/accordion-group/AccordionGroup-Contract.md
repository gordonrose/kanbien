# Accordion Group Pattern Contract

Status: `review-ready`

Layer: `04-pattern-contract`

## Boundary

`accordion-group` composes multiple `accordion-section-control` primitives into
a reusable single-open section group for form and builder surfaces.

It does not define product validation, persistence, workflow-builder behavior,
component seams, demos, canonicals, or app adoption.

## Upstream Gates

| Gate | Source |
| --- | --- |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/accordion/Accordion-Behaviour.md` |
| Primitive | `accordion-section-control` |

## Composition Contract

The pattern must render each section through
`accordion-section-control`. It must not recreate section header buttons,
ARIA relationships, indicator glyphs, title truncation disclosure, or
expanded/collapsed controller behavior.

Only one section may be open at the same time. When a section opens, the group
must collapse any other expanded sibling section in that group. A collapsed
all-closed group is allowed when the user collapses the currently open section.

Section tone and optional supporting text are forwarded to the governed
`accordion-section-control` primitive; the group must not restyle those values
locally.

## Accessibility Contract

The group must preserve each section's header button, content region, keyboard
behavior, focus behavior, disabled blocking, and title disclosure.

Nested controls inside visible sections keep their own labels, focus behavior,
validation semantics, and events.

## Public Consumer Boundary

Consumers may provide group label, section values, section titles, optional
section supporting text, tone, initial open states, disabled flags,
error-containing flags, and governed child HTML.

Consumers must not render local accordion section markup or controller logic.

## Required Evidence

Before later layers consume this pattern, proof must show:

- the group preserves single-open behavior
- disabled sections do not toggle
- section events are visible at the group level
- opening one section collapses its previously open sibling
- long titles use truncation disclosure
- supporting text can be shown, hidden, and truncated with disclosure
- original, dark, and desert rendering
- RTL and constrained/mobile width without horizontal overflow
