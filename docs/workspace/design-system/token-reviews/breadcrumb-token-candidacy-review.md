# Design System Token Candidacy Review

## Scope

- Family:
  `breadcrumb`
- Review date:
  2026-04-16
- Current promotion state:
  signed-off, reference-backed, and fully Playwright-locked at the breadcrumb
  canonical-state level
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/breadcrumb-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/breadcrumb-reference-pack.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/breadcrumb-pattern.md`

## Purpose

Use this review to decide which visual decisions in the signed-off
`breadcrumb` family should:

- stay local to the family
- remain dependent on existing base tokens
- become reusable primitives instead of tokens

The breadcrumb now has durable evidence, but most of the fragile work we
captured in this loop lives in ordering, reduction, and recovery behavior, not
in new semantic values.

## Eligibility Check

- Reference-backed and behavior-locked:
  yes
- Rendered evidence captured:
  yes
- Playwright or equivalent parity gate exists:
  yes
- At least one other family or planned consumer can reuse the decision:
  yes; `rootAdminShell` page chrome and future routed shells with wayfinding
- Token extraction is needed before app adoption:
  yes, mainly to confirm base-token reuse and avoid inventing breadcrumb-only
  aliases

## Candidate Decisions

### Color

- Local value or current CSS decision:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`, `--tooltip-bg`, `--tooltip-fg`
- Semantic meaning:
  breadcrumb button surfaces, separators, current-page emphasis, and tooltip
  reveal treatment
- Reuse evidence:
  already shared with other governed shell controls and tooltip surfaces
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens
- Rationale:
  the breadcrumb family already inherits an appropriate reusable token layer
  without needing breadcrumb-specific aliases.

### Radius And Border

- Local value or current CSS decision:
  `--radius-sm`, `--line`, `--line-strong`
- Semantic meaning:
  breadcrumb button edges and current-state border contrast
- Reuse evidence:
  reused across shell controls and compact/overflow states
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens
- Rationale:
  current reuse is already represented by the base token set.

### Shadow And Elevation

- Local value or current CSS decision:
  `--shadow`, `--tooltip-shadow`
- Semantic meaning:
  breadcrumb recovery menu elevation and tooltip elevation
- Reuse evidence:
  shared with other floating design-system surfaces
- Token candidate or primitive candidate:
  token candidate
- Decision:
  keep as existing base tokens
- Rationale:
  the right shared unit is the current elevation token layer, not a
  breadcrumb-specific variant.

### Spacing And Density

- Local value or current CSS decision:
  breadcrumb gap, separator spacing, button padding, and menu spacing values
- Semantic meaning:
  trail readability and compact control density
- Reuse evidence:
  some likely reuse with other shell controls, but not enough extracted
  evidence to define breadcrumb-specific spacing semantics
- Token candidate or primitive candidate:
  token candidate
- Decision:
  defer semantic spacing-token promotion
- Rationale:
  the values are stable enough for the family, but not yet proven enough for a
  broader semantic spacing map.

### Reduction And Recovery Behavior

- Local value or current CSS decision:
  hide `Page -1`, then hide collapsed middle, then compact signpost mode; keep
  current page visible; expose hidden steps through menus
- Semantic meaning:
  breadcrumb-specific pressure-response and recovery behavior
- Reuse evidence:
  highly relevant wherever breadcrumb exists, but depends on structure and
  behavior rather than shared values
- Token candidate or primitive candidate:
  primitive candidate
- Decision:
  keep as primitive-level behavior, not tokens
- Rationale:
  this is the core breadcrumb seam and should be governed as behavior and
  structure, not as token values.

### Truncation And Tooltip Reveal

- Local value or current CSS decision:
  truncation clamping, ellipsis behavior, and shared top-overlay tooltip reveal
- Semantic meaning:
  breadcrumb recovery for long labels
- Reuse evidence:
  tooltip tokens are broadly reusable; truncation clamps are family-local
- Token candidate or primitive candidate:
  mixed token and primitive candidate
- Decision:
  keep tooltip styling as shared tokens; keep truncation/clamp behavior local
  to the breadcrumb primitive
- Rationale:
  the visual overlay treatment is shared, but the exact breadcrumb truncation
  contract is not a reusable token.

### Compact Signpost Iconography

- Local value or current CSS decision:
  compact signpost icon size, mirrored RTL signpost treatment, and signpost
  trigger structure
- Semantic meaning:
  breadcrumb compact recovery affordance
- Reuse evidence:
  specific to breadcrumb compact mode
- Token candidate or primitive candidate:
  primitive/local candidate
- Decision:
  keep local to the breadcrumb primitive
- Rationale:
  this is a family-specific recovery control, not a semantic token decision.

## Promotion Rules Outcome

- Approved new semantic tokens:
  none
- Existing base tokens explicitly approved for `breadcrumb` reuse:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`, `--radius-sm`, `--shadow`, `--tooltip-bg`, `--tooltip-fg`,
  `--tooltip-shadow`
- Primitive candidates identified:
  breadcrumb trail primitive, collapsed-middle recovery menu, compact signpost
  recovery trigger, and truncated-label reveal behavior
- Local-only decisions intentionally retained:
  reduction order, menu anchoring offsets, compact signpost geometry, truncation
  clamps, and separator spacing
- Deferred candidates:
  breadcrumb spacing aliases, current-item emphasis aliases, and any future
  breadcrumb-specific motion tokens

## Follow-Up

- Pattern artifact updated:
  yes; token contract should point to this outcome
- Component artifact updated:
  not yet; shared component extraction is still deferred behind real app
  consumer proof
- Reference pack impact:
  none; parity targets remain the same
- Verification checklist impact:
  checklist can move from token-review pending to app-adoption parity pending
- App adoption impact:
  breadcrumb adoption can proceed while reusing existing base tokens and
  keeping reduction/recovery behavior inside the primitive seam
