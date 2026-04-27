# Canonical Render Page Template

## Scope

- Template name:
  `Canonical Render Page`
- Status:
  system-ready review baseline
- Owner:
  `/design-system`
- Current governed surfaces:
  `/design-system/components/sub-nav`
  `/design-system/components/page-shell-banner`
  `/design-system/patterns/hierarchy-tree/render`
  `/design-system/canonical-renderings/:familyKey/:referenceId`
- Governing conventions:
  `docs/workspace/design-system/canonical-and-parity-conventions.md`
  `docs/architecture/guides/design-system-loop-harness.md`

## Intent

- What user or operator need does this template serve?
  Provide a reusable review page that opens one deterministic canonical state
  at a time, keeps the surrounding shell truthful, and explains the current
  review circumstances without making people bounce back through an
  exploration surface.
- Why should this remain a template rather than a pattern?
  The job is page-shaped: shell trio, breadcrumb framing, intro copy, metadata
  rows, focused render lane, and optional stepper navigation all belong to one
  repeatable review page rather than a narrower interaction family.

## Parent Anatomy

- Required parts:
  shell trio, breadcrumb chain, intro heading, explanatory copy, canonical
  metadata list, focused render stage, page-scoped design-settings drawer,
  specimen-scoped render-settings drawer, pattern selector for swapping the
  active specimen family inside the render lane, direct pattern-render surface
  without extra specimen-summary chrome ahead of the governed family
- Optional parts:
  previous and next stepper links, host-context notes, extra metadata rows,
  family-specific preview framing inside the render lane
- Layout structure:
  a two-column intro-and-render stage where the left side explains the current
  state and the right side hosts the isolated review surface, with the render
  lane entering the actual governed pattern directly instead of wrapping it in
  extra template-local copy cards or action strips

## Parent State Model

- Default:
  intro copy and the render stage load immediately while the current canonical
  state resolves from the URL
- Resolving state:
  metadata and stage summary may show loading copy until URL-derived state is
  applied
- Resolved single-state review:
  one canonical or render state is shown with matching metadata and summary
- Stress-state review:
  direction, theme, zoom, width, and similar viewing circumstances are
  reflected in the metadata block instead of being hidden inside page-local
  controls
- Family-owned host variant:
  some render pages may host only the child seam while others include a small
  honest host scaffold when the family needs nearby context to be reviewed

## Reuse Boundaries

- What stays template-owned?
  page shell framing, intro posture, metadata presentation, focused render
  stage, optional stepper placement, the pattern-selector control for swapping
  between approved specimen families, and the separation between page-scoped
  display controls and specimen-scoped render controls
- What stays child-route-owned?
  URL parameters, state resolution, rendered family markup, and any
  family-specific host scaffold inside the render frame
- What should not be folded into this template?
  exploration controls, family launcher grids, or hidden setup that makes the
  stated review state appear only after extra interaction
  extra specimen-summary containers, action strips, or redundant local status
  headers when the real governed pattern already provides the review value

## Composition Rules

- Common parent contexts:
  dedicated component render pages, pattern-owned render pages, and future
  signed-off canonical surfaces that need one-state-at-a-time review
- Compatible neighboring families:
  `navigation-shell`, `sub-nav-row`, `breadcrumb`, `search-shell`,
  `context-nav`, `launcher`
- Child-route rules:
  the template should open directly into the named state from the URL and keep
  metadata truthful to that state instead of relying on later control changes
- Misuse cases to avoid:
  embedding exploratory controls on the render page, mixing multiple unrelated
  canonical states into one view, or hiding shell chrome to make the page look
  simpler than the governed route family really is

## Responsive Behavior

- Mobile behavior:
  intro and render stage stack into one column while the focused render lane
  stays scrollable and honest to the requested state
- Tablet behavior:
  the stage may tighten or stack, but metadata and render framing should still
  read as one review job
- Desktop behavior:
  intro and render stage sit side-by-side so state explanation and visual proof
  stay visible together
- Overflow expectations:
  the render lane may scroll horizontally when the reviewed surface needs a
  wider width contract, but the page shell should not clip or silently shrink
  the requested review state

## Source Of Truth

- Template implementation:
  `src/frontend/designSystem/templates/canonical-render-page/index.html`
- Shared visual system:
  `src/frontend/designSystem/assets/styles.css`
- Current baseline consumers:
  `/design-system/components/sub-nav`
  `/design-system/components/page-shell-banner`
  `/design-system/patterns/hierarchy-tree/render`
  `/design-system/canonical-renderings/:familyKey/:referenceId`
- Current starter specimen set on the template route:
  `sub-nav-row`
  `breadcrumb`
  `search-shell`
  `list-record-card`
  `list-detail-panel`

## Verification

- Required screenshots or visual checks:
  one component-owned render page, one pattern-owned render page, and one
  render page that includes a small host scaffold rather than only the child
  seam
- Accessibility verification:
  heading hierarchy, labelled metadata, stable focus order, and descriptive
  stepper link text when stepper navigation exists
- Responsive verification:
  stacked mobile posture, readable metadata, and an honest scrollable render
  frame under wide-state pressure
- Theme containment verification:
  dark and desert render states must apply only to the specimen lane; the page
  top nav, canonical render intro, and `.canonical-render-layout` wrapper must
  remain unthemed review chrome
- Generated-route verification:
  generated render routes must resolve to approved registered render surfaces,
  expose specimen markers, avoid fallback overview content, and preserve
  family-specific overlay and width contracts

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/templates/canonical-render-page-template.md`
- Reference pack:
  `docs/workspace/design-system/reference-packs/canonical-render-page-reference-pack.md`
- Verification gate:
  `docs/workspace/design-system/verification/canonical-render-page-verification-checklist.md`
- Design-system route update required:
  yes:
  `/design-system/templates/canonical-render-page`
- Follow-up artifact:
  add a dedicated behavior lock only if canonical-render-page semantics broaden
  beyond the current page-shape contract
