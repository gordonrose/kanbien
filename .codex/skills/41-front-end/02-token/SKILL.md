---
name: frontend-token-maintainer
description: Use when creating or revising governed Layer 2 design-system TokenDefinitionArtifacts after a behavior rule has passed, especially for reusable color, typography, spacing, focus, surface, motion, sizing, and layout values that downstream primitives, patterns, components, demos, canonicals, or apps must consume instead of hard-coding.
---

# Frontend Token Maintainer

## Purpose

Define the smallest approved reusable token specification needed by one UI
family.

The token layer turns behavior-rule needs into governed visual, sizing, motion,
spacing, typography, surface, focus, color, or layout values.

Tokens are reusable facts. The TokenDefinitionArtifact must be deterministic enough for a
human to review and for code to be generated or validated from the TokenDefinitionArtifact
without LLM interpretation.

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

## Required Inputs

You need the UI family name.

You need an accepted or review-ready behavior rule path for the same UI family.

You need the specific token need named by the behavior rule or downstream
blocker.

You need the existing token inventory or a recorded statement that the
inventory check is missing and blocks approval.

You need the required review dimensions from the behavior rule.

You need the expected consumers or a recorded statement that consumer scope is
missing and blocks approval.

You need any accessibility risks introduced by the token category, especially
contrast, focus visibility, target size, text sizing, motion, and
color-independent meaning.

## Allowed Outputs

Create or update one TokenDefinitionArtifact.

Use `TEMPLATE.md` as the output shape unless a repo-local template already
exists for the same token category.

Keep the TokenDefinitionArtifact lean enough for sentence-level review.

Update `docs/design-system/02-token/token-readiness-index.md` when a token type
moves into or out of consumable readiness.

Define only token-layer decisions:

- token category and scope
- existing-token reuse or smallest new token set
- token names, values, mappings, and allowed consumers
- deterministic variant structure with preview, metadata, and use-case
  instructions
- required design-system page route under `/design-system/<system-key>/tokens/`
- reusable contract, system-token, and renderer seams consumed by token pages,
  primitives, and patterns
- review evidence needed to trust the token across required dimensions
- downstream restrictions that prevent local literals or route-only CSS

Produce an implementation-plan recommendation when the request spans multiple
later layers.

## Allowed Files

TokenDefinitionArtifacts may be created in:

docs/design-system/02-token/<UI Family Name>/tokens/<UI Family Name>-Tokens.md

Layer 2 token pages for a design-system implementation must be planned under:

src/frontend/designSystem/systems/<system-key>/tokens/<token-type-or-family>/index.html

Layer 2 token contracts must be planned under:

src/frontend/designSystem/contracts/tokens/<token-type-or-family>.contract.mjs

Layer 2 system token implementations must be planned under:

src/frontend/designSystem/systems/<system-key>/tokens/definitions/<token-type-or-family>.tokens.mjs

Layer 2 token route bootstraps must be planned beside their route HTML under:

src/frontend/designSystem/systems/<system-key>/tokens/<token-type-or-family>/page.mjs

Layer 2 shared token render seams must be planned under:

src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs

Behavior-rule handoff artifacts for token work may exist in:

docs/design-system/02-token/<UI Family Name>/behaviour-rules/<UI Family Name>-Behaviour.md

This skill may update this layer's own examples, template, evals, and README
when the user is building or refining the harness.

This skill must not edit implementation files unless the user explicitly asks
for token implementation after the TokenDefinitionArtifact is accepted. A TokenDefinitionArtifact
may specify required page and seam paths without creating those files.

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

Do not define a TokenDefinitionArtifact as prose only. Each TokenDefinitionArtifact must include
the deterministic `tokenDefinitionV1` block from `TEMPLATE.md`.

Do not define a token page that cannot be fed by the reusable contract,
system-token, and renderer seams.

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
support approval.

Name required evidence for themes, direction, magnification, density, and any
accessibility-relevant state.

Write consumer restrictions that prevent app-local literals, route-local CSS,
or downstream hard-coding.

Complete the storage and consumption plan so later layers know where to read
the token decision.

Complete the page and code seam plan so the output has a deterministic
`/design-system/<system-key>/tokens/` review surface backed by reusable
contract and system-token data.

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

Stop if the token page would require page-local one-off rendering instead of
the reusable contract, system-token, and renderer seams.

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

If the next expected layer is scaffold-only, do not hand off to real layer
work. State that the later layer needs its own `SKILL.md`, `TEMPLATE.md`,
`EVAL.md`, `ACCESSIBILITY-EVAL.md`, and examples before it can govern real
work.
