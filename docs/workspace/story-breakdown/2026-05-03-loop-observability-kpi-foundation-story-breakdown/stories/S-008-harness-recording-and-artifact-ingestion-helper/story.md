# Story Breakdown Story: Harness recording and artifact ingestion helper

## Story Detail

- Story ID:
  `S-008`
- Title:
  Harness recording and artifact ingestion helper
- Context:
  This is needed so evidence can be recorded consistently during normal work, instead of each workflow inventing its own recording steps.
- Value Type:
  `harness-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As the harness, I need helpers that record evidence and ingest changed artifacts without direct SQL.
- Actor / System Perspective:
  harness/system actor
- Outcome:
  Harness can record loop evidence through the feature public seam.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  S-005

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is needed so evidence can be recorded consistently during normal work, instead of each workflow inventing its own recording steps.

**Goal**
Reviewers can understand what should be true afterward: Harness can record loop evidence through the feature public reusable connection.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Harness recording and planning record ingestion helper into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S008-01 | S-008 | Harness helper opens loops, updates tasks, appends events and metrics, and closes loops through the feature public seam. | mixed | helper integration; contract; persistence | implementation blueprint; test cases |
| AC-S008-02 | S-008 | Changed artifacts are derived from git or PR metadata before harness enrichment. | source-level | classifier; fixture; integration | implementation blueprint |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-008 | AC-S008-01 | loopObservability.recordHarnessEvidence | platform helper | create-or-refresh-required | Helper consumes public seam. |
| S-008 | AC-S008-02 | loopObservability.importChangedArtifacts | platform helper | create-or-refresh-required | Git/PR-derived path truth. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-004 | S-008 AC-S008-01 | platform harness helper | new-capability | new | helper contract | helper integration tests |
| DEP-005 | S-008 AC-S008-02 | git or PR metadata | external-provider | existing | changed path source proof | classifier fixture tests |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
