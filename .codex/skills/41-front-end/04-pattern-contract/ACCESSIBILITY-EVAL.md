# Pattern Contract Accessibility Eval

This eval extends:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`
- `../accessibility/EVAL.md`

Assume the PatternContractArtifact has not met WCAG 2.2 AA responsibilities
until the checks below pass.

## Layer Accessibility Ownership

The pattern layer owns accessibility behavior across the composition.

It must preserve accessibility requirements introduced by behavior rules,
tokens, and primitives.

It does not need to prove component API safety, demo fixture behavior,
canonical scenario coverage, or app adoption parity.

## Required Evidence

Pass only if the artifact references the shared WCAG 2.2 AA default.

Pass only if semantic relationships across composed primitives are explicit.

Pass only if heading, list, region, group, name, and description expectations
are explicit when the pattern owns them.

Pass only if keyboard and focus order across composed primitives are explicit
for interactive patterns.

Pass only if target-size, text sizing, reflow, RTL, and zoom risks are named
when the pattern can affect layout or interaction.

Pass only if selected, expanded, current, pressed, checked, invalid, loading,
busy, empty, or disabled states expose meaning without relying on color alone
when those states exist.

Pass only if constrained or truncated text in the pattern remains recoverable
through keyboard-reachable and pointer-reachable full-text disclosure owned by
a governed primitive.

Pass only if rendered accessibility evidence is required before claiming a
frontend-visible implementation or proof route works.

Pass only if unresolved accessibility evidence blocks approval instead of being
silently deferred.

## Fail Conditions

Fail if the artifact only says "accessible", "WCAG compliant", or
"screen-reader friendly."

Fail if a pattern changes primitive semantics without routing back to
`03-primitive`.

Fail if a composed interaction omits keyboard or focus behavior.

Fail if color is the only carrier of state or meaning.

Fail if text can be visually truncated without full-text disclosure, or if
tooltip disclosure appears when the text is not actually truncated.

Fail if an exception is implied instead of explicit.

## Pass Result

Use `accessibility-pass` only when the PatternContractArtifact states and
evidences the applicable WCAG 2.2 AA responsibilities for the pattern.

## Blocked Result

Use `accessibility-blocked` when the artifact names missing evidence and keeps
pattern status from becoming `accepted`.

## Exception Result

Use `accessibility-exception-approved` only when the exception names the
criterion or risk, scope, reason, mitigation, owner, and follow-up gate.
