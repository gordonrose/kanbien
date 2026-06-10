# Index Nav List Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Pattern | `index-nav-list` |
| System key | `default` |
| Status | `review-ready` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/index-nav-list/IndexNavList-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-list/index.mjs#indexNavListPattern` |
| Rendered proof | `/design-system/default/patterns/index-nav-list` |

## Proof Scope

The proof composes multiple `index-nav-item` patterns and exposes controls for
theme, current item, disabled item posture, item count, and constrained width.
Those controls exercise signed upstream variants or accessibility-sensitive
composition behavior.

The proof also reserves the `focus-ring` containment inset around the list
items so keyboard focus shells remain visible inside panel and scroll hosts.
