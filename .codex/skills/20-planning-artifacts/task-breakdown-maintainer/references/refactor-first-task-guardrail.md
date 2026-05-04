# Refactor-First Task Guardrail

Use for task type: `DECISION:refactor-first`

## Must Preserve

- behavior compatibility for existing consumers
- explicit downstream story or task unblocked by the refactor
- no product behavior, acceptance criteria, or architecture invention hidden in
  the refactor

## Allowed Triggers

Use `DECISION:refactor-first` only when a named downstream task would otherwise
be unsafe, too broad, or drift-prone because of existing code shape.

Approved triggers:

- `over-broad-write-set`: the downstream task would touch too many ownership
  areas unless existing behavior is isolated first
- `shared-logic-before-behavior`: shared existing behavior must be isolated
  before new behavior can safely consume it
- `unreliable-proof-seam`: current coupling makes the downstream proof story
  dishonest or too broad
- `duplicated-equivalent-behavior`: equivalent existing behavior must be
  consolidated before a governed change can target one source of truth
- `wrong-owner-or-layer`: existing behavior sits in the wrong feature, layer,
  or module for the approved downstream change
- `decision-guess-risk`: current structure would force Delivery to guess a
  product, design, architecture, source-truth, or proof decision
- `extraction-before-reuse`: existing behavior must be extracted before reuse
  by the downstream task
- `test-seam-needed`: existing behavior must be isolated before honest
  characterization or regression proof is possible

Do not create a refactor-first task only because code could be cleaner, nicer,
more elegant, or someday reusable.

## Refactor Types

Every queued `DECISION:refactor-first` task must name exactly one type:

- `extract`: pull existing behavior into a smaller unit without changing it
- `move`: relocate existing behavior to the approved owner without changing it
- `rename-clarify`: rename or clarify structure when ambiguity creates
  delivery risk
- `decompose`: split an oversized unit into existing behavior units
- `consolidate`: remove duplicated equivalent behavior behind one source of
  truth
- `adapter-compatibility`: introduce a compatibility layer before a later
  change
- `test-seam`: expose or isolate existing behavior so it can be proven honestly
- `performance-preserving`: improve internal cost without changing observable
  behavior

## Routing Boundary

`DECISION:refactor-first` is not a loophole for changing authority. If the task
changes public platform seam authority, architecture authority, standards, API
contracts, schema/persistence meaning, permission semantics, or governed
design-system seams, block the refactor task and route to the owning type:

- `DEV:platform-seam`
- `GOV:architecture-update`
- `GOV:standards-update`
- `DOC:api-contract`
- `DEV:migration-persistence`
- `DOC:permission-mapping`
- `GOV:design-system`

## Approval Evidence

- approved trigger
- approved refactor type
- existing behavior protected
- affected consumers
- compatibility proof commands
- downstream task dependency
- routing check showing the task remains behavior-preserving refactor work
- rollback or staged-delivery note when relevant

## Deep Delivery Standard

- one behavior-preserving extraction, movement, or simplification target per
  queued task
- do not include new product behavior, acceptance criteria changes, or
  architecture invention
- name the downstream task unblocked and the exact compatibility proof for
  existing consumers

## Required Check IDs

- `refactor-trigger`
- `refactor-type`
- `refactor-existing-behavior`
- `refactor-affected-consumers`
- `refactor-compatibility-proof`
- `refactor-downstream-unblocker`
- `refactor-no-product-change`
- `refactor-routing-check`
