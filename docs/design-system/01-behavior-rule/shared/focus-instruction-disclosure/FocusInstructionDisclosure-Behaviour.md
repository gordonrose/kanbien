# Focus Instruction Disclosure Behaviour

Layer: `01-behavior-rule`
Status: `review-ready`

## Purpose

Focused interactive controls sometimes need a short instruction for keyboard
behavior that is available only when that control can use it.

This behavior governs that focused instruction. It is not a general tooltip,
helper text, validation message, or product explanation.

## Behavior Rule

When an interactive control has focus and exposes non-obvious keyboard
behavior, it may reveal a short instruction near the focused control.

The instruction must explain the currently available keyboard action in plain
language. It must not describe behavior that the focused control does not
support.

The instruction must disappear when focus leaves the owning control. Escape may
dismiss the visible instruction without moving focus or changing the control's
state.

## Accessibility Rule

The focused control must reference the instruction with `aria-describedby` when
the instruction is part of the control's keyboard affordance.

The instruction must not receive focus, trap focus, steal focus, or replace the
control's own accessible name.

The instruction must be visible when it is meant to help keyboard users, not
hover-only.

## Boundary

This behavior does not define:

- the visual token values for the instruction surface
- the keyboard shortcut itself
- the focused control's role, state, or emitted event
- pattern-level reorder, selection, drag, or drawer behavior

Those decisions belong to tokens, primitives, or patterns that consume this
behavior.

## Forbidden Behavior

Consumers must not use this behavior for persistent field help, validation
copy, route-local product instructions, hover-only text disclosure, or native
browser behavior that is already obvious from the focused control.

Consumers must not duplicate local keyboard-instruction markup when a governed
primitive exists.
