# Entity Management Page Outer Page Behavior Lock

## Purpose

Capture the outer page behavior for the `entity_management_page` template before
it becomes an app-consumable design-system seam.

This slice owns page framing, shell ownership, desktop/mobile layout, scroll
ownership, and the boundary between template-demo behavior and reusable app
seam behavior.

## Scope

- Family:
  `entity-management-page`
- Slice:
  outer page contract
- Current design-system route:
  `/design-system/templates/entity_management_page`
- Source:
  `src/frontend/designSystem/assets/entityManagementPage.mjs`
- Host shell:
  record-management list-centric template over the chat-workspace drawer shell
- Status:
  review-candidate

## Behavior Review

| ID | Behavior statement | Status | Current evidence / note |
| --- | --- | --- | --- |
| `EMP-OUTER-001` | The template must render inside the real design-system shell chrome rather than a local standalone mock shell. | `review-candidate` | Current route uses the design-system shell and record-management template mount. |
| `EMP-OUTER-002` | The entity page reuses the selected-record drawer as the page body; normal selected-record close affordance and group summary are hidden for this template. | `review-candidate` | Visual test asserts the list drawer is visible, close button hidden, and active group summary hidden. |
| `EMP-OUTER-003` | The page header identifies the current entity context with entity family, selected entity name, operational category, and readiness badge. | `review-candidate` | Current demo displays `Organizations`, `Northstar Operations`, `Operations`, and `Ready`. |
| `EMP-OUTER-004` | Desktop layout keeps the entity template as one full-height operating surface with region navigation, nested list, detail content, and optional evidence/AI panel. | `review-candidate` | Desktop tests cover region index, drawer reuse, nested layout, and evidence split. |
| `EMP-OUTER-005` | Desktop internal vertical scroll is allowed for long region and nested detail content so the shell remains stable. | `review-candidate` | Desktop test checks the identity nested detail drawer has `overflow-y: auto` and scrolls at constrained height. |
| `EMP-OUTER-006` | Mobile vertical scroll belongs to the whole page/document, not to the nested detail drawer or intermediate shell containers. | `approved-input` | User explicitly approved page-level mobile scroll. Visual test now expects template/frame/shell/panel/drawer/nested drawer `overflow-y: visible` and document scroll height greater than viewport. |
| `EMP-OUTER-007` | Mobile must preserve bottom navigation reachability while allowing the full page content to scroll behind/above it. | `review-candidate` | Current CSS preserves the bottom nav; browser check showed document-level scroll with the bottom nav fixed near the viewport bottom. |
| `EMP-OUTER-008` | Mobile must not trap long content in a small internal scroller below the top menus, because that makes the page unusable once shell chrome consumes the viewport. | `approved-input` | User explicitly called this out; the nested drawer now expands to content height on mobile. |
| `EMP-OUTER-009` | Evidence and AI views may change the page body layout, but they must not permanently alter the selected region or nested item state when closed. | `review-candidate` | Current implementation toggles evidence/AI dataset states and removes panels on close. Needs focused regression coverage. |
| `EMP-OUTER-010` | The app-consumable seam must preserve the signed-off outer framing, not only the inner field CSS. | `review-candidate` | Repo app-adoption rules require design-system-owned render/controller seams. First app consumer must not reconstruct local HTML. |
| `EMP-OUTER-011` | The current Organization demo fixture is not itself the reusable seam contract. | `review-candidate` | Current module still contains demo data and render behavior together; app adoption remains blocked until fixture and seam API boundaries are separated. |
| `EMP-OUTER-012` | Empty real-app region chrome should not render unless the entity definition has eligible content for that region. | `review-candidate` | Inherits record-management template no-empty-chrome rule. Current entity demo renders all current entity-definition regions. |

## Open Review Questions

- Should desktop keep internal scrolling for all nested detail drawers, or only
  for regions with very long generated forms?
- Should the mobile bottom nav remain fixed for this template, or become part
  of the page flow for very tall generated screens?
- Which outer shell pieces are mandatory for app consumers, and which are
  design-system demo chrome only?

## Adoption Blockers

- Demo data must be separated from reusable render/behavior code.
- The seam needs an explicit public API for app adoption.
- The first app consumer must consume the design-system-owned seam rather than
  copying the route markup or controller behavior.

