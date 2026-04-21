# QA Operating Cadence Guide

## Purpose

Define the recurring human-review cadence that sits alongside the repo's
automated QA system so the controls stay current instead of becoming
one-time setup work.

This guide complements:

- [QA Release Gate](/home/gordon/kanbien/docs/standards/QA-RELEASE-GATE.md)
- [QA Coverage Matrix Guide](./qa-coverage-matrix-guide.md)
- [Testing And Verification Guide](./testing-and-verification-guide.md)

## Core Rule

Automated coverage is necessary, but the QA operating system also requires
recurring human review of:

- escaped defects
- waivers and quarantines
- flaky-suite posture
- feature-loop QA artifacts
- standards-facing QA baseline status

## Feature-Loop Cadence

For every material feature loop:

- record the QA coverage-matrix classification
- record which executable layers are required
- record which human QA artifacts are required
- complete the required checklist, exploratory note, run summary, or waiver
  record before treating the loop as complete

Recommended durable artifacts:

- `docs/workspace/qa/*-qa-checklist.md`
- `docs/workspace/qa/*-exploratory-qa-note.md`
- `docs/workspace/qa/*-qa-waiver-or-quarantine.md`
- `docs/workspace/test-run-summaries/*.md`

## Weekly Cadence

Recommended weekly QA review:

- review new or unresolved flaky tests
- review any open waivers or quarantines
- review recent feature-loop QA summaries for missing artifact patterns
- review recent journey inventories for silent omission drift
- review whether newly shipped features updated the expected standards snapshots

Expected outputs:

- closed or renewed waiver/quarantine records
- follow-up tickets for flaky suites
- policy refinements when repeated gaps appear

## Release Cadence

Before a production release or equivalent blocking gate:

- review the curated QA summary for the release scope
- confirm no blocking defects remain open
- confirm no blocking flaky suites remain unresolved
- confirm all required layers for the release scope passed
- confirm any approved waiver is still valid, owned, and time-bounded
- confirm the residual-risk statement is truthful

## Escaped-Defect Cadence

For every escaped production defect:

- create a defect-feedback review
- identify which layer should have caught it
- add or strengthen the missing check
- update the coverage matrix or process guide when the miss exposed a reusable
  policy gap

Do not batch this indefinitely into a vague future retrospective.

## Monthly Cadence

Recommended monthly QA governance review:

- review `docs/standards/platform-status/QA-RELEASE-STATUS.md`
- review recurring waiver/quarantine reasons
- review recurring escaped-defect patterns
- review whether the coverage matrix needs new deterministic triggers
- review whether Codex skills, templates, and standards docs still reflect the
  repo's actual QA posture

Expected outputs:

- refreshed QA platform-status wording when the baseline moved
- process or template updates when drift is discovered
- clearer trigger rules for newly recurring test classes

## Ownership Guidance

Default ownership:

- feature-loop owner:
  completes slice-specific QA artifacts
- release owner:
  validates blocking-gate posture
- repo/process owner:
  maintains the QA standards, templates, and platform-status baseline

## Hard Rule

Do not treat the QA operating system as complete just because the automation
exists. If cadence artifacts are missing, stale, or routinely bypassed, the QA
system is drifting even if the test suite is large.
