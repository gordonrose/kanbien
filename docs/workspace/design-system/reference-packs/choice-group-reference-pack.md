# Choice Group Reference Pack

## Purpose

Freeze the current `Choice Group` child-seam candidate baseline so later
extraction discussion can compare against named grouped-choice reference states
instead of memory of the broader `Form Template` parent route.

This pack is narrower than the parent template and more concrete than the child
behavior lock. It records what the seam currently owns while staying honest
about what still remains parent-owned.

## Scope

- Family:
  `choice-group`
- Status:
  approved exploratory child reference baseline
- Current source surface:
  `/design-system/templates/form`
- Host parent family:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/choice-group-behavior-lock.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/choice-group-verification-checklist.md`
- Current canonical posture:
  persistence-backed generated child canonical launcher at
  `/design-system/canonical-renderings/choice-group`
  and generated child render surface at
  `/design-system/canonical-renderings/choice-group/:ref`
  with legacy compatibility routes retained at
  `/design-system/canonicals/choice-group`
  and `/design-system/components/choice-group`

## Signed-Off Rule Source

This pack inherits the approved child-seam rules from:

- `CG-BL-001` through `CG-BL-016` in
  `docs/workspace/design-system/behavior-locks/choice-group-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into named exploratory reference targets.

## What This Pack Inherits

This child pack inherits, but does not redefine:

- parent page shell and section cadence
- parent helper/error framing outside the fieldset shell
- parent review-state toggles for `errors`, `disabled`, and `mobile`
- parent theme and direction controls
- parent grid-span and release-checklist composition choices

Those remain governed upstream by the parent `Form Template` chain.

## Current Surface Truth

- the current child-seam candidate lives inside the `Preferences` section of
  `/design-system/templates/form`
- the seam currently includes three grouped-choice variants:
  - `Radio buttons`
  - `Checkboxes`
  - `Checkboxes with shared statement`
- all three variants currently share:
  - a `fieldset` shell
  - a visible legend
  - a stacked row list
  - full-row label/control activation
  - native radio or checkbox controls
  - a copy stack per row with primary and secondary text
  - focus-visible row emphasis when keyboard focus enters a control
  - an inline group-error slot
- current child-seam theme and RTL expectations are now proved on the
  persistence-backed child render surface, while the remaining focus and
  combined-state stress proof still stays parent-hosted
- the shared-statement variant currently adds:
  - one lead statement block above the row stack
  - full-width host placement through the parent grid
  - release-checklist copy that is still host-specific
- current parent-hosted executable proof now covers:
  - default baseline distinction between the three variants
  - inline group-error visibility in parent error review mode
  - disabled non-interactive posture in `mobile + RTL` parent review
  - dark-theme readability for legend, statement, row, and error separation
  - RTL row mirroring between the control and copy stack
  - row-level focus visibility without geometry shift
  - combined `error + disabled` readability for grouped rows and local errors
  - longer-label wrapping on narrow mobile review
  - localized Arabic copy readability in RTL review

## Ownership Boundary

- Parent-owned by `form-template`:
  section placement, field-grid span, host helper cadence, surrounding field
  framing, and the specific release-checklist context of the shared-statement
  example
- Child-owned by `choice-group`:
  fieldset shell, legend, stacked option rows, shared row anatomy, optional
  shared lead statement block, and inline group-error slot
- Not owned by this child seam:
  page layout, section rhythm, action zoning, or parent review-toggle APIs

## Required Reference States

These are the current exploratory child reference states.
The first canonical review batch now has a persistence-backed generated child
launcher and render surface, while the remaining states still rely on
parent-hosted proof.

| Ref ID | Current route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `CGR-001` | `/design-system/canonical-renderings/choice-group/CGR-001` | Radio-group baseline | Preserves the child seam’s single-select grouped-choice shell | canonical-created | Generated child render now shows the baseline directly from persisted canonical truth |
| `CGR-002` | `/design-system/canonical-renderings/choice-group/CGR-002` | Standard checkbox-group baseline | Preserves the child seam’s multi-select grouped-choice shell without the shared-statement variant | canonical-created | Generated child render now shows the checkbox baseline directly |
| `CGR-003` | `/design-system/canonical-renderings/choice-group/CGR-003` | Shared-statement checkbox baseline | Preserves the lead-statement variant without flattening it into a generic checkbox stack | canonical-created | Generated child render intentionally avoids freezing host-wide grid span |
| `CGR-004` | `/design-system/canonical-renderings/choice-group/CGR-004` | Inline group-error review for all grouped-choice variants | Preserves local error visibility at the fieldset seam | canonical-created | Generated child render now shows all three variants together |
| `CGR-005` | `/design-system/templates/form?disabled=true&mobile=true&dir=rtl` | Disabled mobile RTL grouped-choice review | Preserves inherited stress-state readability and non-interactive truthfulness | covered-by-test | Still parent-owned review framing |
| `CGR-006` | `/design-system/canonical-renderings/choice-group/CGR-006` | Dark-theme grouped-choice readability review | Preserves readable separation between legend, statement, row, and error surfaces under inherited dark theme stress | canonical-created | Theme scope is isolated to the generated child render surface |
| `CGR-007` | `/design-system/canonical-renderings/choice-group/CGR-007` | RTL grouped-choice row mirroring review | Preserves the mirrored control-to-copy relationship instead of only mirrored text alignment | canonical-created | Directionality is scoped to the generated child render surface |
| `CGR-008` | `/design-system/templates/form?errors=true&disabled=true` | Combined error and disabled grouped-choice review | Preserves local error readability while rows still clearly read as unavailable | covered-by-test | Parent-hosted combined-state proof |
| `CGR-009` | `/design-system/templates/form` | Grouped-choice row focus-visible review | Preserves row-level focus emphasis for keyboard users without geometry shift or attribution loss | covered-by-test | Parent-hosted proof focuses the first radio row directly |
| `CGR-010` | `/design-system/canonical-renderings/choice-group/CGR-010` | Narrow mobile long-copy wrapping review | Preserves readable stacked row structure when grouped-choice labels and descriptions grow beyond baseline copy length | canonical-created | Generated child render mutates grouped-copy directly for narrow-width stress |
| `CGR-011` | `/design-system/canonical-renderings/choice-group/CGR-011` | Localized Arabic RTL grouped-choice review | Preserves readable localized row copy and mirrored control placement under inherited RTL mobile stress | canonical-created | Generated child render mutates localized copy directly for RTL mobile review |

## First Canonical Review Set

The first direct child review batch now lives on:

- `/design-system/canonical-renderings/choice-group`
- `/design-system/canonical-renderings/choice-group/:ref`

Legacy compatibility routes remain available at:

- `/design-system/canonicals/choice-group`
- `/design-system/components/choice-group`

That initial visual approval set includes:

- `CGR-001` radio baseline
- `CGR-002` standard checkbox baseline
- `CGR-003` shared-statement baseline
- `CGR-004` inline group-error review
- `CGR-006` dark-theme readability review
- `CGR-007` RTL row mirroring review
- `CGR-010` narrow mobile long-copy review
- `CGR-011` localized Arabic RTL review

This first child batch has now been visually approved by the user on the
dedicated child surface.

`CGR-005`, `CGR-008`, and `CGR-009` still remain parent-hosted proof only for
now, so this child canonical set is exploratory rather than fully complete.

## High-Risk Review Batch

The highest-risk exploratory states are:

- `CGR-003` shared-statement checkbox baseline
- `CGR-004` inline group-error review
- `CGR-005` disabled mobile RTL review
- `CGR-006` dark-theme grouped-choice readability review
- `CGR-007` RTL grouped-choice row mirroring review
- `CGR-008` combined error and disabled grouped-choice review
- `CGR-009` row focus-visible review
- `CGR-010` narrow mobile long-copy wrapping review
- `CGR-011` localized Arabic RTL review

These states carry the biggest drift risk because they prove the seam’s unique
shared-statement boundary, local validation treatment, and inherited stress
behavior without yet having a dedicated child route.

Theme contrast, focus visibility, combined `error + disabled` readability, and
long-content/localization pressure are especially high-risk because they are
now child-locked expectations without direct child-owned render states yet.

## Evidence Status

- the child seam candidate now has a dedicated behavior lock and verification
  checklist
- parent-hosted Playwright proof exists in
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
- parent-hosted Playwright proof still exists in
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts` for the remaining non-child
  route states
- a persistence-backed generated child canonical launcher now exists at
  `/design-system/canonical-renderings/choice-group`
- a persistence-backed generated child render surface now exists at
  `/design-system/canonical-renderings/choice-group/:ref`
- legacy compatibility routes remain available at
  `/design-system/canonicals/choice-group`
  and `/design-system/components/choice-group`
- no second governed consumer exists yet in the repo
- `CGR-005`, `CGR-008`, and `CGR-009` still remain parent-hosted proof rather
  than dedicated child-route proof

## Readiness Gate

`Choice Group` becomes ready for a dedicated child canonical set only when at
least one of these is true:

- a second governed surface uses the same grouped-choice chassis honestly
- a dedicated child render surface is introduced without smuggling in parent
  layout ownership
- the current parent-hosted `CGR-*` set is intentionally expanded into a full
  child-owned proof matrix and reviewed as such

## Parity Rule

A future extracted `Choice Group` implementation or real consumer matches this
pack only when:

- it preserves the approved `CG-BL-*` behaviors
- it preserves the exploratory `CGR-*` states or approved child-owned
  equivalents
- any host-specific difference from the current parent `Form Template` route is
  recorded explicitly before parity is claimed

## Exit Condition

This reference pack is now operational through the generated child launcher at
`/design-system/canonical-renderings/choice-group` and the generated render
surface at `/design-system/canonical-renderings/choice-group/:ref`, with the
legacy launcher and legacy render route retained for compatibility during the
migration.

The first child canonical batch is visually approved, but do not treat this as
a signed-off extracted family baseline until the remaining parent-hosted states
are either pulled into the child surface or intentionally kept parent-owned as
part of a stable long-term boundary.
