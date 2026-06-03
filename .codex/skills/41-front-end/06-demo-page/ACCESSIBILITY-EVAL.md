# Demo Page Accessibility Eval

This eval extends:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`
- `../accessibility/EVAL.md`

Assume the DemoPageArtifact has not preserved rendered WCAG 2.2 AA
responsibilities until the checks below pass.

## Layer Accessibility Ownership

The demo-page layer owns rendered proof that the component seam preserves
accessibility through its public receptors, controller, events, fixture states,
and environment contexts.

It must not weaken accessibility requirements introduced by behavior rules,
tokens, primitives, patterns, or components.

It does not need to prove canonical scenario completeness or app adoption
parity.

## Required Evidence

Pass only if the artifact references the shared WCAG 2.2 AA default.

Pass only if every demo fixture with accessibility-sensitive content supplies
valid names, visible labels, descriptions, state text, empty text, denied text,
loading text, or live-feedback copy required by the component contract.

Pass only if proof controls remain operable and named, or are excluded when
they are not needed for evidence.

Pass only if rendered keyboard operation, focus retention or restoration, and
state exposure required by the component seam are evidenced.

Pass only if rendered event feedback preserves enough context for assistive
technology when order, position, selection, open/closed state, visibility, or
size changes.

Pass only if responsive, magnification, direction, motion, and overflow
contexts do not hide controls, overlap text, trap focus, or create horizontal
scroll unless explicitly approved by the component contract.

Pass only if unsupported affordances in the demo do not leave keyboard-only or
assistive technology users with dead controls, silent state changes, or
misleading announcements.

Pass only if unresolved rendered accessibility evidence blocks approval instead
of being silently deferred.

## Fail Conditions

Fail if the artifact only says "accessible", "WCAG compliant", or
"screen-reader friendly."

Fail if demo fixtures omit accessible names for named regions, interactive
controls, or live feedback required by the component contract.

Fail if demo proof controls create behavior that is not available through the
component seam.

Fail if event translation or demo interaction drops context required by the
component or pattern announced-result contract.

Fail if the demo changes primitive, pattern, or component semantics instead of
routing back to the owning layer.

Fail if color is the only carrier of state or meaning.

Fail if rendered accessibility proof is replaced by source inspection alone for
a frontend-visible demo.

Fail if an exception is implied instead of explicit.

## Pass Result

Use `accessibility-pass` only when the DemoPageArtifact states and evidences
the applicable WCAG 2.2 AA responsibilities for the rendered demo.

## Blocked Result

Use `accessibility-blocked` when the artifact names missing evidence and keeps
demo status from becoming `accepted`.

## Exception Result

Use `accessibility-exception-approved` only when the exception names the
criterion or risk, scope, reason, mitigation, owner, and follow-up gate.
