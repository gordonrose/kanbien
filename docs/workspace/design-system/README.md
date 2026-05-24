# Design System Workspace

This folder holds the working artifacts for the design-system loop.

Use it to keep principle, token, pattern, component, and adoption notes close
to the implementation cadence without pushing draft thinking into permanent
architecture docs too early.

## Suggested Structure

- `behavior-locks/`
  user-reviewed behavior sheets that sit between gallery exploration and
  reference capture
- `principles/`
  enduring visual and interaction rules
- `patterns/`
  reusable anatomy, state, and composition definitions
- `templates/`
  reusable page-shape notes for governed list, content, table, builder, and
  other repeatable app surfaces
- token candidacy reviews
  use the template to decide which visual decisions become semantic tokens and
  which intentionally stay local
- `token-reviews/`
  completed token candidacy outcomes for signed-off families
- `components/`
  reusable implementation-seam notes
- `adoption/`
  rollout and migration notes for governed surfaces
- `verification/`
  promotion-gate checklists for pattern and component families
- `reference-packs/`
  signed-off concrete baselines used for parity comparison
- `component-inventory.md`
  promotion ledger for current `/design-system` artifacts
- `promotion-framework.md`
  status model, feedback loops, and promotion gates
- `top-nav-prevention-note.md`
  compact prevention note capturing the stable fix logic for the top-nav family
  and a model for future family-specific prevention notes when needed

## Working Rule

Default order:

1. principle
2. behavior lock
3. reference pack
4. token candidacy review
5. pattern artifact
6. component artifact
7. adoption contract
8. first app consumer POC checklist
9. adoption note

When a change skips a stage, record why.

Treat exploration, canonical proof, and first-consumer parity as different jobs:

- exploration surfaces may stay interactive
- canonical surfaces must be locked and deterministic
- first-consumer adoption must also prove shell framing, alignment, and real
  runtime states rather than relying only on isolated canonicals

Treat public `/design-system` navigation structure as governed information
architecture, not as page-local convenience.

- `/design-system/components` is the catalog for reusable component seams
- `/design-system/patterns` is the catalog for governed pattern families
- `/design-system/templates` is the catalog for governed page templates and
  reusable page-shape contracts
- `/design-system/tokens` is the starter index for semantic token-family
  review before individual token decisions are promoted into behavior locks,
  reference packs, or implementation seams
- `/design-system/canonicals/<family>` should be framed under the public parent
  category that owns that family today
- if a family is currently treated as a pattern in the public IA, its canonical
  launcher should frame under `Patterns`
- if a family is currently treated as a component seam in the public IA, its
  canonical launcher should frame under `Components`
- if a family has both a pattern artifact and a component artifact, do not
  guess which public parent wins; record the approved parent explicitly in the
  loop artifacts before updating launcher framing

Do not let a canonical launcher default to `Components` just because the route
is implemented under `src/frontend/designSystem/canonicals/`. Public framing
should follow approved family ownership, not file placement.

All public `/design-system` pages should render inside the real shared shell
chrome:

- `top-nav`
- `sub-nav`
- `context-nav`

This is a page-level rule, not just a family-preview preference. Overview
pages, exploration pages, canonical launcher pages, and canonical display
pages should all use the governed shell trio. If a page does not yet have an
approved multi-item `context-nav` IA, render the real `context-nav` in a
single-item locked state using only the current page. Do not invent additional
destinations beyond that approved fallback.

Do not call a family stable if only empty/resting states have been proven.
Interactive families should also prove the runtime states that create real
layout and layering pressure, such as filled search fields, native browser
controls, truncation, open menus, and compact or preserved-lane states.

Pattern and page-template renderers must not eagerly build hidden heavy UI.
Initial render should create only the visible/default state plus lightweight
navigation or shell structure. Hidden regions, inactive tabs, drawer bodies,
nested detail panels, large repeated controls, and expensive fixture-backed
content must be materialized on first use or through an explicit prefetch
strategy. A template is not ready for sign-off if initial load depends on
rendering complete hidden workspaces, even when those regions are `hidden` in
the DOM.

If a UI issue survives the first fix and the same visual defect is reported
again, escalate to browser-level inspection rather than continuing with
source-only guesses.

Current authored examples now include:

- `behavior-locks/top-nav-behavior-lock.md`
- `behavior-locks/list-page-behavior-lock.md`
- `behavior-locks/form-template-behavior-lock.md`
- `behavior-locks/time-picker-behavior-lock.md`
- `behavior-locks/list-record-card-behavior-lock.md`
- `behavior-locks/list-card-behavior-lock.md`
- `behavior-locks/list-detail-panel-behavior-lock.md`
- `behavior-locks/list-detail-split-layout-behavior-lock.md`
- `behavior-locks/sub-nav-row-behavior-lock.md`
- `behavior-locks/context-nav-behavior-lock.md`
- `behavior-locks/entity-management-page-behavior-lock-index.md`
- `behavior-locks/entity-management-page-outer-page-behavior-lock.md`
- `behavior-locks/entity-management-page-navigation-behavior-lock.md`
- `behavior-locks/entity-management-page-detail-panel-behavior-lock.md`
- `behavior-locks/entity-management-page-collection-item-behavior-lock.md`
- `behavior-locks/entity-management-page-evidence-ai-behavior-lock.md`
- `behavior-locks/entity-management-page-performance-behavior-lock.md`
- `patterns/navigation-shell-pattern.md`
- `patterns/list-record-card-pattern.md`
- `patterns/list-detail-panel-pattern.md`
- `patterns/list-detail-split-layout-pattern.md`
- `patterns/sub-nav-row-pattern.md`
- `patterns/breadcrumb-pattern.md`
- `patterns/search-shell-pattern.md`
- `patterns/context-nav-pattern.md`
- `components/list-record-card-component.md`
- `components/list-card-component.md`
- `components/list-detail-panel-component.md`
- `components/list-detail-split-layout-component.md`
- `components/top-nav-shell-component.md`
- `components/sub-nav-row-component.md`
- `templates/list-page-template.md`
- `templates/launcher-template.md`
- `templates/canonical-render-page-template.md`
- `templates/form-template.md`
- `templates/record-management-list-centric-template.md`
- `verification/top-nav-verification-checklist.md`
- `verification/list-record-card-verification-checklist.md`
- `verification/list-card-verification-checklist.md`
- `verification/form-template-verification-checklist.md`
- `verification/time-picker-verification-checklist.md`
- `verification/list-detail-panel-verification-checklist.md`
- `verification/list-detail-split-layout-verification-checklist.md`
- `verification/sub-nav-row-verification-checklist.md`
- `verification/breadcrumb-verification-checklist.md`
- `verification/search-shell-verification-checklist.md`
- `verification/context-nav-verification-checklist.md`
- `verification/entity-management-page-verification-checklist.md`
- `verification/entity-management-page-wcag-2-2-aa-checklist.md`
- `reference-packs/list-page-reference-pack.md`
- `reference-packs/form-template-reference-pack.md`
- `reference-packs/time-picker-reference-pack.md`
- `reference-packs/list-record-card-reference-pack.md`
- `reference-packs/list-card-reference-pack.md`
- `reference-packs/list-detail-panel-reference-pack.md`
- `reference-packs/list-detail-split-layout-reference-pack.md`
- `reference-packs/entity-management-page-reference-pack.md`
- `reference-packs/entity-management-page-outer-page-reference-pack.md`
- `reference-packs/entity-management-page-navigation-reference-pack.md`
- `reference-packs/entity-management-page-detail-panel-reference-pack.md`
- `reference-packs/entity-management-page-collection-item-reference-pack.md`
- `reference-packs/entity-management-page-evidence-ai-reference-pack.md`
- `reference-packs/entity-management-page-performance-reference-pack.md`
- review-candidate child canonical launchers:
  `/design-system/canonical-renderings/entity-management-page-outer-page`,
  `/design-system/canonical-renderings/entity-management-page-navigation`,
  `/design-system/canonical-renderings/entity-management-page-detail-panel`,
  `/design-system/canonical-renderings/entity-management-page-collection-item`,
  `/design-system/canonical-renderings/entity-management-page-evidence-ai`,
  `/design-system/canonical-renderings/entity-management-page-performance`
- `canonicals/time-picker/index.html`
- `token-reviews/list-record-card-token-candidacy-review.md`
- `token-reviews/context-nav-token-candidacy-review.md`
- `behavior-locks/token-foundation-seams-behavior-lock.md`
- `patterns/token-foundation-seams-pattern.md`
- `components/token-foundation-seams-component.md`
- `verification/token-foundation-seams-verification-checklist.md`
- `verification/token-foundation-seams-canonical-rendering-exception.md`
- `reference-packs/token-foundation-seams-reference-pack.md`
- `token-reviews/token-foundation-seams-token-candidacy-review.md`
- `adoption/token-foundation-seams-adoption-contract.md`
- `adoption/list-card-adoption-contract.md`
- `adoption/root-admin-shell-context-nav-adoption-contract.md`

## Related Source Of Truth

- `docs/architecture/guides/design-system-loop-harness.md`
- `docs/templates/design-system-principle-template.md`
- `docs/templates/design-system-token-candidacy-template.md`
- `docs/templates/design-system-pattern-template.md`
- `docs/templates/design-system-component-template.md`
- `docs/templates/design-system-verification-checklist.md`
- `docs/templates/design-system-adoption-contract-template.md`
- `docs/templates/design-system-component-poc-checklist.md`
- `docs/workspace/design-system/canonical-and-parity-conventions.md`
- `src/frontend/designSystem/`
