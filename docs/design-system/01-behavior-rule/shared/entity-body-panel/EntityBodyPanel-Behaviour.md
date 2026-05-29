# Entity Body Panel Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared` |
| UI family | `entity-body-panel` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/default/patterns/entity-panel` |
| Proposed design-system URL | `/design-system/default/patterns/entity-body-panel` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/entity-body-panel/EntityBodyPanel-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/entity-body-panel/EntityBodyPanel-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person editing or reviewing the content for the currently selected entity panel section. |
| Normal job | The user can read, edit, review, and move through body content without losing the section meaning supplied by the containing entity panel and secondary index. |
| Success outcome | The body area clearly communicates what content is active, what can be changed, what is read-only or blocked, and how long content can be reached. |
| Non-goals | This rule does not define individual field controls, form validation APIs, workflow-builder behavior, token values, primitive markup, pattern CSS, component seams, canonical scenarios, templates, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| The current `entity-panel` proof renders proof-only placeholder body content. | `01-behavior-rule` then `04-pattern-contract` | `entity-panel` records the body slot as ungoverned. | A narrow `entity-body-panel` behavior rule is missing. | Recorded here as the body/content family. |
| Body content can include fields, text areas, radio/card selects, toggles, dropdowns, drawer selects, accordions, and workflow builder regions. | `03-primitive`, `04-pattern-contract`, and later per family | None for most hosted controls in this chain. | Each hosted control family needs its own governed pass before real rendering. | Deferred; the body panel may host only governed child families. |
| Long body content must remain reachable in desktop and mobile review. | `01-behavior-rule` then `04-pattern-contract` | `scroll-region-control` exists; `entity-panel` owns shell-level scroll containment. | The body panel needs its own scroll and reachability rule before composition. | Recorded here as body-content reachability. |
| The body panel must not become a dumping ground for route-local form markup. | `01-behavior-rule` | `entity-panel` consumer restrictions already block proof-only body content from being treated as governed controls. | A body-specific consumer restriction is needed. | Recorded here as a hard anti-drift rule. |
| Body content may need empty, read-only, error, loading, and blocked-foundation states. | `01-behavior-rule` now; later layers for rendering | No narrow body-panel state rule. | Later layers must not invent state behavior locally. | Recorded here as observable body states. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| default | The body area presents the currently active section content and remains associated with the containing entity panel context. |
| empty | The body area communicates that there is no content to show without implying a loading failure or hidden error. |
| loading | The body area communicates that content is being prepared and does not expose fake editable controls before data is ready. |
| read-only | The body area communicates content that can be reviewed but not changed. |
| editable | The body area allows governed hosted controls to receive input while preserving the active section context. |
| validation or error | The body area communicates which content needs attention without relying only on color, position, or icon shape. |
| blocked foundation | The body area communicates when a needed hosted control family is not governed yet, and downstream work must not treat the placeholder as a real control. |
| long content | The body area keeps long content reachable through a governed scroll owner or mobile page-scroll posture. |
| mobile active body | On mobile, the body area can take priority as the working view after a secondary item is selected. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| enter body area | The user can identify which section content they are reviewing or editing. |
| move through body content | The user can reach all available body content in a predictable order. |
| edit governed content | Input is allowed only through hosted controls that have their own governed lower-layer or pattern contracts. |
| encounter read-only content | Read-only content is distinguishable from editable content without relying only on disabled-looking styling. |
| encounter validation or error | The user can identify the affected content and understand the required next action when that action is known. |
| encounter missing hosted control | The user sees a blocked-foundation state rather than a fake local approximation of the missing control. |
| return to navigation context | Mobile body view must preserve a path back to the containing entity-panel navigation behavior. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Text field, text area, radio, toggle, dropdown, drawer select, accordion, card select, and workflow builder internals | Each family needs its own behavior rule and later-layer governance. |
| Body padding, grid, columns, typography, separators, scroll skin, height, and surface values | These are `02-token` decisions. |
| Field row markup, label semantics, form-control semantics, and disclosure behavior | These are `03-primitive` decisions once required tokens exist. |
| Composition of multiple fields, accordions, cards, and workflow-builder regions | These are `04-pattern-contract` decisions after required primitives exist. |
| Entity page template, backend data loading, save behavior, persistence, and app adoption | These belong to later product or app layers, not this behavior rule. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which body layout tokens are reusable beyond entity panels | `02-token` | The behavior rule can require reachability and context preservation, but not spacing or sizing values. |
| Which low-level field and body primitives are promoted first | `03-primitive` | The body panel can host governed controls, but cannot create their primitive behavior. |
| Whether the body panel pattern is a simple host, a section stack, an accordion host, or a form-builder host | `04-pattern-contract` | Composition and slot ownership belong to the pattern layer. |
| How body state maps to backend save, permission, or validation contracts | later product/component layers | The behavior rule cannot define app or backend contracts. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove body reading order, error/status communication, and return-to-navigation behavior remain understandable in RTL. |
| zoomed in 150% | Later layers must prove body content remains reachable and does not overlap its containing panel or hosted controls. |
| zoomed out 75% | Later layers must prove body boundaries and active section context remain recognizable. |
| dark theme | Later layers must prove body content, read-only state, and blocked-foundation state remain legible. |
| desert theme | Later layers must prove body content, read-only state, and blocked-foundation state remain legible. |
| dark theme with error | Later layers must prove error communication remains distinct from normal, read-only, and blocked states in dark theme. |
| desert theme with error | Later layers must prove error communication remains distinct from normal, read-only, and blocked states in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Keyboard users must be able to enter the body area, move through body content, reach governed hosted controls, and return to the containing navigation context when mobile body view is active. |
| Focus | Focus must remain visible and predictable when content scrolls, when validation appears, and when the body view changes between navigation and content contexts. |
| Names and semantics | The body area needs an understandable programmatic relationship to the active entity-panel section; later layers must not rely on visual placement alone. |
| Error and status communication | Empty, loading, read-only, validation, error, and blocked-foundation states must be communicated with text or semantics, not color alone. |
| Color-independent meaning | Active content, read-only content, errors, and blocked foundations must not rely only on color, shape, or position. |
| Later proof owners | Contrast, target size, scroll affordance rendering, control semantics, validation semantics, and responsive geometry belong to Layer 2 and later rendered proof layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

Consumers must not render real form, builder, select, or accordion controls in
the entity body panel until those hosted families have their own governed
foundation.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Body layout, sizing, spacing, and scroll ownership values | `02-token` | no | No body-panel pattern may claim readiness while inventing these values locally. |
| Field, textarea, select, toggle, accordion, card-select, drawer-select, and workflow-builder families | `01-behavior-rule` through later layers per family | no | The body panel may show blocked or placeholder evidence only; it cannot claim hosted-control readiness. |
| Body composition pattern | `04-pattern-contract` | no | The `/design-system/default/patterns/entity-body-panel` route cannot be marked consumable until the pattern contract exists. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/entity-body-panel/EntityBodyPanel-Behaviour.md` |
| Stable lookup key | `shared/entity-body-panel/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this rule against behavior and accessibility evals. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Define or reuse body layout, scroll, spacing, and state tokens only where lower-layer values are missing. | Pattern work must not invent visual or sizing values. |
| 3 | `03-primitive` | Promote hosted body primitives one family at a time before the body pattern renders them as real controls. | Most hosted controls are not governed yet. |
| 4 | `04-pattern-contract` | Define the `entity-body-panel` pattern as a governed body/content host. | Blocked until required token and primitive dependencies are signed. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The body/content behavior is now narrow enough for token inventory, but pattern rendering remains blocked until required token and primitive dependencies are governed. |
