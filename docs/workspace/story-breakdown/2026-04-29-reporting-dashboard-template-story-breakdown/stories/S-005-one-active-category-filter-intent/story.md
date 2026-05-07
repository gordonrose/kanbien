# Story Breakdown Story: One active category filter intent

## Story Detail

- Story ID:
  `S-005`
- Title:
  One active category filter intent
- Context:
  This is its own story because choosing a category should have a clear, reversible effect before more complex filtering exists.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:frontend`
- Job To Be Done:
  As a dashboard viewer, I need eligible category marks to emit one visible filter intent that can be replaced or cleared.
- Actor / System Perspective:
  dashboard viewer
- Outcome:
  Category filter behavior is local, explicit, removable, and honest for unsupported widgets and no-result states.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-003 and S-004

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
Choosing a category should have a clear and reversible effect before more
complex filtering exists.

**Goal**
A dashboard viewer can choose one eligible category, replace it with another,
and clear it.

**Decisions Needed**
The work needs agreement on which marks can filter, how the active choice is
shown, and how unsupported choices behave.

**Work That Follows**
The work will define a local sample filtering behavior that future product
pages can connect to real data only after separate planning.

**Evidence Of Success**
A reviewer can set, replace, and clear one category choice and see honest
unsupported and no-result states.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | S-005 | Category-bearing chart marks can set exactly one active filter intent, applying a new filter replaces the previous one, and clearing restores the unfiltered sample state. | rendered-browser | browser interaction; state transition | behavior lock; canonical scenarios |
| AC-S005-02 | S-005 | Number tiles and unsupported chart marks communicate that they are not filter targets, and no-result filtered states are represented honestly. | human-visible-parity | unsupported-state review; no-result review | reference pack; verification checklist |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-005 | AC-S005-01 | reporting-dashboard.filter.intent | design-system template | create-or-refresh-required | One active category filter. |
| S-005 | AC-S005-02 | reporting-dashboard.filter.unsupported-state | design-system template | create-or-refresh-required | Unsupported and no-result states. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-007 | S-005 / AC-S005-01 | category filter intent seam | design-system-seam | new | Event contract names local filter payload and unsupported targets. | Browser scenarios prove replace, clear, and no-result transitions. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| Reporting dashboard template controller seam | design-system route; future app dashboards | Browser-memory operations for layout, widget selection, detail, and filter intent | Durable saved dashboard definitions in first slice | Browser interaction scenarios |
| Category filter intent seam | future app dashboards | One explicit category-filter intent can be bound by a future app data layer | Client-side filter acting as authority for server data access | Browser state proof now; server authz proof in future app scope |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-005 | dashboard viewer | not-applicable: design-system sample | no filter; active filter; unsupported target | category mark; number tile; no-result dashboard | category key; filter label; clear action | set filter; replace filter; clear filter | unsupported mark clicked; no-result state | predictable state; compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | dashboard viewer; filter state transitions | filter intent row | rendered-browser | TC obligation: set, replace, clear, no-result scenarios | yes |
| AC-S005-02 | dashboard viewer; unsupported targets | unsupported filter state row | human-visible-parity | TC obligation: unsupported target messaging review | yes |
