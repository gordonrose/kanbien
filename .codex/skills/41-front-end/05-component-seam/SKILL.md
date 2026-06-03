---
name: frontend-component-seam-maintainer
description: Use when creating or revising governed Layer 5 component seams after a Layer 4 pattern contract passes, especially to define the public receptor, event, render, controller, feature-adapter boundary, and component render proof that use-case pages, canonicals, and app adoption must consume.
---

# Frontend Component Seam Maintainer

## Purpose

Define the smallest public seam that lets later design-system surfaces and app
features consume a governed pattern without rebuilding its markup, styling,
controller behavior, accessibility mechanics, or primitive event wiring.

A component seam is the anti-drift bridge between design-system pattern truth
and feature implementation. It may be a component, render function, controller,
adapter, CSS module export, or a named combination of those.

Layer 5 owns receptors: the explicit public inputs where feature-owned data,
state, content, and actions may enter the governed UI.

Layer 5 also owns isolated component render proofs that prove the seam renders
and behaves honestly before page-family composition starts.

Layer 5 does not own product workflow, backend query semantics, persistence,
authorization, route topology, app wrappers, use-case page fixtures, or
canonical scenarios.

## Use When

Use this skill when a Layer 4 pattern is review-ready or accepted and the repo
needs a public consumable seam before use-case page, canonical, or app adoption
work can proceed.

Use this skill when feature work needs to map backend/API/domain behavior into
pre-designed frontend receptors instead of copying pattern markup or controller
logic into an app page.

Use this skill before proposing, planning, inventorying readiness, choosing an
API, creating artifacts, or editing files for Layer 5 component-seam work.

## Required Inputs

You need the UI family name.

You need the target component seam name.

You need a review-ready or accepted Layer 4 pattern contract for the target
family.

You need the pattern runtime seam when one exists, or a recorded blocker if the
pattern can only be reviewed through a proof route.

You need expected consumer contexts, such as component render proof, use-case
page, canonical scenario set, first app surface, or feature family.

You need export conventions and import boundaries for the design-system layer
being used.

You need representative feature projection needs when the seam will consume
domain/API behavior. Use `docs/templates/component-receptor-mapping-template.md`
for that mapping when a feature slice is in scope.

When component work is triggered by a rendered route, screenshot, template,
canonical, app-like review surface, or visible defect, use
`../layer-work-preflight.md` before implementation. The component seam may
proceed only for decisions classified as Layer 5 component-seam work in that
ledger.

## Allowed Outputs

Create or update one ComponentSeamArtifact.

Use `TEMPLATE.md` unless a repo-local template already exists for the same
component family.

Define only Layer 5 decisions:

- public seam responsibility and non-goals
- upstream pattern dependency and preservation rules
- public receptor contract
- rejected or unsupported receptors
- event translation from primitive or pattern events into component events
- controller responsibilities owned by the seam
- accessibility responsibilities preserved by the seam
- feature projection and adapter boundary
- allowed import path and consumers
- forbidden local reconstruction
- required evidence before later layers may consume the seam
- isolated component render-proof responsibility when the seam needs rendered
  evidence before Layer 6 page-family composition

## Allowed Files

Shared component seam contracts must be created in:

docs/design-system/05-component-seam/shared/<component-name>/<ComponentName>-Contract.md

Runtime component seams may be planned or created under:

src/frontend/designSystem/layers/05-component-seam/<component-name>/

Component render proof artifacts may be created under:

docs/design-system/05-component-seam/render-proofs/<component-name>/<ComponentName>-RenderProof.md

System component render proof routes may be planned or created under:

src/frontend/designSystem/systems/<system-key>/components/<component-name>/

When a component seam becomes consumable, update:

docs/design-system/05-component-seam/component-readiness-index.md

This skill may update this layer's own examples, template, evals, and README
when the user is building or refining the harness.

## Forbidden Moves

Do not create canonical scenarios.
Do not adopt anything into the app.

Do not define backend query semantics, persistence behavior, authorization
rules, route topology, product workflow, or app wrappers inside the component
seam.

Do not define token values, primitive behavior, or pattern composition inside
the component seam.

Do not copy markup from app pages, legacy design-system routes, screenshots,
proof routes, or chat history as the source of truth.

Do not expose arbitrary CSS classes, DOM selectors, primitive event listeners,
or child markup override slots as receptors.

Do not mark a component seam consumable while its required pattern contract is
missing, template-only, or not listed as consumable in
`docs/design-system/04-pattern-contract/pattern-readiness-index.md`.

## Layer Boundary Rules

Before writing the ComponentSeamArtifact, classify every requested detail as
one of:

- behavior-rule correction
- token correction
- primitive correction
- pattern contract correction
- component seam
- component render proof
- use-case page
- canonical scenario
- first app adoption
- adoption/parity test
- artifact/index update

Only component-seam and isolated component-render-proof details may be written
as approved decisions in the Layer 5 artifact.

If the seam needs a missing pattern behavior, stop and route back to
`04-pattern-contract`.

If the seam needs a missing primitive behavior, stop and route back to
`03-primitive`.

If the seam needs a missing token decision, stop and route back to `02-token`.

If a detail needs feature-specific workflow, backend calls, route state, or app
layout, record it as a feature adapter or later app-adoption dependency instead
of defining it.

## Receptor Rules

Receptors are public inputs with allowed meaning. Different receptor values
must change observable behavior, semantics, content, event handling, or
consumer obligations.

Allowed receptor categories:

- identity and labels
- domain-projected data
- selection, open, busy, disabled, empty, denied, or degraded state
- filter, query, sort, or pagination state when the component displays or
  coordinates that state
- governed content slots that preserve the upstream pattern boundary
- feature action handlers
- component-level event handlers
- accessibility names, descriptions, and live-feedback copy

Forbidden receptors:

- arbitrary class names for governed regions
- raw child markup that replaces governed pattern structure
- primitive event listeners that bypass component event translation
- direct DOM selectors
- backend request builders
- persistence flags
- authorization grants
- app route destinations unless the component contract explicitly owns a
  navigation affordance

## Feature Projection Rules

Feature code maps domain/API behavior into receptors through a feature-owned
adapter or view model.

The component seam validates and consumes receptor shape. It must not infer
durable domain facts from mutable UI labels or raw backend records.

Unsupported affordances must be explicit. For example, a reorderable component
used by a non-reorderable feature must declare reorder as unsupported rather
than leaving the handler absent and ambiguous.

When an upstream pattern supports a feature-configurable affordance, the
component may expose that decision as a receptor only if the upstream pattern
already governs both enabled and disabled behavior, including markup,
controller handling, accessibility feedback, and consumer obligations. If the
disabled posture is missing, route the correction back to `04-pattern-contract`
before adding the receptor.

When an API route feeds a governed component, the feature loop must prove that
the API/view model supplies every receptor fact the component uses, or record
the missing field as a blocker, adapter derivation, or deliberate non-use.

## Consumption Rules

Always check:

- `docs/design-system/04-pattern-contract/pattern-readiness-index.md`

Later layers and app pages must consume governed Layer 5 runtime seams under
`src/frontend/designSystem/layers/05-component-seam/` when those seams exist.

Governance docs and proof routes are review evidence, not construction APIs.
