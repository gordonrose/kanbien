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

## Working Rule

Default order:

1. principle
2. behavior lock
3. reference pack
4. token candidacy review
5. pattern artifact
6. component artifact
7. adoption note

When a change skips a stage, record why.

## Related Source Of Truth

- `docs/architecture/guides/design-system-loop-harness.md`
- `docs/templates/design-system-principle-template.md`
- `docs/templates/design-system-token-candidacy-template.md`
- `docs/templates/design-system-pattern-template.md`
- `docs/templates/design-system-component-template.md`
- `docs/templates/design-system-verification-checklist.md`
- `src/frontend/designSystem/`
