# Refactor-First Task Guardrail

Use for task type: `refactor-first`

## Must Preserve

- behavior compatibility for existing consumers
- explicit downstream story or task unblocked by the refactor
- no product behavior, acceptance criteria, or architecture invention hidden in
  the refactor

## Approval Evidence

- existing behavior protected
- affected consumers
- compatibility proof commands
- downstream task dependency
- rollback or staged-delivery note when relevant

## Required Check IDs

- `refactor-existing-behavior`
- `refactor-affected-consumers`
- `refactor-compatibility-proof`
- `refactor-downstream-unblocker`
- `refactor-no-product-change`
