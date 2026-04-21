# Breadcrumb Behavior Lock

## Purpose

Lock the behavioral rules for the `breadcrumb` family before creating a
signed-off reference pack or promoting the pattern toward application adoption.

This artifact is intentionally narrower than a pattern note. It exists so the
user can approve, reject, or defer individual breadcrumb behaviors based on the
current `/design-system` implementation.

Row-level composition rules stay governed by:

- `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md`

Do not duplicate shared row rules here unless a breadcrumb-specific rule needs
to reference them.

## Review Status Legend

- `approved`:
  behavior should be preserved in the signed-off reference pack
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior needs more iteration or clarification before being locked

## Scope

- Family:
  `breadcrumb`
- Current source surface:
  `/design-system`
- Parent composition contract:
  `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/breadcrumb-pattern.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/breadcrumb-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `BC-000` | The breadcrumb must preserve current-page orientation by always keeping the current page visible, even when earlier path steps are reduced or hidden. | Prevents responsive reduction from destroying the user’s sense of where they are. | Current markup keeps the current page item visible in the full trail and in the compact signpost menu. | `approved` | Locked as the core breadcrumb orientation rule. |
| `BC-000A` | Breadcrumb segments that do not exist in the true navigation depth must not appear as placeholder structure; if a page has no middle segment or no `Page -1`, those elements should be absent rather than shown as empty or generic filler. | Distinguishes real navigation structure from responsive reduction and prevents invented hierarchy from appearing in shallow flows. | The current `/design-system` prototype uses fixed demo labels, but real consumers should only render actual path depth. | `approved` | Optional path segments should exist only when the underlying navigation depth is real. |
| `BC-000B` | If the current page is the home page for a module or workflow group, the breadcrumb should collapse to a single home item that points back to that same page rather than showing invented intermediate steps. | Keeps shallow entry pages honest and prevents the breadcrumb from implying hierarchy that the workflow does not actually have. | The current prototype does not yet model a shallow one-step breadcrumb variant, so this is a locked target for real family behavior rather than a fully represented preview state today. | `approved` | On a module or workflow home page, only the home item should appear. |
| `BC-000C` | Breadcrumb labels and depth must reflect the real business or route hierarchy of the current page; UI modes, review mechanics, or generic filler labels must not be inserted just to make the trail look complete. | Prevents visually plausible but semantically false breadcrumbs such as invented “Catalog” or made-up intermediate steps. | The current design-system launchers need this rule explicitly documented so family pages use true parent sections like `Canonicals` only when that section is genuinely part of the route hierarchy. | `approved` | Breadcrumb population must be honest to the actual IA, not demo filler. |
| `BC-001` | As available breadcrumb width shrinks, the breadcrumb should reduce progressively inside its own region rather than wrapping to a second line. | Preserves hierarchy and keeps breadcrumb pressure local to the family. | Current overflow logic measures against the breadcrumb container and progressively hides items rather than allowing wrap. | `approved` | Locked as the family’s primary responsive behavior. |
| `BC-002` | The first reduction step should hide the `Page -1` item before the breadcrumb removes the collapsed middle segment or switches to compact signpost mode. | Preserves the most useful path context for as long as possible before the family becomes highly compact. | Current overflow logic hides `breadcrumbPageMinusOneItem` and its separator first. | `approved` | Locked as the approved reduction order. |
| `BC-003` | If width pressure continues after `Page -1` is removed, the breadcrumb should next hide the collapsed middle segment before falling back to the compact signpost mode. | Keeps the family’s reduction path predictable and protects the compact mode as the final fallback rather than an early shortcut. | Current overflow logic hides `breadcrumbCollapsedItem` and its separator second, then only later activates compact mode. | `approved` | Locked as the approved second reduction step. |
| `BC-004` | When compact signpost mode activates, the full breadcrumb trail must fully disappear rather than remaining partially visible underneath the compact trigger. | Prevents the mixed-state regression that previously escaped the loop. | Current logic adds `.hidden` to the full list and reveals `#breadcrumb-compact`; the CSS was hardened after a compact-cascade regression. | `approved` | Locked to prevent the previously observed mixed state. |
| `BC-005` | The collapsed middle segment and compact signpost representations must still expose the hidden path steps through anchored menus or equivalent lightweight reveal. | Preserves recoverable navigation context after responsive reduction. | Current collapsed and compact modes each open a breadcrumb menu containing the hidden steps. | `approved` | Locked so reduction does not mean information loss. |
| `BC-006` | Opening breadcrumb transient surfaces should always close when the user clicks outside them. | Keeps breadcrumb menus feeling lightweight and temporary. | Current document click handler ignores clicks inside breadcrumb triggers or menus and closes them otherwise. | `approved` | Always desirable for this family. |
| `BC-007` | Pressing `Escape` should close any open breadcrumb transient surface and return focus to the triggering control. | Preserves keyboard usability and predictable focus recovery. | Current breadcrumb menu state is managed through dedicated open/close helpers and participates in the shared close-on-escape handling. | `approved` | Locked as part of the breadcrumb accessibility contract. |
| `BC-008` | Long breadcrumb labels must not wrap or force family-level overflow; the breadcrumb should prefer the approved reduction path instead. | Prevents localization or real-content labels from breaking breadcrumb geometry. | Current breadcrumb labels use non-wrapping text and rely on reduction states under width pressure. | `approved` | Locked for localization and real-content safety. |
| `BC-008A` | When the breadcrumb needs lightweight tooltip reveal for truncated or compacted labels, it must use the shared tokenized tooltip treatment rather than browser-default `title` tooltips. | Keeps tooltip timing, theme behavior, pointer styling, and parity consistent with the governed design-system tooltip model. | The shared design-system tooltip system now exists as a tokenized reusable treatment; breadcrumb surfaces should use that path for future label reveal states. | `approved` | Breadcrumb tooltip reveal should use the shared tooltip system across the board. |
| `BC-008C` | Breadcrumb tooltip reveal must render above the full breadcrumb row, search shell, and canonical review chrome instead of depending on local breadcrumb button stacking to remain visible. | Ensures truncated-label recovery remains visible when the breadcrumb sits beside higher-surface controls like the search field. | The shared floating tooltip layer is now the intended rendering path for breadcrumb label reveal so the tooltip can sit in the top overlay layer instead of inside local breadcrumb stacking contexts. | `approved` | Tooltip needs to be on top of everything else. |
| `BC-008B` | When the shared sub-nav reaches its approved mobile fallback, the breadcrumb should disappear entirely rather than rendering a compact or partial mobile breadcrumb. | Makes the shallowest narrow-width behavior explicit and prevents future mobile variants from reappearing without approval. | Current mobile CSS hides `.breadcrumb-nav` in the single-column sub-nav layout. | `approved` | On mobile, breadcrumb disappears completely. |
| `BC-009` | In RTL, the breadcrumb should mirror its order, separators, menu anchoring, and compact affordances in a way that feels native for RTL reading direction rather than like an LTR trail with late cosmetic flips. | Ensures RTL support is part of the family contract rather than an accidental byproduct of the shared row. | Current styles include RTL-specific rules for `.breadcrumb-nav` and `.breadcrumb-list`. | `approved` | RTL should be explicit for this family. |
| `BC-010` | The breadcrumb must remain visually correct and readable across the approved theme set, with theme changes affecting surfaces and contrast without changing the locked reduction path. | Prevents theme support from drifting silently as breadcrumb states evolve. | Current breadcrumb surfaces inherit theme-driven CSS variables from the design-system page. | `approved` | Theme support should remain explicit. |
| `BC-011` | If accent-sensitive breadcrumb states are added or refined, they must inherit the shared primary-colour system rather than inventing family-local highlight colours. | Keeps future breadcrumb emphasis aligned with the shared accent model even though the current family is mostly neutral. | The current breadcrumb is largely neutral, so accent inheritance is a guarded future-facing contract rather than a heavily used live state today. | `approved` | Review explicitly even when the current family is mostly neutral. |
| `BC-012` | The breadcrumb must preserve WCAG 2.2 AA-relevant behavior for keyboard reachability, visible focus, and readable control contrast where those concerns apply to links, collapse triggers, and compact menus. | Prevents accessibility expectations from being treated as optional polish instead of part of the family contract. | Current breadcrumb links and triggers are keyboard reachable, use visible focus and hover treatment, and inherit theme-aware control styling, but family-specific rendered verification is still pending. | `approved` | WCAG-oriented expectations should be recorded explicitly as concrete breadcrumb behaviors. |

## Open Questions To Resolve Through Feedback

## Exit Criteria For This Step

This behavior lock step is complete when each listed behavior is marked:

- `approved`
- `rejected`
- or `undecided` with an explicit follow-up action

Do not create the signed-off reference pack for the `breadcrumb` family until
the critical behaviors are at least mostly `approved`.
