# List Record Card Reference Pack

## Purpose

Freeze the current `ListRecordCard` child seam baseline so child-specific
canonicals can be reviewed against named reference targets instead of against
loose memory of the parent `List Page` route.

This pack is more concrete than the child behavior lock and narrower than the
broader parent template. It records the exact card states the child canonical
set must preserve.

## Scope

- Family:
  `list-record-card`
- Status:
  signed-off child reference baseline
- Current source surface:
  `/design-system/templates/list-page`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-record-card-behavior-lock.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-record-card-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-record-card-component.md`
- Existing executable verification:
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`
  `tests/visual/designSystem/canonicals/data-display/listRecordCard.spec.ts`

## Signed-Off Rule Source

This pack inherits the approved child-seam rules from:

- `LRC-BL-001` through `LRC-BL-011` in
  `docs/workspace/design-system/behavior-locks/list-record-card-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into named reference targets for child review.

## What This Pack Inherits

This child pack inherits, but does not redefine:

- parent open/close choreography
- parent detail-panel placement
- mobile overlay semantics
- shell stacking and overlay ordering

Those remain governed upstream by the parent `List Page` chain.

## Current Surface Truth

- the current child seam is the repeated selectable summary card rendered inside
  `/design-system/templates/list-page`
- the surface currently includes:
  - title
  - optional subtitle
  - summary description
  - optional wrapping tag row
  - selected-state affordance through the full-card button surface
- the card currently remains full width in desktop, half-page, and mobile list
  review states
- compact title, subtitle, and tags currently use truncation with tooltip
  recovery in constrained-width states
- summary copy currently remains readable as height grows instead of clipping
- the card can already express:
  - selected state
  - field-mapping placeholder posture
  - missing-primary fallback and missing-secondary omission
  - RTL alignment
  - magnified half-page review
  - theme-local review

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `LRCR-001` | `/design-system/components/list-record-card?ref=LRC-001&width=760&state=baseline&theme=normal&dir=ltr&zoom=0` | Desktop baseline full width | Preserves the default neutral full-width card posture | canonical-created | First child review anchor |
| `LRCR-002` | `/design-system/components/list-record-card?ref=LRC-002&width=760&state=selected&theme=normal&dir=ltr&zoom=0` | Desktop selected full width | Preserves selected emphasis without geometry shift | canonical-created | Active-state proof |
| `LRCR-003` | `/design-system/components/list-record-card?ref=LRC-003&width=760&state=mapping&theme=normal&dir=ltr&zoom=0` | Field-mapping placeholder | Preserves the field-label placeholder variant | canonical-created | Mapping-oriented review state |
| `LRCR-004` | `/design-system/components/list-record-card?ref=LRC-004&width=760&state=missing&theme=normal&dir=ltr&zoom=0` | Missing-attribute fallback | Preserves `Untitled record` fallback and omission of missing secondary fields | canonical-created | No noisy empty chrome |
| `LRCR-005` | `/design-system/components/list-record-card?ref=LRC-005&width=520&state=long&theme=normal&dir=ltr&zoom=0` | Half-page long-content review | Preserves truncation with tooltip recovery under constrained width | canonical-created | Primary constrained-width review state |
| `LRCR-006` | `/design-system/components/list-record-card?ref=LRC-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0` | Mobile narrow review | Preserves full-width card posture in a narrow list lane | canonical-created | Child mobile-width proof |
| `LRCR-007` | `/design-system/components/list-record-card?ref=LRC-007&width=520&state=long&theme=normal&dir=rtl&zoom=0` | RTL half-page review | Preserves logical-start alignment and mirrored lane posture | canonical-created | Child RTL proof |
| `LRCR-008` | `/design-system/components/list-record-card?ref=LRC-008&width=520&state=long&theme=normal&dir=ltr&zoom=100` | Magnified half-page review | Preserves readability and truncation behavior under magnified pressure | canonical-created | Child magnification proof |
| `LRCR-009` | `/design-system/components/list-record-card?ref=LRC-009&width=760&state=baseline&theme=normal&dir=ltr&zoom=0` | Theme baseline normal | Preserves local theme-scoped baseline review | canonical-created | Theme scope stays local |
| `LRCR-010` | `/design-system/components/list-record-card?ref=LRC-010&width=760&state=baseline&theme=dark&dir=ltr&zoom=0` | Theme baseline dark | Preserves readability under dark theme | canonical-created | Theme scope stays local |
| `LRCR-011` | `/design-system/components/list-record-card?ref=LRC-011&width=760&state=baseline&theme=desert&dir=ltr&zoom=0` | Theme baseline desert | Preserves parity beyond the default palette | canonical-created | Theme scope stays local |

## High-Risk Review Batch

The highest-risk review states are:

- `LRCR-001` desktop baseline full width
- `LRCR-002` desktop selected full width
- `LRCR-004` missing-attribute fallback
- `LRCR-005` half-page long-content review
- `LRCR-006` mobile narrow review
- `LRCR-007` RTL half-page review

These states carry the biggest drift risk because they prove child-level
selection emphasis, fallback behavior, constrained-width truncation, mobile
full-width posture, and RTL alignment.

## Parity Rule

A future extracted card implementation or real consumer matches this pack only
when:

- it satisfies the locked `LRC-BL-*` child behaviors
- it preserves the required `LRCR-*` states or approved equivalents
- any difference from the parent `List Page` route is recorded explicitly
  rather than assumed from the child artifact alone

## Exit Condition

This child reference pack becomes operational when:

- the `LRCR-*` states are reviewed directly from the dedicated child canonical
  launcher
- the verification checklist points at this child pack explicitly
- later sign-off asks for this pack review before child canonical sign-off
