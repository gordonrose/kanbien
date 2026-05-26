# Entity Body Placement Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `entity-body-placement` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/templates/entity_management_page`; `/design-system/tokens/nested-entity-record`; `/design-system/tokens/list-page-record-structure` |
| Proposed design-system URL | `none yet` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A design-system maintainer or app builder placing an entity body inside a full page or another governed host. |
| Normal job | The user can place the same entity body as the main page content or as embedded content without changing its meaning, navigation behavior, or accessibility responsibilities. |
| Success outcome | The entity body remains understandable and operable when moved between full-page and embedded hosts, and downstream work knows which decisions belong to the host versus the entity body. |
| Non-goals | This rule does not define page-shell chrome, token values, layout measurements, primitive names, pattern anatomy, component APIs, route files, or app adoption behavior. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Behavior States

Include only states that apply to this UI family.

Each row must describe observable behavior.

| State | Observable Behavior |
| --- | --- |
| full-page placement | The entity body acts as the primary content after shell chrome establishes the active page context. |
| embedded placement | The entity body appears inside another governed host while preserving its internal region meaning, headings, navigation meaning, field meaning, and status meaning. |
| known embedded host evidence | `nested-entity-record` and `list-page-record-structure` show that the entity body may be hosted inside bounded record containers or split list-record structures, but their exact structure is not governed by this behavior rule. |
| constrained placement | Reduced width, height, or surrounding chrome does not cause the entity body to hide required meaning, reorder meaning incoherently, or require copied host-specific behavior. |
| placement scroll boundary | Desktop placement may allow a host to own an outer scroll boundary, while mobile full-page placement scrolls with the page; in both cases the entity body must keep its orientation, reachable content, and focusable controls understandable. |
| route-independent placement | A route may host the entity body, but route structure is not the source of the entity body's behavior contract. |
| unresolved foundation | If required token, primitive, pattern, or component seams are missing, the body is treated as blocked from downstream implementation rather than approximated locally. |

## Required Interactions

List only interactions that create behavior decisions for this family.

| Interaction | Observable Behavior |
| --- | --- |
| enter body | A user can identify where the entity body begins after surrounding shell or host chrome. |
| move through body regions | A user can move through body regions without the meaning of primary region navigation, secondary region navigation, headings, fields, or status affordances changing between placement modes. |
| place inside host | Embedding the body inside a governed host preserves the entity body's behavior and accessibility promises while allowing the host to own surrounding chrome and outer containment. |
| place inside split record host | When hosted inside a list-record structure, the entity body preserves its internal meaning while the host owns surrounding list support, record containment, and any approved localized scroll relationship. |
| render through route | Rendering the body at a route must preserve the same body behavior expected in non-route embedded hosts. |
| leave body | A user can leave the entity body without losing orientation to the surrounding page or host. |
| encounter missing lower layer | A maintainer is directed back to the earliest missing governed layer instead of copying route-local markup, CSS, or controller behavior. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Top navigation, sub-navigation, context navigation, breadcrumbs, search shell, and display settings | These are shell or host concerns, not entity-body placement behavior. |
| Spacing, sizing, borders, surfaces, focus-ring values, text colors, overflow affordance visuals, and selected-state visuals | These are Layer 2 token decisions. |
| Low-level control behavior and markup | Primitive decisions belong to `03-primitive` after required token seams exist. |
| Index navigation, panel region anatomy, truncation-with-tooltip composition, and body header composition | Pattern decisions belong to `04-pattern-contract` or later. |
| Exact `nested-entity-record` or `list-page-record-structure` anatomy, including split ratios, column counts, resize handles, and localized scroll implementation | These are structural token, pattern, component, or rendered-proof decisions, not this placement behavior rule. |
| Importable component seams, route files, canonical scenarios, and first app adoption | These belong to later governed layers. |
| Durable route hierarchy, path names, URL state, and app topology | These belong to frontend topology, template, canonical, or app-adoption governance unless they change the entity body's observable behavior. |

## Deferred Decisions

Use this section when a real decision exists but belongs to a later layer.

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which structural, focus, text, surface, border, overflow, and selected-state values support both placements | `02-token` | The behavior rule names what must remain stable, but token artifacts must sign the visual and sizing decisions. |
| Which low-level controls are needed inside the entity body | `03-primitive` | Primitive artifacts must define low-level semantics, states, and token dependencies after token seams exist. |
| How primary and secondary navigation, panel regions, body headers, truncation, and embedded anatomy compose | `04-pattern-contract` | Pattern artifacts own reusable composition and layout anatomy. |
| How `nested-entity-record` and `list-page-record-structure` host the body structurally | `04-pattern-contract` or later | This rule records the host/body behavior obligation, but exact host anatomy needs its own governed composition artifact. |
| How a runtime entity body seam is consumed by templates, canonicals, tests, or apps | Later layers | Runtime consumption must wait for governed lower-layer contracts. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove full-page and embedded placements remain understandable when direction changes, surrounding host chrome may differ, navigation meaning must not reverse incorrectly, and focus order remains understandable. |
| zoomed in 150% | Later layers must prove the body remains readable and operable in both placements without incoherent overlap or lost orientation. |
| zoomed out 75% | Later layers must prove region meaning and host/body boundaries remain recognizable in both placements. |
| dark theme | Later layers must prove placement mode does not depend on original-theme-only visual distinctions. |
| desert theme | Later layers must prove placement mode does not depend on original or dark theme visual distinctions. |
| dark theme with error | Later layers must prove error or blocked-foundation communication remains distinct from normal body placement in dark theme. |
| desert theme with error | Later layers must prove error or blocked-foundation communication remains distinct from normal body placement in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Keyboard users must be able to enter, move through, and leave the entity body in both placement modes when interactive descendants are present. |
| Focus | Focus order must remain understandable when the body is embedded, and focus must not be trapped by the body unless a later governed overlay pattern explicitly owns that behavior. |
| Names and semantics | Body regions, headings, fields, navigation meaning, status meaning, and host/body boundaries must have understandable visible or programmatic meaning in later layers. |
| Error and status communication | Missing lower-layer foundations, validation states, loading states, and error states must be communicated as real status conditions when present, not hidden by placement mode. |
| Color-independent meaning | Placement, selected region, blocked state, error state, and status meaning must not rely on color alone. |
| Later proof owners | Contrast, target size, focus rendering, tooltip behavior, scroll affordance visuals, zoom, and rendered host/body evidence belong to Layer 2 and later rendered-proof layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

Consumers must not treat the full-page route as the only valid source of entity-body behavior.

Consumers must not treat an embedded host as permission to redefine the entity body's internal meaning.

Consumers must not use a route path, route-local markup, or route-local state as
the behavior source of truth for this family.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Structural, focus, text, surface, border, overflow, and selected-state token seams for both placement modes | `02-token` | no | Token, primitive, pattern, component, template, canonical, or app work for this family cannot be called complete until the required token seams are governed. |
| Low-level controls used inside the entity body | `03-primitive` | no | Pattern and component work cannot claim stable behavior for those controls until primitives exist or an explicit exception is approved. |
| Reusable body composition and host/body anatomy | `04-pattern-contract` or later | no | App or template work cannot claim governed reuse by copying the existing design-system route. |
| Durable route hierarchy and URL state | Frontend topology, template, canonical, or app-adoption governance | no | Route structure cannot be treated as this family's behavior contract unless an owning route/topology artifact says so. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Stable lookup key | `shared/entity-body-placement/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Layer 2 Token Ask

| Field | Value |
| --- | --- |
| Later layer | `02-token` |
| Ask summary | Define or confirm the reusable structural, focus, text, surface, border, overflow, and selected-state token seams needed for the entity body to work in full-page and embedded placement. |
| Recognition result | The ask is a reusable visual and structural foundation decision; local hard-coding would create drift across themes, zoom, constrained hosts, and downstream consumers. |

| Needed Information | Status |
| --- | --- |
| Source behavior or downstream need | Known: the same entity body must work as full-page content and embedded content while preserving behavior and accessibility meaning. |
| Existing token inventory check | Missing: Layer 2 must inspect current token inventory before adding or reusing structural placement tokens. |
| Exact visual decision needed | Partially known: surface, border, text, focus, overflow, selected-state, spacing, and sizing decisions are needed; names and values are undecided. |
| Expected consumers | Known: later primitives, patterns, component seams, templates, and app adoption must consume governed seams rather than route-local CSS. |
| Supported themes | Known: original, dark, and desert themes must be reviewed. |
| Direction and magnification expectations | Known: RTL, 150% zoom, and 75% zoom must preserve body meaning and host/body orientation. |
| Review evidence needed | Missing: Layer 2 must define the concrete rendered evidence required before primitives or patterns claim readiness. |

Layer 2 must confirm whether existing token seams can support both placement
modes. If not, Layer 2 must define the smallest token additions needed before
primitive or pattern work continues.

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this behavior rule against `EVAL.md` and `ACCESSIBILITY-EVAL.md`. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Inventory and define the smallest token seams needed for full-page and embedded entity-body placement. | No known behavior-rule blocker remains, but later layers must not invent missing token decisions. |
| 3 | `03-primitive` | Define only the primitives whose required token seams are signed and whose low-level behavior is needed by the body. | Primitive work is blocked until the needed Layer 2 seams exist. |
| 4 | `04-pattern-contract` | Define reusable body, navigation, header, panel, and truncation patterns only after lower layers are ready. | Pattern work is blocked until behavior, tokens, and required primitives are governed. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines the placement contract and identifies token seams as the next foundation needed before primitive or pattern work can be claimed. |
