---
name: implementation-blueprint-maintainer
description: Use when the user wants Codex to create or refresh an implementation blueprint from an approved capability matrix, PRD, and related repo artifacts, especially under docs/workspace/implementation-blueprints for build-ready backend or vertical-slice planning.
---

# Implementation Blueprint Maintainer

Use this skill when the user wants to translate an approved capability matrix
and PRD into a build-ready implementation blueprint.

The output lives under `docs/workspace/implementation-blueprints/`.

This skill exists to bridge:

- capability matrix = what must exist
- implementation blueprint = how this repo should build it

## Goal

Produce a repo-shaped implementation blueprint that is specific enough to guide
implementation without forcing the reader to reconstruct the plan from the PRD,
capability matrix, architecture docs, and codebase conventions separately.

These blueprints should support:

- build-from-spec implementation
- low-drift handoff into implementation work
- standards and documentation completeness before code starts

## Inputs

Use this skill only when the core requirements already exist or are largely
settled.

Typical inputs:

- approved capability matrix rows
- PRD or PRD refinement
- exact ADR discovery results for the scoped change areas
- PRD-derived test-case doc when present
- current architecture and feature conventions

If the capability matrix or PRD is missing or materially incomplete, say so
instead of inventing the implementation plan.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. `docs/standards/change-artifact-requirements.md`
4. approved capability matrix inputs
5. PRD and PRD-derived test-case doc
6. exact ADRs discovered for the scoped change areas
7. current repo structure in `src/` and `tests/`
8. source-independent contract docs such as `docs/api-contracts/` and
   `docs/data-dictionary/` when relevant
9. `docs/standards/platform-status/` when the slice materially affects
   standards-gated platform posture
10. rebuild-readiness docs such as
    `docs/architecture/build-from-spec-reconstruction-questionnaire.md` and
    `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md`
    when the slice changes runtime assumptions or helper requirements
11. `docs/workspace/architecture-map/` when the slice materially changes
    platform-layer status or roadmap assumptions
12. existing blueprint files under `docs/workspace/implementation-blueprints/`

If the capability matrix and PRD disagree, do not silently merge them. Prefer
the higher-confidence approved input and call out the mismatch.

## Where To Look

Primary sources:

- the approved capability matrix file in `docs/workspace/capability-matrices/`
  or another user-provided location
- the target PRD under `docs/prd/`
- `docs/templates/implementation-blueprint-template.md`
- `docs/standards/change-artifact-requirements.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- exact ADRs discovered under `docs/architecture/adr/`

Helpful secondary sources:

- `docs/api-contracts/`
- `docs/data-dictionary/`
- `docs/featureDocs/`
- `docs/swagger/openapi.yaml`
- `docs/prd/test_cases/`
- `docs/standards/platform-status/`
- `docs/architecture/build-from-spec-reconstruction-questionnaire.md`
- `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md`
- `docs/workspace/architecture-map/`
- current feature structure in `src/features/`
- relevant tests under `tests/`

## What The Blueprint Must Do

A good blueprint should translate requirements into repo-shaped execution
guidance for one feature slice or tightly scoped capability group.

It should make these things explicit:

- which routes or UI surfaces belong in scope
- which feature owns the work
- which files or modules are expected to change or be created
- which cross-feature seams must be used instead of private imports
- which `feature.manifest.json` files will need refresh
- which persistence objects and migrations are needed
- which authz capability rows and default role grants must be seeded or updated
  when the capability matrix introduces protected backend behavior
- which docs and verification layers are expected to move with the slice
- which standards or audit expectations must be preserved

This is not just a restatement of the PRD.
It is the build plan that adapts the spec to this repository's structure and
delivery conventions.

## Output Structure

Use the template at `docs/templates/implementation-blueprint-template.md`.

When helpful, expand the template with additional subsections, especially for:

- repo file layout
- integration wiring
- migration sequencing
- standards-review checkpoints
- standards baseline snapshot impact
- maintained-artifacts sweep requirements
- dependency ordering between backend, frontend, docs, and tests

The blueprint should stay concise, but it must be specific enough that the next
implementation step is obvious.

## Workflow

1. Confirm scope.
Identify the slice the blueprint is for:
- one capability
- one route family
- one feature slice
- one vertical slice

Do not produce one blueprint for unrelated work bundles.

2. Read the approved requirements.
Pull the relevant capability-matrix rows, PRD scope, rules, errors, and test
expectations.

3. Run exact ADR discovery.
Search `docs/architecture/adr/` for each scoped change area before mapping the
work into repo shape.

The blueprint must include:
- the exact ADR files reviewed
- the change areas each ADR was reviewed for
- `no existing ADR found` for enduring decision areas with no match
- whether a new ADR is required, not required, or blocked pending decision
- any stale or conflicting ADR guidance

If an ADR conflict affects the selected architecture, shared seam, authz or
tenant-boundary rule, persistence model, API/data contract, frontend topology,
design-system adoption path, or verification harness, stop and surface the
conflict before producing an implementation-ready blueprint.

4. Map the work into repo shape.
Determine:
- owning feature
- router and contract files
- domain/service files
- persistence files and migrations
- authz-catalog seed rows implied by the approved capability matrix
- default role-grant migrations needed so protected roles receive the intended
  capabilities in live environments
- cross-feature seams
- feature-manifest updates needed for new or changed seams and dependencies
- shared middleware or platform wiring
- test folders and layers
- docs updates required by the change class

5. Check artifact completeness.
Use `docs/standards/change-artifact-requirements.md` as the canonical artifact
matrix.

The blueprint should name the supporting artifacts and verification layers that
implementation will likely need for this slice.

For backend slices that add routes, durable entities, or materially change
security posture, prefer naming the most relevant output surfaces explicitly,
such as:

- `docs/api-contracts/`
- `docs/swagger/openapi.yaml`
- `docs/postman/` when a maintained collection exists
- `docs/featureDocs/`
- `docs/data-dictionary/`
- `src/features/<featureName>/feature.manifest.json`
- `docs/architecture/generated/feature-dependency-graph.*`
- `docs/standards/platform-status/`
- rebuild-readiness docs when runtime or helper assumptions changed
- `docs/workspace/architecture-map/` when platform-layer status has moved
- older planning or registry docs whose wording will become stale once
  implementation lands

If one of those is intentionally out of scope, the blueprint should say why
instead of silently leaving the artifact class out.

When the approved capability matrix names privileged or role-governed backend
capabilities, the blueprint should explicitly say:

- where the capability keys will be seeded
- which default roles receive them by migration-backed grant
- which existing protected-feature flows or manual verification assets depend
  on those grants after deployment

Also use `docs/architecture/guides/qa-coverage-matrix-guide.md`,
`docs/architecture/guides/end-to-end-journey-testing-guide.md`, and
`docs/standards/QA-RELEASE-GATE.md` as active inputs.

6. Write the blueprint.
Produce a build-ready Markdown artifact under
`docs/workspace/implementation-blueprints/`.

7. Surface gaps or blockers.
If the blueprint depends on unresolved permission rules, missing API contracts,
missing persistence specs, unclear seam ownership, or missing verification
expectations, call that out explicitly instead of hiding the gap inside vague
wording.

Also call out when implementation should be expected to refresh:

- standards-baseline snapshots under `docs/standards/platform-status/`
- earlier planning or registry docs whose truth value will change
- blocking-gate QA evidence beyond executable test files when the change class
  requires it

## Writing Rules

- Prefer one blueprint per coherent implementation slice.
- Name the owning feature and the exact route family or capability group.
- Be explicit about which repo seams must be used.
- Prefer file and module guidance over abstract architecture prose.
- Do not drift into step-by-step coding instructions unless the repo shape
  really requires them.
- Do not copy the capability matrix verbatim; translate it into build actions.
- Do not rely on code as the only evidence source when source-independent docs
  already capture the contract more clearly.

## Guardrails

- Do not create a blueprint from an unapproved or obviously incomplete
  capability matrix without saying so.
- Do not let the blueprint introduce architecture that conflicts with
  `AGENTS.md` or ADR-backed seams.
- Do not satisfy the ADR section with generic wording such as `relevant ADRs`;
  list exact ADR files reviewed or record `no existing ADR found`.
- Do not omit required test or documentation work just because the user asked
  primarily about code.
- Do not treat the blueprint as a generic checklist; it must be tailored to
  this repo's feature structure and change loop.
- Do not leave capability-matrix-derived authz state implied. If a protected
  route depends on a role grant, the blueprint should name the migration or
  corrective migration that will create or repair that state.

## Trigger Phrases

This skill should trigger for prompts like:

- "turn this capability matrix into an implementation blueprint"
- "create the implementation blueprint from the PRD and matrix"
- "translate these capability rows into a build plan"
- "prepare the repo-shaped blueprint before implementation"
- "make the implementation blueprint for this backend slice"
