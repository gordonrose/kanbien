# Demo Page Eval

Assume the DemoPageArtifact is premature, too broad, or becoming an app
implementation until each check passes.

## Required Input Checks

Pass only if the UI family name is explicit.

Pass only if the demo page name is explicit.

Pass only if a Layer 5 component seam contract path is named.

Pass only if the component seam is listed as review-ready or accepted in
`docs/design-system/05-component-seam/component-readiness-index.md`.

Pass only if the component runtime seam and controller export are named when
interaction is in scope.

Pass only if the intended route or equivalent rendered review surface is
named.

Pass only if required fixture states, viewport contexts, themes, direction,
magnification, reduced-motion, overflow, and interaction cases are named or
explicitly not applicable.

Pass only if source-material-derived or visible-defect demo work includes a
preflight decision ledger from `../layer-work-preflight.md` showing that every
demo decision is owned by Layer 6.

## Required Output Checks

Pass only if the DemoPageArtifact uses the fixed lean template sections.

Pass only if the output governs one rendered review job.

Pass only if `Upstream Gates` records component status, component readiness
source, component runtime seam status, selected-system consumability, and
consumer context status.

Pass only if `Demo Surface` names the route or rendered surface, the component
runtime seam export, controller attachment, allowed proof-only controls, and
forbidden construction sources.

Pass only if fixtures and states are included only when they prove observable
component behavior, accessibility, responsive posture, or consumer boundary.

Pass only if every proof-only control changes rendered visual, geometry, state,
interaction, accessibility, or responsive evidence required by the component
contract.

Pass only if interaction evidence uses the component seam/controller and
component events rather than primitive listeners or copied pattern behavior.

Pass only if responsive and environment coverage names the contract requirement
or risk each context proves.

Pass only if `Accessibility Preservation` names concrete inherited
requirements and rendered proof obligations.

Pass only if `Import And Dependency Boundary` prevents imports from feature
persistence, backend transport, app page modules, lower-layer route-local proof
modules, and legacy design-system route markup.

Pass only if `docs/design-system/06-demo-page/demo-readiness-index.md` will be
updated in the same change when the demo becomes review-ready.

Pass only if `Next Layer` states whether the next layer is allowed, blocked, or
scaffold-only.

## No Fake Determinism Checks

Apply the shared harness quality bar:

- `../harness-quality-bar.md`

Fail if a fixture, state, control, status value, table row, or artifact file
does not prevent a specific failure or change the next allowed action.

Fail if the artifact invents a universal demo taxonomy before real demo work
has earned it.

Fail if proof controls are decorative knobs that do not change review evidence.

Fail if fixture categories become labels without affecting evidence or allowed
behavior.

## Layer Boundary Checks

Fail if the artifact revises behavior-rule meaning instead of routing back to
`01-behavior-rule`.

Fail if the artifact defines token values instead of routing back to
`02-token`.

Fail if the artifact redefines primitive behavior, semantics, state meaning, or
token consumption instead of routing back to `03-primitive`.

Fail if the artifact revises pattern composition, slot ownership, or allowed
states instead of routing back to `04-pattern-contract`.

Fail if the artifact revises component receptors, event translation,
controller ownership, or feature-adapter boundaries instead of routing back to
`05-component-seam`.

Fail if the artifact defines canonical scenarios or app adoption before those
later layers.

Fail if the artifact defines app wrappers, route topology, product workflow,
backend query semantics, persistence behavior, or authorization rules.

Fail if the demo requires consumers to copy route markup, fixture helpers,
proof-only controls, local CSS, primitive behavior, or controller logic.

Fail if backend, persistence, or app code is expected to import the demo route
as a construction API.

## Pass Result

Use `demo-page-pass` only when the DemoPageArtifact passes this eval and
`ACCESSIBILITY-EVAL.md`.

Name the next allowed layer.

## Fail Result

Use `demo-page-fail` when required input is missing, the upstream component is
not consumable, the artifact violates the layer boundary, or it cannot guide
the next layer.

Name the smallest correction needed.
