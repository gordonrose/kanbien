# Design System Token Candidacy Review

## Scope

- Family:
  `context-nav`
- Review date:
  2026-04-16
- Current promotion state:
  signed-off, reference-backed, and Playwright-guarded at the canonical state
  level
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/context-nav-reference-pack.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/context-nav-pattern.md`

## Purpose

Use this review to decide which visual decisions in the signed-off
`context-nav` family should:

- stay local to the family
- remain dependent on existing base tokens
- become reusable primitives instead of tokens

## Eligibility Check

- Reference-backed and behavior-locked:
  yes
- Rendered evidence captured:
  yes
- Playwright or equivalent parity gate exists:
  yes
- At least one other family or planned consumer can reuse the decision:
  yes; root admin shell section navigation and related shell-attached drawers
- Token extraction is needed before app adoption:
  yes, mainly as a decision about what should stay local versus depend on the
  current base token layer

## Candidate Decisions

### Color

- Decision:
  keep using the existing base surface, line, ink, and accent tokens
- Rationale:
  the family already relies on shared shell variables such as `--surface-*`,
  `--line*`, `--ink*`, and accent tokens. No `context-nav`-specific color
  tokens are justified yet.

### Radius And Border

- Decision:
  keep using existing base radius and border tokens
- Rationale:
  the rail, bottom sheet, drawer shells, and icon buttons all reuse the same
  global radius and line language successfully.

### Elevation

- Decision:
  keep using existing shadow tokens
- Rationale:
  the family needs layered surfaces, but current reuse is already captured by
  the shared shadow tokens rather than a `context-nav`-specific elevation
  alias.

### Sizing And Geometry

- Decision:
  keep local to the `context-nav` primitive
- Rationale:
  rail width, bottom-bar height, scroll-pressure sizing, divider width, and
  right-edge mirroring are component geometry decisions, not general design
  tokens.

### Interaction-State Styling

- Decision:
  defer semantic alias tokens
- Rationale:
  active, hover, and open-state treatment already derive from the base token
  layer. More shell families would be needed before naming shared shell-state
  aliases.

### Icon Button Grammar

- Decision:
  treat as a primitive candidate, not a token candidate
- Rationale:
  the square button grammar and diagonal close glyph are reusable control
  patterns, but the valuable reusable unit is the control primitive, not a set
  of tokens.

### Sheet And Drawer Behavior

- Decision:
  treat as primitive-level behavior guidance
- Rationale:
  mobile `More` sheet width and drawer bottom attachment are structural
  behaviors, not token decisions.

## Promotion Rules Outcome

- Approved new semantic tokens:
  none
- Existing base tokens explicitly approved for reuse:
  `--surface-1`, `--surface-2`, `--surface-3`, `--ink`, `--ink-soft`,
  `--line`, `--line-strong`, `--accent`, `--accent-soft`, `--accent-text`,
  `--shadow`, `--shadow-soft`, `--radius`, `--radius-sm`
- Primitive candidates identified:
  `ContextNavRail`, mobile `More` sheet behavior, shell-attached drawer
  behavior, and square close-control grammar
- Local-only decisions intentionally retained:
  rail width, bottom-bar sizing, scrollbar accommodation, sheet inset values,
  right-edge mirroring geometry, and scroll-pressure sizing behavior
- Deferred candidates:
  shell-state alias tokens and spacing aliases

## Follow-Up

- Pattern artifact updated:
  yes
- Reference pack impact:
  none; parity targets remain the same
- Verification checklist impact:
  no additional gate beyond preserving the signed-off states
- App adoption impact:
  adoption may depend on the approved base-token layer while keeping family
  geometry local
