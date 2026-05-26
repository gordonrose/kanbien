# Primitive Eval

Assume the PrimitiveDefinitionArtifact is premature, too broad, or smuggling
later-layer work until each check passes.

## Required Input Checks

Pass only if the UI family name is explicit.

Pass only if the primitive name is explicit.

Pass only if a behavior rule path is named.

Pass only if the behavior rule is accepted or review-ready and names the
behavior need this primitive satisfies.

Pass only if every required token dependency is listed as consumable for each
selected token dependency system in
`docs/design-system/02-token/token-readiness-index.md`.

Pass only if the primitive inventory was checked or the artifact is marked
`blocked` or `draft`.

Pass only if `docs/design-system/03-primitive/primitive-readiness-index.md`
will be updated in the same change when the primitive becomes consumable.

Pass only if expected consumers are named or the missing consumer decision is
recorded as blocking approval.

Pass only if allowed states are named only when they change behavior,
accessibility, emitted events, or consumer obligations.

## Required Output Checks

Pass only if the PrimitiveDefinitionArtifact uses the fixed lean template
sections.

Pass only if `Primitive Metadata` names the contract scope, reference proof
system, token dependency systems, UI family, primitive name, harness layer,
primitive status, behavior rule path,
shared primitive contract path, system proof path, and files affected now.

Pass only if the output governs one primitive with one low-level reusable job.

Pass only if the purpose is written in plain language.

Pass only if `Upstream Gates` records behavior-rule status, token readiness
source, token consumability, and primitive inventory.

Pass only if `Token Dependencies` names token type, shared token contract path,
system implementation path, token dependency system, runtime seam, primitive
decision supported, and status for every required token.

Pass only if `Behavior Contract` describes observable primitive behavior
without product workflow or page composition.

Pass only if `Accessibility Contract` names concrete responsibilities rather
than saying only "accessible" or "WCAG compliant."

Pass only if `Data Or Event Contract` is either meaningful for the primitive or
explicitly not applicable.

Pass only if `Visual-Skin Boundary` states what design-system skins may vary
without changing behavior, accessibility, or consumer contracts.

Pass only if the artifact blocks a system-specific primitive skin or proof,
rather than weakening the shared primitive contract, when required tokens are
missing for one selected token dependency system.

Pass only if `Public Consumption Boundary` names what later layers should
consume and what they must not copy.

Pass only if `Runtime Primitive Seam Policy` states whether the seam is
planned, implemented, blocked, or not applicable; names the allowed seam shape;
and prevents route-local markup, shared CSS alone, app wrappers, page layout,
product workflow, and unsigned visual values from becoming the primitive API.

Pass only if `Required Evidence` changes what proof is needed before later
layers can rely on the primitive.

Pass only if `Rendered View` names the exact route to open when a rendered
primitive proof exists, or explicitly states that no rendered view is available
and why.

Pass only if `Consumer Restrictions` prevent local hard-coding, copied markup,
duplicated controller behavior, and route-local source-of-truth drift.

Pass only if `Storage And Consumption Plan` names the stored shared primitive
contract path, stored system proof path, stable lookup key, how later layers
consume them, what later layers preserve, what must not consume them, what must
not be used instead, and required evals.

Pass only if `Next Layer` states whether the next layer is allowed, blocked, or
scaffold-only.

Pass only if multi-layer requests produce an implementation-plan
recommendation instead of a merged primitive artifact.

## No Fake Determinism Checks

Apply the shared harness quality bar:

- `../harness-quality-bar.md`

Fail if a table, status value, checklist row, or required field does not
prevent a specific failure or change the next allowed action.

Fail if a simpler sentence would create the same enforcement.

Fail if placeholder values invite fake precision in a `review-ready` or
`accepted` artifact.

Fail if the artifact invents a universal primitive taxonomy before real
primitive work has earned it.

Fail if the artifact creates state lists that do not affect behavior,
accessibility, emitted events, or consumer obligations.

## Layer Boundary Checks

Fail if the PrimitiveDefinitionArtifact creates or revises behavior-rule
meaning instead of routing back to `01-behavior-rule`.

Fail if the PrimitiveDefinitionArtifact defines token values, aliases, visual
literals, or token category decisions instead of routing back to `02-token`.

Fail if the PrimitiveDefinitionArtifact lets behavior, accessibility semantics,
state meaning, emitted events, or consumer obligations vary by design system.

Fail if the PrimitiveDefinitionArtifact consumes a token-type template or
route-local token page as if it were a signed token seam.

Fail if the PrimitiveDefinitionArtifact defines pattern composition, slots,
responsive anatomy, or multi-primitive choreography before the
pattern-contract layer.

Fail if the PrimitiveDefinitionArtifact defines component props, adapters, or
app import paths before the component-seam layer.

Fail if the PrimitiveDefinitionArtifact defines demo routes or fixture behavior
before the demo-page layer.

Fail if the PrimitiveDefinitionArtifact defines canonical scenario files before
the canonical-scenarios layer.

Fail if the PrimitiveDefinitionArtifact defines app wrappers, app imports, or
app-local CSS before the first-app-adoption layer.

Fail if the primitive is really a product workflow, page section, composed
pattern, app-specific helper, or demo-only rendering.

Fail if copied app markup, route-local `/design-system` markup, screenshots, or
chat history are treated as the primitive source of truth.

Fail if shared CSS imports alone are treated as a runtime primitive seam.

## Foundation-First Checks

Pass only if the PrimitiveDefinitionArtifact steers later-layer requests toward
the earliest missing foundation layer.

Pass only if later layers cannot claim completion while required primitive
behavior, accessibility, token dependency, evidence, or public-boundary work
remains unresolved.

Fail if the PrimitiveDefinitionArtifact lets patterns, components, demos,
canonicals, or apps recreate primitive behavior, ARIA, state handling, or CSS
locally.

## Clarity Checks

Fail if a sentence cannot be understood without chat history.

Fail if a sentence uses vague praise such as "clean", "modern", "intuitive",
or "nice" without observable meaning.

Fail if screenshots or examples are the only source of truth.

Fail if the PrimitiveDefinitionArtifact is long enough that an individual
sentence cannot be reviewed comfortably.

## Pass Result

Use `primitive-pass` only when the PrimitiveDefinitionArtifact passes this eval
and `ACCESSIBILITY-EVAL.md`.

Name the next allowed layer.

## Fail Result

Use `primitive-fail` when the PrimitiveDefinitionArtifact is missing required
input, violates the layer boundary, consumes unsigned tokens, duplicates an
existing governed primitive, or cannot guide the next layer.

Name the smallest correction needed.
