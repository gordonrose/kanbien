# Top Navigation Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `top-navigation` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/canonicals/top-nav`; `/design-system/canonical-renderings/top-nav`; `/design-system/patterns/navigation-shell` |
| Proposed design-system URL | `none yet; later proof routes must be selected by their owning layers` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person moving between primary destinations in a governed shell. |
| Normal job | The user identifies the product or module, sees the current primary destination, moves to another primary destination, and reaches profile/account actions without losing orientation under width pressure. |
| Success outcome | The user can use the header across desktop, overflow, mobile, RTL, theme, and magnified states without overlapping controls, distorted brand identity, or lost current-route feedback. |
| Non-goals | This rule does not govern breadcrumb/search rows, side/context navigation, page body layout, account preference pages, route authorization, token values, primitive markup, component APIs, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Brand mark keeps its proportions while adjacent brand text may yield first under pressure. | `01-behavior-rule` | `docs/workspace/design-system/behavior-locks/top-nav-behavior-lock.md` `TN-000` | No 41 artifact existed before this file. | Recorded here as top-navigation behavior. |
| Primary destinations move into overflow before mobile collapse; desktop must not continue into a one-item-plus-More state. | `01-behavior-rule` | `TN-001`; `TN-002`; `docs/workspace/design-system/reference-packs/top-nav-reference-pack.md` `TRP-002`; `TRP-003` | No 41 artifact existed before this file. | Recorded here as responsive behavior. |
| Current route remains visible or identifiable when moved into overflow. | `01-behavior-rule` | `TN-003`; `TRP-007` | No 41 artifact existed before this file. | Recorded here as orientation behavior. |
| Primary destinations do not wrap; utilities stay right-aligned without overlapping navigation. | `01-behavior-rule` | `TN-004`; `TN-005` | No 41 artifact existed before this file. | Recorded here as header geometry behavior. |
| Desktop profile opens a lightweight anchored menu; mobile moves profile utilities into the mobile navigation surface. | `01-behavior-rule` | `TN-006`; `TN-007`; `TRP-005`; `TRP-006` | No 41 artifact existed before this file. | Recorded here as transient account-surface behavior. |
| Outside click and `Escape` close transient top-navigation surfaces with focus recovery. | `01-behavior-rule` | `TN-008`; `TN-009` | Later primitive and pattern layers must implement the focus path. | Recorded here as required behavior; implementation deferred. |
| RTL, magnification, long labels, themes, and primary-colour inheritance are signed-off review dimensions. | `01-behavior-rule` | `TN-010` through `TN-016`; `TRP-008` through `TRP-015B` | Later layers must prove the rendered outcomes without copying 40 route markup. | Recorded here as behavior and mandatory review dimensions. |
| Header heights, spacing, menu surfaces, avatar sizes, icon sizes, focus, active states, and overflow geometry are visible in source. | `02-token` | Some shared tokens exist, but no 41 top-navigation token set is promoted. | Token work must identify consumable values after this rule is accepted. | Deferred to `02-token`. |
| Brand link, nav item, overflow trigger, profile trigger, menu item, and mobile trigger are low-level affordances. | `03-primitive` | Adjacent 41 primitives may exist, but this family has no complete primitive map. | Primitive work must confirm or create governed affordances before pattern work. | Deferred to `03-primitive`. |
| Header composition across brand, primary destinations, overflow, utilities, profile, and mobile surface is visible in 40 routes. | `04-pattern-contract` | 40 canonical/render routes exist as evidence. | No 41 top-navigation pattern contract exists. | Deferred to `04-pattern-contract`. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| desktop default | Brand, primary destinations, and profile/account access are visible without overlap or wrapping. |
| desktop overflow | Destinations move into an overflow surface before overlap, and at least two visible destinations plus `More` remain before mobile collapse. |
| overflow menu open | Hidden destinations are recoverable, and the current destination remains identifiable. |
| profile menu open | Profile/account actions appear in a lightweight temporary surface anchored to the header. |
| mobile closed | A single mobile navigation trigger becomes the entry point for primary destinations and account actions. |
| mobile open | Primary destinations and mobile profile/account actions are available in the mobile navigation surface. |
| long-label pressure | Long brand, destination, profile, or menu labels do not distort shell geometry and expose full meaning through governed disclosure in later layers. |
| themed or accent-shifted | Approved themes and primary-colour selections affect emphasis and surfaces without changing navigation behavior. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| activate primary destination | The destination intent is available to the consumer, and current-route feedback remains coherent after navigation. |
| open overflow menu | Hidden destinations become reachable without wrapping the header or hiding current-route meaning. |
| open profile menu | Profile/account actions become reachable through a temporary anchored surface. |
| open mobile navigation | Narrow-width destinations and account actions become reachable from one clear trigger. |
| dismiss transient surface | Outside click and `Escape` close open top-navigation surfaces and return focus to the triggering control. |
| switch responsive mode | The header chooses overflow or mobile collapse before overlap, clipping, wrapping, or distorted brand/control geometry appears. |

## Interaction Outcomes

| Interaction | Visible Result | Focus Result | Announced Result | Mobile Result | Owning Later Layer |
| --- | --- | --- | --- | --- | --- |
| open overflow menu | The overflow surface appears and hidden destinations become visible. | Focus remains predictable from the overflow trigger. | Later layers must expose expanded state and menu naming. | Overflow gives way to the mobile navigation surface at the approved threshold. | `03-primitive` then `04-pattern-contract` |
| open profile menu | The profile/account surface appears anchored to the header trigger. | Focus remains predictable from the profile trigger. | Later layers must expose expanded state and menu naming. | Profile/account actions move into the mobile navigation surface. | `03-primitive` then `04-pattern-contract` |
| open mobile navigation | The mobile navigation surface appears and replaces crowded desktop header navigation. | Focus remains visible and recoverable from the mobile trigger. | Later layers must expose expanded state and navigation naming. | This is the mobile result. | `03-primitive` then `04-pattern-contract` |
| dismiss transient surface | The open menu or mobile surface closes. | Focus returns to the triggering control when the child interaction owns focus return. | Later layers must expose collapsed state where applicable. | Mobile surface closes without losing the single navigation entry point. | `03-primitive` then `04-pattern-contract` |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Header size, spacing, colours, surfaces, z-index, typography, and focus values | Token choices belong to `02-token`. |
| Brand, nav item, overflow, profile, menu, and mobile trigger markup | Primitive choices belong to `03-primitive`. |
| Header grid/flex anatomy, overflow measurement, utility slot composition, and mobile surface layout | Pattern structure belongs to `04-pattern-contract`. |
| Component receptors, view models, controller APIs, and app imports | Component seam decisions belong to `05-component-seam`. |
| App-specific profile preferences, route authorization, tenant context, or persisted settings | Product and feature owners govern those behaviors. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which token seams express top-navigation dimensions, surfaces, text, focus, menu, and active-state values | `02-token` | The behavior rule preserves outcomes, not values. |
| Which primitives own brand, destination, overflow, profile, menu, and mobile trigger behavior | `03-primitive` | Pattern work must not render low-level affordances locally. |
| How top navigation composes its child affordances and measures overflow | `04-pattern-contract` | Composition and measurement belong to the pattern contract. |
| How an app supplies destinations, current state, profile data, and action callbacks | `05-component-seam` and later | Runtime consumption must wait for governed seams. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove destination order, menu anchoring, profile surface, mobile navigation, and current-route feedback feel native in RTL. |
| zoomed in 150% | Later layers must prove the header falls back before overlap, clipping, wrapping, or distorted brand/control geometry appears. |
| zoomed out 75% | Later layers must prove brand, destinations, utilities, and account affordances remain recognizable and aligned. |
| dark theme | Later layers must prove navigation, profile, overflow, focus, current state, and menu surfaces remain readable without behavior changes. |
| desert theme | Later layers must prove navigation, profile, overflow, focus, current state, and menu surfaces remain readable without behavior changes. |
| dark theme with error | Later layers must prove any future account or shell-status error communication remains distinct from active/current navigation states in dark theme. |
| desert theme with error | Later layers must prove any future account or shell-status error communication remains distinct from active/current navigation states in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in
`../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Brand link, primary destinations, overflow trigger, profile trigger, mobile trigger, and menu items must be keyboard reachable when present. |
| Focus | Opening and closing overflow, profile, and mobile navigation surfaces must preserve visible focus and predictable focus return. |
| Names and semantics | Header navigation, current destination, overflow, profile, and mobile navigation controls must have understandable names and state semantics in later layers. |
| Error and status communication | If account or shell status/error states enter the header, they must be communicated in text and programmatically rather than only by colour or position. |
| Color-independent meaning | Current destination, open state, disabled/unavailable state, and account/status meaning must not rely on color alone. |
| Later proof owners | Contrast, target size, focus rendering, tooltip/disclosure, menu layering, responsive overflow, and motion proof belong to later token, primitive, pattern, component, use-case, canonical, and verification layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper
markup.

Consumers must not treat the 40 behavior lock, reference pack, canonical
routes, screenshots, or route-local markup as construction APIs.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Top-navigation token seams | `02-token` | no | Primitive and pattern work must not claim complete top-navigation governance until token needs are identified and consumable. |
| Top-navigation control primitives | `03-primitive` | no | Pattern work must not render header controls locally. |
| Top-navigation pattern contract | `04-pattern-contract` | no | Component seam, use-case page, canonical, parity, and app adoption work remain blocked. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md` |
| Stable lookup key | `shared/top-navigation/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, copied fragments, 40 reference packs, or 40 behavior locks as direct construction APIs. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this promoted `top-navigation` behavior rule. | No known top-navigation behavior-rule blocker remains. |
| 2 | `02-token` | Inventory top-navigation token needs against the signed-off `TRP-*` reference states. | Primitive and pattern work must not invent visual values. |
| 3 | `03-primitive` | Confirm or create the low-level controls needed by top navigation. | Pattern work must not invent affordance behavior. |
| 4 | `04-pattern-contract` | Define the reusable top-navigation pattern contract. | Pattern work waits for accepted behavior, consumable tokens, and consumable primitives. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule promotes the approved 40 top-nav behavior into the 41 chain and identifies token decisions as the next foundation layer. |
