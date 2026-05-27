# Rendered Proof Requirements

Use these requirements for frontend-visible proof routes created or revised by
active governed layers.

## Purpose

A rendered proof is not only a preview. It is browser evidence that a governed
decision can be reviewed without reading source code or trusting chat history.

## Required Proof Content

Every rendered proof must make these facts visible or explicitly
not-applicable:

- the exact governed layer and seam being reviewed
- the source behavior rule
- upstream token, primitive, or pattern dependencies
- which values are signed runtime values
- which controls are proof-only diagnostic pressure
- how to tell whether a dependency changes the rendered result
- what later layers may consume
- what later layers must not copy

## Derived Or Dependent Token Proofs

If a token is derived from, paired with, aliases, or is affected by another
token or variant, the proof must show:

- upstream token identity
- upstream value
- formula or mapping
- final rendered value
- proof-only diagnostic override when changing the upstream value would change
  rendered output

The proof must make clear that diagnostic overrides do not mutate signed token
values, readiness indexes, behavior contracts, or system implementation truth.

## Primitive Proofs

Primitive proofs must show the primitive in the states that affect behavior,
semantics, emitted events, focus, disabled behavior, text overflow, tooltip
disclosure, target size, or accessibility.

If visible text can overflow, the proof must include both fitting and
truncating cases when the primitive owns truncation or tooltip behavior.

If a primitive uses another primitive, token, or browser-native behavior, the
proof must say so.

## Pattern Proofs

Pattern proofs must expose controls for signed upstream variants, responsive
constraints, accessibility-sensitive states, consumer-boundary risks, and
fixture pressure that can change rendered evidence.

For every scroll or responsive mode, the proof must name the scroll owner:
page, proof container, pattern container, panel, list, child primitive, or
browser-native document behavior.

For repeated or unequal composed children, the proof must include browser
evidence for alignment and overflow behavior that could otherwise drift.

## Proof Control Honesty

Every proof control must have focused browser evidence showing that changing
the control either:

- changes rendered geometry or visual output
- changes state, attribute, or event behavior
- preserves the promised behavior under pressure
- exposes a blocked or not-applicable reason

Inert controls fail the proof.

## Browser Evidence

Before claiming a frontend-visible proof works, collect browser evidence for
the relevant dimensions:

- desktop rendering
- mobile rendering when responsive behavior exists
- RTL when direction can affect layout or semantics
- text overflow and truncation when text is constrained
- focus visibility and keyboard flow for focusable controls
- interaction states and emitted events for interactive controls
- scroll owner and overflow behavior when scrolling exists
- absence of horizontal overflow in constrained viewports

If any dimension is intentionally deferred, the proof must say which later
layer owns it and why the current layer can still be reviewed.
