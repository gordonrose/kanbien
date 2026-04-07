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
- relevant ADRs
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
6. relevant ADRs
7. current repo structure in `src/` and `tests/`
8. source-independent contract docs such as `docs/api-contracts/` and
   `docs/data-dictionary/` when relevant
9. `docs/standards/platform-status/` when the slice materially affects
   standards-gated platform posture
10. `docs/workspace/architecture-map/` when the slice materially changes
    platform-layer status or roadmap assumptions
11. existing blueprint files under `docs/workspace/implementation-blueprints/`

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
- relevant ADRs in `docs/architecture/adr/`

Helpful secondary sources:

- `docs/api-contracts/`
- `docs/data-dictionary/`
- `docs/featureDocs/`
- `docs/swagger/openapi.yaml`
- `docs/prd/test_cases/`
- `docs/standards/platform-status/`
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
- which persistence objects and migrations are needed
- which docs must be updated as part of the same slice
- which test layers are required
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

3. Map the work into repo shape.
Determine:
- owning feature
- router and contract files
- domain/service files
- persistence files and migrations
- cross-feature seams
- shared middleware or platform wiring
- test folders and layers
- docs updates required by the change class

4. Check artifact completeness.
Use `docs/standards/change-artifact-requirements.md` to make sure the blueprint
does not omit required supporting artifacts such as:
- API contract docs
- data dictionary changes
- PRD test-case work
- standards review
- runbook or privacy note when needed
- relevant standards baseline snapshot updates when the slice changes the
  platform's current posture
- relevant architecture-map updates when the slice changes the repo's current
  platform-layer status in a meaningful way
- updates to affected pre-existing protected-feature integration, security, and
  audit tests when the slice adds or tightens authz gates on routes the repo
  already exposes

For backend slices that add routes, durable entities, or materially change
security posture, the blueprint should default to naming all of these output
surfaces explicitly:

- `docs/api-contracts/`
- `docs/swagger/openapi.yaml`
- `docs/postman/` when a maintained collection exists
- `docs/featureDocs/`
- `docs/data-dictionary/`
- `docs/standards/platform-status/`
- `docs/workspace/architecture-map/` when platform-layer status has moved

If one of those is intentionally out of scope, the blueprint should say why
instead of silently leaving the artifact class out.

5. Write the blueprint.
Produce a build-ready Markdown artifact under
`docs/workspace/implementation-blueprints/`.

6. Surface gaps or blockers.
If the blueprint depends on unresolved permission rules, missing API contracts,
missing persistence specs, or unclear seam ownership, call that out explicitly
instead of hiding the gap inside vague wording.

Also call out when implementation should be expected to update a file under
`docs/standards/platform-status/` because the slice is likely to move the
repo's current standards baseline.

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
- Do not omit required test or documentation work just because the user asked
  primarily about code.
- Do not treat the blueprint as a generic checklist; it must be tailored to
  this repo's feature structure and change loop.

## Trigger Phrases

This skill should trigger for prompts like:

- "turn this capability matrix into an implementation blueprint"
- "create the implementation blueprint from the PRD and matrix"
- "translate these capability rows into a build plan"
- "prepare the repo-shaped blueprint before implementation"
- "make the implementation blueprint for this backend slice"
