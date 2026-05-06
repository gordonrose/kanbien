# Shared Code Placement Task Guardrail

Use with any task that may move, extract, or newly share code.

## Placement Decisions

- `feature-local`: logic belongs under `src/features/<featureName>`.
- `DEV:platform-seam`: logic belongs in shared platform/runtime/tooling seams.
- `shared-lib`: logic belongs under `src/lib`.
- `stay-put`: reused legacy capability remains owned where it is and is exposed
  through a public seam when needed.
- `blocked`: architecture decision needed.

## Must Preserve

- `src/lib` must not depend on feature-specific contract, domain, or
  persistence types
- domain-specific reuse should prefer an owning feature public seam
- extraction must be behavior-preserving for existing consumers
- dependent feature work waits for DECISION:refactor-first or DEV:platform-seam extraction
  tasks when extraction is needed

## Approval Evidence

- current and proposed owner
- why the chosen location is correct
- affected existing consumers
- compatibility proof commands
- separate extraction task when needed

## Deep Delivery Standard

- one placement or extraction decision per queued task
- split shared-code decision work from dependent implementation when placement
  is not already approved
- extraction work must name exact current owner, proposed owner, existing
  consumers, compatibility proof, and downstream implementation task
- prefer an owning-feature public seam for domain-specific reuse; `src/lib`
  is only for feature-neutral code that has no dependency on feature contracts,
  persistence records, authz policy, tenant context, or product semantics
- use `DEV:platform-seam` only when the shared code is runtime/tooling/platform
  infrastructure with a named compatibility contract and representative
  consumers
- use `stay-put` when moving the code would create more drift than exposing or
  documenting the existing owner; the task must still name the public seam or
  compatibility boundary that prevents private imports

## Worked Examples

| Scenario | Placement Decision | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| Feature-owned normalization or projection logic is needed by another feature, but it depends on the owning feature's domain language or durable facts. | `feature-local` or `stay-put` | Keep the logic under the owning feature, expose or consume a narrow public seam through that feature's `index.ts`, update the owning feature manifest if the seam is new, name current and future consumers, and prove existing behavior unchanged. | Do not move domain-specific logic into `src/lib`; if the seam changes architecture authority, route to `DECISION:architecture-foundation` or `GOV:architecture-update`. |
| A pure utility is feature-neutral, has no dependency on feature contracts or persistence records, and multiple features already duplicate it. | `shared-lib` | Inventory duplicate call sites, propose an exact `src/lib/*` owner, prove the helper accepts and returns feature-neutral shapes, preserve existing consumers, and require a separate extraction task when dependent feature work would otherwise ride along. | Do not place authz, tenant context, lifecycle, billing, compliance, or product semantics in `src/lib`; use an owning-feature seam or platform seam instead. |
| Legacy capability code is already relied on by several routes, and moving it would create compatibility churn unrelated to the approved story. | `stay-put` | Name the current owner, prohibited private import paths, approved public seam, existing consumers, compatibility proof, and downstream task dependency. | Do not use `stay-put` to bless hidden coupling; if consumers need a new cross-feature seam, split the seam decision or implementation before dependent work queues. |
| Shared route mounting, request-context derivation, generated-artifact materialization, scheduler harness, or test/runtime tooling must change for multiple consumers. | `DEV:platform-seam` | Create a platform-seam task with seam class, owner, source inventory, compatibility mode, current/future consumers, representative consumer proof, rollout/backout posture, and generated/runtime command impact. | Do not hide product behavior, feature persistence, or architecture authority changes inside platform seam work. |
| A proposed extraction would change evaluator order, authz model, tenant context authority, storage semantics, or frontend topology authority. | `blocked` | Record the blocked placement row and create the appropriate `DECISION:architecture-foundation`, `GOV:architecture-update`, or `GOV:standards-update` task before implementation. | Do not make a behavior-changing extraction under `DECISION:refactor-first` or `shared-lib`. |

## Required Check IDs

- `shared-code-current-owner`
- `shared-code-proposed-owner`
- `shared-code-location-rationale`
- `shared-code-existing-consumers`
- `shared-code-compatibility-proof`
- `shared-code-extraction-task`
