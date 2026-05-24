# Front-End Harness Gates

This file defines the gates between `41-front-end` layers.

The orchestrator must not advance a target UI family past a gate until the gate passes or an explicit exception is recorded.

## Global Gates

The target UI family must be named.

The current layer must have an active `SKILL.md`.

The current layer must have an `EVAL.md`.

The current layer must have an `ACCESSIBILITY-EVAL.md`.

The shared WCAG 2.2 AA default must be preserved:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`

The shared harness quality bar must be preserved:

- `../harness-quality-bar.md`

The layer output must state whether the next layer is allowed, blocked, or scaffold-only.

## Gate 01: Behavior Rule To Primitive

Current status: active for behavior-rule evaluation; primitive layer is scaffold-only.

Required behavior-rule files:

- behavior rule artifact for the target UI family
- `../01-behavior-rule/EVAL.md`
- `../01-behavior-rule/ACCESSIBILITY-EVAL.md`

The behavior rule must pass `behavior-rule-pass`.

The behavior rule accessibility eval must pass `accessibility-pass` or have an explicit approved exception.

The behavior rule must name the next expected layer.

Because `02-primitive` is currently scaffold-only, the orchestrator must stop after this gate and say the primitive layer needs its full harness files before real primitive work can proceed.

## Later Gates

The later gates are intentionally not active yet.

Do not invent pass conditions for layers `02` through `10` until each layer has its own full structure.

When a later layer becomes active, add its gate here in the same style as Gate 01.

## App Adoption Gate

App adoption is blocked until the following gates exist and pass for the target UI family:

- behavior rule
- primitive, unless explicitly not needed
- token, unless explicitly not needed
- pattern plus contract
- component seam
- demo page
- canonical scenarios

App adoption must consume the same governed seam as the design-system surface.

App adoption must not recreate governed markup, styling, or controller behavior locally.
