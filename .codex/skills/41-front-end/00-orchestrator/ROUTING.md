# Front-End Harness Routing

This file maps requests to the next valid `41-front-end` layer.

The orchestrator must route to the earliest missing required layer.

## Active Layers

### 01 Behavior Rule

Status: active.

Use for requests that ask to define, revise, split, clarify, or govern the first rule for a UI family.

Use when no behavior rule exists for the target UI family.

Use before primitive, token, pattern, component, demo, canonical, or app adoption work.

Layer skill:

- `../01-behavior-rule/SKILL.md`

Required evals:

- `../01-behavior-rule/EVAL.md`
- `../01-behavior-rule/ACCESSIBILITY-EVAL.md`

## Scaffolded Layers

The following layers currently have README scaffolds only.

They must not be used as full governed layer skills until their skill structure exists.

- `02-primitive`
- `03-token`
- `04-pattern-contract`
- `05-component-seam`
- `06-demo-page`
- `07-canonical-scenarios`
- `08-first-app-adoption`
- `09-adoption-parity-test`
- `10-artifact-index-update`

## Request Routing

If the request asks for a new governed UI family, route to `01-behavior-rule`.

If the request asks for a primitive but the behavior rule is missing or not passed, route to `01-behavior-rule`.

If the request asks for tokens but the behavior rule is missing or not passed, route to `01-behavior-rule`.

If the request asks for a pattern, component, demo, canonical, app adoption, or parity test before a passed behavior rule, route to `01-behavior-rule`.

If the request asks to scaffold one of the later layers, allow scaffold work for that layer.

If the request asks to use a scaffolded later layer for real governed work, stop and ask to build that layer's harness files first.

If the request asks for app implementation, route only after a behavior rule, primitive, token, pattern contract, component seam, demo, canonical scenarios, and adoption gate exist for the target family.

## Harness Maintenance Routing

If the request asks to change the orchestrator, edit this folder.

If the request asks to change shared accessibility rules, edit `../accessibility`.

If the request asks to change one layer's instructions, edit only that layer unless a routing or gate rule also changes.

