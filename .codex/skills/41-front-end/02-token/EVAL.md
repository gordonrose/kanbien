# Token Eval

Assume the TokenDefinitionArtifact is premature, duplicated, or smuggling later-layer
work until each check passes.

## Required Input Checks

Pass only if the UI family name is explicit.

Pass only if a behavior rule path is named.

Pass only if the behavior rule is accepted or review-ready and names a token
need.

Pass only if the token category is explicit.

Pass only if the token category maps to a predefined structure under
`token-type-templates/`.

Pass only if the TokenDefinitionArtifact's page route, page file, contract module,
system token module, system token export, renderer module, renderer export,
preview kind, and variant fields match the selected token-type template.

Pass only if `Token Type Template Rationale` explains what drift or product
failure the selected token-type template prevents, what references inform it,
which fields change downstream behavior, which fields are evidence-only, and
what over-structure was avoided.

Pass only if the existing token inventory was checked or the TokenDefinitionArtifact is marked
blocked.

Pass only if expected consumers are named or the missing consumer decision is
recorded as blocking approval.

Pass only if required review dimensions are carried forward from the behavior
rule.

## Required Output Checks

Pass only if the TokenDefinitionArtifact uses the fixed lean template sections.

Pass only if `Token Metadata` names the design system, UI family, harness
layer, token status, behavior rule path, relevant URLs, TokenDefinitionArtifact path,
and files affected now.

Pass only if the output governs one UI family and one coherent token need.

Pass only if the purpose is written in plain language.

Pass only if `Inventory Check` records what was checked and whether reuse,
revision, new token definition, or blocking is the result.

Pass only if `Token Type Template Rationale` justifies the selected token-type
template without claiming a universal industry-best-practice shape.

Pass only if new token decisions are the smallest set needed to satisfy the
behavior rule.

Pass only if `Approved Token Decisions` contains only token-layer decisions.

Pass only if exactly one `tokenDefinitionV1` JSON block is present and its
required paths, exports, and variants match the human-readable sections.

Pass only if every variant includes a stable id, preview, metadata, and
use-case instructions.

Pass only if `Page And Code Seam` names a page under
`/design-system/<system-key>/tokens/` and reusable contract/system-token/render
seams.

Pass only if `Allowed Consumers` changes what downstream layers may do.

Pass only if `Required Evidence` names the proof needed for themes, direction,
magnification, constrained layout or density, and accessibility.

Pass only if consumer restrictions prevent local hard-coding, route-local CSS,
and screenshot/demo copying.

Pass only if `Storage And Consumption Plan` names the stored TokenDefinitionArtifact path,
stable lookup key, how later layers consume it, what later layers preserve,
what must not consume it, what must not be used instead, and required evals.

Pass only if `Next Layer` states whether the next layer is allowed, blocked,
or scaffold-only.

Pass only if multi-layer requests produce an implementation-plan
recommendation instead of a merged TokenDefinitionArtifact.

## No Fake Determinism Checks

Apply the shared harness quality bar:

- `../harness-quality-bar.md`

Fail if a table, status value, checklist row, or required field does not
prevent a specific failure or change the next allowed action.

Fail if a simpler sentence would create the same enforcement.

Fail if placeholder values invite fake precision.

Fail if the TokenDefinitionArtifact creates a token category or state matrix where one clear
rule would do.

Fail if the deterministic JSON block contains prose placeholders in an
TokenDefinitionArtifact with status `review-ready` or `accepted`.

## Layer Boundary Checks

Fail if the TokenDefinitionArtifact creates or revises behavior-rule meaning instead of
routing back to `01-behavior-rule`.

Fail if the TokenDefinitionArtifact chooses primitive names, roles, keyboard behavior, or
disabled behavior before the primitive layer.

Fail if the TokenDefinitionArtifact defines pattern structure, slots, responsive anatomy, or
data contracts before the pattern-contract layer.

Fail if the TokenDefinitionArtifact defines component props, adapters, or import paths before
the component-seam layer.

Fail if the TokenDefinitionArtifact defines demo routes or fixture behavior before the
demo-page layer.

Fail if the TokenDefinitionArtifact defines canonical scenario files before the
canonical-scenarios layer.

Fail if the TokenDefinitionArtifact defines app wrappers, app imports, or app-local CSS before
the first-app-adoption layer.

Fail if the TokenDefinitionArtifact defines a one-off token page that is not fed by the shared
contract, system-token, and renderer seams.

Fail if the TokenDefinitionArtifact encodes product-specific workflow meaning as a token.

Fail if the TokenDefinitionArtifact duplicates or renames an existing approved token without
recording compatibility and migration posture.

Fail if a local literal remains allowed where the TokenDefinitionArtifact now governs
the decision.

## Foundation-First Checks

Pass only if the TokenDefinitionArtifact steers later-layer requests toward the earliest
missing foundation layer.

Pass only if later layers cannot claim completion while a required token
decision or evidence item remains unresolved.

Fail if the TokenDefinitionArtifact lets primitives, patterns, components, demos, canonicals,
or apps invent visual values that this token layer owns.

## Clarity Checks

Fail if a sentence cannot be understood without chat history.

Fail if a sentence uses vague praise such as "clean", "modern", "intuitive",
or "nice" without observable meaning.

Fail if the TokenDefinitionArtifact relies on screenshots or examples as the only source of
truth.

Fail if the TokenDefinitionArtifact is long enough that an individual sentence cannot be
reviewed comfortably.

## Pass Result

Use `token-pass` only when the TokenDefinitionArtifact passes this eval and
`ACCESSIBILITY-EVAL.md`.

Name the next allowed layer.

## Fail Result

Use `token-fail` when the TokenDefinitionArtifact is missing required input, violates the
layer boundary, duplicates existing token decisions, or cannot guide the next
layer.

Name the smallest correction needed.
