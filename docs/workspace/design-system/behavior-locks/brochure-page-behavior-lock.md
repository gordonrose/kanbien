# Brochure Page Behavior Lock

## Purpose

Lock the first governed behavior rules for the `Brochure Page` pattern before
any real app or public-site adoption uses it.

## Scope

- Family:
  `brochure-page`
- Current source surface:
  `/design-system/patterns/brochure-page`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/brochure-page-reference-pack.md`
- Adoption status:
  design-system pattern only; no real app consumer in this change

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `BP-001` | The brochure page pattern must expose seven distinct sections: top nav with logo and wordmark, two-column hero, four-item value strip, hover/focus tile mosaic, full-width media/text band, logo or badge bar, and four-column rich footer. | Keeps the pattern reusable for public product, client, and compliance pages without collapsing all marketing needs into one monolithic surface. | The route renders each section with `data-brochure-section` markers. | `approved` | Requested sections are the source requirement for this first pass, with top nav added as a follow-up refinement. |
| `BP-001A` | The brochure page top nav should reuse the signed-off top-nav visual structure for brand lockup and primary links, but omit the profile/account piece. | Public brochure pages need brand and wayfinding without implying authenticated user chrome. | The route uses `top-nav`, `brand-lockup`, `brand-mark`, `brand-copy`, `primary-nav`, and `nav-link` classes, while using a brochure-local link container so the design-system shell controller does not rewrite the preview nav. It does not render `.profile-button` or `.nav-utilities` inside the brochure preview. | `approved` | User requested top nav plus logo and wordmark, reusing the signed-off pattern without the profile piece. |
| `BP-002` | The hero must use a two-column desktop layout with copy and a real image/graphic surface, then collapse to one readable column on narrow screens. | Gives public pages a high-impact opening without causing mobile overflow. | CSS uses a two-column grid above narrow widths and a single column below `48rem`. | `approved` | Hero image with two-column layout requested. |
| `BP-003` | The value strip must hold four items where the graphic and paragraph sit on the same horizontal line at desktop widths. | Preserves a quick-scan proof row instead of turning values into stacked cards too early. | Each value item is a flex row inside a four-column grid. | `approved` | Four columns with graphic and paragraph on the same horizontal line requested. |
| `BP-004` | Mosaic tiles must show imagery by default and reveal a concise paragraph on hover and keyboard focus. | Makes image-led storytelling accessible to keyboard review and avoids image-only meaning. | Tiles use focusable article surfaces and reveal `.brochure-mosaic-copy` on hover, focus-visible, or focus-within. | `approved` | Hover mode that switches to paragraph requested. |
| `BP-004A` | The mosaic must support a featured tile that spans two columns and two rows, plus a four-tile standard set arranged as two columns beside it on desktop. | Gives the brochure pattern a stronger editorial lead story without losing compact proof tiles. | The route marks the featured tile with `data-brochure-mosaic-tile="featured"` and standard tiles with `data-brochure-mosaic-tile="standard"` inside `data-brochure-mosaic-layout="featured-plus-four"`. | `approved` | User requested one tile that is two columns wide and deep, or four tiles across two columns. |
| `BP-004B` | Mosaic tiles must be square-cornered and flush with no gutters between adjacent tiles, while keyboard focus remains visible inside the tile boundary. | Preserves a true tile-mosaic look without sacrificing keyboard review. | The mosaic grid uses zero gap, tile radius is `0`, and focus uses an inset ring. | `approved` | User requested square-cornered and flush tiles. |
| `BP-005` | The media band must span the available pattern width while preserving one image/graphic side and one text side on desktop. | Provides a deeper explanation section after the scan-heavy hero and mosaic. | `.brochure-media-band` uses the same two-column composition rule as the hero. | `approved` | Full-width image and paragraph component requested. |
| `BP-006` | The logo bar must accept either client names or compliance badges without requiring brand-specific image assets. | Lets the same section support social proof and assurance proof. | The first route uses text badges for client/compliance examples. | `approved` | Logo bar usable for clients or compliance badges requested. |
| `BP-007` | The footer must support four columns, and at least one column must prove that image content can live alongside text content. | Prevents footer adoption from assuming text-only columns. | The footer renders four sections, with the second section hosting an image. | `approved` | Four-column footer that can host text and images requested. |
| `BP-008` | The pattern must not introduce app-page CSS or real app implementation before design-system signoff. | Preserves the repo rule that governed app UI consumes signed-off design-system seams later. | This change is limited to `src/frontend/designSystem`, docs, and design-system visual tests. | `approved` | This is explicitly a `/design-system` loop request. |
| `BP-009` | RTL behavior should preserve logical section order and mirror inline alignment without requiring separate markup. | Keeps public page composition localization-ready. | CSS uses logical borders and direction-scoped hero/media-band rules. | `approved` | Required design-system cross-cutting dimension. |
| `BP-010` | WCAG 2.2 AA-relevant behavior must include keyboard access to the mosaic reveal state, visible focus on revealable tiles, image alt text, and no horizontal overflow at mobile widths. | Converts accessibility into concrete checks for the risky interaction and responsive states. | Playwright coverage checks focus reveal, image alt availability, and mobile overflow. | `approved` | Required design-system cross-cutting dimension. |
| `BP-011` | The brochure pattern page must host the governed display-settings drawer through the signed-off context-nav drawer launcher and payload hooks. | Lets reviewers exercise theme, magnification, accent, and direction directly on the brochure pattern without inventing a local settings UI. | The page uses `#accessibility-button`, `#accessibility-drawer`, `#accessibility-close`, and the existing grouped display-settings controls consumed by `app.mjs`. | `approved` | User requested adding the design settings drawer to the pattern page. |
| `BP-012` | Brochure-specific display controls must live inside the existing drawer, remain local to the brochure preview, and update real runtime styling through CSS variables rather than acting as decorative settings. | Lets reviewers tune brochure composition without creating a second drawer or promoting brochure choices into global theme configuration. | The existing drawer includes section-rhythm, media-emphasis, mosaic-copy, background-colour, font-colour, font-family, font-weight, and font-size controls. `app.mjs` writes scoped CSS variables and state data attributes onto `[data-brochure-preview]`. | `approved` | User requested brochure-specific, reversible runtime controls inside the existing drawer. |

## Exit Criteria For This Step

This behavior lock is ready for reference-pack review when the first rendered
route and targeted visual-contract tests agree with `BP-001` through `BP-012`.
