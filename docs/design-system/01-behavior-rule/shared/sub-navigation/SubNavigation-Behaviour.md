# Sub Navigation Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `sub-navigation` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/components/sub-nav`; `/design-system/patterns/sub-nav-row`; `/design-system/patterns/breadcrumb`; `/design-system/patterns/search-shell` |
| Proposed design-system URL | `none yet; later proof routes must be selected by their owning layers` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/sub-navigation/SubNavigation-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/sub-navigation/SubNavigation-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person orienting within the current page hierarchy while using page or workspace search. |
| Normal job | The user understands the current page location, can recover hidden breadcrumb path context when space is tight, and can use the search field without the row becoming unstable. |
| Success outcome | Breadcrumb and search coexist across desktop, compressed, mobile, RTL, theme, and magnified states without overlap, clipping, false hierarchy, or lost search affordance. |
| Non-goals | This rule does not govern top navigation, context navigation, page body content, search result rendering, route hierarchy generation, token values, primitive markup, component APIs, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Breadcrumb and search remain a shared governed row even when maintained as separate child families. | `01-behavior-rule` | `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md` `SN-000`; `docs/workspace/design-system/reference-packs/sub-nav-row-reference-pack.md` | No 41 artifact existed before this file. | Recorded here as the parent sub-navigation behavior. |
| The row negotiates width through the parent layout first, with breadcrumb yielding before search abandons its centered bounded presentation. | `01-behavior-rule` | `SN-001`; `SN-002`; `SN-003`; `SNR-001`; `SNR-002`; `SNR-003` | No 41 artifact existed before this file. | Recorded here as responsive row behavior. |
| Breadcrumb preserves current-page orientation, hides optional path segments honestly, and reduces through approved full, reduced, compact, and mobile-absence states. | `01-behavior-rule` | `docs/design-system/01-behavior-rule/shared/breadcrumb/Breadcrumb-Behaviour.md`; `docs/workspace/design-system/behavior-locks/breadcrumb-behavior-lock.md`; `docs/workspace/design-system/reference-packs/breadcrumb-reference-pack.md` | none | Delegated as a child-family obligation; this rule protects row composition. |
| Search remains centered and width-bounded on desktop/tablet, fills its shell, provides visible scope guidance, and becomes full width at the row mobile fallback. | `01-behavior-rule` | `docs/design-system/01-behavior-rule/shared/search-shell/SearchShell-Behaviour.md`; `docs/workspace/design-system/behavior-locks/search-shell-behavior-lock.md`; `docs/workspace/design-system/reference-packs/search-shell-reference-pack.md` | none | Delegated as a child-family obligation; this rule protects row composition. |
| Breadcrumb menus and shared-row tooltips must layer above the row while respecting higher-priority shell surfaces. | `01-behavior-rule` | `SN-004`; `SN-011`; `SN-011A`; `BCR-011`; `BCR-012` | Later token, primitive, and pattern layers must define and prove the actual overlay behavior. | Recorded here as layering and disclosure behavior; values and mechanics deferred. |
| Row updates refresh combined header geometry so downstream shell surfaces can anchor to the true header bottom. | `01-behavior-rule` | `SN-005` | The parent standard shell must consume this behavior when composing top and sub navigation. | Recorded here as a shell anchoring obligation. |
| RTL, themes, primary-colour inheritance, magnification, long labels, and localization are signed-off review dimensions. | `01-behavior-rule` | `SN-006` through `SN-010`; `SNR-005` through `SNR-008`; breadcrumb/search reference packs | Later layers must prove rendered outcomes without copying 40 route markup. | Recorded here as behavior and mandatory review dimensions. |
| Row height, columns, search width, breadcrumb spacing, surfaces, z-index, tooltip layer, focus, and compact dimensions are visible in source. | `02-token` | Some shared tokens exist, but no 41 sub-navigation token set is promoted. | Token work must identify consumable values after this rule and child mapping are accepted. | Deferred to `02-token`. |
| Breadcrumb links/buttons, collapse triggers, compact signpost trigger, search input, search hint, and tooltip anchors are low-level affordances. | `03-primitive` | Adjacent 41 primitives may exist, but this family has no complete primitive map. | Primitive work must confirm or create governed affordances before pattern work. | Deferred to `03-primitive`. |
| Row composition across breadcrumb, search, menus, mobile fallback, and header-offset effects is visible in 40 routes. | `04-pattern-contract` | 40 canonical/render routes exist as evidence. | No 41 sub-navigation pattern contract exists. | Deferred to `04-pattern-contract`. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| desktop full row | Breadcrumb and centered bounded search are both visible without overlap or clipping. |
| compressed desktop row | Breadcrumb yields through its approved reduction path while search remains centered and bounded. |
| active search | Search focus or active posture appears without shifting row geometry or obscuring breadcrumb context. |
| breadcrumb compact | Hidden breadcrumb path context remains recoverable through a lightweight reveal surface. |
| mobile fallback | Breadcrumb disappears entirely, and search occupies the available sub-navigation width. |
| RTL row | Breadcrumb order, menu anchoring, and search presentation mirror naturally for RTL reading order. |
| long-content pressure | Long breadcrumb labels, localized search prompts, and magnified UI do not force wrapping, overlap, or false hierarchy. |
| themed or accent-shifted | Approved themes and primary-colour selections affect surfaces and emphasis without changing row behavior. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| identify current page | The current page remains visible or recoverable through approved breadcrumb reduction states. |
| reveal hidden breadcrumb path | Hidden path steps become reachable through the approved lightweight reveal behavior without mixing compact and full trails. |
| dismiss breadcrumb reveal | Outside click and `Escape` close breadcrumb transient surfaces and return focus according to the child-family contract. |
| focus search | Search focus is visible and does not shift the row or hide breadcrumb context unexpectedly. |
| submit search | Search intent goes to the consuming search owner without redefining row structure. |
| switch responsive mode | The row changes to compressed or mobile behavior before overlap, clipping, wrapping, or unreadable controls appear. |

## Interaction Outcomes

| Interaction | Visible Result | Focus Result | Announced Result | Mobile Result | Owning Later Layer |
| --- | --- | --- | --- | --- | --- |
| reveal hidden breadcrumb path | A breadcrumb menu or compact signpost surface exposes hidden path steps. | Focus remains predictable from the breadcrumb trigger. | Later layers must expose expanded state, menu naming, and current-page meaning. | Breadcrumb is absent at the approved mobile fallback, so no mobile breadcrumb reveal is shown unless a later behavior revision approves it. | `03-primitive` then `04-pattern-contract` |
| dismiss breadcrumb reveal | The breadcrumb transient surface closes and the visible trail remains in its current reduction state. | Focus returns to the breadcrumb trigger when the child family owns focus return. | Later layers must expose collapsed state where applicable. | Mobile keeps breadcrumb absent and search full width. | `03-primitive` then `04-pattern-contract` |
| focus search | The search field shows clear focus without changing row geometry. | Focus stays in the search field until the user moves or submits. | Later layers must expose search purpose, input name, and any active/searching status when result behavior is in scope. | Search remains the full-width sub-navigation control. | `03-primitive` then `04-pattern-contract` |
| submit search | The search owner receives search intent. | Focus behavior after submit must be defined by the consuming search seam. | Later layers must communicate loading, result, empty, or error states when search results are in scope. | Search remains full width in the sub-navigation fallback. | `04-pattern-contract` or later |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Row dimensions, search width, spacing, colours, surfaces, z-index, tooltip layer, typography, and focus values | Token choices belong to `02-token`. |
| Breadcrumb controls, search input, search hint, menu controls, and tooltip/disclosure affordances | Primitive choices belong to `03-primitive`. |
| Row grid/flex anatomy, slot ownership, overflow measurement, menu placement, and mobile layout structure | Pattern structure belongs to `04-pattern-contract`. |
| Component receptors, search adapters, breadcrumb data shape, callbacks, and app imports | Component seam decisions belong to `05-component-seam`. |
| Route hierarchy generation, search result loading, search indexing, authorization, or persistence | Product and feature owners govern those behaviors. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which token seams express sub-navigation dimensions, surfaces, focus, tooltip, and responsive values | `02-token` | The behavior rule preserves outcomes, not values. |
| Which primitives own breadcrumb, search, menu, hint, and tooltip/disclosure behavior | `03-primitive` | Pattern work must not render low-level affordances locally. |
| How sub-navigation composes breadcrumb and search and updates shell anchoring | `04-pattern-contract` | Composition and measurement belong to the pattern contract. |
| How an app supplies breadcrumb hierarchy, search scope, result states, and callbacks | `05-component-seam` and later | Runtime consumption must wait for governed seams. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove breadcrumb ordering, separators, menu anchoring, search direction, row alignment, and compact behavior feel native in RTL. |
| zoomed in 150% | Later layers must prove breadcrumb reduction and search readability occur before overlap, clipping, wrapping, or unreadable controls appear. |
| zoomed out 75% | Later layers must prove the relationship between breadcrumb, search, and surrounding shell chrome remains recognizable. |
| dark theme | Later layers must prove breadcrumb, search, focus, menus, and tooltip/disclosure surfaces remain readable without behavior changes. |
| desert theme | Later layers must prove breadcrumb, search, focus, menus, and tooltip/disclosure surfaces remain readable without behavior changes. |
| dark theme with error | Later layers must prove future search error or status communication remains distinct from focus/current-page states in dark theme. |
| desert theme with error | Later layers must prove future search error or status communication remains distinct from focus/current-page states in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in
`../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Breadcrumb links, breadcrumb reveal controls, search input, search submission, and any menu items must be keyboard reachable when present. |
| Focus | Breadcrumb reveal and dismissal must preserve predictable focus return, and search focus must remain visible without layout shift. |
| Names and semantics | Breadcrumb, current page, hidden path reveal, search landmark or equivalent semantics, search input purpose, and mobile absence of breadcrumb must be understandable in later layers. |
| Error and status communication | Search loading, empty, result, or error states must be communicated in text and programmatically when those states enter the consuming seam. |
| Color-independent meaning | Current page, focus, open state, hidden path availability, search active state, and error/status meaning must not rely on color alone. |
| Later proof owners | Contrast, target size, focus rendering, tooltip/disclosure layer, menu layering, zoom, responsive overflow, and motion proof belong to later token, primitive, pattern, component, use-case, canonical, and verification layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper
markup.

Consumers must not treat the 40 behavior locks, reference packs, canonical
routes, screenshots, or route-local markup as construction APIs.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Sub-navigation token seams | `02-token` | no | Primitive and pattern work must not claim complete sub-navigation governance until token needs are identified and consumable. |
| Sub-navigation control primitives | `03-primitive` | no | Pattern work must not render row controls locally. |
| Sub-navigation pattern contract | `04-pattern-contract` | no | Component seam, use-case page, canonical, parity, and app adoption work remain blocked. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/sub-navigation/SubNavigation-Behaviour.md` |
| Stable lookup key | `shared/sub-navigation/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, copied fragments, 40 reference packs, or 40 behavior locks as direct construction APIs. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this promoted `sub-navigation` behavior rule. | No known sub-navigation parent-row behavior-rule blocker remains. |
| 2 | `02-token` | Inventory sub-navigation token needs against the signed-off `SNR-*`, `BCR-*`, and `SSR-*` reference states. | Primitive and pattern work must not invent visual values. |
| 3 | `03-primitive` | Confirm or create the low-level controls needed by sub-navigation. | Pattern work must not invent affordance behavior. |
| 4 | `04-pattern-contract` | Define the reusable sub-navigation pattern contract. | Pattern work waits for accepted behavior, consumable tokens, and consumable primitives. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The parent row behavior and child breadcrumb/search-shell behavior are promoted, so token inventory is the next valid decision. |
