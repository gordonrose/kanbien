# Context Navigation Bottom Bar Primitive

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| Token dependency systems | `default` |
| UI family | `context-navigation` |
| Primitive name | `context-navigation-bottom-bar` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/context-navigation-bottom-bar/ContextNavigationBottomBar-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/context-navigation-bottom-bar/ContextNavigationBottomBar-Proof.md` |
| Files affected now | Shared contract, default proof, runtime seam, proof route, readiness index, focused tests. |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Mobile context navigation must render as a labelled bottom navigation bar that remains pinned to the visual viewport and does not scroll with page content. |
| Primitive job | Provide a token-backed mobile bottom-bar frame with navigation-region semantics and slot transport for later item primitives. |
| Expected consumers | `04-pattern-contract` context-navigation patterns. |
| Non-goals | Destination item anatomy, icons, labels, current-state rendering, More-menu behavior, drawer payloads, component APIs, app routes, and app-local CSS. |

## Layer Boundary

This PrimitiveDefinitionArtifact may define primitive decisions only.

It must not define token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Primitive Action |
| --- | --- | --- | --- | --- |
| The mobile bottom bar must remain pinned to the visual viewport bottom during document scroll. | `03-primitive` | `context-navigation-frame` token defines the invariant and values. | No primitive seam existed before this artifact. | Create the bottom-bar frame primitive. |
| Destination item controls are visible in 40 routes. | `03-primitive` later child primitive | none for context-navigation item control. | Item anatomy is not owned by this frame primitive. | Defer to `context-navigation-item-control`. |
| More-menu behavior is visible in 40 routes. | `03-primitive` or `04-pattern-contract` later | none. | More behavior needs its own primitive/pattern decision. | Defer. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `yes for default context-navigation-frame` |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no consumable context-navigation bottom-bar primitive existed before this artifact |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `context-navigation-frame` | `docs/design-system/02-token/shared/context-navigation-frame/ContextNavigationFrame-Contract.md` | `default` | `docs/design-system/02-token/systems/default/context-navigation-frame/ContextNavigationFrame-Implementation.md` | `src/frontend/designSystem/layers/02-token/context-navigation-frame/systems/default.mjs#contextNavigationFrameTokenSpec` | Supplies mobile bottom-bar placement, columns, padding, surface, border, shadow, page reserve, drawer offset, and scroll-boundary invariant. | `consumable` |

## Behavior Contract

`context-navigation-bottom-bar` renders one named `nav` frame for the mobile
context-navigation bottom bar.

The primitive consumes the signed `context-navigation-frame` token for fixed
bottom placement, inline edges, grid columns, padding, page reserve, drawer
offset, surface, border, shadow, and scroll-boundary behavior.

The primitive may transport supplied slot content, but supplied content is not
governed destination item behavior. Item controls, current state, More behavior,
tooltips, and drawer launchers belong to later primitives or patterns.

## Accessibility Contract

The primitive follows the shared WCAG 2.2 AA default in
`.codex/skills/41-front-end/accessibility/WCAG-2.2-AA-DEFAULT.md`.

The primitive renders a `nav` landmark with a required accessible label.
The primitive does not create or normalize destination item names, current
state, disabled state, More state, or focus movement for child items.

## Allowed States

| State | Required Behavior |
| --- | --- |
| `default` | Renders the token-backed fixed bottom bar frame and supplied slot content. |
| `proof-static` | Allows proof routes to render the frame in a non-adopting review context while preserving token values. |

## Data Or Event Contract

Not applicable. The primitive does not accept, normalize, emit, or display
externally meaningful product data.

## Text Overflow Disclosure

| Field | Value |
| --- | --- |
| Can visible text be constrained? | `no` for primitive-owned text |
| Text-disclosure primitive dependency | `not-applicable` |
| Full-text disclosure behavior | Destination labels belong to `context-navigation-item-control`. |
| Fitting-text evidence | Not applicable for this frame primitive. |
| Truncated-text evidence | Not applicable for this frame primitive. |
| Forbidden fallback | `raw ellipsis, clipping, title-only disclosure, route-local tooltip logic, or copied controller behavior` |

## Visual-Skin Boundary

Design-system implementations may vary bottom-bar placement, columns, padding,
surface, border, shadow, page reserve, and drawer offset only through the
signed `context-navigation-frame` token seam.

The primitive must not embed item icons, active indicators, More menu visuals,
or drawer payload visuals.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/context-navigation-bottom-bar/index.mjs` |
| Planned primitive export | `contextNavigationBottomBarPrimitive`, `renderContextNavigationBottomBarPrimitive`, `attachContextNavigationBottomBarPrimitiveController` |
| Allowed consumers | `04-pattern-contract` after the selected system proof is ready |
| Consumers must use | `src/frontend/designSystem/layers/03-primitive/context-navigation-bottom-bar/index.mjs#contextNavigationBottomBarPrimitive` when runtime consumption is needed. |
| Consumers must not use | copied app markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | `render helper plus data/spec helper plus CSS/data-attribute contract` |
| Planned module | `src/frontend/designSystem/layers/03-primitive/context-navigation-bottom-bar/index.mjs` |
| Planned export | `contextNavigationBottomBarPrimitive`, `renderContextNavigationBottomBarPrimitive`, `attachContextNavigationBottomBarPrimitiveController` |
| Seam must own | `nav` semantics, accessible label requirement, context-navigation-frame token resolution, style-variable transport, fixed-bottom frame class/data contract. |
| Seam must not own | route-local demo markup, app wrappers, destination item anatomy, current state, More behavior, drawer launch behavior, product workflow, or unsigned visual values |
| First implementation posture | Small render helper that outputs a token-backed named bottom-bar `nav` and accepts slot HTML supplied by later governed consumers. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit proof must show token dependency resolution, allowed mode normalization, and render seam ownership. |
| accessibility | Browser proof must show a named navigation region. |
| token consumption | Unit proof must show only signed `context-navigation-frame` values are used. |
| rendered verification | Proof route must expose page-height pressure and assert bottom-bar position remains stable at scroll top, middle, and bottom when browser verification is available. |
| consumer boundary | Later patterns must consume the runtime seam instead of copied bottom-bar markup or local CSS. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/context-navigation-bottom-bar` |
| Rendered view status | `available; browser execution blocked locally by missing supported Playwright Chromium` |
| If unavailable | Browser execution requires a supported local browser. |

## Consumer Restrictions

Consumers must not hard-code values governed by Layer 2 tokens.

Consumers must not recreate primitive markup, controller behavior, ARIA rules,
or state handling locally.

Consumers must not use route-local `/design-system` markup as the primitive
source of truth.

Consumers must not weaken the accessibility requirements recorded here.

Consumers must not treat supplied proof slot content as governed destination
item, More-menu, or drawer-launch behavior.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared primitive contract at | `docs/design-system/03-primitive/shared/context-navigation-bottom-bar/ContextNavigationBottomBar-Contract.md` |
| Store system proof at | `docs/design-system/03-primitive/systems/default/context-navigation-bottom-bar/ContextNavigationBottomBar-Proof.md` |
| Stable lookup key | `shared/context-navigation/context-navigation-bottom-bar/03-primitive` |
| How later layers consume it | Later layers read the shared primitive contract and selected system proof by path or stable lookup key before making pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve behavior, accessibility, token dependencies, runtime seam policy, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a primitive revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `03-primitive/EVAL.md` |
| Required accessibility eval | `03-primitive/ACCESSIBILITY-EVAL.md` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed` |
| Reason | `context-navigation-item-control` should define destination/utility item anatomy before the bottom-bar frame is composed into a pattern. |
