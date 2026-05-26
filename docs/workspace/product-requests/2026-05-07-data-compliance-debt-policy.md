# Product Request: Data Compliance Debt Policy And Fail-On-Debt Gate

## Status

- Product Request ID:
  `PRQ-2026-05-07-data-compliance-debt-policy`
- Date:
  2026-05-07
- Current status:
  `intake`
- Requester-facing status:
  Policy request captured; ready for governance/discovery planning
- Source channel:
  `chat`
- Owning context:
  root/platform governance; data dictionary and compliance policy
- Priority:
  `not-set`
- Related model:
  `docs/workspace/product-requests/README.md`

## Human Summary

- Target users:
  Root/platform maintainers, compliance reviewers, and delivery agents that
  rely on data dictionary health signals before queueing or promoting work.
- Change type:
  Governance policy for data dictionary compliance debt and eventual
  fail-on-debt behavior.
- Routing layer:
  `core-platform-pr`
- What we are trying to accomplish:
  Decide how the repo should classify, own, resolve, accept, or block
  retention, cleanup, export/delete, and legal-hold review rows reported by
  `npm run data:compliance-health`, then define when scoped
  `--fail-on-debt` behavior is safe to enable.

## Artifact Links

- Product Discovery packet:
  pending
- Technical Steering packet:
  pending if policy/architecture ownership is needed
- Story Breakdown:
  pending
- Task Breakdown:
  pending
- Current hardening source:
  `.codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/task-type-hardening-plan.md`
- Current command evidence:
  `npm run data:compliance-health`
- Work runs / Loop Runs:
  none yet
- Pull requests, config changes, or extension changes:
  none yet

## What The Chat Widget Should Show

- Title:
  Data compliance debt policy and fail-on-debt gate
- Status:
  Intake
- Short update:
  Current data dictionary health reports 53 manual-review-required
  retention/export/delete/legal-hold rows. The gate now exposes and routes this
  debt, but fail-on-debt is intentionally deferred until policy owners decide
  which rows are resolved, accepted-deferred, split, or blocked.
- Waiting next:
  Governance policy planning
- User action needed:
  decide the owner and priority for the data compliance debt policy slice

## Source-Of-Truth Boundary

Product Request is a brief human-readable summary, status tracker, and artifact
index. It must not replace the linked artifacts.

- Product Discovery owns product intent.
- Technical Steering owns architecture decisions.
- Story Breakdown owns final story definitions.
- Task Breakdown owns task write sets and execution handoff.
- Loop Runs own execution evidence, scorecards, events, metrics, change sets,
  and changed artifact traceability.
- PRs own reviewable source-control changes.
