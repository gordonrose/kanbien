# Pattern Contract Eval

Assume the PatternContractArtifact is premature, too broad, or smuggling later
layers until each check passes.

## Required Input Checks

Pass only if the UI family name is explicit.

Pass only if the pattern name is explicit.

Pass only if a behavior rule path is named.

Pass only if every required primitive is listed as consumable for the selected
system in `docs/design-system/03-primitive/primitive-readiness-index.md`.

Pass only if every direct token dependency is listed as consumable for the
selected system in `docs/design-system/02-token/token-readiness-index.md`, or
the artifact states that no direct token dependency exists.

Pass only if the pattern inventory was checked or the artifact is marked
`blocked` or `draft`.

Pass only if `docs/design-system/04-pattern-contract/pattern-readiness-index.md`
will be updated in the same change when the pattern becomes consumable.

Pass only if expected consumers are named or the missing consumer decision is
recorded as blocking approval.

Pass only if representative data shape is recorded when the pattern displays or
arranges externally meaningful data.

## Required Output Checks

Pass only if the PatternContractArtifact uses the fixed lean template sections.

Pass only if the output governs one reusable composition job.

Pass only if `Upstream Gates` records behavior-rule status, token readiness,
primitive readiness, and inventory.

Pass only if `Primitive Dependencies` names primitive contract path, system
proof, runtime seam, pattern decision supported, and status.

Pass only if direct token dependencies are named only when the pattern consumes
tokens itself rather than through a primitive.

Pass only if `Composition Contract` describes observable pattern composition
without component props, app wrappers, page-specific layout, or product workflow.

Pass only if `Accessibility Contract` names concrete composition
responsibilities rather than saying only "accessible" or "WCAG compliant."

Pass only if `Public Consumption Boundary` prevents consumers from copying
legacy route markup, local CSS, screenshots, or primitive behavior.

Pass only if `Runtime Pattern Seam Policy` states whether the seam is planned,
implemented, blocked, or not applicable and prevents component/app concerns
from becoming the pattern API.

Pass only if `Rendered View` names the exact route to open when a rendered
pattern proof exists, or explicitly states that no rendered view is available.

Pass only if `Next Layer` states whether the next layer is allowed, blocked, or
scaffold-only.

## No Fake Determinism Checks

Apply the shared harness quality bar:

- `../harness-quality-bar.md`

Fail if a table, status value, slot, state, data field, or artifact file does
not prevent a specific failure or change the next allowed action.

Fail if the artifact invents a universal pattern taxonomy before real pattern
work has earned it.

Fail if state lists do not affect behavior, accessibility, emitted events, or
consumer obligations.

## Layer Boundary Checks

Fail if the artifact revises behavior-rule meaning instead of routing back to
`01-behavior-rule`.

Fail if the artifact defines token values instead of routing back to `02-token`.

Fail if the artifact redefines primitive behavior, semantics, state meaning,
controller behavior, or token consumption instead of routing back to
`03-primitive`.

Fail if the artifact defines component props, adapters, or app import paths
before the component-seam layer.

Fail if the artifact defines demo routes, fixtures, or canonical scenarios
before those later layers.

Fail if legacy top-level `src/frontend/designSystem/patterns/` route markup is
treated as a governed Layer 4 source of truth.

## Pass Result

Use `pattern-contract-pass` only when the PatternContractArtifact passes this
eval and `ACCESSIBILITY-EVAL.md`.

Name the next allowed layer.

## Fail Result

Use `pattern-contract-fail` when required input is missing, upstream primitives
or tokens are not consumable, the artifact violates the layer boundary, or it
cannot guide the next layer.

Name the smallest correction needed.
