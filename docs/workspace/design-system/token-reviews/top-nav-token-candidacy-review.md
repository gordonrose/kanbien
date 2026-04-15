# Design System Token Candidacy Review

## Scope

- Family:
  `top-nav`
- Review date:
  2026-04-15
- Current promotion state:
  signed-off, reference-backed, and fully Playwright-locked at the canonical
  state level
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/top-nav-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/top-nav-reference-pack.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/navigation-shell-pattern.md`

## Purpose

Use this review to decide which visual decisions in the signed-off `top-nav`
family should:

- stay local to the family
- remain dependent on existing base tokens
- become reusable primitives instead of tokens

The goal here is to avoid fake system structure. A measured-fit shell should
not be converted into a token catalog just because it now has good coverage.

## Eligibility Check

- Reference-backed and behavior-locked:
  yes
- Rendered evidence captured:
  yes
- Playwright or equivalent parity gate exists:
  yes
- At least one other family or planned consumer can reuse the decision:
  yes; `rootAdminShell`, plus other future shell/header families
- Token extraction is needed before app adoption:
  yes, but mostly as a decision about which existing tokens are sufficient and
  which values must stay local

## Candidate Decisions

### Color

- Local value or current CSS decision:
  `--surface-1`, `--surface-2`, `--surface-3`, `--ink`, `--ink-soft`,
  `--line`, `--line-strong`, `--accent-soft`, `--accent-text`,
  `--nav-avatar-bg`
- Semantic meaning:
  shell surfaces, shell copy, shell borders, selected/active emphasis, and
  avatar treatment
- Reuse evidence:
  these same base variables already drive multiple `/design-system` surfaces,
  including nav, menu, drawer, and preview-shell treatments
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens; do not create new `top-nav`-specific color
  tokens yet
- Rationale:
  the family already has reusable token coverage through the current base
  variables. Creating a parallel semantic alias layer now would add naming
  weight without improving reuse confidence.

### Radius And Border

- Local value or current CSS decision:
  `--radius`, `--radius-sm`, `--line`, `--line-strong`
- Semantic meaning:
  shell container radius, control radius, and border contrast levels
- Reuse evidence:
  shared across cards, menus, mobile links, and other shell-adjacent controls
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens; no new `top-nav`-specific radius or border
  tokens approved
- Rationale:
  reuse is real, but it is already captured by the base token layer.

### Shadow And Elevation

- Local value or current CSS decision:
  `--shadow`, `--shadow-soft`
- Semantic meaning:
  shell container elevation and floating menu/dialog elevation
- Reuse evidence:
  used across the top-nav surface, menus, preview cards, and other layered
  design-system surfaces
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens; no new `top-nav` elevation token approved
- Rationale:
  the current shadow tokens already describe the reusable visual decision well
  enough.

### Spacing And Density

- Local value or current CSS decision:
  repeated local padding/gap values such as `0.75rem`, `0.9rem`, `1rem`,
  `1.15rem`, `1.25rem`, and `1.5rem`
- Semantic meaning:
  shell control density, menu spacing, launcher-card spacing, and preview-shell
  rhythm
- Reuse evidence:
  some of these values are likely to recur, but we do not yet have a stable
  multi-family semantic spacing map for shell controls
- Token candidate or primitive candidate:
  token candidate
- Decision:
  defer semantic spacing-token promotion
- Rationale:
  spacing reuse is plausible, but the repo does not yet have enough extracted
  shell families to distinguish truly shared shell spacing from family-local
  tuning.

### Sizing And Geometry

- Local value or current CSS decision:
  brand mark `3rem`, breakpoint-like media query `61.25rem`, preview widths,
  grid column structure, overflow-fit measurements, and `2 items + More`
  threshold logic
- Semantic meaning:
  concrete `top-nav` geometry and fit behavior
- Reuse evidence:
  these decisions are specific to the `top-nav` layout contract
- Token candidate or primitive candidate:
  primitive/local candidate
- Decision:
  keep local to the `TopNavShell` primitive
- Rationale:
  these values and rules express component geometry, not reusable design tokens.
  Tokenizing them would create brittle fake reuse.

### Selected / Hover / Focus Treatment

- Local value or current CSS decision:
  active/hover states rely on existing accent, line, and surface variables plus
  local selectors such as `.nav-link.active`
- Semantic meaning:
  shell-control interactivity treatment
- Reuse evidence:
  likely reusable across other shell controls, but not yet proven across enough
  extracted primitives
- Token candidate or primitive candidate:
  token candidate
- Decision:
  defer semantic alias tokens; continue using the base surface/line/accent
  variables for now
- Rationale:
  the visual rule is stable, but the right semantic token names should wait
  until at least one more shell family is extracted.

### Typography

- Local value or current CSS decision:
  inherited font family and local font-weight/letter-spacing choices
- Semantic meaning:
  shell hierarchy and utility emphasis
- Reuse evidence:
  not yet strong enough to justify shell-specific typography tokens
- Token candidate or primitive candidate:
  token candidate
- Decision:
  defer
- Rationale:
  typography is currently better represented as part of the base frontend
  language than as a dedicated shell token layer.

### Layering

- Local value or current CSS decision:
  local `z-index` rules and stacking-context behavior in the shell
- Semantic meaning:
  shell-over-subnav layering and overlay ordering
- Reuse evidence:
  relevant across menus, drawers, and dialogs, but still coupled to structure
- Token candidate or primitive candidate:
  primitive candidate
- Decision:
  defer tokenization; treat this as primitive-level layering guidance
- Rationale:
  the key reusable unit is the shell/overlay relationship, not just a shared
  integer value.

## Promotion Rules Outcome

- Approved new semantic tokens:
  none
- Existing base tokens explicitly approved for `top-nav` reuse:
  `--surface-1`, `--surface-2`, `--surface-3`, `--ink`, `--ink-soft`,
  `--line`, `--line-strong`, `--accent`, `--accent-soft`, `--accent-text`,
  `--shadow`, `--shadow-soft`, `--radius`, `--radius-sm`
- Primitive candidates identified:
  `TopNavShell`, anchored shell menus, and the measured-fit overflow behavior
- Local-only decisions intentionally retained:
  brand-mark size, measured-fit overflow math, `2 items + More` threshold,
  breakpoint/media-query thresholds, preview widths, and shell-specific grid
  geometry
- Deferred candidates:
  shell spacing aliases, shell interaction-state aliases, shell typography
  aliases, and shared shell layering tokens

## Follow-Up

- Pattern artifact updated:
  yes; token contract should point to this review outcome
- Component artifact updated:
  yes; token dependencies should reflect approved base-token reuse and retained
  local geometry
- Reference pack impact:
  none; parity targets stay the same
- Verification checklist impact:
  no new verification gate needed beyond preserving the current visual states
- App adoption impact:
  the next step is no longer “find tokens.” It is “extract the first governed
  shell seam while reusing the approved base tokens and keeping geometry local.”
