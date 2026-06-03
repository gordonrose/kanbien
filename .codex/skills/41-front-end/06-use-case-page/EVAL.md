# Use-Case Page Eval

Use this eval for Layer 6 use-case page artifacts.

Pass only when the artifact creates enforceable page-family evidence and does
not smuggle component, pattern, backend, app, or canonical decisions into
Layer 6.

## Required Result

Use `use-case-page-pass` only when all required checks pass.

Use `use-case-page-fail` when any required input is missing, an upstream seam
is not consumable, or the artifact defines decisions owned by another layer.

## Required Checks

The artifact must name:

- the use-case page family
- the component seams it consumes
- the Layer 5 render proof for every required component seam, or an explicit
  blocker
- the rendered route or equivalent review surface
- the representative fixture or feature-projection shapes
- the page states, interactions, responsive contexts, themes, direction,
  magnification, motion, and overflow evidence required for review
- the consumer boundary that forbids copying route markup, local CSS, fixture
  helpers, proof controls, screenshots, or chat history

The artifact must consume component seams listed in:

- `docs/design-system/05-component-seam/component-readiness-index.md`

The artifact must not define or revise:

- token values
- primitive behavior
- pattern composition
- component receptors
- component render-proof-only behavior
- canonical scenarios
- app wrappers
- backend query semantics
- persistence behavior
- authorization rules
- durable route topology

Proof-only controls must be honest. Each control must change observable page
evidence required by the use-case contract.

The readiness index must be updated when the page is review-ready:

- `docs/design-system/06-use-case-page/use-case-page-readiness-index.md`

Rendered proof routes must satisfy:

- `../rendered-proof-requirements.md`

## Failure Triggers

Fail if the artifact treats a Layer 5 component render proof as Layer 6.

Fail if the artifact is only a component seam proving one component in
isolation.

Fail if it copies markup, controller setup, ARIA behavior, CSS, or fixture
helpers from a Layer 5 render proof instead of consuming the governed runtime
seam.

Fail if it turns representative fixtures into backend contract, authorization,
persistence, product workflow, or route-state truth.

Fail if later consumers would need to import route-local modules instead of
Layer 5 component seams.
