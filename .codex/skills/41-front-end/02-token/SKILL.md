---
name: frontend-token-maintainer
description: Use when creating or revising governed Layer 2 design-system TokenDefinitionArtifacts after a behavior rule has passed, especially for reusable color, typography, spacing, focus, surface, motion, sizing, and layout values that downstream primitives, patterns, components, demos, canonicals, or apps must consume instead of hard-coding.
---

# Frontend Token Maintainer

## Purpose

Define the smallest approved reusable token contract and system implementation
needed by one UI family.

The token layer turns behavior-rule needs into governed visual, sizing, motion,
spacing, typography, surface, focus, color, or layout values.

The shared token contract defines the roles, fields, and consumer rules every
design system must preserve. A system token implementation defines the concrete
values, mappings, review route, and evidence for one registered design system.

Tokens are reusable facts. A system token implementation must be deterministic
enough for a human to review and for proof routes or runtime seams to be
generated or validated without LLM interpretation.

Tokens must not become component anatomy, product workflow, app adoption, or
demo-only styling.

## Use When

Use this skill when an accepted behavior rule names `02-token` as the next
layer and the request is to confirm, define, revise, or retire token decisions.

Use this skill when a primitive, pattern, component, demo, canonical, or app
adoption ask is blocked because a required reusable value is missing or
ungoverned.

Use this skill when existing token decisions may be duplicated, renamed, or
hard-coded locally unless a governed TokenDefinitionArtifact clarifies the allowed
source of truth.

Use this skill before proposing, planning, inventorying readiness, choosing the
next token seam, evaluating blockers, explaining implementation steps, creating
artifacts, or editing files for Layer 2 token work.

## Required Inputs

You need the UI family name.

You need an accepted or review-ready behavior rule path for the same UI family.

You need the specific token need named by the behavior rule or downstream
blocker.

You need the implementation system key when concrete values, routes, runtime
modules, or proof are being defined.

You need the existing token inventory or a recorded statement that the
inventory check is missing and blocks approval.

You need the required review dimensions from the behavior rule.

You need the expected consumers or a recorded statement that consumer scope is
missing and blocks approval.

You need any accessibility risks introduced by the token category, especially
contrast, focus visibility, target size, text sizing, motion, and
color-independent meaning.

When token work is triggered by a primitive, pattern, route, screenshot,
template, canonical, or visible defect, use `../layer-work-preflight.md`
before implementation. The token may proceed only for decisions classified as
Layer 2 token work in that ledger.

## Allowed Outputs

Create or update one TokenDefinitionArtifact.

Use `TEMPLATE.md` as the output shape unless a repo-local template already
exists for the same token category.

Keep the TokenDefinitionArtifact lean enough for sentence-level review.

Update `docs/design-system/02-token/token-readiness-index.md` when a token type
moves into or out of consumable readiness.

Define only token-layer decisions:

- token category and shared contract scope
- existing-token reuse or smallest new token set
- token names, roles, required fields, and allowed consumers that every system
  must preserve
- system-specific values, mappings, page route, governed runtime seam, and
  proof for one implementation system
- deterministic variant structure with preview, metadata, and use-case
  instructions
- required design-system page route under `/design-system/<system-key>/tokens/`
- reusable governed Layer 2 runtime seam consumed by primitives and later
  layers
- proof-route support modules and renderer seams consumed by token proof pages
- review evidence needed to trust the token across required dimensions
- downstream restrictions that prevent local literals or route-only CSS

Produce an implementation-plan recommendation when the request spans multiple
later layers.

## Allowed Files

Shared token contract artifacts must be created in:

docs/design-system/02-token/shared/<token-type-or-family>/<TokenType>-Contract.md

System implementation and proof artifacts must be created in:

docs/design-system/02-token/systems/<system-key>/<token-type-or-family>/<TokenType>-Implementation.md

The shared contract path owns roles, fields, and consumer restrictions that
must remain stable across design systems.

The system implementation path owns concrete values, proof route support, and
verification evidence for one design system.

These governance artifacts are not runtime construction APIs. Downstream source
may consult them for readiness and allowed-use rules, but must consume governed
Layer 2 runtime seams under `src/frontend/designSystem/layers/02-token/` when
those seams exist.

Layer 2 governed runtime seams for later layers must be planned under:

src/frontend/designSystem/layers/02-token/<token-type-or-family>/

Layer 2 token pages for a design-system implementation must be planned under:

src/frontend/designSystem/systems/<system-key>/tokens/<token-type-or-family>/index.html

Layer 2 token contracts must be planned under:

src/frontend/designSystem/layers/02-token/<token-type-or-family>/contract.mjs

Layer 2 system token proof modules must be planned under:

src/frontend/designSystem/systems/<system-key>/tokens/proofs/<token-type-or-family>.tokens.mjs

Layer 2 token route bootstraps must be planned beside their route HTML under:

src/frontend/designSystem/systems/<system-key>/tokens/<token-type-or-family>/page.mjs

Layer 2 shared token render seams must be planned under:

src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs

Behavior-rule handoff artifacts for token work may exist in:

docs/design-system/01-behavior-rule/shared/<UI Family Name>/<UI Family Name>-Behaviour.md

This skill may update this layer's own examples, template, evals, and README
when the user is building or refining the harness.

When the user approves Layer 2 token work, the default path is to create or
update the TokenDefinitionArtifact, governed runtime seam, proof route, renderer
support, focused tests, and readiness-index status in one governed slice.

Keep the token non-consumable until proof and verification pass.

Rendered token proof routes must make dependency chains reviewable by default.
If a token is derived from, paired with, or affected by another token or
variant, the proof must show the upstream identity, upstream value, formula or
mapping, final rendered value, and a diagnostic override for the upstream value
when changing that value would alter the rendered result. The override must be
clearly proof-only and must not mutate signed token data, readiness indexes, or
system implementation truth.

Rendered proof controls must be honest. A control is allowed only when changing
it changes rendered evidence, verifies a responsive or accessibility risk, or
proves a consumer boundary. If a proof control is present, focused browser
evidence must assert the rendered output changes or the relevant behavior is
preserved. Do not leave inert controls on proof routes.

Rendered proof routes must also satisfy `../rendered-proof-requirements.md`.

Stop before runtime or proof implementation only when the user asks for
docs-only planning, when required input is missing, or when the token decision
is blocked. In that case, the TokenDefinitionArtifact may specify required page
and seam paths without creating those files.

## Forbidden Moves

Do not create primitives.
Do not create pattern contracts.
Do not create component seams.
Do not create demo routes.
Do not create canonical scenarios.
Do not adopt anything into the app.

Do not define product workflow states.

Do not choose component props, slots, DOM structure, app import paths, route
wrappers, or demo fixture behavior.

Do not define a system token implementation as prose only when it creates or
updates concrete values, proof-route data, or a governed runtime seam. That
implementation must include the deterministic `tokenDefinitionV1` block from
`TEMPLATE.md`.

Shared token contracts do not need a `tokenDefinitionV1` block unless they also
define system implementation values, which they should avoid by default.

Do not define a token page that cannot be fed by the reusable contract,
system proof module, and renderer seams.

Do not let primitives, patterns, components, demos, canonicals, app pages, or
LLM-generated page work reconstruct token values from governance prose,
screenshots, route-local CSS, or chat history when a governed runtime seam
exists.

Do not treat a system implementation value as a shared token contract rule.

Do not treat a shared token contract rule as belonging only to one design
system unless an explicit exception is recorded.

Do not add a token just because a value appears once.

Do not rename an existing approved token unless the TokenDefinitionArtifact records the
compatibility and migration decision.

Do not treat color as the only carrier of meaning.

Do not mark a visual token as approved when contrast, focus visibility, target
size, text sizing, motion, or theme evidence is required but missing.

## Layer Boundary Rules

Before writing the TokenDefinitionArtifact, classify every requested detail as one of:

- behavior-rule correction
- token
- primitive
- pattern plus contract
- component seam
- demo page
- canonical scenario
- first app adoption
- adoption/parity test
- artifact/index update

Only token details may be written as approved decisions in the TokenDefinitionArtifact.

If the behavior rule is missing, stale, or too vague to justify the token, stop
and route back to `01-behavior-rule`.

If a later-layer detail is needed, record it as a downstream dependency or next
step instead of defining it.

## Inventory Rules

Always check whether an existing governed token already covers the need.

If an existing token covers the need, record reuse and consumer rules rather
than creating a duplicate.

If no existing token covers the need, define the smallest new token set that
supports the behavior rule and required review dimensions.

If the inventory cannot be checked, mark the TokenDefinitionArtifact `blocked` or
`draft`; do not mark it `accepted`.

## Accessibility Responsibility

The token layer owns accessibility proof for accessibility-relevant token
decisions it introduces.

For color tokens, it owns contrast expectations, theme comparison, and
color-independent meaning constraints.

For focus tokens, it owns visible focus requirements and theme proof.

For sizing and spacing tokens, it owns target-size, reflow, and magnification
risks introduced by the token.

For typography tokens, it owns text sizing, line height, spacing, and reflow
risks introduced by the token.

For motion tokens, it owns reduced-motion expectations and motion safety.

It must reference the shared WCAG 2.2 AA default:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`

## Build Steps

Read the behavior rule for the target UI family.

Confirm the behavior rule names `02-token` as allowed, or record why token work
is blocked.

Classify the requested details by layer.

Identify the token category and the specific reusable value decision.

Check the existing token inventory.

Choose the token-type template from `token-type-templates/` and use its
`outputGeneration`, `reusableCodeSeam`, `pageStructure`, and `variantSchema`
sections to populate the TokenDefinitionArtifact.

Record the token-type template rationale before accepting the token shape. The
rationale must explain the token-type drift or product failure being prevented,
the reference basis for the template shape, which fields change downstream
behavior, which fields are evidence-only, and what over-structure was avoided.

Decide whether the TokenDefinitionArtifact reuses existing tokens, defines new tokens, or is
blocked.

Define token names, values, mappings, variant preview metadata, use-case
instructions, page route, and seam exports only when the inventory and evidence
support approval. Classify each decision as shared contract or system
implementation.

If the token depends on another token or token variant, record the dependency
chain before proof implementation. The artifact and rendered proof must expose
the upstream token id or name, upstream value, formula or mapping, final
rendered value, and what changes when the upstream value changes.

For visual derived tokens, add a rendered diagnostic override when it is safe
to perturb the upstream value in review. The override must change only rendered
proof previews. It must not mutate `tokenDefinitionV1.variants`, signed system
values, or readiness-index truth.

Name required evidence for themes, direction, magnification, density, and any
accessibility-relevant state.

Write consumer restrictions that prevent app-local literals, route-local CSS,
or downstream hard-coding.

Complete the storage and consumption plan so later layers know where to read
the token decision.

Complete the page and code seam plan so the output has a deterministic
`/design-system/<system-key>/tokens/` review surface backed by reusable
contract and system proof data.

For derived tokens, the review surface must make the dependency chain visible
without source inspection. A human reviewer must be able to see where the value
comes from, how it is calculated or mapped, and how the rendered proof responds
to a temporary upstream override when such an override is applicable.

Unless the user requested docs-only planning or a blocker stops implementation,
create or update the planned contract module, governed runtime seam, system
proof module, proof route, route bootstrap, renderer support, and focused tests
in the same slice.

Keep the readiness index in a non-consumable state while implementation or
evidence is incomplete. Promote the token to consumable only after the runtime
seam, proof route, verification evidence, and readiness-index entry agree.

Record how to view the rendered token proof. If no rendered proof route exists
because the work is docs-only or blocked, state that explicitly and name the
blocker.

If the request includes primitive, pattern, component, demo, canonical, or app
work, write a short implementation-plan recommendation instead of merging the
layers.

## Eval Before Handoff

Run the checks in `EVAL.md`.

Run the checks in `ACCESSIBILITY-EVAL.md`.

Do not name a later layer as allowed until both evals pass or an explicit
exception is recorded.

## Stop Conditions

Stop if the target UI family is unclear.

Stop if the behavior rule is missing or does not provide a clear token need.

Stop if the existing token inventory has not been checked and the request would
create or rename tokens.

Stop if the requested token type does not have a predefined
`token-type-templates/` structure.

Stop if the TokenDefinitionArtifact cannot express every variant with preview,
metadata, and use-case instructions.

Stop if a derived token cannot name its upstream token dependency, formula or
mapping, final rendered value, and rendered proof behavior.

Stop if the token page would require page-local one-off rendering instead of
the reusable contract, system proof module, and renderer seams.

Stop if the token decision would conflict with WCAG 2.2 AA and no explicit
exception has been approved.

Stop if the request cannot be completed without defining primitive behavior,
pattern structure, component APIs, demo routes, canonical files, or app
adoption details.

Stop if a token would encode product-specific workflow meaning instead of a
reusable visual fact.

## Handoff

When the TokenDefinitionArtifact passes, name the next expected layer and whether it is
allowed, blocked, or scaffold-only.

Always include a rendered-view output for the completed loop: the exact
`/design-system/<system-key>/tokens/<token-type-or-family>` route when it
exists, or `none` with the reason it is unavailable.

For derived tokens, also state whether the rendered proof exposes the upstream
dependency chain and whether a diagnostic override is available or intentionally
not applicable.

If the next expected layer is scaffold-only, do not hand off to real layer
work. State that the later layer needs its own `SKILL.md`, `TEMPLATE.md`,
`EVAL.md`, `ACCESSIBILITY-EVAL.md`, and examples before it can govern real
work.
