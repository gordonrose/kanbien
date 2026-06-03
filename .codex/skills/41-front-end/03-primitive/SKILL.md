---
name: frontend-primitive-maintainer
description: Use when creating or revising governed Layer 3 design-system primitive artifacts after behavior-rule and token gates pass, especially for low-level reusable UI building blocks whose behavior, accessibility semantics, token dependencies, and consumer boundary must stay stable across design-system skins.
---

# Frontend Primitive Maintainer

## Purpose

Define the smallest governed reusable primitive needed by one UI family.

A primitive is a low-level building block such as a button, icon button, input,
checkbox, radio, switch, tooltip trigger, menu trigger, field row, panel shell,
text style, or surface atom.

The primitive layer fixes behavior, accessibility, allowed states, and the
public consumption boundary as a shared contract across design systems by
default.

Token dependencies are evaluated per selected token dependency system, and
rendered proof is evaluated per selected proof system. Visual appearance may
vary by registered design system, but primitive behavior, accessibility
semantics, and consumer obligations must remain stable.

## Use When

Use this skill when an accepted or review-ready behavior rule and required
signed token decisions are ready for a primitive decision.

Use this skill when a pattern, component seam, demo, canonical, or app adoption
ask is blocked because a low-level primitive does not yet have a governed
artifact.

Use this skill when existing route, app, or design-system markup looks reusable
but has not been checked against the primitive inventory and token readiness
index.

Use this skill when a primitive artifact needs revision because a required
behavior, accessibility rule, token dependency, or public boundary is stale or
too broad.

Use this skill before proposing, planning, inventorying readiness, choosing the
next primitive, evaluating blockers, explaining implementation steps, creating
artifacts, or editing files for Layer 3 primitive work.

## Required Inputs

You need the UI family name.

You need the target primitive name.

You need an accepted or review-ready behavior rule path for the same UI family.

You need each required token dependency and proof that it is consumable in
`docs/design-system/02-token/token-readiness-index.md` for each selected token
dependency system.

You need the primitive inventory check, even when the result is that no
governed primitive exists.

You need the expected consumers or a recorded statement that consumer scope is
missing and blocks approval.

You need the allowed states that change behavior, accessibility, emitted
events, or consumer obligations.

You need the accessibility concerns for the primitive, especially role,
accessible name, keyboard operation, focus behavior, disabled behavior, target
size, status/error exposure, and motion.

You need any frontend/backend contract only when the primitive itself accepts,
normalizes, emits, or displays externally meaningful data.

When primitive work is triggered by a pattern, route, screenshot, template,
canonical, or visible defect, use `../layer-work-preflight.md` before
implementation. The primitive may proceed only for decisions classified as
Layer 3 primitive work in that ledger.

## Allowed Outputs

Create or update one PrimitiveDefinitionArtifact.

Use `TEMPLATE.md` as the output shape unless a repo-local template already
exists for the same primitive family.

Keep the artifact lean enough for sentence-level review.

Define only primitive-layer decisions:

- primitive responsibility and non-goals
- upstream behavior rule and token dependencies
- required inventory result
- shared contract scope and any system-specific proof scope
- behavior contract
- accessibility contract
- allowed states
- data or event contract when relevant
- visual-skin boundary
- public consumption boundary
- forbidden local behavior
- required evidence before later layers may consume the primitive

Produce an implementation-plan recommendation when the request spans multiple
later layers.

## Allowed Files

Shared primitive contract artifacts must be created in:

docs/design-system/03-primitive/shared/<primitive-name>/<PrimitiveName>-Contract.md

The shared primitive contract owns behavior, accessibility semantics, allowed
states, token dependency requirements, and the public consumer boundary.

System proof artifacts may be created in:

docs/design-system/03-primitive/systems/<system-key>/<primitive-name>/<PrimitiveName>-Proof.md

The system proof owns rendered evidence that one design system can implement
the shared primitive contract using signed token seams. It must not change the
shared primitive behavior, accessibility semantics, state meaning, emitted
events, or consumer obligations.

These governance artifacts are not runtime construction APIs. Downstream source
may consult them for readiness and allowed-use rules, but must consume governed
Layer 3 runtime seams under `src/frontend/designSystem/layers/03-primitive/`
when those seams exist.

Layer 3 primitive code seams may be planned, but not created by default, under:

src/frontend/designSystem/layers/03-primitive/<primitive-name>/

Layer 3 primitive visual proof routes may be planned, but not created by
default, under:

src/frontend/designSystem/systems/<system-key>/primitives/<primitive-name>/

This skill may update this layer's own examples, template, evals, and README
when the user is building or refining the harness.

This skill must not edit implementation files unless the user explicitly asks
for primitive implementation after the PrimitiveDefinitionArtifact is accepted.

When the user explicitly asks for primitive implementation, the implementation
must still satisfy the preflight ledger, token-consumption rules, and
`../rendered-proof-requirements.md` before readiness may be claimed.

## Forbidden Moves

Do not create patterns.
Do not create component seams.
Do not create demo routes.
Do not create canonical scenarios.
Do not adopt anything into the app.

Do not define token values or consume token-type templates as if they were
signed token decisions.

Do not copy primitive markup from app pages, `/design-system` route-local
markup, screenshots, or chat history.

Do not treat shared CSS imports alone as a primitive public seam.

Do not let patterns, components, demos, canonicals, app pages, or LLM-generated
page work reconstruct primitive markup, ARIA rules, states, controller
behavior, or CSS from governance prose, screenshots, route-local markup, copied
CSS, or chat history when a governed runtime seam exists.

Do not invent local CSS values, interaction logic, ARIA behavior, or controller
behavior to get around a missing token or missing primitive decision.

Do not define product workflow, product data loading, page layout, composed
slots, or app-specific helper behavior inside a primitive.

Do not mark a primitive `review-ready` or `accepted` while any required token is
missing from the token readiness index.

## Layer Boundary Rules

Before writing the PrimitiveDefinitionArtifact, classify every requested detail
as one of:

- behavior-rule correction
- token correction
- primitive
- pattern plus contract
- component seam
- component render proof
- use-case page
- canonical scenario
- first app adoption
- adoption/parity test
- artifact/index update

Only primitive details may be written as approved decisions in the primitive
artifact.

If the behavior rule is missing, stale, or too vague to justify the primitive,
stop and route back to `01-behavior-rule`.

If a required token is not consumable for the selected token dependency system, stop and
route back to `02-token`.

If a required token is missing for only one design system, block that system's
primitive skin or proof. Do not duplicate or weaken the shared primitive
contract.

If later-layer details are needed, record them as downstream dependencies or
next steps instead of defining them.

## Token Consumption Rules

Always check `docs/design-system/02-token/token-readiness-index.md`.

The primitive may consume only token seams listed as consumable for the selected
token dependency system.

If the primitive needs a token that is template-only, missing, or not available
for the selected token dependency system, mark the primitive `blocked` and name the
earliest token work required.

The primitive artifact must name every token dependency by token type, shared
token contract path, system implementation path, token dependency system,
governed Layer 2 runtime seam, and the primitive decision it supports.

Later layers should consume token seams through
`src/frontend/designSystem/layers/02-token/` instead of reaching directly into
`src/frontend/designSystem/systems/<system-key>/`.

The primitive must not hard-code visual values that belong to the token layer.

When a primitive needs a non-color visual affordance to expose state or meaning
without relying on color alone, that affordance is a required Layer 2 token
dependency before the primitive may render it. Examples include current markers,
selected bars, active indicators, dots, icons, underlines, badges, checkmarks,
disabled overlays, or other visible state indicators. The primitive may own the
semantic state and behavior, but the visible affordance shape, size, placement,
thickness, spacing, radius, color source, and allowed variants must come from a
signed token seam or the primitive must remain blocked and route back to
`02-token`.

Every visible text role rendered by a primitive must be backed by a signed
Layer 2 text-style token dependency before the primitive may render it. A
primitive may not style secondary labels, supporting text, counts, metadata,
helper text, status text, or captions with local font size, weight, line height,
letter spacing, opacity, transform, or font-family values. If the text role has
no signed token, either remove that rendered text from the primitive proof or
route back to `02-token`.

Every primitive geometry, spacing, surface, marker, icon, typography, focus,
motion, scroll, width, height, target-size, radius, shadow, and overflow
decision must be classified before implementation as either:

- consumed from a signed Layer 2 token seam
- inherited from a containing later-layer contract
- browser-native semantic behavior
- proof-only diagnostic pressure that cannot be consumed downstream

If the decision affects runtime rendering and is not browser-native or
explicitly inherited, it must come from a signed token seam. Proof-only
diagnostic values must be named as proof-only in the route, excluded from
runtime seams, and covered by browser evidence that the control actually
changes rendered evidence or preserves the promised behavior.

The primitive contract must not vary behavior, accessibility semantics, state
meaning, emitted events, or consumer obligations by design system.

## Runtime Primitive Seam Policy

A runtime primitive seam is the importable contract that later layers may use
after the primitive contract and selected system proof are review-ready.

Layer 3 runtime seams may expose:

- a render helper that owns primitive HTML and semantic attributes
- a small data/spec helper that resolves approved primitive variants from
  signed token seams
- CSS classes or data attributes only when they are generated by or documented
  as part of the primitive seam

Layer 3 runtime seams must not expose:

- route-local demo markup as a consumer API
- shared CSS imports by themselves as proof of adoption
- app-specific wrappers, page layout, product copy, or workflow behavior
- local visual values that bypass signed Layer 2 tokens
- non-color state indicators or affordances that have not been signed as Layer
  2 token dependencies
- behavior, accessibility semantics, states, or events that vary by design
  system

If a primitive is non-interactive, the preferred first runtime seam is a small
spec or render helper that preserves semantics and token consumption. Do not add
controller code when there is no primitive behavior to control.

## Inventory Rules

Always check whether a governed primitive already covers the need.

Do not treat app pages, older design-system routes, token pages, patterns,
components, or canonical scenarios as governed primitive inventory unless a
PrimitiveDefinitionArtifact names them as the primitive source of truth.

If an existing governed primitive covers the need, record reuse instead of
creating a duplicate.

If no governed primitive covers the need, define the smallest new primitive
that satisfies the behavior rule and signed token dependencies.

If the inventory cannot be checked, mark the primitive `blocked` or `draft`; do
not mark it `review-ready` or `accepted`.

## Accessibility Responsibility

The primitive layer owns roles, names, keyboard operation, focus behavior,
disabled behavior, state exposure, target-size expectations, and semantic HTML
for the primitive.

It must reference the shared WCAG 2.2 AA default:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`

It must name observable accessibility requirements. It must not say only that
the primitive is "accessible" or "WCAG compliant."

For non-interactive primitives, it must explicitly state which interactive
accessibility responsibilities do not apply and which semantic or contrast
responsibilities are inherited from tokens or later layers.

## Build Steps

Read the behavior rule for the target UI family.

Classify the requested details by layer.

Check the token readiness index for every required token dependency.

Check existing primitive inventory under `docs/design-system/03-primitive/` and
known implementation seams only as evidence, not as authority.

Check `docs/design-system/03-primitive/primitive-readiness-index.md` before
claiming any primitive is consumable by later layers.

Decide whether the primitive reuses an existing primitive, defines a new
primitive, or is blocked.

Write the purpose in plain language.

Define the primitive responsibility narrowly enough that it is smaller than a
pattern.

Define behavior, accessibility, allowed states, and data/event contract only
when they change downstream behavior or evaluation.

Name token dependencies without defining new token values.

Name the public consumption boundary so later layers know what to consume and
what not to copy.

Name the runtime primitive seam policy so later layers know whether they are
waiting for a render helper, data/spec helper, CSS/data-attribute contract, or
an explicit blocked state.

Record visual-skin boundaries and proof systems so design-system
implementations can vary appearance without changing behavior or accessibility
semantics.

Record required evidence, including rendered verification when implementation
or a proof route is in scope.

Record how to view the rendered primitive proof. If no rendered proof route
exists because the work is docs-only, blocked, or proof is not yet implemented,
state that explicitly and name the blocker.

Write consumer restrictions that prevent app-local recreation, copied markup,
local CSS values, and duplicated controller behavior.

If multiple layers are involved, write a short implementation-plan
recommendation instead of merging the layers.

## Eval Before Handoff

Run the checks in `EVAL.md`.

Run the checks in `ACCESSIBILITY-EVAL.md`.

Always include a rendered-view output for the completed loop: the exact
`/design-system/<system-key>/primitives/<primitive-name>` route when it exists,
or `none` with the reason it is unavailable.
