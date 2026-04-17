# Sub-Nav Row Behavior Lock

## Purpose

Lock the behavioral rules for the composed breadcrumb/search row before the
child families evolve independently.

This artifact protects the hard-won responsive contract that belongs to the
shared row rather than to `breadcrumb` or `search-shell` in isolation.

## Review Status Legend

- `approved`:
  behavior should be preserved in the signed-off reference pack
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior needs more iteration or clarification before being locked

## Scope

- Family:
  `sub-nav`
- Current source surface:
  `/design-system`
- Child families in scope:
  `breadcrumb`
  `search-shell`
- Related patterns:
  `docs/workspace/design-system/patterns/sub-nav-row-pattern.md`
  `docs/workspace/design-system/patterns/breadcrumb-pattern.md`
  `docs/workspace/design-system/patterns/search-shell-pattern.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/sub-nav-row-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `SN-000` | The breadcrumb/search row must remain a governed shared composition even if `breadcrumb` and `search-shell` are maintained as separate families. | Prevents future edits from breaking the responsive contract by treating each child family as fully independent. | Current `/design-system` implementation renders both surfaces inside one `.sub-nav` grid row. | `approved` | Separate families are preferred, but the row-level responsiveness must stay protected. |
| `SN-001` | The row must negotiate width through the parent layout first, with the breadcrumb yielding through collapse or compact states before the search shell abandons its centered max-width presentation. | Preserves the signed-off balance between wayfinding and search prominence under width pressure. | Current row uses a three-column grid with breadcrumb in column 1 and search shell centered in column 2. | `approved` | Locked as the current responsive row contract. |
| `SN-002` | The breadcrumb family may compact within its own region, but must not force the search shell to visually overlap, clip, or jump into an unrelated layout mode. | Keeps child-family pressure local while preserving whole-row stability. | Current breadcrumb overflow is measured against the breadcrumb container rather than the search width. | `approved` | Locked as part of the row safety contract. |
| `SN-003` | The search shell must remain visually centered and width-bounded by the shared row contract rather than expanding opportunistically into the breadcrumb slot. | Preserves recognizability and prevents the search field from destabilizing page chrome. | Current `.search-shell` uses `grid-column: 2`, `justify-self: center`, and `max-width: 40rem`. | `approved` | Locked to preserve the current centered search treatment. |
| `SN-004` | Menus opened by the breadcrumb family must layer correctly within the row while still remaining underneath higher-priority top-nav surfaces. | Prevents the row split from reintroducing layering regressions. | Current row uses `.sub-nav { z-index: 4; }`, breadcrumb menus use `z-index: 7`, and the top-nav sits above the row. | `approved` | Locked as part of preserving header layering. |
| `SN-005` | Row updates must continue to refresh shared header geometry so downstream anchored surfaces, such as context navigation, remain positioned from the true combined header bottom edge. | Protects cross-shell anchoring that depends on the composed header stack. | Current runtime offset logic measures the lower of the top-nav and sub-nav surfaces and observes both the row and the breadcrumb region. | `approved` | Locked as part of the composed header contract. |
| `SN-006` | The row must support localization, long labels, and narrow widths by preferring internal breadcrumb compaction over whole-row overlap or clipping. | Keeps responsive failures honest at the correct layer. | Current breadcrumb labels are non-wrapping and progressively collapse into compact states. | `approved` | Locked for future responsive work. |
| `SN-007` | In RTL, the shared row must mirror and anchor its breadcrumb and search composition in a way that feels native for RTL reading order rather than behaving like an LTR row with late cosmetic flips. | Prevents the row split from regressing localization quality or anchoring behavior. | Current styles include RTL-specific rules for `.sub-nav`, `.breadcrumb-nav`, `.search-shell`, and `.breadcrumb-list`. | `approved` | RTL support should be an explicit behavior statement for this family. |
| `SN-008` | The shared row must remain visually correct and readable across the approved theme set, with theme changes affecting surface, contrast, and emphasis without changing the locked responsive row behavior. | Prevents theme support from becoming implicit and drifting during future family changes. | Current row styling inherits theme-driven CSS variables from the design-system surface. | `approved` | Theme support should be explicit rather than implied. |
| `SN-009` | If the shared row participates in the current primary-colour system, accent-derived states within the row must inherit that selection consistently instead of freezing to family-local colours. | Keeps the row visually connected to the shared design-system accent model when accent-sensitive states are added or refined. | The current row mostly uses neutral styling, but future accent-sensitive states should follow the shared accent contract rather than inventing local colour logic. | `approved` | Primary-colour inheritance should be reviewed explicitly even when the current row is mostly neutral. |
| `SN-010` | The shared row must preserve WCAG 2.2 AA-relevant behavior for keyboard reachability, visible focus, and readable control contrast where those concerns apply to breadcrumb menus and the search input. | Prevents accessibility expectations from being treated as optional polish instead of part of the contract surface. | Current implementation includes keyboard-reachable breadcrumb triggers, a focus-visible search input state, and theme-aware control styling, but family-specific rendered verification is still pending. | `approved` | WCAG-oriented expectations should be recorded explicitly as concrete row behaviors. |
| `SN-011` | When any family in the shared row needs lightweight tooltip reveal, it must use the shared tokenized tooltip treatment rather than browser-default `title` tooltips so timing, theme behavior, pointer styling, and parity remain governed. | Prevents tooltip behavior from drifting between surfaces and avoids reintroducing delayed native browser tooltips on truncated or compact labels. | The design-system now defines shared tooltip tokens and a reusable tooltip anchor treatment; future row families should use that governed path instead of raw `title` attributes. | `approved` | Shared row families should use the same tokenized tooltip system across the board. |
| `SN-011A` | Shared-row tooltips must render in the top overlay layer above every row surface, search shell, breadcrumb control, and canonical review frame rather than competing with local component stacking. | Prevents tooltip reveal from disappearing behind the very UI it is meant to explain and keeps tooltip visibility deterministic across demo, exploration, and canonical surfaces. | The shared floating tooltip layer is now intended to sit above all design-system surfaces via a dedicated tooltip-layer z-index token rather than relying on per-component stacking guesses. | `approved` | Tooltip must be on top of everything else. |
| `SN-012` | When the approved mobile fallback is reached, the breadcrumb must disappear entirely and the search shell must expand to occupy the full available width of the sub-nav. | Removes ambiguity about mobile composition and preserves the signed-off narrow-width behavior. | Current mobile CSS switches the sub-nav to a single-column layout and hides `.breadcrumb-nav`, leaving the search shell as the remaining full-width child. | `approved` | On mobile, breadcrumb disappears and search takes the full sub-nav width. |

## Exit Criteria For This Step

This behavior lock step is complete when each listed behavior is marked:

- `approved`
- `rejected`
- or `undecided` with an explicit follow-up action

Do not treat independent `breadcrumb` or `search-shell` changes as safe by
default unless the shared `sub-nav` contract remains approved and in sync.
