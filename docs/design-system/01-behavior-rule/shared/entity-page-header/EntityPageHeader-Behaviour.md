# EntityPageHeader Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | shared |
| UI family | entity-page-header |
| Harness layer | 01-behavior-rule |
| Rule status | review-ready |
| Existing design-system URL | `/design-system/tokens/page-header`; `/design-system/tokens/entity-page-structure` |
| Proposed design-system URL | none at this layer |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | Operators working inside an entity management page. |
| Normal job | Understand which entity family and selected entity record they are editing, see the selected record's operational category and readiness state, and reach page-level actions without losing the entity-page context. |
| Success outcome | The header makes the selected entity context, status, and available page actions clear before the user enters the entity body. |
| Non-goals | Defining token values, primitive markup, component props, app route adoption, form layout, backend permissions, persistence, or entity-specific workflow rules. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| The entity page header identifies entity family, selected entity name, operational category, and readiness state. | 01-behavior-rule | `docs/workspace/design-system/behavior-locks/entity-management-page-outer-page-behavior-lock.md` | No active Layer 1 artifact for this family. | Recorded here. |
| The header sits in the shared top header region for entity pages. | 01-behavior-rule | `docs/workspace/design-system/behavior-locks/entity-page-structure-behavior-lock.md` | No active Layer 1 artifact for the populated header family. | Recorded here as placement behavior only. |
| The existing page-header route maps grouped regions over a 24-column foundation header. | 02-token | `docs/design-system/02-token/shared/page-header-structure/PageHeaderStructure-Contract.md` | none | Token work created the governed `page-header-structure` seam. |
| The populated header will arrange context copy, status, and actions across header regions. | 04-pattern-contract | Legacy evidence in `src/frontend/designSystem/patterns/listPagePattern/index.html` | No governed `entity-page-header` pattern contract exists. | Deferred to pattern work after token and primitive gates. |
| Icon-only page actions must expose names and focus behavior. | 03-primitive | `docs/design-system/03-primitive/shared/icon-button-control/IconButtonControl-Contract.md` | Pattern work must consume the governed primitive rather than render local button behavior. | Deferred to primitive consumption in later layers. |
| Status or readiness meaning must not rely on color alone. | 03-primitive / 04-pattern-contract | none for an entity readiness badge in the current primitive index | Missing governed status/badge primitive or a pattern-level browser-native text posture. | Deferred as a later-layer blocker before a badge can be claimed consumable. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| default | The header presents one selected entity context with family, selected record name, category or descriptor, readiness state, and eligible page actions. |
| no selected record | The header must not imply that a specific entity record is active; later layers must provide a clear empty or selection-required posture before app adoption. |
| status requires attention | The header communicates attention state with visible text and programmatic status semantics, not color alone. |
| constrained width | The header preserves the same meaning while lower layers decide which visual regions collapse, wrap, truncate, or move. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| activate page action | The action is reachable from the header without changing the selected entity context by surprise. |
| inspect truncated context text | If lower layers allow truncation, the full context remains discoverable through a governed text-disclosure behavior. |
| move through header controls by keyboard | Keyboard order follows the visible context before page-level actions unless a later accessibility proof records a stronger reason to vary it. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| App adoption | The entity-page-header component seam and app-adoption layer have not passed, so this cannot claim real-app use. |
| Form fields inside the entity body | They belong to the form component stream and must not be mixed into this header family. |
| Header column spans, spacing, colours, badges, and icons | These are token, primitive, or pattern decisions, not behavior-rule decisions. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Readiness/status badge semantics and rendering | 03-primitive | The header needs non-color status communication before a pattern can compose it safely. |
| Header slot ownership and composition | 04-pattern-contract | Composition belongs after required tokens and primitives are consumable. |
| Public component API or render seam | 05-component-seam | The Layer 5 harness is active, but this family still needs a component seam. |
| App page adoption | 08-first-app-adoption | App adoption is blocked until the full governed chain exists. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Header context and actions preserve meaningful reading and keyboard order under RTL. |
| zoomed in 150% | Header content remains reachable and does not overlap or hide required controls. |
| zoomed out 75% | Header grouping remains understandable and does not create misleading empty regions. |
| dark theme | Header meaning and focus visibility remain clear in dark theme. |
| desert theme | Header meaning and focus visibility remain clear in desert theme. |
| dark theme with error | Attention or error state remains text-backed and programmatically exposed in dark theme. |
| desert theme with error | Attention or error state remains text-backed and programmatically exposed in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | All header actions are reachable by keyboard, and keyboard order must preserve entity context before actions unless a later proof records a justified exception. |
| Focus | Focus indicators must remain visible for every interactive header control and must not be hidden by truncation, clipping, or overflow. |
| Names and semantics | The selected entity context must be exposed through meaningful text; icon-only actions require accessible names. |
| Error and status communication | Readiness, warning, blocked, or error states require visible text and programmatic status semantics when they affect the user's next action. |
| Color-independent meaning | Status and attention states must not rely on colour, position, or shape as the only carrier of meaning. |
| Later proof owners | Token and primitive layers own contrast, target size, focus-ring rendering, text disclosure, and status/badge proof before pattern consumption. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Entity readiness/status badge | 03-primitive | no | The header pattern cannot claim a reusable badge/status affordance until this behavior is formalized or a text-only browser-native posture is explicitly approved. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md` |
| Stable lookup key | `shared/entity-page-header/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | 01-behavior-rule | Treat this rule as review-ready if it passes the behavior and accessibility evals. | none |
| 2 | 02-token | Use the `page-header-structure` token seam created in this slice. | none |
| 3 | 03-primitive | Confirm or create the minimum status/readiness and text-disclosure primitive dependencies needed by the populated header. | Pattern work must not invent badge, tooltip, or truncation behavior locally. |
| 4 | 04-pattern-contract | Create the entity-page-header pattern contract and proof route. | Blocked until required primitive dependencies are consumable. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | 03-primitive |
| Next layer status | blocked |
| Reason | The structural page-header token is now governed, but status/readiness semantics need a primitive decision or an explicit text-only posture before the populated pattern can claim completion. |
