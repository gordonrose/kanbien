---
name: frontend-demo-page-maintainer
description: Use when creating or revising governed Layer 6 demo pages after a Layer 5 component seam passes, especially to prove the shared seam renders honestly across required states, viewports, themes, direction, accessibility, and interaction cases without becoming an app implementation or construction API.
---

# Frontend Demo Page Maintainer

## Purpose

Create the smallest rendered review surface that proves a governed component
seam can be consumed without copying pattern markup, primitive wiring,
controller behavior, accessibility feedback, local CSS, or app page structure.

Layer 6 owns demo fixtures, demo route/review-surface responsibility, visible
state coverage, and browser evidence for the component seam.

Layer 6 does not own component receptors, pattern composition, primitive
behavior, token values, canonical scenario coverage, app adoption, backend
query semantics, persistence behavior, authorization rules, or route topology.

## Use When

Use this skill when a Layer 5 component seam is review-ready or accepted and
the repo needs a rendered design-system demo before canonical scenarios or app
adoption can proceed.

Use this skill when a component seam must be pressure-tested visually,
interactively, responsively, or accessibly through the same runtime seam later
consumers must import.

Use this skill before proposing, planning, inventorying readiness, creating
demo artifacts, editing demo routes, or writing rendered proof tests for Layer
6 demo-page work.

## Required Inputs

You need the UI family name.

You need the target demo page name.

You need a review-ready or accepted Layer 5 component seam contract for the
target family.

You need the component runtime seam and controller export when interaction is
in scope.

You need required component states, fixture shapes, themes, viewports,
direction, magnification, reduced-motion, and interaction cases from the
component and upstream pattern contracts.

You need the intended design-system route or equivalent rendered review
surface.

When demo work is triggered by a rendered route, screenshot, template,
canonical, app-like review surface, or visible defect, use
`../layer-work-preflight.md` before implementation. The demo may proceed only
for decisions classified as Layer 6 demo-page work in that ledger.

## Allowed Outputs

Create or update one DemoPageArtifact.

Use `TEMPLATE.md` unless a repo-local template already exists for the same
demo family.

Define only Layer 6 decisions:

- demo responsibility and non-goals
- upstream component seam dependency and preservation rules
- demo route or rendered review surface
- fixture set and state coverage
- theme, viewport, direction, magnification, and motion coverage
- proof-only controls and why each control changes review evidence
- controller attachment and interaction coverage
- accessibility evidence needed for the rendered demo
- import boundary and forbidden local reconstruction
- required browser and unit evidence before later layers may consume the demo

## Allowed Files

Shared demo artifacts must be created in:

docs/design-system/06-demo-page/shared/<demo-name>/<DemoName>-Demo.md

System-specific demo proof artifacts may be created in:

docs/design-system/06-demo-page/systems/<system-key>/<demo-name>/<DemoName>-Proof.md

Demo route implementation may be planned or created under:

src/frontend/designSystem/systems/<system-key>/demos/<demo-name>/

When a demo becomes review-ready, update:

docs/design-system/06-demo-page/demo-readiness-index.md

This skill may update this layer's own examples, template, evals, and README
when the user is building or refining the harness.

## Forbidden Moves

Do not create canonical scenarios.
Do not adopt anything into the app.

Do not define or revise component receptors, pattern states, primitive
behavior, token values, backend query semantics, persistence behavior,
authorization rules, product workflow, or app route topology inside the demo.

Do not copy markup from app pages, legacy design-system routes, screenshots,
or chat history as the source of truth.

Do not let demo route markup, fixture structure, proof-only controls, or local
CSS become a construction API for app pages.

Do not mark a demo review-ready while its required component seam is missing,
template-only, or not listed in
`docs/design-system/05-component-seam/component-readiness-index.md`.

## Layer Boundary Rules

Before writing the DemoPageArtifact, classify every requested detail as one of:

- behavior-rule correction
- token correction
- primitive correction
- pattern contract correction
- component seam correction
- demo page
- canonical scenario
- first app adoption
- adoption/parity test
- artifact/index update

Only demo-page details may be written as approved decisions in the demo
artifact.

If the demo needs a missing component receptor, stop and route back to
`05-component-seam`.

If the demo needs missing pattern, primitive, or token behavior, stop and route
back to the earliest owning layer.

If a detail needs feature workflow, backend calls, route state, or app layout,
record it as a later canonical or app-adoption dependency instead of defining
it.

## Consumption Rules

Always check:

- `docs/design-system/05-component-seam/component-readiness-index.md`

Demo pages must consume governed Layer 5 runtime seams under
`src/frontend/designSystem/layers/05-component-seam/` when those seams exist.

Demo pages are rendered review evidence, not construction APIs. Later layers
must consume the component seam, not copy demo route markup, CSS, fixture
helpers, or proof-only controls.

Proof-only controls must be honest. If a control appears in the demo, changing
it must change rendered visual, geometry, interaction, accessibility, or state
evidence that the component contract requires.

Rendered proof routes must satisfy `../rendered-proof-requirements.md`.
