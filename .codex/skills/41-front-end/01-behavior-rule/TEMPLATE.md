# <UI Family Name> Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `<design-system-name>` |
| UI family | `<ui-family-name>` |
| Harness layer | `01-behavior-rule` |
| Rule status | `<draft | review-ready | accepted | blocked>` |
| Existing design-system URL | `<url-or-none>` |
| Proposed design-system URL | `<url-or-none>` |
| Behavior artifact path | `<path>` |
| Files affected now | `<behavior-artifact-path-only>` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | `<who this family is for>` |
| Normal job | `<what the user must be able to do>` |
| Success outcome | `<how the user knows the job worked>` |
| Non-goals | `<known out-of-scope behavior, or "None provided">` |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

Complete this section when the rule is derived from a rendered route,
screenshot, template, canonical, app-like review surface, or other source
material. If no source material exists, state `not applicable`.

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| `<observed behavior, interaction, scroll, overflow, repeated structure, or responsive posture>` | `<01-behavior-rule | 02-token | 03-primitive | 04-pattern-contract | later>` | `<path-or-none>` | `<missing seam, blocked, or none>` | `<recorded here, deferred, or blocked>` |

## Behavior States

Include only states that apply to this UI family.

Each row must describe observable behavior.

| State | Observable Behavior |
| --- | --- |
| default | `<behavior>` |
| `<state-name>` | `<behavior>` |

## Required Interactions

List only interactions that create behavior decisions for this family.

| Interaction | Observable Behavior |
| --- | --- |
| `<interaction-name>` | `<behavior>` |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| `<state, interaction, or layer detail>` | `<why it is out of scope for this behavior rule>` |

## Deferred Decisions

Use this section when a real decision exists but belongs to a later layer.

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| `<decision-or-none>` | `<layer-or-none>` | `<reason>` |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | `<expected behavior or later evidence required>` |
| zoomed in 150% | `<expected behavior or later evidence required>` |
| zoomed out 75% | `<expected behavior or later evidence required>` |
| dark theme | `<expected behavior or later evidence required>` |
| desert theme | `<expected behavior or later evidence required>` |
| dark theme with error | `<expected behavior or later evidence required>` |
| desert theme with error | `<expected behavior or later evidence required>` |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | `<keyboard expectation>` |
| Focus | `<focus expectation>` |
| Names and semantics | `<accessible name, label, role, or semantic expectation>` |
| Error and status communication | `<text and programmatic communication expectation>` |
| Color-independent meaning | `<how meaning avoids relying on color alone>` |
| Later proof owners | `<contrast, target size, motion, zoom, or other proof deferred to later layers>` |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| `<dependency-or-none>` | `<layer-or-none>` | `<yes-or-no>` | `<what cannot be called complete>` |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `<path>` |
| Stable lookup key | `<design-system-name>/<ui-family-name>/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | `<accept, revise, or block this rule>` | `<reason-or-none>` |
| 2 | `<next-layer>` | `<next foundation action>` | `<reason-or-none>` |
| 3 | `<later-layer-or-none>` | `<later action that must wait>` | `<reason-or-none>` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `<layer-name>` |
| Next layer status | `<allowed | blocked | scaffold-only>` |
| Reason | `<why this is the next step>` |
