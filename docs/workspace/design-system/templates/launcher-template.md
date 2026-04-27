# Launcher Template

## Scope

- Template name:
  `Launcher`
- Status:
  active baseline
- Owner:
  `/design-system`
- Current governed surface:
  `/design-system/templates/launcher`
- Governing conventions:
  `docs/workspace/design-system/canonical-and-parity-conventions.md`

## Intent

- What user or operator need does this template serve?
  Provide a reusable review-entry page shape that orients someone to a governed
  family, explains the review job, and launches deterministic evidence states
  directly.
- Why should this remain a template rather than a pattern?
  The launcher owns a full page-level shell, breadcrumb framing, intro zone,
  metadata block, and review-link grid, so it is better treated as a reusable
  page shape than as a narrower interaction contract.

## Parent Anatomy

- Required parts:
  shell trio, breadcrumb chain, page heading, intro copy, review panel,
  direct-link grid
- Optional parts:
  metadata rows, canonical stepper, supporting contract cards, follow-on
  sections
- Layout structure:
  a two-column intro-and-review stage followed by optional supporting sections
  that explain contract and usage boundaries

## Parent State Model

- Default:
  page heading, intro copy, and direct review links are all visible on first
  load
- Priority batch:
  higher-value review links are visually marked without hiding the rest of the
  set
- Dense review set:
  the card grid may carry many direct links while remaining scannable and
  keyboard reachable
- Pattern-detail host:
  the same page shape may frame a pattern or template detail page with
  metadata and supporting contract cards
- Canonical-index host:
  the same page shape may act as a broader index route for multiple review
  families

## Reuse Boundaries

- What stays template-owned?
  page shell framing, intro posture, metadata presentation, and the
  scan-friendly direct-link stage
- What stays child-route-owned?
  the destination canonical render surface, component preview, or family
  launcher content opened from the template
- What should not be folded into this template?
  exploratory controls, host-page state drivers, or page-local marketing tiles
  that do not launch truthful review states

## Composition Rules

- Common parent contexts:
  canonical index pages, family launcher pages, pattern-detail pages,
  template-detail pages
- Compatible neighboring families:
  `navigation-shell`, `sub-nav-row`, `breadcrumb`, `search-shell`,
  `context-nav`
- Child-route rules:
  launcher links should point directly at the truthful child route for the
  named state; they should not bounce through a parent host page when a
  dedicated render surface exists
- Misuse cases to avoid:
  hidden setup before the named review state appears, vague labels that do not
  tell reviewers what opens, or pages that look like launchers but behave like
  exploratory sandboxes

## Responsive Behavior

- Mobile behavior:
  intro and review panel stack into one column while links remain readable and
  easy to tap
- Tablet behavior:
  the stage may stay split or tighten, but the review grid should still read
  as one governed batch
- Desktop behavior:
  intro and panel sit side-by-side so orientation copy and launch actions are
  visible together
- Overflow expectations:
  long labels may wrap within cards, but ref identifiers and focus treatment
  must stay clear

## Source Of Truth

- Template implementation:
  `src/frontend/designSystem/templates/launcher/index.html`
- Shared visual system:
  `src/frontend/designSystem/assets/styles.css`
- Current baseline consumers:
  `/design-system/canonicals`
  `/design-system/canonicals/top-nav`
  `/design-system/canonicals/list-detail-panel`
  `/design-system/canonical-renderings`
  `/design-system/canonical-renderings/:familyKey`

## Verification

- Required screenshots or visual checks:
  canonical index, one family launcher, and one detail page using the launcher
  page shape
- Generated-route checks:
  generated canonical-rendering index and family launchers must hydrate from
  persisted canonical registry truth and link directly to generated render
  routes
- Accessibility verification:
  heading hierarchy, labelled review panel, visible focus, and descriptive
  link text
- Responsive verification:
  single-column mobile stack and readable multi-card grid under pressure

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/templates/launcher-template.md`
- Reference pack:
  `docs/workspace/design-system/reference-packs/launcher-template-reference-pack.md`
- Design-system route update required:
  yes:
  `/design-system/templates/launcher`
- Follow-up artifact:
  add a dedicated behavior lock only if launcher semantics grow beyond the
  current conventions-driven baseline and reference-pack contract
