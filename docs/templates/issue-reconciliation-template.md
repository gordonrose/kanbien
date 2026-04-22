# Issue Reconciliation Template

## Summary

- What escaped?
- What user-visible symptom exposed it?

## Root Cause

- Concrete cause in implementation terms

## Why The Existing Loop Missed It

- Missing coverage, wrong-layer coverage, unrealistic harness assumption,
  stale expectation, or shared-seam blind spot

## Architectural-First Decision

- Suspected shared seam:
- Existing governed pattern compared:
- Decision:
  `shared-contract fix required`, `shared-contract fix not possible because ...`,
  or `family-local exception approved because ...`
- Why a more central fix was or was not chosen:

## Reconciliation Changes

- Shared architecture or shared contract changes:
- Family adapter changes:
- Family-local changes, if any:
- Tests or audits added:
- Docs or harness guardrails added:

## Follow-Up Rule

- What should happen next time before anyone patches this locally?

## Verification

- Exact commands, browser routes, or proof artifacts used

## Resolution Status

- candidate fix awaiting user confirmation
- confirmed fixed
- local symptom patched only
