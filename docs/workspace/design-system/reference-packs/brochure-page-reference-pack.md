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
- The same existing drawer also hosts brochure-only display controls for
  section rhythm, background colour, font colour, and editable state. Those
  controls write scoped CSS variables and state data attributes onto
  `[data-brochure-preview]`.
- The brochure display controls include an opt-in editable state. When enabled,
  governed containers reveal top-right edit handles on hover/focus and the
  boundaries between governed containers expose edit handles.
- Container and boundary edit handles open a brochure edit drawer with
  target-aware placeholder copy; final field content is intentionally deferred
  to the next step.
- Text, image, and SVG icon pieces inside the brochure preview are individually
  targetable in editable state through a floating edit affordance that follows
  the hovered or focused piece and opens the same target-aware drawer.
- Mosaic tiles expose their own tile-level edit affordance separate from tile
  image and reveal-copy targets, and revealed edit icons have their own hover
  activation treatment.
- The edit drawer opens as a right-side companion panel and marks the brochure
  page as drawer-open so the page compresses into a left-side half-screen lane.
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
| `BPR-006` | `/design-system/patterns/brochure-page` | Brochure-specific display controls applied | Proves brochure-only drawer controls are real runtime controls scoped to the preview and that removed controls stay absent. | covered-by-test | Test applies spacious rhythm and custom background/font hex values, checks preview data attributes and CSS variables, verifies editable state is available, and verifies media emphasis, mosaic copy, font type, font weight, and font size controls are absent. |
| `BPR-007` | `/design-system/patterns/brochure-page` | Editable state with container and boundary drawer launch | Proves authoring affordances remain hidden by default, appear after opt-in, open the right-side companion drawer, and compress the brochure preview into the remaining lane. | covered-by-test | Test toggles editable state, hovers the hero container, opens the edit drawer, verifies target-aware drawer copy, checks right-edge drawer geometry beside the preview lane, then focuses a boundary handle and verifies target-aware drawer copy. |
| `BPR-008` | `/design-system/patterns/brochure-page` | Editable state with text and image drawer launch | Proves individual content pieces can be selected for editing without changing the container/boundary drawer grammar. | covered-by-test | Test toggles editable state, hovers the hero headline and hero image, then verifies text-specific and image-specific drawer context. |
| `BPR-009` | `/design-system/patterns/brochure-page` | Editable state with value-bar icon drawer launch | Proves value-bar SVG icons can be edited separately from their adjacent copy. | covered-by-test | Test toggles editable state, hovers the first value icon, and verifies icon-specific drawer context. |
| `BPR-010` | `/design-system/patterns/brochure-page` | Editable state with tile-level drawer launch and icon hover activation | Proves mosaic tiles can be edited as tiles, not only through their text or image children, and that revealed edit icons visibly activate on hover. | covered-by-test | Test toggles editable state, hovers the featured tile, hovers the tile edit icon, checks active hover colour, and verifies tile-specific drawer context. |

## Cross-Cutting Review Dimensions

- RTL:
  governed by `BP-009` and `BPR-004`.
- Theme support:
  inherited from the existing display-settings payload and covered through
  `BPR-005`.
- Primary-colour or accent inheritance:
  inherited from the existing display-settings payload; brochure-specific
  controls remain separate from global accent configuration.
- Accessibility and WCAG 2.2 AA:
  governed by `BP-004`, `BP-010`, `BP-013`, `BP-014`, `BP-015`,
  `BP-016`, `BPR-002`, `BPR-003`, `BPR-007`, `BPR-008`, `BPR-009`, and
  `BPR-010`.

## Exit Condition

This pack becomes a signoff candidate when the route has been visually reviewed
in the browser and the targeted Playwright spec passes against the same source.
