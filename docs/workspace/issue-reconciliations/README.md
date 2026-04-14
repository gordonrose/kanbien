# Issue Reconciliations

This folder is the running log of bugs or runtime defects that slipped past the
feature loop and what we changed to prevent repeats.

Use one dated file per incident.

Each note should capture:

- the user-visible symptom
- the concrete root cause
- why the feature loop missed it
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
