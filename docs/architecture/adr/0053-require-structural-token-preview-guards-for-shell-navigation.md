# ADR-0051: Require Structural Token Preview Guards For Shell Navigation

- Status: Accepted
- Date: 2026-06-10
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

The Layer 2 shell and navigation token work exposed a harness weakness:
structural frame tokens could still present a generic token preview or rely on
text assertions while the route appeared to pass review.

That is not enough for standard page shell, context navigation, or tools
navigation frame tokens. These tokens govern screen regions, viewport anchoring,
mobile visibility, rail placement, and drawer/menu offsets. A generic card or
copy-only proof does not make those decisions reviewable.

## Decision

Structural shell/navigation frame token proof modules must use dedicated
structural preview kinds and rendered preview selectors.

The static `check:design-system-registry` gate includes an executable structural
token preview guard for the currently governed frame tokens:

- `standard-page-shell-frame`
- `context-navigation-frame`
- `tools-navigation-frame`

For those tokens, the guard rejects generic preview kinds such as
`surface-card`, verifies the token template and variants name the dedicated
preview kind, verifies the shared token renderer branches for that preview, and
verifies the visual spec asserts the dedicated structural preview selector.

## Consequences

- A shell/navigation frame token can no longer pass the static design-system
  gate with a generic surface-card preview.
- The rendered proof route remains the review truth for human signoff, but the
  static gate now catches the most obvious shortcut before browser review.
- Future structural frame token families should be added to the guard only when
  the preview kind changes allowed behavior or prevents a concrete review
  failure.
