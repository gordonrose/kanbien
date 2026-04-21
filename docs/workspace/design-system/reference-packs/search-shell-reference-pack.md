# Search Shell Reference Pack

## Purpose

Freeze the signed-off `search-shell` baseline for future comparison.

This reference pack is the parity target for later extraction, reuse, and
family-specific verification work. It is intentionally narrower than the full
pattern artifact and intentionally more concrete than the behavior lock.

## Scope

- Family:
  `search-shell`
- Status:
  working reference target with the full search-shell state set captured and
  Playwright-locked
- Source surface:
  `/design-system`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/search-shell-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/search-shell-pattern.md`
- Related verification gate:
  `docs/workspace/design-system/verification/search-shell-verification-checklist.md`

## What This Pack Is For

Use this pack to answer:

- what concrete search-shell states need sign-off
- what future search-shell work must match
- what counts as an intentional search-shell change versus parity drift

## Human Review Status

- Human canonical review:
  completed for the current canonical set
- Review surface:
  dedicated search-shell canonical states on `/design-system/components/sub-nav`
- Review outcome:
  current search-shell canonicals accepted as the working reference set
- Remaining gap:
  first real shared-header consumer parity

## Signed-Off Rule Source

This pack inherits the approved behavior locks:

- `SS-000` through `SS-010` from
  `docs/workspace/design-system/behavior-locks/search-shell-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into concrete comparison targets.

## Reference Contract

- Search remains a centered bounded secondary-chrome input until the approved
  mobile fallback.
- The input fills the shell width and keeps a readable empty-state prompt.
- Focus treatment must be visible without shifting geometry.
- The Enter hint appears only while the search field is active and disappears
  entirely on mobile.
- Under narrow space, any custom in-field hint yields before typed content,
  placeholder text, or the native clear affordance.
- At the approved mobile fallback, search takes the full width of the sub-nav.
- Localization and symbol coverage should use a small representative set that
  stresses rendering risk without turning the pack into a full language matrix.
- Search-shell review states depend on honest parent-row rendering, so wide and
  RTL canonicals must preserve the approved breadcrumb structure rather than
  silently degrading before search behavior is judged.

## Representative Localization Set

Use this compact set when capturing localization-sensitive reference states:

- Long Latin:
  `Search components, patterns, documentation, and operational references`
- RTL:
  `ابحث في المكونات والأنماط والوثائق`
- CJK:
  `搜索组件、模式和文档`
- Symbol-heavy:
  `Search components / patterns / docs & tokens`

These strings are meant to prove:

- placeholder yield under long content
- RTL readability and direction behavior
- dense glyph rendering for CJK scripts
- punctuation and symbol spacing under realistic search guidance

Do not expand this into a full locale matrix unless a later regression or
approved internationalization goal requires it.

## Required Reference States

| Ref ID | Canonical route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `SSR-001` | `/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Desktop empty search | Baseline centered bounded search shell | captured | Evidence shared with `SNR-001` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-001-desktop-default-row.png` |
| `SSR-002` | `/design-system/components/sub-nav?width=1560&state=full&search=active&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Desktop active search | Confirms focus styling and Enter hint appearance | captured | Evidence shared with `SNR-003` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-003-desktop-active-search.png` |
| `SSR-003` | `/design-system/components/sub-nav?width=1160&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Compressed desktop search | Confirms bounded search survives row pressure | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/ssr-003-compressed-desktop-search-shell.png` |
| `SSR-004` | `/design-system/components/sub-nav?width=560&state=mobile&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Mobile search | Confirms full-width mobile search and no Enter hint | captured | Evidence shared with `SNR-004` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-004-mobile-fallback-row.png` |
| `SSR-005` | `/design-system/components/sub-nav?width=1920&state=full&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff` | RTL search | Confirms natural RTL presentation | captured | Evidence shared with `SNR-005` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-005-rtl-full-row.png` |
| `SSR-006` | `/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=dark&dir=ltr&zoom=0&locale=standard&accent=%23635bff` | Theme/readability search | Confirms placeholder and focus contrast across approved themes | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/ssr-006-theme-readability-search-shell.png` |
| `SSR-007` | `/design-system/components/sub-nav?width=880&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=100&locale=long-latin&accent=%23635bff` | Magnified or long-placeholder search | Confirms placeholder yields under width pressure | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/ssr-007-magnified-long-placeholder-search-shell.png` |
| `SSR-008` | `/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=long-latin&accent=%23635bff` | Localized long Latin search | Confirms long Latin placeholder text yields cleanly | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/ssr-008-localized-long-latin-search-shell.png` |
| `SSR-009` | `/design-system/components/sub-nav?width=1920&state=full&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff` | Localized RTL search | Confirms RTL placeholder content renders naturally | captured | Evidence shared with `SNR-005` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-005-rtl-full-row.png` |
| `SSR-010` | `/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=cjk&accent=%23635bff` | Localized CJK search | Confirms dense CJK glyphs render cleanly | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/ssr-010-localized-cjk-search-shell.png` |
| `SSR-011` | `/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=symbols&accent=%23635bff` | Symbol-heavy search | Confirms punctuation-heavy guidance renders and yields cleanly | captured | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/ssr-011-symbol-heavy-search-shell.png` |
| `SSR-012` | `/design-system/components/sub-nav?width=1120&state=reduced-page-minus-one&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff` | RTL reduced search | Confirms search remains readable and centered through the first RTL breadcrumb-yield transition | captured | Evidence shared with `SNR-008` at `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/snr-008-rtl-reduced-row.png` |

## First Evidence Batch

The search-shell evidence set is now fully captured and includes:

- `SSR-001` desktop empty search
- `SSR-002` desktop active search
- `SSR-003` compressed desktop search
- `SSR-004` mobile search
- `SSR-005` RTL search
- `SSR-006` theme/readability search
- `SSR-007` magnified or long-placeholder search
- `SSR-008` localized long Latin search
- `SSR-009` localized RTL search
- `SSR-010` localized CJK search
- `SSR-011` symbol-heavy search
- `SSR-012` RTL reduced search

## Parity Rule

A future extracted component or real-app consumer matches this reference pack
only when:

- it satisfies the locked search-shell behaviors
- it preserves the required reference states or their approved equivalents
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

## Initial Gaps

This pack still needs:

- first shared-header consumer parity review once the governed consumer lands
