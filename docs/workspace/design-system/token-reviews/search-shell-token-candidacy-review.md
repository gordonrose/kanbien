# Design System Token Candidacy Review

## Scope

- Family:
  `search-shell`
- Review date:
  2026-04-16
- Current promotion state:
  signed-off, reference-backed, and fully Playwright-locked at the
  search-shell canonical-state level
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/search-shell-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/search-shell-reference-pack.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/search-shell-pattern.md`

## Purpose

Use this review to decide which visual decisions in the signed-off
`search-shell` family should:

- stay local to the family
- remain dependent on existing base tokens
- become reusable primitives instead of tokens

The search shell is visually simple, but its bounded geometry, active hint
behavior, and coexistence with the native clear affordance are structural
decisions rather than token candidates.

## Eligibility Check

- Reference-backed and behavior-locked:
  yes
- Rendered evidence captured:
  yes
- Playwright or equivalent parity gate exists:
  yes
- At least one other family or planned consumer can reuse the decision:
  yes; shared application header search plus future page-chrome search
  consumers
- Token extraction is needed before app adoption:
  yes, mostly to confirm existing token coverage and identify the true
  reusable primitive seam

## Candidate Decisions

### Color

- Local value or current CSS decision:
  `--surface-1`, `--line`, `--ink`, `--search-border`,
  `--search-placeholder`, `--accent`
- Semantic meaning:
  input surface, border, readable placeholder guidance, and focus treatment
- Reuse evidence:
  shared with the governed search surfaces and broader shell-control language
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens
- Rationale:
  the search shell already inherits the right shared token layer without
  needing search-shell-only aliases.

### Radius And Border

- Local value or current CSS decision:
  `--radius-sm`, `--line`
- Semantic meaning:
  input edge treatment and shared shell-control border
- Reuse evidence:
  already shared with breadcrumb controls and other design-system inputs
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens
- Rationale:
  reuse exists, but is already adequately represented by the base layer.

### Typography

- Local value or current CSS decision:
  inherited body type scale plus local placeholder readability decisions
- Semantic meaning:
  readable search guidance inside bounded secondary chrome
- Reuse evidence:
  plausible future reuse, but not yet strong enough to justify search-specific
  typography aliases
- Token candidate or primitive candidate:
  token candidate
- Decision:
  defer
- Rationale:
  typography should continue to come from the base frontend language until a
  second extracted search consumer proves a dedicated semantic layer is useful.

### Spacing And Density

- Local value or current CSS decision:
  input padding, shell padding, active-hint spacing, and internal suffix space
- Semantic meaning:
  search-shell density and readable input rhythm
- Reuse evidence:
  likely to recur in future search consumers, but still too tied to the
  current shell geometry
- Token candidate or primitive candidate:
  token candidate
- Decision:
  defer semantic spacing-token promotion
- Rationale:
  the values are stable, but the repo does not yet have enough extracted
  search-family evidence to name them well.

### Geometry And Bounded Width

- Local value or current CSS decision:
  centered middle-slot placement, `40rem` max-width, full-width mobile
  fallback, and compressed coexistence with breadcrumb pressure
- Semantic meaning:
  concrete search-shell layout contract
- Reuse evidence:
  relevant to future shared-header search adoption, but driven by structure
  and family role rather than semantic values
- Token candidate or primitive candidate:
  primitive candidate
- Decision:
  keep as primitive-level behavior, not tokens
- Rationale:
  the reusable seam is the bounded search-shell primitive, not a tokenized
  width value.

### Active Enter Hint And Narrow-Width Yield

- Local value or current CSS decision:
  the Enter hint appears only while active and disappears before it competes
  with typed content, placeholder text, or the native clear affordance
- Semantic meaning:
  search-shell interaction behavior under focus and width pressure
- Reuse evidence:
  potentially reusable across future search affordances, but behavioral rather
  than token-based
- Token candidate or primitive candidate:
  primitive candidate
- Decision:
  keep in the primitive seam
- Rationale:
  this is governed interaction structure, not a reusable token value.

### Localization Stress States

- Local value or current CSS decision:
  representative long Latin, RTL, CJK, and symbol-heavy placeholder review
  states
- Semantic meaning:
  validation of bounded placeholder yield and rendering safety
- Reuse evidence:
  review-specific, not product semantic
- Token candidate or primitive candidate:
  local candidate
- Decision:
  keep local to verification and canonicals
- Rationale:
  these are evidence states, not token candidates.

## Promotion Rules Outcome

- Approved new semantic tokens:
  none
- Existing base tokens explicitly approved for `search-shell` reuse:
  `--surface-1`, `--line`, `--ink`, `--search-border`,
  `--search-placeholder`, `--radius-sm`, `--accent`
- Primitive candidates identified:
  bounded secondary search-shell primitive, active Enter-hint behavior, and
  width-pressure coexistence with breadcrumb
- Local-only decisions intentionally retained:
  `40rem` max-width, input padding, suffix spacing, mobile full-width switch,
  and localization stress-fixture values
- Deferred candidates:
  search-shell spacing aliases, focus-state aliases, and any future search
  motion tokens

## Follow-Up

- Pattern artifact updated:
  yes; token contract should reference this outcome
- Component artifact updated:
  not yet; shared component extraction still depends on first governed consumer
- Reference pack impact:
  none; parity targets stay the same
- Verification checklist impact:
  checklist can move from token-review pending to first-consumer parity pending
- App adoption impact:
  shared-header search adoption can proceed while reusing approved base tokens
  and keeping bounded geometry local to the primitive
