# Sub-Nav Row Reference Pack

## Purpose

Freeze the signed-off `sub-nav` composition baseline for future comparison.

This reference pack is the parity target for later extraction, reuse, and
family-specific verification work. It is intentionally narrower than the full
pattern artifact and intentionally more concrete than the behavior lock.

## Scope

- Family:
  `sub-nav`
- Status:
  working reference target with the full row state set captured and
  Playwright-locked
- Source surface:
  `/design-system`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/sub-nav-row-pattern.md`
- Related verification gate:
  `docs/workspace/design-system/verification/sub-nav-row-verification-checklist.md`

## What This Pack Is For

Use this pack to answer:

- what concrete shared-row states need sign-off
- what future app or component work must match when `breadcrumb` and
  `search-shell` appear together
- what counts as an intentional composition change versus parity drift

## Human Review Status

- Human canonical review:
  completed for the current canonical set
- Review surface:
  dedicated canonical row states on `/design-system/components/sub-nav`
- Review outcome:
  current row canonicals accepted as the working reference set
- Remaining gap:
  first real consumer parity inside `rootAdminShell`

## Signed-Off Rule Source

This pack inherits the approved behavior locks:

- `SN-000` through `SN-012` from
  `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into concrete comparison targets.

## Reference Contract

- The shared row must preserve breadcrumb/search coexistence without overlap,
  clipping, silent width stealing, or tooltip drift.
- Breadcrumb may yield through its internal reduction path before the row gives
  up its desktop/tablet composition.
- Search remains centered and bounded until the approved mobile fallback.
- At the approved mobile fallback, breadcrumb disappears and search occupies
  the full width of the sub-nav.
- If a shared-row family needs lightweight tooltip reveal, it must use the
  tokenized tooltip system rather than browser-default tooltips.
- Canonicals must render at an honest width on first open rather than relying
  on the exploration controls to settle into the intended row state.
- Shared-row tooltips must render in the top overlay layer above the row,
  search shell, breadcrumb controls, and canonical review chrome.

## Required Reference States

| Ref ID | Canonical route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `SNR-001` | `/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Desktop default row | Baseline breadcrumb plus centered search composition | captured | Evidence at `tests/visual/__snapshots__/designSystem/subNav.spec.ts/snr-001-desktop-default-row.png` |
| `SNR-002` | `/design-system/components/sub-nav?width=1160&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Compressed desktop row | Confirms breadcrumb yielding while search stays centered | captured | Evidence at `tests/visual/__snapshots__/designSystem/subNav.spec.ts/snr-002-compressed-desktop-row.png` |
| `SNR-003` | `/design-system/components/sub-nav?width=1560&state=full&search=active&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Desktop active search | Confirms active search hint appears without row drift | captured | Evidence at `tests/visual/__snapshots__/designSystem/subNav.spec.ts/snr-003-desktop-active-search.png` |
| `SNR-004` | `/design-system/components/sub-nav?width=560&state=mobile&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Mobile fallback row | Confirms breadcrumb disappears and search becomes full-width | captured | Evidence at `tests/visual/__snapshots__/designSystem/subNav.spec.ts/snr-004-mobile-fallback-row.png` |
| `SNR-005` | `/design-system/components/sub-nav?width=1920&state=full&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff` | RTL row | Confirms shared row feels native in RTL | captured | Evidence at `tests/visual/__snapshots__/designSystem/subNav.spec.ts/snr-005-rtl-full-row.png` |
| `SNR-006` | `/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=dark&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Theme/readability row | Confirms row remains readable across approved themes | captured | Evidence at `tests/visual/__snapshots__/designSystem/subNav.spec.ts/snr-006-theme-readability-row.png` |
| `SNR-007` | `/design-system/components/sub-nav?width=880&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=100&locale=long-latin&accent=%23635bff` | Magnified or long-content row | Confirms long breadcrumb/search content under UI pressure | captured | Evidence at `tests/visual/__snapshots__/designSystem/subNav.spec.ts/snr-007-magnified-long-content-row.png` |
| `SNR-008` | `/design-system/components/sub-nav?width=1120&state=reduced-page-minus-one&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff` | RTL reduced row | Confirms the RTL row stays stable through its first breadcrumb-yield step | captured | Evidence at `tests/visual/__snapshots__/designSystem/subNav.spec.ts/snr-008-rtl-reduced-row.png` |

## First Evidence Batch

The first captured batch expanded into the full row set and now includes:

- `SNR-001` desktop default row
- `SNR-002` compressed desktop row
- `SNR-003` desktop active search
- `SNR-004` mobile fallback row
- `SNR-005` RTL row
- `SNR-006` theme/readability row
- `SNR-007` magnified or long-content row
- `SNR-008` RTL reduced row

## Parity Rule

A future extracted component or real-app consumer matches this reference pack
only when:

- it satisfies the locked row behaviors
- it preserves the required reference states or their approved equivalents
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

## Initial Gaps

This pack still needs:

- first real consumer parity review once the row lands in `rootAdminShell`
