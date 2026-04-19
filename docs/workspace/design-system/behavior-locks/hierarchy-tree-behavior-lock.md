# Hierarchy Tree Behavior Lock

## Purpose

Lock the approved behavior rules for the `hierarchy-tree` pattern family before
creating a dedicated reference pack, canonical review set, or downstream app
adoption.

This artifact governs the hierarchy tree itself: row anatomy, hierarchy rules,
selection model, editing posture, movement, deletion choices, and responsive
behavior specific to the tree family.

Shell-attached launcher and drawer-shell rules stay governed by:

- `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
- `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
- `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`

Do not duplicate broader shell attachment, display-settings payload, or
context-nav chrome rules here unless the tree family needs to reference them
directly.

## Review Status Legend

- `approved`:
  behavior should be preserved in the hierarchy-tree reference pack and later
  canonicals
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior still needs iteration before being locked

## Scope

- Family:
  `hierarchy-tree`
- Review outcome:
  first approved family behavior lock after signed-off live prototype review
- Current source surface:
  `/design-system/patterns/hierarchy-tree`
- Related host contracts:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`
- Related downstream artifacts:
  `docs/workspace/design-system/reference-packs/hierarchy-tree-reference-pack.md`
  `docs/workspace/design-system/verification/hierarchy-tree-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `HT-001` | `Hierarchy Tree` must be governed as its own pattern family rather than as incidental page-local navigation inside one host route. | Keeps the family reusable and prevents the approved interaction model from being treated as throwaway route-specific chrome. | The current signed-off prototype lives at `/design-system/patterns/hierarchy-tree` and is being promoted into the design-system chain as a governed family. | `approved` | Ready to sign off and proceed with the design-system loop. |
| `HT-002` | The family must be adaptable across sidebar, full-page management, and drawer-hosted use, while allowing one governed source surface to prove the family honestly before every host posture is separately productized. | Protects the broader family intent without forcing each future host to reinvent the core tree interaction model. | The approved prototype proves the family first in a drawer-hosted shell-attached posture over a background page, while the family direction remains adaptable. | `approved` | Treat this as an adaptable pattern, not a one-host component. |
| `HT-003` | Shell launchers, shell attachment, and display-settings payload controls are inherited concerns, while the tree family itself owns row behavior, hierarchy manipulation, and tree-state feedback. | Keeps ownership boundaries clean so the tree does not accidentally absorb `context-nav drawer` or `display settings` behavior. | The current route launches the tree from governed shell controls and keeps display settings in a separate governed drawer while the tree owns only the hierarchy surface itself. | `approved` | Keep the tree focused on the hierarchy surface, not all surrounding shell controls. |
| `HT-004` | The tree must preserve a hybrid editing posture: lightweight edits such as rename and new-page creation happen inline, while structural or risky actions stay behind row menus. | Balances speed with restraint and matches the approved Confluence-like editing feel without becoming visually noisy. | The current route supports inline rename plus inline new-page drafts, while move and delete alternatives remain menu-driven. | `approved` | Hybrid works. |
| `HT-005` | A row must preserve a single-line practical reading model: expander, title, compact state markers, and row menu should fit as one row per item instead of turning each page into a stacked card. | Keeps the family calm and navigable, especially when the hierarchy grows deep. | The signed-off prototype removed row status pills and compressed the row to a single practical line with lighter metadata. | `approved` | One row per item max; much less loud. |
| `HT-006` | Tree rows should show title, expand or collapse affordance, current or selected indicators, changed state, and row menu access, while lifecycle status should not occupy the primary row surface in v1. | Preserves the approved row density and prevents status noise from overwhelming the navigation model. | The current implementation keeps `Current`, `Selected`, and `Changed` as compact row markers while removing page status from row display. | `approved` | Keep title, expander, current or selected, and changed; remove page status. |
| `HT-007` | The family must distinguish one `current/open` page from one separately `selected` row, and those states may diverge without confusing the action target. | Supports structural editing without forcing the user to leave the page they are currently viewing. | The approved prototype keeps actions targeted to the selected row while the background page remains tied to the current page. | `approved` | Use separate current and selected states. |
| `HT-008` | Single click should select a row, while double click should enter inline rename for that row rather than opening the page. | Makes selection and editing feel direct while avoiding accidental navigation during hierarchy management. | The current route now uses single-click selection and double-click rename after the live review iteration. | `approved` | Double click should prompt rename UI. |
| `HT-009` | Any page may become a parent by adding a child beneath it; the family should not require a separate container-only page type in v1. | Keeps the hierarchy model flexible and simple for the first governed family pass. | The current tree allows any node to receive child pages and expand into a parent when children exist. | `approved` | Any page can become a parent. |
| `HT-010` | The family should not impose a hard maximum depth or child-count limit in the pattern contract, but deep nesting must remain visually survivable through restrained indentation rather than ever-growing offsets. | Preserves the flexible information architecture model without letting deep branches become unusably squashed. | The current prototype allows arbitrary nesting and uses a compressed indentation rule at deeper levels instead of scaling indentation linearly forever. | `approved` | No max depth; unlimited children; reduce aggressive indentation for deep levels. |
| `HT-011` | Protected root nodes must remain visible as the initial scaffold and may not be moved or deleted through normal tree actions. | Keeps foundational sections stable and gives the tree a durable starting frame. | The signed-off route keeps top-level roots protected and always visible even when other expansion state is collapsed. | `approved` | Protected or root nodes exist and cannot be moved or deleted. |
| `HT-012` | Expansion state should remember the user’s last open or closed structure when available; when no stored state exists, the tree should start collapsed except for protected or root scaffolding. | Prevents large trees from feeling noisy on first load while still respecting established user context on return. | The current implementation stores expanded state and falls back to a collapsed tree with protected roots visible. | `approved` | Remember last state; otherwise collapse except protected or root sections. |
| `HT-013` | Desktop should use drag-and-drop as the primary reordering path, with menu actions as fallback movement controls; mobile should disable drag-and-drop and rely on menu-only structural actions. | Keeps structural editing efficient on desktop without forcing a fragile drag model onto touch layouts. | The current route supports desktop drag-and-drop plus menu fallback and switches mobile to menu-only structural edits. | `approved` | Drag on desktop, action menu only on mobile. |
| `HT-014` | Deleting a node with children must never be silent: the user must explicitly choose to delete the subtree, move children, or orphan children. | Prevents destructive ambiguity and records the family’s explicit deletion contract. | The current delete dialog offers `delete subtree`, `move children up`, and `orphan children at root` choices before deletion completes. | `approved` | Delete should be a decision: delete, move, or orphan. |
| `HT-015` | Post-action behavior must preserve orientation: newly created pages should become selected and open immediately, renamed and moved pages should stay selected, and moved pages should auto-expand their new parent. | Keeps the tree from feeling jumpy and supports fast successive authoring actions. | The approved prototype keeps newly created nodes selected and open, keeps moved nodes selected, and expands destination parents after moves. | `approved` | Yes to all: keep context stable after create, rename, move, and delete. |
| `HT-016` | After deletion, selection should fall back predictably to a nearby valid row, preferring the parent when possible before dropping to a nearest visible alternative. | Prevents the tree from losing orientation after a destructive action. | The current runtime falls back to the parent when present, then the nearest available visible neighbor. | `approved` | Delete should return focus and selection predictably. |
| `HT-017` | `Changed` should mean any material change to the page or its position in the hierarchy, and it should be treated as the v1 row-change signal instead of a per-user unread model. | Simplifies the first pattern pass and keeps the state meaningful for structural editing. | The signed-off prototype uses `Changed` only and treats both content and hierarchy edits as eligible change triggers. | `approved` | Use changed instead of unread; any change counts. |
| `HT-018` | Lifecycle status should remain compatible with the page shell builder status model even if row display suppresses status in v1. | Preserves future integration with existing page-shell planning flows without forcing that status noise into the row surface today. | The current data model still uses `draft`, `ready_for_export`, `exported`, and `superseded`, aligned to the page-shell builder family. | `approved` | Statuses should match the page shell builder, even though the row itself is quieter now. |
| `HT-019` | The hierarchy drawer should be horizontally resizable on desktop, bounded by a mobile-safe minimum and a full-page-safe maximum, and the underlying preview page should reflow cleanly as the drawer width changes. | Protects the family against fixed-width brittleness and supports both compact and management-heavy usage. | The current route exposes a desktop resize handle, clamps drawer width, and updates the preview page layout in response to width changes. | `approved` | Drawer width should be adjustable manually with clean reflow. |
| `HT-020` | On mobile, the hierarchy and display drawers should adopt a full-screen drawer posture rather than a partial-width side panel. | Keeps the family consistent with the repo’s established small-screen drawer model. | The current mobile implementation now stretches the drawers edge to edge and removes the desktop width cap on small screens. | `approved` | On mobile it should behave like a full screen drawer. |
| `HT-021` | In RTL, the family must mirror both shell attachment and internal tree anatomy so the drawer docking, expander placement, and row scan order feel native rather than LTR with cosmetic flips. | Makes directionality a first-class contract for the family and protects against subtle mirrored-layout regressions. | The approved prototype mirrors the drawer docking in RTL and flips the expander to the opposite side of the row. | `approved` | In RTL the expander should switch sides and the display drawer should sit flush beside the tree. |
| `HT-022` | Non-default themes and dark mode must preserve enough contrast between text, controls, row states, and surfaces that the hierarchy remains legible and actionable. | Prevents the family from being signed off in default theme only while quietly degrading in real viewing modes. | The current route includes hierarchy-specific theme and dark-mode contrast adjustments after live review of low-contrast states. | `approved` | Dark mode must not lose contrast between text and elements. |
| `HT-023` | Keyboard users must be able to navigate the tree itself without pointer dependence, including predictable movement between rows, expand or collapse control access, row-menu access, inline rename entry and exit, and owned open or close flows. | Turns the tree into a real interaction contract rather than a pointer-first visual specimen and grounds later WCAG verification in explicit behavior. | The current prototype already supports keyboard reachability for button controls and inline editing, but the exact tree-navigation and menu-flow proof still needs dedicated verification coverage. | `approved` | The hierarchy should not depend on mouse-only interaction. |
| `HT-024` | The hierarchy surface must expose truthful semantic state for assistive technology, including a coherent tree structure and programmatic expanded, selected, and current-page attribution where relevant. | Prevents a visually correct tree from silently degrading into an accessibility dead end for screen-reader users. | The current route has interactive controls and visible state markers, but the full tree-semantics contract still needs to be treated as part of the family rather than as optional implementation detail. | `approved` | The tree needs semantic state, not just visual state. |
| `HT-025` | Focus indicators for row labels, expanders, row-menu triggers, inline rename fields, destructive choices, and drawer controls must remain clearly visible with sufficient contrast across approved themes, magnification, and responsive states. | Makes WCAG 2.2 AA focus visibility and non-text contrast part of the family contract instead of leaving them implied by general theme styling. | The current route keeps usable focus affordances, but the hierarchy-tree family still needs dedicated downstream proof across theme, RTL, and mobile states. | `approved` | Focus visibility needs to stay clear everywhere in the pattern. |
| `HT-026` | Pointer and touch targets for expanders, row-menu triggers, drawer actions, and critical row interactions must remain practically reachable at mobile and magnified sizes rather than shrinking to fine-motor precision targets. | Protects the family against small-control regressions and supports touch, motor, and zoomed use cases honestly. | The current route uses button-based controls with padded hit areas, but target-size verification still belongs in the downstream family checklist. | `approved` | Small controls should still be easy to hit on touch and zoomed views. |
| `HT-027` | Because desktop drag-and-drop is primary, the family must preserve an equivalent non-drag movement path for keyboard users and other non-pointer workflows rather than treating menu-based move actions as optional convenience. | Keeps structural editing accessible even when drag-and-drop is unavailable, difficult, or undesirable. | The current prototype keeps menu-based move up, move down, and move-to-parent-level actions available alongside drag-and-drop. | `approved` | Drag cannot be the only way to move things. |
| `HT-028` | The delete-decision dialog and other owned hierarchy-tree overlays must manage focus predictably while open and return focus to a sensible originating control or fallback row when closed. | Protects destructive flows from becoming disorienting and turns modal behavior into an explicit accessibility rule. | The current route includes a dedicated delete-decision dialog and predictable row fallback after deletion, but overlay-focus proof still needs to be captured directly in verification. | `approved` | Destructive overlays should manage focus cleanly. |
| `HT-029` | Long page titles and other row text must overflow gracefully: the resting one-line row should truncate cleanly, preserve access to expander and row-menu controls, and avoid overlap or off-screen actions under narrow width, deep nesting, RTL, and magnification pressure. | Prevents a calm one-line tree from collapsing into clipped controls, unreadable collisions, or inaccessible actions once real content titles become longer than the demo copy. | The current route uses a one-line row model with truncated titles, but overflow-specific stress proof still needs to be made explicit downstream. | `approved` | Text overflow needs explicit coverage, not just implied truncation. |
| `HT-030` | Inline rename mode must continue to handle long titles safely, allowing the editable field to remain usable without clipping critical controls, breaking the row shell, or hiding the current edit target. | Protects the editing experience when real page names are long and prevents overflow handling from working only in resting state. | The current route already swaps long titles into an inline input, but dedicated overflow-and-edit stress review still needs to be captured directly. | `approved` | Long-title editing should stay usable, not just long-title resting rows. |
| `HT-031` | The first governed family proof should stay visually restrained rather than treating the tree as a loud management dashboard with competing cards, heavy fills, or oversized control blocks. | Records the aesthetic direction that was explicitly refined during live review and keeps later canonicals from drifting back toward a noisy prototype. | The final signed-off prototype moved controls into governed drawers, removed the bottom card, reduced fills, and quieted the row treatment substantially. | `approved` | Needs to be much less loud. |

## Exit Criteria For This Step

This behavior lock step is complete when the rules above are stable enough to
guide:

- the `hierarchy-tree` reference pack
- the first dedicated canonical review surface for the family
- the hierarchy-tree verification checklist

Do not treat `hierarchy-tree` as fully signed off for downstream adoption until
those artifacts exist and remain aligned with these approved behaviors.
