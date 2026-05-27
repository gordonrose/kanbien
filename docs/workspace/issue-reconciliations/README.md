# Issue Reconciliations

This folder is the running log of bugs or runtime defects that slipped past the
feature loop and what we changed to prevent repeats.

Repo bucket classification: `shared-governance-kernel`.

Use one dated file per incident.

Each note should capture:

- the user-visible symptom
- the concrete root cause
- why the feature loop missed it
- the architectural-first decision:
  shared contract, shared contract not possible, or justified local exception
- the code, test, doc, or process changes added afterward
- any follow-up gap that still remains open

Suggested filename pattern:

- `YYYY-MM-DD-short-incident-name.md`

Primary goal:

- make it easy to reconcile real defects against our feature-loop coverage over
  time so we can strengthen the loop based on evidence rather than memory

Repo workflow:

- when a user raises an escaped bug or asks why a defect was missed, route that
  work through the `issue-reconciliation-maintainer` skill
- the skill should identify the root cause, explain why the current suite
  missed it, and add or repair the most honest tests needed to reduce
  recurrence
- the skill should decide whether the fix belongs in shared architecture first
  before allowing a family-local patch to stand

## Cleanup Posture

Issue-reconciliation notes are evidence of escaped defects and prevention
learning. They are not automatically current standards. A note becomes durable
operating truth only when its lesson is promoted into source, tests, standards,
skills, templates, or other maintained guardrails.

Do not move this folder without updating the issue-reconciliation skill,
frontend design-system loop skill, coverage-strength scripts, integration
tests, and standards references that use this path.

Current freshness index:

- [2026-05-27 QA and issue-reconciliation freshness index](../qa/2026-05-27-qa-and-issue-reconciliation-freshness-index.md)

The freshness index is sampled, not exhaustive. Use it to choose the next
cleanup family before moving, archiving, or closing issue-reconciliation
records.
