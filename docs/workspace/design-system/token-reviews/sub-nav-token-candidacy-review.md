# Design System Token Candidacy Review

## Scope

- Family:
  `sub-nav`
- Review date:
  2026-04-16
- Current promotion state:
  signed-off, reference-backed, and fully Playwright-locked at the canonical
  row-state level
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/sub-nav-row-reference-pack.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/sub-nav-row-pattern.md`

## Purpose

Use this review to decide which visual decisions in the signed-off `sub-nav`
row should:

- stay local to the family
- remain dependent on existing base tokens
- become reusable primitives instead of tokens

The goal is to avoid fake system structure. The shared row is a governed layout
contract, but most of its hard-won decisions are geometry and composition
rules, not a new token catalog.

## Eligibility Check

- Reference-backed and behavior-locked:
  yes
- Rendered evidence captured:
  yes
- Playwright or equivalent parity gate exists:
  yes
- At least one other family or planned consumer can reuse the decision:
  yes; `rootAdminShell` page chrome and future authenticated page shells
- Token extraction is needed before app adoption:
  yes, but mainly to confirm which existing tokens are sufficient and which row
  values must stay local

## Candidate Decisions

### Color

- Local value or current CSS decision:
  `--surface-1`, `--surface-2`, `--line`, `--ink`, `--ink-soft`,
  `--search-border`, `--search-placeholder`
- Semantic meaning:
  secondary shell surface, secondary shell separators, shared row copy, and
  search-field chrome
- Reuse evidence:
  these variables already drive multiple governed `/design-system` surfaces,
  including top-nav-adjacent shell regions, controls, and the search field
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens; do not create `sub-nav`-specific color tokens
- Rationale:
  the row already has a reusable token dependency layer through the existing
  base variables. A second alias layer would add naming weight without
  improving reuse.

### Radius And Border

- Local value or current CSS decision:
  `--radius-sm`, `--line`
- Semantic meaning:
  control rounding and shell-edge border treatment inside secondary chrome
- Reuse evidence:
  shared across breadcrumb controls, the search shell, menus, and other shell
  controls
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens
- Rationale:
  reuse is real, but it is already covered by the current token layer.

### Shadow And Elevation

- Local value or current CSS decision:
  `--shadow`, `--tooltip-shadow`, `--tooltip-bg`, `--tooltip-fg`
- Semantic meaning:
  shared row container elevation and top-overlay tooltip treatment
- Reuse evidence:
  shared with other governed design-system surfaces, especially tooltip and
  floating-shell behavior
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens; no `sub-nav`-specific elevation token approved
- Rationale:
  these are already legitimate shared tokens and should remain global rather
  than becoming row-local aliases.

### Spacing And Density

- Local value or current CSS decision:
  local row padding, shell gap values, and canonical spacing between breadcrumb
  and search regions
- Semantic meaning:
  secondary row rhythm and control density
- Reuse evidence:
  plausible future reuse, but not yet proven across another extracted
  secondary row family
- Token candidate or primitive candidate:
  token candidate
- Decision:
  defer semantic spacing-token promotion
- Rationale:
  we have real reuse pressure, but not enough stable multi-family evidence yet
  to distinguish row semantics from family tuning.

### Geometry And Composition

- Local value or current CSS decision:
  three-column grid ownership, centered search slot, row width negotiation,
  mobile breadcrumb removal, and header-offset refresh behavior
- Semantic meaning:
  concrete `sub-nav` row structure and pressure-resolution behavior
- Reuse evidence:
  these decisions are specific to the shared row contract
- Token candidate or primitive candidate:
  primitive candidate
- Decision:
  keep local to the `sub-nav` row primitive
- Rationale:
  these values and rules express structure and behavior, not reusable semantic
  values. Tokenizing them would create brittle fake reuse.

### Layering

- Local value or current CSS decision:
  row-local layering beneath top-nav, child-menu layering inside the row, and
  tooltip top-overlay behavior
- Semantic meaning:
  ordered interaction between page chrome, menus, and the shared tooltip layer
- Reuse evidence:
  some reuse exists at the tooltip level, but row-vs-top-nav ordering remains
  structural
- Token candidate or primitive candidate:
  mixed token and primitive candidate
- Decision:
  keep the shared tooltip layer tokenized; keep row-vs-shell stacking local to
  the primitive
- Rationale:
  the tooltip layer is already a global tokenized concern, but the row’s place
  in the header stack is still structural, not token-driven.

### Responsive Thresholds And Honest Widths

- Local value or current CSS decision:
  canonical width choices such as `1560px`, `1920px`, `560px`, and the
  row-specific pressure transitions
- Semantic meaning:
  review-grade truth for this family’s fit behavior
- Reuse evidence:
  specific to this row, content mix, and canonical harness
- Token candidate or primitive candidate:
  local candidate
- Decision:
  keep local; do not tokenize or generalize
- Rationale:
  these are measured review values, not semantic design tokens.

## Promotion Rules Outcome

- Approved new semantic tokens:
  none
- Existing base tokens explicitly approved for `sub-nav` reuse:
  `--surface-1`, `--surface-2`, `--line`, `--ink`, `--ink-soft`,
  `--search-border`, `--search-placeholder`, `--radius-sm`, `--shadow`,
  `--tooltip-bg`, `--tooltip-fg`, `--tooltip-shadow`
- Primitive candidates identified:
  the `sub-nav` row composition primitive, including centered search-slot
  ownership, breadcrumb-yield behavior, and header-offset refresh behavior
- Local-only decisions intentionally retained:
  row grid structure, mobile removal behavior, canonical width choices,
  pressure thresholds, and row-specific layering beneath top-nav
- Deferred candidates:
  secondary-shell spacing aliases, secondary-shell layering aliases, and any
  dedicated row typography aliases

## Follow-Up

- Pattern artifact updated:
  yes; this review should be treated as the token contract outcome for the row
- Component artifact updated:
  not yet; component extraction is still deferred until a stronger shared seam
  is needed
- Reference pack impact:
  none; parity targets stay the same
- Verification checklist impact:
  checklist can move from token-review pending to adoption-parity pending
- App adoption impact:
  row adoption can now proceed while reusing approved base tokens and keeping
  row geometry local
