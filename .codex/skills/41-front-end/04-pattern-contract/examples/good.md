# Good PatternContractArtifact Example

This example is intentionally small. It shows a pattern that composes one
accepted primitive without pretending to be a component seam.

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `text-overflow-disclosure` |
| Pattern name | `index-nav-label` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/index-nav-label/IndexNavLabel-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/index-nav-label/IndexNavLabel-Proof.md` |

## Why This Passes

The pattern composes the accepted `truncating-label` primitive for one
navigation-label role. It does not redefine tooltip behavior, ARIA, focus,
keyboard behavior, or token values. It names later component work as a
downstream dependency instead of defining props or app imports.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `none` |
| Rendered view status | `not-created-for-docs-only` |
| If unavailable | This example records the contract shape only; no pattern proof route exists. |
