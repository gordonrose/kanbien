# Product Request: <Title>

## Status

- Product Request ID:
- Date:
- Current status:
- Requester-facing status:
- Source channel:
  `chat | api | support | operator | ide | cli`
- Owning context:
- Priority:
- Related model:
  `docs/workspace/harness-audits/2026-05-06-product-request-backlog-model.md`

## Human Summary

- Target users:
- Change type:
- Routing layer:
  `config-builder | tenant-extension-pr | core-platform-pr | needs-routing-decision`
- What we are trying to accomplish:

## Artifact Links

- Product Discovery packet:
- Technical Steering packet:
- Story Breakdown:
- Task Breakdown:
- PRD:
- Capability Matrix:
- PRD-derived test cases:
- Layer 1 Runtime Contract:
- Permission Mapping:
- API Contract:
- Work runs / Loop Runs:
- Pull requests, config changes, or extension changes:

## Epic Index

Use this for folder-style Product Requests. List every `epics/EPIC-*` folder
and keep the `Epic ID` exactly the same as the folder name.

| Epic ID | Title | Status | Epic Artifact | Summary |
| --- | --- | --- | --- | --- |
| EPIC-001-<epic-slug> | <Human-readable epic title> | <status> | `docs/workspace/product-requests/<request-slug>/epics/EPIC-001-<epic-slug>` | <Plain-language summary of what this epic contains.> |

## End-To-End Hierarchy

New Product Requests should use this folder shape by default:

```text
docs/workspace/product-requests/<request-slug>/
  request.md
  discovery.md
  steering.md
  epics/
    EPIC-001-<epic-slug>/
      epic.md
      stories/
        S-001-<story-slug>/
          story.md
          task-breakdown.md
          tasks/
            T-S001-01-<task-slug>.md
```

The hierarchy should make containment obvious, but the owning artifact still
keeps its normal responsibility. Product Request summarizes; Discovery owns
intent; Technical Steering owns architecture; Story Breakdown owns stories;
Task Breakdown owns isolated delivery tasks.

## What The Chat Widget Should Show

- Title:
- Status:
- Short update:
- Waiting next:
- User action needed:

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
