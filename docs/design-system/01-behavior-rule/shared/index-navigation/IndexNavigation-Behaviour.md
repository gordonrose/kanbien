# Index Navigation Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `index-navigation` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/templates/entity_management_page`; `/design-system/tokens/entity-page-structure`; `/design-system/tokens/nested-entity-record` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |

## Purpose

Index navigation lets a user move between major sections of an entity body and,
when needed, move through a nested secondary section list without changing the
meaning of the entity body itself.

This rule covers primary and secondary index navigation, empty lists, add
actions, desktop and mobile scroll ownership, and optional desktop resizing.
It does not define token values, primitive markup, pattern CSS, component
props, template routes, or app adoption.

## Behavior States

| State | Observable Behavior |
| --- | --- |
| primary list | Shows the first-level entity body sections and exposes one current item when a section is active. |
| secondary list | Shows nested sections for the active primary section when nested navigation exists. |
| empty list | Shows a visible empty state instead of rendering fake items or hiding the navigation region without explanation. |
| add available | Exposes an add action for the owning list when the consumer allows creation. |
| add unavailable | Does not render an active add affordance when creation is not allowed. |
| desktop contained placement | The index navigation may fit to the available page height and own internal scrolling for long lists. |
| mobile page-scroll placement | The index navigation lists become fully visible in normal document flow; the page or proof container owns scrolling instead of trapping scroll inside each list. |
| resizable desktop placement | When resizing is enabled, the user may widen or narrow the navigation within governed minimum and maximum limits. |
| fixed desktop placement | When resizing is disabled, width remains controlled by signed sizing tokens or a governed host. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| move to item | Keyboard and pointer users can reach each enabled item in DOM order. |
| activate item | Activation reports the item value to the consumer without performing route changes locally. |
| identify current item | Current state is programmatically exposed and has a color-independent visual affordance. |
| encounter truncated text | Full text is disclosed only when rendered text is actually truncated. |
| use add action | Add activation reports the owning list context to the consumer without creating records locally. |
| resize navigation | Resizing changes navigation width only within governed min/max constraints and must not create horizontal page overflow. |
| switch to mobile | Mobile placement removes internal list scrolling so all list items can be reached through page or proof-container scroll. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Exact widths, breakpoints, spacing, surfaces, borders, icon size, and resize handle size | Layer 2 token decisions. |
| Button, icon button, tooltip trigger, resize handle, and list item markup | Layer 3 primitive decisions. |
| Primary/secondary panel composition and scroll container structure | Layer 4 pattern decisions. |
| Entity-page template layout, page shell, route selection, backend data loading, persistence, and app adoption | Later layers. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Min, max, standard, double, and resized widths | `02-token` | Width constraints must be signed before patterns can implement resize. |
| Resize handle visuals and target size | `02-token` then `03-primitive` | Resize must not invent handle size, focus, or interaction visuals locally. |
| Icon-only add affordance | `03-primitive` | The add action should be represented by a governed icon button primitive before the panel pattern consumes it. |
| Filter/index header anatomy | `02-token` then `03-primitive` or `04-pattern-contract` | Header text, action placement, and controls need lower-layer ownership before pattern readiness. |
| Desktop height fitting and mobile list-height fitting | `04-pattern-contract` | The pattern must prove desktop contained scrolling and mobile full-list page flow in rendered evidence. |

## Mandatory Review Dimensions

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| desktop height | Long lists fit the available desktop region and keep current, add, and resize affordances reachable. |
| mobile height | Lists expand to their content height and are reached through page or proof-container scroll. |
| right-to-left | Current indicators, resize affordance, item alignment, and tooltips remain understandable. |
| zoomed in 150% | Text, targets, and resize affordances remain operable without overlap. |
| zoomed out 75% | The relationship between primary and secondary lists remains recognizable. |
| empty data | Empty state is visible and does not remove the navigation landmark unexpectedly. |

## Accessibility Promise

This family follows the shared WCAG 2.2 AA default in
`../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Items, add actions, and resize affordances must be reachable and operable when they exist. |
| Focus | Focus must remain visible and must not be trapped by internal scrolling on mobile. |
| Names and semantics | Navigation regions, items, current state, empty state, and add actions must have understandable names. |
| Color-independent meaning | Current state and disabled/unavailable state must not rely on color alone. |
| Pointer and touch | Resize and add actions must use governed target sizes before they become consumable. |

## Consumer Restrictions

Consumers must not recreate index-navigation with app-local markup, CSS, or
controller behavior.

Consumers must not copy route-local `entity_management_page`,
`entity-page-structure`, or `nested-entity-record` markup as the governed
source of truth.

Consumers must not make a later-layer pattern review-ready while any required
primitive or token named by this rule remains missing.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Stable lookup key | `shared/index-navigation/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact before creating index-navigation tokens, primitives, or patterns. |
| What later layers must preserve | Behavior states, required interactions, review dimensions, accessibility promise, and consumer restrictions. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, legacy token routes, template markup, app code, or copied CSS. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `02-token` | Add or revise width, height, resize, icon-button, and header-related token seams required by this rule. | Later layers must not invent those values. |
| 2 | `03-primitive` | Add icon-button and resize-handle primitives after required tokens are signed. | Pattern work cannot own primitive behavior. |
| 3 | `04-pattern-contract` | Revise `index-nav-panel` and `index-nav` to prove desktop contained height, mobile full-list page flow, optional resizing, empty state, and add action behavior. | Pattern readiness depends on the lower layers. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule identifies sizing, resize, icon-button, and header token needs without defining concrete values. |
