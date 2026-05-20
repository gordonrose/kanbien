# Entity Management Page Outer Page Reference Pack

## Purpose

Define the outer-page reference states for the `entity_management_page`
template. Review this pack when inspecting canonical renderings for shell
ownership, page framing, desktop/mobile scroll ownership, and app-consumable
page boundaries.

## Scope

- Family:
  `entity-management-page`
- Child matrix:
  outer page contract
- Status:
  review-candidate reference pack
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/entity-management-page-outer-page-behavior-lock.md`
- Parent index:
  `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md`

## Reference State IDs

Use prefix `EMPO-*`.

| Ref ID | State | Route / setup | Why it exists | Evidence status |
| --- | --- | --- | --- | --- |
| `EMPO-001` | Desktop shell baseline | Desktop, normal theme, initial Identity | Proves real shell chrome, route framing, page header, and drawer-as-page-body posture. | partially covered |
| `EMPO-002` | Desktop dark shell baseline | Desktop, dark theme, initial Identity | Proves theme-scoped shell and template surfaces remain readable. | needs evidence |
| `EMPO-003` | Desktop desert/alternate theme baseline | Desktop, alternate supported theme | Proves the template is not a one-theme-only composition. | needs evidence |
| `EMPO-004` | Desktop constrained height | Desktop, reduced height, Identity detail content | Proves desktop internal vertical scroll and stable shell framing. | partially covered |
| `EMPO-005` | Desktop wide viewport | Wide desktop, initial Identity | Proves the page does not over-expand text or lose readable detail width. | needs evidence |
| `EMPO-006` | Desktop narrow-but-not-mobile | Tablet/medium width before mobile breakpoint | Proves transitional layout before the mobile selector/carousel state. | needs evidence |
| `EMPO-007` | Mobile initial shell | 390px mobile, initial Identity | Proves mobile shell, top menus, bottom nav, and page body baseline. | partially covered |
| `EMPO-008` | Mobile page-level scroll | 390px mobile with long detail content | Proves vertical scroll belongs to the page and not a nested drawer. | covered |
| `EMPO-009` | Mobile short viewport | Mobile width, short height, top menus visible | Proves top menus do not consume all usable content area and page remains scrollable. | needs evidence |
| `EMPO-010` | Mobile bottom nav reachability | Mobile, long page content, scroll near bottom | Proves bottom nav remains reachable without trapping content underneath it. | partially covered |
| `EMPO-011` | Mobile landscape | Mobile landscape dimensions | Proves orientation does not break page scroll or shell framing. | needs evidence |
| `EMPO-012` | Drawer-as-page-body close affordance | Desktop and mobile, initial route | Proves selected-record close and active group summary stay hidden for this page template. | partially covered |
| `EMPO-013` | Empty-region app-data posture | App-like fixture with optional region omitted | Proves no empty placeholder chrome appears for missing region data. | needs fixture |
| `EMPO-014` | Outer framing app-consumer parity | First app consumer route once available | Proves app consumes signed-off outer framing rather than copying inner CSS only. | blocked-for-adoption |
| `EMPO-015` | Route reload/restoration baseline | Reload after default route open | Proves initial selected region and lazy footprint remain stable after reload. | needs evidence |
| `EMPO-016` | Browser back/forward posture | Navigate away/back to template | Proves route-level state does not leave drawers or overlays in broken posture. | needs evidence |

## High-Risk Batch

Review first:

- `EMPO-001`
- `EMPO-004`
- `EMPO-007`
- `EMPO-008`
- `EMPO-009`
- `EMPO-010`
- `EMPO-014`

## Required Pressure States

- mobile short viewport
- mobile long content
- desktop constrained height
- alternate themes
- first app consumer parity

