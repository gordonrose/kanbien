# Entity Panel Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `entity-panel` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/templates/entity_management_page`; `/design-system/tokens/entity-page-structure`; `/design-system/tokens/nested-entity-record`; `/design-system/tokens/list-page-record-structure` |
| Proposed design-system URL | `none yet` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person editing or reviewing one section of an entity body. |
| Normal job | The user can stay oriented to the active entity section, move through nested section navigation when present, and work in the body content region without losing access to the relevant panel context. |
| Success outcome | The user understands which panel they are in, can reach the active nested section or body content, and can move back out of mobile takeover states without losing orientation. |
| Non-goals | This rule does not define form controls, builder internals, token values, primitive markup, pattern CSS, component APIs, route files, canonical scenarios, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| A content-side entity panel needs a visible header before nested navigation or body content. | `01-behavior-rule` | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` is related but broader. | Missing narrow `entity-panel` behavior rule. | Recorded here as a panel orientation requirement. |
| Panel header should follow the same basic dimensions and title/action posture as the index panel header. | `02-token` then `03-primitive` | `index-nav-panel-header-control` and `index-nav-panel-frame` exist for index navigation only. | A generic panel-header token/primitive reuse decision is missing. | Deferred; later layers must promote or reuse instead of duplicating. |
| Secondary index appears under the panel header and is embedded in the panel. | `04-pattern-contract` | `index-nav-panel` and `index-nav` exist. | Entity panel composition pattern is missing. | Recorded here as reuse requirement; exact composition is deferred. |
| Body/content region hosts form, builder, accordion, select, and workflow interactions. | `04-pattern-contract` and later | No governed entity panel pattern yet; several form/builder families are not governed. | Body host pattern and downstream control families are missing. | Recorded as body-host behavior; form/builder details deferred. |
| Desktop body/content region needs internal scrolling while preserving panel context. | `01-behavior-rule` and later `04-pattern-contract` | `scroll-region-control` exists as a primitive. | Entity panel pattern must decide where scroll ownership is applied. | Recorded here as scroll ownership behavior. |
| Mobile body/content takes precedence over secondary index, and secondary index takes precedence over primary entity index. | `01-behavior-rule` | `index-navigation` covers mobile page-scroll lists but not cross-region takeover priority. | Entity panel mobile priority rule is missing. | Recorded here as mobile priority behavior. |
| Mobile takeover regions can be closed with an `x` control in their header. | `01-behavior-rule` then `03-primitive` | `icon-button-control` exists. | Close behavior and pattern composition are missing. | Recorded here as observable close behavior; primitive choice deferred. |
| Text fields, textareas, radios, toggles, dropdowns, drawer selects, accordion, card selects, and workflow builder are needed inside the body. | `03-primitive`, `04-pattern-contract`, or later depending on each family. | Some older route-local or design-system surfaces may exist but are not governed for this chain. | Each family needs its own harness pass before use. | Deferred; not part of entity-panel readiness. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| desktop panel | The panel keeps its header visible enough for orientation while the user works in nested navigation or body content. |
| with secondary index | A nested section list is available inside the panel without redefining primary entity navigation. |
| without secondary index | The body content remains reachable and understandable when no nested section list exists. |
| body active | The body/content region is the working region for fields, builders, accordions, and future governed body patterns. |
| body scroll | Long body content can scroll without making the user lose the panel header context on desktop. |
| mobile body takeover | The body/content region can take the available mobile width as the highest-priority working view. |
| mobile secondary-index takeover | The secondary index can take the available mobile width when the user needs nested navigation, but it is lower priority than body content. |
| mobile primary-index fallback | The primary entity index is lower priority than body and secondary index in the entity-panel workflow. |
| closable mobile takeover | A mobile takeover region exposes a way to leave that region and return to the previous relevant context. |
| blocked foundation | If required tokens, primitives, or child patterns are missing, later work must stop at the earliest missing layer instead of approximating the panel locally. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| enter panel | A user can identify the panel purpose before interacting with nested navigation or body content. |
| move to secondary index | A user can reach nested section navigation when it exists without leaving the entity body context. |
| move to body content | A user can reach the body/content region and continue working even when secondary navigation exists. |
| switch mobile region | On mobile, the active takeover region changes without making lower-priority regions compete for the same screen width. |
| close mobile takeover | Closing a mobile takeover returns the user to the previous relevant entity context instead of dropping them into an unrelated page state. |
| encounter long content | Long body content scrolls through the governed scroll owner rather than forcing copied page-local scroll behavior. |
| encounter missing hosted control | A missing field, select, builder, or accordion foundation blocks readiness for that hosted control without blocking the panel shell behavior rule. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Exact panel widths, heights, surfaces, borders, radius, spacing, typography, close-button visuals, and scroll skin | These are `02-token` decisions. |
| Header markup, close button semantics, truncating text behavior, scroll-region semantics, and form-control semantics | These are `03-primitive` decisions after required tokens are signed. |
| Exact panel anatomy, slot layout, embedded secondary-index placement, and body/content slot composition | These are `04-pattern-contract` decisions. |
| Text field, textarea, radio, toggle, dropdown, drawer select, accordion, priority cards, view/hide cards, and workflow builder behavior | These need their own primitive or pattern harness passes before they can be consumed by the body region. |
| Entity page template, canonical scenario, route topology, backend data loading, persistence, and app adoption | These belong to later governed layers or non-design-system governance. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Whether `index-nav-panel-header-control` should become a generic `panel-header` primitive or stay family-scoped | `02-token` then `03-primitive` | The behavior rule can require reuse posture, but token and primitive layers must decide the reusable seam. |
| Which signed tokens govern panel frame, header, body padding, mobile takeover, close affordance, and scroll sizing | `02-token` | Later layers must not invent visual or sizing values. |
| How the embedded secondary index reuses `index-nav` or `index-nav-panel` without duplicating navigation behavior | `04-pattern-contract` | Composition of child patterns belongs to the pattern layer. |
| How mobile takeover state is represented and verified | `04-pattern-contract` or later | The behavior rule sets priority and close behavior; implementation structure is deferred. |
| Which body form/builder families are promoted first | `01-behavior-rule` through later layers per family | Each hosted family needs its own foundation before entity-panel can render it as governed content. |

## Layer 2 Handoff

Layer 2 must inventory reusable seams before creating entity-specific token
names. The default posture is to promote generic panel and control tokens when
the behavior is not unique to entity panels.

| Needed Decision | Existing Candidate | Required Layer 2 Outcome |
| --- | --- | --- |
| Panel frame surface, border, padding, radius, width, and scroll sizing | `index-nav-panel-frame`; `panel-corner-radius`; `background-color` | Decide whether a generic `panel-frame` token should be promoted before entity-panel patterns consume panel geometry. Do not copy `index-nav-panel-frame` values into entity-panel tokens. |
| Panel header height, separator, sticky inset, title/action gap, and close/add action placement | `index-nav-panel-frame` header variant; `minimum-target-size`; `label-text-style` | Promote or define a generic panel-header token seam before a generic panel-header primitive exists. Entity-panel work must not consume an index-nav-only header token unless a later token artifact explicitly broadens its scope. |
| Close and add action frame | `button-frame`; `icon-size`; `focus-ring`; `minimum-target-size`; `icon-button-control` | Reuse generic action tokens and primitives. Do not create entity-body-specific close or add button appearance unless generic button tokens prove insufficient. |
| Body scroll region and scrollbar skin | `scrollbar-skin`; `scroll-region-control` | Reuse the generic scroll primitive and define only the body/panel max-height ownership that is missing. Do not invent scrollbar CSS in the pattern. |
| Desktop versus mobile panel height behavior | `index-nav-panel-frame` has list-oriented scroll sizing | Define whether a generic panel/body sizing token is needed for desktop viewport fit and mobile content-height scrolling. Do not rely on proof-route container sizes as token truth. |
| Embedded secondary index width and resize limits | `index-nav-panel`; `resize-handle-control`; `resize-handle` | Reuse the governed index-nav panel for the secondary index. Width and resize limits must come from its signed token seam or a promoted generic panel-frame seam. |
| Hosted form, builder, select, dropdown, drawer, toggle, and accordion controls | no governed generic family yet | Stop at the first missing hosted control family. The entity-panel shell may reserve a body slot, but it cannot claim hosted control readiness. |

If a Layer 2 artifact cannot name a signed lower-layer source for a value, the
work must stop at Layer 2. Later layers must not fill the gap with local CSS,
route-only fixtures, or copied values from screenshots.

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove header, close affordance, embedded secondary index, body scroll, and mobile takeover priority remain understandable in RTL. |
| zoomed in 150% | Later layers must prove header, close control, secondary index, and body content remain reachable and do not overlap incoherently. |
| zoomed out 75% | Later layers must prove panel boundaries, secondary index relationship, and body region remain recognizable. |
| dark theme | Later layers must prove panel context, body region, and navigation priority do not depend on original-theme-only contrast. |
| desert theme | Later layers must prove panel context, body region, and navigation priority do not depend on original or dark theme assumptions. |
| dark theme with error | Later layers must prove blocked foundation, validation, or hosted-control error communication remains distinct from normal panel state in dark theme. |
| desert theme with error | Later layers must prove blocked foundation, validation, or hosted-control error communication remains distinct from normal panel state in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Keyboard users must be able to enter the panel, reach the close control when present, reach secondary navigation when present, and reach body content in an understandable order. |
| Focus | Focus must not be trapped by desktop internal scrolling or mobile takeover unless a later governed overlay pattern explicitly owns that behavior. Closing a mobile takeover must leave focus in a predictable entity context. |
| Names and semantics | The panel, header, secondary navigation, close affordance, and body region must have understandable visible or programmatic meaning in later layers. |
| Error and status communication | Missing lower-layer foundations and hosted-control validation or error states must be communicated as real status conditions when present. |
| Color-independent meaning | Active region, navigation priority, blocked state, selected state, and error state must not rely on color alone. |
| Later proof owners | Contrast, target size, focus rendering, text truncation, scroll affordance visuals, mobile takeover geometry, and hosted-control validation proof belong to Layer 2 and later rendered-proof layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

Consumers must not build entity form or builder controls inside this panel by
copying route-local examples before those hosted families are governed.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Generic panel header token/primitive reuse decision | `02-token` then `03-primitive` | no | Entity-panel primitives or patterns cannot claim readiness while duplicating header dimensions or behavior locally. |
| Entity panel frame, body region, mobile takeover, and scroll sizing tokens | `02-token` | no | Pattern work cannot claim readiness if it invents these values locally. |
| Embedded secondary index composition | `04-pattern-contract` | no | Pattern work must reuse governed index navigation seams instead of creating a second navigation family. |
| Text field, textarea, radio, toggle, dropdown, drawer select, accordion, card select, and workflow builder families | `03-primitive`, `04-pattern-contract`, or later per family | no | The entity-panel may host placeholders or blocked-state evidence, but cannot claim those hosted controls are governed until their own layers pass. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Stable lookup key | `shared/entity-panel/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this behavior rule against `EVAL.md` and `ACCESSIBILITY-EVAL.md`. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Inventory existing panel, header, body, takeover, close-control, and scroll tokens; promote generic seams where index-nav-specific values are reusable. | Later layers must not invent missing visual, sizing, or scroll values. |
| 3 | `03-primitive` | Decide whether a generic panel header primitive should be promoted from the index-nav header, then define only primitives whose tokens are signed. | Primitive work is blocked until required token seams exist. |
| 4 | `04-pattern-contract` | Define the entity-panel pattern using governed header, secondary index, scroll/body, and close behavior. | Pattern work is blocked until behavior, tokens, and required primitives are governed. |
| 5 | later | Govern hosted form and builder families one family at a time before rendering them as real body content. | The body panel must not make up ungoverned form or builder behavior. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines the panel behavior and names token inventory as the next foundation needed before primitive or pattern work can be claimed. |
