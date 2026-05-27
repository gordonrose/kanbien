# Generic Design-System Promotion Ledger

Date: 2026-05-27

Branch: `codex/design-system-generic-promotions`

## Purpose

This note records the first generic-promotion pass for index-navigation work.
It exists to prevent a common drift failure: renaming an index-nav-specific
token, primitive, or pattern as generic before its behavior and lower-layer
dependencies are actually generic.

## Promotion Rule

A design-system item may be promoted to a pattern-agnostic name only when its
contract, runtime seam, token dependencies, rendered proof, and tests do not
depend on the original pattern except as the first consumer.

If a candidate still depends on an index-nav-specific token or behavior, keep
the current name and record the lower-layer blocker instead of forcing the
promotion.

## Candidate Review

| # | Candidate | Current source | Disposition | Reason |
| --- | --- | --- | --- | --- |
| 1 | `icon-button-control` | `index-nav-icon-button-control` | `promoted in this branch` | The primitive now consumes generic `button-frame`, `icon-size`, `focus-ring`, and `minimum-target-size`; index-nav is a consumer rather than the owner. |
| 2 | `text-action-button-control` | `index-nav-add-button-control` | `promoted in this branch` | The primitive now consumes generic `button-frame`, `label-text-style`, `focus-ring`, and `minimum-target-size`; add behavior remains consumer-owned. |
| 3 | `panel-header-control` | `index-nav-panel-header-control` | `partially unblocked` | The header now composes generic `icon-button-control`, but it still consumes `index-nav-panel-frame` for fixed height, separator, and sticky geometry. Promote only after a generic panel-header frame token exists. |
| 4 | `panel-frame` / `panel-surface` | `index-nav-panel-frame` | `blocked for split` | The token currently combines panel container, header, action frame, responsive width, and scroll geometry. Splitting is likely right, but each split needs its own Layer 2 contract and proof. Do not rename the combined token as generic. |
| 5 | `scrollbar-skin` | `index-nav-scrollbar-skin` concept | `promoted in this branch` | Scrollbar visual skin is pattern-agnostic and now has a generic Layer 2 token. Pattern-specific height and scroll ownership remain outside the token. |
| 6 | `scroll-region-control` | `index-nav-scroll-region-control` concept | `promoted in this branch` | Scrollable-region behavior is pattern-agnostic. The primitive consumes generic scrollbar skin and receives pattern-specific max height from the consuming pattern token. |
| 7 | `truncating-label` | `truncating-label` | `already generic` | The accepted primitive already governs text overflow disclosure without index-nav dependencies. |
| 8 | `supporting-text-style` | `index-nav-item-supporting-text-style` | `promoted in this branch` | The typography contract is pattern-agnostic compact secondary text. The index-nav item primitive now consumes the generic token rather than owning an index-nav-specific duplicate. |
| 9 | `selectable-item-surface` | `index-nav-item-surface` | `blocked` | The state set looks reusable, but the token currently names index-nav item semantics and has index-navigation-specific use restrictions. Promote only after a generic selectable-item behavior rule decides whether current, selected, disabled, and hover map the same way outside index navigation. |
| 10 | `selection-indicator` / `current-indicator` | `index-nav-item-current-indicator` | `blocked` | The marker is tied to `aria-current` ownership in index-nav item control. A generic indicator needs a behavior decision for current versus selected versus active before promotion. |

## Current Safe Work Order

1. Keep the branch on one workbranch.
2. Finish and verify generic `scrollbar-skin` and `scroll-region-control`.
3. Keep `supporting-text-style` as the single Layer 2 source for compact
   secondary text.
4. Add `button-frame` as the generic Layer 2 source for reusable button frame
   visuals before promoting icon-button or text-action button primitives.
4. Leave icon button, text button, panel header, panel frame, selectable item
   surface, and current indicator scoped until their lower-layer generic
   dependencies exist.

## Audit Expectation

Each promotion must leave one construction source of truth. A downstream
index-nav consumer may use a generic runtime seam, but must not keep a local
index-nav alias that can drift from the generic source.

## 2026-05-27 Follow-Up

`button-frame` has been added as a generic Layer 2 token in this branch. It
unblocks the next Layer 3 pass for generic icon-button and text-action button
primitives, but those primitive promotions are not complete until their runtime
seams consume `button-frame` directly and their old index-nav-specific frame
dependency is removed.

The Layer 3 pass promoted `icon-button-control` and
`text-action-button-control` and removed the old index-nav-specific button
primitive seams. `index-nav-panel-header-control` now composes
`icon-button-control`, but remains family-scoped until a generic panel-header
frame token exists.
