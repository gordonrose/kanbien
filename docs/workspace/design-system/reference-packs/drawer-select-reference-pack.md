# Drawer Select Reference Pack

## Purpose

Freeze the current `Drawer Select` child-seam reference target so the first
dedicated canonical set, browser verification, and future adoption work have a
concrete baseline.

This pack is intentionally narrower than the parent `Form Template` reference
pack. It records what the child seam owns while inheriting the signed-off
parent framing from `form-template`.

## Scope

- Family:
  `drawer-select`
- Status:
  signed-off child-seam reference baseline
- Current source surface:
  `/design-system/templates/form`
- Parent host family:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/drawer-select-verification-checklist.md`
- Recommended first canonical launcher:
  `/design-system/canonical-renderings/drawer-select`
- Current render-surface posture:
  persistence-backed child render surface exists at
  `/design-system/canonical-renderings/drawer-select/:ref`
- Legacy compatibility routes:
  `/design-system/canonicals/drawer-select`
  `/design-system/components/drawer-select`

## Signed-Off Rule Source

This pack inherits the approved child-seam behavior locks:

- `DS-001` through `DS-013` from
  `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into concrete child-seam reference targets.

## Current Surface Truth

- the seam currently lives inside `/design-system/templates/form`
- the signed-off parent framing remains the same:
  grouped form sections, parent labels, and header/footer action zoning
- two child instances exist today:
  - a descriptive `workspace collections` variant
  - a compact `tenant segments` attribute-card variant
- both instances share:
  - a trigger summary line and selected-count meta line
  - a right-side drawer with search
  - a `Selected` stack with removable chips
  - an `Available` stack with toggleable options
  - dedicated no-selected and no-search-match empty states
  - search-first open focus and modal-like keyboard containment while open
  - a fresh search field on each reopen so the available stack does not stay
    filtered from the previous session
- repo source and the approved live parent surface were reconciled in this pass
  for the empty-summary fallback:
  each instance now owns its own empty trigger noun instead of reusing
  `Choose collections` for every variant

## Ownership Boundary

- Parent-owned by `form-template`:
  page framing, section cadence, field grouping, helper/error placement in the
  parent field shell, and header/footer action zoning
- Child-owned by `drawer-select`:
  trigger summary and meta line, drawer open/close behavior, drawer header,
  search field behavior, `Selected` stack, `Available` stack, toggle/remove
  interactions, empty states, focus choreography, keyboard containment, and
  density-variant treatment
- Not owned by this child seam:
  the broader parent form overlay policy outside drawer-select-to-drawer-select
  coordination, page-shell layout, or parent section rhythm

## Required Reference States

The dedicated `Drawer Select` core canonical batch now covers these states.
This table is the current child-seam render truth for direct review.

| Ref ID | Target canonical route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `DSR-001` | `/design-system/canonical-renderings/drawer-select/DSR-001` | Descriptive resting trigger with compressed three-plus summary | Preserves the closed trigger posture plus the approved three-plus summary compression | canonical-created | Core resting baseline |
| `DSR-002` | `/design-system/canonical-renderings/drawer-select/DSR-002` | Descriptive variant open drawer with search plus visible `Selected` and `Available` stacks | Preserves the baseline drawer chassis for the child seam | canonical-created | Highest-priority open state |
| `DSR-003` | `/design-system/components/drawer-select?ref=DSR-003&width=940&state=collections-no-match&theme=normal&dir=ltr&zoom=0` | Descriptive variant open drawer with no search matches while selections still exist | Preserves the search-empty contract without losing the selected stack | canonical-created | Needed so search-empty truth is not left implicit |
| `DSR-004` | `/design-system/components/drawer-select?ref=DSR-004&width=940&state=collections-empty-open&theme=normal&dir=ltr&zoom=0` | Descriptive variant open drawer with no selected items | Preserves the selected-empty state and empty trigger-summary fallback path | canonical-created | Important because it exercises the empty fallback noun |
| `DSR-005` | `/design-system/components/drawer-select?ref=DSR-005&width=820&state=segments-open&theme=normal&dir=ltr&zoom=0` | Compact attribute-card variant open drawer | Preserves the approved compact density variant instead of treating the descriptive drawer as the only child reference | canonical-created | Prevents variant flattening |
| `DSR-006` | `/design-system/components/drawer-select?ref=DSR-006&width=940&state=collections-resting-two&theme=normal&dir=ltr&zoom=0` | Descriptive resting trigger with exact two-selection summary | Preserves the uncompressed exact-two summary rule | canonical-created | Covers one summary boundary |
| `DSR-007` | `/design-system/components/drawer-select?ref=DSR-007&width=940&state=collections-resting-one&theme=normal&dir=ltr&zoom=0` | Descriptive resting trigger with exact one-selection summary | Preserves the truthful single-selection summary rule | canonical-created | Covers one summary boundary |
| `DSR-008` | `/design-system/components/drawer-select?ref=DSR-008&width=940&state=collections-open-after-add&theme=normal&dir=ltr&zoom=0` | Descriptive open state after adding one available option | Preserves toggle synchronization after growth from the `Available` stack | canonical-created | Add-flow proof |
| `DSR-009` | `/design-system/components/drawer-select?ref=DSR-009&width=940&state=collections-open-after-remove&theme=normal&dir=ltr&zoom=0` | Descriptive open state after removing one selected chip | Preserves remove synchronization after shrink from the `Selected` stack | canonical-created | Remove-flow proof |
| `DSR-010` | `/design-system/components/drawer-select?ref=DSR-010&width=940&state=collections-empty-resting&theme=normal&dir=ltr&zoom=0` | Descriptive resting trigger with empty fallback summary | Preserves the closed empty trigger noun rather than only the open empty drawer | canonical-created | Closed empty state |
| `DSR-011` | `/design-system/components/drawer-select?ref=DSR-011&width=820&state=segments-resting&theme=normal&dir=ltr&zoom=0` | Compact resting trigger with populated summary | Preserves the compact resting state without forcing open review only | canonical-created | Compact closed baseline |
| `DSR-012` | `/design-system/components/drawer-select?ref=DSR-012&width=820&state=segments-empty-resting&theme=normal&dir=ltr&zoom=0` | Compact resting trigger with empty fallback summary | Preserves the compact empty trigger noun | canonical-created | Compact closed empty state |
| `DSR-013` | `/design-system/components/drawer-select?ref=DSR-013&width=820&state=segments-empty-open&theme=normal&dir=ltr&zoom=0` | Compact open state with no selected items | Preserves the compact selected-empty drawer state | canonical-created | Compact empty state |
| `DSR-014` | `/design-system/components/drawer-select?ref=DSR-014&width=820&state=segments-no-match&theme=normal&dir=ltr&zoom=0` | Compact open state with no search matches | Preserves compact search-empty behavior | canonical-created | Compact search-empty state |
| `DSR-015` | `/design-system/components/drawer-select?ref=DSR-015&width=940&state=collections-open&theme=normal&dir=rtl&zoom=0` | RTL descriptive open drawer review | Preserves child-seam structure under RTL directionality | canonical-created | First RTL child render |
| `DSR-016` | `/design-system/components/drawer-select?ref=DSR-016&width=820&state=segments-open&theme=dark&dir=ltr&zoom=100` | Dark and magnified compact open review | Preserves compact child-seam legibility under visual stress | canonical-created | First theme and magnification stress render |
| `DSR-017` | `/design-system/components/drawer-select?ref=DSR-017&width=390&state=collections-open&theme=normal&dir=ltr&zoom=0` | Mobile descriptive open drawer review | Preserves the narrow overlay posture for the descriptive variant | canonical-created | First mobile descriptive render |
| `DSR-018` | `/design-system/components/drawer-select?ref=DSR-018&width=390&state=segments-open&theme=normal&dir=ltr&zoom=0` | Mobile compact open drawer review | Preserves the narrow overlay posture for the compact attribute-card variant | canonical-created | First mobile compact render |
| `DSR-019` | `/design-system/components/drawer-select?ref=DSR-019&width=940&state=collections-open-long&theme=normal&dir=ltr&zoom=0` | Descriptive open drawer with long-label stress | Preserves descriptive readability under extended labels and helper copy | canonical-created | Long-label descriptive stress |
| `DSR-020` | `/design-system/components/drawer-select?ref=DSR-020&width=820&state=segments-open-long&theme=normal&dir=ltr&zoom=0` | Compact open drawer with long-label stress | Preserves compact attribute-card readability under extended labels and attributes | canonical-created | Long-label compact stress |
| `DSR-021` | `/design-system/components/drawer-select?ref=DSR-021&width=940&state=collections-open-localized&theme=normal&dir=rtl&zoom=0` | Localized RTL descriptive open drawer review | Preserves translated child-owned copy on the descriptive seam under RTL directionality | canonical-created | Localized descriptive stress |
| `DSR-022` | `/design-system/components/drawer-select?ref=DSR-022&width=820&state=segments-open-localized&theme=normal&dir=rtl&zoom=0` | Localized RTL compact open drawer review | Preserves translated child-owned copy on the compact seam under RTL directionality | canonical-created | Localized compact stress |
| `DSR-023` | `/design-system/components/drawer-select?ref=DSR-023&width=940&state=collections-resting-disabled&theme=normal&dir=ltr&zoom=0` | Disabled descriptive resting review | Preserves inherited disabled hosting without losing the descriptive summary truth | canonical-created | Disabled descriptive inheritance |
| `DSR-024` | `/design-system/components/drawer-select?ref=DSR-024&width=820&state=segments-resting-disabled&theme=normal&dir=ltr&zoom=0` | Disabled compact resting review | Preserves inherited disabled hosting on the compact trigger | canonical-created | Disabled compact inheritance |
| `DSR-025` | `/design-system/components/drawer-select?ref=DSR-025&width=820&state=segments-open-dark&theme=dark&dir=ltr&zoom=0` | Dark compact open review | Preserves dark-theme compact readability without conflating theme stress with magnification | canonical-created | Clean dark-theme parity state |
| `DSR-026` | `/design-system/components/drawer-select?ref=DSR-026&width=390&state=collections-open-mobile-dark&theme=dark&dir=ltr&zoom=0` | Dark mobile descriptive open drawer review | Preserves the narrow descriptive overlay posture under dark theme | canonical-created | Dark mobile descriptive stress |
| `DSR-027` | `/design-system/canonical-renderings/drawer-select/DSR-027` | Dark mobile compact open drawer review | Preserves the narrow compact overlay posture under dark theme | canonical-created | Dark mobile compact stress |

## High-Risk Review Batch

The highest-risk review states are:

- `DSR-002` descriptive variant open drawer
- `DSR-003` search no-match with existing selections
- `DSR-004` no-selected state
- `DSR-005` compact attribute-card variant open drawer
- `DSR-008` add-flow synchronization
- `DSR-009` remove-flow synchronization
- `DSR-015` RTL descriptive open drawer
- `DSR-016` dark and magnified compact open review
- `DSR-017` mobile descriptive open drawer
- `DSR-018` mobile compact open drawer
- `DSR-019` descriptive long-label open drawer
- `DSR-020` compact long-label open drawer
- `DSR-021` localized RTL descriptive open drawer
- `DSR-022` localized RTL compact open drawer
- `DSR-025` dark compact open review
- `DSR-026` dark mobile descriptive open drawer
- `DSR-027` dark mobile compact open drawer

These are the states most likely to drift because they prove the seam's open
chassis, honest empty behavior, variant boundary, and generic trigger-summary
contract.

## Evidence Status

- the child seam now has a dedicated behavior lock and verification checklist
- the seam has route-level browser proof for focus containment plus
  search/toggle/remove synchronization
- a persistence-backed generated `drawer-select` canonical launcher now exists at
  `/design-system/canonical-renderings/drawer-select`
- the `DSR-001` through `DSR-027` core plus stress batch now renders on the dedicated
  `/design-system/canonical-renderings/drawer-select/:ref` route
- legacy compatibility routes remain available at
  `/design-system/canonicals/drawer-select`
  and `/design-system/components/drawer-select`
- launcher and shell coverage now assert the child route directly rather than
  reopening states on the parent template
- approved-host screenshot parity now covers desktop descriptive, desktop compact,
  dark compact, plus normal and dark mobile descriptive/compact open states
  where a clean one-to-one source seam exists

## Parity Rule

A future extracted primitive, later form consumer, or real-app adoption matches
this child-seam pack only when:

- it preserves the approved `DS-*` behaviors
- it preserves the `DSR-*` state set or approved equivalents
- it inherits parent framing from the relevant host template instead of
  redefining page rhythm locally
- any app-versus-preview differences are recorded explicitly before parity is
  claimed

## Exit Condition

This reference pack becomes operational when:

- the `DSR-*` state set is reviewed directly from a dedicated launcher or
  approved equivalent renderer
- browser verification continues to prove the focus and synchronization
  behavior named here
- any later adoption artifact is written from this child-seam pack rather than
  assuming the parent template alone is sufficient sign-off

The `DSR-*` state set has been visually approved by the user and is the
signed-off child-seam baseline. Do not treat this as `system-ready` until a
second governed consumer proves reuse without copying parent-hosted form
behavior.
