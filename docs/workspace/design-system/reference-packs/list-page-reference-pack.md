# List Page Reference Pack

## Purpose

Freeze the current `List Page` template baseline so child-component extraction
can happen against a named parent reference instead of against loose route
memory.

This pack is more concrete than the behavior lock and narrower than a full
component family. It records the parent pattern states the first extraction
must preserve.

## Scope

- Family:
  `list-page`
- Status:
  signed-off parent reference baseline
- Current source surface:
  `/design-system/templates/list-page`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related template artifact:
  `docs/workspace/design-system/templates/list-page-template.md`
- First child component:
  `docs/workspace/design-system/components/list-record-card-component.md`
- Existing executable verification:
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`

## Signed-Off Rule Source

This pack inherits the approved parent rules from `LP-001` through `LP-047`
in `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`.

Those behavior locks remain the rule source.
This pack turns them into named reference targets for extraction.

## Current Surface Truth

- the route label is `Pages` while the route path remains
  `/design-system/templates`
- the `List Page` sits under the existing page-template family beside:
  - `Page Shell`
  - `Table Page`
- the current page uses:
  - the signed-off `ListRecordCard`, `ListDetailPanel`, and
    `ListDetailSplitLayout` seam shapes as the parent composition baseline
  - a repeated list-card column
  - a closable detail surface
  - desktop pushed detail placement
  - browser-owned page scrolling for the closed desktop list state
  - mobile full-sheet overlay placement
  - an independently scrollable list column on desktop when the split detail
    lane is open
  - an internally scrollable detail content region
  - seeded placeholder growth plus scroll-triggered lazy loading for larger
    list review states
  - a governed list-region loading treatment for slow hydration and append
    loading
  - a distinct empty-state surface with neutral recovery
  - a distinct no-results surface driven by the page search query with clear
    search recovery
  - a governed live search/filter path that closes stale detail and returns
    focus to search when the active record falls out of the visible result set
  - a governed missing-attributes preview that uses `Untitled record` for
    missing primary identity and omits missing secondary fields
  - a governed long-attributes preview that truncates compact list fields and
    detail metadata with shared-tooltip recovery while keeping drawer identity
    and body content wrapped
  - governed initial-load, append-load, and local detail error states with
    scoped retry paths
  - a lightweight inline load-more treatment that turns the existing lazy-load
    status line into a clickable link-style action while more items remain
  - continued boundary loading through drawer footer `Next`, with the inline
    status link still available as a low-profile list-region affordance when
    needed
  - placeholder record actions in the detail header beside the close control
  - footer-based sequential drawer navigation for record traversal
- the detail panel starts closed on load
- item selection currently drives all detail content through HTML dataset values
- the runtime interaction loads through an external module because inline
  script is blocked by the active CSP
- the current prototype does not yet have dedicated rendered reference states
  for:
  - explicit RTL review captures
  - explicit WCAG 2.2 AA-focused verification captures beyond the current
    interaction semantics and keyboard-capable controls

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `LPR-001` | `/design-system/templates/list-page` | Desktop default closed state | Preserves the parent baseline before any item is selected | covered-by-test | Detail panel hidden and split layout not yet expanded |
| `LPR-002` | `/design-system/templates/list-page` | Desktop open state after selecting the first card | Preserves the pushed two-column master-detail behavior | covered-by-test | First card uses field-label mapping copy |
| `LPR-003` | `/design-system/templates/list-page` | Desktop re-closed state after using the detail close control | Preserves the explicit close loop and active-state reset | covered-by-test | Current Playwright test closes via the `x` button |
| `LPR-004` | `/design-system/templates/list-page` | Mobile overlay state after selecting a card | Preserves the full-sheet detail overlay behavior on narrow widths | covered-by-test | Also protects the shell-relative stacking model |
| `LPR-005` | `/design-system/templates/list-page` | Mobile overlay layering beneath shell menus and the design drawer | Preserves the governed shell stack under the highest-risk narrow-width state | covered-by-test | Existing test checks panel z-index against shell surfaces |
| `LPR-006` | `/design-system/templates/list-page` | Desktop constrained-height state with independent list and detail scrolling | Preserves the split view as two separate vertical reading lanes instead of one shared page scroll | covered-by-test | Current Playwright test verifies both list and detail containers scroll independently |
| `LPR-007` | `/design-system/templates/list-page` | Desktop list growth after scrolling near the bottom | Preserves the parent lazy-load contract for larger placeholder catalogs | covered-by-test | Current Playwright test verifies additional cards append after list-column scrolling |
| `LPR-008` | `/design-system/templates/list-page?listLoading=initial` | Initial list hydration loading state | Preserves the governed slow-load preview state for the list region without blocking the full shell | covered-by-test | Current Playwright test verifies skeleton loading appears before list items are revealed |
| `LPR-009` | `/design-system/templates/list-page` | Desktop open detail state with header actions and footer navigation visible | Preserves the calmer control zoning where lightweight record actions stay in the header and sequential traversal lives in the drawer footer | covered-by-test | Current Playwright flow opens the drawer and exercises footer `Previous` and `Next` navigation |
| `LPR-010` | `/design-system/templates/list-page` | Drawer footer `Next` pressed while the current record is the last visible item but more items can still load | Preserves the governed boundary behavior where footer navigation triggers lazy loading instead of acting like a false end of list | covered-by-test | Current Playwright coverage verifies `Next` causes additional records to load at the visible boundary |
| `LPR-011` | `/design-system/templates/list-page` | Drawer footer `Next` at the true end of the fully loaded list | Preserves the terminal traversal contract where `Next` disables and communicates `Last item` instead of silently failing | runtime-probed | Current source includes the disabled final-state rule and tooltip anchor, but the automated suite currently prioritizes the more stable boundary-load contract over a strict tooltip-edge assertion |
| `LPR-012` | `/design-system/templates/list-page?dir=rtl` | RTL desktop closed and open states | Preserves the parent requirement that the master-detail reading model, card alignment, tag flow, and detail reading order mirror natively in RTL rather than staying LTR-shaped | covered-by-test | Current Playwright coverage verifies `dir=rtl`, mirrored desktop split placement, and logical-start card posture in the live template |
| `LPR-013` | `/design-system/templates/list-page` | Keyboard-only traversal, focus transfer, and visible focus state | Preserves the WCAG 2.2 AA-relevant expectation that users can reach list cards, open detail, receive deterministic focus movement, and perceive focus without hover dependence | covered-by-test | Current Playwright coverage verifies keyboard open, focus transfer to the detail title, `Escape` close, and focus return to the originating list card |
| `LPR-014` | `/design-system/templates/list-page` | Semantic and accessible-name state | Preserves the parent requirement for button semantics, labelled detail region, and explicit close-control naming for assistive technology orientation | source-inspected | Current source uses button cards with `aria-pressed`, `aria-controls`, a labelled detail panel, and an explicitly named close control |
| `LPR-015` | `/design-system/templates/list-page?listState=long-attributes&zoom=100` | Magnified and long-content reading pressure state | Preserves the WCAG-related requirement that longer labels, longer drawer copy, and zoomed viewing do not break independent scrolling or clip important controls | covered-by-test | Current Playwright coverage verifies the shared magnification control applies, the split layout remains readable, the detail body keeps a minimum readable lane, and footer controls remain recoverable through detail-surface scrolling under long-content pressure |
| `LPR-016` | `/design-system/templates/list-page?listState=missing-attributes` | Missing primary identity and missing secondary attribute rendering state | Preserves the graceful-degradation contract when title, subtitle, tags, or supporting fields are absent so the page uses approved fallback or omission behavior instead of showing broken values | covered-by-test | Current Playwright coverage verifies `Untitled record` fallback plus omission of missing subtitle, metadata, tags, and body content in the governed preview |
| `LPR-017` | `/design-system/templates/list-page?listState=empty` | Empty list state with no available records plus neutral recovery affordance | Preserves the parent rule that a truly empty catalog shows an explicit in-region empty state instead of a blank column or silent failure impression | covered-by-test | Current Playwright coverage verifies the empty-state surface and its neutral recovery action back to the placeholder list |
| `LPR-018` | `/design-system/templates/list-page?q=no-results` | No-search-results state after a user query returns nothing | Preserves the distinction between “there is no data yet” and “this search produced no matches” so the list region communicates the reason honestly | covered-by-test | Current Playwright coverage drives the live page search field to `q=no-results` and verifies the clear-search recovery path |
| `LPR-019` | `/design-system/templates/list-page?listState=long-attributes` | Long-attribute truncation, wrapping, and tooltip recovery state | Preserves the governed overflow rule for attributes that cannot fit cleanly in the list or detail header without breaking geometry | covered-by-test | Current Playwright coverage verifies tooltip recovery on truncated list title, tag, and detail metadata, while drawer title and body remain in wrapped reading mode |
| `LPR-020` | `/design-system/templates/list-page` | Mobile overlay focus-contained state | Preserves the parent rule that the full-sheet mobile drawer behaves like a modal focus context while open | covered-by-test | Current Playwright coverage verifies dialog semantics in mobile overlay mode and wraparound `Tab` behavior that keeps focus inside the drawer |
| `LPR-021` | `/design-system/templates/list-page` | Dynamic live-region announcement state for detail open, lazy-load append, and no-results feedback | Preserves the parent requirement for polite assistive announcements when the page changes state without a full navigation | covered-by-test | Current Playwright coverage verifies the dedicated status region announces detail open, additional list items loaded, and governed no-results feedback |
| `LPR-022` | `/design-system/templates/list-page` | Selected-item invalidation after search or filter removes the active record | Preserves the parent rule that the drawer closes and focus returns appropriately when the active record no longer belongs to the visible list | covered-by-test | Current Playwright coverage opens a record, applies a search that removes it from the visible results, then verifies the drawer closes and focus returns to the page search field |
| `LPR-023` | `/design-system/templates/list-page` | Stable selection during lazy-load append | Preserves the rule that appending more items must not disturb the currently selected record | partially-covered | Current behavior does not intentionally disturb selection during append, but the suite does not yet isolate this as its own dedicated governed reference state |
| `LPR-024` | `/design-system/templates/list-page?listLoadError=initial` | Initial list-load failure with in-region retry | Preserves the parent error posture where the list surface fails locally without collapsing the full page shell | covered-by-test | Current Playwright coverage verifies the in-region initial error surface and retry path back to the list |
| `LPR-025` | `/design-system/templates/list-page?listLoadError=append` | Append-load failure with inline boundary retry and existing items preserved | Preserves the governed lazy-load error state without discarding already loaded list content | covered-by-test | Current Playwright coverage verifies inline append failure, preserved loaded items, and successful retry from the same boundary seam |
| `LPR-026` | `/design-system/templates/list-page?detailError=1` | Detail-surface local error or degraded-content state while drawer remains open | Preserves the rule that detail failure is handled inside the drawer rather than by collapsing the parent master-detail layout | covered-by-test | Current Playwright coverage verifies the drawer stays open, shows local error treatment, and restores detail content on retry |
| `LPR-027` | `/design-system/templates/list-page` | Simple drawer footer navigation with `Previous` and `Next` only | Preserves the reviewed decision to keep footer traversal light rather than adding extra positional chrome | covered-by-test | Current Playwright coverage verifies the footer keeps the simpler previous/next treatment during normal traversal and boundary-triggered lazy-load growth |
| `LPR-028` | `/design-system/templates/list-page?dir=rtl` | RTL drawer-control mirroring including footer nav order and header action placement | Preserves the extended RTL contract for sequential navigation and control placement, not only outer layout mirroring | covered-by-test | Current Playwright coverage verifies the mirrored header action cluster and footer nav order in RTL |
| `LPR-029` | `/design-system/templates/list-page` | Inline load-more status link for no-scroll geometry and split-drawer review | Preserves the lazy-load contract when zoom or exact-fit geometry removes the scrollbar that would normally trigger append loading without adding separate fallback chrome | covered-by-test | Current Playwright coverage forces a no-scroll geometry state, verifies the status line remains a usable load-more link, and separately verifies the same low-profile action remains usable with the side drawer open |

## Extraction Guardrails

- Child seams must preserve the `LPR-*` states unless a later review explicitly
  replaces them.
- The first extraction should lift repeated card anatomy and card-level
  interaction hooks first.
- The parent page shell, split layout, and detail panel contract should stay
  documented at the template level until a second governed consumer clarifies
  their shared API.

## Parity Rule

A future child component extracted from this page matches the parent reference
only when:

- the `LPR-*` states still render honestly
- the child seam documents what it owns versus what remains parent-owned
- the current Playwright coverage still passes or is intentionally replaced by
  stronger equivalent proof
- any `not-yet-implemented`, `not-yet-captured`, or `partially-covered`
  reference states are either resolved or carried forward honestly in the next
  governed artifact instead of being silently dropped

## Exit Condition

This pack becomes operational once the first child component artifact and its
verification note both reference the `LPR-*` parent states directly.
