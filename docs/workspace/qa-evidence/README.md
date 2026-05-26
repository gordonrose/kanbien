# QA Evidence

This folder stores source-controlled QA evidence packets.

Repo bucket classification: `shared-governance-kernel`.

Use this folder for concrete runtime, live-data, browser, visual, mock-honesty,
or other verification evidence that supports a specific task, story, feature
loop, or issue reconciliation.

Evidence records are point-in-time proof. They do not prove current behavior
forever unless the relevant commands, data shape, served assets, and runtime
environment are rerun or reconciled.

The Task Breakdown harness has an `EVIDENCE:qa-evidence` lane; use that lane
when evidence collection is the owning task type rather than a side effect of
implementation.

Do not move this folder without updating task-type guardrails, Layer 5
evidence expectations, and downstream story/task artifacts that cite evidence
paths.
