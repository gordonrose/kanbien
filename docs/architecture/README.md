# Architecture

This folder defines how the platform is expected to evolve.
It exists to keep the codebase easy to extend without allowing silent drift in
security, reliability, modularity, consistency, or operational behavior.

## Documents

- `system-overview.md`
  Snapshot of the architecture that exists today.
- `priniciples.md`
  Day-to-day architectural guardrails for platform and feature changes.
- `change-control.md`
  Rules for when a change can be made directly and when it should produce an ADR.
- `adr/`
  Architecture Decision Records for decisions that should remain visible over time.
- `guides/`
  Repeatable implementation guidance that applies ADR decisions consistently.
- `recoverability-and-build-from-spec.md`
  Coverage map for making the repo rebuildable from specs and templates.
- `build-from-spec-change-harness.md`
  End-to-end diagram of the build-from-spec implementation harness and how it
  reduces drift, contamination, contradiction, and overlap.

## How To Use This Folder

- Read `system-overview.md` before changing platform seams.
- Use `priniciples.md` when deciding whether a change is acceptable.
- Use `change-control.md` to determine whether a change needs a new ADR.
- Add or supersede ADRs when the architecture changes in a lasting way.
- Use `guides/` when applying architecture repeatedly across features and
  vertical slices.
- Use `recoverability-and-build-from-spec.md` when improving build-from-spec
  coverage.
- Use `build-from-spec-change-harness.md` when explaining or reviewing the full
  artifact chain around implementation work.

## Working Rule

The code is the executable truth, but architecture docs are expected to stay
close enough to guide safe change. When code and architecture docs diverge,
either the code should be corrected or the docs should be updated in the same
change.
