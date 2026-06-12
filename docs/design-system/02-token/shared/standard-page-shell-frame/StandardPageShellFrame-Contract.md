# Standard Page Shell Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `standard-page-shell` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/standard-page-shell/StandardPageShell-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/standard-page-shell-frame/StandardPageShellFrame-Contract.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Standard page shells need stable chrome placement, layer ordering, rail/panel sizing, mobile shell insets, and safe-area behavior before primitives or patterns own markup. |
| Token category | `layout` |
| Token job | Govern the reusable frame values that keep the top nav, sub nav, context nav rail, context drawers, and page body from colliding across desktop, mobile, RTL, zoom, and overlay states. |
| Non-goals | Top-nav item anatomy, breadcrumb semantics, search behavior, context-nav item states, tools-nav action semantics, bottom interaction bars, app routes, and component APIs. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/standard-page-shell-frame/contract.mjs` |
| Required roles or fields | `frameRole`, `topNavLayer`, `subNavLayer`, `contextNavLayer`, `contextNavDrawerLayer`, `contextNavMenuLayer`, `tooltipLayer`, `topNavPaddingBlockValue`, `topNavPaddingInlineValue`, `topNavGapValue`, `subNavPaddingBlockValue`, `subNavPaddingInlineValue`, `subNavGapValue`, `subNavSearchMaxInlineSize`, `mobileBreakpoint`, `contextRailInlineSize`, `contextRailItemSize`, `contextRailGapValue`, `contextRailPaddingBlockValue`, `contextRailPaddingInlineValue`, `mobileContextBarOffset`, `mobileShellPagePaddingBottom`, `sidePanelInlineSize`, `secondarySidePanelInlineStart`, `mobileContextBarColumns`, `mobileContextBarPinning`, `surfaceTopNav`, `surfaceSubNav`, `surfaceContextNav`, `borderValue` |
| Cross-system consumer rule | Every design system must expose a governed shell-frame token before reusable shell primitives, page-shell patterns, or components own shell chrome placement, shell layer ordering, rail sizing, drawer placement, or mobile safe-area insets. |

## Consumer Rules

- Consumers must import the governed runtime seam instead of hard-coding shell z-indexes, rail widths, drawer offsets, shell padding, search max width, mobile context-bar columns, or mobile page-bottom inset values.
- This token does not approve child navigation anatomy, item states, profile menus, breadcrumb behavior, search behavior, tools-nav content, bottom page interaction bars, component seams, or app adoption.
- Tools navigation remains a standard-shell child family, but its concrete sizing and placement values must be governed by a later tools-navigation token when reference truth exists.
- Later primitives and patterns may derive placement from this token, but tactile behavior such as drawers, menus, collapse, focus restoration, and resize must be defined in their owning layers.
- The mobile context-navigation bar must remain pinned to the visual viewport bottom and must not participate in document scroll; the context-navigation child token owns the concrete scroll-boundary proof.

## Review Dimensions

- Layer order must keep shell chrome, context drawers, menus, and tooltips predictable without arbitrary local z-indexes.
- Mobile values must preserve reachable page content above safe-area and bottom context navigation.
- Mobile scroll proof must verify the bottom context-navigation bar remains pinned at page top, middle, and bottom once context-navigation primitives or patterns own the rendered bar.
- Desktop values must keep context rail and side panels from covering the main shell unexpectedly.
- RTL consumers must preserve the same inline-size and offset contract while mirroring the rail edge in the owning primitive or pattern.
- Zoom and reduced-width consumers must preserve the signed shell insets instead of replacing them with page-local CSS.
