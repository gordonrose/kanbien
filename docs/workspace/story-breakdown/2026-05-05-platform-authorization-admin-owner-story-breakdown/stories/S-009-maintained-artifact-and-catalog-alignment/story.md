# Story Breakdown Story: Maintained artifact and catalog alignment

## Story Detail

- Story ID:
  `S-009`
- Title:
  Maintained artifact and catalog alignment
- Context:
  This is needed to keep the written rules, examples, and tests aligned with how the role actually works.
- Value Type:
  `harness-value`
- Delivery Shape:
  `DOC:docs-artifact`
- Job To Be Done:
  As repo governance, I need permission mappings, capability catalog materialization, API contracts, data dictionaries, and tests to stay aligned after runtime slices land.
- Actor / System Perspective:
  governance harness
- Outcome:
  No implementation slice is treated complete while downstream artifacts remain stale.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-000 through S-008

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is needed to keep the written rules, examples, and tests aligned with how the role actually works.

**Goal**
Reviewers can understand what should be true afterward: No implementation slice is treated complete while downstream planning records remain stale.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Maintained planning record and catalog alignment into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S009-01 | S-009 | Permission mappings, capability catalog source registry/materialization, API contracts, data dictionaries, feature manifests, and generated dependency graph are updated only when runtime implementation changes their source truth. | source-level | standards review | artifact sweep |
| AC-S009-02 | S-009 | No UI or admin workflow exposes a capability as usable until the mapping/catalog posture is `runtime-enforced` and route tests prove enforcement. | mixed | security; frontend-gate when UI exists | permission mapping; capability catalog; tests |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-009 | AC-S009-01 | platform-authz.artifact-sweep | governance | create-or-refresh-required | Maintained artifacts. |
| S-009 | AC-S009-02 | platform-authz.ui-eligibility.runtime-enforced | security/frontend governance | create-or-refresh-required | UI blocked until runtime-enforced. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-008 | S-009 | capability contract catalog materialization | feature-public-seam | changed | Expanded source posture materialization contract. | Drift/materialization tests when implemented. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-009 | governance reviewer | artifact author | implementation slice complete; artifacts stale | mappings; catalog; API; data dictionary; tests | source paths; generated graph | current to stale to refreshed | generated artifact drift | standards compliance; recoverability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
