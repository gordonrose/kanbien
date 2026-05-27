---
name: frontend-harness-orchestrator
description: Use when routing governed front-end harness work through the 41-front-end layer chain, especially to select the next valid layer, enforce gates, and prevent unsigned app adoption.
---

# Front-End Harness Orchestrator

## Purpose

Route governed front-end work through the `41-front-end` harness.

Enforce the layer order.

Stop when a required upstream gate is missing.

Do not perform detailed layer work inside this skill.

## Current Harness Maturity

`01-behavior-rule` is active.

`02-token` is active.

`03-primitive` is active.

`04-pattern-contract` is active.

Layers `05` through `10` are scaffolded and not yet active as full skills.

Do not treat a scaffolded layer as implementation-ready.

## Required Inputs

Identify the target UI family.

Identify the user's requested layer or infer the earliest required layer.

Identify whether the request is harness scaffolding, governed design-system work, or app adoption.

Identify existing upstream artifacts for the target UI family.

When the request references a rendered route, screenshot, template, canonical,
existing design-system surface, app-like review surface, or source material,
run `../layer-work-preflight.md` before implementation planning. The result
must classify observed decisions by owning layer and name the earliest missing
seam before any active layer edits code, proof routes, tests, or readiness
indexes.

## Routing Rules

Use `ROUTING.md` to select the layer.

Use `GATES.md` before allowing handoff to a later layer.

Use `../layer-work-preflight.md` whenever source material or a visible defect
could hide token, primitive, pattern, or later-layer decisions.

When behavior-rule work is needed, use `../01-behavior-rule/SKILL.md`.

When token work is needed and Gate 01 passes, use `../02-token/SKILL.md`.

When primitive work is needed and Gate 02 passes, use `../03-primitive/SKILL.md`.

When pattern contract work is needed and Gate 03 passes, use `../04-pattern-contract/SKILL.md`.

When later-layer work is requested before that layer is active, stop and say the layer is scaffolded but not yet fully defined.

## Layer Skill Handoff Rule

Routing is not complete when the next layer is named.

When the selected next layer is active, open and follow that layer's `SKILL.md`
before giving layer-specific advice, proposing outputs, creating artifacts, or
editing files for that layer.

If the selected next layer is scaffold-only, stop and say the layer harness
must be activated before real governed work can proceed.

Do not continue from memory once a layer has been identified.

## Accessibility Rule

The shared accessibility default applies to every layer:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`
- `../accessibility/EVAL.md`

No governed layer may pass while preserving or deferring an unapproved WCAG 2.2 A or AA violation.

## Harness Quality Rule

The shared harness quality bar applies to every layer:

- `../harness-quality-bar.md`

Reject fake determinism.

Do not accept tables, status values, layer splits, required fields, or artifact files unless they change allowed behavior, improve evaluation, or prevent a real drift or failure mode.

Prefer the smallest structure that creates an enforceable boundary.

## Rendered Proof Rule

For any frontend-visible governed proof, apply:

- `../rendered-proof-requirements.md`

Do not treat a rendered page as evidence unless the proof route makes its
source values, dependencies, proof-only controls, downstream consumption
boundary, and browser evidence clear enough to review without source
inspection.

## Construction API Rule

Governance docs are review and readiness sources, not construction APIs.

Later layers and app code may consult docs to know what is allowed, but must
consume governed runtime seams when those seams exist.

Do not let downstream work reconstruct tokens, primitive markup, ARIA rules,
states, controller behavior, or CSS from prose docs, screenshots, route-local
markup, copied CSS, or chat history.

## Stop Conditions

Stop if the target UI family is unclear.

Stop if route-derived, screenshot-derived, template-derived, or source-derived
work has no decision ledger from `../layer-work-preflight.md`.

Stop if a later layer is requested before the behavior rule gate has passed.

Stop if app adoption is requested before a governed component seam exists.

Stop if a requested layer is still scaffold-only.

Stop if the work would require bypassing the shared accessibility default.

Stop if a proposed harness structure violates `../harness-quality-bar.md`.

## Output

Return the selected layer, required upstream artifacts, current gate status, and next action.

For active layer work, hand off to the layer skill.

For scaffold-only layers, state that the layer needs its own `SKILL.md`, `TEMPLATE.md`, `EVAL.md`, `ACCESSIBILITY-EVAL.md`, and examples before it can govern real work.
