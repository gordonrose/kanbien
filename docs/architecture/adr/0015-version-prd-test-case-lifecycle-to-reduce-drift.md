# ADR-0015: Version PRD Test-Case Lifecycle To Reduce Drift

- Status: Accepted
- Date: 2026-03-29
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

ADR-0011 established PRD-driven, traceable test coverage, but it did not
define how documented test intent should evolve when requirements change over
time.

Without an explicit lifecycle model, the repo risks:

- silently replacing earlier test intent with newer wording
- deleting or rewriting executable proof without a preserved requirement record
- losing the distinction between "replaced by a newer expectation" and
  "obsolete and no longer applicable"
- allowing Codex-driven changes to update tests coherently in code while still
  leaving requirement history ambiguous

The platform needs an anti-drift rule for PRD-derived test cases that preserves
history without forcing every historical executable test to remain active.

## Decision

Adopt a versioned lifecycle model for PRD-derived test cases.

Current rules:

- the primary versioned artifact is the PRD test-case record under
  `docs/prd/test_cases/`
- the source of truth remains the PRD-derived test-case document, not the
  executable test file
- PRD test-case records may carry explicit versions such as `v1`, `v2`, and so
  on
- the first lifecycle states are:
  - `active`
  - `superseded`
  - `archived`
  - `pending-review`
- `superseded` means the same underlying intent has a newer replacement
- `archived` means the expectation is no longer current and is not directly
  replaced one-for-one
- Codex may propose lifecycle changes heuristically, but a human must approve
  superseded or archived classification before artifacts are updated
- executable tests continue to reference stable `TC-*` IDs; explicit version
  metadata in executable tests is deferred unless the pilot proves it is needed
- normal test execution should run only current active expectations
- historical executable tests may be preserved selectively, but documented
  historical intent must be preserved even when old executable tests are not
  kept active
- the first pilot scope is backend `rootAuth` and backend `rootUsers`

## Consequences

### Positive

- requirement drift becomes more visible
- historical test intent can be preserved without relying only on Git history
- Codex-driven test updates gain an explicit human approval checkpoint
- the repo can distinguish replaced expectations from obsolete ones more
  clearly

### Negative

- PRD test-case maintenance becomes more detailed
- reviewers must make explicit lifecycle decisions that were previously
  implicit
- some executable-test history may still require judgment rather than a simple
  always-keep or always-delete rule

### Neutral / Follow-up

- future work may define a sidecar metadata format if inline PRD test-case
  metadata becomes cumbersome
- future work may expand the pilot beyond backend `rootAuth` and `rootUsers`
- future work may integrate this workflow into the broader change-loop skill
- future work may add more precise heuristic rules and examples for Codex
  review support

