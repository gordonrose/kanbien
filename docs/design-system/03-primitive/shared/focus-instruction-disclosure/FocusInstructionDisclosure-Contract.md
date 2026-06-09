# Focus Instruction Disclosure Primitive Contract

Layer: `03-primitive`
Status: `review-ready`
Behavior rule:
`docs/design-system/01-behavior-rule/shared/focus-instruction-disclosure/FocusInstructionDisclosure-Behaviour.md`

## Purpose

`focus-instruction-disclosure` is a governed primitive for a short, focus-only
keyboard instruction associated with one interactive host control.

It owns the instruction surface markup, token-backed visual treatment,
focus-only reveal behavior, and positioning relative to the focused host.

It does not own the host control's keyboard behavior, role, state, event
contract, helper text, validation text, or product copy.

## Token Dependencies

- `tooltip-surface`
- `tooltip-text-style`

These tokens are reused because the instruction is a floating disclosure
surface. The primitive is not a tooltip trigger and must not use hover-only
behavior.

## Behavior Contract

The primitive renders non-focusable instruction text and reveals it only while
its host control has focus.

Escape may hide the visible instruction without moving focus, changing host
state, or cancelling the host's own behavior.

The instruction text is supplied by the consuming primitive because each host
owns its own keyboard contract.

## Accessibility Contract

The host control must reference the instruction element with
`aria-describedby` when the instruction describes available keyboard behavior.

The instruction must not receive focus or replace the host's accessible name.

The primitive must preserve visible focus on the host control and must not
steal focus.

## Public Consumption Boundary

Runtime seam:
`src/frontend/designSystem/layers/03-primitive/focus-instruction-disclosure/index.mjs`

Exports:

- `focusInstructionDisclosurePrimitive`
- `renderFocusInstructionDisclosurePrimitive`
- `attachFocusInstructionDisclosurePrimitiveController`

Allowed consumers:

- lower-level interactive primitives that need focused keyboard instruction
- later patterns only through governed child primitives

Consumers must not copy the primitive's markup, route proof markup, or local
CSS. Consumers must not use it for persistent helper text, validation text,
hover-only tooltips, or product guidance.

## Required Evidence

Before later layers rely on this primitive, the default proof must show:

- visible instruction while the host has focus
- instruction hidden after focus leaves
- `aria-describedby` linking from host to instruction
- no focus theft
- desktop and constrained-width positioning
- token-backed theme rendering

## Rendered View

How to view:
`/design-system/default/primitives/focus-instruction-disclosure`
