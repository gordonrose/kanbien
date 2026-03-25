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

## How To Use This Folder

- Read `system-overview.md` before changing platform seams.
- Use `priniciples.md` when deciding whether a change is acceptable.
- Use `change-control.md` to determine whether a change needs a new ADR.
- Add or supersede ADRs when the architecture changes in a lasting way.

## Working Rule

The code is the executable truth, but architecture docs are expected to stay
close enough to guide safe change. When code and architecture docs diverge,
either the code should be corrected or the docs should be updated in the same
change.
