# Behavior Rule Eval

Assume the behavior rule is too broad, too vague, or smuggling later-layer work until each check passes.

## Required Input Checks

Pass only if the UI family name is explicit.

Pass only if the normal user-facing job is stated.

Pass only if known states are listed or the missing state decision is recorded.

Pass only if known non-goals are listed or the artifact says none were provided.

Pass only if requested details were classified by harness layer when the request included more than behavior.

## Required Output Checks

Pass only if the artifact uses the fixed template sections.

Pass only if `Rule Metadata` names the design system, UI family, harness layer, rule status, relevant URLs, and affected files.

Pass only if the output governs one UI family.

Pass only if the purpose is written in plain language.

Pass only if every required state has observable behavior or meaning.

Pass only if interaction rules can be tested or reviewed.

Pass only if consumer restrictions prevent app-local recreation.

Pass only if `Storage And Consumption Plan` names the stored artifact path, stable lookup key, how later layers consume it, what later layers preserve, what must not consume it, what must not be used instead, and required evals.

Fail if the consumption plan only says a later layer "references" the behavior rule.

Fail if the consumption plan invents different consumption behavior for each later layer.

Fail if the consumption plan allows later layers to infer behavior from chat history.

Fail if the consumption plan allows runtime UI code to import the behavior-rule artifact directly.

Pass only if `Next Layer` states whether the next layer is allowed, blocked, or scaffold-only.

Pass only if open decisions are explicit.

Pass only if ungoverned dependencies are named or explicitly absent.

Pass only if temporary overrides are named or explicitly absent.

Pass only if multi-layer requests produce an implementation-plan recommendation instead of a merged artifact.

## Checklist Determinism Checks

Apply the shared harness quality bar:

- `../harness-quality-bar.md`

Fail if a table, status value, checklist row, or required field does not prevent a specific failure or change the next allowed action.

Fail if a simpler sentence would create the same enforcement.

Fail if placeholder values invite fake precision.

Pass only if state rows use one of `included`, `excluded`, or `deferred`.

Pass only if interaction rows use one of `included`, `excluded`, or `deferred`.

Pass only if accessibility rows use one of `included`, `excluded`, or `deferred`.

Pass only if responsive rows use one of `included`, `excluded`, or `deferred`.

Pass only if theme and direction rows use one of `included`, `excluded`, or `deferred`.

Pass only if the state checklist includes right-to-left, zoomed in 150%, zoomed out 75%, dark theme, desert theme, dark theme with error, and desert theme with error.

Pass only if dark theme with error and desert theme with error are classified independently from the base error state.

Pass only if every `deferred` row names the owning later layer.

Pass only if every `included` row has an observable behavior or requirement.

Pass only if every `excluded` row has a clear reason when exclusion could be surprising.

## Layer Boundary Checks

Fail if the artifact chooses primitive names before the primitive layer.

Fail if the artifact chooses token values before the token layer.

Fail if the artifact defines component props or APIs before the component-seam layer.

Fail if the artifact defines demo route behavior before the demo-page layer.

Fail if the artifact defines canonical scenario files before the canonical-scenarios layer.

Fail if the artifact defines app import paths or app wrappers before the first-app-adoption layer.

Fail if a later-layer detail is written as a behavior-rule decision instead of a dependency or next step.

Fail if a lower-layer dependency is used as if it were governed when no governing artifact exists.

Fail if a temporary override lacks scope, reason, owning future layer, and completion limit.

Fail if the artifact tries to resolve a missing token by inventing a token decision.

Fail if the artifact tries to resolve a missing primitive by inventing primitive behavior beyond the observable family behavior.

Fail if the artifact tries to resolve a missing pattern by describing structure, slots, or data contract details.

Fail if the artifact tries to resolve a missing component seam by defining props, adapters, or import paths.

## Foundation-First Checks

Pass only if the artifact steers later-layer requests toward the earliest missing foundation layer.

Pass only if any explicit override says the ungoverned item must be revisited and formalized.

Fail if the artifact lets a later layer claim completion while an ungoverned dependency remains unresolved.

## Clarity Checks

Fail if a sentence cannot be understood without chat history.

Fail if a sentence uses vague praise such as "clean", "modern", "intuitive", or "nice" without observable meaning.

Fail if the artifact relies on screenshots or examples as the only source of truth.

Fail if the rule is long enough that an individual sentence cannot be reviewed comfortably.

## Pass Result

Use `behavior-rule-pass` only when the artifact passes this eval and `ACCESSIBILITY-EVAL.md`.

Name the next allowed layer.

## Fail Result

Use `behavior-rule-fail` when the artifact is missing required input, violates the layer boundary, or cannot guide the next layer.

Name the smallest correction needed.
