# Searchable Selection Panel Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `searchable-selection-panel` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/tokens/search-panel`; `/design-system/tokens/filter-panel-structure`; `/design-system/components/drawer-select`; `/design-system/canonicals/drawer-select` |
| Proposed design-system URL | not assigned at Layer 1 |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/searchable-selection-panel/SearchableSelectionPanel-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/searchable-selection-panel/SearchableSelectionPanel-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person choosing one or more items from a panel without losing track of what is already selected. |
| Normal job | The user searches available options, reviews selected and unselected options, changes the selection, and leaves the panel with the selection meaning still clear. |
| Success outcome | The user can tell what is selected, what remains available, whether search found matches, and whether selection mode allows one item or many items. |
| Non-goals | This rule does not govern panel stacking, drawer trigger summaries, filter query semantics, result-list rendering, backend search, token values, primitive markup, pattern routes, component APIs, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Source routes show a panel that includes search, selected choices, available choices, empty states, and long labels. | `01-behavior-rule` plus later layers | Legacy source routes only; `card-list-select` governs option-card selection but not search-panel composition. | `searchable-selection-panel` behavior rule was missing. | Recorded here as the reusable family behavior. |
| Search narrows available choices while selected choices remain understandable. | `01-behavior-rule` | none for this family | Behavior ownership was missing. | Recorded here. |
| Options can be grouped as selected and not selected. | `01-behavior-rule` and `04-pattern-contract` | `card-list-select` owns low-level multi-select card behavior, not panel grouping. | Pattern composition must wait for this behavior rule and lower-layer gates. | Recorded as behavior; structure deferred. |
| Drawer select needs single-select and multi-select modes. | `01-behavior-rule` and later drawer-select behavior | `simple-dropdown-control` governs compact single-select only; `card-list-select` governs multi-select cards only. | Drawer-select mode semantics still need their own behavior rule after this foundation. | This rule names mode clarity but does not define drawer-select value APIs. |
| Count cards, filter panels, and drawer summaries may reuse selected-count meaning. | `01-behavior-rule` and later layers | legacy count-card route is source material only. | Count-summary behavior and visual tokens are not governed here. | Deferred; this rule only requires selected count meaning to remain clear when supplied. |
| Text may exceed the available panel width. | `01-behavior-rule` and `03-primitive` | `truncating-label` governs overflow-gated disclosure for text. | Downstream patterns must consume governed disclosure rather than clipping locally. | Recorded as mandatory behavior. |
| Panel side, stacking, and mobile overlay are reusable. | `04-pattern-contract` | `panel-stack` is review-ready. | none for this rule. | Marked as dependency, not redefined here. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| default | The panel has a clear purpose, visible selection state, and usable option list. |
| search-empty | No search text is active, and the available options represent the unfiltered option set supplied by the consumer. |
| search-active | Search text is active, and available options are narrowed without hiding selected items unexpectedly. |
| no-match | Search found no available matches, and the panel explains that the result is empty rather than loading or broken. |
| selected-items | Selected items remain visible or discoverable while search changes available matches. |
| none-selected | The panel communicates that no item is selected when selection is optional or not yet made. |
| single-select | Choosing an enabled option replaces the previous selection. |
| multi-select | Choosing an enabled option toggles that option without changing unrelated selected options. |
| disabled-option | A disabled option remains visible when supplied but cannot be selected or deselected. |
| loading | Options are being refreshed, and stale search results are not presented as confirmed current results. |
| error | Failed option loading or failed search refresh is communicated as a failure, not as an empty result. |
| truncated text | Any truncated label, supporting text, group heading, or selected summary must expose full text through governed text-overflow disclosure only when truncation occurs. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| enter search text | Available options update according to the search text while selected-state meaning remains clear. |
| clear search text | The available option set returns to the unfiltered state supplied by the consumer. |
| select option in single-select mode | The chosen option becomes selected, the previous selected option is cleared, and selected meaning is visible without relying on color alone. |
| select option in multi-select mode | The chosen option toggles independently, and selected count or selected grouping updates when supplied. |
| deselect option in multi-select mode | The option becomes unselected without changing unrelated selections. |
| move through the panel by keyboard | Search, option controls, selected groups, available groups, and close or action controls are reachable in a predictable order when present. |
| close panel | Focus returns to the opener or a documented stable origin owned by the consuming drawer or panel-stack pattern. |
| request full truncated text | Full text is available only when text is actually truncated and must not be implemented with native `title` alone. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Panel side, flush stacking, mobile overlay order, and panel layering | These are governed by `panel-stack`. |
| Search field frame, panel spacing, count card frame, selected surfaces, icons, color, typography, radius, shadow, and scroll skin | These are Layer 2 token decisions. |
| Native search input semantics, clear button behavior, option-card semantics, truncation measurement, and tooltip disclosure | These are Layer 3 primitive decisions. |
| Exact panel section layout, selected/not-selected grouping anatomy, and scroll-owner composition | These are Layer 4 pattern-contract decisions. |
| Drawer-select trigger text, apply/cancel behavior, persisted value shape, and app events | These belong to the future drawer-select family and later component seams. |
| Backend search, async persistence, filtering a result page, or route query updates | These are product or app contracts outside this design-system behavior rule. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Whether search uses existing text-field tokens or needs a narrower search-field token | `02-token` | The behavior rule requires search behavior, not visual frame values. |
| Whether selected/not-selected sections need a reusable selection-panel frame token | `02-token` | Grouping may need signed spacing and surface values before pattern proof. |
| Whether count-summary cards share choice-card tokens or need a count-card token | `02-token` | Count summaries appear reusable but must not be invented inside this rule. |
| Search input primitive boundary | `03-primitive` | Search semantics, clear affordance, keyboard behavior, and accessible naming belong to the primitive layer. |
| Selected summary primitive boundary | `03-primitive` | Count or selected-summary controls need a primitive decision if they become reusable controls. |
| Searchable panel composition | `04-pattern-contract` | Pattern work owns the arrangement of search, groups, options, scroll regions, and action areas. |
| Drawer-select composition | `04-pattern-contract` and later | Drawer select must consume this foundation and panel-stack rather than defining them locally. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Search, selected grouping, available grouping, option order, and focus order remain understandable without reversing selection meaning. |
| zoomed in 150% | Search, option controls, selected summaries, empty/no-match/error states, and close or action controls remain reachable and readable. |
| zoomed out 75% | Selected, unselected, disabled, loading, and error states remain distinguishable. |
| dark theme | Later layers must prove search, selected state, disabled state, no-match, and count meaning remain readable without relying on color alone. |
| desert theme | Later layers must prove search, selected state, disabled state, no-match, and count meaning remain readable without relying on color alone. |
| dark theme with error | Later layers must prove loading, no-match, selected state, and error communication remain distinct in dark theme. |
| desert theme with error | Later layers must prove loading, no-match, selected state, and error communication remain distinct in desert theme. |
| constrained width | Later layers must prove all text roles truncate through governed disclosure and do not overlap controls. |
| mobile/narrow panel | Later layers must prove the panel remains usable when composed inside `panel-stack` mobile overlay behavior. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Search, option controls, selected groups, available groups, close controls, and supplied actions must be keyboard reachable when present. |
| Focus | Opening, searching, selecting, clearing search, and closing must not strand focus or hide the focused control. |
| Names and semantics | The panel must expose a clear accessible purpose; search must be named; options must expose labels and selected or disabled meaning. |
| Error and status communication | Loading, no-match, none-selected, selected-count, disabled, and error states must be communicated in text or programmatic state by later layers. |
| Color-independent meaning | Selected, unselected, disabled, loading, no-match, and error meaning must not rely on color alone. |
| Later proof owners | Contrast, target size, scroll behavior, tooltip disclosure, focus visibility, and rendered keyboard behavior belong to later token, primitive, pattern, and verification layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

Consumers must not treat legacy `/design-system/tokens/search-panel`, `/design-system/tokens/filter-panel-structure`, `/design-system/components/drawer-select`, or `/design-system/canonicals/drawer-select` markup as governed adoption.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Search field visual frame and any clear affordance values | `02-token` and `03-primitive` | no | No searchable-selection pattern can claim readiness until search input values and primitive behavior are governed or existing seams are proven sufficient. |
| Selected/not-selected panel grouping frame values | `02-token` | no | Pattern proof cannot invent grouping spacing, surfaces, separators, or scroll values. |
| Count summary or selected-summary control | `02-token` and `03-primitive` | no | Drawer-select and filter-panel summaries cannot claim governed readiness from legacy count-card routes. |
| Searchable-selection-panel pattern composition | `04-pattern-contract` | no | Drawer select cannot consume this family until the pattern contract exists. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/searchable-selection-panel/SearchableSelectionPanel-Behaviour.md` |
| Stable lookup key | `shared/searchable-selection-panel/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, legacy token routes, component routes, canonical routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this behavior rule. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Inventory whether existing text-control, choice-card, panel, scrollbar, and supporting-text tokens cover search field, selected grouping, count summary, and panel content spacing. | Primitive and pattern work must not invent missing visual or layout decisions. |
| 3 | `03-primitive` | Define or reuse search-field and selected-summary primitives only after token gates pass. | Pattern work must not render search, clear, summary, or truncation behavior locally. |
| 4 | `04-pattern-contract` | Compose the searchable-selection-panel pattern from accepted primitives and signed tokens. | Drawer select and filter panel work must wait for this composition. |
| 5 | `04-pattern-contract` and later | Build drawer-select only after `panel-stack` and `searchable-selection-panel` foundations are consumable. | Drawer select must not own reusable panel stacking or searchable selection behavior. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines stable searchable-selection behavior and explicitly blocks primitive or pattern work until token inventory proves whether existing seams cover search field, selected grouping, and selected-summary decisions. |
