# Passing Example: Filter Panel Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `filter-panel` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `none` |
| Proposed design-system URL | `/design-system/patterns/filter-panel` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/filter-panel/FilterPanel-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/filter-panel/FilterPanel-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person narrowing a list of records. |
| Normal job | The user narrows the current list while staying oriented to available, active, cleared, loading, and failed filter choices. |
| Success outcome | The user can tell which filters are active, change them, clear them, and understand whether the displayed list is filtered. |
| Non-goals | This rule does not govern individual filter-field primitives or list-result rendering. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Behavior States

| State | Observable Behavior |
| --- | --- |
| closed | The panel is not visible, and the trigger still communicates whether filters are active. |
| open | Available filters, active filters, and actions are visible enough for the user to continue filtering. |
| active-filters | Active filters remain understandable until they are changed, cleared, or replaced by a later confirmed state. |
| empty-options | A filter with no available choices explains that no choices are available. |
| loading | Filter options are being retrieved, and stale choices are not presented as current choices. |
| error | Failed filter loading is communicated as a failure, and the user is not left guessing whether choices are missing or still loading. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| open panel | Opening the panel preserves active filters. |
| clear filters | Clearing filters makes the cleared state visible before the user leaves the panel. |
| apply filters | Applying filters leaves the user with a visible indication that the list is filtered. |
| close panel | Closing the panel returns the user to the list without hiding whether filters remain active. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Color, spacing, radius, and motion values | Token choices belong to `02-token`. |
| Filter field primitive names | Primitive choices belong to `03-primitive`. |
| Panel layout, slots, and responsive anatomy | Pattern structure belongs to `04-pattern-contract`. |
| Component props or callbacks | Component seam decisions belong to a later component layer. |
| Pattern route, demo route, and canonical scenario files | Rendered pattern proof belongs to later pattern, demo, and canonical layers. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which semantic tokens communicate active, loading, and error states | `02-token` | The behavior rule requires meaning, not token values. |
| Which trigger primitive opens the panel | `03-primitive` | The behavior rule only requires an operable way to open the family. |
| How panel sections are arranged | `04-pattern-contract` | Layout anatomy must preserve the behavior but is not this layer's decision. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove the panel remains understandable and operable without reversing meaning or losing return focus. |
| zoomed in 150% | Later layers must prove active, loading, error, clear, apply, and close behavior remains reachable and readable. |
| zoomed out 75% | Later layers must prove state indicators remain recognizable and controls are still identifiable. |
| dark theme | Later layers must prove active and inactive filter meaning remains distinguishable without relying on color alone. |
| desert theme | Later layers must prove active and inactive filter meaning remains distinguishable without relying on color alone. |
| dark theme with error | Later layers must prove error communication remains distinct from active-filter communication in dark theme. |
| desert theme with error | Later layers must prove error communication remains distinct from active-filter communication in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | The trigger, filter choices, clear action, apply action, and close action must be keyboard reachable when present. |
| Focus | Opening and closing behavior must define where focus moves and where focus returns. |
| Names and semantics | The trigger must have an accessible name that communicates the panel purpose and active-filter posture. |
| Error and status communication | Loading, empty-options, active-filter, and error states must be communicated in text and programmatically in later layers. |
| Color-independent meaning | Active, empty, loading, and error meaning must not rely on color alone. |
| Later proof owners | Contrast, target size, motion, zoom, and rendered focus proof belong to later token, pattern, demo, canonical, and verification layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| None. | None. | no | No ungoverned dependency limits this behavior rule. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/filter-panel/FilterPanel-Behaviour.md` |
| Stable lookup key | `shared/filter-panel/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Accept this behavior rule after eval. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Confirm or define the state and surface token needs for this pattern family. | Primitive and pattern work must not invent missing visual decisions. |
| 3 | `03-primitive` | Confirm whether the trigger and field primitives already exist for this pattern family. | Pattern work must not invent missing primitive behavior. |
| 4 | `04-pattern-contract` | Define the reusable filter-panel pattern contract. | The family is ultimately a pattern/component candidate, but pattern work waits until foundation decisions are explicit. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule names the observable behavior for a future pattern family, but the example still has unresolved token decisions before primitive or pattern work can be claimed. |
