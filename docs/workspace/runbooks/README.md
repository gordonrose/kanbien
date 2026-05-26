# Runbooks

This folder stores workspace runbooks for operational procedures and support
checks that are still close to active delivery work.

Repo bucket classification: `shared-governance-kernel`, with platform or
feature subject ownership per runbook.

Runbooks may describe operating rules, incident checks, cleanup actions,
support commands, and evidence that should be recorded for platform workflows.

Before relying on a runbook as live operating truth, reconcile it with current:

- implementation code
- scheduler or job posture
- support commands
- ADRs and standards
- security, privacy, and cleanup requirements

Do not use this folder for one-off story notes that have no operational reuse.
Do not move it without updating task guardrails and any feature artifacts that
cite these runbooks.
