# Brochure Page Reference Pack

## Purpose

Freeze the first `Brochure Page` pattern reference states so later public-page
adoption has a named design-system source instead of copying one route by
memory.

## Scope

- Family:
  `brochure-page`
- Status:
  first-pass design-system reference, awaiting human signoff
- Current source surface:
  `/design-system/patterns/brochure-page`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/brochure-page-behavior-lock.md`
- Existing executable verification:
  `tests/visual/designSystem/patterns/brochurePage.spec.ts`

## Current Surface Truth

- The pattern is listed from `/design-system/patterns`.
- The route renders seven section markers:
  - `top-nav`
  - `hero`
  - `value-strip`
  - `tile-mosaic`
  - `media-band`
  - `logo-bar`
  - `footer`
- The route uses local design-system visual assets under
  `src/frontend/designSystem/assets/`.
- The mosaic reveal interaction is available through hover and keyboard focus.
- The mosaic layout uses one featured tile spanning two columns and two rows,
  with four standard tiles arranged in the remaining two-column cluster on
  desktop.
- Mosaic tiles are square-cornered and flush with no gutters between adjacent
  tiles, while focus remains visible through an inset ring.
- The pattern page hosts the existing display-settings drawer launcher in the
  context-nav bottom group and uses the governed grouped payload for theme,
  magnification, accent, and direction.
- The page is a design-system proving surface only and has no real-app
  consumer in this change.

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `BPR-001` | `/design-system/patterns/brochure-page` | Desktop full brochure route | Proves all requested sections render together in the design-system shell. | covered-by-test | Test checks section markers, image presence, top-nav brand structure, profile omission, desktop column counts, the featured-plus-four mosaic layout, and square flush tile styling. |
| `BPR-002` | `/design-system/patterns/brochure-page` | Mosaic tile keyboard focus reveal | Proves the image-to-paragraph reveal is not pointer-only. | covered-by-test | Test focuses the first tile and checks reveal opacity. |
| `BPR-003` | `/design-system/patterns/brochure-page` | Mobile narrow route | Proves the two-column, four-column, logo, and footer zones collapse without horizontal page overflow. | covered-by-test | Test uses a `390px` viewport and checks scroll width. |
| `BPR-004` | `/design-system/patterns/brochure-page` | RTL route | Proves the route remains renderable under document RTL. | covered-by-test | Test applies `dir="rtl"` and checks section containment. |
| `BPR-005` | `/design-system/patterns/brochure-page` | Display-settings drawer open and controls applied | Proves the pattern page consumes the existing design-system drawer and payload hooks. | covered-by-test | Test opens the drawer, verifies grouped controls, applies dark theme, magnification, and RTL direction. |

## Cross-Cutting Review Dimensions

- RTL:
  governed by `BP-009` and `BPR-004`.
- Theme support:
  not applicable for this first pass because the route does not introduce
  theme-specific controls; it inherits the current design-system shell tokens.
- Primary-colour or accent inheritance:
  not applicable for this first pass because the route demonstrates a brochure
  composition, not a shared accent-control family.
- Accessibility and WCAG 2.2 AA:
  governed by `BP-004`, `BP-010`, `BPR-002`, and `BPR-003`.

## Exit Condition

This pack becomes a signoff candidate when the route has been visually reviewed
in the browser and the targeted Playwright spec passes against the same source.
