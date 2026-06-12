# Context Navigation Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `context-navigation` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/components/context-nav`; `/design-system/canonicals/context-nav`; `/design-system/exploration/context-nav`; `/design-system/patterns/context-nav` |
| Proposed design-system URL | `none yet; later proof routes must be selected by their owning layers` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person moving between sections or shell utilities inside the current app or workspace context. |
| Normal job | The user sees the current context destination, moves to another context destination, and reaches persistent shell utilities without losing page orientation or access to page content. |
| Success outcome | Context navigation remains shell-attached, proportionate, scroll-safe, responsive, and recoverable across desktop, mobile, RTL, tooltip, drawer, long-label, theme, and magnified states. |
| Non-goals | This rule does not govern top navigation, sub-navigation, page body content, utility drawer payload details, backend job lifecycle, token values, primitive markup, component APIs, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Context navigation is shell-attached chrome rather than a floating content card. | `01-behavior-rule` | `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md` `SV-000`; `docs/workspace/design-system/reference-packs/context-nav-reference-pack.md` `CNR-001` | No 41 artifact existed before this file. | Recorded here as context-navigation behavior. |
| Desktop and wider tablet states use a narrow icon-first vertical rail with labels hidden until mobile fallback. | `01-behavior-rule` | `SV-001`; `CNR-001` | No 41 artifact existed before this file. | Recorded here as desktop rail behavior. |
| The family preserves two zones: top primary destinations and bottom persistent utility actions. | `01-behavior-rule` | `SV-001A`; `SV-001B`; `CNR-001`; `CNR-006`; `CNR-007` | Tools navigation is governed separately by `docs/design-system/01-behavior-rule/shared/tools-navigation/ToolsNavigation-Behaviour.md`. | Recorded here as context-navigation utility-zone behavior, distinct from page/workspace tools. |
| Under vertical pressure, only the top primary zone scrolls while the bottom utility zone remains visible and anchored. | `01-behavior-rule` | `SV-002A`; `SV-002B`; `SV-002C`; `CNR-002`; `CNR-004` | No 41 artifact existed before this file. | Recorded here as scroll-pressure behavior. |
| The rail aligns to the true combined header bottom edge. | `01-behavior-rule` | `SV-003` | Standard page shell pattern must preserve this when composing top and sub navigation. | Recorded here as shell anchoring behavior. |
| Active destination remains visible in rail and bottom-nav modes. | `01-behavior-rule` | `SV-004`; `CNR-001`; `CNR-005` | No 41 artifact existed before this file. | Recorded here as orientation behavior. |
| Mobile converts the rail into a labelled bottom navigation bar, with extra utility actions moving into a wide `More` sheet. | `01-behavior-rule` | `SV-002`; `SV-002A0`; `SV-005`; `SV-005A`; `CNR-005`; `CNR-006` | No 41 artifact existed before this file. | Recorded here as mobile behavior. |
| Tooltips, menus, and drawers launched from context navigation are real interactive states that close on outside click or `Escape` with focus return. | `01-behavior-rule` | `SV-007`; `SV-009`; `CNR-003`; `CNR-006`; `CNR-007` | Drawer chassis and payload behavior remain child families. | Recorded here as launcher behavior; payload details deferred. |
| RTL mirrors the rail to the right edge and mirrors tooltip, menu, and drawer anchoring. | `01-behavior-rule` | `SV-008`; `CNR-008` | No 41 artifact existed before this file. | Recorded here as RTL behavior. |
| Long labels, magnification, theme, accent, and short-height states are signed-off review dimensions. | `01-behavior-rule` | `SV-006`; `SV-010`; `SV-011`; `CNR-002` through `CNR-010` | Later layers must prove rendered outcomes without copying 40 route markup. | Recorded here as behavior and mandatory review dimensions. |
| Rail width, bottom bar height, scrollbar accommodation, icon sizes, active states, surfaces, z-index, tooltip layer, drawer offsets, and focus values are visible in source. | `02-token` | Some shared token seams exist, but no 41 context-navigation token set is promoted. | Token work must identify consumable values after this rule is accepted. | Deferred to `02-token`. |
| Rail item, bottom utility item, `More` trigger, tooltip anchor, drawer launcher, and drawer close controls are low-level affordances. | `03-primitive` | Adjacent 41 primitives may exist, but this family has no complete primitive map. | Primitive work must confirm or create governed affordances before pattern work. | Deferred to `03-primitive`. |
| Rail, scroll zone, bottom utility zone, mobile bottom bar, More sheet, and drawer launch composition are visible in 40 routes. | `04-pattern-contract` | 40 canonical/render routes exist as evidence. | No 41 context-navigation pattern contract exists. | Deferred to `04-pattern-contract`. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| desktop rail | A shell-attached narrow vertical rail shows primary context destinations as icon-led controls. |
| primary-zone overflow | The top primary zone scrolls when needed, and the bottom utility zone remains visible and anchored. |
| active destination | The current context destination remains visible and programmatically identifiable in every layout mode. |
| utility zone | Persistent utilities remain visibly separate from primary navigation and can launch governed shell utility surfaces. |
| mobile bottom nav | The rail converts into a labelled bottom navigation bar rather than a squeezed side rail. |
| mobile More open | Overflowed or secondary utility actions appear in a wide sheet tied to the bottom bar. |
| drawer launched | A context-navigation utility opens a governed shell-attached drawer or mobile sheet without reflowing page content. |
| tooltip reveal | Hidden or truncated labels can be disclosed through the governed tooltip layer without relying on native browser `title` behavior. |
| RTL rail | The rail mirrors to the right edge with native-feeling tooltip, menu, and drawer anchoring. |
| themed or magnified | Approved themes, primary-colour selections, and magnification affect appearance and pressure behavior without changing navigation meaning. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| activate context destination | Destination intent is available to the consumer, and active state remains coherent after navigation. |
| scroll primary zone | Long primary destination lists remain reachable while bottom utilities stay anchored. |
| open mobile More | Secondary or utility actions become reachable without crowding the bottom bar. |
| reveal label | Hidden or truncated labels expose their full meaning through governed disclosure behavior. |
| open shell utility drawer | A utility action opens a shell-attached drawer or sheet using the context-navigation launcher model. |
| dismiss transient surface | Outside click and `Escape` close menus and drawers and return focus to the triggering control. |
| switch responsive mode | The rail changes to bottom navigation before controls become cramped, distorted, or unreachable. |

## Interaction Outcomes

| Interaction | Visible Result | Focus Result | Announced Result | Mobile Result | Owning Later Layer |
| --- | --- | --- | --- | --- | --- |
| activate context destination | The destination becomes current or navigation intent is reported to the consumer. | Focus remains visible and must not be lost during route/content change. | Later layers must expose current destination semantics. | Bottom-nav labels preserve the same destination meaning. | `04-pattern-contract` or later |
| scroll primary zone | Primary destinations beyond the visible rail area become reachable. | Focus can move through reachable items without being trapped behind the anchored utility zone. | Later layers must preserve navigation region naming and item names. | Mobile uses bottom-nav and `More` behavior rather than rail scrolling. | `03-primitive` then `04-pattern-contract` |
| open mobile More | A wide bottom-sheet-style menu appears above the bottom bar. | Focus remains predictable from the `More` trigger. | Later layers must expose expanded state and menu naming. | This is the mobile result. | `03-primitive` then `04-pattern-contract` |
| reveal label | A tooltip or equivalent governed disclosure shows the full label. | Keyboard semantics remain accessible without requiring a visual tooltip on focus alone. | Later layers must preserve accessible names for icon-led controls. | Mobile labels are visible in the bottom bar where space allows; overflow actions still need names in `More`. | `03-primitive` then `04-pattern-contract` |
| open shell utility drawer | A drawer or sheet overlays content and remains attached to context navigation. | Focus path, close control, and return target follow the drawer-family contract. | Utility payload status or setting changes are communicated by the payload family. | The drawer becomes a bottom-attached sheet above the bottom bar. | `04-pattern-contract` or later |
| dismiss transient surface | The opened menu, tooltip state, or drawer closes without changing destination unless an action was activated. | Focus returns to the triggering control when the child interaction owns focus return. | Later layers must expose collapsed state where applicable. | Mobile returns to the bottom bar entry point. | `03-primitive` then `04-pattern-contract` |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Rail widths, item sizes, scrollbar skin, surfaces, active-state values, z-index, tooltip layer, drawer offsets, and focus values | Token choices belong to `02-token`. |
| Context item, utility item, More trigger, tooltip anchor, drawer launcher, and drawer close-control markup | Primitive choices belong to `03-primitive`. |
| Rail anatomy, scroll ownership, utility-zone slotting, bottom-bar layout, More sheet, and drawer-launch composition | Pattern structure belongs to `04-pattern-contract`. |
| Component receptors, destination data shape, callbacks, adapters, and app imports | Component seam decisions belong to `05-component-seam`. |
| Display-settings payload, async-activity payload, backend job lifecycle, route authorization, and app-specific utility subsets | Payload and product owners govern those behaviors. |
| Page/workspace tools navigation | Tools navigation is governed separately by `tools-navigation`; context navigation owns place/context and persistent shell utilities. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Whether context-nav drawer, display-settings, and async-activity drawer need direct 41 child behavior promotion before token work | `01-behavior-rule` | They are launcher/payload children that should not be flattened into the rail behavior rule. |
| Which token seams express rail, item, scroll, bottom bar, More sheet, tooltip, drawer launch, and active-state values | `02-token` | The behavior rule preserves outcomes, not values. |
| Which primitives own context items, utility items, More, tooltip, and drawer launcher behavior | `03-primitive` | Pattern work must not render low-level affordances locally. |
| How context navigation composes primary, utility, mobile, tooltip, menu, and drawer launcher behavior | `04-pattern-contract` | Composition belongs to the pattern contract. |
| How an app supplies destinations, utility subsets, current state, and action callbacks | `05-component-seam` and later | Runtime consumption must wait for governed seams. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove the rail mirrors to the right edge and tooltip, menu, drawer, active state, and mobile behavior feel native in RTL. |
| zoomed in 150% | Later layers must prove icons stay proportionate, labels remain recoverable, scroll zones remain reachable, and utility actions are not displaced. |
| zoomed out 75% | Later layers must prove primary and utility zones remain recognizable and separated. |
| dark theme | Later layers must prove current state, focus, tooltip, More, rail, bottom bar, and drawer-launch states remain readable without behavior changes. |
| desert theme | Later layers must prove current state, focus, tooltip, More, rail, bottom bar, and drawer-launch states remain readable without behavior changes. |
| dark theme with error | Later layers must prove utility payload errors, such as async activity failures, remain distinct from active/current navigation states in dark theme. |
| desert theme with error | Later layers must prove utility payload errors, such as async activity failures, remain distinct from active/current navigation states in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in
`../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Context destinations, utility actions, More trigger, More items, drawer launchers, and drawer close paths must be keyboard reachable when present. |
| Focus | Menus and drawers launched from context navigation must preserve visible focus and predictable focus return. |
| Names and semantics | Navigation region, current destination, icon-led controls, utility zone, More menu, tooltip/disclosure, and drawer launchers must have understandable names and state semantics in later layers. |
| Error and status communication | Utility payloads that expose waiting, running, failed, retryable, complete, or saved-setting states must communicate those states in text and programmatically. |
| Color-independent meaning | Current destination, open state, tooltip availability, disabled/unavailable state, progress, and error meaning must not rely on color alone. |
| Later proof owners | Contrast, target size, focus rendering, tooltip layer, menu layering, scroll reachability, zoom, responsive overflow, drawer geometry, and motion proof belong to later token, primitive, pattern, component, use-case, canonical, and verification layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper
markup.

Consumers must not treat the 40 behavior lock, reference pack, canonical
routes, screenshots, or route-local markup as construction APIs.

Consumers must not treat app implementation or tests alone as sign-off for this
family.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Optional 41 child behavior artifacts for context-nav drawer, display settings, and async activity drawer | `01-behavior-rule` | no | Token, primitive, and pattern work must not claim complete utility/drawer governance from the rail rule alone. |
| Context-navigation token seams | `02-token` | no | Primitive and pattern work must not claim complete context-navigation governance until token needs are identified and consumable. |
| Context-navigation control primitives | `03-primitive` | no | Pattern work must not render rail controls locally. |
| Context-navigation pattern contract | `04-pattern-contract` | no | Component seam, use-case page, canonical, parity, and app adoption work remain blocked. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md` |
| Stable lookup key | `shared/context-navigation/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, copied fragments, 40 reference packs, or 40 behavior locks as direct construction APIs. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this promoted `context-navigation` behavior rule. | No known context-navigation behavior-rule blocker remains. |
| 2 | `01-behavior-rule` | Decide whether drawer/payload children need direct 41 behavior promotion before token work. | Utility and drawer behavior should stay narrow and not be flattened into the rail. |
| 3 | `02-token` | Inventory context-navigation token needs against the signed-off `CNR-*` reference states. | Primitive and pattern work must not invent visual values. |
| 4 | `03-primitive` | Confirm or create the low-level controls needed by context navigation. | Pattern work must not invent affordance behavior. |
| 5 | `04-pattern-contract` | Define the reusable context-navigation pattern contract. | Pattern work waits for accepted behavior, consumable tokens, and consumable primitives. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The context-navigation behavior is promoted, and token decisions are the next foundation layer for this family. |
