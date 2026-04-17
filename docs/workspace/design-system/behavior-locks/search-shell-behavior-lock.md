# Search Shell Behavior Lock

## Purpose

Lock the behavioral rules for the `search-shell` family before creating a
signed-off reference pack or promoting the pattern toward application adoption.

This artifact is intentionally narrower than a pattern note. It exists so the
user can approve, reject, or defer individual search-shell behaviors based on
the current `/design-system` implementation.

Row-level composition rules stay governed by:

- `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md`

Do not duplicate shared row rules here unless a search-shell-specific rule
needs to reference them.

## Review Status Legend

- `approved`:
  behavior should be preserved in the signed-off reference pack
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior needs more iteration or clarification before being locked

## Scope

- Family:
  `search-shell`
- Current source surface:
  `/design-system`
- Parent composition contract:
  `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/search-shell-pattern.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/search-shell-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `SS-000` | The search shell must remain a centered, width-bounded secondary search affordance rather than growing into a full-row takeover in normal desktop and tablet states. | Preserves the intended secondary-chrome role of search and prevents it from overpowering wayfinding. | Current `.search-shell` uses `grid-column: 2`, `justify-self: center`, `width: 100%`, and `max-width: 40rem`. | `approved` | Locked as the core search-shell presentation rule. |
| `SS-001` | The search input must fill the available width of its bounded shell rather than introducing inner dead space or fixed-width behavior. | Keeps the control predictable as the row width changes. | Current `.search-input` uses `width: 100%` inside the bounded search shell. | `approved` | Locked as the core input sizing rule. |
| `SS-002` | The default empty state should communicate scope through placeholder or equivalent visible search guidance without requiring surrounding page copy to explain what the field searches. | Keeps the family usable even before real data-backed behavior is attached. | Current input uses the placeholder `Search components, patterns, or docs`. | `approved` | The empty field should still explain what it is for. |
| `SS-003` | The search shell must preserve a clear focus treatment that remains visible and readable without changing shell geometry. | Prevents focus from becoming too subtle or layout-shifting under theme or responsive changes. | Current `.search-input:focus` adds outline and border emphasis without changing layout structure. | `approved` | Locked as the search-shell focus rule. |
| `SS-004` | Placeholder text must yield with the available input width under resizing or magnification rather than forcing overflow, awkward clipping, or row breakage. | Captures the responsive placeholder issue early at the correct family seam. | Current search input is width-bounded and inherits the input box model; family-specific rendered verification for magnification and localized placeholder pressure is still pending. | `approved` | Placeholder text should resize or yield with the input instead of destabilizing layout. |
| `SS-004A` | Under narrow space, any custom in-field suffix or execution hint should disappear before it competes with the typed value, placeholder text, or native clear affordance. | Gives priority to readable input content and the browser clear control when horizontal space gets tight. | The current `Enter` hint is hidden at the mobile fallback; future narrow-width refinements should keep the same priority rule rather than forcing suffix coexistence. | `approved` | On narrow space, the custom hint should disappear. |
| `SS-005` | When the shared row reaches its approved stacked fallback, the search shell may move into the stacked single-column layout, but it must not invent an earlier family-local layout break that bypasses the row contract. | Keeps stacking decisions governed by the parent composition pattern rather than by ad hoc search-shell tweaks. | Current mobile CSS changes the row to one column and lets the search shell continue in that layout; search-shell does not own an earlier independent breakpoint. | `approved` | Stacking is allowed only through the shared row fallback. |
| `SS-005A` | When the approved mobile fallback is reached, the search shell must expand to occupy the full available width of the sub-nav rather than staying center-bounded to its desktop width treatment. | Makes the signed-off narrow-width behavior explicit and prevents future mobile drift toward a cramped centered search field. | Current mobile CSS keeps `.search-shell` in the single-column sub-nav with `width: 100%` after the breadcrumb is hidden. | `approved` | On mobile, search takes the full width of the sub-nav. |
| `SS-006` | In RTL, the search shell must mirror naturally with the shared row while preserving its centered bounded presentation and readable input behavior. | Ensures RTL support is part of the family contract rather than an accidental consequence of row-level mirroring. | Current styles include RTL-specific handling for `.search-shell`. | `approved` | RTL should be explicit for this family. |
| `SS-007` | The search shell must remain visually correct and readable across the approved theme set, with theme changes affecting border, surface, focus, and placeholder contrast without changing the locked family behavior. | Prevents theme support from drifting silently as search states evolve. | Current search styling uses theme-aware CSS variables including `--search-border` and `--search-placeholder`. | `approved` | Theme support should remain explicit. |
| `SS-008` | If accent-sensitive search-shell states are added or refined, they must inherit the shared primary-colour system rather than inventing family-local highlight colours. | Keeps future active or assisted states aligned with the shared accent model even though the current family is mostly neutral. | The current search shell is largely neutral, so accent inheritance is a guarded future-facing contract rather than a heavily used live state today. | `approved` | Review explicitly even when the current family is mostly neutral. |
| `SS-009` | If the search shell needs lightweight tooltip reveal for truncated labels, helper copy, or future icon-only affordances, it must use the shared tokenized tooltip treatment rather than browser-default `title` tooltips. | Keeps tooltip timing, theme behavior, pointer styling, and parity consistent with the governed design-system tooltip model. | The shared design-system tooltip system now exists as a tokenized reusable treatment; future search-shell tooltip needs should use that path. | `approved` | Search-shell tooltip reveal should use the shared tooltip system across the board. |
| `SS-010` | The search shell must preserve WCAG 2.2 AA-relevant behavior for keyboard reachability, visible focus, readable placeholder and control contrast, and semantic search landmark expectations where those concerns apply. | Prevents accessibility expectations from being treated as optional polish instead of part of the family contract. | Current implementation uses a semantic `form` with `role="search"`, a keyboard-reachable input, visible focus styling, and theme-aware placeholder contrast, but family-specific rendered verification is still pending. | `approved` | WCAG-oriented expectations should be recorded explicitly as concrete search-shell behaviors. |

## Open Questions To Resolve Through Feedback

## Exit Criteria For This Step

This behavior lock step is complete when each listed behavior is marked:

- `approved`
- `rejected`
- or `undecided` with an explicit follow-up action

Do not create the signed-off reference pack for the `search-shell` family
until the critical behaviors are at least mostly `approved`.
