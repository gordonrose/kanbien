---
name: frontend-use-case-page-maintainer
description: Use when creating or revising governed Layer 6 use-case pages after Layer 5 component seams and render proofs pass, especially to map accepted component seams into product/use-case families such as entity list pages, entity record pages, or workflow review pages without becoming app implementation.
---

# Frontend Use-Case Page Maintainer

## Purpose

Create the smallest governed page-family review surface that proves accepted
component seams can be composed for a product use case without copying pattern
markup, component render-proof markup, controller behavior, accessibility
feedback, local CSS, backend behavior, or app page structure.

Layer 6 owns use-case page family intent, page-level composition, fixture
families, page-state boundaries, representative feature projection mapping,
and rendered evidence for how accepted seams work together.

Layer 6 does not own component receptors, pattern composition, primitive
behavior, token values, canonical scenario coverage, app adoption, backend
query semantics, persistence behavior, authorization rules, or durable route
topology.

## Use When

Use this skill when one or more Layer 5 component seams are review-ready or
accepted, their Layer 5 render proof exists, and the repo needs a governed
page-family proof before canonical scenarios or app adoption can proceed.

Use this skill for use-case families such as entity list page, entity record
page, settings page, review queue page, or workflow detail page.

Use this skill before proposing, planning, inventorying readiness, creating
use-case page artifacts, editing use-case proof routes, or writing rendered
proof tests for Layer 6 use-case page work.

## Required Inputs

You need the UI family name.

You need the target use-case page family name.

You need the component seams that the page family will compose.

Each required component seam must be listed in
`docs/design-system/05-component-seam/component-readiness-index.md`.

Each required component seam must have Layer 5 rendered evidence or an explicit
blocker recorded in its component artifact.

You need representative fixture or feature-projection shapes for the use-case
family.

You need required page states, themes, viewports, direction, magnification,
reduced-motion, overflow, and interaction cases inherited from the component
and upstream pattern contracts.

You need the intended design-system route or equivalent rendered review
surface.

When use-case work is triggered by a rendered route, screenshot, template,
canonical, app-like review surface, or visible defect, use
`../layer-work-preflight.md` before implementation. The use-case page may
proceed only for decisions classified as Layer 6 use-case-page work in that
ledger.

## Allowed Outputs

Create or update one UseCasePageArtifact.

Use `TEMPLATE.md` unless a repo-local template already exists for the same
page family.

Define only Layer 6 decisions:

- use-case page family responsibility and non-goals
- upstream component seam dependencies and preservation rules
- representative fixture or feature-projection mapping
- page-level composition of accepted components
- page-local state boundaries that are not durable app topology
- theme, viewport, direction, magnification, motion, and overflow coverage
- proof-only controls and why each control changes review evidence
- accessibility evidence needed for the rendered page family
- import boundary and forbidden local reconstruction
- required browser and unit evidence before later layers may consume the page

## Allowed Files

Shared use-case page artifacts must be created in:

docs/design-system/06-use-case-page/shared/<use-case-page-name>/<UseCasePageName>-UseCasePage.md

System-specific use-case proof artifacts may be created in:

docs/design-system/06-use-case-page/systems/<system-key>/<use-case-page-name>/<UseCasePageName>-Proof.md

Use-case proof route implementation may be planned or created under:

src/frontend/designSystem/systems/<system-key>/use-cases/<use-case-page-name>/

When a use-case page becomes review-ready, update:

docs/design-system/06-use-case-page/use-case-page-readiness-index.md

This skill may update this layer's own examples, template, evals, and README
when the user is building or refining the harness.

## Forbidden Moves

Do not create canonical scenarios.
Do not adopt anything into the app.

Do not define or revise component receptors, pattern states, primitive
behavior, token values, backend query semantics, persistence behavior,
authorization rules, product workflow, or durable app route topology inside
the use-case page.

Do not copy markup from app pages, Layer 5 render proofs, legacy design-system
routes, screenshots, or chat history as the source of truth.

Do not let use-case route markup, fixture structure, proof-only controls, or
local CSS become a construction API for app pages.

Do not mark a use-case page review-ready while any required component seam is
missing, template-only, lacking rendered proof, or not listed in
`docs/design-system/05-component-seam/component-readiness-index.md`.

## Layer Boundary Rules

Before writing the UseCasePageArtifact, classify every requested detail as one
of:

- behavior-rule correction
- token correction
- primitive correction
- pattern contract correction
- component seam correction
- component render proof
- use-case page
- canonical scenario
- first app adoption
- adoption/parity test
- artifact/index update

Only use-case-page details may be written as approved decisions in the Layer 6
artifact.

If the page needs a missing component receptor or component rendered proof,
stop and route back to `05-component-seam`.

If the page needs missing pattern, primitive, or token behavior, stop and route
back to the earliest owning layer.

If a detail needs backend calls, authorization, persistence semantics, durable
route topology, or real app workflow, record it as a later canonical or
app-adoption dependency instead of defining it.

## Consumption Rules

Always check:

- `docs/design-system/05-component-seam/component-readiness-index.md`

Use-case pages must consume governed Layer 5 runtime seams under
`src/frontend/designSystem/layers/05-component-seam/` when those seams exist.

Use-case pages are rendered page-family evidence, not construction APIs. Later
layers must consume the component seams, not copy use-case route markup, CSS,
fixture helpers, or proof-only controls.

Proof-only controls must be honest. If a control appears in the use-case page,
changing it must change rendered visual, geometry, interaction,
accessibility, or state evidence that the use-case contract requires.

Rendered proof routes must satisfy `../rendered-proof-requirements.md`.
