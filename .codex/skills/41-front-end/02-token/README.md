# Token Layer

Status: active.

Active harness files:

- `SKILL.md`
- `TEMPLATE.md`
- `EVAL.md`
- `ACCESSIBILITY-EVAL.md`
- `examples/good.md`
- `examples/bad.md`

## What It Is For

The token layer defines approved visual, spacing, typography, color, surface, focus, or layout decisions.

Tokens have two scopes:

- shared token contracts: roles, fields, and consumer rules every design system must preserve
- system token implementations: concrete values, routes, runtime seams, and proof for one design system

Tokens are primitive visual facts that downstream primitives, patterns, and components consume.

Tokens must stay boring, reusable, and free of product-specific workflow meaning.

## Input

The input is a signed or accepted behavior rule and evidence that the requested downstream work cannot be satisfied with existing tokens.

The layer also needs evidence that an existing signed token does not already cover the decision.

## Output

The output is a token definition, token naming rule, allowed usage scope, shared contract, system implementation, and any required examples for visual review.

The output should make clear which consumers may use the token and which local overrides are forbidden.

Each system implementation output that defines concrete values, proof-route
data, or a governed runtime seam must include a deterministic
`tokenDefinitionV1` JSON block that can feed a page under
`/design-system/<system-key>/tokens/` through reusable contract, system proof
module, and renderer seams.

Shared token contracts do not need that JSON block unless they are intentionally
combined with a system implementation, which should be avoided by default.

## Evaluation For 99% No-Rework Confidence

Check that the token is not a disguised component or pattern.

Check that it does not duplicate or rename an existing approved token decision.

Check that the token has a stable name, clear scope, and visible review case.

Check that it works across required themes, direction, density, and magnification expectations.

Check that downstream consumers can import or reference it without copying route-local CSS.
