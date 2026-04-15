# Design System Workspace

This folder holds the working artifacts for the design-system loop.

Use it to keep principle, token, pattern, component, and adoption notes close
to the implementation cadence without pushing draft thinking into permanent
architecture docs too early.

## Suggested Structure

- `principles/`
  enduring visual and interaction rules
- `patterns/`
  reusable anatomy, state, and composition definitions
- `components/`
  reusable implementation-seam notes
- `adoption/`
  rollout and migration notes for governed surfaces

## Working Rule

Default order:

1. principle
2. token decision
3. pattern artifact
4. component artifact
5. adoption note

When a change skips a stage, record why.

## Related Source Of Truth

- `docs/architecture/guides/design-system-loop-harness.md`
- `docs/templates/design-system-principle-template.md`
- `docs/templates/design-system-pattern-template.md`
- `docs/templates/design-system-component-template.md`
- `src/frontend/designSystem/`

