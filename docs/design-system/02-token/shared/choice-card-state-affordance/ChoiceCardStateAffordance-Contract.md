# Choice Card State Affordance Token Contract

Layer: `02-token`
Status: `review-ready`
Contract owner: shared design-system token harness
Behavior rule: `docs/design-system/01-behavior-rule/shared/card-list-select/CardListSelect-Behaviour.md`

## Purpose

`choice-card-state-affordance` governs the reusable leading state-glyph slot and trailing state-text slot used by multi-select choice cards.

It exists because card-list select has two state variants that would otherwise invite primitive-local layout literals: visible/hidden and priority/not-on. The token defines the affordance geometry and state text role; the primitive owns selection behavior and the design-system implementation owns concrete rendering.

## Shared Contract

Every design system implementation must preserve:

- a leading affordance slot for the state glyph
- a trailing affordance slot for state text such as `Visible`, `Hidden`, `Priority n`, or `Not on`
- signed glyph slot size, leading slot inline size, trailing slot minimum inline size, and content gap
- signed foreground pairing for active and inactive state communication
- a clear statement that glyph artwork is a semantic role, not token-owned drawing

## Required Variants

The shared contract requires these affordance states:

- `visible`
- `hidden`
- `priority-selected`
- `priority-not-on`

Each implementation may render the glyph artwork differently, but it must keep the semantic glyph role stable.

## Required Fields

Each variant must expose:

- `affordanceRole`
- `variant`
- `state`
- `theme`
- `glyphSemantic`
- `glyphDisplay`
- `stateTextRole`
- `glyphInlineSize`
- `glyphBlockSize`
- `leadingInlineSize`
- `trailingMinInlineSize`
- `contentGapValue`
- `glyphColorValue`
- `stateTextColorValue`
- `stateTextStyleTokenName`

## Consumer Rules

Layer 3 primitives may consume this token only for governed card-list select state affordances.

Consumers must not:

- invent local glyph slot sizes, trailing status widths, or card state gaps
- use color as the only state signal
- treat token glyph semantics as final icon artwork
- use this token for navigation items, buttons, text fields, dropdowns, or arbitrary cards
- define priority ordering behavior in the token layer

The card-list select primitive must pair this token with native multi-select semantics, `choice-option-frame`, `choice-group-layout`, focus visibility, text disclosure, and keyboard behavior.

## Rendered View

Review the default implementation at:

`/design-system/default/tokens/choice-card-state-affordance`
