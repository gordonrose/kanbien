---
name: frontend-test-case-maintainer
description: Use when the user wants to create, repair, reorganize, or govern frontend verification artifacts, especially visual regression scenarios, screenshot baselines, geometry/assertion helpers, frontend gate coverage, and test-suite boundaries across `tests/visual/` and related frontend checks.
---

# Frontend Test Case Maintainer

Use this skill when the task is primarily about frontend verification posture
rather than frontend implementation or design-system signoff.

This skill owns the test layer for governed frontend behavior:

- what should be covered
- where that coverage should live
- how visual and interaction checks should be expressed honestly
- how shared helpers, manifests, and regression seams should be maintained

It is the closest repo-local analogue to a frontend-focused QA or SDET role.

## Purpose

Maintain a durable, honest frontend verification system by:

- adding or repairing frontend test coverage at the right layer
- keeping `tests/visual/` organized by purpose instead of by accident
- preferring user-visible assertions over thin implementation-detail checks
- maintaining screenshot, geometry, RTL, zoom, theme, and accessibility-risk
  coverage where those are part of the real contract
- reducing flake, duplication, drift, and scratch-artifact contamination
- strengthening shared helpers when the same regression pattern can recur

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/system-overview.md`
3. `docs/architecture/priniciples.md`
4. `docs/architecture/change-control.md`
5. `docs/architecture/guides/testing-and-verification-guide.md`
6. `docs/architecture/guides/qa-coverage-matrix-guide.md`
7. `docs/standards/change-artifact-requirements.md`
8. current source in `src/frontend/` and any relevant backend seam
9. executable tests under `tests/`
10. relevant workspace docs such as design-system artifacts or
    issue-reconciliation notes

If implementation, verification, and docs disagree, use architecture first and
call out the drift explicitly.

## Use This Skill When

Use this skill for prompts like:

- "add the missing frontend tests"
- "clean up `tests/visual`"
- "reorganize our visual regression suite"
- "improve screenshot or geometry coverage"
- "fix flaky frontend visual tests"
- "add RTL, mobile, zoom, or theme coverage for this frontend surface"
- "update the frontend gate"
- "create a better shared helper for this visual regression pattern"
- "what layer should this frontend regression live in?"

Also use this skill when the main work is:

- scenario maintenance under `tests/visual/`
- screenshot baseline governance
- geometry, containment, clipping, overlap, or contrast assertions
- frontend verification architecture or folder ownership
- frontend regression prevention after a known escaped issue
- test helper extraction for repeated browser assertions

## Do Not Use This Skill As The Only Skill For

- screenshot-driven design iteration that still needs `/design-system` signoff
- broad frontend implementation review as the primary task
- pure product implementation work
- issue reconciliation where the main task is understanding why the issue
  escaped in the first place

For those, pair or switch to:

- `frontend-design-system-loop-maintainer`
- `frontend-implementation-auditor`
- `issue-reconciliation-maintainer`

## Ownership Boundaries

This skill owns verification architecture, not visual product truth.

### This Skill Owns

- test-layer selection for frontend and governed visual risks
- suite organization inside `tests/`
- scenario naming and grouping
- screenshot, geometry, and interaction regression checks
- shared frontend test helpers and fixtures
- frontend gate coverage and maintenance
- reducing scratch/debug contamination in durable suites

### This Skill Does Not Own

- approving what the design-system should look like
- deciding new governed visual contracts
- real-app design adoption decisions by itself
- frontend architecture review beyond what is needed to place honest coverage

Those belong primarily to:

- `frontend-design-system-loop-maintainer`
- `frontend-implementation-auditor`
- `frontend-architecture-maintainer`

## Core Questions

When using this skill, answer these questions from source:

1. What user-visible or contract-visible truth actually needs protection?
2. Which test layer would catch that truth most honestly?
3. Is the current failure a missing test, wrong-layer test, weak assertion, or
   poor suite organization problem?
4. Should the protection be screenshot-based, geometry/assertion-based,
   interaction-based, or some combination?
5. Does the coverage belong in a shared helper because the pattern will recur?
6. Is the suite structure making durable tests and scratch/debug artifacts too
   easy to mix together?
7. Will the proposed coverage still be understandable and maintainable three
   months from now?

## Frontend Verification Layer Rules

Use the narrowest honest layer that still touches the real risk.

- `tests/unit/`:
  pure presentation logic, formatting helpers, and small deterministic state
  logic with no browser truth dependency
- `tests/integration/`:
  controller/view behavior, route-local state flows, and realistic UI seams
  where browser rendering is not the central risk
- `tests/visual/`:
  rendered layout, responsive posture, layering, overflow, clipping, anchoring,
  screenshot comparisons, and other human-visible browser truths
- frontend gate manifests or related governed artifacts:
  durable review sets where named scenarios must remain stable over time

Do not use a thin unit or DOM-existence test when the real risk is:

- overlap
- off-screen rendering
- clipped content
- broken RTL mirroring
- unreadable contrast
- drawer/menu/dialog stacking
- magnification collapse
- viewport-sensitive layout failure

## Suite Organization Rules

Prefer separating frontend verification by responsibility, not by convenience.

Good boundaries include:

- governed design-system canonicals
- design-system adoption checks
- app-level visual or interaction verification
- shared frontend visual helpers
- temporary debug or investigation artifacts

Do not leave temporary debug scenarios mixed into durable suites when the task
is really ongoing investigation or scratch capture.

If a test file is acting as:

- a durable regression suite
- a review launcher
- a scratchpad
- and a debug harness

call that out and narrow its role instead of quietly extending the sprawl.

## Shared Helper Rules

Extract a helper when:

- the same assertion pattern appears across multiple frontend families
- the assertion expresses a reusable human-visible truth
- the helper makes tests more honest, not more obscure

Good shared helper candidates include:

- containment checks
- stacking checks
- clipping/overflow checks
- readable contrast assertions
- canonical launcher integrity checks

Do not extract helpers that hide all the meaning of the test. A helper should
make intent clearer, not bury it.

## Screenshot And Geometry Guidance

Prefer geometry or computed-style assertions when they capture the failure mode
directly and robustly.

Prefer screenshots when:

- the visible truth is hard to express semantically
- multiple style dimensions matter together
- human review posture is itself part of the contract

Use both when needed:

- geometry to explain the exact guarantee
- screenshot to preserve the full visible posture

Do not rely on screenshots alone if a precise geometry rule would make the
protection more understandable.

## Flake And Honesty Rules

Bias toward tests that are stable because they measure the real contract
directly.

Prefer:

- deterministic fixtures
- explicit ready states
- controlled viewport setup
- assertions against rendered truth after the relevant state settles

Avoid:

- broad timing sleeps
- assertions that pass before the UI is meaningfully ready
- snapshots of unstable or incidental content
- over-mocked browser flows that no longer reflect the real surface

## Workflow

1. Identify the frontend risk.
   Name the user-visible truth that needs protection.

2. Inspect current coverage.
   Read the nearest relevant tests, helpers, manifests, and artifacts.

3. Choose the honest layer.
   State whether the protection belongs in unit, integration, visual, gate, or
   multiple layers.

4. Check ownership boundaries.
   If the task is actually design-system signoff, app adoption review, or issue
   reconciliation, route or pair with the right skill rather than absorbing the
   whole problem here.

5. Implement the narrowest durable improvement.
   Prefer:
   - one new honest regression
   - one helper extraction when the pattern is repeating
   - one suite-structure cleanup when co-location is causing drift

6. Verify honestly.
   Run the narrowest relevant suite first, then broader impacted checks.

7. Report residual risk.
   If a suite is still structurally muddy, flaky, or mixing responsibilities,
   say so explicitly instead of implying the problem is solved.

## Reporting Format

When responding after using this skill, include:

1. `Verification Goal`
2. `Coverage Decision`
3. `Changes Made`
4. `Verification`
5. `Residual Risk`

Keep the response concrete and test-focused.

## Guardrails

- Do not quietly redefine product or design truth from the test suite.
- Do not place coverage in `tests/visual/` just because it feels important if
  the real risk is not visual.
- Do not leave scratch/debug artifacts mixed into durable suites without
  calling out the contamination.
- Do not add screenshots when a precise shared assertion would be clearer and
  more stable.
- Do not claim strong protection if the test still misses the human-visible
  failure mode.
- Do not absorb design-system governance or app-implementation review work that
  belongs to another skill.
