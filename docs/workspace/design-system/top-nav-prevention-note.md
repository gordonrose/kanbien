# Top Nav Prevention Note

## Purpose

Capture the durable implementation lessons from the `/design-system` top-nav
stabilization work so future design-system extraction, application adoption,
and AI-assisted changes do not repeat the same failure modes.

This note is intentionally shorter than the underlying issue-reconciliation
history. It records the stable rules, not every intermediate attempt.

## When To Use This Note

Use this note when changing any of the following:

- top-nav layout or grid tracks
- brand lockup behavior under compression
- primary-nav overflow logic
- isolated top-nav preview surfaces used for sign-off or visual capture
- profile or overflow menu layering
- mobile takeover thresholds
- responsive shell behavior under RTL or magnification

## Stable Solution Rules

### 1. Use rendered-fit logic, not width guesses

The stable solution for the primary navigation is based on actual rendered fit:

- show the row
- show the overflow affordance
- hide trailing links one by one
- stop only when the rendered layout truly fits

Do not replace this with breakpoint-only behavior or inferred width arithmetic
unless a future design change is explicitly approved.

## 2. Treat the header as three competing regions

The top nav is a shell with three distinct regions:

- brand
- primary navigation
- utilities

Overflow decisions must respect all three. It is not enough to ask whether the
primary-nav container fits its own box; the nav must also avoid intruding into
the reserved utility area.

## 3. Protect fixed-identity geometry first

The brand mark is not a flexible element.

Preserve this order under layout pressure:

1. keep the brand mark’s proportions intact
2. allow the brand name beside it to yield first
3. move primary destinations into overflow
4. switch to mobile mode at the approved threshold

Do not let the brand mark squash just because the nav is crowded.

Long words must not silently break this contract. For the top-nav family:

- the brand name may yield before the brand mark distorts
- primary destinations should move to overflow or mobile fallback rather than
  breaking geometry
- overlong labels should truncate with ellipses where appropriate and expose
  the full label through a tooltip or equivalent lightweight reveal
- profile trigger and profile-menu labels should truncate, wrap safely inside
  their own surfaces, or yield into larger fallback patterns rather than
  distorting the shell

## 4. Do not allow the awkward `1 item + More` desktop state

The approved threshold is:

- stay in desktop mode while at least two primary destinations plus `More` can
  remain visible
- switch to mobile mode once the next step would leave only one destination
  plus `More`

This is a behavior lock, not merely an implementation detail.

## 5. Keep dynamic overflow and visible nav on one source of truth

The overflow menu must be generated from the same runtime link state that
determines which visible links are hidden.

Do not maintain a static overflow-menu list separately from the measured nav
row.

## 6. Protect against visual overlap, not only theoretical fit

A row can claim to fit while still producing a bad user-visible state.

The stable solution checks for:

- intrusion of the `More` button into the last visible nav item
- intrusion of the nav row into the utility region

Do not trust parent container width alone when child controls can visibly
escape.

## 7. Keep shell menus lightweight and transient

For this family, desktop shell menus are lightweight anchored surfaces.

Locked behavior:

- outside click closes them
- `Escape` closes them
- focus returns to the trigger
- deeper settings may open separate pages from menu links

Do not quietly grow the top-nav shell into a heavy in-shell preferences panel.

## 8. RTL should feel native, not merely mirrored

RTL support exists so the shell feels natural for RTL languages such as
Arabic.

That means:

- anchoring and alignment should mirror appropriately
- destination presentation should feel native for RTL reading direction
- do not assume a mechanically mirrored LTR layout is sufficient

## 9. Themes and primary-colour inheritance are part of the contract

The top-nav family is not theme-neutral scaffolding. It must remain correct
across the approved themes and inherit the shared primary-colour system
consistently.

That means:

- theme changes may alter surfaces, contrast, and emphasis styling
- theme changes must not alter the locked shell behaviors
- accent-derived states such as active, hover, focus, and selected treatments
  must stay in sync with the shared primary-colour selection
- top-nav styling must not hardcode an isolated accent model that drifts away
  from the wider design-system controls

## 10. Layering depends on parent stacking contexts

Top-nav overlays must sit above the row beneath them because the parent
stacking context allows it, not just because the dropdown itself has a larger
`z-index`.

When layering breaks, inspect the parent stacking order first.

## 11. Isolated preview states must still use real shell styling

When a dedicated preview route forces mobile or overflow states for visual
review, those preview states must still match the original signed-off shell
presentation.

Do not rely only on viewport media-query styling if the preview can force the
same state through explicit controls.

In practice, that means forced-mobile preview states must preserve:

- full-width mobile button treatment
- matching profile-button treatment
- matching submenu card treatment
- the same visual relationship between main mobile items and submenu items as
  the original mobile design-system demo

## What Kept Going Wrong

These were the main recurring failure modes:

- static overflow markup drifting away from runtime hidden-link state
- nav calculations trusting the nav box instead of the real header slot
- fixed-geometry identity elements being treated as flexible
- child controls visibly escaping while parent geometry still looked valid
- local overlay `z-index` values fighting the wrong parent stacking order
- responsive checks proving structure existed without proving the lived
  behavior was correct
- preview-only forced states falling back to raw browser styles because their
  styling existed only inside viewport media-query paths

## What Future Verification Must Prove

Before treating a top-nav change as stable, verify:

- brand mark keeps its proportions
- brand name can yield without distorting the brand mark
- desktop nav moves into overflow before overlap
- desktop mode does not continue into the `1 item + More` state
- overflow contents match the hidden links
- utilities remain separate from the primary nav
- profile and overflow menus layer above the sub-nav
- outside click and `Escape` dismiss transient shell surfaces
- RTL presentation feels native
- magnification prefers overflow or mobile collapse over crowding
- long labels do not break brand, primary-nav, or profile geometry
- truncated long labels expose the full value through tooltips or equivalent
  lightweight reveal
- approved themes preserve readability and behavior
- primary-colour inheritance stays consistent across shell states
- isolated preview states do not drift away from the original signed-off shell
  treatment

## Relationship To Other Artifacts

- Behavior intent:
  `docs/workspace/design-system/behavior-locks/top-nav-behavior-lock.md`
- Pattern definition:
  `docs/workspace/design-system/patterns/navigation-shell-pattern.md`
- Verification gate:
  `docs/workspace/design-system/verification/top-nav-verification-checklist.md`
- Adoption target:
  `docs/workspace/design-system/adoption/root-admin-shell-top-nav-adoption-note.md`

## Source Reconciliations

- `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-overflow-menu-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-slot-measurement-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-top-nav-layering-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-header-brand-geometry-regression.md`
