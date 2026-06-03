# Component Seam Accessibility Eval

This eval extends:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`
- `../accessibility/EVAL.md`

Assume the ComponentSeamArtifact has not preserved WCAG 2.2 AA
responsibilities until the checks below pass.

## Layer Accessibility Ownership

The component seam layer owns preservation of pattern accessibility through the
public receptor, event, controller, and adapter boundary.

It must not weaken accessibility requirements introduced by behavior rules,
tokens, primitives, or patterns.

It does not need to prove demo fixture behavior, canonical scenario coverage,
or app adoption parity.

## Required Evidence

Pass only if the artifact references the shared WCAG 2.2 AA default.

Pass only if every accessibility-sensitive receptor has a required shape,
fallback, or blocked posture.

Pass only if names, descriptions, labels, visible text, empty states, denied
states, loading states, and live-region messages that consumers may provide are
validated or constrained by the seam.

Pass only if component controller behavior preserves keyboard operation,
focus retention or restoration, and state exposure required by the upstream
pattern.

Pass only if event translation preserves enough context for assistive
technology feedback when order, position, selection, open/closed state,
visibility, or size changes.

Pass only if unsupported affordances do not leave keyboard-only or assistive
technology users with dead controls, silent state changes, or misleading
announcements.

Pass only if configurable affordance receptors preserve accessibility in both
postures, including removal or suppression of disabled controls, shortcuts,
state announcements, and live feedback when the affordance is off.

Pass only if rendered accessibility evidence is required before claiming a
frontend-visible implementation or proof route works.

Pass only if unresolved accessibility evidence blocks approval instead of
being silently deferred.

## Fail Conditions

Fail if the artifact only says "accessible", "WCAG compliant", or
"screen-reader friendly."

Fail if a receptor allows missing accessible names for named regions,
interactive controls, or live feedback.

Fail if component event translation drops context required by the pattern's
announced-result contract.

Fail if the component seam changes primitive or pattern semantics instead of
routing back to the owning layer.

Fail if color is the only carrier of state or meaning.

Fail if an exception is implied instead of explicit.

## Pass Result

Use `accessibility-pass` only when the ComponentSeamArtifact states and
evidences the applicable WCAG 2.2 AA responsibilities for the seam.

## Blocked Result

Use `accessibility-blocked` when the artifact names missing evidence and keeps
component status from becoming `accepted`.

## Exception Result

Use `accessibility-exception-approved` only when the exception names the
criterion or risk, scope, reason, mitigation, owner, and follow-up gate.
