# Tools Navigation Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `tools-navigation` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/canonical-renderings/build-work-panel`; `/design-system/patterns/build-work-panel-demo`; `/design-system/components/chat-workspace-shell` |
| Proposed design-system URL | `none yet; later proof routes must be selected by their owning layers` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/tools-navigation/ToolsNavigation-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/tools-navigation/ToolsNavigation-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person using page-scoped or workspace-scoped tools while staying in the current product context. |
| Normal job | The user reaches available tools or action modes without confusing them for primary app destinations or page body content. |
| Success outcome | Tool actions remain discoverable, visibly distinct from context navigation, and usable across desktop, mobile, RTL, theme, magnification, disabled, active, and panel-open states. |
| Non-goals | This rule does not govern module/location navigation, top navigation, sub-navigation, page body layout, tool payload internals, backend side effects, token values, primitive markup, component APIs, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Existing 40 evidence uses a right-side icon toolbar for page-specific actions such as Reporting, Support, and Build. | `01-behavior-rule` | `docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md` `BWP-003`; `docs/workspace/design-system/reference-packs/build-work-panel-reference-pack.md` | The evidence is build-work-panel-specific, not a general 41 tools-navigation contract. | Recorded here as evidence that page/workspace tools are distinct from context navigation. |
| Right-side tools can open a shell-attached panel without reflowing the page. | `01-behavior-rule` | `docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md` `BWP-001`; `docs/workspace/design-system/patterns/build-work-panel-pattern.md` | Panel payload and conversation behavior belong to their own families. | Recorded here as a tools-navigation launcher behavior, not as a panel contract. |
| Tool actions may include active, inactive, unavailable, or coming-soon states. | `01-behavior-rule` | Build-work-panel evidence records Reporting/Support as visible inactive actions and Build as active. | General disabled/unavailable semantics need lower-layer proof before app use. | Recorded here as behavior; values and controls are deferred. |
| Tools-navigation is intentionally separate from context-navigation. | `01-behavior-rule` | `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md` | The standard page shell must compose both without merging their meanings. | Recorded here as a boundary decision: context navigation is for place/context; tools navigation is for actions/tools. |
| Tool rail placement, icon sizes, panel offsets, active indicators, disabled treatment, focus, surfaces, and z-index are visible in existing 40 surfaces. | `02-token` | Some shared token seams exist, but no 41 tools-navigation token set is promoted. | Token work must identify consumable values after this rule is accepted. | Deferred to `02-token`. |
| Tool item, active tool trigger, unavailable tool, panel launcher, panel close, and mobile/floating trigger are low-level affordances. | `03-primitive` | Adjacent 41 primitives may exist, but this family has no complete primitive map. | Primitive work must confirm or create governed affordances before pattern work. | Deferred to `03-primitive`. |
| Tool rail, right-side panel launch, mobile behavior, and action grouping are visible in 40 routes. | `04-pattern-contract` | 40 pattern/canonical routes exist as evidence. | No 41 tools-navigation pattern contract exists. | Deferred to `04-pattern-contract`. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| desktop tools rail | Page or workspace tools appear as a distinct action surface separate from context/location navigation. |
| active tool | The currently selected or open tool remains visibly identifiable without being mistaken for the current app destination. |
| unavailable tool | A visible but unavailable tool communicates that it cannot be used yet and does not behave like an active destination. |
| panel open | A tool may open a shell-attached panel or drawer without turning the tool rail into page body content. |
| collapsed or mobile tools | Tools remain reachable through an approved mobile or reduced-width behavior rather than crowding the page or context nav. |
| RTL tools | Tool order, panel anchoring, and trigger relationships mirror naturally when the shell is RTL. |
| long-label or magnified pressure | Tool labels, names, and icon controls remain understandable without overlap, distortion, or lost accessible names. |
| themed or error state | Theme changes and tool/payload errors remain readable and distinct from active selection. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| activate tool | The selected tool intent is reported to the consumer or opens the related tool surface. |
| open tool panel | The related panel appears as a temporary or companion tool surface without reclassifying the current page. |
| close tool panel | The panel closes and focus returns according to the tool/panel contract. |
| encounter unavailable tool | The unavailable action is understandable and cannot be mistaken for a failed navigation. |
| switch responsive mode | Tools move to the approved reduced or mobile behavior before overlapping page content, context navigation, or panels. |
| distinguish tool from destination | The user can tell page/workspace tools apart from context destinations and persistent shell utilities. |

## Interaction Outcomes

| Interaction | Visible Result | Focus Result | Announced Result | Mobile Result | Owning Later Layer |
| --- | --- | --- | --- | --- | --- |
| activate tool | The tool becomes active, reports action intent, or opens its governed surface. | Focus remains visible and must not be lost during tool activation. | Later layers must expose active/unavailable state and tool names. | Mobile tools use the approved reduced surface rather than staying as a crowded desktop rail. | `04-pattern-contract` or later |
| open tool panel | The panel or drawer appears adjacent to or associated with the tools surface. | Focus path, close control, and return target must be defined by later layers. | Later layers must expose expanded/open state and panel naming. | The panel uses the approved mobile posture for the family. | `04-pattern-contract` or later |
| close tool panel | The panel closes without changing page location unless an action explicitly navigates. | Focus returns to the triggering tool when the interaction owns focus return. | Later layers must expose collapsed/closed state where applicable. | Mobile returns to the tools entry point. | `03-primitive` then `04-pattern-contract` |
| encounter unavailable tool | The tool remains visibly unavailable and does not open an active tool surface. | Focus behavior must still allow keyboard users to understand the tool state. | Later layers must communicate unavailable or coming-soon state in text and programmatically when present. | Mobile keeps unavailable tools understandable without using disabled color alone. | `03-primitive` then `04-pattern-contract` |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Tool rail width, item size, spacing, surfaces, active values, disabled values, z-index, panel offsets, and focus values | Token choices belong to `02-token`. |
| Tool item, panel launcher, unavailable action, mobile trigger, and panel close-control markup | Primitive choices belong to `03-primitive`. |
| Tool grouping, rail anatomy, panel relationship, responsive collapse, and mobile behavior | Pattern structure belongs to `04-pattern-contract`. |
| Component receptors, tool data shape, callbacks, adapters, and app imports | Component seam decisions belong to `05-component-seam`. |
| Tool payload internals such as chat, reporting, support, export, filtering, generated reports, or backend operations | Payload and product owners govern those behaviors. |
| Context/location navigation | Context navigation is governed separately by `context-navigation`; tools-navigation must not replace it. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which page/workspace tools are allowed in the first standard shell proof | `04-pattern-contract` or later | The behavior rule defines the family role, not product tool inventory. |
| Whether tools-navigation uses a persistent right rail, compact launcher, floating mobile action, or another reduced-width posture | `04-pattern-contract` | Responsive anatomy belongs to pattern composition after tokens and primitives are available. |
| Which token seams express tools-navigation placement, item, active, unavailable, panel, and focus values | `02-token` | The behavior rule preserves outcomes, not values. |
| Which primitives own tool items, unavailable actions, panel launchers, mobile triggers, and close controls | `03-primitive` | Pattern work must not render low-level affordances locally. |
| How an app supplies tools, active state, permissions, unavailable reasons, payload launchers, and callbacks | `05-component-seam` and later | Runtime consumption must wait for governed seams. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove tool order, rail edge, panel anchoring, and trigger relationships feel native in RTL. |
| zoomed in 150% | Later layers must prove tool controls remain reachable, proportionate, named, and distinct from context navigation. |
| zoomed out 75% | Later layers must prove the relationship between tools, context navigation, page body, and any open panel remains recognizable. |
| dark theme | Later layers must prove active, inactive, unavailable, focus, panel, and tooltip states remain readable without behavior changes. |
| desert theme | Later layers must prove active, inactive, unavailable, focus, panel, and tooltip states remain readable without behavior changes. |
| dark theme with error | Later layers must prove tool or payload errors remain distinct from active/unavailable tool states in dark theme. |
| desert theme with error | Later layers must prove tool or payload errors remain distinct from active/unavailable tool states in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in
`../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Tool actions, unavailable tools when focusable, panel launchers, mobile tool entry points, and panel close paths must be keyboard reachable when present. |
| Focus | Opening and closing tool panels must preserve visible focus and define predictable focus return. |
| Names and semantics | Tools, active tool, unavailable tool, panel trigger, panel title, and mobile tool entry point must have understandable names and state semantics in later layers. |
| Error and status communication | Unavailable, coming-soon, failed, retryable, complete, or payload status states must be communicated in text and programmatically when present. |
| Color-independent meaning | Active, unavailable, open, error, and progress meaning must not rely on color alone. |
| Later proof owners | Contrast, target size, focus rendering, tooltip/disclosure, panel layering, zoom, responsive overflow, and motion proof belong to later token, primitive, pattern, component, use-case, canonical, and verification layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper
markup.

Consumers must not treat build-work-panel, chat-workspace, route-local toolbar
markup, screenshots, or app implementation as construction APIs.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Tools-navigation token seams | `02-token` | no | Primitive and pattern work must not claim complete tools-navigation governance until token needs are identified and consumable. |
| Tools-navigation control primitives | `03-primitive` | no | Pattern work must not render tool controls locally. |
| Tools-navigation pattern contract | `04-pattern-contract` | no | Component seam, use-case page, canonical, parity, and app adoption work remain blocked. |
| Tool payload behavior rules for concrete tools | `01-behavior-rule` or later payload layers | no | A shell tool rail may be governed without claiming the payloads themselves are governed. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/tools-navigation/ToolsNavigation-Behaviour.md` |
| Stable lookup key | `shared/tools-navigation/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, copied fragments, build-work-panel markup, or chat-workspace markup as direct construction APIs. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this `tools-navigation` behavior rule. | No known tools-navigation behavior-rule blocker remains. |
| 2 | `02-token` | Inventory tools-navigation token needs against the accepted behavior and available 40 evidence. | Primitive and pattern work must not invent visual values. |
| 3 | `03-primitive` | Confirm or create the low-level controls needed by tools-navigation. | Pattern work must not invent affordance behavior. |
| 4 | `04-pattern-contract` | Define the reusable tools-navigation pattern contract. | Pattern work waits for accepted behavior, consumable tokens, and consumable primitives. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule establishes tools-navigation as a distinct page/workspace action family, separate from context navigation, and identifies token decisions as the next foundation layer. |
