# Drawer Select Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `drawer-select` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/components/drawer-select`; `/design-system/canonicals/drawer-select`; `/design-system/canonical-renderings/drawer-select/*` |
| Proposed design-system URL | not assigned at Layer 1 |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/drawer-select/DrawerSelect-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/drawer-select/DrawerSelect-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person choosing one or more values from a drawer without losing the current committed value. |
| Normal job | The user opens a selector, searches and changes a pending selection, then either commits the selection or closes without committing. |
| Success outcome | The user can tell what is currently committed, what is pending in the drawer, whether the drawer is open, and whether selecting another item replaces or adds to the pending selection. |
| Non-goals | This rule does not govern panel stacking internals, search filtering, option-card behavior, count-card visuals, token values, primitive markup, pattern routes, component APIs, backend search, persistence, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Legacy drawer-select routes show a trigger that opens a side drawer for choosing values. | `01-behavior-rule` | legacy routes only | `drawer-select` behavior rule was missing. | Recorded here as drawer-select family behavior. |
| Drawer-like surfaces need side placement, stacked panels, and mobile viewport overlay behavior. | `02-token` and `04-pattern-contract` | `panel-stack` is review-ready. | mobile viewport overlay placement token is required before pattern consumption. | Drawer-select must consume `panel-stack` for internal stack order and `drawer-overlay-placement` for viewport takeover. |
| The open drawer contains search, selected options, available options, no-match, empty, and error states. | `04-pattern-contract` | `searchable-selection-panel` is review-ready. | none for behavior. | Drawer-select must consume `searchable-selection-panel`; it must not redefine search-panel behavior. |
| Resting triggers summarize selected values and selected count. | `01-behavior-rule`, `03-primitive`, and `04-pattern-contract` | `count-card-control` is review-ready for labelled count launchers. | Trigger summary pattern still belongs to later composition. | Behavior records committed summary meaning; visuals and structure are deferred. |
| Single-select and multi-select modes both appear in source material. | `01-behavior-rule` | `searchable-selection-panel` constrains panel selection modes. | Drawer-select committed value semantics were missing. | Recorded here as drawer-select value behavior. |
| Closing or cancelling the drawer should not silently commit pending changes. | `01-behavior-rule` | none for drawer-select. | Missing committed-versus-pending rule. | Recorded here. |
| Applying a selection should update the trigger summary and return focus predictably. | `01-behavior-rule` and later layers | upstream focus promises exist for panel-stack and count-card. | Drawer-select focus-return rule was missing. | Recorded here; exact implementation deferred. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| closed | The drawer is not visible, and the trigger communicates the committed selection summary. |
| open | The drawer is visible, and the user can inspect or change a pending selection without losing the committed selection. |
| pending unchanged | The pending selection matches the committed selection. |
| pending changed | The pending selection differs from the committed selection and can be committed or discarded by the consuming pattern. |
| single-select | Choosing an enabled option replaces the pending selection with that one value. |
| multi-select | Choosing an enabled option toggles that value in the pending selection without changing unrelated selected values. |
| none selected | The trigger and open drawer communicate that no value is selected when empty selection is allowed. |
| loading | The drawer communicates that options are being refreshed and does not present stale options as confirmed current results. |
| no-match | The drawer communicates that the current search has no available matches, while pending or committed selections remain understandable. |
| error | The drawer communicates a loading or search failure without treating it as an empty result. |
| disabled | The trigger remains understandable but cannot open the drawer or change selection. |
| truncated text | Any truncated trigger, selected summary, option label, or supporting text must expose full text through governed text-overflow disclosure only when truncation occurs. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| open trigger | The drawer opens through the governed panel stack, and focus moves into the drawer or first meaningful control. In mobile viewport posture, the open drawer covers the surrounding page/proof underlay until closed. |
| select option in single-select mode | The pending selection becomes exactly the chosen option. |
| select option in multi-select mode | The chosen option toggles in the pending selection without affecting unrelated selected options. |
| search options | Available options update through the searchable-selection-panel behavior, and selected values remain understandable. |
| apply pending selection | The committed selection updates to match the pending selection, the trigger summary updates, and focus returns to a stable opener or documented origin. |
| cancel or close without apply | Pending changes are discarded, committed selection remains unchanged, and focus returns to a stable opener or documented origin. |
| press Escape while open | The drawer closes using the same discard behavior as cancel unless a later component seam explicitly defines a different committed-save behavior. |
| activate disabled trigger | The drawer does not open, and disabled meaning remains clear. |
| request full truncated text | Full text is available only when the rendered text is actually truncated and must not be implemented with native `title` alone. |

## Interaction Outcomes

| Interaction | Visible Result | Focus Result | Announced Result | Mobile Result | Owning Later Layer |
| --- | --- | --- | --- | --- | --- |
| open trigger | Drawer appears in the panel stack. | Focus moves into the drawer or first meaningful drawer control. | Open state must be programmatically available. | Drawer uses signed viewport overlay placement while panel-stack owns internal panel order. | `02-token` and `04-pattern-contract` |
| apply pending selection | Trigger summary updates to committed selection. | Focus returns to opener or documented stable origin. | Updated committed selection must be communicated by text or programmatic state. | Drawer closes or returns to previous stack context. | `04-pattern-contract` and later |
| cancel or close without apply | Trigger summary remains unchanged. | Focus returns to opener or documented stable origin. | No false committed-change announcement. | Drawer closes or reveals previous overlay context. | `04-pattern-contract` and later |
| select option | Pending selection changes inside the drawer. | Focus remains on or near the operated option unless the consuming pattern has a documented reason. | Selected meaning must be exposed without relying on color alone. | Same meaning inside mobile overlay. | `04-pattern-contract` |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Panel side, flush stacking, internal mobile overlay order, covered-panel posture, and stack layering | These are governed by `panel-stack`. |
| Mobile viewport overlay placement above the surrounding page/proof underlay | This is governed by `drawer-overlay-placement` before the drawer-select pattern may consume it. |
| Search input behavior, no-match handling, selected/available grouping, and option filtering | These are governed by `searchable-selection-panel`. |
| Count-card surface, count slot, trigger typography, option-card visuals, scrollbars, focus rings, colours, and spacing | These are Layer 2 token and Layer 3 primitive decisions. |
| Exact drawer DOM anatomy, trigger layout, action-bar placement, and slot structure | These are Layer 4 pattern-contract decisions. |
| Public props, data adapters, backend search, persistence, route query state, analytics, demos, canonicals, and app adoption | These belong to later governed layers or non-design-system contracts. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Whether the resting trigger uses `count-card-control` alone or a richer trigger pattern around it | `04-pattern-contract` | The behavior only requires committed summary meaning. |
| Whether apply/cancel controls are mandatory in every drawer-select variant | `04-pattern-contract` and later component seam | Some component consumers may commit immediately; the behavior rule only requires the commit/discard model to be explicit. |
| Exact emitted event shape for committed and pending selection changes | `05-component-seam` | Public consumption APIs belong to the component seam. |
| Async option loading, backend search, and persistence | later app or feature contracts | This rule governs only the design-system interaction family. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Trigger summary, drawer origin, search, options, apply/cancel controls, and focus order remain understandable without reversing selection meaning. |
| zoomed in 150% | Trigger, drawer, search, options, action controls, focus, and feedback text remain readable and reachable. |
| zoomed out 75% | Open/closed state, committed summary, pending selection, and selected count remain recognizable. |
| dark theme | Trigger, drawer, selected state, disabled state, no-match, loading, and error states remain readable without relying on color alone. |
| desert theme | Trigger, drawer, selected state, disabled state, no-match, loading, and error states remain readable without relying on color alone. |
| dark theme with error | Drawer error state, trigger summary, selected state, and action controls remain distinct in dark theme. |
| desert theme with error | Drawer error state, trigger summary, selected state, and action controls remain distinct in desert theme. |
| constrained width | Trigger text, option labels, supporting text, and feedback text do not overlap controls; truncating text uses governed disclosure. |
| mobile/narrow panel | Drawer uses signed viewport overlay placement, preserves panel-stack internal overlay order, and keeps apply, cancel, close, search, and options reachable. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Keyboard users must be able to open the drawer, search, move through options, change pending selection, apply, cancel, and close. |
| Focus | Opening moves focus into the drawer; closing, applying, or cancelling returns focus to a stable opener or documented origin; focus must not leak into covered panels. |
| Names and semantics | The trigger must have an understandable accessible name and state; the drawer must have a clear accessible purpose; options must expose selected and disabled meaning. |
| Error and status communication | Loading, no-match, none-selected, pending changed, disabled, and error states must be communicated in text or programmatic state by later layers. |
| Color-independent meaning | Open, selected, disabled, changed, loading, no-match, and error meaning must not rely on color alone. |
| Later proof owners | Contrast, target size, focus rendering, text disclosure, scroll behavior, action control placement, and rendered keyboard behavior belong to later token, primitive, pattern, and verification layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

Consumers must not treat legacy `/design-system/components/drawer-select`,
`/design-system/canonicals/drawer-select`, or canonical-rendering routes as
governed adoption.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Drawer-select pattern composition | `04-pattern-contract` | no | Component seams, demos, canonicals, templates, and apps cannot claim drawer-select readiness until a governed pattern consumes `panel-stack`, `searchable-selection-panel`, and governed trigger/action controls. |
| Public value API and event contract | `05-component-seam` | no | App adoption cannot consume drawer-select directly from pattern proof markup. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/drawer-select/DrawerSelect-Behaviour.md` |
| Stable lookup key | `shared/drawer-select/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, interaction outcomes, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, legacy component routes, canonical routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this behavior rule. | No known behavior-rule blocker remains. |
| 2 | `04-pattern-contract` | Compose drawer-select from `panel-stack`, `searchable-selection-panel`, `count-card-control`, and governed button/icon-button controls where needed. | Pattern work must not redefine child behavior or token values. |
| 3 | `05-component-seam` | Define the public value/event API after the pattern passes. | App and template adoption need a stable component seam, not proof markup. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines drawer-select behavior, and the reusable foundations it depends on are already review-ready for the default design system. |
