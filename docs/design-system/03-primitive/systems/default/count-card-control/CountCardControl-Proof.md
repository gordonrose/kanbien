# Count Card Control Default-System Proof

Shared contract: `docs/design-system/03-primitive/shared/count-card-control/CountCardControl-Contract.md`

Rendered view: `/design-system/default/primitives/count-card-control`

Runtime seam: `src/frontend/designSystem/layers/03-primitive/count-card-control/index.mjs`

## Proof Scope

The default design system renders `count-card-control` using signed token seams
for frame state, typography, tooltip disclosure, focus, and minimum target
size.

This proof does not define drawer-select behavior, filter-panel grouping,
status-tab grouping, search, backend count calculation, or app adoption.

## Review Controls

The proof route lets reviewers change:

- card state
- static versus actionable mode
- label length
- count value
- constrained versus wide width
- LTR versus RTL direction
- original, dark, and desert theme

The route must show how to view the rendered proof:
`/design-system/default/primitives/count-card-control`.

## Evidence

- Static cards render as non-interactive content.
- Actionable cards render as native buttons and emit `count-card:activate`.
- Disabled cards do not emit activation.
- Labels truncate without overlapping the count slot.
- Tooltip disclosure appears only for actually truncated labels.
- Warning and error states use signed count-card frame tokens backed by broader
  status/error token decisions.

