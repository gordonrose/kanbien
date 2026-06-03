# Component Seam Eval

Assume the ComponentSeamArtifact is premature, too broad, or smuggling app or
backend work until each check passes.

## Required Input Checks

Pass only if the UI family name is explicit.

Pass only if the component seam name is explicit.

Pass only if a Layer 4 pattern contract path is named.

Pass only if the pattern contract is listed as consumable or review-ready in
`docs/design-system/04-pattern-contract/pattern-readiness-index.md`.

Pass only if the component states the pattern runtime seam it consumes, or
records the missing runtime seam as blocking implementation.

Pass only if expected consumers are named or the missing consumer decision is
recorded as blocking approval.

Pass only if source-material-derived or visible-defect component work includes
a preflight decision ledger from `../layer-work-preflight.md` showing that
every component decision is owned by Layer 5.

Pass only if feature/API projection needs are recorded when the seam maps
domain behavior, route data, query state, filters, sorting, pagination, or
actions into receptors.

## Required Output Checks

Pass only if the ComponentSeamArtifact uses the fixed lean template sections.

Pass only if the output governs one public consumption job.

Pass only if `Upstream Gates` records pattern status, pattern readiness source,
pattern runtime seam status, and consumer context status.

Pass only if `Public Seam` names the planned module, export, seam shape,
allowed consumers, and forbidden construction sources.

Pass only if every receptor in `Receptor Contract` has a category, shape,
required/optional/unsupported posture, owner of meaning, component
responsibility, and invalid or missing behavior.

Pass only if each receptor value changes observable behavior, semantics,
content, event handling, or consumer obligations.

Pass only if unsupported affordances are explicit when the upstream pattern
supports behavior that a target feature or component seam will not expose.

Pass only if configurable pattern affordances are exposed as receptors only
when the upstream pattern contract governs both enabled and disabled postures.

Pass only if each disabled affordance posture removes or suppresses the
relevant controls, events, feedback, and consumer obligations rather than
leaving inert or misleading UI behind.

Pass only if `Feature Projection Boundary` maps each in-scope feature fact or
action to a receptor, feature-owned source, adapter responsibility, and
backend/API field requirement, or explicitly states `not applicable`.

Pass only if `Event Translation` maps pattern or primitive events into
component-level events, or explicitly states that no events are exposed.

Pass only if `Controller Ownership` names what the component seam owns rather
than leaving app pages to reconstruct open, close, resize, reorder, focus, or
selection behavior locally.

Pass only if `Accessibility Preservation` names concrete inherited
requirements and any receptor requirements needed to preserve them.

Pass only if `Import And Dependency Boundary` prevents imports from feature
persistence, backend transport, app page modules, route-local proof modules,
and legacy design-system route markup.

Pass only if `docs/design-system/05-component-seam/component-readiness-index.md`
will be updated in the same change when the component becomes consumable.

Pass only if `Next Layer` states whether the next layer is allowed, blocked, or
scaffold-only.

## No Fake Determinism Checks

Apply the shared harness quality bar:

- `../harness-quality-bar.md`

Fail if a receptor, status value, table row, event, or artifact file does not
prevent a specific failure or change the next allowed action.

Fail if the artifact invents a universal component taxonomy before real
component work has earned it.

Fail if receptor categories become labels without enforcement.

Fail if optional receptors are used to avoid declaring an unsupported
affordance.

Fail if a component receptor invents a disabled affordance posture that the
upstream pattern does not already govern.

## Layer Boundary Checks

Fail if the artifact revises behavior-rule meaning instead of routing back to
`01-behavior-rule`.

Fail if the artifact defines token values instead of routing back to
`02-token`.

Fail if the artifact redefines primitive behavior, semantics, state meaning,
or token consumption instead of routing back to `03-primitive`.

Fail if the artifact revises pattern composition, slot ownership, or allowed
states instead of routing back to `04-pattern-contract`.

Fail if the artifact defines use-case pages, use-case fixtures, or canonical
scenarios before those later layers.

Fail if the artifact defines app wrappers, route topology, product workflow,
backend query semantics, persistence behavior, or authorization rules.

Fail if the seam exposes arbitrary CSS classes, DOM selectors, raw child markup
that replaces governed pattern structure, or primitive event listeners as
consumer inputs.

Fail if the seam requires consumers to copy pattern proof markup, app markup,
primitive behavior, local CSS, or controller logic.

Fail if backend or persistence code is expected to import the component seam.

## Pass Result

Use `component-seam-pass` only when the ComponentSeamArtifact passes this eval
and `ACCESSIBILITY-EVAL.md`.

Name the next allowed layer.

## Fail Result

Use `component-seam-fail` when required input is missing, the upstream pattern
is not consumable, the artifact violates the layer boundary, or it cannot guide
the next layer.

Name the smallest correction needed.
