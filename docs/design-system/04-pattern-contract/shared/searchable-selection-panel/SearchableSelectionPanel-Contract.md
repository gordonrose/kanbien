# Searchable Selection Panel Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `searchable-selection-panel` |
| Pattern name | `searchable-selection-panel` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/searchable-selection-panel/SearchableSelectionPanel-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/searchable-selection-panel/SearchableSelectionPanel-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/searchable-selection-panel/SearchableSelectionPanel-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/searchable-selection-panel/index.mjs#searchableSelectionPanelPattern` |
| Rendered proof | `/design-system/default/patterns/searchable-selection-panel` |

## Purpose

`searchable-selection-panel` composes governed search, option-list, and scroll
primitives into a reusable selection panel foundation.

It is intended for later drawer-select, filter-panel, display-setting, and
selection-panel work. It does not own drawer open/close behavior, apply/cancel
actions, route state, backend search, persistence, or app adoption.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Pattern Action |
| --- | --- | --- | --- | --- |
| Search text narrows available options while selected options remain understandable. | `04-pattern-contract` | `search-field-control`; behavior rule `searchable-selection-panel` | none | Compose the search primitive and filter the supplied option fixture. |
| Single and multi selection need distinct selection cardinality. | `04-pattern-contract` | `card-list-select` | none | Use the same selected/available card groups for both modes; single mode replaces the previous selected value instead of accumulating values. |
| Selected and available groups need spacing and scroll sizing. | `02-token` and `04-pattern-contract` | `body-region-frame`; `scroll-region-control` | none for current proof | Consume `body-region-frame` for gaps and frame values; use `scroll-region-control` for scroll ownership. |
| Loading, empty, no-match, and error messages need governed typography and foreground. | `02-token` and `04-pattern-contract` | `feedback-text-style` | none | Consume `feedback-text-style`; keep message timing and semantics pattern-owned. |
| Selected, available, and no-match counts may need visible summaries outside this panel. | `03-primitive` | `count-card-control` | none | Do not render count cards inside this panel; later trigger or filter-summary patterns may compose them. |
| Long labels and supporting text must disclose only when truncated. | `03-primitive` | child primitive text-disclosure behavior | none | Pass text to child primitives; do not implement local tooltip behavior. |
| Panel side, stacking, and mobile overlay order are needed by drawer select. | `04-pattern-contract` | `panel-stack` | none for this pattern | Declare dependency; do not define stacking here. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Primitive readiness source checked | `docs/design-system/03-primitive/primitive-readiness-index.md` |
| Required primitives consumable by selected systems | `yes` |
| Required direct tokens consumable by selected systems | `yes` |
| Pattern inventory checked | legacy `/design-system/tokens/search-panel`, `/design-system/tokens/filter-panel-structure`, `/design-system/components/drawer-select`, and `/design-system/canonicals/drawer-select` are source material only |

## Dependencies

Primitive dependencies:

- `search-field-control`
- `card-list-select`
- `scroll-region-control`

Direct token dependency:

- `body-region-frame`
- `background-color`
- `feedback-text-style`

`panel-stack` is a downstream composition dependency for drawer-like consumers,
not a child rendered by this pattern.

## Composition Contract

The pattern renders one labelled selection region containing:

- a governed search field
- a governed scroll region
- governed card-list groups for selected and available options in both `single`
  and `multi` modes

The pattern may filter supplied options by search query. In single mode, the
selected option remains in the selected group even when it does not match the
query. Selecting a second option in single mode replaces the previous selected
value rather than adding to it. In multi mode, selected options remain in the
selected group, and available options are filtered from the unselected set.

The pattern may expose proof-only query, count, width, direction, mobile-mode,
theme, and selection-mode controls on its proof route. These are review
controls, not app APIs.

## Composition Ledger

| Rendered Child | Allowed Category | Governed Seam Or Reason | Consumer Boundary |
| --- | --- | --- | --- |
| Root selection region | browser-native wrapper | Layer 4 owns composition only | Consumers must not copy proof markup. |
| Search input | governed primitive | `search-field-control` | Consumers must not rebuild search input semantics. |
| Option group | governed primitive | `card-list-select` | Consumers must not rebuild checkbox option cards or selection replacement behavior. |
| Scroll container | governed primitive | `scroll-region-control` | Consumers must not set local custom scrollbar styling. |
| Group labels | governed child primitive labels | `card-list-select` | Consumers must not restyle group copy locally. |

## Accessibility Contract

The root uses a labelled region. The search input has a real accessible label.
Option semantics come from the native checkbox behavior inside
`card-list-select`; the pattern constrains cardinality in single mode. The
scroll region must preserve keyboard reachability to every rendered option.

Search updates must not strand focus. Selecting or deselecting options must
emit child primitive events and a pattern-level `searchable-selection-panel:change`
event with the updated selected values. No-match, empty, loading, and error
states must be communicated as text, not only by color.

## Allowed States

| State | Required Behavior |
| --- | --- |
| `default` | Search and option controls are enabled. |
| `loading` | Search remains visible; options are represented by text status, not stale confirmed options. |
| `empty` | The panel communicates no supplied options. |
| `no-match` | The panel communicates that search found no available matches. |
| `error` | The panel communicates option loading/search failure and uses signed child error states. |

## Data Or Event Contract

The pattern accepts a proof/data shape of options with stable `value`, visible
`label`, optional `supportingText`, and optional `disabled`.

The runtime seam may emit `searchable-selection-panel:change` with:

- `selectionMode`
- `query`
- `selectedValue`
- `selectedValues`

It does not persist selection, call backend search, apply filters, or update
routes.

## Responsive Collapse Contract

| Mode | Visible Structure | Hidden Or Collapsed Items | Overlay Or Stack Rule | Minimum Size Or Ratio Source | Scroll Owner | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| desktop | search, selected group when relevant, available group | none | consumed later through `panel-stack` | `body-region-frame`; child primitives | `scroll-region-control` | proof route |
| narrow | same structure with child primitive column collapse | none | consumed later through `panel-stack` | `choice-group-layout`; `body-region-frame` | `scroll-region-control` | proof route |
| mobile | same panel content; containing stack may overlay it | none locally | `panel-stack` owns overlay | `body-region-frame`; `panel-stack` later | `scroll-region-control` or page scroll by selected mobile mode | proof route |

## Text Overflow Disclosure

| Text Area | Can Truncate? | Governing Primitive Or Proof | Browser Evidence | Consumer Boundary |
| --- | --- | --- | --- | --- |
| search label | yes | `search-field-control` label remains explicit; no tooltip required by this pattern | proof route | Do not hide accessible label. |
| option labels and supporting text | yes | `card-list-select` | proof route | Do not recreate tooltip behavior locally. |
| group labels | yes | `card-list-select` | proof route | Do not recreate tooltip behavior locally. |
| status text | may wrap | `feedback-text-style` | proof route | Use the signed feedback text token; do not truncate or restyle locally. |

## Visual-Skin Boundary

Design-system implementations may vary child primitive skins, `body-region-frame`
values, signed `background-color` surface values, and signed
`feedback-text-style` values. They must not change search behavior, checkbox
semantics, text-disclosure behavior, single-mode replacement behavior, selected
grouping meaning, scroll ownership, feedback semantics, or panel-stack
dependency.

## Runtime Pattern Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | render helper plus child-controller composition |
| Planned module | `src/frontend/designSystem/layers/04-pattern-contract/searchable-selection-panel/index.mjs` |
| Planned export | `searchableSelectionPanelPattern` |
| Seam must own | filtering supplied options, selected/available grouping, child primitive orchestration |
| Seam must not own | drawer trigger behavior, app value persistence, backend search, apply/cancel actions, unsigned visual values, or primitive reimplementation |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit proof for single and multi composition, selected preservation, single-mode replacement, and event forwarding. |
| accessibility | Browser proof for search label, native option semantics, keyboard selection, and no-match text. |
| primitive consumption | Unit proof must show child primitive data attributes. |
| token consumption | Unit proof must show direct `body-region-frame`, `background-color`, and `feedback-text-style` dependencies. |
| rendered verification | Desktop and mobile proof route must exercise mode, query, width, direction, theme, and long text. |
| text-disclosure audit | Browser proof must show child tooltip behavior only under constrained overflow. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/searchable-selection-panel` |
| Rendered view status | `available` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next pattern | `drawer-select` |
| Reason | Drawer select can now consume `panel-stack` plus `searchable-selection-panel` instead of inventing panel stacking or searchable selection locally. |
