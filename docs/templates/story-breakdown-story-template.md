# Story Breakdown Story Template

Use this for each file under:

```text
docs/workspace/story-breakdown/<epic-slug>/stories/S-001-<story-slug>.md
```

Or as `story.md` inside a story folder:

```text
docs/workspace/story-breakdown/<epic-slug>/stories/S-001-<story-slug>/story.md
```

The file or folder name must begin with the same stable story ID listed in
`epic.md`.

## Story Detail

- Story ID:
- Title:
- Context:
- Value Type:
  `user-value | system-value | harness-value`
- Delivery Shape:
- Job To Be Done:
- Actor / System Perspective:
- Outcome:
- Non-goals:

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday
  product or business language.
- For planning or control stories, explain the planning purpose directly, such
  as breaking the epic into capabilities or helping plan implementation more
  accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
