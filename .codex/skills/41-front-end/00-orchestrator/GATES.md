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

Governance docs are not construction APIs. When a governed runtime seam exists
for a token, primitive, pattern, component, or later layer, downstream source
must consume that seam instead of reconstructing UI from prose docs,
screenshots, route-local markup, copied CSS, or chat history.

## Gate 01: Behavior Rule To Token

Current status: active.

Required behavior-rule files:

- behavior rule artifact for the target UI family
- `../01-behavior-rule/EVAL.md`
- `../01-behavior-rule/ACCESSIBILITY-EVAL.md`

The behavior rule must pass `behavior-rule-pass`.

The behavior rule accessibility eval must pass `accessibility-pass` or have an explicit approved exception.

The behavior rule must name the next expected layer.

The behavior rule must name `02-token` as `allowed` or explain why token work is blocked.

## Gate 02: Token To Primitive

Current status: active.

Required token files:

- token artifact for the target UI family
- `../02-token/EVAL.md`
- `../02-token/ACCESSIBILITY-EVAL.md`

The token artifact must pass `token-pass`.

The token accessibility eval must pass `accessibility-pass` or have an explicit approved exception.

The token artifact must name the next expected layer.

The token artifact must name `03-primitive` as `allowed` or explain why
primitive work is blocked.

Required primitive harness files:

- `../03-primitive/SKILL.md`
- `../03-primitive/TEMPLATE.md`
- `../03-primitive/EVAL.md`
- `../03-primitive/ACCESSIBILITY-EVAL.md`

The primitive may consume only token seams listed as consumable in
`docs/design-system/02-token/token-readiness-index.md`.

## Gate 03: Primitive To Pattern Contract

Current status: active for primitive evaluation; pattern-contract layer is scaffold-only.

Required primitive files:

- primitive artifact for the target UI family
- `../03-primitive/EVAL.md`
- `../03-primitive/ACCESSIBILITY-EVAL.md`

The primitive artifact must pass `primitive-pass`.

The primitive accessibility eval must pass `accessibility-pass` or have an
explicit approved exception.

The primitive artifact must name the next expected layer.

Because `04-pattern-contract` is currently scaffold-only, the orchestrator must
stop after this gate and say the pattern-contract layer needs its full harness
files before real pattern work can proceed.

## Later Gates

Gates after Gate 03 are intentionally not active yet.

Do not invent pass conditions for layers `04` through `10` until each layer has its own full structure.

When a later layer becomes active, add its gate here in the same style as Gate 01.

## App Adoption Gate

App adoption is blocked until the following gates exist and pass for the target UI family:

- behavior rule
- token, unless explicitly not needed
- primitive, unless explicitly not needed
- pattern plus contract
- component seam
- demo page
- canonical scenarios

App adoption must consume the same governed seam as the design-system surface.

App adoption must not recreate governed markup, styling, or controller behavior locally.
