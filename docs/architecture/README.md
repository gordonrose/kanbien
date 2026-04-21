# Architecture

This folder defines how the platform is expected to evolve.
It exists to keep the codebase easy to extend without allowing silent drift in
security, reliability, modularity, consistency, or operational behavior.

## Documents

- `system-overview.md`
  Snapshot of the architecture that exists today.
- `frontend-overview.md`
  Current-state frontend architecture, route-family shape, and browser/runtime
  boundaries.
- `priniciples.md`
  Day-to-day architectural guardrails for platform and feature changes.
- `change-control.md`
  Rules for when a change can be made directly and when it should produce an ADR.
- `adr/`
  Architecture Decision Records for decisions that should remain visible over time.
- `guides/`
  Repeatable implementation guidance that applies ADR decisions consistently.
- `permission-mappings/`
  Source-independent role-to-capability mapping artifacts for authorization and
  other permission-sensitive work.
- `recoverability-and-build-from-spec.md`
  Coverage map for making the repo rebuildable from specs and templates.
- `build-from-spec-change-harness.md`
  End-to-end diagram of the build-from-spec implementation harness and how it
  reduces drift, contamination, contradiction, and overlap.
- `build-from-spec-reconstruction-questionnaire.md`
  Source-independent questionnaire for interchangeable tools, providers, and
  deployer-local choices needed to rebuild the platform without storing live
  secrets in repo docs.
- harness and helper behavior guides under `guides/`
  Source-independent detail for runnable bootstrap, test harness internals, and
  script/helper behavior that would otherwise stay trapped in `src/` and
  `tests/`.

## How To Use This Folder

- Read `system-overview.md` before changing platform seams.
- Read `frontend-overview.md` before changing frontend route families, browser
  runtime seams, or frontend delivery posture.
- Use `priniciples.md` when deciding whether a change is acceptable.
- Use `change-control.md` to determine whether a change needs a new ADR.
- Add or supersede ADRs when the architecture changes in a lasting way.
- Use `guides/` when applying architecture repeatedly across features and
  vertical slices.
- Use `permission-mappings/` when defining source-independent role and
  capability rules for authorization-sensitive work.
- Use `recoverability-and-build-from-spec.md` when improving build-from-spec
  coverage.
- Use `build-from-spec-change-harness.md` when explaining or reviewing the full
  artifact chain around implementation work.
- Use `build-from-spec-reconstruction-questionnaire.md` when a rebuilder needs
  to choose between interchangeable tools or providers without exposing live
  secrets in repo docs.

## Working Rule

The code is the executable truth, but architecture docs are expected to stay
close enough to guide safe change. When code and architecture docs diverge,
either the code should be corrected or the docs should be updated in the same
change.
