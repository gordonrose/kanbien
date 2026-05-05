# Product Request: Loop Observability And KPI Foundation

## Status

- Product Request ID:
  `PRQ-2026-05-03-loop-observability-kpi-foundation`
- Date:
  2026-05-06
- Current status:
  `blocked-product-intent`
- Requester-facing status:
  Waiting for Product Discovery confirmation
- Source channel:
  `chat`
- Owning context:
  root/internal harness first
- Priority:
  `not-set`
- Related model:
  `docs/workspace/harness-audits/2026-05-06-product-request-backlog-model.md`

## Human Summary

- Target users:
  Internal harness/Codex maintainers first. Broader human-driven delivery
  teams, customer visibility, tenant visibility, UI, and OLAP reporting are
  later scope.
- Change type:
  Durable loop evidence, KPI, scorecard, and traceability foundation.
- Routing layer:
  `core-platform-pr`
- What we are trying to accomplish:
  Give the harness a durable way to record what happened in each work loop,
  link tasks to changed artifacts, capture evidence and metrics, close loops
  with scorecards, and trace later defects or regressions back to the likely
  loop and task that caused them.

## Artifact Links

- Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-03-loop-observability-kpi-foundation.md`
- Technical Steering packet:
  `docs/workspace/technical-steering/2026-05-03-loop-observability-kpi-foundation-steering.md`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-05-03-loop-observability-kpi-foundation-story-breakdown.md`
- Task Breakdown:
  not created yet
- Work runs / Loop Runs:
  none yet
- Pull requests, config changes, or extension changes:
  none yet

## What The Chat Widget Should Show

- Title:
  Loop observability and KPI foundation
- Status:
  Waiting for Product Discovery confirmation
- Short update:
  A Product Discovery draft, Technical Steering draft, and Story Breakdown
  draft exist, but this Product Request is blocked until the requester confirms
  that the prior-context summary is accurate enough to proceed or chooses to
  re-run Product Discovery one question at a time.
- Waiting next:
  Product Discovery confirmation
- User action needed:
  Confirm that v0 should track internal harness/Codex loops first, with broader
  human-driven delivery loops, customer/tenant visibility, UI, and OLAP
  reporting deferred; or ask to re-run Product Discovery.

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
