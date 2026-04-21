# Breadcrumb Reference Pack

## Purpose

Freeze the signed-off `breadcrumb` baseline for future comparison.

This reference pack is the parity target for later extraction, reuse, and
family-specific verification work. It is intentionally narrower than the full
pattern artifact and intentionally more concrete than the behavior lock.

## Scope

- Family:
  `breadcrumb`
- Status:
  working reference target with the full breadcrumb state set captured and
  Playwright-locked
- Source surface:
  `/design-system`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/breadcrumb-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/breadcrumb-pattern.md`
- Related verification gate:
  `docs/workspace/design-system/verification/breadcrumb-verification-checklist.md`

## What This Pack Is For

Use this pack to answer:

- what concrete breadcrumb states need sign-off
- what future breadcrumb work must match
- what counts as an intentional breadcrumb change versus parity drift

## Human Review Status

- Human canonical review:
  completed for the current canonical set
- Review surface:
  dedicated breadcrumb canonical states on `/design-system/components/sub-nav`
- Review outcome:
  current breadcrumb canonicals accepted as the working reference set
- Remaining gap:
  first real consumer parity inside `rootAdminShell`

## Signed-Off Rule Source

This pack inherits the approved behavior locks:

- `BC-000` through `BC-012` from
  `docs/workspace/design-system/behavior-locks/breadcrumb-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into concrete comparison targets.

## Reference Contract

- The breadcrumb must preserve current-page orientation.
- Optional path segments must not appear when the true navigation depth does
  not include them.
- The approved reduction path is:
  full trail, then hide `Page -1`, then hide the collapsed middle segment,
  then compact signpost mode.
- Compact signpost mode must fully replace the full trail and still expose the
  hidden path through a lightweight menu.
- On mobile fallback, breadcrumb disappears entirely.
- Tooltip reveal for truncated breadcrumb labels must render in the shared top
  overlay layer above search and canonical chrome rather than competing with
  local breadcrumb stacking.
- RTL breadcrumb review requires explicit full, reduced, and compact transition
  states because mirrored ordering, preserved lanes, and menu anchoring all
  proved fragile during this loop.

## Required Reference States

| Ref ID | Canonical route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `BCR-001` | `/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Full breadcrumb trail | Baseline breadcrumb composition | captured | Evidence shared with `SNR-001` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-001-desktop-default-row.png` |
| `BCR-002` | `/design-system/components/sub-nav?width=1320&state=shallow&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Shallow home breadcrumb | Confirms only the home item appears when navigation depth is shallow | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/bcr-002-shallow-home-breadcrumb.png` |
| `BCR-003` | `/design-system/components/sub-nav?width=1160&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Reduced breadcrumb without `Page -1` | Confirms first reduction step | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/bcr-003-reduced-without-page-minus-one.png` |
| `BCR-004` | `/design-system/components/sub-nav?width=700&state=reduced-middle&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Reduced breadcrumb without collapsed middle segment | Confirms second reduction step | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/bcr-004-reduced-without-middle-segment.png` |
| `BCR-005` | `/design-system/components/sub-nav?width=640&state=compact&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Compact signpost mode | Confirms final responsive fallback and menu recovery | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/bcr-005-compact-signpost.png` |
| `BCR-006` | `/design-system/components/sub-nav?width=1920&state=full&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff` | RTL breadcrumb | Confirms native-feeling RTL order and anchoring | captured | Evidence shared with `SNR-005` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-005-rtl-full-row.png` |
| `BCR-007` | `/design-system/components/sub-nav?width=880&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=0&locale=long-latin&accent=%23635bff` | Long-label breadcrumb | Confirms non-wrapping long-label handling | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/bcr-007-long-label-breadcrumb.png` |
| `BCR-008` | `/design-system/components/sub-nav?width=560&state=mobile&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Mobile absence | Confirms breadcrumb disappears entirely on mobile | captured | Evidence shared with `SNR-004` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-004-mobile-fallback-row.png` |
| `BCR-009` | `/design-system/components/sub-nav?width=1120&state=reduced-page-minus-one&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff` | RTL reduced breadcrumb | Confirms the first RTL reduction step preserves mirrored order and anchoring | captured | Evidence shared with `SNR-008` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-008-rtl-reduced-row.png` |
| `BCR-010` | `/design-system/components/sub-nav?width=760&state=compact&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff` | RTL compact signpost mode | Confirms mirrored compact recovery behavior | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/bcr-010-rtl-compact-breadcrumb.png` |
| `BCR-011` | `/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=long-latin-truncation&accent=%23635bff` | LTR truncated breadcrumb labels | Confirms oversized LTR button labels ellipsize honestly | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/bcr-011-ltr-truncation-tooltip.png` |
| `BCR-012` | `/design-system/components/sub-nav?width=1920&state=full&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl-long-truncation&accent=%23635bff` | RTL truncated breadcrumb labels | Confirms oversized RTL button labels ellipsize honestly | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/bcr-012-rtl-truncation-tooltip.png` |

## First Evidence Batch

The breadcrumb evidence set is now fully captured and includes:

- `BCR-001` full breadcrumb trail through shared row evidence
- `BCR-002` shallow home breadcrumb
- `BCR-003` reduced breadcrumb without `Page -1`
- `BCR-004` reduced breadcrumb without collapsed middle segment
- `BCR-005` compact signpost mode
- `BCR-006` RTL breadcrumb through shared row evidence
- `BCR-007` long-label breadcrumb
- `BCR-008` mobile absence through shared row evidence
- `BCR-009` RTL reduced breadcrumb through shared row evidence
- `BCR-010` RTL compact signpost mode
- `BCR-011` LTR truncated breadcrumb labels
- `BCR-012` RTL truncated breadcrumb labels

## Parity Rule

A future extracted component or real-app consumer matches this reference pack
only when:

- it satisfies the locked breadcrumb behaviors
- it preserves the required reference states or their approved equivalents
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

## Initial Gaps

This pack still needs:

- first real consumer parity review once breadcrumb lands in `rootAdminShell`
