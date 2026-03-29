# Version PRD Test-Case Lifecycle For Anti-Drift

## Purpose

Introduce a deliberate lifecycle model for PRD-derived test cases so the repo
can evolve behavior without silently overwriting or deleting prior test intent.

This work is intended to reduce requirement drift first, reduce accidental test
deletion or replacement second, improve Codex change discipline third, and
strengthen auditability and compliance posture as a follow-on benefit.

---

## Scope

This phase includes:

- versioned PRD test-case records as the primary anti-drift artifact
- lifecycle states for PRD test cases
- a manual review workflow where Codex proposes superseded or archived test
  cases and a human approves the result
- heuristic candidate detection rather than fully automatic classification
- a pilot limited to backend `rootAuth` and backend `rootUsers`
- normal test execution rules that run only active test expectations

This phase does **not** include:

- repo-wide rollout across every PRD immediately
- mandatory integration into the change loop on day one
- automatic rewriting of all existing executable tests to carry explicit
  version metadata
- a guarantee that every historical executable test file remains permanently
  runnable
- machine-learning or self-modifying classification behavior

---

## Problem Statement

The repo already uses PRD-derived test-case documents and traceable `TC-*`
identifiers, but the current model still allows several forms of quiet drift:

- a documented test case can change meaning without a preserved record of the
  previous expectation
- a new executable test can replace an older expectation without a clear
  supersession decision
- an obsolete test can disappear without an explicit archive decision
- Codex can make local test updates that are technically coherent but do not
  preserve historical reasoning about why the expectation changed

As the repo grows, especially in security-sensitive features such as
`rootAuth` and `rootUsers`, the platform needs a more deliberate lifecycle for
test intent rather than relying only on Git history or reviewer memory.

---

## Design Goals

- prevent silent requirement drift
- preserve explicit historical reasoning when a test expectation changes
- keep the source of truth in the PRD-derived test-case docs
- avoid forcing every historical executable test to remain active forever
- require human approval before test cases are marked superseded or archived
- keep the normal test loop focused on current active expectations only
- support Codex-assisted review without making Codex the final authority

---

## Core Decisions

### Primary artifact

The primary versioned artifact is the PRD-derived test-case record under
`docs/prd/test_cases/`.

Executable tests remain proof of the currently active behavior. They are not
the primary history mechanism.

### Source of truth

The source of truth is the PRD-derived test-case document, not the executable
test file.

### Lifecycle states

The first lifecycle states are:

- `active`
- `superseded`
- `archived`
- `pending-review`

### Meaning of states

- `active`
  - the current authoritative test-case version for the requirement lineage
- `superseded`
  - replaced by a newer version of the same underlying requirement intent
- `archived`
  - no longer current and not directly replaced one-for-one
- `pending-review`
  - identified by Codex as a candidate for reclassification but not yet
    approved

### Version model

Each PRD test-case record should carry an explicit version such as:

- `v1`
- `v2`

The `TC-*` lineage remains recognizable and stable.

### Executable-test mapping

Executable tests continue to reference stable `TC-*` IDs in test names or
nearby comments.

Explicit version metadata in executable tests is deferred for the pilot unless
the pilot shows ambiguity that requires it.

### Human approval rule

Codex may propose lifecycle changes, but it must not silently mark a test case
as superseded or archived.

The workflow is:

1. detect candidate changes heuristically
2. classify candidates
3. run a Codex review/refinement step
4. present the proposed changes with reasons
5. wait for human approval or direction
6. update artifacts only after approval

### Normal execution rule

Only `active` expectations should run in the normal test loop.

Superseded or archived executable tests, where retained, should not run in the
default execution path.

### Historical executable tests

Historical documentation should always be preserved.

Historical executable tests may be preserved selectively where they add real
value, but the platform does not require every superseded executable test to
remain active forever.

### Heuristic detection model

The initial system should use heuristic suggestions only.

Examples of candidate signals:

- a documented test case changed materially
- a previously mapped executable test disappeared
- a new test appears to cover an older requirement lineage
- a requirement or route has been removed
- a capability has been replaced by a newer workflow

### Heuristic refinement

The Codex skill that performs this review should include an explicit
review/refinement step so the heuristic can be improved over time through repo
guidance and examples.

This refinement remains transparent and documented rather than opaque or
self-modifying.

---

## Proposed Metadata Shape

The pilot should store lifecycle metadata inline in the PRD test-case docs.

Recommended fields:

- `Test Case ID`
- `Version`
- `Status`
- `Supersedes`
- `Superseded By`
- `Reason`
- `Approval Note`

Not every field needs a value on every case.

Expected common shapes:

- active current case:
  - `Version: v2`
  - `Status: active`
- superseded case:
  - `Version: v1`
  - `Status: superseded`
  - `Superseded By: TC-... v2`
  - `Reason: ...`
- archived case:
  - `Status: archived`
  - `Reason: ...`

---

## Pilot Scope

The first pilot should cover:

- backend `rootAuth`
- backend `rootUsers`

The pilot should avoid:

- browser-shell-only lifecycle rules for now
- platform-wide automatic enforcement
- repo-wide migration of every historical test-case document at once

---

## Proposed Review Workflow

1. A change modifies `rootAuth` or `rootUsers` behavior, requirements, or test
   intent.
2. Codex reviews affected PRD test-case records and executable mappings.
3. Codex identifies candidates for:
   - new active versions
   - superseded old versions
   - archived obsolete versions
4. Codex refines the candidate list using the skill's heuristic review step.
5. Codex presents a structured review report that includes:
   - candidate test case
   - current status
   - proposed status
   - reason
   - replacement linkage if any
   - confidence
   - required human decision
6. Human approves or redirects.
7. Codex updates PRD test-case records and any corresponding executable-test
   organization.
8. Normal test execution continues to run only active expectations.

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the repo has a documented lifecycle model for PRD-derived test cases
2. the source of truth is explicitly the PRD test-case doc
3. the lifecycle states `active`, `superseded`, `archived`, and
   `pending-review` are defined
4. version metadata is defined for PRD test-case records
5. the manual approval rule is documented
6. the pilot scope is explicitly limited to backend `rootAuth` and
   backend `rootUsers`
7. normal execution is defined to run only active expectations
8. the design documents the Codex review/refinement step for heuristic
   classification

---

## Risks And Open Questions

- whether inline metadata remains readable as PRD test-case documents grow
- whether a sidecar index or manifest becomes more ergonomic later
- whether explicit version metadata in executable tests becomes necessary after
  the pilot
- how much historical executable code should be preserved versus documented
  only
- when this workflow should become a mandatory step in the broader change loop

