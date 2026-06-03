# Front-End Harness Routing

This file maps requests to the next valid `41-front-end` layer.

The orchestrator must route to the earliest missing required layer.

## Active Layers

### 01 Behavior Rule

Status: active.

Use for requests that ask to define, revise, split, clarify, or govern the first rule for a UI family.

Use when no behavior rule exists for the target UI family.

Use before token, primitive, pattern, component, use-case page, canonical, or app adoption work.

Layer skill:

- `../01-behavior-rule/SKILL.md`

Required evals:

- `../01-behavior-rule/EVAL.md`
- `../01-behavior-rule/ACCESSIBILITY-EVAL.md`

### 02 Token

Status: active.

Use for requests that ask to define, confirm, revise, retire, or govern reusable token decisions for a UI family after the behavior rule gate has passed.

Use when a primitive, pattern, component, use-case page, canonical, or app adoption ask is blocked by missing governed visual, sizing, motion, spacing, typography, surface, focus, color, or layout values.

Layer skill:

- `../02-token/SKILL.md`

Required evals:

- `../02-token/EVAL.md`
- `../02-token/ACCESSIBILITY-EVAL.md`

### 03 Primitive

Status: active.

Use for requests that ask to define, confirm, revise, retire, or govern a
low-level reusable UI building block after the behavior-rule and token gates
have passed.

Use when a pattern, component, use-case page, canonical, or app adoption ask is blocked
by missing governed primitive behavior, accessibility semantics, token
dependencies, state rules, or public consumption boundary.

Layer skill:

- `../03-primitive/SKILL.md`

Required evals:

- `../03-primitive/EVAL.md`
- `../03-primitive/ACCESSIBILITY-EVAL.md`

### 04 Pattern Contract

Status: active.

Use for requests that ask to define, confirm, revise, retire, or govern a
reusable UI composition after required behavior-rule, token, and primitive
gates have passed.

Use when a component, use-case page, canonical, or app adoption ask is blocked by
missing governed pattern composition, slot ownership, data shape, state
coordination, accessibility behavior across primitives, or public consumption
boundary.

Layer skill:

- `../04-pattern-contract/SKILL.md`

Required evals:

- `../04-pattern-contract/EVAL.md`
- `../04-pattern-contract/ACCESSIBILITY-EVAL.md`

### 05 Component Seam

Status: active.

Use for requests that ask to define, confirm, revise, retire, or govern a
public component consumption seam after required pattern-contract gates have
passed.

Use when component render proof, use-case page, canonical, app adoption, or feature implementation work is
blocked by missing receptor, event, controller, adapter, import-boundary, or
feature-projection decisions for a governed pattern.

Layer skill:

- `../05-component-seam/SKILL.md`

Required evals:

- `../05-component-seam/EVAL.md`
- `../05-component-seam/ACCESSIBILITY-EVAL.md`

### 06 Use-Case Page

Status: active.

Use for requests that ask to define, confirm, revise, retire, or govern a
rendered product/use-case page family after required component-seam and
component-render-proof gates have passed.

Use when canonical, app adoption, or parity-test work is blocked by missing
rendered evidence that accepted component seams compose for a representative
page family such as entity list page or entity record page.

Do not use Layer 6 for a single component render proof. Route that work to
`05-component-seam`.

Layer skill:

- `../06-use-case-page/SKILL.md`

Required evals:

- `../06-use-case-page/EVAL.md`
- `../06-use-case-page/ACCESSIBILITY-EVAL.md`

## Scaffolded Layers

The following layers currently have README scaffolds only.

They must not be used as full governed layer skills until their skill structure exists.

- `07-canonical-scenarios`
- `08-first-app-adoption`
- `09-adoption-parity-test`
- `10-artifact-index-update`

## Request Routing

Layer routing is complete only when one of these is true:

- the selected active layer skill has been opened and is being followed
- the selected layer is scaffold-only and work has stopped
- an upstream gate is missing and work has been routed back to that earlier
  layer

Naming the next layer is not enough.

When a request references a rendered route, screenshot, existing template,
canonical, token page, pattern page, design-system surface, app-like review
surface, or visible defect, routing must first run
`../layer-work-preflight.md`. The preflight must identify every observed
decision and classify its owning layer before the orchestrator allows token,
primitive, pattern, component, component render proof, use-case page,
canonical, or app implementation work.

Before routing by layer name, classify by the decision being requested rather than by the UI noun. If a noun spans token, primitive, pattern, or component-seam decisions, route to `01-behavior-rule` to split and record the layer-specific decisions.

If the request asks for a new governed UI family, route to `01-behavior-rule`.

If the request asks for tokens but the behavior rule is missing or not passed, route to `01-behavior-rule`.

If the request asks for tokens and the behavior rule gate has passed, route to `02-token`.

If the request asks for a primitive but the behavior rule is missing or not passed, route to `01-behavior-rule`.

If the request asks for a primitive and required tokens are missing, route to `02-token` before allowing primitive work.

If the request asks for a primitive and required tokens are consumable, route to
`03-primitive`.

If the request asks for a pattern but required primitive work has not passed,
route to `03-primitive` when behavior-rule and token gates already pass.

If the request asks for a pattern and required primitives are consumable, route
to `04-pattern-contract`.

If the request asks for a component, component render proof, use-case page, canonical, app adoption, or parity
test before required pattern contract work has passed, route to
`04-pattern-contract` when upstream gates already pass.

If the request asks for a component and required pattern contract work has
passed, route to `05-component-seam`.

If the request asks for component render proof, use-case page, canonical, app adoption, or parity test before
component seam work has passed, route to `05-component-seam` when upstream
gates already pass.

If the request asks for component render proof and required component seam work
has passed, route to `05-component-seam`.

If the request asks for use-case page work and required component seam work has
passed, route to `06-use-case-page`.

If the request asks for canonical, app adoption, or parity test before use-case
page work has passed, route to `06-use-case-page` when upstream gates already
pass.

If the request asks for a pattern, component, component render proof, use-case page, canonical, app adoption, or parity test before a passed behavior rule, route to `01-behavior-rule`.

If the request asks to scaffold one of the later layers, allow scaffold work for that layer.

If the request asks to use a scaffolded later layer for real governed work, stop and ask to build that layer's harness files first.

If the request asks for app implementation, route only after a behavior rule, token, primitive, pattern contract, component seam, use-case page, canonical scenarios, and adoption gate exist for the target family.

If a later-layer or app request tries to build from governance prose,
screenshots, route-local markup, copied CSS, or chat history while a governed
runtime seam exists, route back to the layer that owns the seam and require
consumption through that seam.

## Harness Maintenance Routing

If the request challenges structure, bloat, placeholder values, or fake determinism, check `../harness-quality-bar.md` first, then edit the affected layer and its eval.

If the request says a layer-output template was filled incorrectly or asks to record a bad template example, use `../bad-template-example-maintainer/SKILL.md`.

If the request asks to change the orchestrator, edit this folder.

If the request asks to change shared accessibility rules, edit `../accessibility`.

If the request asks to change one layer's instructions, edit only that layer unless a routing or gate rule also changes.

## Registered Design Systems

A design system is registered only when its system key is present in `src/frontend/designSystem/registry/designSystems.mjs` and its `systems/<system-key>/system.manifest.json` declares the contract implementations it owns.

The route shape is `/design-system/<system-key>/...`. The `<system-key>` segment is the registered design-system name, such as `default`, not a layer name or token name.

When adding a design system, create the system folder and manifest, implement the required contracts under `systems/<system-key>/`, register the system, and run the registry, route, and relevant visual smoke checks before treating it as selectable.

The registry and manifest must stay aligned so system selection changes appearance behind stable contracts rather than changing behavior, accessibility semantics, or consumer obligations.
