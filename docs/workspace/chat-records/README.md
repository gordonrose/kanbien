# Chat Records

## Purpose

This folder keeps durable records of material Codex/user conversations that
may affect future implementation, compliance review, artifact reconciliation,
or missed-work recovery.

Repo bucket classification: `shared-governance-kernel`.

Chat records are not replacements for chat bootstraps.

- `docs/workspace/chat-bootstraps/` records isolation facts before material
  work begins: branch, base commit, worktree, planned write set, and shared
  seams.
- `docs/workspace/chat-records/` records conversation facts that may matter
  later: decisions, concerns, deferred work, unacted requests, rejected
  interpretations, compliance questions, and reconciliation notes.

## When To Create Or Update A Record

Create or update a chat record when a conversation includes any of the
following:

- a product, architecture, compliance, security, permission, asset, harness, or
  standards decision
- a user concern that current tracking, evidence, or artifact coverage may be
  stale or incomplete
- work that is discussed but intentionally not acted on yet
- a rejected interpretation that should not reappear in code, tests, docs, or
  future planning
- a handoff note needed for a future chat, branch, worktree, artifact sweep, or
  issue reconciliation
- a visible runtime defect or user-visible regression diagnosis that may need
  later audit

Tiny tactical chats do not need a record unless they create a durable decision
or a deferred obligation.

## Minimum Fields

Use a short Markdown file named:

```text
YYYY-MM-DD-<short-slug>.md
```

Minimum content:

- Date
- Conversation scope
- Related branch, worktree, and bootstrap artifact if any
- User concern or request
- Decisions made
- Work discussed but not acted on
- Follow-up obligations
- Artifact/compliance impact
- Evidence gathered
- Current status

## Status Values

Use one of these statuses:

- `recorded`
- `needs-reconciliation`
- `partially-reconciled`
- `superseded`
- `closed`

Do not mark a record `closed` while it still names unresolved follow-up
obligations.
