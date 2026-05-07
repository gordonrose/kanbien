# Story Breakdown Story: Supported reporting widgets

## Story Detail

- Story ID:
  `S-003`
- Title:
  Supported reporting widgets
- Context:
  This is its own story because dashboard value depends on seeing the approved widget set behave well with realistic examples.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:frontend`
- Job To Be Done:
  As a dashboard template author, I need to populate containers with number tiles, pie charts, histograms, line charts, bar charts, and box plots using approved sample data.
- Actor / System Perspective:
  design-system maintainer
- Outcome:
  Each required widget has signed-off visual, empty, no-data, incompatible-data, and dense-data states.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-000 and S-001

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
The dashboard is only useful if its approved example widgets behave clearly
with realistic sample data.

**Goal**
A dashboard author can place the approved widget types and see honest examples
for normal, empty, crowded, and unusual data.

**Decisions Needed**
The work needs agreement on the required widget set and the sample situations
each widget must show.

**Work That Follows**
The work will prepare the widget examples that later detail and filter behavior
can use.

**Evidence Of Success**
A reviewer can inspect every approved widget type and see that difficult data
states are represented rather than hidden.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S003-01 | S-003 | Number tile, pie chart, histogram, line chart, bar chart, and box plot widgets each render from local sample fixtures with approved title, value, label, and unit semantics. | rendered-browser | widget visual matrix; fixture contract | pattern artifact; canonical scenarios |
| AC-S003-02 | S-003 | Widget examples include empty, loading, no-data, incompatible-data, too-many-category, long-label, null-value, negative-value, and outlier states. | human-visible-parity | state matrix; accessibility review | reference pack; verification checklist |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-003 | AC-S003-01 | reporting-dashboard.widget.render | design-system template | create-or-refresh-required | Covers required widget set. |
| S-003 | AC-S003-02 | reporting-dashboard.widget.state-matrix | design-system template | create-or-refresh-required | Covers fixture and degraded states. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-005 | S-003 / AC-S003-01 | dashboard widget sample-data seam | design-system-seam | new | Pattern artifact defines local fixture shape per widget type. | Browser scenarios render each required widget from fixtures. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| Reporting widget fixture seam | design-system route | Local sample data covers required widget and degraded states | Production analytics API shapes | Fixture contract and visual state matrix |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-003 | dashboard template author | internal design-system author | widget picker active | number, pie, histogram, line, bar, box plot; empty; incompatible | titles; values; labels; units; nulls; outliers | empty container to populated widget | fixture mismatch; widget render failure | accessibility; dense data; theme support |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S003-01 | dashboard template author; widget picker active; number, pie, histogram, line, bar, box plot; empty; incompatible | reporting-dashboard.widget.render | rendered-browser | TC obligation: cover widget visual matrix; fixture contract for Number tile, pie chart, histogram, line chart, bar chart, and box plot widgets each render from local sample fixtures with approved title, value, label, and unit semantics. | yes |
| AC-S003-02 | dashboard template author; widget picker active; number, pie, histogram, line, bar, box plot; empty; incompatible | reporting-dashboard.widget.state-matrix | human-visible-parity | TC obligation: cover state matrix; accessibility review for Widget examples include empty, loading, no-data, incompatible-data, too-many-category, long-label, null-value, negative-value, and outlier states. | yes |
