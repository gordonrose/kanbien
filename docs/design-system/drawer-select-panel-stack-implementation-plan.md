# Drawer Select And Panel Stack Implementation Plan

This plan locks in the current implementation order for drawer select without
letting drawer select invent reusable panel, search, or selectable-card
behavior locally.

Drawer select is a future consumer of broader panel and selection foundations.
It must not own panel placement, side selection, stacked-panel behavior, search
field behavior, selectable-card visuals, or generic selected-summary cards when
those decisions can serve filter panels, status filters, count cards, display
drawers, and other panel-like surfaces.

## Source Material Posture

The following routes are source material and legacy inventory, not governed
runtime seams:

- `/design-system/tokens/search-panel`
- `/design-system/tokens/filter-panel-structure`
- `/design-system/tokens/count-card`
- `/design-system/components/drawer-select`
- `/design-system/canonicals/drawer-select`

Downstream work may use those routes to identify behavior and visual risks, but
must consume only promoted Layer 1-4 seams once implementation begins.

## Locked Architecture Decision

Panel placement and stacking are reusable behavior. Drawer select must consume
that foundation instead of defining left/right docking, flush stacking, mobile
overlay order, focus movement, or close behavior by itself.

Searchable selectable cards are reusable behavior. Drawer select, filter
panels, selected/not-selected panels, status count tabs, and future selection
surfaces should share the same lower-layer roots unless a real behavior
difference appears.

## Layer 1 First Pass

### `panel-stack`

Create a behavior rule for reusable stacked side panels.

It should define:

- panels can be positioned from the left edge or right edge
- panels can open additional panels beside themselves
- desktop panels stack flush with each other on screen
- mobile and narrow viewport panels overlay in stack order, with the panel
  furthest from the originating edge visually above the panel closest to the
  edge
- focus moves into a newly opened panel and returns to a stable origin when a
  panel closes
- close behavior for parent and child panels is deterministic
- keyboard users can enter, operate, close, and leave each panel without losing
  orientation
- layering does not rely on route-local z-index values

### `searchable-selection-panel`

Create a behavior rule for reusable searchable selection panels.

It should define:

- a search field filters available options without hiding selected options
  unexpectedly
- options may be grouped as selected and not selected when the consuming
  pattern requires it
- option labels and supporting text truncate with tooltip disclosure when
  constrained
- selected state is exposed without relying on color alone
- empty, no-match, disabled, and long-content states remain understandable
- single-select and multi-select differences are explicit rather than inferred

### `drawer-select`

Create drawer-select behavior only after the two foundations above are clear.

Drawer select should define:

- trigger opens a selection panel inside a governed panel-stack instance
- single-select and multi-select value semantics
- selected summary text and count semantics
- close, cancel, apply, and focus-return behavior
- mobile behavior using panel-stack overlay rules
- search behavior by consuming the searchable-selection-panel foundation

## Layer 2 Token Candidates

Prefer reuse before creating a new token.

Already likely reusable:

- `panel-frame`
- `panel-header-frame`
- `panel-corner-radius`
- `resize-handle`
- `scrollbar-skin`
- `button-frame`
- `icon-size`
- `choice-option-frame`
- `choice-group-layout`
- `choice-card-state-affordance`
- `label-text-style`
- `supporting-text-style`
- `field-value-text-style`
- `focus-ring`
- `minimum-target-size`
- `tooltip-surface`
- `tooltip-text-style`

Likely missing token seams:

- `panel-stack-layering`, or promotion of a broader `z-index-layering` token
- `panel-stack-placement`, if flush edge placement needs signed reusable
  geometry beyond existing panel-frame values
- `search-field-frame`, only if text-field tokens cannot honestly govern
  search input appearance
- `selection-panel-frame`, only if selected/available grouping needs reusable
  panel spacing or section surfaces
- `count-card-frame`, only if count cards are not covered by the same
  selectable-card frame values

Do not create these tokens until the Layer 1 behavior rules prove that the
value changes allowed behavior or prevents drift.

## Layer 3 Primitive Candidates

Already likely reusable:

- `icon-button-control`
- `panel-header-control`
- `scroll-region-control`
- `resize-handle-control`
- `truncating-label`
- `field-row-control`
- `field-container-control`
- `card-list-select`
- `simple-dropdown-control` for compact non-drawer single select only

Likely missing primitive seams:

- `panel-surface-control`, if no current primitive owns generic panel shell
  semantics, labelled region/dialog semantics, panel state, and token-backed
  surface values
- `panel-stack-control`, if stack placement, focus movement, overlay order, and
  close relationships need primitive-owned behavior before patterns compose
  panels
- `search-field-control`, if search input semantics need a narrower primitive
  than text-field-control
- `selectable-card-control` or a promoted card-list option primitive, if drawer
  select, filter panels, count cards, and status tabs share the same selectable
  card root
- `selected-summary-control`, if selected item summaries and selected-count
  cards need reusable behavior across drawer select and filter/status surfaces

## Layer 4 Pattern Candidates

Build patterns only after required primitives and tokens are consumable.

Recommended order:

1. `panel-stack`
2. `searchable-selection-panel`
3. `filter-panel` or `selection-panel`, depending on which source material
   proves the reusable composition first
4. `drawer-select`
5. `drawer-select-field`

Drawer select must not be promoted until it consumes the reusable panel-stack
and searchable-selection-panel foundations or records a specific reason those
foundations are not applicable.

## Review Evidence Required

Every rendered proof in this chain must show:

- left-side and right-side panel origins
- two or more stacked panels, flush on desktop
- mobile/narrow overlay order
- close behavior for parent and child panels
- focus movement and focus return
- RTL placement behavior
- desktop and mobile scroll behavior
- search with results, no results, and selected items preserved
- selected, deselected, disabled, empty, and long-label option states
- tooltip disclosure only when text is truncated
- dark and alternate theme variants where the selected design system supports
  them

## Current State

Move from completed reusable foundations into the searchable-selection-panel
pattern chain.

`panel-stack` now has review-ready Layer 1-4 artifacts:

- `docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md`
- `docs/design-system/02-token/shared/panel-stack-placement/PanelStackPlacement-Contract.md`
- `docs/design-system/03-primitive/shared/panel-surface-control/PanelSurfaceControl-Contract.md`
- `docs/design-system/04-pattern-contract/shared/panel-stack/PanelStack-Contract.md`

The next foundation behavior rule now exists at
`docs/design-system/01-behavior-rule/shared/searchable-selection-panel/SearchableSelectionPanel-Behaviour.md`.

The first searchable-selection primitive foundation now exists at
`docs/design-system/03-primitive/shared/search-field-control/SearchFieldControl-Contract.md`
and renders at `/design-system/default/primitives/search-field-control`.

Count-card behavior is now locked at
`docs/design-system/01-behavior-rule/shared/count-card/CountCard-Behaviour.md`.

Count-card frame values are now locked at
`docs/design-system/02-token/shared/count-card-frame/CountCardFrame-Contract.md`
and render at `/design-system/default/tokens/count-card-frame`.

Reusable warning colour is now locked at
`docs/design-system/02-token/shared/status-color/StatusColor-Contract.md`
and renders at `/design-system/default/tokens/status-color`.

The count-card primitive is now review-ready at
`docs/design-system/03-primitive/shared/count-card-control/CountCardControl-Contract.md`
and renders at `/design-system/default/primitives/count-card-control`.

The next valid step is Layer 4: create the reusable searchable-selection-panel
pattern contract and proof route that composes `panel-stack`,
`search-field-control`, and `count-card-control` without redefining their
behavior or token dependencies.
