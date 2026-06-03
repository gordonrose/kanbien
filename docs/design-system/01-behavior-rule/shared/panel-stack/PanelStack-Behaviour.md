# Panel Stack Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `panel-stack` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/tokens/search-panel`; `/design-system/tokens/filter-panel-structure`; `/design-system/tokens/count-card`; `/design-system/components/drawer-select`; `/design-system/canonicals/drawer-select` |
| Proposed design-system URL | `none yet` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person working through side-panel content such as selection panels, filter panels, display settings, detail panels, or related nested panels. |
| Normal job | The user can open one panel, open related panels from it, understand the stack order, and close or move between panels without losing orientation. |
| Success outcome | Panels appear from the intended edge, stack predictably on desktop, overlay predictably on narrow viewports, and preserve keyboard and focus orientation as the stack changes. |
| Non-goals | This rule does not define drawer-select values, filter behavior, search behavior, selectable-card behavior, token values, primitive markup, pattern anatomy, component APIs, route files, canonical scenarios, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Drawer-like panels appear in older drawer-select, search-panel, filter-panel, and display settings surfaces. | `01-behavior-rule` | `entity-panel` and `entity-body-placement` rules are related but do not govern reusable panel stacks. | Missing reusable `panel-stack` behavior rule. | Recorded here as the shared panel-stack family. |
| Panels may originate from either the left edge or the right edge. | `01-behavior-rule` | None for reusable side-panel stacks. | Missing origin behavior rule. | Recorded here. |
| A panel may open another panel beside it. | `01-behavior-rule` | None for reusable side-panel stacks. | Missing stack relationship rule. | Recorded here. |
| Desktop panels should sit flush together without local spacing invented by the consumer. | `01-behavior-rule` then `02-token` and `04-pattern-contract` | `panel-frame` exists for generic panel shell values, but no stack rule owns relationship behavior. | Stack relationship is missing; exact values deferred. | Behavior recorded here; values and composition deferred. |
| Narrow and mobile viewports should overlay stacked panels instead of squeezing all panels side by side. | `01-behavior-rule` then `04-pattern-contract` | Entity-panel mobile takeover is related but family-specific. | Missing reusable narrow-stack overlay rule. | Recorded here. |
| The panel furthest from the originating edge overlays panels closer to the edge on narrow/mobile viewports. | `01-behavior-rule` | None. | Missing overlay order rule. | Recorded here. |
| Focus should move into newly opened panels and return predictably when panels close. | `01-behavior-rule` then `03-primitive` and `04-pattern-contract` | No reusable panel-stack seam. | Missing focus handoff and return rule. | Recorded here as observable behavior; implementation deferred. |
| Layering must not rely on route-local z-index values. | `02-token` after behavior rule | `z-index-layering` is template-only; no signed token seam. | Missing layering token seam. | Deferred as a Layer 2 blocker. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| no open panels | The panel stack does not obscure the host surface. |
| single open panel | One panel is visible from its configured edge and has a clear relationship to the host surface. |
| left-origin stack | Panels originate from the left edge and additional panels extend inward from that edge. |
| right-origin stack | Panels originate from the right edge and additional panels extend inward from that edge. |
| desktop stacked panels | Multiple open panels sit flush beside each other in stack order without overlap when available width supports side-by-side placement. |
| narrow overlay stack | Multiple open panels overlay in stack order when available width cannot support side-by-side placement. |
| top overlay panel | On narrow viewports, the panel furthest from the originating edge is the active visible panel above earlier panels. |
| parent panel covered | A covered panel remains part of the stack but does not compete visually or behaviorally with the top overlay panel. |
| child panel closed | Closing a child panel reveals the next earlier panel in the stack and returns focus to a stable origin in that earlier context. |
| parent panel closed | Closing a parent panel cannot leave orphaned child panels with no understandable origin. |
| blocked foundation | If required token, primitive, or pattern seams are missing, later layers must stop at the earliest missing seam instead of approximating panel stacks locally. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| open first panel | A user can open the first panel from an explicit control or host action, and focus moves into the opened panel or to its first meaningful control. |
| open child panel | A user can open a related child panel from within an existing panel, and the new panel becomes the active panel in the stack. |
| move within active panel | Keyboard and pointer users can operate the active panel without accidentally interacting with visually covered panels. |
| close active child panel | The active child panel closes and the user returns to the previous panel context. |
| close parent panel | The stack resolves child panels in a deterministic way rather than leaving disconnected panels visible or focusable. |
| switch origin side | A consuming pattern can choose left or right origin without changing the meaning of stack order or focus behavior. |
| encounter narrow viewport | The stack changes from side-by-side posture to overlay posture without changing panel meaning or losing the active panel. |
| encounter long panel content | Long content remains reachable through a governed scroll owner rather than route-local scroll behavior. |
| encounter missing lower layer | A maintainer is directed back to the earliest missing governed layer instead of copying route-local panel markup, CSS, or controller behavior. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Panel width, max width, surface, border, radius, spacing, shadow, separator, overlay tint, z-index, scrollbar skin, and motion values | These are `02-token` decisions. |
| Panel shell markup, dialog or region semantics, close-button primitive, focus-trap implementation, resize behavior, and scroll-region primitive behavior | These are `03-primitive` decisions after required tokens are signed. |
| Exact stack DOM anatomy, slot names, child-panel composition, desktop layout mechanics, and mobile overlay implementation | These are `04-pattern-contract` decisions. |
| Drawer-select trigger behavior, search filtering, selected/not-selected grouping, selectable cards, count cards, and selected summary cards | These are separate behavior families or later pattern compositions. |
| Entity-panel-specific primary index, secondary index, and body priority rules | These remain governed by `entity-panel` and related entity-body rules. |
| Route topology, URL state, backend data loading, persistence, canonical scenarios, and app adoption | These belong to later governed layers or non-design-system governance. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which signed values govern panel width, edge placement, flush adjacency, overlay layering, scrim, shadow, motion, and scroll affordance visuals | `02-token` | Behavior names the need; token artifacts must sign reusable values. |
| Whether `z-index-layering` should be promoted as a broad token or a narrower panel-stack layering token | `02-token` | Later layers must not use route-local z-index values. |
| Which primitive owns generic panel surface semantics, close affordance wiring, focus handoff, inert/covered-panel behavior, and scroll ownership | `03-primitive` | Low-level semantics and behavior belong to primitives after tokens exist. |
| How multiple panel primitives compose into a reusable stack | `04-pattern-contract` | Multi-panel arrangement, overlay posture, and child relationships are pattern composition. |
| Whether drawer select, filter panel, display settings, and entity-panel surfaces all consume the same panel-stack pattern | `04-pattern-contract` or later | This rule sets the reusable foundation; each consumer still needs its own composition proof. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove left-origin and right-origin stacks remain understandable when direction changes, without reversing stack meaning by accident. |
| zoomed in 150% | Later layers must prove stacked panels, close controls, active panel content, and overlay posture remain reachable without incoherent overlap. |
| zoomed out 75% | Later layers must prove panel origins, stack boundaries, and active-panel relationship remain recognizable. |
| dark theme | Later layers must prove active, covered, and host surfaces remain distinguishable without relying on original-theme-only contrast. |
| desert theme | Later layers must prove active, covered, and host surfaces remain distinguishable without relying on original or dark theme assumptions. |
| dark theme with error | Later layers must prove error or blocked-foundation communication remains distinct from normal panel-stack state in dark theme. |
| desert theme with error | Later layers must prove error or blocked-foundation communication remains distinct from normal panel-stack state in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Keyboard users must be able to open a panel, move within the active panel, open a child panel, close the active panel, and return to a predictable prior panel or host context. |
| Focus | Focus must move into a newly opened panel, must not leak into visually covered panels, and must return predictably when a panel closes. |
| Names and semantics | Each panel must have an understandable visible or programmatic name, and the active panel must be distinguishable from covered panels. |
| Error and status communication | Missing lower-layer foundations, blocked panel states, loading states, and error states must be communicated as real status conditions when present. |
| Color-independent meaning | Origin side, active panel, covered panel, blocked state, and error state must not rely on color alone. |
| Later proof owners | Contrast, target size, focus rendering, overlay layering, text truncation, scroll affordance visuals, motion, and rendered stack geometry belong to Layer 2 and later rendered-proof layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

Consumers must not use route-local z-index, panel widths, overlay CSS, focus
logic, or close behavior to approximate panel stacking before the lower layers
are governed.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Panel width, edge placement, flush adjacency, overlay layering, scrim, shadow, motion, and scroll affordance values | `02-token` | no | Token, primitive, pattern, component, template, canonical, or app work for panel stacks cannot be called complete until required values are governed. |
| Generic panel surface, close affordance, focus handoff, covered-panel behavior, and scroll ownership primitives | `03-primitive` | no | Pattern work cannot claim stable behavior by rendering these locally. |
| Reusable stack composition for multiple panels | `04-pattern-contract` | no | Drawer select, filter panel, display settings, and app surfaces cannot claim governed panel stacking by copying existing routes. |
| Search, selectable cards, count cards, selected summaries, and drawer-select values | `01-behavior-rule` through later layers per family | no | Panel-stack readiness does not make these child families governed. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md` |
| Stable lookup key | `shared/panel-stack/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, canonical routes, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this behavior rule against `EVAL.md` and `ACCESSIBILITY-EVAL.md`. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Inventory existing panel, layer, motion, scroll, focus, and surface tokens; promote the smallest reusable seams needed for stack placement and overlay. | Later layers must not invent panel widths, stack gaps, z-index, overlay, or motion values. |
| 3 | `03-primitive` | Define panel surface and panel stack primitives only after required token seams are signed. | Primitive work is blocked until required token seams exist. |
| 4 | `04-pattern-contract` | Define the reusable panel-stack pattern with left/right origin, desktop flush stacking, narrow overlay order, close behavior, and focus evidence. | Pattern work is blocked until behavior, tokens, and required primitives are governed. |
| 5 | later | Let drawer select, filter panel, display settings, and other consumers compose the governed panel-stack pattern. | Consumers must not copy route-local panel behavior. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines reusable panel-stack behavior and names token inventory as the next foundation before primitives or patterns can be claimed. |
