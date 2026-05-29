# Primitive Accessibility Eval

This eval extends:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`
- `../accessibility/EVAL.md`

Assume the PrimitiveDefinitionArtifact has not met WCAG 2.2 AA
responsibilities until the checks below pass.

## Layer Accessibility Ownership

The primitive layer owns accessibility semantics and interaction behavior for
the primitive.

It must preserve accessibility requirements introduced by behavior rules and
signed tokens.

It does not need to prove pattern-level composition, component API safety, demo
fixture behavior, canonical scenario coverage, or app adoption parity.

## Required Evidence

Pass only if the PrimitiveDefinitionArtifact references the shared WCAG 2.2 AA
default.

Pass only if semantic HTML or role expectations are explicit.

Pass only if accessible-name expectations are explicit for named controls, or a
not-applicable reason is given for non-interactive primitives.

Pass only if keyboard operation is explicit for interactive primitives, or a
not-applicable reason is given for non-interactive primitives.

Pass only if focus behavior is explicit for focusable primitives, or a
not-applicable reason is given for non-focusable primitives.

Pass only if disabled, selected, expanded, pressed, checked, invalid, loading,
or busy states expose meaning without relying on color alone when those states
exist.

Pass only if every visible non-color affordance used to expose state or meaning
is backed by a signed Layer 2 token dependency, or the primitive is blocked and
names the missing token. Accessibility evidence must not be satisfied by
inventing local marker shape, size, placement, thickness, spacing, radius,
color source, or variants inside the primitive.

Pass only if target-size expectations are named for pointer-operated
primitives, or a blocker names the missing token evidence.

Pass only if status, error, or validation messaging responsibilities are named
when the primitive owns those states.

Pass only if any visible text that can truncate has a full-text disclosure
mechanism that works with pointer hover and keyboard focus, is gated by actual
overflow, and does not rely on `title` attributes alone.

Pass only if motion or animation responsibilities are named when the primitive
introduces motion.

Pass only if rendered accessibility evidence is required before claiming a
frontend-visible implementation or proof route works.

Pass only if unresolved accessibility evidence blocks approval instead of being
silently deferred.

## Fail Conditions

Fail if the artifact only says "accessible", "WCAG compliant", or
"screen-reader friendly."

Fail if a native semantic element is replaced by custom role behavior without
explaining the need and required keyboard behavior.

Fail if color is the only carrier of state or meaning.

Fail if a primitive avoids color-only state by adding an unsigned visual
indicator such as a bar, dot, underline, badge, icon, checkmark, or overlay.

Fail if an interactive primitive omits keyboard activation or focus visibility
requirements.

Fail if disabled behavior removes necessary context from assistive technology
without an explicit reason.

Fail if target-size, text sizing, reflow, focus visibility, or motion risk is
introduced without evidence, a blocking token dependency, or an explicit
approved exception.

Fail if constrained text can be visually truncated without keyboard-reachable
and pointer-reachable full-text disclosure.

Fail if tooltip disclosure appears when the text is not actually truncated.

Fail if an accessibility concern is deferred without naming the later layer
that must preserve or prove it.

Fail if an exception is implied instead of explicit.

## Pass Result

Use `accessibility-pass` only when the PrimitiveDefinitionArtifact states and
evidences the applicable WCAG 2.2 AA responsibilities for the primitive.

## Blocked Result

Use `accessibility-blocked` when the PrimitiveDefinitionArtifact names the
missing evidence and keeps primitive status from becoming `accepted`.

## Exception Result

Use `accessibility-exception-approved` only when the exception names the
criterion or risk, scope, reason, mitigation, owner, and follow-up gate.
