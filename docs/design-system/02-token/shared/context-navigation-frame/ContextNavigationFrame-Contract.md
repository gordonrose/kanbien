# Context Navigation Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `context-navigation` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/context-navigation-frame/ContextNavigationFrame-Contract.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Context navigation needs stable rail, bottom-bar, drawer-offset, and scroll-boundary values before primitives or patterns own the rendered navigation frame. |
| Token category | `layout` |
| Token job | Govern the reusable frame values that keep context navigation pinned to the shell, keep primary navigation scroll separate from utility actions, and keep the mobile bottom bar attached to the visual viewport bottom. |
| Non-goals | Destination data, item anatomy, active-state colors, icons, tooltip content, drawer payloads, More-menu behavior, component receptors, app routes, and app adoption. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/context-navigation-frame/contract.mjs` |
| Required roles or fields | `frameRole`, `desktopPositioningModel`, `mobilePositioningModel`, `desktopRailInlineSize`, `desktopRailTopOffset`, `desktopRailBottomOffset`, `desktopRailGapValue`, `desktopRailPaddingBlockValue`, `desktopRailPaddingInlineValue`, `desktopPrimaryScrollBehavior`, `utilityZoneAnchorBehavior`, `mobileBreakpoint`, `mobileBarBlockOffset`, `mobileBarInsetInlineStart`, `mobileBarInsetInlineEnd`, `mobileBarColumns`, `mobileBarPaddingBlockStart`, `mobileBarPaddingInline`, `mobileBarPaddingBlockEnd`, `mobilePageBottomReserve`, `mobileDrawerBottomOffset`, `mobileViewportPinningBehavior`, `mobileScrollBoundaryBehavior`, `surfaceValue`, `borderValue`, `shadowValue` |
| Cross-system consumer rule | Every design system must expose governed context-navigation frame values before primitives, patterns, or components own rail placement, primary-zone scrolling, bottom utility anchoring, mobile bottom-bar placement, drawer offsets, or scroll-boundary behavior. |

## Consumer Rules

- Consumers must import the governed runtime seam instead of hard-coding context rail widths, bottom-bar columns, bottom offsets, page-bottom reserve, drawer offsets, scroll containment, or viewport pinning behavior.
- Mobile context navigation must remain pinned to the visual viewport bottom and must not participate in document scroll or page-end overscroll.
- Desktop context navigation must keep the primary zone scrollable while the bottom utility zone remains anchored and visible.
- This token does not approve destination item anatomy, active-state treatment, More-menu behavior, drawer payload behavior, component seams, or app adoption.

## Review Dimensions

- Mobile scroll proof must verify the bottom bar remains pinned at scroll top, middle, and page bottom.
- Page content must remain reachable above the bottom bar and device inset.
- Mobile drawers must stop above the bottom bar.
- Desktop rail pressure must keep utility actions anchored while primary destinations scroll.
- RTL consumers must mirror the rail edge without changing inline sizes or bottom-bar behavior.
