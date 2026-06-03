# Token Accessibility Eval

This eval extends:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`
- `../accessibility/EVAL.md`

Assume the TokenDefinitionArtifact has not met WCAG 2.2 AA responsibilities until the
checks below pass.

## Layer Accessibility Ownership

The token layer owns accessibility proof for accessibility-relevant reusable
values it introduces or approves.

It does not need to prove primitive keyboard behavior, pattern semantics,
component API safety, rendered demo behavior, or app adoption parity.

It must define the accessibility requirements that later layers must preserve
when consuming the token.

## Required Evidence

Pass only if the TokenDefinitionArtifact references the shared WCAG 2.2 AA default or states
why the token has no accessibility impact.

Pass only if color tokens name contrast expectations, theme proof, and
color-independent meaning requirements.

Pass only if tokens that define visible non-text control parts, state
indicators, markers, glyphs, borders, tracks, thumbs, rails, or handles name
and evidence non-text contrast expectations for every approved theme/state
pairing. A token proof must not pass by proving text contrast while leaving a
control affordance visually indistinct from its adjacent token-backed surface.

Pass only if focus tokens name visible focus expectations across required
themes and constrained states.

Pass only if sizing, spacing, or layout tokens name target-size, reflow, zoom,
or constrained-layout risks when relevant.

Pass only if typography tokens name text sizing, line height, text spacing, and
reflow risks when relevant.

Pass only if motion tokens name reduced-motion and motion-safety expectations
when relevant.

Pass only if unresolved accessibility evidence blocks approval instead of being
silently deferred.

Pass only if every token variant's metadata records the accessibility
responsibility or a clear not-applicable reason.

Pass only if later layers are told what accessibility requirement they must
preserve.

## Fail Conditions

Fail if the TokenDefinitionArtifact only says "accessible", "WCAG compliant", or
"screen-reader friendly."

Fail if color can be the only carrier of meaning.

Fail if foreground/background token pairings are approved without contrast
requirements or a recorded blocker.

Fail if a token-backed non-text control part, state indicator, marker, glyph,
border, track, thumb, rail, or handle is approved without evidence that it is
visibly distinguishable from its adjacent token-backed surface in each approved
theme/state pairing.

Fail if focus visibility is approved without visible-focus requirements or a
recorded blocker.

Fail if target-size, text sizing, reflow, or motion risk is introduced without
evidence or an explicit approved exception.

Fail if an accessibility concern is deferred without naming the later layer
that must preserve or prove it.

Fail if an exception is implied instead of explicit.

## Pass Result

Use `accessibility-pass` only when the TokenDefinitionArtifact states and evidences the
applicable WCAG 2.2 AA responsibilities for the token category.

## Blocked Result

Use `accessibility-blocked` when the TokenDefinitionArtifact names the missing evidence
and keeps token status from becoming `accepted`.

## Exception Result

Use `accessibility-exception-approved` only when the exception names the
criterion or risk, scope, reason, mitigation, owner, and follow-up gate.
