---
name: issue-reconciliation-maintainer
description: Use when the user raises a bug, runtime defect, escaped regression, or "this should have been caught" issue and wants Codex to reconcile why the current test suite missed it, what coverage was absent, and what targeted improvements should be added so the issue and similar failures are less likely to recur.
---

# Issue Reconciliation Maintainer

Use this skill when the user reports an issue that escaped the existing change
loop and wants more than a one-off fix.

The goal is to reconcile the live defect against the current verification
posture, then strengthen the right test seams so the same class of issue is
less likely to slip through again.

This skill is for issue intake, escaped-regression analysis, and prevention
work. It is not just a bug-fix skill.

## Purpose

For each reported issue, this skill should:

- capture the user-visible symptom
- identify the concrete technical root cause
- inspect the current executable tests and determine why they missed it
- classify whether the gap was:
  - missing coverage
  - wrong layer coverage
  - unrealistic harness coverage
  - stale expectations
  - cross-feature seam blind spot
  - missing regression scenario
- add or repair the narrowest honest tests that would have caught it
- prefer coverage that also protects nearby similar failures, not just the one
  exact reproduction
- treat implementation and automated verification as evidence, not closure
- keep the issue in an unresolved state until the user confirms the
  user-visible symptom is actually resolved, unless the user explicitly says
  confirmation is not needed for this issue
- leave behind a durable reconciliation note under
  `docs/workspace/issue-reconciliations/`

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. `docs/standards/change-artifact-requirements.md`
4. the relevant PRD and PRD-derived test-case docs when they exist
5. current source in `src/`
6. current executable tests in `tests/`
7. existing issue-reconciliation notes under `docs/workspace/issue-reconciliations/`
8. supporting docs such as feature docs, API contracts, data dictionary, and
   runbooks when they materially affect the issue

If implementation, tests, and docs disagree, use architecture first, then
document the conflict explicitly rather than quietly normalizing it away.

## When To Use This Skill

Use this skill when prompts sound like:

- "I found a bug"
- "this issue slipped through"
- "why didn’t our tests catch this?"
- "how did this regression get missed?"
- "fix this and make sure it can’t recur"
- "add the missing tests for this escaped issue"
- "reconcile this incident against the suite"

Do not use this skill for:

- routine greenfield test implementation from a PRD doc with no escaped issue
- broad repo-health audits without a concrete issue trigger
- pure docs wording changes

## Where To Look

Start with:

- the user’s issue description, screenshot, failing command, or reproduction
- the affected implementation files under `src/`
- the nearest existing tests under `tests/unit/`, `tests/integration/`,
  `tests/security/`, `tests/audit/`, `tests/visual/`, and persistence-backed
  suites when relevant
- `docs/workspace/issue-reconciliations/README.md`
- relevant PRD and PRD test-case docs under `docs/prd/` and
  `docs/prd/test_cases/`
- `docs/architecture/guides/testing-and-verification-guide.md` when test-layer
  choice is unclear
- `docs/architecture/guides/qa-coverage-matrix-guide.md` when deciding whether
  broader coverage is required
- `tests/README.md`

Load only the issue-relevant materials.

## Workflow

1. Reconstruct the issue.
Identify:
- the user-visible symptom
- the exact reproduction path if known
- the affected surface:
  frontend, API, persistence, authz, audit, migration, helper/tooling, or
  cross-feature seam

2. Find the root cause.
Inspect the affected code path and name the concrete failure mode.
Do not stop at "test missing." Explain what actually broke.

3. Audit current test coverage.
Inspect the nearest existing tests and answer:
- what behavior is already covered?
- which layer covered something nearby but not this truth?
- was the current coverage too mocked, too narrow, or pointed at the wrong
  contract?
- did a shared seam or live-schema truth exist that current tests did not hit?

4. Classify the miss.
State clearly why the issue escaped:
- missing test entirely
- wrong test layer
- stale test expectation
- incorrect fixture/harness assumptions
- no coverage for a required state, direction, zoom, role, tenant, or degraded
  path
- no persistence-backed proof for a migration/storage/shared-seam truth
- no regression scenario in the governed frontend manifest

5. Repair the prevention layer, not just the symptom.
Add or update the narrowest honest coverage that would have caught the issue.
Prefer:
- extending the right existing suite when natural
- adding one regression test plus one adjacent-coverage improvement when the
  issue reveals a class gap
- using persistence-backed tests for schema, audit, migration, and shared-table
  truths
- using visual/frontend gate scenarios for governed UI-state regressions

Do not add fake confidence:
- do not add a thin unit test for a persistence or routing truth
- do not add a mocked test when the escaped bug depended on a real seam
- do not claim recurrence prevention if the new coverage still misses the real
  failure mode

6. Update reconciliation evidence.
Add or update a dated note in `docs/workspace/issue-reconciliations/` that
captures:
- summary
- root cause
- why the feature loop missed it
- reconciliation changes added
- coverage lesson
- follow-up watch items

Use one dated file per incident.

7. Verify honestly.
Run the narrowest relevant tests first, then any broader impacted suites.
If the issue changes `TC-*`-backed test coverage, also run
`npm run test:traceability`.
If environment blockers prevent full verification, say so explicitly.

8. Do not self-certify closure.
After implementing the fix and prevention layer:
- distinguish between `candidate fix` and `confirmed resolved`
- report what evidence exists from code, tests, screenshots, or local checks
- if the original symptom was user-reported and user confirmation is still
  missing, keep the issue open and say that explicit confirmation is the next
  required step
- do not write as though the issue is fully resolved based only on source
  reasoning or local verification

## Test-Layer Heuristics

Use these defaults:

- `tests/unit/` for pure domain logic with no runtime seam dependency
- `tests/integration/` for feature flows, transport-to-domain seams, and
  realistic multi-component behavior
- `tests/security/` for allow/deny/authn/authz/security-boundary behavior
- `tests/audit/` for emitted/persisted audit behavior
- persistence-backed suites for migration, storage, live schema, durable audit,
  cross-table, or foreign-key truth
- `tests/visual/` plus frontend gate manifests for governed visual states,
  viewport behavior, directionality, overflow, and interactive preview states

If the bug crossed a shared platform seam, bias toward at least one test that
touches that real seam.

## Reporting Format

When responding after using this skill, include:

1. `Issue Summary`
2. `Why It Escaped`
3. `Prevention Changes`
4. `Verification`
5. `Resolution Status`
6. `Residual Risk`

Keep the explanation concrete and evidence-based.

Under `Resolution Status`, explicitly say one of:

- `candidate fix awaiting user confirmation`
- `confirmed resolved by user`
- `not resolved`

## Guardrails

- Do not fix the product bug without checking why the current suite missed it.
- Do not stop at "add one regression test" if the issue exposed a broader
  repeatable class gap.
- Do not broaden tests so much that they become vague or redundant.
- Do not silently skip the reconciliation note.
- Do not treat in-memory tests as sufficient proof for schema or shared-storage
  issues.
- Do not claim the issue is prevented if verification did not actually run.
- Do not treat your own implementation confidence as proof that the reported
  user-visible symptom is gone.
- Do not mark a user-reported issue fully resolved until the user confirms it,
  unless they explicitly waive that confirmation step.
