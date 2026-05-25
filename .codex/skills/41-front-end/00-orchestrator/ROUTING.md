# Front-End Harness Routing

This file maps requests to the next valid `41-front-end` layer.

The orchestrator must route to the earliest missing required layer.

## Active Layers

### 01 Behavior Rule

Status: active.

Use for requests that ask to define, revise, split, clarify, or govern the first rule for a UI family.

Use when no behavior rule exists for the target UI family.

Use before token, primitive, pattern, component, demo, canonical, or app adoption work.

Layer skill:

- `../01-behavior-rule/SKILL.md`

Required evals:

- `../01-behavior-rule/EVAL.md`
- `../01-behavior-rule/ACCESSIBILITY-EVAL.md`

### 02 Token

Status: active.

Use for requests that ask to define, confirm, revise, retire, or govern reusable token decisions for a UI family after the behavior rule gate has passed.

Use when a primitive, pattern, component, demo, canonical, or app adoption ask is blocked by missing governed visual, sizing, motion, spacing, typography, surface, focus, color, or layout values.

Layer skill:

- `../02-token/SKILL.md`

Required evals:

- `../02-token/EVAL.md`
- `../02-token/ACCESSIBILITY-EVAL.md`

## Scaffolded Layers

The following layers currently have README scaffolds only.

They must not be used as full governed layer skills until their skill structure exists.

- `03-primitive`
- `04-pattern-contract`
- `05-component-seam`
- `06-demo-page`
- `07-canonical-scenarios`
- `08-first-app-adoption`
- `09-adoption-parity-test`
- `10-artifact-index-update`

## Request Routing

Before routing by layer name, classify by the decision being requested rather than by the UI noun. If a noun spans token, primitive, pattern, or component-seam decisions, route to `01-behavior-rule` to split and record the layer-specific decisions.

If the request asks for a new governed UI family, route to `01-behavior-rule`.

If the request asks for tokens but the behavior rule is missing or not passed, route to `01-behavior-rule`.

If the request asks for tokens and the behavior rule gate has passed, route to `02-token`.

If the request asks for a primitive but the behavior rule is missing or not passed, route to `01-behavior-rule`.

If the request asks for a primitive and required tokens are missing, route to `02-token` before allowing primitive work.

If the request asks for a pattern, component, demo, canonical, app adoption, or parity test before a passed behavior rule, route to `01-behavior-rule`.

If the request asks to scaffold one of the later layers, allow scaffold work for that layer.

If the request asks to use a scaffolded later layer for real governed work, stop and ask to build that layer's harness files first.

If the request asks for app implementation, route only after a behavior rule, token, primitive, pattern contract, component seam, demo, canonical scenarios, and adoption gate exist for the target family.

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
