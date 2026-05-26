# Defect Feedback Review Template

## Metadata

- Defect or incident reference:
- Scope:
- Owner:
- Date:
- Related feature or release:

## Defect Summary

- What happened:
- Customer or operational impact:
- Severity:
- Escaped to:
  local / CI / staging / production

## Root Cause

- Technical root cause:
- Process root cause:
- Why existing checks did not prevent it:

## Coverage Gap Analysis

- Which layer should have caught this:
  unit / integration / end-to-end / security / audit / persistence /
  performance / resilience / concurrency / compatibility / exploratory
- Was the layer missing, weak, flaky, or mis-scoped:
- Which `TC-*` or `JY-*` artifacts were affected:

## Required Improvement

- New or strengthened executable test:
- New or strengthened exploratory QA:
- Change to coverage matrix or release-gate rule:
- Change to journey inventory or PRD test cases:

## Closure Rule

- [ ] Improvement has been implemented or explicitly scheduled with owner/date.
- [ ] Related artifacts were updated.
- [ ] The defect is not being treated as an isolated one-off when it exposed a reusable QA gap.

## Notes

- Additional context:
