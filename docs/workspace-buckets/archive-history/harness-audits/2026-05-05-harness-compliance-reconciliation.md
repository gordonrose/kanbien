# Harness Compliance Reconciliation

## Status

- Status: `needs-reconciliation`
- Date: 2026-05-05
- Trigger:
  user asked whether recent harness decisions and changes are being tracked for
  compliance standards purposes, and whether chats are still being recorded
  under chat bootstrap.
- Related chat record:
  `docs/workspace/chat-records/2026-05-05-chat-record-and-harness-compliance-tracking.md`

## Summary

Recent harness work is partially tracked through harness audits, standards
updates, planning artifacts, validators, and branch-stack reconciliation notes.

However, recent active harness branches are not consistently represented in
`docs/workspace/chat-bootstraps/`. That folder currently reflects older
isolation records and should not be treated as a complete record of recent
conversation decisions or unacted work.

This is a compliance tracking gap. It does not mean the harness work is
unrecoverable, but it does mean the repo needs a reconciliation pass before
claiming the recent harness changes are fully artifact-complete.

## Current Tracking Surfaces

Known useful tracking surfaces:

- `docs/workspace/harness-audits/`
- `docs/workspace/chat-bootstraps/`
- `docs/workspace/chat-records/`
- `docs/workspace/branch-stack-reconciliations/`
- `docs/standards/change-artifact-requirements.md`
- `docs/standards/git-workflow-guardrails.md`
- `docs/architecture/build-from-spec-change-harness.md`
- `docs/workspace/story-breakdown/`
- `docs/workspace/task-breakdown/`
- `docs/workspace/technical-steering/`
- validator and summary scripts in `package.json`

## Gap Classification

| Gap | Current Evidence | Risk | Required Reconciliation |
| --- | --- | --- | --- |
| Chat bootstrap freshness | latest observed bootstrap file was modified on 2026-04-30 | active branches may lack explicit base/worktree/write-set records | backfill bootstrap or equivalent reconciliation records for active May harness branches |
| Conversation decision capture | no dedicated chat-record folder existed before this pass | decisions, deferred work, and rejected interpretations may be lost | use `docs/workspace/chat-records/` for durable summaries |
| Active branch accounting | `npm run codex:tasks` shows active branches without bootstrap metadata | work may be auditable only through git commits and scattered docs | create branch-level reconciliation notes for active branches |
| Compliance closure language | harness work has docs and validators, but missing bootstrap/chat coverage remains | work may be overstated as fully compliant | classify as partially documented until reconciled |

## Active Branches To Reconcile

Observed active branches from `npm run codex:tasks`:

- `codex/l4-permission-mapping-authz-model`
- `codex/l4-evidence-qa-task-type`
- `codex/platform-authz-definition`

The first branch is the current worktree and has dirty task-breakdown
validator/template changes outside this reconciliation note. Those changes
were not modified by this pass.

## Decision

Going forward, use separate records for separate evidence needs:

- chat bootstrap:
  pre-edit isolation record for material work
- chat record:
  durable conversation summary for decisions, concerns, deferred obligations,
  rejected interpretations, and missed-work reconciliation
- harness audit:
  process/system-level analysis of the change harness
- branch-stack reconciliation:
  branch and commit accounting for work that exists outside the current branch

## Next Actions

- Backfill chat records for any recent conversations that made durable harness
  decisions but did not create artifacts.
- Reconcile missing bootstrap metadata for active May 2026 harness branches.
- Consider adding chat-record requirements to the governed change loop so this
  does not rely on memory.
- Consider adding a simple validator or task summary output that lists active
  branches without bootstrap records and asks whether a chat record exists.

