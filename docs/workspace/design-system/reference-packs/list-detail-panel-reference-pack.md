# List Detail Panel Reference Pack

## Purpose

Freeze the current `ListDetailPanel` child seam baseline so child-specific
canonicals can be reviewed against named reference targets instead of against
loose memory of the parent `List Page` route.

This pack is more concrete than the child behavior lock and narrower than the
broader parent template. It records the exact detail-surface states the child
canonical set must preserve.

## Scope

- Family:
  `list-detail-panel`
- Status:
  signed-off child reference baseline
- Current source surface:
  `/design-system/templates/list-page`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-detail-panel-behavior-lock.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-detail-panel-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-detail-panel-component.md`
- Existing executable verification:
  `tests/visual/designSystem/listPage.spec.ts`
  `tests/visual/designSystem/listDetailPanel.spec.ts`

## Signed-Off Rule Source

This pack inherits the approved child-seam rules from:

- `LDP-BL-001` through `LDP-BL-015` in
  `docs/workspace/design-system/behavior-locks/list-detail-panel-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into named reference targets for child review.

## What This Pack Inherits

This child pack inherits, but does not redefine:

- parent selection and close choreography
- parent split-layout placement
- mobile dialog semantics
- shell stacking and overlay ordering

Those remain governed upstream by the parent `List Page` chain.

## Current Surface Truth

- the current child seam is the open detail surface rendered inside
  `/design-system/templates/list-page`
- the surface currently includes:
  - metadata line
  - title
  - optional subtitle
  - header action row
  - explicit close control
  - scrollable body content
  - optional tag row
  - local detail error treatment
  - footer `Previous` and `Next` controls
- body overflow currently lives in the detail-body region rather than requiring
  the outer panel to become the primary scroll lane
- compact metadata currently truncates with tooltip recovery in the long-content
  parent state
- title and body content currently wrap rather than truncate
- the panel can already express:
  - missing secondary fields
  - local detail error
  - terminal footer state
  - RTL control mirroring
  - magnified long-content pressure
  - automatic header compaction after scroll begins when header pressure is
    disproportionately tall

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `LDPR-001` | `/design-system/components/list-detail-panel?ref=LDP-001&width=760&state=baseline&theme=normal&dir=ltr&zoom=0` | Desktop baseline populated panel | Preserves the default open-panel anatomy with all primary zones visible | canonical-created | First child review anchor |
| `LDPR-002` | `/design-system/components/list-detail-panel?ref=LDP-002&width=760&state=missing&theme=normal&dir=ltr&zoom=0` | Missing secondary fields | Preserves omission behavior for absent metadata, subtitle, and tags | canonical-created | No noisy empty placeholders |
| `LDPR-003` | `/design-system/components/list-detail-panel?ref=LDP-003&width=760&state=error&theme=normal&dir=ltr&zoom=0` | Local detail error state | Preserves the rule that detail failure stays inside the panel body | canonical-created | Header and footer remain intact |
| `LDPR-004` | `/design-system/components/list-detail-panel?ref=LDP-004&width=760&state=boundary&theme=normal&dir=ltr&zoom=0` | Terminal footer boundary | Preserves honest disabled-next behavior with a terminal hint | canonical-created | Boundary state remains explicit |
| `LDPR-005` | `/design-system/components/list-detail-panel?ref=LDP-005&width=520&state=long&theme=normal&dir=ltr&zoom=0` | Half-page long-content review | Preserves body scrolling, metadata truncation, and wrapped title/body under tighter width | canonical-created | Primary constrained-width review state |
| `LDPR-006` | `/design-system/components/list-detail-panel?ref=LDP-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0` | Mobile narrow stack review | Preserves stacked header zoning and readable control layout in a narrow child lane | canonical-created | Child-only mobile-width review, not modal-shell proof |
| `LDPR-007` | `/design-system/components/list-detail-panel?ref=LDP-007&width=520&state=long&theme=normal&dir=rtl&zoom=0` | RTL half-page review | Preserves mirrored copy alignment and footer/action ordering inside the child seam | canonical-created | Child-level RTL proof |
| `LDPR-008` | `/design-system/components/list-detail-panel?ref=LDP-008&width=520&state=long&theme=normal&dir=ltr&zoom=100` | Magnified half-page review | Preserves readability and footer recovery under higher reading pressure, including scroll-triggered header compaction when the expanded header is too tall | canonical-created | Child-level magnification proof |
| `LDPR-009` | `/design-system/components/list-detail-panel?ref=LDP-009&width=760&state=focus-close&theme=normal&dir=ltr&zoom=0` | Focus-entry close control review | Preserves geometry-safe visible focus on a high-priority control | canonical-created | Child focus-visible review state |
| `LDPR-010` | `/design-system/components/list-detail-panel?ref=LDP-010&width=760&state=baseline&theme=dark&dir=ltr&zoom=0` | Dark theme baseline | Preserves control and text readability under dark theme | canonical-created | Theme scope stays local |
| `LDPR-011` | `/design-system/components/list-detail-panel?ref=LDP-011&width=760&state=baseline&theme=desert&dir=ltr&zoom=0` | Desert theme baseline | Preserves theme parity beyond the normal default palette | canonical-created | Theme scope stays local |

## High-Risk Review Batch

The highest-risk review states are:

- `LDPR-001` desktop baseline populated panel
- `LDPR-003` local detail error state
- `LDPR-005` half-page long-content review
- `LDPR-006` mobile narrow stack review
- `LDPR-007` RTL half-page review
- `LDPR-009` focus-entry close control review

These states carry the biggest drift risk because they prove child-level zoning,
overflow, resilience, constrained-width behavior, RTL, and focus visibility.

## Parity Rule

A future extracted detail-panel implementation or real consumer matches this
pack only when:

- it satisfies the locked `LDP-BL-*` child behaviors
- it preserves the required `LDPR-*` states or approved equivalents
- any difference from the parent `List Page` route is recorded explicitly
  rather than assumed from the child artifact alone

## Exit Condition

This child reference pack becomes operational when:

- the `LDPR-*` states are reviewed directly from the dedicated child canonical
  launcher
- the verification checklist points at this child pack explicitly
- later sign-off asks for this pack review before child canonical sign-off

Reference-pack sign-off is now recorded for this child seam. The remaining
human review gate is the `LDP-*` canonical set.
