# Card List Select Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `card-list-select` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/default/patterns/entity-panel` |
| Proposed design-system URL | not assigned at Layer 1 |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/card-list-select/CardListSelect-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/card-list-select/CardListSelect-Behaviour.md` |
| Related behavior | `docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md` |

## Purpose

A card-list select lets a user toggle multiple larger choice cards in a form section.

It follows the same broad layout posture as `radio-simple-select`: a named group, option cards, optional group supporting text, optional option supporting text, 1-4 column layout pressure, RTL support, zoom support, and governed truncation disclosure.

It differs from `radio-simple-select` because more than one card may be selected at the same time, and some variants expose extra trailing state text or ordering meaning.

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, glyph artwork, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Card-list select should follow the same layout posture as radio simple select. | `01-behavior-rule`, `02-token`, `03-primitive` | `radio-simple-select` governs single-choice behavior and has emerging card layout foundations. | Shared multi-select card foundations are not yet promoted as card-list tokens or primitives. | Recorded as behavioral alignment; visual reuse deferred. |
| Multiple cards can be selected at the same time. | `01-behavior-rule` | none | Card-list multi-select behavior rule was missing. | Recorded here. |
| Visible/hidden variant toggles state independently per card. | `01-behavior-rule` | none | State glyph and trailing state text tokens are missing. | Recorded as behavior; visuals deferred. |
| Priority variant assigns ranks in selection order. | `01-behavior-rule` | none | Priority ranking and compaction behavior was missing. | Recorded here. |
| Deselecting a priority item compacts later ranks upward. | `01-behavior-rule` | none | Priority compaction needed a stable contract before primitive work. | Recorded here. |
| Glyphs communicate visible/hidden or selected/not-selected. | `02-token` and `03-primitive` | in-repo glyph direction exists but is not yet a signed card-list state affordance. | Glyph identity, size, placement, and state styling must be governed before rendering. | Deferred. |
| Trailing state text says `Visible`, `Hidden`, `Not on`, or `Priority n`. | `01-behavior-rule`, `02-token`, `03-primitive` | text-overflow disclosure governs truncated text generally. | Trailing state text role and placement tokens are missing. | Behavior recorded; styling and wiring deferred. |
| Any text that exceeds its available space must truncate and disclose. | `01-behavior-rule` and `03-primitive` | governed text-overflow disclosure exists as a cross-layer rule. | Card-list primitive must wire disclosure for all visible text roles later. | Recorded as mandatory behavior. |

## Behavior Contract

Card-list select is a multi-select choice family.

Each enabled card toggles independently unless the selected variant adds priority compaction behavior.

The group must have one programmatic name. Optional group supporting text may describe the choice, but it must not replace the group name.

Each card must have one programmatic label. Optional card supporting text may describe the option, but it must not replace the option label.

Card-list select may reuse radio-simple-select layout and option-card styling foundations only after those foundations are promoted as shared tokens or primitives. It must not copy radio-specific semantics.

The family must preserve focus visibility, disabled behavior, error behavior, required behavior when applicable, RTL behavior, zoom resilience, and overflow-gated text disclosure.

## Behavior Variants

### Visible / Hidden

The visible/hidden variant lets each card toggle whether an item is visible.

Each card exposes one of two states:

- `visible`
- `hidden`

The card uses a visibility glyph affordance to communicate visible versus hidden state. The glyph identity, size, placement, and visual skin are later-layer decisions.

The opposite edge of the card exposes trailing state text:

- `Visible`
- `Hidden`

Toggling one card does not change the state of any other card.

### Priority

The priority variant lets a user select multiple cards and communicate the order in which selected cards should be applied.

Each card exposes one of two selection states:

- `not selected`
- `selected`

A selected card also exposes a priority rank.

The first card selected becomes `Priority 1`. The second selected card becomes `Priority 2`, and so on.

If a selected card is deselected, it loses its rank and all selected cards with a later rank move up by one.

The card uses a selected/not-selected glyph affordance. The glyph identity, size, placement, and visual skin are later-layer decisions.

The opposite edge of the card exposes trailing state text:

- `Not on`
- `Priority n`

where `n` is the card's current integer rank among selected cards.

## Behavior States

| State | Observable Behavior |
| --- | --- |
| default group | The group is available and enabled cards can be toggled. |
| required group | The group communicates that at least one valid selection is required when the consuming form requires it. |
| disabled group | No card in the group can be changed or reached as an enabled control. |
| disabled card | The disabled card cannot be toggled, while other enabled cards remain usable. |
| error group | The group communicates invalid state and references error text when supplied; color alone must not carry error meaning. |
| visible card | Visible/hidden variant card is currently included/visible. |
| hidden card | Visible/hidden variant card is currently excluded/hidden. |
| selected priority card | Priority variant card is currently selected and exposes `Priority n`. |
| not-on priority card | Priority variant card is not selected and exposes `Not on`. |
| truncated text | Any truncated group label, group supporting text, card label, card supporting text, or trailing state text must expose the full text through governed text-overflow disclosure. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| click or tap enabled visible/hidden card | Toggles that card between `Visible` and `Hidden`. |
| click or tap enabled priority card that is not selected | Selects that card and assigns the next available priority rank. |
| click or tap enabled priority card that is selected | Deselects that card, removes its priority rank, and compacts later selected ranks upward. |
| click or tap card label area | Activates the associated card selection control; the label area must not become a separate competing control. |
| keyboard focus enters group | Focus reaches enabled card controls in a predictable order without trapping the user. |
| space or enter on focused enabled card | Toggles the focused card according to the active variant. |
| leave group | Focus can move past the group without trapping the user. |
| request full truncated text | Full text is available only when text is actually truncated and must not be implemented with native `title` alone. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Glyph artwork, icon source, icon size, icon placement, selected bar, card border, selected background, spacing, radius, typography, and grid gaps | These are Layer 2 token decisions. |
| Exact native input or ARIA strategy | This belongs to Layer 3 primitive work after token gates pass. |
| Exact 1, 2, 3, or 4 column CSS implementation | This belongs to Layer 2 layout tokens and the Layer 3 primitive render seam. |
| Product validation copy, saving, persistence, backend values, or form submission | This family only governs input behavior. |
| Single-choice radio behavior | Governed separately by `radio-simple-select`. |
| Dropdown, drawer select, toggle switch, workflow builder, or accordion behavior | These are separate form families. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Whether the primitive uses native checkboxes, buttons with `aria-pressed`, or another approved semantic strategy | `03-primitive` | The primitive owns semantic rendering and keyboard wiring. |
| Shared card layout reuse from radio-simple-select | `02-token` and `03-primitive` | Reuse is allowed only through promoted shared tokens/primitives, not copied radio markup. |
| Glyph source and visible/non-visible selected affordances | `02-token` | Non-color state indicators must be signed before primitive rendering. |
| Trailing state text styling and placement | `02-token` | Text role and card geometry values must be signed. |
| Priority rank calculation event contract | `03-primitive` | The primitive owns emitted value shape and reorder/compaction behavior. |
| Rendered proof route controls for variant, columns, RTL, theme, error, disabled card, long text, and priority compaction | `03-primitive` | Rendered evidence belongs with the primitive proof once tokens exist. |

## Mandatory Review Dimensions

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Card order, glyph edge, trailing state text edge, and keyboard order must remain understandable. |
| zoomed in 150% | Text must not overlap its container; truncated text must expose full text when truncation occurs. |
| zoomed out 75% | Card hit areas and state meaning must remain stable. |
| dark theme | Later rendered proof must show card frame, glyph, focus, selected state, disabled state, and trailing state text remain readable. |
| desert theme | Later rendered proof must show card frame, glyph, focus, selected state, disabled state, and trailing state text remain readable. |
| dark theme with error | Later rendered proof must show error meaning, focus, and selected state remain distinguishable without relying on color alone. |
| desert theme with error | Later rendered proof must show error meaning, focus, and selected state remain distinguishable without relying on color alone. |
| narrow width | One-column rendering must remain usable and disclose truncated text. |
| 1, 2, 3, and 4 columns | Later rendered proof must show each approved column count. |
| priority compaction | Later rendered proof must show deselection removes rank and moves later ranks up by one. |
| visible/hidden independence | Later rendered proof must show toggling one visible/hidden card does not change sibling cards. |

## Accessibility Contract

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Enabled cards must be reachable and toggleable by keyboard without trapping focus. |
| Focus | Focus must be visible on the active card control. |
| Names and semantics | The group must expose a programmatic group name, and each card must expose a programmatic option label. |
| Description wiring | Optional group text, option supporting text, and trailing state text must be associated when they provide task-relevant meaning. |
| Error and status communication | Error state must expose invalid semantics and associated error text when supplied; product validation copy is not invented here. |
| Color-independent meaning | Visible/hidden, selected/not-selected, priority, disabled, required, and error states must not rely on color alone. |
| Text disclosure | Truncated group, option, or trailing state text must preserve accessible meaning and expose full text through governed disclosure. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate priority ranking or rank compaction in app-local controller behavior when a governed primitive exists.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy radio-simple-select markup, older choice-group routes, screenshots, or form-template markup as governed adoption.

Consumers must not silently truncate group, option, or trailing state text without governed full-text disclosure.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Shared choice card frame, layout, and text tokens | `02-token` | no | No primitive or pattern can claim governed visual readiness until signed tokens exist. |
| State glyph and trailing state text tokens | `02-token` | no | No primitive can render visible/hidden or priority affordances as governed UI until these are signed. |
| Card-list select primitive render seam | `03-primitive` | no | No pattern, template, or app surface can consume card-list select as governed UI until the primitive exists. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/card-list-select/CardListSelect-Behaviour.md` |
| Stable lookup key | `shared/card-list-select/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact before making token, primitive, pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve multi-select behavior, visible/hidden independence, priority ranking and compaction, state text, accessibility responsibilities, mandatory review dimensions, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, radio-simple-select route markup, older choice-group routes, form template markup, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this behavior rule. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Promote any reusable radio-simple-select card layout values into shared choice-card tokens, then add glyph/trailing-state token decisions. | Primitive rendering is blocked without signed visual and layout tokens. |
| 3 | `03-primitive` | Build the card-list select primitive with visible/hidden and priority variants, priority compaction, keyboard behavior, and rendered proof controls. | Requires signed Layer 2 token seams. |
| 4 | `04-pattern-contract` | Compose into form/body patterns only after primitive readiness. | Patterns must not render local card-list selection markup or rank behavior. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines stable interaction, variant behavior, priority compaction, accessibility responsibilities, and review dimensions while leaving visual, sizing, layout, glyph, and primitive-semantics decisions to later layers. |
