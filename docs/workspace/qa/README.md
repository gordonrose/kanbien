# QA Workspace

This folder holds durable QA operating artifacts that complement executable
tests and test-run summaries.

Use this folder for:

- feature-loop and release QA checklists
- structured exploratory QA notes
- escaped-defect feedback reviews
- waiver and quarantine records for blocking suites or release gates

These artifacts are part of the QA operating system, not informal side notes.

See also:

- [QA Operating Cadence Guide](/home/gordon/kanbien/docs/architecture/guides/qa-operating-cadence-guide.md)

## Expected Files

- checklist templates and completed checklists
- exploratory QA templates and completed notes
- defect feedback templates and completed reviews
- waiver or quarantine record templates and completed records
- illustrative example records for operating-control training and reuse

## Relationship To Other QA Artifacts

- `docs/workspace/test-run-summaries/`
  holds curated summaries of what was executed and what confidence was
  established.
- this folder
  holds the operating-control artifacts that explain how human QA review,
  exceptions, and escaped-defect improvement are handled.

## Naming Guidance

Recommended naming:

- checklists:
  `<date>-<scope>-qa-checklist.md`
- exploratory notes:
  `<date>-<scope>-exploratory-qa-note.md`
- defect feedback reviews:
  `<date>-<scope>-defect-feedback-review.md`
- waiver or quarantine records:
  `<date>-<scope>-qa-waiver-or-quarantine.md`
