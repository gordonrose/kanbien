# Story Breakdown Epic Template

Use this as `epic.md` when a Story Breakdown packet is split into a folder:

```text
docs/workspace/story-breakdown/<epic-slug>/
  epic.md
  stories/
    S-001-<story-slug>.md
```

Stories may also be directories when Layer 4 tasks should sit directly under
their parent story:

```text
docs/workspace/story-breakdown/<epic-slug>/
  epic.md
  stories/
    S-001-<story-slug>/
      story.md
      task-breakdown.md
      tasks/
        T-S001-01-<task-slug>.md
```

Use the folder format by default when the packet has multiple active stories,
when individual stories need to be reviewed separately, or when Layer 4 task
files should sit directly under their parent story. Single-file Story Breakdown
packets remain valid for small packets where one file stays readable.

## Status

- Packet status:
  `draft | blocked | ready-for-task-breakdown | superseded`
- Packet date:
- Epic ID:
- Epic title:
- Source Product Discovery packet:
- Source Technical Steering packet:
- Related PRD:
- Related capability matrix:
- Related GOV:design-system, asset, ADR, or architecture artifacts:
- Validation command:
- Validation status:
  `not-run | pass | blocked | not-applicable`

## Handoff Validation

- Product Discovery status:
- Technical Steering status:
- Steering non-goals preserved:
- Steering stop conditions resolved or carried as blockers:
- Architecture invention check:
  `consumes-steering-only | proposes-new-architecture | blocked`
- Governed DEV:frontend seam posture:
  `not-applicable | ready-seam | missing-seam | approved-exception | blocked`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
- Missing source-of-truth artifacts:

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |

## Epic Summary

- Epic job to be done:
- Epic outcome:
- Epic actors:
- Epic non-goals:
- Epic dependency summary:
- Epic-level proof target:
  `source-level | contract-level | persistence-level | runtime-api | rendered-browser | human-visible-parity | deployment-runtime-process | mixed`

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday
  product or business language.
- For planning or control stories, explain the planning purpose directly, such
  as breaking the epic into capabilities or helping plan implementation more
  accurately.
- Avoid vague planning shorthand such as promises or visual work.
- Each active story file under `stories/` must also include a standalone
  `## Story Narrative` block so the story can be understood without opening
  `epic.md`.

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |

## Story Readiness Summary

- Ready stories:
- Blocked stories:
- Stories needing capability matrix:
- Stories needing PRD refinement:
- Stories needing Technical Steering revisit:
- Broad cleanup or shortcut risk:
  `none | listed-below`
- Architecture invention risk:
  `none | listed-below`

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
