# Context-Nav Behavior Lock

## Purpose

Lock the behavioral rules for the context-nav family before creating the family
reference pack, exploration surface, or locked canonical states.

This artifact governs the current `context-nav` seam in `/design-system`.
Earlier loop planning used `side-nav` as a working family label, but the
preferred durable family name is `context-nav`.

## Review Status Legend

- `approved`:
  behavior should be preserved in the signed-off reference pack
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior needs more iteration or clarification before being locked

## Scope

- Family:
  `context-nav`
- Current source surface:
  `/design-system`
- Related inventory row:
  `docs/workspace/design-system/component-inventory.md`
- Related verification and reference artifacts:
  to be created in this loop

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `SV-000` | The context-nav family must be treated as a shell-attached navigation surface rather than a floating content card. | Preserves the page-chrome role of the family and prevents later exploration from drifting into a detached panel treatment. | Current `.context-nav` is fixed to the viewport edge and spans from `--context-nav-top` to the bottom of the screen. | `approved` | Lock the family as shell chrome, not a free-floating card. |
| `SV-000A` | Icon buttons must keep their intended proportions and must not be squashed horizontally or vertically under layout pressure, scrolling, or responsive mode changes. | Prevents the family from degrading into distorted hit targets and protects recognizability of the navigation icons. | Current rail items use a fixed square footprint on desktop and proportionate icon containers; this should remain true as the family evolves. | `approved` | Icon buttons should keep their proportions. |
| `SV-001` | On desktop and wider tablet widths, the family should present as a narrow vertical rail with icon-first navigation, while text labels may remain visually hidden until the responsive bottom-nav fallback is reached. | Preserves the compact desktop shell treatment and prevents label sprawl from destabilizing the main layout too early. | Current desktop `.context-nav` is a `4.25rem` fixed rail; `.context-nav-label` is hidden outside the narrow-layout rules. | `approved` | Keep the desktop rail compact and icon-led. |
| `SV-001A` | The context-nav must maintain two explicit icon zones: a top region for primary destinations that grows downward from the top of the bar, and a bottom region for persistent utility destinations that stays anchored to the bottom and builds upward from the bar edge. | Preserves the spatial grammar of the family so primary navigation and persistent utility actions do not blur together as items are added. | Current markup already separates `.context-nav-main` from `.context-nav-bottom-group`, with the bottom group pushed down via `margin-top: auto`. | `approved` | Keep distinct top and bottom icon zones. |
| `SV-002` | When the approved narrow-width threshold is reached, the family should convert into a bottom navigation bar with visible labels instead of staying as a squeezed side rail. | Protects the responsive identity of the family and avoids a cramped pseudo-desktop state on smaller screens. | Current narrow-layout CSS switches `.context-nav` into a five-column bottom bar and reveals `.context-nav-label`. | `approved` | Mobile should be an intentional bottom-nav conversion, not a crushed rail. |
| `SV-002A0` | In mobile and narrow-width layouts, secondary and utility actions from the bottom-anchored zone should move into the `More` menu rather than remaining as first-class bottom-bar items when space is constrained. | Keeps the bottom-nav lane focused on the primary context destinations and prevents the mobile bar from inheriting the full desktop utility load. | Current narrow layout already exposes a `More` affordance and hides mobile-overflow targets; governed reference states should confirm the exact migrated actions. | `approved` | Bottom utility actions should get added to `More` on mobile. |
| `SV-002A` | If the top icon region grows beyond the available rail height, only the top region should scroll; the bottom anchored region must remain visible and fixed in place. | Prevents high item counts from displacing persistent bottom actions and keeps the family’s hierarchy understandable under vertical pressure. | Current `.context-nav-main` is the scrollable column while `.context-nav-bottom-group` remains outside that scroller at the bottom of the rail. | `approved` | Top icons may scroll; bottom icons stay visible. |
| `SV-002B` | When the top icon region scrolls, the icon buttons may yield only minimally smaller to accommodate a very thin scrollbar, but they must remain proportionate and visually center-aligned with the larger persistent bottom icons rather than looking pushed away by the scroll gutter. | Keeps the scrolled state visually tidy and prevents scrollbar accommodation from making the top lane feel misaligned with the bottom lane. | Current top region uses centered flex-column alignment with a thin scrollbar; explicit rendered proof for scrollbar-accommodating icon sizing and shared center alignment is still pending. | `approved` | Use only minimal size reduction, keep the scrollbar thin, and preserve centered alignment with the bottom stack. |
| `SV-002C` | If the rail becomes shorter under desktop height pressure, the family should stay in the same top-region scroll model rather than introducing a separate collapse-menu behavior, and the bottom anchored region must still remain visible and undisplaced. | Keeps pressure behavior structurally consistent and removes a second desktop overflow mode that adds complexity without improving orientation. | Current implementation now treats tall desktop stacks as scrollable at every reviewed height and keeps the bottom group outside that scroller. | `approved` | Abandon the separate top-collapse menu; keep the scrollbar model instead. |
| `SV-003` | The context-nav must remain aligned to the true combined header bottom edge so the rail or bottom bar frames the real shell rather than drifting under stale header geometry. | Protects shell framing and future first-consumer parity, especially once the family is adopted into page chrome. | `updateContextNavOffset()` measures the lower of the top-nav and sub-nav bottom edges and writes `--context-nav-top`. | `approved` | Header anchoring is part of the family contract. |
| `SV-004` | The active destination must remain visibly identifiable in both the desktop rail and the responsive bottom-nav presentation. | Preserves orientation as the family changes layout modes. | Current active treatment uses `.context-nav-item.active` and `[aria-current="page"]` styling across both layouts. | `approved` | Current-location visibility must survive every layout mode. |
| `SV-005` | Secondary actions that do not fit the primary mobile lane must move into a dedicated `More` menu rather than crowding the bottom bar or disappearing silently. | Prevents mobile overflow from becoming ad hoc and keeps the reduced layout honest. | Current narrow layout hides `.context-nav-mobile-overflow-target` items and exposes `#context-nav-more-button` with `#context-nav-more-menu`. | `approved` | Mobile overflow needs a governed `More` path. |
| `SV-005A` | On mobile, the `More` menu should present as a wide bottom-sheet-style surface tied to the full bottom-nav width rather than as a narrow anchored popover. | Keeps the reduced-layout overflow surface feeling intentional and prevents mobile utility actions from looking like a desktop menu pasted into the bottom bar. | Current mobile `More` now opens as a near full-width sheet above the bottom bar and is covered by browser geometry checks. | `approved` | Mobile `More` should be screen-width in feel, not a tiny popover. |
| `SV-006` | Long labels, localized copy, and magnified UI must not break the family geometry; the context-nav should prefer truncation, tooltip reveal, or the approved responsive fallback over overlap, clipping, or distorted controls. | Keeps the family resilient under real content and accessibility pressure. | Current items constrain text with ellipsis-ready styles and use shared tooltip data; rendered proof for long-label and magnified states is still pending. | `approved` | Long labels should truncate rather than wrapping or breaking geometry. |
| `SV-007` | Tooltip behavior for truncated or label-hidden context-nav items must use the shared governed tooltip layer, must render above shell surfaces, and should reveal on hover rather than on general keyboard-focus-only affordances. | Prevents tooltip drift, delayed native tooltips, and layering regressions around shell chrome while matching the preferred interaction model. | Current tooltip logic treats `.context-nav-item[data-tooltip]` as a shared-tooltip source and positions it to the side of the rail based on direction. | `approved` | Use governed hover tooltips; keyboard semantics should still remain accessible without adding extra visual tooltip requirements. |
| `SV-008` | In RTL, the context-nav rail should mirror to the full right edge by default, with tooltip placement, panel anchoring, and responsive layout all following that native-feeling right-edge presentation. | Makes localization part of the family contract instead of a best-effort afterthought. | Current CSS and preview-shell layout now keep the desktop rail as a narrow right-edge lane, preserve desktop shell mode when width fits, flip tooltip placement, and mirror panel anchoring under `html[dir="rtl"]`. | `approved` | RTL should use full right-edge placement. |
| `SV-009` | Menus and side panels launched from the context-nav must remain layered above the rail or bottom bar and must close on outside click or `Escape`, returning focus to the triggering control. | Captures real runtime behavior for transient shell surfaces rather than only resting geometry. | Current runtime handles outside-click closure, `Escape` closure, menu visibility toggles, and focus return for the `More` menu and related drawers. | `approved` | Transient context-nav surfaces should behave like governed shell overlays. |
| `SV-009A` | On mobile, drawers launched from the context-nav should behave like bottom-attached sheets that fill the lane down to the top edge of the bottom bar rather than floating with spare space beneath them. | Preserves the mobile-sheet mental model and keeps drawer geometry attached to the same navigation system that launched it. | Current mobile drawer positioning uses the real bottom-bar offset so the sheet lands directly on the bar edge and is covered by browser geometry checks. | `approved` | Mobile drawer should stick to the bottom. |
| `SV-009B` | Drawer close controls launched from the context-nav should use the same square button grammar as the family’s action controls, with a centered diagonal close glyph rather than a typographic capital `X`. | Keeps close controls visually governed and prevents browser-default or font-dependent close affordances from drifting away from the family language. | Current drawer close controls use the shared square `icon-button` treatment with a centered stroked cross icon. | `approved` | Close button should feel like part of the context-nav button family and use a real diagonal cross. |
| `SV-009C` | The first governed context-nav drawer payload in `/design-system` may expose preview-only controls needed for review, but a real application consumer must only expose the subset explicitly approved for that app surface. | Prevents preview tooling from silently becoming shipped product IA and keeps first-consumer adoption honest about what belongs in app versus in review tooling. | `/design-system` currently includes theme, magnification, accent, and direction tooling inside the first context-nav drawer payload; `rootAdminShell` is now constrained to theme and magnification, while direction stays owned by language selection. | `approved` | Keep preview tooling in `/design-system`; keep the app drawer narrower. |
| `SV-010` | The family must support real interactive states in governed proof, including tooltips, the mobile `More` menu, and action-launched panels, rather than being considered complete from resting-state screenshots alone. | Encodes the updated loop rule that interactive shell behavior must be proven, not assumed. | Current source already includes live `More`, filter, and accessibility panel interactions, but no context-nav-specific reference pack or canonical set exists yet. | `approved` | Proof must cover runtime states, not only an idle nav. |
| `SV-011` | Before first adoption, the family must prove shell framing, edge alignment, long-label behavior, overflow behavior, tooltip/menu layering, RTL, mobile, and magnification on `/design-system` and then re-prove those same concerns in the first real consumer, beginning with the root admin shell section navigation and first context-nav drawer integration. | Prevents the canonical set from becoming detached from real shell usage and records the adoption-parity rule up front. | The current family is marked `signed-off` in inventory, and first-consumer parity must continue to reference that governed chain rather than treating app implementation as sign-off by itself. | `approved` | First consumer remains the root admin shell, starting with context-nav drawer integration and then growing through additional root pages. |
| `SV-011A` | A first-consumer implementation must not be treated as signed off until the behavior lock, reference pack, canonical states, and adoption note have all been refreshed to reflect any newly approved app-versus-preview boundary. | Prevents the loop from skipping governance artifacts and leaving app code ahead of the repo’s signed-off truth. | The initial root-admin drawer pass implemented and tested the app surface before the lock/reference/adoption chain was refreshed, so the loop had to be reconciled afterward. | `approved` | Do not count app code as sign-off if the lock and canonicals have not been updated first. |

## First Tight Loop Proposal

Start with one behavior-locking pass focused on the current `context-nav`
surface and only the states already visible in source:

1. lock the desktop rail, mobile bottom-nav conversion, header anchoring, and
   active-state rules
2. include the first interactive/runtime states that are already implemented:
   shared tooltip reveal, mobile `More` menu, and action-launched panels
3. treat long-label truncation, hover-tooltip behavior, RTL right-edge
   placement, magnification, shell-framing, thin-scrollbar alignment, and
   short-height scroll pressure as required follow-on evidence dimensions for the next
   loop step

This keeps the first loop narrow and evidence-oriented without jumping ahead to
canonicals before the family contract is written down.

## Exit Criteria For This Step

This behavior lock step is complete when each listed behavior is marked:

- `approved`
- `rejected`
- or `undecided` with an explicit follow-up action

This behavior lock now reflects the approved family contract that underpins the
signed-off canonical reference set. Future adoption work must preserve these
locked rules unless an explicit follow-on review changes them.
