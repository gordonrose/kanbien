# Standard Page Shell Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `standard-page-shell` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/templates/page-shell`; `/design-system/patterns/navigation-shell`; `/design-system/canonicals/top-nav`; `/design-system/components/sub-nav`; `/design-system/components/context-nav` |
| Proposed design-system URL | `none yet; later proof routes must be selected by their owning layers` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/standard-page-shell/StandardPageShell-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/standard-page-shell/StandardPageShell-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person working inside a governed app or design-system page. |
| Normal job | The user stays oriented to the current product area, page hierarchy, search scope, account/profile actions, contextual destinations, and persistent shell utilities while page content changes. |
| Success outcome | The user can identify where they are, move to another available destination, use search or shell utilities, and recover from responsive reductions without losing orientation or keyboard focus. |
| Non-goals | This rule does not govern page body content, page-specific data loading, route mutation, account preference persistence, backend job lifecycle truth, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| The top header provides brand identity, primary destinations, overflow, mobile navigation, and profile/account access. | `01-behavior-rule` | `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md` | None for Layer 1. | Recorded as a child shell obligation; later work must consume the 41 top-navigation chain. |
| The sub header composes breadcrumb and search while protecting their width negotiation, layering, mobile fallback, RTL, theme, tooltip, and magnification behavior. | `01-behavior-rule` | `docs/design-system/01-behavior-rule/shared/sub-navigation/SubNavigation-Behaviour.md` | Optional direct breadcrumb/search child promotion remains a later Layer 1 refinement. | Recorded as a child shell obligation; breadcrumb/search child behavior stays owned by their families. |
| Breadcrumb and search have independent behavior locks and reference packs, but their coexistence is governed by the shared row. | `01-behavior-rule` | `docs/workspace/design-system/behavior-locks/breadcrumb-behavior-lock.md`; `docs/workspace/design-system/reference-packs/breadcrumb-reference-pack.md`; `docs/workspace/design-system/behavior-locks/search-shell-behavior-lock.md`; `docs/workspace/design-system/reference-packs/search-shell-reference-pack.md` | The 41 parent shell must not flatten the child families into one unreviewable rule. | Recorded as delegated child-family behavior under the parent shell. |
| The left context navigation is shell-attached, edge-aligned, icon-led on desktop, bottom-nav on mobile, and owns primary and utility zones. | `01-behavior-rule` | `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md` | Optional direct drawer/payload child promotion remains a later Layer 1 refinement. | Recorded as the context/location navigation source, including utility-zone separation. |
| The right-side tools navigation is a distinct page/workspace action family rather than an alias for context-navigation utilities. | `01-behavior-rule` | `docs/design-system/01-behavior-rule/shared/tools-navigation/ToolsNavigation-Behaviour.md` | None for Layer 1. | Recorded as a child shell obligation; tools navigation must not replace context navigation. |
| Header height, rail width, search sizing, spacing, surfaces, z-index, focus, active states, tooltip layer, and drawer geometry are visible in the 40 routes. | `02-token` | Some reusable token seams already exist, including focus, target size, tooltip, icon-size, and index-nav tokens. | Standard page shell token seams are not yet identified or proven consumable in 41. | Deferred to `02-token`; this rule only names the behavior those values must preserve. |
| Brand lockup controls, nav items, profile trigger, overflow triggers, breadcrumb controls, search input, context-nav items, drawer controls, and utility/tool buttons are visible affordances. | `03-primitive` | Some 41 primitives exist for adjacent families, but not a complete page-shell primitive set. | Later layers must confirm existing primitives or create missing ones before pattern work. | Deferred to `03-primitive`; this rule does not name primitive APIs. |
| The full shell composes header, sub header, left context navigation, right tools navigation, utility drawers, responsive modes, and the page body boundary. | `04-pattern-contract` | 40 pattern/canonical routes exist as evidence. | No 41 `standard-page-shell` pattern contract exists. | Deferred to `04-pattern-contract`; this rule defines the behavioral boundary only. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| desktop shell | Brand, primary navigation, profile access, breadcrumb/search row, context navigation, and tools navigation are all available without overlapping page content or each other. |
| desktop overflow | Header destinations reduce through the approved overflow path before collapsing to mobile, while current location remains identifiable. |
| profile menu open | Account/profile actions appear as a temporary shell surface and do not become a permanent page panel. |
| sub-navigation pressure | Breadcrumb yields through its approved reduction path before search abandons the shared-row desktop treatment. |
| mobile shell | Header navigation moves to the mobile navigation surface, breadcrumb disappears at the approved sub-nav fallback, search occupies the available sub-nav width, and context navigation becomes a labelled bottom bar. |
| context navigation pressure | Primary context destinations may scroll inside their own zone, while persistent utility actions remain separate and reachable. |
| tools navigation pressure | Page or workspace tools remain distinct from context destinations and move to approved reduced behavior before crowding page content. |
| shell utility drawer open | A shell utility launched from governed navigation appears as a transient shell-attached drawer or sheet without reflowing page content. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| identify current place | Current page, current primary destination, and current context destination remain visible or recoverable through approved overflow/reduction states. |
| move through primary navigation | The user can reach and activate available primary destinations without text wrapping or control overlap. |
| open transient shell surface | Overflow, profile, breadcrumb, mobile menu, context-nav menu, and shell drawers open as temporary surfaces tied to their trigger. |
| dismiss transient shell surface | Outside click and `Escape` close temporary shell surfaces and do not leave stacked or orphaned open states. |
| use search | Search remains scoped and understandable from the visible prompt or equivalent label, and submitting search does not redefine the shell structure. |
| use context navigation | Context destinations report navigation intent while preserving the separation between primary destinations and persistent utilities. |
| use tools navigation | Page or workspace tools report action intent or open governed tool surfaces without changing current-place meaning. |
| use shell utility | Utility actions such as display settings or async activity open the governed drawer/sheet model and do not become page-local widgets. |
| switch responsive mode | The shell changes to its approved reduced or mobile layout before overlap, clipping, unreadable controls, or distorted icons appear. |

## Interaction Outcomes

| Interaction | Visible Result | Focus Result | Announced Result | Mobile Result | Owning Later Layer |
| --- | --- | --- | --- | --- | --- |
| open transient shell surface | The related menu, mobile surface, or drawer becomes visible above the appropriate shell/content layer. | Focus remains on or moves predictably from the trigger according to the child family contract. | Later layers must expose expanded/open state and names for the opened surface. | The surface uses the approved mobile menu, bottom bar, or bottom-sheet posture for its family. | `03-primitive` then `04-pattern-contract` |
| dismiss transient shell surface | The opened surface closes and the page does not change destination unless a destination was activated. | Focus returns to the triggering control when the child family requires focus return. | Later layers must expose collapsed/closed state when a control owns that state. | Mobile dismissal preserves the bottom-nav or mobile-header entry point. | `03-primitive` then `04-pattern-contract` |
| submit search | Search intent is sent to the consuming page or search owner without changing shell ownership. | Focus behavior after submit must be defined by the consuming search seam. | Later layers must communicate loading, result, empty, or error states when search results are in scope. | Mobile search remains full width in the sub-nav fallback. | `04-pattern-contract` or later |
| open shell utility drawer | The utility drawer overlays content and remains attached to shell navigation. | Focus path, close control, and return target follow the context-nav drawer contract. | Status or setting changes inside the drawer must be communicated by the payload family. | The drawer becomes a bottom-attached sheet above the bottom bar when the host shell is mobile. | `04-pattern-contract` or later |
| activate context destination | The active context destination changes or navigation intent is reported to the consumer. | Focus remains visible and must not be lost during route/content change. | Current destination must be programmatically identifiable in later layers. | Bottom-nav labels and `More` behavior preserve the same destination meaning. | `04-pattern-contract` or later |
| activate tool | The active tool changes, reports action intent, or opens a governed tool surface without changing current-place meaning. | Focus remains visible and must not be lost during tool activation. | Later layers must expose active, unavailable, and open tool state when present. | Mobile tools use the approved reduced tools-navigation behavior. | `04-pattern-contract` or later |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Token values for header, row, rail, drawer, focus, tooltip, and responsive dimensions | Token choices belong to `02-token`. |
| Primitive names or markup for buttons, links, search inputs, menus, drawers, icons, and tool controls | Primitive choices belong to `03-primitive`. |
| Exact shell layout anatomy, slots, data contracts, and responsive grid implementation | Pattern composition belongs to `04-pattern-contract`. |
| Component receptors, controller APIs, adapters, and app import boundaries | Component seam decisions belong to `05-component-seam`. |
| Canonical scenario files, app adoption, and parity tests | Later layers are scaffolded or separately gated and must not be inferred from this rule. |
| Backend job lifecycle, search result loading, profile preference persistence, or route authorization | Product and feature owners govern those behaviors outside this shell behavior rule. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which visual values define the standard page shell and its child zones | `02-token` | The behavior rule requires stable orientation and fallback behavior, not concrete values. |
| Which existing primitives can be reused for shell controls | `03-primitive` | Pattern work must not render low-level affordances locally. |
| How the shell composes child patterns while preserving page body boundaries | `04-pattern-contract` | The composition must consume governed child seams instead of copying 40 route markup. |
| How apps consume the shell without local CSS, copied markup, or controller recreation | `05-component-seam` and later | App adoption is blocked until the active 41 gates pass and later scaffolded gates are activated. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove header order, breadcrumb/search row, edge navigation, tooltips, menus, and drawers feel native in RTL and preserve orientation. |
| zoomed in 150% | Later layers must prove shell controls remain reachable, readable, proportionate, and free of overlap before or after approved responsive fallback. |
| zoomed out 75% | Later layers must prove the relationship between header, sub header, navigation rail, utility zone, and page body remains recognizable. |
| dark theme | Later layers must prove shell surfaces, focus, current state, and utility drawers remain readable without behavior changes. |
| desert theme | Later layers must prove shell surfaces, focus, current state, and utility drawers remain readable without behavior changes. |
| dark theme with error | Later layers must prove utility/error/status payloads such as async activity errors remain distinct from active/current shell states in dark theme. |
| desert theme with error | Later layers must prove utility/error/status payloads such as async activity errors remain distinct from active/current shell states in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in
`../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Primary navigation, overflow, profile, breadcrumb, search, context destinations, utility triggers, drawers, and close controls must be keyboard reachable when present. |
| Focus | Opening and closing temporary shell surfaces must preserve a predictable focus path and return focus to the triggering control when the child family owns focus return. |
| Names and semantics | Header, breadcrumb, search, context navigation, utility zones, menus, and drawers must have understandable names and current/open state semantics in later layers. |
| Error and status communication | Shell utility payloads that expose waiting, running, failed, retryable, complete, or saved-setting states must communicate those states in text and programmatically. |
| Color-independent meaning | Current route, active destination, open state, error state, disabled/unavailable state, and progress meaning must not rely on color alone. |
| Later proof owners | Contrast, target size, tooltip layering, focus rendering, zoom, motion, responsive overflow, and drawer geometry proof belong to later token, primitive, pattern, component, use-case, canonical, and verification layers. |

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
| Optional child behavior artifacts for breadcrumb, search-shell, context-nav drawer, display settings, async activity drawer, and concrete tool payloads | `01-behavior-rule` | no | The parent shell may start token inventory, but later pattern/component work must not claim payload governance from shell chrome rules alone. |
| Standard page shell token seams | `02-token` | no | Primitive or pattern work must not invent shell visual, sizing, z-index, or responsive values locally. |
| Shell control primitives | `03-primitive` | no | Pattern work must not render low-level shell affordances locally. |
| Standard page shell pattern contract | `04-pattern-contract` | no | Component seam, use-case page, canonical, parity, and app adoption work remain blocked. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/standard-page-shell/StandardPageShell-Behaviour.md` |
| Stable lookup key | `shared/standard-page-shell/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, copied fragments, 40 reference packs, or 40 behavior locks as direct construction APIs. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this parent `standard-page-shell` behavior boundary with its child shell families. | No known parent behavior-rule blocker remains. |
| 2 | `02-token` | Inventory shell token needs for top navigation, sub-navigation, context navigation, tools navigation, shell layering, and responsive boundaries. | Token work must know which shell zones and responsive behaviors it is preserving. |
| 3 | `03-primitive` | Confirm or create the low-level shell control primitives after token seams are consumable. | Pattern work must not invent shell controls locally. |
| 4 | `04-pattern-contract` | Compose the standard page shell from governed child patterns. | Pattern work must wait for accepted behavior, consumable tokens, and consumable primitives. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The parent shell now has 41 behavior rules for top navigation, sub-navigation, context navigation, and tools navigation, so shell token inventory is the next foundation layer. |
