---
name: frontend-pattern-contract-maintainer
description: Use when creating or revising governed Layer 4 design-system pattern contracts after required primitive and token gates pass, especially for reusable UI structures that compose accepted primitives without becoming component seams, demos, canonicals, or app adoption.
---

# Frontend Pattern Contract Maintainer

## Purpose

Define the smallest reusable UI pattern that composes accepted primitives and
signed tokens into a stable structure.

A pattern contract owns composition rules: slots, required primitive use,
accessibility behavior across the composition, allowed states, data shape when
needed, visual-skin boundary, and consumer restrictions.

The pattern layer does not create app adoption seams. It prepares a governed
structure that later component seams, demo pages, canonical scenarios, and app
adoption can consume without recreating primitive behavior locally.

## Use When

Use this skill when a reusable UI structure is blocked because the repo needs a
Layer 4 contract before component, template, canonical, or app work can proceed.

Use this skill when accepted primitives exist but pages or older design-system
routes are still composing them locally or inconsistently.

Use this skill before proposing, planning, inventorying readiness, choosing the
next pattern, creating artifacts, or editing files for Layer 4 pattern work.

## Required Inputs

You need the UI family name.

You need the target pattern name.

You need accepted or review-ready upstream behavior-rule artifacts for the UI
family.

You need each required primitive and proof that it is consumable in
`docs/design-system/03-primitive/primitive-readiness-index.md`.

You need each required token that the pattern consumes directly, if any, and
proof that it is consumable in `docs/design-system/02-token/token-readiness-index.md`.

You need an inventory check showing whether an older route, app page, or
design-system folder already appears to implement the pattern and whether it is
governed or legacy inventory.

You need expected consumers, or a recorded blocker if consumer scope is missing.

You need representative data or fixture shape only when the pattern displays,
normalizes, emits, or arranges externally meaningful data.

## Allowed Outputs

Create or update one PatternContractArtifact.

Use `TEMPLATE.md` unless a repo-local template already exists for the same
pattern family.

Keep the artifact lean enough for sentence-level review.

Define only Layer 4 decisions:

- pattern responsibility and non-goals
- upstream behavior, token, and primitive dependencies
- required inventory result
- composition contract and slot ownership
- accessibility contract across the composition
- allowed states that change behavior, semantics, emitted events, or consumer obligations
- data or event contract when relevant
- visual-skin boundary
- public consumption boundary
- forbidden local composition
- required evidence before later layers may consume the pattern

## Allowed Files

Shared pattern contracts must be created in:

docs/design-system/04-pattern-contract/shared/<pattern-name>/<PatternName>-Contract.md

System proof artifacts may be created in:

docs/design-system/04-pattern-contract/systems/<system-key>/<pattern-name>/<PatternName>-Proof.md

Layer 4 runtime pattern seams may be planned, but not created by default, under:

src/frontend/designSystem/layers/04-pattern-contract/<pattern-name>/

Layer 4 pattern proof routes may be planned, but not created by default, under:

src/frontend/designSystem/systems/<system-key>/patterns/<pattern-name>/

This skill may update this layer's own examples, template, evals, and README
when the user is building or refining the harness.

## Forbidden Moves

Do not create component seams.
Do not create demo routes.
Do not create canonical scenarios.
Do not adopt anything into the app.

Do not redefine primitive behavior, ARIA, focus, keyboard, tooltip, target-size,
or token values inside the pattern.

Do not treat legacy top-level `src/frontend/designSystem/patterns/` routes as
governed Layer 4 contracts.

Do not copy markup from app pages, legacy design-system routes, screenshots, or
chat history as the source of truth.

Do not define product workflow, backend persistence, page-specific wrappers, or
component props inside the pattern.

Do not mark a pattern consumable while required primitives or tokens are
missing, template-only, or not listed as consumable in the readiness indexes.

## Layer Boundary Rules

Before writing the PatternContractArtifact, classify every requested detail as
one of:

- behavior-rule correction
- token correction
- primitive correction
- pattern contract
- component seam
- demo page
- canonical scenario
- first app adoption
- adoption/parity test
- artifact/index update

Only pattern-contract details may be written as approved decisions in the
pattern artifact.

If an upstream primitive is missing or too vague, stop and route back to
`03-primitive`.

If a required token is missing, stop and route back to `02-token`.

If a detail needs public component props, app imports, backend calls, or app
adoption rules, record it as a downstream dependency instead of defining it.

## Consumption Rules

Always check:

- `docs/design-system/02-token/token-readiness-index.md`
- `docs/design-system/03-primitive/primitive-readiness-index.md`

The pattern may compose only primitives listed as consumable for the selected
system proof.

Later layers should consume governed Layer 4 runtime seams under
`src/frontend/designSystem/layers/04-pattern-contract/` when those seams exist.

Route-local proof markup is review evidence, not a construction API.
