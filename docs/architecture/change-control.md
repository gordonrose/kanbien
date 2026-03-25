# Change Control

This document defines when architectural changes can be made directly and when
they should be recorded more formally.

## Direct Changes Are Acceptable When

- the change is fully contained within one feature folder
- no shared platform seam changes
- no public API contract changes
- no migration discovery or execution behavior changes
- no security posture changes
- the change follows existing architectural patterns

Examples:

- adding a new use case inside an existing feature
- extending feature validation while preserving the API contract
- adding a new repository method behind an unchanged feature entry point

## A New ADR Is Required When

- a shared platform seam changes
- a new lasting pattern is introduced
- public API conventions change
- migration identity, discovery, or execution behavior changes
- feature integration rules change
- error handling contracts change
- a change intentionally breaks an established principle

Examples:

- changing how features are mounted
- switching from explicit registration to automatic discovery
- changing the global error response contract
- introducing a new shared infrastructure dependency

## Documentation Update Rule

When a change affects system structure or platform expectations, update:

- `system-overview.md` for the current-state description
- `priniciples.md` if the guardrails change
- relevant ADRs if a decision is being introduced, clarified, or superseded

## Review Questions

Before merging an architectural change, confirm:

- Is the platform seam still explicit?
- Does the change increase or reduce coupling?
- Does it preserve security and reliability defaults?
- Will another feature now need to do something special?
- If the same change is repeated five times, will the architecture still scale?
- Have live schema and repository writes been checked for drift on required
  columns, normalized fields, and indexes?
- If migrations perform bootstrap or repair work, has their execution model been
  verified against database statement-visibility semantics?
