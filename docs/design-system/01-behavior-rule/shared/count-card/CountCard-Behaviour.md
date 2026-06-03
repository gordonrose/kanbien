# Count Card Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `count-card` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/tokens/count-card` |
| Proposed design-system URL | not assigned at Layer 1 |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/count-card/CountCard-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/count-card/CountCard-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person scanning a compact summary card to understand a labelled count or open a related selection/filter surface. |
| Normal job | The user identifies the label, count, state, and whether the card can be activated. |
| Success outcome | The user can tell what is being counted, how many items match, whether the count is selected or unavailable, and what happens if the card is activated. |
| Non-goals | This rule does not govern selectable option cards, search panels, drawer select value semantics, status tabs, backend counts, token values, primitive markup, pattern routes, component APIs, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Legacy route shows compact cards with label text and a fixed numeric count slot. | `01-behavior-rule`, `02-token`, `03-primitive` | legacy `/design-system/tokens/count-card` route only. | Governed count-card chain is missing. | Behavior recorded here; token and primitive work deferred. |
| Source route shows default, selected, disabled, warning, and error postures. | `01-behavior-rule` plus later layers | none for count-card. | State meaning was not governed. | Recorded as behavior states; visual treatment deferred. |
| Count-card text can overflow in constrained width. | `01-behavior-rule` and `03-primitive` | `truncating-label` governs text-overflow disclosure. | Count-card primitive must consume governed disclosure later. | Recorded as mandatory behavior. |
| Cards may be used as launchers for filter or selection panels. | `01-behavior-rule` and later component/pattern layers | `panel-stack` governs panel stacking, not count-card activation. | Activation semantics must be explicit before drawer/filter use. | Recorded as optional actionable behavior. |
| Numeric count may be zero or non-zero. | `01-behavior-rule` | none needed. | none. | Recorded as count meaning, not visual state. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| default | The card presents a label and count without implying selection, warning, error, or disabled meaning. |
| actionable | The card can be activated to open or focus a related governed surface supplied by a later pattern or component. |
| selected | The card represents the currently selected count category or filter. |
| disabled | The card remains understandable but cannot be activated. |
| warning | The card communicates that the counted group needs attention without relying on color alone. |
| error | The card communicates that the counted group is blocked or failed without relying on color alone. |
| zero-count | The count is zero and must remain explicit rather than disappearing. |
| truncated text | A truncated label must expose the full label through governed text-overflow disclosure only when truncation occurs. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| activate actionable card | The related governed surface opens or receives focus, and the user can tell which card launched it. |
| focus actionable card | Focus is visible, and the accessible name includes the label and count meaning. |
| attempt disabled card activation | Nothing opens or changes, and disabled meaning remains clear. |
| request full truncated text | Full label text is available only when the rendered label is actually truncated and must not be implemented with native `title` alone. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Card surface, border, radius, count slot size, typography, state colors, iconography, focus ring, and spacing | These are Layer 2 token decisions. |
| Button versus link versus static element semantics | This belongs to Layer 3 primitive work because it depends on actionable versus static use. |
| Panel opening, panel placement, selected grouping, filtering, search, or drawer behavior | These belong to `panel-stack`, `searchable-selection-panel`, drawer-select, or later pattern/component layers. |
| Backend count calculation, query state, persistence, or analytics | Count data contracts belong outside this Layer 1 design-system behavior rule. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Whether count-card visuals reuse `choice-option-frame` or require a dedicated count-card frame token | `02-token` | The card is summary/launcher UI, not necessarily a selectable option. |
| Count number typography and fixed count slot sizing | `02-token` | Count alignment and readability need signed values before primitive proof. |
| Static versus actionable primitive rendering | `03-primitive` | Semantics, keyboard behavior, and accessible names depend on actionability. |
| Count-card use inside filters, status tabs, or drawer-select triggers | `04-pattern-contract` and later | Patterns decide where count cards are composed and what they activate. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Label, count, state, and activation remain understandable without reversing count meaning. |
| zoomed in 150% | Label, count, state, focus, and disabled/actionable meaning remain readable and reachable. |
| zoomed out 75% | Count and state meaning remain recognizable. |
| dark theme | Later layers must prove default, selected, disabled, warning, and error states remain readable without relying on color alone. |
| desert theme | Later layers must prove default, selected, disabled, warning, and error states remain readable without relying on color alone. |
| dark theme with error | Later layers must prove selected, warning, and error meanings remain distinct in dark theme. |
| desert theme with error | Later layers must prove selected, warning, and error meanings remain distinct in desert theme. |
| constrained width | Later layers must prove label text truncates through governed disclosure and does not overlap the count. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Actionable cards must be keyboard reachable and activatable; static cards must not be placed in the tab order. |
| Focus | Actionable cards must show visible focus. |
| Names and semantics | The accessible name must include the card label and count meaning; actionability must be semantic, not only visual. |
| Error and status communication | Selected, disabled, warning, and error meaning must be communicated without relying on color alone. |
| Color-independent meaning | State meaning needs text, semantics, or another non-color cue in later layers. |
| Later proof owners | Contrast, target size, truncation disclosure, count slot layout, and rendered keyboard behavior belong to later token, primitive, pattern, and verification layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

Consumers must not treat legacy `/design-system/tokens/count-card` markup as governed adoption.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Count-card frame and count-slot values | `02-token` | no | No primitive or pattern can claim count-card visual readiness until signed values exist or existing tokens are proven sufficient. |
| Count-card primitive render seam | `03-primitive` | no | Searchable-selection, filter-panel, status-tab, and drawer-select patterns cannot consume count-card as governed UI until the primitive exists. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/count-card/CountCard-Behaviour.md` |
| Stable lookup key | `shared/count-card/01-behavior-rule` |
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
| 2 | `02-token` | Decide whether count-card frame and count-slot values reuse existing choice/card/text tokens or need a dedicated token. | Primitive work must not invent card frame, count slot, or state visuals. |
| 3 | `03-primitive` | Build a count-card primitive with static and actionable semantics after token gates pass. | Patterns must not render count-card buttons locally. |
| 4 | `04-pattern-contract` | Compose count cards into filter, status, drawer-select trigger, or searchable-selection-panel patterns only after primitive readiness. | Later patterns must consume this primitive rather than copying the legacy route. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines stable count-card meaning and blocks primitive or pattern work until token inventory proves whether existing seams cover count-card frame, count-slot, and state visuals. |
