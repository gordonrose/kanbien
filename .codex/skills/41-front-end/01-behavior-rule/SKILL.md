---
name: frontend-behavior-rule-maintainer
description: Use when creating or revising the first governed front-end harness artifact for one UI family, before primitives, tokens, patterns, components, demos, canonicals, or app adoption are allowed.
---

# Frontend Behavior Rule Maintainer

## Purpose

Create the smallest plain-language behavior rule that can govern one UI family.

The behavior rule says what the family must do, which states matter, and what consumers must not do.

The behavior rule is not an implementation plan.

The behavior rule protects layer purity before any lower-level or higher-level work begins.

## Use When

Use this skill when a governed UI family needs its first durable rule.

Use this skill when an existing behavior rule is too broad, vague, or mixed with later-layer decisions.

Use this skill before primitive, token, pattern, component, demo, canonical, or app adoption work for the same family.

Use this skill when a request appears to mix behavior, primitive, token, pattern, component, demo, canonical, or app adoption decisions in one pass.

## Required Inputs

You need the UI family name.

You need the normal user-facing job the family must support.

You need the expected states or a clear statement that the state list is still incomplete.

You need known non-goals or a clear statement that none were provided.

You need any accessibility, responsive, or interaction constraints already stated by the requester.

You need to know whether the request depends on any ungoverned primitive, token, pattern, component, or app behavior.

## Allowed Outputs

Create or update one behavior rule artifact.

Use `TEMPLATE.md` as the output shape unless a repo-local template already exists for the same layer.

Keep the template tables and status values intact.

Use only the allowed checklist statuses: `included`, `excluded`, and `deferred`.

Keep the artifact short enough for sentence-level review.

Produce an implementation-plan recommendation when the request spans multiple layers.

Record explicit override instructions when the user approves using an ungoverned lower layer temporarily.

## Allowed Files

Behavior rule artifacts may be created in the approved design-system behavior-rule location for the repo.

This skill may update this layer's own examples or templates when the user is changing the harness itself.

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

Do not solve a missing primitive, token, pattern, component, demo, canonical, or app-adoption decision inside the behavior rule.

Do not combine two harness layers into one artifact because the next layer seems obvious.

## Layer Purity Rules

Before writing the behavior rule, classify every requested detail as one of:

- behavior rule
- primitive
- token
- pattern plus contract
- component seam
- demo page
- canonical scenario
- first app adoption
- adoption/parity test
- artifact/index update

Only behavior-rule details may be written as decisions in the behavior rule.

Later-layer details may be recorded only as open decisions, dependencies, or recommended next steps.

If a token detail appears while defining behavior, do not define the token.

If a primitive detail appears while defining behavior, do not define the primitive.

If a pattern detail appears while defining behavior, do not define the pattern.

If the user asks for a later-layer decision, steer toward an implementation plan that builds the foundation layers first.

## Ungoverned Dependency Rules

If the behavior rule depends on an ungoverned primitive, token, pattern, component, or app behavior, do not silently treat that dependency as approved.

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

It must reference the shared WCAG 2.2 AA default when accessibility is in scope:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`

## Build Steps

Read the request and identify the single UI family being governed.

Classify requested details by harness layer.

Identify any ungoverned lower-layer dependency.

Separate behavior from implementation.

Write the purpose in plain user-facing language.

List only states that change behavior, meaning, or accessibility.

Write interaction rules as observable outcomes.

Write accessibility expectations as concrete responsibilities.

Write responsive expectations only as behavior, not layout implementation.

Write consumer restrictions that prevent app-local recreation.

Mark unresolved decisions as open decisions rather than guessing.

Complete the storage and consumption plan so later layers know where to read the rule.

If multiple layers are involved, write a short layer-by-layer implementation-plan recommendation instead of merging the layers.

If an explicit override is approved, record it as temporary and assign it to the later formalization layer.

## Eval Before Handoff

Run the checks in `EVAL.md`.

Run the checks in `ACCESSIBILITY-EVAL.md`.

Do not hand off to the primitive layer until both evals pass or an explicit exception is recorded.

## Stop Conditions

Stop if the request covers more than one UI family and the family boundary is unclear.

Stop if the normal user-facing job is unknown.

Stop if the requested behavior would conflict with WCAG 2.2 AA and no explicit exception has been approved.

Stop if the user is really asking for implementation, app adoption, or visual polish before a behavior rule exists.

Stop if the behavior rule cannot be written without inventing a primitive, token, pattern, component seam, demo, canonical, or app adoption detail.

Stop if the request depends on an ungoverned lower layer and the user has not approved either formalizing that layer first or using a scoped temporary override.

## Handoff

When the behavior rule passes, the next layer is usually `02-primitive`.

If the rule proves that no new primitive is needed, hand off to the earliest layer that can consume the existing governed decisions.
