# Test Run Summaries

This folder holds curated source-controlled summaries of important test runs.

These summaries complement CI artifacts.
They do not replace raw machine evidence.

## Use This Folder For

- production-gate and release-candidate test summaries
- significant feature-loop completion summaries
- approved exception or quarantine records for required tests
- standards-sensitive verification checkpoints

## Summary Expectations

Each summary should capture enough information for an engineer, reviewer, or
auditor to understand what was run and what confidence was established.

Include at minimum:

- date
- scope
- owner
- environment
- commands executed
- related PRD, `TC-*`, and `JY-*` artifacts
- covered tiers or journey scopes
- pass/fail outcome
- exceptions, quarantines, or approved deviations
- follow-up actions if anything remains open

Recommended naming:

- `<date>-<scope>-test-summary.md`

Examples:

- `2026-04-09-tenant-auth-policy-vertical-slice-test-summary.md`
- `2026-04-09-release-candidate-full-test-summary.md`

## Evidence Split

Preferred evidence model:

- CI stores raw machine output and structured reports
- this folder stores durable curated summaries that remain useful after CI
  retention windows expire
