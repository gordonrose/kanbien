---
name: frontend-behavior-rule-maintainer
description: Use when creating or revising the first governed front-end harness artifact for one UI family, before tokens, primitives, patterns, components, demos, canonicals, or app adoption are allowed.
---

# Frontend Behavior Rule Maintainer

## Purpose

Create the smallest plain-language behavior rule that can govern one UI family.

The behavior rule says what the family must do, which states matter, and what consumers must not do.

The behavior rule is not an implementation plan.

The behavior rule protects layer purity before any lower-level or higher-level work begins.

## Use When

Use this skill when a governed UI family needs its first durable rule or that rule needs to be updated.

Use this skill when an existing behavior rule is too broad, vague, stale, contradictory, or mixed with later-layer decisions.

Use this skill when later-layer work reveals missing, stale, or contradictory behavior-rule guidance for the same UI family.

Use this skill when a request appears to mix behavior, token, primitive, pattern, component, demo, canonical, or app adoption decisions in one pass.

## Required Inputs

You need the UI family name.

You need the normal user-facing job the family must support.

You need the expected states or a clear statement that the state list is still incomplete.

You need known non-goals or a clear statement that none were provided.

You need any accessibility, responsive, or interaction constraints already stated by the requester.

You need to know whether the request depends on any ungoverned token, primitive, pattern, component, or app behavior.

## Allowed Outputs

Create or update one behavior rule artifact.

Use `TEMPLATE.md` as the output shape unless a repo-local template already exists for the same layer.

Keep the template lean.

Do not add broad status matrices.

Use tables only when they create a clear boundary, ownership rule, or evidence requirement.

Keep the artifact short enough for sentence-level review.

Produce an implementation-plan recommendation when the request spans multiple layers.

When the request includes a later-layer ask, use the Layer Bucket Template Map below to choose the correct bucket skeleton and output template, decide what information is missing, and recommend the correct future output shape.

Record explicit override instructions when the user approves using an ungoverned lower layer temporarily.

## Allowed Files

Behavior rule artifacts may be created in the governed shared behavior-rule
location for the repo:

docs/design-system/01-behavior-rule/shared/<ui-family-name>/<UIFamilyName>-Behaviour.md

This location is intentionally separate from older workspace and route-local
design-system docs. Behavior rules are shared contracts by default; they do not
belong under a design-system implementation key unless an explicit exception is
approved.

This skill may suggest an update to this layer's own examples or templates when the user is changing the harness itself but MUST not make an update without the user's explicit permission.

This skill must not edit implementation files.

## Forbidden Moves

Do not create primitives.
Do not create tokens.
Do not create pattern contracts.
Do not create component seams.
Do not create demo routes.
Do not create canonical scenarios.
Do not adopt anything into the app.

Do not choose file paths, CSS selectors, component APIs, or app import paths unless the behavior itself cannot be understood without them.

Do not hide a missing business decision behind implementation language.

Do not solve a missing token, primitive, pattern, component, demo, canonical, or app-adoption decision inside the behavior rule.

Do not combine two harness layers into one artifact because the next layer seems obvious.

## Layer Purity Rules

Before writing the behavior rule, classify every requested detail as one of:

- behavior rule
- token
- primitive
- pattern plus contract
- component seam
- demo page
- canonical scenario
- first app adoption
- adoption/parity test
- artifact/index update

Only behavior-rule details may be written as decisions in the behavior rule.

Later-layer details may be recorded only as open decisions, dependencies, or recommended next steps.

Do not define token, primitive, pattern, component, demo, canonical, or app-adoption decisions inside the behavior rule.

## Cross-Layer Name Boundary

Do not classify a request by the UI noun alone.

The same noun can appear in multiple layers. Classify by the decision being requested:

- token: reusable visual, sizing, motion, layout, or state values
- primitive: one low-level affordance or structural building block
- pattern plus contract: reusable composition of primitives, tokens, states, data, slots, or consumer rules
- component seam: public consumption boundary used by demos, canonicals, tests, and apps

If the noun spans layers, split the ask into layer-specific decisions.

Record only behavior-rule decisions in the behavior rule. Record later-layer decisions as dependencies, blockers, open decisions, or recommended next steps.

## Layer Bucket Template Map

Use this map before choosing what later-layer bucket skeleton or output shape to recommend.

The bucket skeleton is used to classify the ask and record missing information in the behavior rule. It is not a later-layer artifact and must not be treated as later-layer completion.

| Later-layer ask | Bucket skeleton | Output template |
| --- | --- | --- |
| token | `layer-bucket-templates/02-token.md` | `layer-output-templates/02-token/TEMPLATE.md` |
| primitive | `layer-bucket-templates/03-primitive.md` | `layer-output-templates/03-primitive/TEMPLATE.md` |
| pattern plus contract | `layer-bucket-templates/04-pattern-contract.md` | `layer-output-templates/04-pattern-contract/TEMPLATE.md` |
| component seam | `layer-bucket-templates/05-component-seam.md` | `layer-output-templates/05-component-seam/TEMPLATE.md` |
| demo page | `layer-bucket-templates/06-demo-page.md` | `layer-output-templates/06-demo-page/TEMPLATE.md` |
| canonical scenario | `layer-bucket-templates/07-canonical-scenarios.md` | `layer-output-templates/07-canonical-scenarios/TEMPLATE.md` |
| first app adoption | `layer-bucket-templates/08-first-app-adoption.md` | `layer-output-templates/08-first-app-adoption/TEMPLATE.md` |
| adoption/parity test | `layer-bucket-templates/09-adoption-parity-test.md` | `layer-output-templates/09-adoption-parity-test/TEMPLATE.md` |
| artifact/index update | `layer-bucket-templates/10-artifact-index-update.md` | `layer-output-templates/10-artifact-index-update/TEMPLATE.md` |

Use the output template to populate the later-layer classification section in the behavior rule.

Before populating it, read that layer's `examples/good.md` and `examples/bad.md`.

Do not populate a bucket skeleton or output template from guesswork. If required information is missing, record the missing information as a blocker or open decision in the behavior rule's implementation-plan recommendation.

Read only the bucket skeletons, output templates, and examples that match the request.

## Ungoverned Dependency Rules

If the behavior rule depends on an ungoverned token, primitive, pattern, component, or app behavior, do not silently treat that dependency as approved.

Record the dependency as ungoverned.

Prefer a plan that formalizes the missing lower layer before the dependent work continues.

If the user explicitly approves a temporary override, record the override as scoped, temporary, and revisitable.

The override must name what is being used, why it is being allowed, which later layer must formalize it, and what work is blocked from claiming completion until then.

Do not let a temporary override become a permanent governed decision by implication.

## Accessibility Responsibility

The behavior rule owns the plain-language accessibility promise for the UI family.

It must name observable accessibility requirements that apply to the family.

It must not say only that the family is "accessible" or "WCAG compliant."

It must identify keyboard, focus, naming, error, status, motion, contrast, or target-size expectations when those concerns apply.

It must reference the shared WCAG 2.2 AA default:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`

## Build Steps

Read the request and identify the single UI family being governed.

Classify requested details by harness layer.

Use the Layer Bucket Template Map to identify the future bucket skeleton and output template for any non-behavior-rule ask.

Compare the request against the selected layer's recognition test, information needed, things that do not belong, and outputs needed.

Read the selected output template and its good and bad examples before filling the behavior rule's later-layer classification.

Record missing later-layer information as a blocker or open decision rather than filling it from inference.

Identify any ungoverned lower-layer dependency.

Separate behavior from implementation.

Write the purpose in plain user-facing language.

List only states that apply to this UI family and change behavior, meaning, or accessibility.

Write interaction rules as observable outcomes.

List only interactions that create behavior decisions for this family.

Write accessibility expectations as concrete responsibilities.

Carry mandatory review dimensions forward without treating them as product states.

Write consumer restrictions that prevent app-local recreation.

Mark unresolved decisions as open decisions rather than guessing.

Complete the storage and consumption plan so later layers know where to read the rule.

If multiple layers are involved, write a short layer-by-layer implementation-plan recommendation instead of merging the layers.

If an explicit override is approved, record it as temporary and assign it to the later formalization layer.

## Eval Before Handoff

Run the checks in `EVAL.md`.

Run the checks in `ACCESSIBILITY-EVAL.md`.

Do not name a later layer as allowed until both evals pass or an explicit exception is recorded.

## Stop Conditions

Stop if the request covers more than one UI family and the family boundary is unclear.

Stop if the normal user-facing job is unknown.

Stop if the requested behavior would conflict with WCAG 2.2 AA and no explicit exception has been approved.

Stop if the user is really asking for implementation, app adoption, or visual polish before a behavior rule exists.

Stop if the behavior rule cannot be written without inventing a token, primitive, pattern, component seam, demo, canonical, or app adoption detail.

Stop if the request depends on an ungoverned lower layer and the user has not approved either formalizing that layer first or using a scoped temporary override.

## Handoff

When the behavior rule passes, name the next expected layer and whether it is allowed, blocked, or scaffold-only.

If the next expected layer is scaffold-only, do not hand off to real layer work. State that the later layer needs its own `SKILL.md`, `TEMPLATE.md`, `EVAL.md`, `ACCESSIBILITY-EVAL.md`, and examples before it can govern real work.

If the rule proves that no new primitive is needed, name the earliest layer that can consume the existing governed decisions and its current gate status.
