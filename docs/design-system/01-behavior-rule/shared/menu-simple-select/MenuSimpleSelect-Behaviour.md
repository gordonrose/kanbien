# Menu Simple Select Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared` |
| UI family | `menu-simple-select` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | legacy `/design-system/components/simple-select`; legacy `/design-system/tokens/dropdowns`; screenshot source from entity page header review |
| Proposed design-system URL | `/design-system/default/primitives/menu-simple-select-control` after token and primitive gates pass |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/menu-simple-select/MenuSimpleSelect-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/menu-simple-select/MenuSimpleSelect-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A user choosing one item from a compact page-header or toolbar selector. |
| Normal job | Open a compact trigger, review a short menu of mutually exclusive choices, choose one item, and see the trigger update to the chosen item. |
| Success outcome | The menu closes, the chosen item is visibly and programmatically selected, and the containing page can react to the selected value. |
| Non-goals | Multi-select, free text search, async loading, virtualized long lists, command menus, modal or drawer selectors, route navigation, app adoption, backend persistence. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Screenshot shows a compact header trigger that opens an anchored menu rather than a modal, drawer, or full page. | `01-behavior-rule` | none in active 41-front-end chain | `menu-simple-select` behavior rule missing | Recorded here as the core family behavior. |
| Header use may require a square icon-only trigger where visible text is supplied by surrounding context. | `01-behavior-rule`, later `02-token` and `03-primitive` | none for this family | Icon trigger behavior and accessible naming missing | Record that icon-only triggers are allowed only when the primitive preserves a full accessible name and current value. |
| Screenshot shows exactly one current option and mutually exclusive choices. | `01-behavior-rule` | none in active 41-front-end chain | Behavior rule missing | Recorded here as single-selection behavior. |
| Screenshot shows current option meaning through text plus surface treatment. | `01-behavior-rule`, later `02-token` and `03-primitive` | none for this family | Token and primitive gates must later define state styling and semantics | Behavior records that selected/current meaning must not rely on color alone; visual values deferred. |
| Screenshot menu items show eyebrow/category text, main label/count text, and trailing type text. | `04-pattern-contract` if composed as item content, `03-primitive` for low-level option semantics | none for this family | Item anatomy cannot be finalized in behavior rule | Deferred to later layers; behavior requires each option to expose a clear visible label and selected meaning. |
| Screenshot shows a scrollable anchored menu panel when options exceed visible space. | `01-behavior-rule`, later `02-token` and `04-pattern-contract` | none for this family | Scroll size and panel geometry tokens/pattern are missing | Behavior records anchored panel with internal scrolling; dimensions deferred. |
| Legacy `simple-select` surfaces use a trigger, hidden value, listbox, and option buttons. | `03-primitive` | legacy route-local implementation only | No active primitive artifact for this family | Reuse as evidence only; later primitive must formalize semantics before runtime reuse. |
| Legacy `dropdowns` token page defines visual/markup examples outside active token artifacts. | `02-token` and `03-primitive` | legacy route-local implementation only | No active token artifact for this family | Reuse as source material only; token work must create governed values. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| closed | The trigger shows the current selection and does not show the option menu. |
| icon trigger | The trigger may render as a square icon-only affordance, but it must keep a programmatic name that includes the control label and current value. |
| open | The menu is anchored to the trigger, exposes the available choices, and keeps focus within the select interaction until selection, dismissal, or focus escape. |
| current option | Exactly one option represents the current value when a value exists. |
| no selection | The trigger communicates that a selection is required or absent without pretending a real value exists. |
| disabled | The trigger cannot open the menu, cannot change value, and communicates disabled state visibly and programmatically. |
| constrained height | The menu keeps the trigger anchored and scrolls internally rather than pushing unrelated page content out of place. |
| empty options | The menu does not offer fake options; it communicates that no choices are available. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| open trigger | Activating the trigger opens the anchored menu and exposes the options. |
| dismiss | Escape, outside click, or focus leaving the select interaction closes the menu without changing value. |
| choose option | Activating an enabled option selects it, updates the trigger, and closes the menu. |
| keyboard traversal | Arrow-key traversal moves between enabled options while the menu is open. |
| keyboard selection | Enter or Space selects the focused enabled option while the menu is open. |
| disabled option handling | Disabled options cannot be selected and are skipped or communicated clearly during traversal. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Search/filter inside the menu | This family is for short menus; searchable combobox behavior needs a separate rule. |
| Drawer or modal presentation | The screenshot and header use case require an anchored compact menu. |
| Long-list virtualization | The family may scroll, but virtualized data loading is a later or different family. |
| Header placement | Placement inside the entity page header is a later pattern-composition decision. |
| Persistence and routing | The select reports a value; application state changes belong outside this family. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Trigger, menu, option, selected, hover, disabled, focus, and panel visual values | `02-token` | Behavior cannot define colors, spacing, borders, radius, typography, or dimensions. |
| Text-backed and square icon-only trigger frame variants | `02-token` and `03-primitive` | Behavior allows both trigger variants; token and primitive layers must prove their frame values and accessible names. |
| ARIA role strategy, focus management implementation, hidden value posture, and controller events | `03-primitive` | These are low-level control semantics and runtime behavior. |
| Rich option row anatomy with eyebrow, main text, trailing taxonomy, and counts | `04-pattern-contract` | This composes option semantics with repeated content structure. |
| Header slot placement and interaction with the entity page header | `04-pattern-contract` | Header composition must consume the select seam rather than recreate it. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Trigger icon, panel attachment, option content order, and keyboard behavior must remain understandable in RTL. |
| zoomed in 150% | Trigger and menu text must remain readable without overlapping; the menu may scroll internally. |
| zoomed out 75% | Trigger, panel, and current option must remain distinguishable and aligned to the source trigger. |
| dark theme | Closed, open, current, hover, focus, and disabled states must remain legible. |
| desert theme | Closed, open, current, hover, focus, and disabled states must remain legible. |
| dark theme with error | If a later layer allows error context, error meaning must be visible and programmatic without relying on color alone. |
| desert theme with error | If a later layer allows error context, error meaning must be visible and programmatic without relying on color alone. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | The trigger, traversal, selection, and dismissal behavior must be operable without a pointer. |
| Focus | Focus must move predictably between trigger and menu and must not become trapped after dismissal. |
| Names and semantics | The trigger must have an accessible name; options must expose their labels and current/selected state. |
| Error and status communication | Error behavior is not intrinsic here; if later layers add error context, it must be communicated in text and programmatically. |
| Color-independent meaning | Current, disabled, focus, and unavailable states must not rely on color alone. |
| Later proof owners | Token and primitive layers must prove contrast, focus visibility, target size, zoom behavior, and semantic state exposure. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Legacy simple-select route markup and controller behavior | `03-primitive` | no | Later layers may inspect it as source material, but cannot call this family primitive-complete until a governed primitive artifact exists. |
| Legacy dropdown visual values | `02-token` | no | Later layers may inspect it as source material, but cannot consume visual values until governed tokens exist. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/menu-simple-select/MenuSimpleSelect-Behaviour.md` |
| Stable lookup key | `shared/menu-simple-select/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Treat this behavior rule as review-ready if the eval passes. | none |
| 2 | `02-token` | Create governed token artifacts for trigger, menu panel, option item, current state, disabled state, focus, spacing, and sizing values. | Token values are missing from the active harness chain. |
| 3 | `03-primitive` | Create the low-level select control primitive after token gates pass. | Primitive must not consume ungoverned legacy route values. |
| 4 | `04-pattern-contract` | Compose the menu item row pattern and header-select usage after primitive gates pass. | Pattern cannot render local select markup. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule identifies missing visual, sizing, focus, and state values that must be governed before primitive work can proceed. |
