# Shared Code Placement Task Guardrail

Use with any task that may move, extract, or newly share code.

## Placement Decisions

- `feature-local`: logic belongs under `src/features/<featureName>`.
- `platform-seam`: logic belongs in shared platform/runtime/tooling seams.
- `shared-lib`: logic belongs under `src/lib`.
- `stay-put`: reused legacy capability remains owned where it is and is exposed
  through a public seam when needed.
- `blocked`: architecture decision needed.

## Must Preserve

- `src/lib` must not depend on feature-specific contract, domain, or
  persistence types
- domain-specific reuse should prefer an owning feature public seam
- extraction must be behavior-preserving for existing consumers
- dependent feature work waits for refactor-first or platform-seam extraction
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

## Required Check IDs

- `shared-code-current-owner`
- `shared-code-proposed-owner`
- `shared-code-location-rationale`
- `shared-code-existing-consumers`
- `shared-code-compatibility-proof`
- `shared-code-extraction-task`
