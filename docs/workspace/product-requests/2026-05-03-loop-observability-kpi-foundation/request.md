# Product Request: Loop Observability And KPI Foundation

## Status

- Product Request ID:
  `PRQ-2026-05-03-loop-observability-kpi-foundation`
- Date:
  2026-05-08
- Current status:
  `story-breakdown`
- Requester-facing status:
  Ready for ADR and planning artifact work
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
  teams, customer visibility, tenant visibility, UI dashboards, and full OLAP
  reporting are later scope.
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
  `docs/workspace/story-breakdown/2026-05-03-loop-observability-kpi-foundation-story-breakdown`
- Task Breakdown:
  not created yet
- PRD:
  `docs/prd/2026-05-02-0023-loop-observability-and-kpi-foundation.md`
- Capability Matrix:
  not created yet
- PRD-derived test cases:
  not created yet
- Layer 1 Runtime Contract:
  not applicable for current v0 scope
- Permission Mapping:
  not created yet
- API Contract:
  not created yet
- Implementation Blueprint:
  not created yet
- Work runs / Loop Runs:
  none yet
- Pull requests, config changes, or extension changes:
  none yet

## Epic Index

| Epic ID | Title | Status | Epic Artifact | Summary |
| --- | --- | --- | --- | --- |
| EPIC-loop-observability-kpi-foundation | Loop observability and KPI foundation | story-breakdown | `docs/workspace/story-breakdown/2026-05-03-loop-observability-kpi-foundation-story-breakdown/epic.md` | Breaks the loop observability request into planning and delivery stories for ADR alignment, capability matrix, test-case planning, implementation blueprint, durable capture, scorecards, traceability, helper/API seams, maintained artifacts, future UI, and future OLAP export. |

## What The Chat Widget Should Show

- Title:
  Loop observability and KPI foundation
- Status:
  Story planning blocked on artifact unblocks
- Short update:
  Product intent and Technical Steering direction are captured and the
  requester has approved v0 as internal harness/Codex loop evidence and
  scorecards first. Broader human-driven loops, customer/tenant visibility, UI
  dashboards, and full OLAP export remain deferred until the durable
  capture/read model is stable. The next required work is ADR and PRD
  reconciliation, followed by capability matrix, PRD-derived test cases, and
  implementation blueprint before schema or API implementation.
- Waiting next:
  ADR and PRD reconciliation
- User action needed:
  none for the approved v0 scope

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
