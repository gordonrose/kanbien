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

Tokens are primitive visual facts that downstream primitives, patterns, and components consume.

Tokens must stay boring, reusable, and free of product-specific workflow meaning.

## Input

The input is a signed or accepted behavior rule and evidence that the requested downstream work cannot be satisfied with existing tokens.

The layer also needs evidence that an existing signed token does not already cover the decision.

## Output

The output is a token definition, token naming rule, allowed usage scope, and any required examples for visual review.

The output should make clear which consumers may use the token and which local overrides are forbidden.

Each output must include a deterministic `tokenDefinitionV1` JSON block that can
feed a page under `/design-system/<system-key>/tokens/` through reusable
contract, system-token, and renderer seams.

## Evaluation For 99% No-Rework Confidence

Check that the token is not a disguised component or pattern.

Check that it does not duplicate or rename an existing approved token decision.

Check that the token has a stable name, clear scope, and visible review case.

Check that it works across required themes, direction, density, and magnification expectations.

Check that downstream consumers can import or reference it without copying route-local CSS.
