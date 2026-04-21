# List Detail Split Layout Reference Pack

## Purpose

Freeze the current `ListDetailSplitLayout` child seam baseline so child-specific
canonicals can be reviewed against named reference targets instead of against
loose memory of the parent `List Page` route.

This pack is more concrete than the child behavior lock and narrower than the
broader parent template. It records the exact master-detail lane states the
child canonical set must preserve.

## Scope

- Family:
  `list-detail-split-layout`
- Status:
  signed-off child reference baseline
- Current source surface:
  `/design-system/templates/list-page`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-detail-split-layout-behavior-lock.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-detail-split-layout-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-detail-split-layout-component.md`
- Existing executable verification:
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`
  `tests/visual/designSystem/canonicals/data-display/listDetailSplitLayout.spec.ts`

## Signed-Off Rule Source

This pack inherits the approved child-seam rules from:

- `LDSL-BL-001` through `LDSL-BL-010` in
  `docs/workspace/design-system/behavior-locks/list-detail-split-layout-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into named reference targets for child review.

## What This Pack Inherits

This child pack inherits, but does not redefine:

- parent selection and close choreography
- search, empty, no-results, and load-state governance
- parent live-region announcements and focus-return rules
- `ListRecordCard` internal anatomy
- `ListDetailPanel` internal anatomy

Those remain governed upstream by the parent `List Page` chain and the two
signed-off child seams.

## Current Surface Truth

- the current child seam is the lane relationship rendered inside
  `/design-system/templates/list-page`
  - the surface currently includes:
  - a single-lane closed list state
  - a desktop pushed split with list and detail lanes
  - a mobile full-sheet detail overlay state
  - browser-owned page scrolling in the closed single-lane state
  - independent list and detail scrolling in the open desktop split state
  - RTL mirrored split placement
  - magnified long-content pressure review
- the seam can already express:
  - closed single-lane desktop review
  - open desktop split review
  - independent scroll-lane pressure
  - mobile overlay review
  - shell layering review beneath shared chrome
  - RTL open split review
  - magnified half-page review
  - local theme-scoped review

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `LDSLR-001` | `/design-system/components/list-detail-split-layout?ref=LDSL-001&width=1080&state=closed&theme=normal&dir=ltr&zoom=0` | Desktop closed baseline | Preserves the one-lane closed state before detail opens | canonical-created | Split lane absent when nothing is selected |
| `LDSLR-002` | `/design-system/components/list-detail-split-layout?ref=LDSL-002&width=1080&state=open&theme=normal&dir=ltr&zoom=0` | Desktop open split baseline | Preserves the standard pushed two-lane relationship | canonical-created | First child review anchor |
| `LDSLR-003` | `/design-system/components/list-detail-split-layout?ref=LDSL-003&width=1080&state=scroll&theme=normal&dir=ltr&zoom=0` | Independent scroll-lane pressure | Preserves the rule that list and detail remain separate reading lanes under longer content | canonical-created | Dedicated split-lane pressure state |
| `LDSLR-004` | `/design-system/components/list-detail-split-layout?ref=LDSL-004&width=390&state=mobile&theme=normal&dir=ltr&zoom=0` | Mobile full-sheet overlay | Preserves the narrow-width overlay reading model | canonical-created | Child mobile layout proof |
| `LDSLR-005` | `/design-system/components/list-detail-split-layout?ref=LDSL-005&width=390&state=mobile-layering&theme=normal&dir=ltr&zoom=0` | Mobile overlay beneath shell chrome | Preserves the layering rule that shell overlays stay above the mobile detail sheet | canonical-created | Child layering proof |
| `LDSLR-006` | `/design-system/components/list-detail-split-layout?ref=LDSL-006&width=1080&state=open&theme=normal&dir=rtl&zoom=0` | RTL desktop split review | Preserves mirrored lane placement in RTL | canonical-created | Child-level RTL proof |
| `LDSLR-007` | `/design-system/components/list-detail-split-layout?ref=LDSL-007&width=820&state=zoom&theme=normal&dir=ltr&zoom=100` | Magnified half-page split review | Preserves the split relationship under tighter width and zoom pressure | canonical-created | Child magnification proof |
| `LDSLR-008` | `/design-system/components/list-detail-split-layout?ref=LDSL-008&width=1080&state=open&theme=dark&dir=ltr&zoom=0` | Dark theme open split | Preserves lane readability under dark theme | canonical-created | Theme scope stays local |
| `LDSLR-009` | `/design-system/components/list-detail-split-layout?ref=LDSL-009&width=1080&state=open&theme=desert&dir=ltr&zoom=0` | Desert theme open split | Preserves parity beyond the default palette | canonical-created | Theme scope stays local |
| `LDSLR-010` | `/design-system/components/list-detail-split-layout?ref=LDSL-010&width=720&state=squashed&theme=normal&dir=ltr&zoom=100` | Squashed-split fallback review | Must prove that when both lanes become too constrained, the seam falls back to the approved overlay or single-lane posture instead of preserving an unreadable split | canonical-created | Non-mobile fallback proof under stronger width and zoom pressure |

## High-Risk Review Batch

The highest-risk review states are:

- `LDSLR-001` desktop closed baseline
- `LDSLR-002` desktop open split baseline
- `LDSLR-003` independent scroll-lane pressure
- `LDSLR-004` mobile full-sheet overlay
- `LDSLR-005` mobile overlay beneath shell chrome
- `LDSLR-006` RTL desktop split review
- `LDSLR-007` magnified half-page split review
- `LDSLR-010` squashed-split fallback review

These states carry the biggest drift risk because they prove the lane
relationship itself rather than only inner card or panel anatomy.

## Parity Rule

A future extracted split-layout implementation or real consumer matches this
pack only when:

- it satisfies the locked `LDSL-BL-*` child behaviors
- it preserves the required `LDSLR-*` states or approved equivalents
- any difference from the parent `List Page` route is recorded explicitly
  rather than assumed from the child artifact alone

## Exit Condition

This child reference pack is now operational because:

- the `LDSLR-*` states have been reviewed directly from the dedicated child
  canonical launcher
- the verification checklist points at this child pack explicitly
- child canonical sign-off now references this pack as the named baseline
