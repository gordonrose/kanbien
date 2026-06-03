# Accordion Section Control Primitive Contract

Status: `review-ready`

Layer: `03-primitive`

## Boundary

`accordion-section-control` owns one governed disclosure section: a labelled
header button, one controlled content region, expanded/collapsed state, disabled
blocking, focus behavior, optional supporting text, full-text disclosure for
the section title and supporting text, and a stable toggle event.

It does not own grouped accordion policy, single-open behavior, nested form
control behavior, product validation, persistence, workflow-builder behavior,
component seams, demos, canonicals, or app adoption.

## Upstream Gates

| Gate | Source |
| --- | --- |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/accordion/Accordion-Behaviour.md` |
| Frame token | `accordion-frame` |
| Text token | `label-text-style` |
| Supporting text token | `supporting-text-style` |
| Focus token | `focus-ring` |
| Target token | `minimum-target-size` |
| Text disclosure primitive | `truncating-label` |
| System glyph registry | `src/frontend/designSystem/systems/default/glyphs/registry.mjs#defaultGlyphRegistry` |

## Behavior Contract

The header button toggles the controlled content region between expanded and
collapsed. The button must expose `aria-expanded` and `aria-controls`.

The content region must reference the header button with `aria-labelledby`.

When a section collapses while focus is inside its content region, focus moves
back to the header button.

Disabled sections do not toggle.

## Accessibility Contract

The primitive must preserve native button keyboard behavior for Enter and
Space.

The header title and optional supporting text must expose full text through
`truncating-label` when either line truncates.

The decorative indicator must not provide the accessible name.

The primitive may indicate that nested content contains an error, but nested
field/control primitives own actual invalid semantics and error text.

## Public Consumer Boundary

Consumers may provide title, optional supporting text, initial expanded state,
disabled state, heading level, tone, error-containing flag, and governed child
HTML.

Consumers must not recreate header button markup, ARIA wiring, title
truncation disclosure, content-region ownership, token values, glyph drawing,
or toggle controller behavior locally.

## Required Evidence

Before later layers consume this primitive, proof must show:

- expanded and collapsed state
- disabled blocking
- header button keyboard/pointer toggle behavior
- `aria-expanded`, `aria-controls`, and region labelling
- title truncation disclosure
- supporting text truncation disclosure when supporting text is present
- focus return when collapsing focused content
- original, dark, and desert theme rendering
- RTL and constrained-width rendering without horizontal overflow
